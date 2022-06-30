class Maze extends Array {
	constructor(w,h) {
		super(w);
		for (let i=0; i<w; i++)
			this[i] = new Array(h);
		this.width = w;
		this.height = h;
		this.startY = 0;
		this.endY = 0;
		this.par = 0;
	}

	generateSolution() {
		let sPath = [];	// Track solution path
		let state = STATE.NEUTRAL;

		// Initialize X,Y and pick random starting Y
		let x = 0;
		let y = randInt(this.height);
		this[x][y] = TILE.PLAID;
		this.startY = y;

		while (true) {
			// Record tile on solution path
			sPath.push([x,y]);

			// Select next tile
			let r = Math.random();
			let x2 = x;
			let y2 = y;
			if (r < 0.4)            x2++;
			else if (r < 0.65)      y2--;
			else if (r < 0.9)       y2++;
			else                    x2--;

			// If too far up/left/down, go right instead.
			// Set coords.
			if (x2 <= 0 || y2 < 0 || y2 >= this.height)
				x++;
			else {
				x = x2;
				y = y2;
			}

			// If coords were set too far right, go back and place finish tile instead.
			if (x >= this.width) {
				this[--x][y] = TILE.PLAID;
				this.endY = y;
				break;
			}

			// Place tile
			let tile = 1 + randInt(state == STATE.ORANGES ? 4 : 5);
			this[x][y] = tile;

			// Change state depending on which tile was placed
			switch (tile) {
				case TILE.ORANGE:
					state = STATE.ORANGES;
					break;
				case TILE.PURPLE:
					state = STATE.LEMONS;
					break;
				case TILE.GREEN:
					this.par++;
					break;
			}
		}

		return sPath;
	}

	/* Fill empty spaces outside the solution path with random tiles */
	fillRandom(sPath) {
		// If no pregenerated sPath was provided, build one
		if (!sPath) {
			sPath = [];
			for (let x=0; x<this.width; x++) {
				for (let y=0; y<this.height; y++) {
					if (this[x][y])
						sPath.push([x,y]);
				}
			}
		}
		/* Why this sPath screwery?
		 * Maybe the user wants to draw their own solution path in the Editor,
		 * and then programmatically fill in the rest of the maze with random tiles.
		 * It's more efficient to save the sPath generated by `generateSolution()`,
		 * but in this case, we need to build it manually. But why build one at all?
		 * To ensure solvability. If a blue tile is part of the solution path,
		 * we need to remember which blue tiles belong to the solution path, to check
		 * whether we're allowed to place yellow tiles adjacent (for example).
		 */

		for (let x=0; x<this.width; x++) {
			for (let y=0; y<this.height; y++) {
				if (!this[x][y])
					// Weighted with +0-2
					this[x][y] = Math.min(1 + randInt(7) + randInt(2), 7);
			}
		}
	}

	static random(w,h) {
		let maze = new Maze(w,h);

		maze.fillRandom(maze.generateSolution());
		maze.electrify();
		return maze;
	}

	electrify() {
		for (let x=0; x<this.width; x++) {
			for (let y=0; y<this.height; y++) {
				if (this[x][y] == TILE.YELLOW) {
					this.#electrify(x-1,y);
					this.#electrify(x+1,y);
					this.#electrify(x,y-1);
					this.#electrify(x,y+1);
				}
			}
		}
	}
	#electrify(x,y) {
		// Escape if out of bounds
		if (x<0 || x>=this.width || y<0 || y>=this.height)
			return;

		if (this[x][y] != TILE.BLUE)
			return;

		this[x][y] = TILE.ELEC;
		this.#electrify(x-1,y);
		this.#electrify(x+1,y);
		this.#electrify(x,y-1);
		this.#electrify(x,y+1);
	}

	resize(w2,h2) {
		let w1 = this.width;

		if (w2 <= w1) {
			this.length = w2;
			for (let i=0; i<w2; i++)
				this[i].length = h2;
		}
		else {
			for (let i=0; i<w1; i++)
				this[i].length = h2;
			for (let i=w1; i<w2; i++)
				this[i] = new Array(h2);
		}

		this.width = w2;
		this.height = h2;
	}


	static b64s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

	toBase64() {
		let b64 = '';
		let tileBuf = [];

		// Load tiles into 1-dimensional buffer
		for (let x=0; x<this.width; x++)
			tileBuf = tileBuf.concat(this[x]);

		// 6 bits per character base64-encoded, 3 bits per tile
		for (let i=0; i<tileBuf.length; )
			b64 += Maze.b64s.charAt((tileBuf[i++] << 3) | tileBuf[i++]);

		// Prepend maze height, return
		return Maze.b64s.charAt(this.height-1) + b64;
	}

	static fromBase64(base64) {
		let h = 1 + Maze.b64s.indexOf(base64.charAt(0));
		let w = (base64.length - 1) * 2 / h;    // w*h=a, a/h=w

		let tileBuf = [];
		for (let i=1; i<base64.length; i++) {
			let octets = Maze.b64s.indexOf(base64.charAt(i));
			tileBuf.push(octets >>> 3);
			tileBuf.push(octets & 0b111);
		}

		let maze = new Maze(w,h);
		let i=0;
		for (let x=0; x<w; x++)
			for (let y=0; y<h; y++)
				maze[x][y] = tileBuf[i++];

		maze.electrify();
	}
}