var powerups={

	multiball : function(){
		spawnBall(turn);
		alert("Multiball!");
		turn = !turn;
	},

	wall : function(lastHit){
		if(lastHit == "player") {
			for (var i = 0; i < 60; i++) {
				createBlock(200, i * 10, "block");
			}
		}else {
			for (var i = 0; i < 60; i++) {
				createBlock(600, i * 10, "block");
			}
		}
		alert("WALL!");
	}

}