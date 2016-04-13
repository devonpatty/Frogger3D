var canvas;
var gl;
var g_2dcanvas = document.getElementById("2dcanvas");
var g_2dCtx = g_2dcanvas.getContext("2d");

//-------Colors----------
var BLUE = vec4(0.137255, 0.419608, 0.556863, 1.0);
var SEACOLOR = vec4(0.196078, 0.6, 0.8, 1.0);
var RED = vec4(1.0, 0.0, 0.0, 1.0);
var ORCHID = vec4(0.858824, 0.439216, 0.858824, 1.0);
var GREEN = vec4(0.137255, 0.556863, 0.137255, 1.0);
var GRASSCOLOR = vec4(0.576471, 0.858824, 0.439216, 1.0);
var GRAY = vec4(0.4, 0.4, 0.4, 1.0);
var YELLOW = vec4(1.0, 1.0, 0.3, 1.0);
var BROWN = vec4(0.65, 0.5, 0.39, 1.0);
var BLACK = vec4(0.2, 0.2, 0.2, 1.0);
//-------------------------

var numCubeVertices  = 36;

//-----------variables for moving car------------
var carDirection = 0.0;
var carXPos = 100.0;
var carYPos = 0.0;
var height = 0.0;
var turn = 0.0;
//----------------------------

//---------View-----------
var view = 1
var moveX = 1.0;
var moveY = 1.0;
//------------------------

//---------Testing purpose------------
var userXPos = 30.0;
var userYPos = -90.0;
var userZPos = 30.0;
var userIncr = 2.0;                // Size of forward/backward step
var userAngle = 90.0;              // Direction of the user in degrees
var userXDir = 0.0;                // X-coordinate of heading
var userYDir = 1.0;                // Y-coordinate of heading
var userZDir = 0.0;
//------------------------------------

var _cars = [];
var _logs = [];
var _frog = [];
var _insects = [];
var _generator = [];

var keys = [];
var tileSize = 1.0;

var colorLoc;
var mvLoc;
var pLoc;
var proj;

var cubeBuffer;
var carNormalsBuffer;
var carBuffer;
var trackBuffer;
var vPosition;

// the 36 vertices of the cube
var cVertices = [
    // front side:
    vec3( -0.5,  0.5,  0.5 ), vec3( -0.5, -0.5,  0.5 ), vec3(  0.5, -0.5,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ), vec3(  0.5,  0.5,  0.5 ), vec3( -0.5,  0.5,  0.5 ),
    // right side:
    vec3(  0.5,  0.5,  0.5 ), vec3(  0.5, -0.5,  0.5 ), vec3(  0.5, -0.5, -0.5 ),
    vec3(  0.5, -0.5, -0.5 ), vec3(  0.5,  0.5, -0.5 ), vec3(  0.5,  0.5,  0.5 ),
    // bottom side:
    vec3(  0.5, -0.5,  0.5 ), vec3( -0.5, -0.5,  0.5 ), vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5, -0.5, -0.5 ), vec3(  0.5, -0.5, -0.5 ), vec3(  0.5, -0.5,  0.5 ),
    // top side:
    vec3(  0.5,  0.5, -0.5 ), vec3( -0.5,  0.5, -0.5 ), vec3( -0.5,  0.5,  0.5 ),
    vec3( -0.5,  0.5,  0.5 ), vec3(  0.5,  0.5,  0.5 ), vec3(  0.5,  0.5, -0.5 ),
    // back side:
    vec3( -0.5, -0.5, -0.5 ), vec3( -0.5,  0.5, -0.5 ), vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ), vec3(  0.5, -0.5, -0.5 ), vec3( -0.5, -0.5, -0.5 ),
    // left side:
    vec3( -0.5,  0.5, -0.5 ), vec3( -0.5, -0.5, -0.5 ), vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5,  0.5 ), vec3( -0.5,  0.5,  0.5 ), vec3( -0.5,  0.5, -0.5 )
];

function initializeStart() {
	this.lives = 3;
	this.level = 1;
	this.totalScore = 0;
	this.time = 30000;
	this.startTime = new Date().getTime();
};

function toNextLevel() {
	this.level++;
	this.totalScore += this._frog[0].getScore();
	this.time = 30000 - 500*this.level;
	this.startTime = new Date().getTime();
	won = true;
	message = Math.floor(Math.random()*wonMessage.length);
};

function getLevel() {
	return this.level;
};

function loseLife() {
	if(this.lives > 1) {
		this.lives--;
		this.time = 30000;
		this.startTime = new Date().getTime();
	} else {
		initializeStart();
	}
};

function collideWithInsect(cx, cy) {
	var pos = levels.toRC(cx, cy);
	var bugs = this._insects;
	for(var i = 0; i < bugs.length; i++) {
		var bugPosition = bugs[i].getPosition();
		if(bugPosition.row == pos.row && bugPosition.col == pos.col) {
			bugs.splice(i, 1);
			this._frog[0].setScore(3);
		}
	}
};

