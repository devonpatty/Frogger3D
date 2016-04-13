function Frog(x, y, z) {
	this.x = x*tileSize + tileSize/2;
	this.initialX = this.x;
	this.y = y*tileSize + tileSize/2;
	this.initialY = this.y;
	this.nextY = this.y;
	this.z = z;
	this.nextZ = this.z;
	this.vel = 0.1;
	this.hopping = false;
	this.currentScore = 0;
};

Frog.prototype.update = function() {
	//console.log(this.delay)
	if(this.hopping) {
		if(this.y > this.nextY) {
			this.y -= this.vel;
		}
		if(this.y < this.nextY) {
			this.y += this.vel;
		}
		if(Math.abs(this.y - this.nextY) < this.vel) {
			this.y = this.nextY;
			this.hopping = false;
		}
	} else {
		if(keys[37]) { // left arrow
			if(this.x - this.vel > 0) this.x -= this.vel;
		} else if(keys[39]) { // right arrow
			if(this.x + this.vel < levels.getLength()) this.x += this.vel;
		}
		
		if(keys[38]) { // up arrow
			this.hopping = true;
			if(this.y + tileSize < levels.getHeight()) {
				this.nextY = this.y + tileSize;			
				this.currentScore += 1;
			} 	
		} else if(keys[40]) { // down arrow
			this.hopping = true;
			if(this.y - tileSize > 0) {
				this.nextY = this.y - tileSize;			
				this.currentScore -= 1;
			}
		}
	}

	var lane = levels.getLane(this.x, this.y);
	if( lane.type == "water" ) {
		this.x -= lane.speed * (1+getLevel()/10);
	}
	
	collideWithInsect(this.x, this.y);

	if(levels.collision(this.x, this.y) || this.x > levels.getLength()+1.0 || this.x < -1.0){
		this.die();
	}

	if(levels.getHeight() <= this.y+tileSize/2) {
		this.x = this.initialX;
		this.y = this.initialY;
		this.nextY = this.y;
		this.hopping = false;
		toNextLevel();
		this.currentScore = 0;
	}
	//console.log(levels.getHeight(), this.y)
};

Frog.prototype.die = function() {
	this.x = this.initialX;
	this.y = this.initialY;
	this.nextY = this.y;
	this.hopping = false;
	this.currentScore = 0;
	loseLife();
};

Frog.prototype.getScore = function() {
	return this.currentScore;
};

Frog.prototype.setScore = function(x) {
	return this.currentScore += x;
};

Frog.prototype.draw = function( mv ) {
	
	mv = mult( mv, translate( this.x, this.y, -2.0 ) );	
	
	// set color to green
    gl.uniform4fv( colorLoc, GREEN );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    // the frog
    mv = mult( mv, scalem( 1.0, 1.0, 1.0 ) );
    mv = mult( mv, translate( 0.0, 0.0, 0.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

};