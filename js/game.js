var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
		preload : preload,
		create : create,
		update : update
	});

var player, opponent, blocks;

var gameStarted = false;
var turn = true;
var balls = new Array();
var scoreLeft = 0;
var scoreRight = 0;
var line, score, begin, ruleChangeAlert;
var increase;
var remove;

//FPS stats
var stats = new Stats();
stats.setMode(1);
document.body.appendChild(stats.domElement);

function gameStart() {
	launch();
	begin.destroy(true);
}

function preload() {
	//Preload all images
	game.load.image('paddle', 'Images/paddle.png');
	game.load.image('ball', 'Images/ball.png');
	game.load.image('block', 'Images/block.png');
	game.load.image('multiblock', 'Images/multiblock.png');
	game.load.image('wallblock', 'Images/wall.png');
	game.load.image('scalePaddle', 'Images/scalePaddle.png');
}

function create() {
	//Create everything
	paddles = game.add.group();
	ballsGroup = game.add.group();
	blocks = game.add.group();
	player = paddles.create(90, 30, 'paddle');
	player.name = "player";
	opponent = paddles.create(700, 30, 'paddle');
	opponent.name = "opponent";
	
	game.physics.enable(player, Phaser.Physics.ARCADE);
	game.physics.enable(opponent, Phaser.Physics.ARCADE);

	player.body.collideWorldBounds = true;
	opponent.body.collideWorldBounds = true;

	player.body.immovable = true;
	opponent.body.immovable = true;

reset();

	scoreLeft = game.add.text(game.world.centerX - 65, 0, "0", {
			font : "65px Arial",
			fill : "#ffffff"
		});
	scoreRight = game.add.text(game.world.centerX + 30, 0, "0", {
			font : "65px Arial",
			fill : "#ffffff"
		});
	begin = game.add.text(game.world.centerX - 150, game.world.centerY - 100, "Spacebar To Start \n Get to 10 Points to Win!", {
			font : "30px Arial",
			fill : "#ffffff",
			align : "center"
		});
}
function reset(){
gameStarted = false;
turn = true;
		for (var i = 0; i < balls.length; i++) {
			balls[i].ball.destroy();
		}
balls = new Array();


balls.push(new ball(game.world.centerX, 300));
for (var i = 0; i < 60; i++) {
		for (var ii = 0; ii < 4; ii++) {
			powerChance = Math.random();
			if (powerChance > 0.15) {
				createBlock(ii * 10, i * 10, "block");
				createBlock((ii * 10) + 760, i * 10, "block");
			} else if (powerChance > 0.1) {
				createBlock(ii * 10, i * 10, "multiblock");
				createBlock((ii * 10) + 760, i * 10, "multiblock");
			} else if (powerChance > 0.05) {
				createBlock(ii * 10, i * 10, "scalePaddle");
				createBlock((ii * 10) + 760, i * 10, "scalePaddle");
			} else {
				createBlock(ii * 10, i * 10, "wallblock");
				createBlock((ii * 10) + 760, i * 10, "wallblock");
			}
		}
	}
}
function update() {

	//Fps meter stats begin
	stats.begin();

	//Update everything
	if (gameStarted) {
		game.physics.arcade.collide(paddles, ballsGroup, ballCollision, null, this);
		game.physics.arcade.collide(ballsGroup, blocks, powerCollision, null, this);

		if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
			player.body.y += 15;
		} else if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
			player.body.y -= 15;
		}

		for (var i = 0; i < balls.length; i++) {
			balls[i].update();
		}

		if (scoreRight == 10 || scoreLeft == 10) {
			if (scoreRight > scoreLeft) {
				alert("You lose!");
				gameStarted = false;
			} else {
				alert("Congratulations! You win!");
				gameStarted = false;
			}
		}

		botAI();
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
		gameStart();
	}
	//End FPS stats
	stats.end();

}

function alert(text, perm) {
	//Alert text
	if (ruleChangeAlert != undefined) {
		game.time.events.remove(increase);
		game.time.events.remove(remove);
		ruleChangeAlert.destroy();
	}

	ruleChangeAlert = game.add.text(game.world.centerX - (text.length * 12), game.world.centerY - 200, text, {
			font : "1px Arial",
			fill : "#000",
			align : "center"
		});

	increase = game.time.events.repeat(Phaser.Timer.SECOND * 0.001, 4, function () {
			if (ruleChangeAlert != null) {
				ruleChangeAlert.align = "center";
				ruleChangeAlert.fill = "#FFF";
				ruleChangeAlert.fontSize += 4;
			}
		}, this)
if(!perm){
		remove = game.time.events.add(Phaser.Timer.SECOND * 3, function () {
			ruleChangeAlert.destroy(true)
		}, this);
}
}

