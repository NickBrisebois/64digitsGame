var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
		preload : preload,
		create : create,
		update : update,
		render : render
	});

var player, opponent;
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
	
    scoreLeft = game.add.text(game.world.centerX-300, 0, "0", { font: "65px Arial", fill: "#ff0044", align: "left" });
 scoreRight = game.add.text(game.world.centerX+300, 0, "0", { font: "65px Arial", fill: "#ff0044", align: "right" });
}
function ball(x, y) {
	var ball = ballsGroup.create(x, y, 'ball');
	ball.anchor.set(0.5);
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
		
		scoreLeft.text++;
		ball.kill();
		//console.log("score: "+scoreLeft+" : "+scoreRight);
	}
			if(ball.x<=0){
		
		scoreRight.text++;
		ball.kill();
		//console.log("score: "+scoreLeft+" : "+scoreRight);
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

function render() {

    game.debug.geom(line);
   

}
function update() {
player.body.y = game.input.y-30;
	
	//Fancy math
	//opponent.body.y -= Math.cos(Math.atan2(opponent.body.x - ball.body.x, opponent.body.y - ball.body.y)) * 3;

for (var i = 0; i < balls.length; i++) {
balls[i].update();
}
	game.physics.arcade.collide(paddles, ballsGroup);
	game.physics.arcade.collide(ballsGroup, ballsGroup);

}
