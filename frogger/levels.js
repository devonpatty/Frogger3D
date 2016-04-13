var levels = {
	1: {
		array: [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],
		
		// type = "grass", "road", "water"
		// direction = "left", "right", "neutral"
		// speed = double
		// next = int
		lanes: [
			{type: "grass", direction: "neutral", speed: 0.0, next: 0},
			{type: "grass", direction: "neutral", speed: 0.0, next: 0},
			{type: "grass", direction: "neutral", speed: 0.0, next: 0},
			{type: "road", direction: "left", speed: -0.09, next: 0},
			{type: "road", direction: "right", speed: 0.1, next: 0},
			{type: "road", direction: "left", speed: -0.1, next: 0},
			{type: "road", direction: "right", speed: 0.09, next: 0},
			{type: "grass", direction: "right", speed: 0.0, next: 0},
			{type: "water", direction: "left", speed: -0.09, next: 0},
			{type: "water", direction: "right", speed: 0.11, next: 0},			
			{type: "water", direction: "left", speed: -0.08, next: 0},
			{type: "water", direction: "right", speed: 0.1, next: 0},
			{type: "grass", direction: "neutral", speed: 0.0, next: 0},
			{type: "road", direction: "right", speed: 0.1, next: 0},
			{type: "road", direction: "right", speed: 0.1, next: 0},
			{type: "road", direction: "right", speed: 0.1, next: 0},
			{type: "road", direction: "left", speed: -0.1, next: 0},
			{type: "road", direction: "left", speed: -0.1, next: 0},
			{type: "road", direction: "left", speed: -0.1, next: 0},
			{type: "grass", direction: "right", speed: 0.1, next: 0},
			{type: "grass", direction: "neutral", speed: 0.1, next: 0}
		]
	},
	
	register: function(sx, ex, y, res) {
		var sPos = this.toRC(sx, y);
		var ePos = this.toRC(ex, y);
		for(var i = sPos.col; i < ePos.col; i++) {
			if(i < this[1].array[sPos.row].length) {
				this[1].array[sPos.row][i] = res;
			}
		}
	},
	
	unregister: function(sx, ex, y, res) {
		var sPos = this.toRC(sx, y);
		var ePos = this.toRC(ex, y);
		for(var i = sPos.col; i < ePos.col; i++) {
			if(i < this[1].array[sPos.row].length) {
				this[1].array[sPos.row][i] = res;
			}
		}
	},
	
	inArray: function(sx, ex, y) {
		var sPos = this.toRC(sx, y);
		var ePos = this.toRC(ex, y);
		if( sPos.row >= 0 && ePos.row < this[1].array.length
		&& sPos.col >= 0 && ePos.col < this[1].array[ePos.row].length) {				
			return true;
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
		var row = Math.floor(y/tileSize);
		var col = Math.floor(x/tileSize);
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
		return this[1].array[0].length*tileSize;
	},

	getHeight: function() {
		return this[1].array.length*tileSize;
	}
};