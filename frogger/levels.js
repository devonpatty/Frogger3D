var levels = {
	1: {
		array: [
			[0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1],
			[0,0,0,0,0,0,0,0,0,0,0]
		],
		
		// type = "grass", "road", "water"
		// direction = "left", "right", "neutral"
		// speed = double
		// next = int
		lanes: [
			{type: "grass", direction: "neutral", speed: 0.0, next: 0},
			{type: "grass", direction: "neutral", speed: 0.0, next: 0},
			{type: "road", direction: "right", speed: 0.09, next: 0},
			{type: "road", direction: "right", speed: 0.1, next: 0},
			{type: "road", direction: "left", speed: -0.1, next: 0},
			{type: "road", direction: "left", speed: -0.09, next: 0},
			{type: "grass", direction: "right", speed: 0.0, next: 0},
			{type: "water", direction: "left", speed: -0.09, next: 0},
			{type: "water", direction: "right", speed: 0.11, next: 0},			
			{type: "water", direction: "left", speed: -0.08, next: 0},
			{type: "water", direction: "right", speed: 0.1, next: 0},
			{type: "grass", direction: "neutral", speed: 0.0, next: 0}
		]
	},
	
	register: function(cx, cy, size) {
		var pos = this.toRC(cx, cy);
		for(var i = 0; i < size; i++) {
			if(pos.col+i < this[1].array[pos.row].length) {
				if(this[1].array[pos.row][pos.col+i] == 0) {
					this[1].array[pos.row][pos.col+i] = 1;
				} else {
					this[1].array[pos.row][pos.col+i] = 0;
				}
			}
		}
	},
	
	unregister: function(cx, cy, size) {
		var pos = this.toRC(cx, cy);
		for(var i = 0; i < size; i++) {
			if(pos.col+i < this[1].array[pos.row].length) {
				if(this[1].array[pos.row][pos.col+i] == 1) {
					this[1].array[pos.row][pos.col+i] = 0;
				} else {
					this[1].array[pos.row][pos.col+i] = 1;
				}
			}
		}
	},
	
	inArray: function(cx, cy, size) {
		var pos = this.toRC(cx, cy);
		for(var i = 0; i < size; i++) {
			if( pos.row >= 0 && pos.row < this[1].array.length
			&& pos.col+i >= 0 && pos.col+i < this[1].array[pos.row].length) {				
				return true;
			}
		}
		return false;
	},

	collision: function(cx, cy){
		var pos = this.toRC(cx, cy); 
		if( this[1].array[pos.row][pos.col] == 1 ){
			return true;
		}else {
			return false;
		}
	},
	
	toRC: function(x, y) {
		var posX = x + (this[1].array[0].length*tileSize)/2;
		var posY = y;
		var row = Math.floor(posY/tileSize);
		var col = Math.floor(posX/tileSize);
		return {
			row: row,
			col: col
		};
	},
	
	getLane: function(cx, cy) {
		var pos = this.toRC(cx, cy);
		return this[1].lanes[pos.row];
	},

	getLength: function() {
		return this[1].array[0].length*tileSize - (this[1].array[0].length*tileSize)/2;
	},

	getHeight: function() {
		return this[1].array.length*tileSize - tileSize;
	}
};