var powerups={

	multiball : function(){
		spawnBall(turn);
		alert("New Ball!");
		turn = !turn;
	},

	wall : function(lastHit){
		if(lastHit == "player") {
			for (var i = 0; i < 60; i++) {
				if(isEmpty(200, i*10)) {
					createBlock(200, i * 10, "block");
				}
			}
		}else {
			for (var i = 0; i < 60; i++) {
				if(isEmpty(600, i*10)) {
					createBlock(600, i * 10, "block");
				}
			}
		}
		alert("WALL!");
	},

	paddleShrink : function(lastHit){
		alert("Smaller Paddle!");

		if(lastHit == "player") {
			player.scale.y = 0.5;
		}else {
			opponent.scale.y = 0.5;
		}

		game.time.events.add(Phaser.Timer.SECOND * 10, function(){
			alert("Paddle size restored!");
			if(lastHit == "player") {
				player.scale.y = 1;
			}else {
				opponent.scale.y = 1;
			}
		}, this);
	},

	paddleGrow : function(lastHit) {
		alert("Bigger Paddle!");

		if(lastHit == "player") {
			player.scale.y = 2;
		}else {
			opponent.scale.y = 2;
		}

		game.time.events.add(Phaser.Timer.SECOND * 10, function() {
			alert("Paddle size restored!");
			if(lastHit == "player") {
				player.scale.y = 1;
			}else {
				opponent.scale.y = 1;
			}
		}, this);
	}



}


function isEmpty(x, y){
	//Checks if space already has a block so walls don't overlap each other
	this.x = x;
	this.y = y;
    for(var i=0; i<blocks.children.length; i++){
        if(blocks.children[i].x == this.x && blocks.children[i].y == this.y){
           return false;
        }
    }   
    return true;
}
