function Log(descr) {
	this.x = descr.x;
	this.y = descr.y + tileSize/2;
	this.vel = descr.vel * (1+getLevel()/10);
	this.size = descr.size;
	this.inGame = false;
};

Log.prototype.update = function() {
	levels.unregister(this.x-(this.size*tileSize)/2, this.x+(this.size*tileSize)/2, this.y, 1);
	
	this.x -= this.vel;
	if(!levels.inArray(this.x+(this.size*tileSize)/2, this.x-(this.size*tileSize)/2, this.y)) {
		if(this.inGame)
			return -1;
	} else {
		this.inGame = true;
	}

	levels.register(this.x-(this.size*tileSize)/2, this.x+(this.size*tileSize)/2, this.y, 0);
};

Log.prototype.draw = function( mv ) {
	
	mv = mult( mv, translate( this.x, this.y, -1.0 ) );
    
	// set color to brown
    gl.uniform4fv( colorLoc, BROWN );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    // the log
    mv = mult( mv, scalem( this.size*tileSize-(0.5*tileSize), 1.0, 0.5 ) );
    mv = mult( mv, translate( 0.0, 0.0, -2.0 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
}