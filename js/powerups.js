var powerups={

	multiball : function(){
		spawnBall(turn);
		alert("Multiball!");
		turn = !turn;
	},

	wall : function(lastHit){
		if(lastHit == "player") {
			for (var i = 0; i < 60; i++) {
				if(isEmpty(200, i)) {
					createBlock(200, i * 10, "block");
				}
			}
		}else {
			for (var i = 0; i < 60; i++) {
				if(isEmpty(600, i)) {
					createBlock(600, i * 10, "block");
				}
			}
		}
		alert("WALL!");
	}

}

function isEmpty(x, y){
    for(var i=0; i<blocks.children.length; i++){
        if(blocks.children[i].x == x && blocks.children[i].y == y){
           return false;
        }else {
        	return true;
        }
    }   
}