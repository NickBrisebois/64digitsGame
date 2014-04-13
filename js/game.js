var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var player, opponent;

function preload() {
	game.load.image('paddle', 'Images/paddle.png');
}	

function create() {
	player = game.add.sprite(40, 30, 'paddle');
	opponent = game.add.sprite(750, 30, 'paddle');

	game.physics.enable(player, Phaser.Physics.ARCADE);
	game.physics.enable(opponent, Phaser.Physics.ARCADE);

	player.body.collideWorldBounds = true;
	opponent.body.collideWorldBounds = true;

	game.input.keyboard.addKeyCapture( [ Phaser.Keyboard.W, Phaser.Keyboard.S, Phaser.Keyboard.SPACEBAR ] );
}

function update() {
	
	if( game.input.keyboard.isDown(Phaser.Keyboard.S) && player.body.velocity.y < 200 ){
		player.body.velocity.y += 50;
	}else if( game.input.keyboard.isDown(Phaser.Keyboard.W) && player.body.velocity.y > -200  ){
		player.body.velocity.y -= 50;
	}else if( player.body.velocity.y > 0 ){
		player.body.velocity.y -= 10;
	}else{
		player.body.velocity.y += 10;
	}
}