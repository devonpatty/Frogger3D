// draw car as two blue cubes
function Car(descr) {
	this.x = descr.x;
	this.y = descr.y;
	this.vel = descr.vel;
	this.size = 3;
};

Car.prototype.update = function() {
	levels.unregister(this.x, this.y, this.size);
	
	this.x -= this.vel;
	if(!levels.inArray(this.x, this.y, this.size)) {
		return -1;
	}
	levels.register(this.x, this.y, this.size);
};

Car.prototype.draw = function( mv ) {

	mv = mult( mv, translate( this.x+tileSize, this.y, 0.0 ) );
    
	// set color to blue
    gl.uniform4fv( colorLoc, BLUE );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, carBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    var mv1 = mv;
    // lower body of the car
    mv = mult( mv, scalem( 10.0, 3.0, 2.0 ) );
    mv = mult( mv, translate( 0.0, 0.0, 0.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    // upper part of the car
    mv1 = mult( mv1, scalem( 4.0, 3.0, 2.0 ) );
    mv1 = mult( mv1, translate( 0.0, 0.0, 1.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
};