function generateInsect(descr) {
	this._insects.push(new Insect(descr));
};

function generateCar(descr) {
	this._cars.push(new Car(descr));
};

function generateLog(descr) {
	this._logs.push(new Log(descr));
};

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(  0.89, 0.47, 0.2, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
	/*
	var PR = PlyReader();
	var car = PR.read("lexus_hs.ply");

	var carVertices = car.points;
	var carNormals = car.normals;
	*/
	this.initializeStart();
	
	this._generator.push(new GenerateEntity);
	//this._cars.push(new Car({x: 0.0, y: 0.0, vel: 0, size: 3}));
	this._frog.push( new Frog(5, 0, 0.0) );
	this._categories = [this._generator, this._cars, this._logs, this._insects, this._frog];

	
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    /*
	carNormalsBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, carNormalsBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(carNormalsBuffer), gl.STATIC_DRAW);
	*/
    //createTrack();
    /*
    // VBO for the track
    trackBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, trackBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(), gl.STATIC_DRAW );
*/
    // VBO for the cube
    cubeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cVertices), gl.STATIC_DRAW );
	/*
	// VBO for PLY the car
	carBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, carBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(carVertices), gl.DYNAMIC_DRAW );
	*/
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );
    
    mvLoc = gl.getUniformLocation( program, "modelview" );

    // set projection
    pLoc = gl.getUniformLocation( program, "projection" );
    proj = perspective( 70.0, 1.0, 1.0, 500.0 );
    gl.uniformMatrix4fv(pLoc, false, flatten(proj));

    window.addEventListener("keydown", function(e){
        keys[e.keyCode] = true;
	} );
	
	window.addEventListener("keyup", function(e) {
		keys[e.keyCode] = false;
	} );
	
    update();
}

function update() {
	for(var i = 0; i < this._categories.length; i++) {
		var category = this._categories[i];
		for(var j = 0; j < category.length; j++) {
			var status = category[j].update();
			if(status == -1) {
				category.splice(j, 1);
				j--;
			}
		}
	}	
	var currentTime = new Date().getTime();
	this.time -= currentTime - this.startTime;
	this.startTime = currentTime;
	
	if(won) {
		if(wonCount > 0) {
			wonCount--;
		} else {
			wonCount = 80;
			won = false;
		}
	}
	
	if(this.time < 0) {
		this._frog[0].die();
	}
	render(g_2dCtx);
}

var counter = 0;
var message = 0;
var won = false;
var wonCount = 80;
var wonMessage = ["Good Job!", "You are a PRO!!!", "Just do it!!", "Ninja Frooog!", "Is it even worth it?", "Well done", "Like a boss", "You like it rough?"];

function render(ctx)
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	
	
	var mv = mat4();

	mv = lookAt( vec3(levels.getLength()/2, -5.0+this._frog[0].y, 15.0), vec3(levels.getLength()/2, this._frog[0].y, 0.0), vec3(0.0, 0.0, 1.0) );
	for(var i = 0; i < this._categories.length; i++) {
		var category = this._categories[i];
		for(var j = 0; j < category.length; j++) {
			category[j].draw( mv );
		}
	}
	
	for(var j = 0; j < levels[1].array.length; j++){
			var mv1 = mult( mv, translate( levels.getLength()/2, tileSize*j+tileSize/2, -2.0 ) );
			var color = levels[1].lanes[j].type;
			switch(color) {
				case "water":
					gl.uniform4fv( colorLoc, SEACOLOR );
					break;
				case "road":
					gl.uniform4fv( colorLoc, BLACK );
					break;
				case "grass":
					gl.uniform4fv( colorLoc, GRASSCOLOR );
					break;
			}
			
			gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
			gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

			mv1 = mult( mv1, scalem( levels.getLength(), tileSize, 0.0 ) );
			mv1 = mult( mv1, translate( 0.0, 0.0, 0.5 ) );

			gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
			gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
	}
	
	
	if(counter % 200 == 0) {
		this._logs.length
		for(var i = 0; i < levels[1].array.length; i++) {
			//if(i == 7){
				//console.log(i + "  " + levels[1].array[i].toString())
			
			
		}
	}
	counter++;

	ctx.clearRect(0, 0, 600, 600);
	
	ctx.fillStyle = "Black";
	ctx.fillRect(0, 550, 600, 50);
	ctx.fillStyle = "White";
	ctx.font = "25px Arial";
	ctx.fillText("Lives: " + this.lives, 10, 585);

	ctx.fillText("Time: ", 150, 35);
	
	ctx.fillRect(220, 18, 200*(this.time/(30000 - 500*this.level)), 20);
	
	ctx.fillText("Level: " + this.level, 240, 585);

	var getScore = this.totalScore + this._frog[0].getScore();
	ctx.fillText("Score: " + getScore, 480, 585);

	if(won) {
		ctx.fillText(wonMessage[message], 200, 500);
	}
	
    requestAnimFrame( update );
}