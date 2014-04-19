var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
		preload : preload,
		create : create,
		update : update
	});

var player, opponent;
var gameStarted = false;
var balls = new Array();
var scoreLeft = 0;
var scoreRight = 0;
function preload() {
	game.load.image('paddle', 'Images/paddle.png');
	game.load.image('ball', 'Images/ball.png');
}

function create() {

	paddles = game.add.group();
	ballsGroup = game.add.group();
	player = paddles.create(40, 30, 'paddle');
	opponent = paddles.create(750, 30, 'paddle');
	balls.push(new ball(400, 300));
	balls.push(new ball(400, 330));
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
	new Phaser.Line(game.world.centerX, 0, game.world.centerX, 600);
}
function ball(x, y) {
	var ball = ballsGroup.create(x, y, 'ball');
	game.physics.enable(ball, Phaser.Physics.ARCADE);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.setTo(1.1, 1.1);
	this.launch = function () {
		XVector =  - (game.input.x - ball.x);
		YVector =  - (game.input.y - ball.y);
		ball.body.velocity.setTo(XVector, YVector);
	}
	this.update = function () {
		if(ball.x>=790){
		
		scoreRight++;
		console.log("score: "+scoreLeft+" : "+scoreRight);
	}
			if(ball.x<=0){
		
		scoreLeft++;
		console.log("score: "+scoreLeft+" : "+scoreRight);
	}
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

function update() {

	if (game.input.keyboard.isDown(Phaser.Keyboard.S) && player.body.velocity.y < 200) {
		player.body.velocity.y += 50;
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.W) && player.body.velocity.y > -200) {
		player.body.velocity.y -= 50;
	} else if (player.body.velocity.y >= 10) {
		player.body.velocity.y -= 10;
	} else if (player.body.velocity.y <= -10) {
		player.body.velocity.y += 10;
	}else{
	player.body.velocity.y = 0;
	}
	//Fancy math
	//opponent.body.y -= Math.cos(Math.atan2(opponent.body.x - ball.body.x, opponent.body.y - ball.body.y)) * 3;

for (var i = 0; i < balls.length; i++) {
balls[i].update();
}
	game.physics.arcade.collide(paddles, ballsGroup);

}
