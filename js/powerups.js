var powerups={

	multiball : function(){
		spawnBall(turn);
		alert("Multiball!");
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
	}

}

function isEmpty(x, y){
	this.x = x;
	this.y = y;
    for(var i=0; i<blocks.children.length; i++){
        if(blocks.children[i].x == this.x && blocks.children[i].y == this.y){
           console.log("test");
           return false;
        }
    }   
    return true;
}