var canvas;
var gl;

//-------Colors----------
var BLUE = vec4(0.0, 0.0, 1.0, 1.0);
var RED = vec4(1.0, 0.0, 0.0, 1.0);
var GRAY = vec4(0.4, 0.4, 0.4, 1.0);
var YELLOW = vec4(1.0, 1.0, 0.0, 1.0);
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
var userXPos = 0.0;
var userYPos = -120.0;
var userIncr = 2.0;                // Size of forward/backward step
var userAngle = 90.0;              // Direction of the user in degrees
var userXDir = 0.0;                // X-coordinate of heading
var userYDir = 1.0;                // Y-coordinate of heading
//------------------------------------

var colorLoc;
var mvLoc;
var pLoc;
var proj;

var cubeBuffer;
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

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.7, 1.0, 0.7, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
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


    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );
    
    mvLoc = gl.getUniformLocation( program, "modelview" );

    // set projection
    pLoc = gl.getUniformLocation( program, "projection" );
    proj = perspective( 50.0, 1.0, 1.0, 500.0 );
    gl.uniformMatrix4fv(pLoc, false, flatten(proj));

    window.addEventListener("keydown", function(e){
        switch( e.keyCode ) {
			case 49:
				view = 1;
				break;
			case 50:
				view = 0;
				break;
			case 87:	// w key
				moveX -= 0.5;
				break;
			case 65:	// a key
				moveY -= 0.5;
				break;
			case 83:	// s key
				moveX += 0.5;
				break;
			case 68:	// d key
				moveY += 0.5;
				break;			
			case 37:    // left arrow
                userAngle += 3.0;
                userXDir = Math.cos( radians(userAngle) );
                userYDir = Math.sin( radians(userAngle) );
                break;
            case 38:    // up arrow
                userXPos += userIncr * userXDir;
                userYPos += userIncr * userYDir;
                break;
            case 39:    // right arrow
                userAngle -= 3.0;
                userXDir = Math.cos( radians(userAngle) );
                userYDir = Math.sin( radians(userAngle) );
                break;
            case 40:    // down arrow
                userXPos -= userIncr * userXDir;
                userYPos -= userIncr * userYDir;
                break;
		}
	} );
	
    render();
}

// draw car as two blue cubes
function drawCar( mv ) {

    // set color to blue
    gl.uniform4fv( colorLoc, BLUE );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    var mv1 = mv;
    // lower body of the car
    mv = mult( mv, scalem( 10.0, 3.0, 2.0 ) );
    mv = mult( mv, translate( 0.0, 0.0, 0.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    // upper part of the car
    mv1 = mult( mv1, scalem( 4.0, 3.0, 2.0 ) );
    mv1 = mult( mv1, translate( -0.2, 0.0, 1.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
}
    
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var mv = mat4();
	
	switch( view ) {
		case 1:
			mv = lookAt( vec3(50.0+moveX, 20.0+moveY, 0.0), vec3(0.0+moveX, 0.0+moveY, 0.0), vec3(0.0, 0.0, 1.0) );
			mv = mult( mv, translate( 0.0, 0.0, 0.0 ) );
			drawCar( mv );
			break;
		case 0:
			case 0:
			// From the ground, walking around
			mv = lookAt( vec3(userXPos, userYPos, 5.0), vec3(userXPos+userXDir, userYPos+userYDir, 5.0), vec3(0.0, 0.0, 1.0 ) );
			mv = mult( mv, translate( 0.0, 0.0, 0.0 ) );
			drawCar( mv );
			break;
	}
    requestAnimFrame( render );
}