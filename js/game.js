var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
		preload : preload,
		create : create,
		update : update,
		render : render
	});

var player, opponent, blocks;

var gameStarted = false;
var balls = new Array();
var scoreLeft = 0;
var line;
var score;
var scoreRight = 0;
var begin;

function preload() {
	game.load.image('paddle', 'Images/paddle.png');
	game.load.image('ball', 'Images/ball.png');
	game.load.image('block', 'Images/block.png');
}

function create() {
	line = new Phaser.Line(game.world.centerX, 0, game.world.centerX, 600);
	paddles = game.add.group();
	ballsGroup = game.add.group();
	blocks = game.add.group();
	player = paddles.create(90, 30, 'paddle');
	opponent = paddles.create(700, 30, 'paddle');
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
			createBlock(ii * 10, i * 10);
			createBlock((ii * 10) + 760, i * 10);
		}
	}

	game.physics.enable(blocks, Phaser.Physics.ARCADE);

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

function ball(x, y) {
	this.ball = ballsGroup.create(x, y, 'ball');

	this.ball.anchor.set(0.5);
	game.physics.enable(this.ball, Phaser.Physics.ARCADE);
	this.ball.body.collideWorldBounds = true;
	this.ball.body.bounce.setTo(1.01, 1.01);
	this.launch = function () {
		XVector =  - (game.input.x - this.ball.x);
		YVector =  - (game.input.y - this.ball.y);
		this.ball.body.velocity.setTo(XVector, YVector);
	}
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
			score(false, this);
		} else if (this.ball.x <= 10) {
			score(true, this);
		}

		if (500 > this.ball.body.velocity.x < -500) {
			if (500 > this.ball.body.velocity.y < -500) {
				/*
				===================
				SLOW DOWN THE BALLS HERE
				===================
				 */
			}
		}

	}
}

function createBlock(x, y) {
	this.block = blocks.create(x, y, 'block');
	this.block.name = "block";
	game.physics.enable(this.block, Phaser.Physics.ARCADE);
	this.block.body.immovable = true;
}
function gameStart() {
	launch();
	begin.destroy(true);
	game.time.events.loop(Phaser.Timer.SECOND * 5, ruleLoop, this);
}
var turn = true;
function ruleLoop() {
	spawnBall(turn);
	var ruleChangeAlert = game.add.text(game.world.centerX -120, game.world.centerY-200, "Multiball!", {
			font : "65px Arial",
			fill : "#ffffff",
			align : "center"
		});
		   game.time.events.add(Phaser.Timer.SECOND * 3, function(){ruleChangeAlert.destroy(true)}, this);


	turn = !turn;
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
function spawnBall(side) {
	balls.push(new ball(game.world.centerX, game.world.centerY - 200 + game.rnd.integerInRange(0, 400)).autoLaunch(side));
}
function launch() {
	if (!gameStarted) {
		for (var i = 0; i < balls.length; i++) {
			balls[i].autoLaunch(true);
		}
		gameStarted = true;
	}
}

function render() {

	game.debug.geom(line);

}
function update() {

	game.physics.arcade.collide(paddles, ballsGroup);
	game.physics.arcade.collide(ballsGroup, ballsGroup);
	game.physics.arcade.collide(ballsGroup, blocks, wallCollision, null, this);

	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !gameStarted) {
		gameStart();
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.S) && player.body.velocity.y < 200) {

		player.body.y += 10;
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.W) && player.body.velocity.y > -200) {
		player.body.y -= 10;
	}

	/*
	REPLACE FANCY MATH WITH BETTER ENEMY AI
	opponent.body.y -= Math.cos(Math.atan2(opponent.body.x - ball.body.x, opponent.body.y - ball.body.y)) * 3;
	 */

	for (var i = 0; i < balls.length; i++) {
		balls[i].update();
	}

}

function wallCollision(obj1, obj2) {
	if (obj2.name == "block") {
		obj2.kill();
	}
}
