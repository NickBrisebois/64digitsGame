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
document.body.appendChild( stats.domElement );


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
}


function create() {
	//Create everything
	line = new Phaser.Line(game.world.centerX, 0, game.world.centerX, 600);
	paddles = game.add.group();
	ballsGroup = game.add.group();
	blocks = game.add.group();
	player = paddles.create(90, 30, 'paddle');
	player.name = "player";
	opponent = paddles.create(700, 30, 'paddle');
	opponent.name = "opponent";
	balls.push(new ball(game.world.centerX, 300));
	balls.push(new ball(game.world.centerX, 330));
	game.physics.enable(player, Phaser.Physics.ARCADE);
	game.physics.enable(opponent, Phaser.Physics.ARCADE);

	player.body.collideWorldBounds = true;
	opponent.body.collideWorldBounds = true;

	player.body.immovable = true;
	opponent.body.immovable = true;

	player.body.bounce.setTo(1, 1);
	opponent.body.bounce.setTo(1, 1);

	game.input.keyboard.addKeyCapture([Phaser.Keyboard.W, Phaser.Keyboard.S, Phaser.Keyboard.SPACEBAR]);

	for (var i = 0; i < 60; i++) {
		for (var ii = 0; ii < 4; ii++) {
			powerChance = Math.random();
			if(powerChance > 0.1) {
				createBlock(ii * 10, i * 10, "block");
				createBlock((ii * 10) + 760, i * 10, "block");
			}else if(powerChance > 0.05){
				createBlock(ii * 10, i * 10, "multiblock");
				createBlock((ii * 10) + 760, i * 10, "multiblock");
			}else{
				createBlock(ii * 10, i * 10, "wallblock");
				createBlock((ii * 10) + 760, i * 10, "wallblock");
			}
		}
	}

	scoreLeft = game.add.text(game.world.centerX - 65, 0, "0", {
			font : "65px Arial",
			fill : "#ffffff"
		});
	scoreRight = game.add.text(game.world.centerX + 30, 0, "0", {
			font : "65px Arial",
			fill : "#ffffff"
		});
	begin = game.add.text(game.world.centerX / 2.5, game.world.centerY, "Spacebar To Start", {
			font : "65px Arial",
			fill : "#ffffff",
			align : "center"
		});
}


function update() {

	//Fps meter stats begin
	stats.begin();

	//Update everything
	game.physics.arcade.collide(paddles, ballsGroup, ballCollision, null, this);
	game.physics.arcade.collide(ballsGroup, blocks, ballCollision, null, this);

	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !gameStarted) {
		gameStart();
	}else {
		if (game.input.keyboard.isDown(Phaser.Keyboard.S) && player.body.velocity.y < 200) {

			player.body.y += 10;
		} else if (game.input.keyboard.isDown(Phaser.Keyboard.W) && player.body.velocity.y > -200) {
			player.body.y -= 10;
		}

		for (var i = 0; i < balls.length; i++) {
			balls[i].update();
		}
	}
	
	//End FPS stats
	stats.end();

}

function alert(text) {
	//Alert text
	if(ruleChangeAlert != undefined) {
		game.time.events.remove(increase);
		game.time.events.remove(remove);
		ruleChangeAlert.destroy();
	}


	ruleChangeAlert = game.add.text(game.world.centerX - text.length*12, game.world.centerY-200, text, {
			font : "1px Arial",
			fill : "#000",
			align : "center"
	});

	increase = game.time.events.repeat(Phaser.Timer.SECOND*0.001, 4, function() {
		if(ruleChangeAlert!=null){
			ruleChangeAlert.align = "center";
			ruleChangeAlert.fill = "#FFF";
			ruleChangeAlert.fontSize += 4;
		}
	}, this)

	remove = game.time.events.add(Phaser.Timer.SECOND * 3, function(){ruleChangeAlert.destroy(true)}, this);
	
}


function score(side, ballObj) {

	ballObj.ball.kill();

	var index = balls.indexOf(ballObj);
	if (index > -1) {
		balls.splice(index, 1);
	}
	if (side) {
		scoreRight.text++;
	} else {
		scoreLeft.text++;
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
				this.ball.body.velocity.setTo(-400, game.rnd.integerInRange(-150, 150))
			}, this);

		} else {
			game.time.events.add(Phaser.Timer.SECOND * 2, function () {
				this.ball.body.velocity.setTo(400, game.rnd.integerInRange(-150, 150))
			}, this); ;
		}
		return this;
	}
	this.update = function () {
		if (this.ball.x >= 785) {
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


function createBlock(x, y, name) {
	this.block = blocks.create(x, y, name);
	this.block.name = name;
	game.physics.enable(this.block, Phaser.Physics.ARCADE);
	this.block.body.immovable = true;
}


function ballCollision(obj1, obj2) {

	//Paddle hit
	if(obj1.name == "player") {
		obj2.lastHit = "player";
	}else if(obj1.name == "opponent"){
		obj2.lastHit = "opponent";
	}

	//Powerups
	if (obj2.name == "block") {
		obj2.kill();
	}else if(obj2.name == "multiblock"){
		powerups.multiball();
		obj2.kill();
	}else if(obj2.name == "wallblock") {
		powerups.wall(obj1.lastHit);
		obj2.kill();
	}

}


function launch() {
	if (!gameStarted) {
		for (var i = 0; i < balls.length; i++) {
			balls[i].autoLaunch(true);
			alert("Start");
		}
		gameStarted = true;
	}
}
