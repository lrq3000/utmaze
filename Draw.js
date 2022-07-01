const b = 40;	// Breadth of tile (Size in px)

const plaid = new Image();
plaid.src = 'graphics/plaid.png';
function drawMaze(maze) {
	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext('2d');

	ctx.clearRect(0,0,canvas.width,canvas.height);

	for (let x=0; x<maze.length; x++) {
		for (let y=0; y<maze[0].length; y++) {
			let tile = maze[x][y];
			if (tile == TILE.PLAID)
				ctx.drawImage(plaid,b*x,b*y,b,b);
			else {
				ctx.beginPath();
				ctx.rect(b*x,b*y,b,b);
				ctx.fillStyle = (COLOR[tile] || 'black');
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

const heart = new Image();
heart.src = 'graphics/heart.png';
function drawPlayer(player) {
	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext('2d');

	let x = player.x;
	let y = player.y;

	ctx.drawImage(heart,(b*x)+(b*0.125),(b*y)+(b*0.125),b*0.75,b*0.75);
}