function score(side, ballObj) {
if(ballObj!=null){
	ballObj.ball.destroy();
}
	var index = balls.indexOf(ballObj);

	if (index > -1) {
		balls.splice(index, 1);
	}

	if (side) {
		scoreRight.text++;
		if(scoreRight.text >=10){
		alert("Right is WIN!\nSpace To Restart", true);
		gameStarted=false;
		}
		console.log("test");
	} else {
		scoreLeft.text++;
				if(scoreLeft.text >=10){
		alert("Left is WON!\nSpace To Restart", true);
		gameStarted=false;
		}
	}

	if (balls.length == 0) {
		spawnBall(side);
	}
}

function ball(x, y) {
	this.ball = ballsGroup.create(x, y, 'ball');
	this.ball.name = "ball";
	this.ball.lastHit = "player";
	game.physics.enable(this.ball, Phaser.Physics.ARCADE);
	this.ball.body.collideWorldBounds = true;
	this.ball.body.bounce.setTo(1, 1);

	this.autoLaunch = function (side) {
	
		if (side) {
			game.time.events.add(Phaser.Timer.SECOND * 2, function () {
				this.ball.body.velocity.setTo(-500, game.rnd.integerInRange(-150, 150))
			}, this);

		} else {
			game.time.events.add(Phaser.Timer.SECOND * 2, function () {
				this.ball.body.velocity.setTo(500, game.rnd.integerInRange(-150, 150))
			}, this); ;
		}
		return this;
	}
	this.update = function () {
		if (this.ball.x >= 790) {
			alert("+1 point");
			score(false, this);
		} else if (this.ball.x <= 10) {
			alert("+1 point for opponent");
			score(true, this);
		}
	}
}

function spawnBall(side) {
	balls.push(new ball(game.world.centerX, game.world.centerY - 200 + game.rnd.integerInRange(0, 400)).autoLaunch(side));
}
function spawnBigBall(side) {
	balls.push(new ball(game.world.centerX, game.world.centerY - 200 + game.rnd.integerInRange(0, 400)).autoLaunch(side));
	balls[balls.length - 1].ball.scale.setTo(2, 2);
}

function createBlock(x, y, name) {
if(isEmpty(x,y)){
	this.block = blocks.create(x, y, name);
	this.block.name = name;
	game.physics.enable(this.block, Phaser.Physics.ARCADE);
	this.block.body.immovable = true;
	return this.block;
	}
}

function ballCollision(obj1, obj2) {

	//Paddle hit
	if (obj1.name == "player") {
		obj2.lastHit = "player";
	} else if (obj1.name == "opponent") {
		obj2.lastHit = "opponent";
	}
	obj2.body.velocity.setTo(obj2.body.velocity.x, obj2.body.velocity.y + game.rnd.integerInRange(-200, 200));

}

function powerCollision(obj1, obj2) {
	//Powerups
	if (obj2.name == "block") {
		obj2.destroy();
		var random = game.rnd.integerInRange(0, Object.keys(powerups).length-1);
		var count = 0;
		for (var key in powerups) {
		//console.log("called: "+count+" "+ powerups.length);
		if(count == random){
			powerups[key](obj1.lastHit);
			
			}
			count++;
		}
	} else if (obj2.name == "multiblock") {
		powerups.multiball();
		obj2.destroy();
	} else if (obj2.name == "wallblock") {
		powerups.wall(obj1.lastHit);
		obj2.destroy();
	} else if (obj2.name == "scalePaddle") {
		if (Math.random() > 0.50) {
			powerups.paddleGrow(obj1.lastHit);
		} else {
			powerups.paddleShrink(obj1.lastHit);
		}
		obj2.destroy();
	}else{
	obj2.destroy();
	}

}

function launch() {
	if (!gameStarted) {
	reset();
		for (var i = 0; i < balls.length; i++) {
			balls[i].autoLaunch(true);
			alert("Start");
		}
		
		gameStarted = true;
		
	}
}

function botAI() {

	closestBall = balls[0];

	for (var i = 0; i < balls.length; i++) {
		if (balls[i].ball.body.velocity.x > 0) {
			if ((balls[i].ball.x - opponent.x > closestBall.ball.x - opponent.x + (opponent.height / 2)) || (balls[i].ball.y - opponent.y > closestBall.ball.y - opponent.y + (opponent.height / 2))) {
				if (balls[i].ball.x < opponent.x) {
					closestBall = balls[i];
				}
			}
		}
	}

	opponent.body.y -= Math.floor(Math.cos(Math.atan2(opponent.body.x - closestBall.ball.body.x, opponent.body.y + (opponent.height / 2) - closestBall.ball.body.y)) * 10);

}
