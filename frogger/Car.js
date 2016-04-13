// draw car as two blue cubes
function Car(descr) {
	this.x = descr.x;
	this.y = descr.y + tileSize/2;
	this.vel = descr.vel * (1+getLevel()/10);
	this.size = 3;
	this.inGame = false;
};

Car.prototype.update = function() {
	levels.unregister(this.x-(this.size*tileSize)/2, this.x+(this.size*tileSize)/2, this.y, 0);
	
	this.x -= this.vel;
	if(!levels.inArray(this.x+(this.size*tileSize)/2, this.x-(this.size*tileSize)/2, this.y) ) {
		if(this.inGame)
			return -1;
	} else {
		this.inGame = true;
	}

	
	levels.register(this.x-(this.size*tileSize)/2, this.x+(this.size*tileSize)/2, this.y, 1);
};



Car.prototype.draw = function( mv ) {

	mv = mult( mv, translate( this.x, this.y, -2.0 ) );
    
	// set color to blue
    gl.uniform4fv( colorLoc, YELLOW );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    var mv1 = mv;
    // lower body of the car
    mv = mult( mv, scalem( this.size*(tileSize+0.1), 1.0, 1.0 ) );
    mv = mult( mv, translate( 0.0, 0.0, 0.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    // upper part of the car
    mv1 = mult( mv1, scalem( this.size/4, 1.0, 0.8 ) );
    mv1 = mult( mv1, translate( 0.0, 0.0, 1.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
};
