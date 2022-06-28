const TILE = {
	NONE:	0,
	PINK:	1,
	ORANGE:	2,
	PURPLE:	3,
	GREEN:	4,
	BLUE:	5,
	YELLOW:	6,
	RED:	7,
	PLAID:	8,
	ELEC:	9,
	START:	10,
	END:	11
};
const COLOR = ['Black','#FEBFC0','#FFC049','#C000C0','#9BFF78','#4040FF','#FFFF80','#FF3F3F','plaid','#8080FF','light gray','Gray'];
const STATE = {
	NEUTRAL:0,
	ORANGES:1,
	LEMONS: 2
}

var b = 40;	// Breadth of tile (Size in px)

function randInt(n) { return Math.floor(Math.random() * n); }

function emptyMaze(w,h) {
	let maze = new Array(w);
	for (let i=0; i<w; i++)
		maze[i] = new Array(h);
	return maze;
}

function resizeMaze(maze,w2,h2) {
	let w1 = maze.length;

	if (w2 <= w1) {
		maze.length = w2;
		for (let i=0; i<w2; i++)
			maze[i].length = h2;
	}
	else {
		for (let i=0; i<w1; i++)
			maze[i].length = h2;
		for (let i=w1; i<w2; i++)
			maze[i] = new Array(h2);
	}

	return maze;
}

// Check yellow tiles, "electrify" all touching bodies of blue tiles
function _electrify(maze,x,y) {
	// Escape if out of bounds
	if (x<0 || x>=maze.length || y<0 || y>=maze[0].length)
		return;

	if (maze[x][y] != TILE.BLUE)
		return;

	maze[x][y] = TILE.ELEC;
	_electrify(maze,x-1,y);
	_electrify(maze,x+1,y);
	_electrify(maze,x,y-1);
	_electrify(maze,x,y+1);
}

function electrify(maze) {
	for (let x=0; x<maze.length; x++) {
		for (let y=0; y<maze[0].length; y++) {
			if (maze[x][y] == TILE.YELLOW) {
				_electrify(maze,x-1,y);
				_electrify(maze,x+1,y);
				_electrify(maze,x,y-1);
				_electrify(maze,x,y+1);
			}
		}
	}
}

function randomMaze (w,h) {
	let maze = emptyMaze(w,h);
	let state = STATE.NEUTRAL;
	let par = 0;

	// Initialize X,Y and pick random starting Y
	let x = 0;
	let y = randInt(h);

	/* GENERATE SOLUTION PATH */
	while (true) {
		// Place tile
		let tile = 1 + randInt(state == STATE.ORANGES ? 4 : 5);
		maze[x][y] = tile;

		// Change state depending on which tile was placed
		switch (tile) {
			case TILE.ORANGE:
				state = STATE.ORANGES;
				break;
			case TILE.PURPLE:
				state = STATE.LEMONS;
				break;
			case TILE.GREEN:
				par++;
				break;
		}

		// Select next tile
		let r = Math.random();
		let x2 = x;
		let y2 = y;
		if (r < 0.4)		x2++;
		else if (r < 0.65)	y2--;
		else if (r < 0.9)	y2++;
		else			x2--;

		// If too far up/left/down, go right instead.
		// Set coords.
		if (x2 <= 0 || y2 < 0 || y2 >= h)
			x++;
		else {
			x = x2;
			y = y2;
		}

		// If coords were set too far right, go back and place finish tile instead.
		if (x >= w) {
			maze[--x][y] = TILE.END;
			break;
		}
	}

	/* Fill rest of maze with random blocks */
	for (let x=0; x<w; x++) {
		for (let y=0; y<h; y++) {
			if (!maze[x][y])
				// Weighted with +0-1.5
				maze[x][y] = Math.min(1 + randInt(7) + randInt(1.5), 7);
		}
	}

	console.log(par);
	electrify(maze);
	return maze;
}

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

let b64s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
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

	electrify(maze);
	return maze;
}
