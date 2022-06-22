const TILE = {
	NONE:	0,
	PINK:	1,
	ORANGE:	2,
	PURPLE:	3,
	GREEN:	4,
	BLUE:	5,
	YELLOW:	6,
	RED:	7,
	PLAID:	8
};
const COLOR = ['black','pink','orange','purple','lime','blue','yellow','red','gray'];
const STATE = {
	NEUTRAL:0,
	ORANGES:1,
	LEMONS: 2
}

var b = 40;	// Breadth of tile (Size in px)

function randInt(n) { return Math.floor(Math.random() * n); }

/* Initialize maze 2D array */
function emptyMaze (w,h) {
	let maze = new Array(w);
	for (let i=0; i<w; i++)
		maze[i] = new Array(h);
	return maze;
}

function drawMaze(maze) {
	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext('2d');

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


