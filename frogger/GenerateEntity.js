function GenerateEntity() {
	
};

GenerateEntity.prototype.update = function() {
	var lanes = levels[1].lanes;
	for(var i = 0; i < lanes.length; i++) {
		if(lanes[i].next == 0) {
			switch(lanes[i].type) {
				case "grass":
					var x = lanes[i].direction == "right" ? levels.getLength() : -levels.getLength();
					var y = i*tileSize;
					generateInsect({
						x: x,
						y: y
					});
					lanes[i].next = Math.floor(Math.random()*2000+1000);
					break;
				case "road":
					var x = lanes[i].direction == "right" ? levels.getLength() : -levels.getLength();
					var y = i*tileSize;
					generateCar({
						x: x,
						y: y,
						vel: lanes[i].speed
					});
					lanes[i].next = Math.floor(Math.random()*200 + 200);
					break;
				case "water":
					var x = lanes[i].direction == "right" ? levels.getLength() : -levels.getLength();
					var y = i*tileSize;
					generateLog({
						x: x,
						y: y,
						vel: lanes[i].speed
					});
					lanes[i].next = Math.floor(Math.random()*200 + 200);
					break;
			}	
		} else {
			lanes[i].next--;
		}
	}
};

GenerateEntity.prototype.draw = function( mv ) {

};