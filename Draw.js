const b = 40;	// Breadth of tile (Size in px)

function drawMaze(maze) {
	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext('2d');

	ctx.clearRect(0,0,canvas.width,canvas.height);

	for (let x=0; x<maze.length; x++) {
		for (let y=0; y<maze[0].length; y++) {
			ctx.beginPath();
			ctx.rect(b*x,b*y,b,b);
			ctx.fillStyle = (COLOR[maze[x][y]] || 'black');
			ctx.fill();
			ctx.closePath();
		}
	}
}

const heart = new Image();
heart.src = 'heart.png';
function drawPlayer(player) {
	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext('2d');

	let x = player.x;
	let y = player.y;

	ctx.drawImage(heart,(x*b)+(b*0.125),(y*b)+(b*0.125),b*0.75,b*0.75);
}
