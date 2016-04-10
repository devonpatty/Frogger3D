// draw Insect as two blue cubes
function Insect(descr) {
	this.x = descr.x;
	this.y = descr.y;
	this.vel = 0.06;
	this.size = 1;
};

Insect.prototype.update = function() {
	this.x -= this.vel;
	if(!levels.inArray(this.x, this.y, this.size)) {
		return -1;
	}
};

Insect.prototype.getPosition = function() {
	return levels.toRC(this.x, this.y);
};

Insect.prototype.draw = function( mv ) {

	mv = mult( mv, translate( this.x, this.y, 0.0 ) );
    
	// set color to red
    gl.uniform4fv( colorLoc, RED );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    // lower body of the Insect
    mv = mult( mv, scalem( 1.0, 1.0, 1.0 ) );
    mv = mult( mv, translate( 0.0, 0.0, 0.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

};
