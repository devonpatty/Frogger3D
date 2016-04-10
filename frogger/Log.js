function Log(descr) {
	this.x = descr.x;
	this.y = descr.y;
	this.vel = descr.vel;
	this.size = 3;
};

Log.prototype.update = function() {
	levels.unregister(this.x, this.y, this.size);
	
	this.x -= this.vel;
	if(!levels.inArray(this.x, this.y, this.size)) {
		return -1;
	}

	levels.register(this.x, this.y, this.size);
};

Log.prototype.draw = function( mv ) {
	
	mv = mult( mv, translate( this.x+tileSize, this.y, 0.0 ) );
    
	// set color to brown
    gl.uniform4fv( colorLoc, BROWN );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    // the log
    mv = mult( mv, scalem( 10.0, 3.0, 2.0 ) );
    mv = mult( mv, translate( 0.0, 0.0, -2.0 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
}