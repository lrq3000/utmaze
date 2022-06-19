const TILE = {
	PINK:	1,
	ORANGE:	2,
	PURPLE:	3,
	GREEN:	4,
	BLUE:	5,
	YELLOW:	6,
	RED:	7,
	PLAID:	8
};
const COLOR = [null,'pink','orange','purple','green','blue','yellow','red','plaid'];
const STATE = {
	NEUTRAL:0,
	ORANGES:1,
	LEMONS: 2
}

var maze;

function randInt(n) { return Math.floor(Math.random() * n); }

function generateMaze (w,h) {
	maze = Array(w).fill(Array(h));
	var state = STATE.NEUTRAL;
	var par = 0;

	// Generate safe starting column
	for (let i=0; i<h; i++)
		maze[0][i] = TILE.PINK;

	// Initialize X,Y and pick random starting Y
	let x = 1;
	let y = randInt(h);

	/* GENERATE SOLUTION PATH */
	while (true) {
		// Place tile
		let tile = 1 + randInt(state == STATE.ORANGES ? 4 : 5);
		maze[x][y] = tile;
		console.log("Placed " + COLOR[tile] + " at " + x + "," + y);

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
		if (r < 0.5)		x2++;
		else if (r < 0.7)	y2--;
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
			maze[--x][y] = TILE.PLAID;
			break;
		}
	}

	/* Fill rest of maze with random blocks */
}

function drawMaze() {
	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext('2d');
	let b = 40;

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


generateMaze(8,6);
drawMaze();
