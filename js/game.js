var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
		preload : preload,
		create : create,
		update : update,
		render : render
	});


var player, opponent, blocks, block;

var gameStarted = false;
var balls = new Array();
var scoreLeft = 0;
var line;
var score;
var scoreRight = 0;

function preload() {
	game.load.image('paddle', 'Images/paddle.png');
	game.load.image('ball', 'Images/ball.png');
}

function create() {
	line = new Phaser.Line(game.world.centerX, 0, game.world.centerX, 600);
	paddles = game.add.group();
	ballsGroup = game.add.group();
	blocks = game.add.group();
	player = paddles.create(40, 30, 'paddle');
	opponent = paddles.create(750, 30, 'paddle');
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
	game.input.onDown.add(launch, this);


	for(var i=0; i<60; i++) {
		for(var ii=0; ii<8; ii++) {
			createBlock(ii*10, i*10);
			createBlock((ii*10)+720, i*10);
		}
	}

	game.physics.enable(blocks, Phaser.Physics.ARCADE);
	blocks.body.immovable = true;

	scoreLeft = game.add.text(game.world.centerX - 300, 0, "0", {
			font : "65px Arial",
			fill : "#ff0044",
			align : "left"
		});
	scoreRight = game.add.text(game.world.centerX + 300, 0, "0", {
			font : "65px Arial",
			fill : "#ff0044",
			align : "right"
		});
}

function ball(x, y) {
	this.ball = ballsGroup.create(x, y, 'ball');

	this.ball.anchor.set(0.5);
	game.physics.enable(this.ball, Phaser.Physics.ARCADE);
	this.ball.body.collideWorldBounds = true;
	this.ball.body.bounce.setTo(1.1, 1.1);
	this.launch = function () {
		XVector =  - (game.input.x - this.ball.x);
		YVector =  - (game.input.y - this.ball.y);
		this.ball.body.velocity.setTo(XVector, YVector);
	}
	this.autoLaunch = function (side) {
		if (side) {
			this.ball.body.velocity.setTo(-400, game.rnd.integerInRange(-200, 200));
		} else {
			this.ball.body.velocity.setTo(400, game.rnd.integerInRange(-200, 200));
		}
		return this;
	}
	this.update = function () {
		if (this.ball.x >= 785) {
			score(false, this);
			//console.log("score: "+scoreLeft+" : "+scoreRight);
		}
		if (this.ball.x <= 10) {
			score(true, this);
			//console.log("score: "+scoreLeft+" : "+scoreRight);
		}
	}
}

function createBlock(x, y){
	this.block = blocks.create(x, y, 'block');
	game.physics.enable(this.block, Phaser.Physics.ARCADE);
	this.block.immovable= true;
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

		balls.push(new ball(game.world.centerX, game.world.centerY - 200 + game.rnd.integerInRange(0, 200)).autoLaunch(side));

	}

}
function launch() {
	if (!gameStarted) {
		for (var i = 0; i < balls.length; i++) {
			balls[i].launch();
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
	game.physics.arcade.collide(ballsGroup, blocks);


	if( game.input.keyboard.isDown(Phaser.Keyboard.S) && player.body.velocity.y < 200 ){

		player.body.y += 5;
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.W) && player.body.velocity.y > -200) {
		player.body.y -= 5;
	}

	//Fancy math
	//opponent.body.y -= Math.cos(Math.atan2(opponent.body.x - ball.body.x, opponent.body.y - ball.body.y)) * 3;

	for (var i = 0; i < balls.length; i++) {
		balls[i].update();
	}
	game.physics.arcade.collide(paddles, ballsGroup);
	game.physics.arcade.collide(ballsGroup, ballsGroup);

}
