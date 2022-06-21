function generateMaze (w,h) {
	let state = STATE.NEUTRAL;
	let par = 0;

	// Initialize maze 2D array
	let maze = new Array(w);
	for (let i=0; i<w; i++)
		maze[i] = new Array(h);

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
			maze[--x][y] = TILE.PLAID;
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
	return maze;
}

function drawMaze(maze) {
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

function viewAverages(maze) {
	let count = Array(COLOR.length).fill(0);
	let w = maze.length;
	let h = maze[0].length;
	for (let x=0; x<w; x++)
		for (let y=0; y<h; y++)
			count[maze[x][y]]++;

	let t = w*h;
	for (let i=0; i<count.length; i++)
		console.log(""+COLOR[i]+": "+count[i]/t);
}


var m = generateMaze(16,10);
drawMaze(m);
viewAverages(m);
