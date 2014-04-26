var powerups = {

	multiball : function () {
		spawnBall(turn);
		alert("New Ball!");
		turn = !turn;
	},

	wall : function (lastHit) {
		if (lastHit == "player") {
			for (var i = 0; i < 60; i++) {
				if (isEmpty(200, i * 10)) {
					createBlock(200, i * 10, "block").name = "temp";
				}
			}
		} else {
			for (var i = 0; i < 60; i++) {
				if (isEmpty(600, i * 10)) {
					createBlock(600, i * 10, "block").name = "temp";
				}
			}
		}
		alert("WALL!");
	},

	smallWall : function (lastHit) {
		if (lastHit == "player") {
			for (var i = 0; i < 7; i++) {
				if (isEmpty(170, i* 10+player.y)) {
					createBlock(170, i* 10+player.y, "block").name = "temp";
				}
			}
		} else {
			for (var i = 0; i < 7; i++) {
				if (isEmpty(630, i* 10+opponent.y)) {
					createBlock(630, i* 10+opponent.y, "block").name = "temp";
				}
			}
		}
		alert("(small)WALL!");
	},
	horWall : function (lastHit) {

		for (var i = 0; i < 100; i++) {
			if (isEmpty(i * 10, game.world.centerY)) {
				createBlock(i * 10, game.world.centerY, "block").name = "temp";
			}
		}

		alert("(horizontal)WALL!");
	},
	centerWall : function (lastHit) {

		for (var i = 0; i < 60; i++) {
			if (isEmpty(game.world.centerX, i * 10)) {
				createBlock(game.world.centerX, i * 10, "block").name = "temp";
			}
		}

		alert("(center)WALL!");
	},
//	bigBall : function (lastHit) {

//		spawnBigBall(lastHit) 

//		alert("Big Ball!");
		
//		},

		paddleShrink : function (lastHit) {
			alert("Smaller Paddle!");

			if (lastHit == "player") {
				player.scale.y = 0.5;
			} else {
				opponent.scale.y = 0.5;
			}

			game.time.events.add(Phaser.Timer.SECOND * 10, function () {
				alert("Paddle size restored!");
				if (lastHit == "player") {
					player.scale.y = 1;
				} else {
					opponent.scale.y = 1;
				}
			}, this);
		},
		BGColor : function (lastHit) {
			alert("Colour Change!");

			game.stage.backgroundColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);;
		},
		paddleGrow : function (lastHit) {
			alert("Bigger Paddle!");

			if (lastHit == "player") {
				player.scale.y = 2;
			} else {
				opponent.scale.y = 2;
			}

			game.time.events.add(Phaser.Timer.SECOND * 10, function () {
				alert("Paddle size restored!");
				if (lastHit == "player") {
					player.scale.y = 1;
				} else {
					opponent.scale.y = 1;
				}
			}, this);
		}
	}

	function isEmpty(x, y) {
		//Checks if space already has a block so walls don't overlap each other
		this.x = x;
		this.y = y;
		for (var i = 0; i < blocks.children.length; i++) {
			if (blocks.children[i].x == this.x && blocks.children[i].y == this.y) {
				return false;
			}
		}
		return true;
	}
