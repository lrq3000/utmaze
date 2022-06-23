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

let b64s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function base64(maze) {
	let b64 = '';
	let tileBuf = [];

	// Load tiles into 1-dimensional buffer
	for (let x=0; x<maze.length; x++)
		tileBuf = tileBuf.concat(maze[x]);

	// 6 bits per character base64-encoded, 3 bits per tile
	for (let i=0; i<tileBuf.length; )
		b64 += b64s.charAt((tileBuf[i++] << 3) | tileBuf[i++]);

	// Encode maze height (max 64)
	return b64s.charAt(maze[0].length-1)+b64;
}
function load(base64) {
	let h = 1 + b64s.indexOf(base64.charAt(0));
	let w = (base64.length - 1) * 2 / h;	// w*h=a, a/h=w
	let maze = emptyMaze(w,h);

	let tileBuf = [];
	for (let i=1; i<base64.length; i++) {
		let octets = b64s.indexOf(base64.charAt(i));
		tileBuf.push(octets >>> 3);
		tileBuf.push(octets & 0b111);
	}

	let i=0;
	for (let x=0; x<w; x++)
		for (let y=0; y<h; y++)
			maze[x][y] = tileBuf[i++];

	return maze;
}
