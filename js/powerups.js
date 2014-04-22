var powerups=[

	function(){
		spawnBall(turn);
		alert("Multiball!");
		turn = !turn;
	},
	function(){
	for (var i = 0; i < 60; i++) {
		createBlock(200, i * 10, "block");
		}
		alert("WALL!");
		turn = !turn;
	},
	function(){
		spawnBall(turn);
		alert("(small)WALL!");
		turn = !turn;
	}
];