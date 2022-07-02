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

	isInBounds(x,y) {
		return (x>=0 && x<this.width && y>=0 && y<this.height);
	}

	floodFill(x,y,callback) {
		/* `callback` should take parameters maze,x,y
		 * and return a boolean, `true` to continue recursing, `false` to stop
		 */

		// Form closure with `callback` and `this` maze object
		let maze = this;
		function _floodFill(x,y) {
			if (!maze.isInBounds(x,y))
				return;

			if (!callback(maze,x,y))
				return;

			_floodFill(x-1,y);
			_floodFill(x+1,y);
			_floodFill(x,y-1);
			_floodFill(x,y+1);
		}
		_floodFill(x,y);
	}

	generateSolution() {
		let sPath = [];	// Track solution path
		let state = STATE.NEUTRAL;
		let sinOffset = Math.random(5);

		// Initialize X,Y and pick random starting Y
		let x = 0;
		let y = randInt(this.height);
		this.startY = y;

		while (true) {
			// Record tile on solution path
			sPath.push({x:x,y:y});

			// Select next tile
			// Use `Math.sin()` to promote wavier paths over straight paths
			// and `sinOffset` so that the waves aren't samey from maze to maze
			let r = Math.sin(x + Math.random(2)-1 + sinOffset);
			let x2 = x;
			let y2 = y;
			if (r < -0.8)			y2--;
			else if (r > 0.8)		y2++;
			else if (r > -0.2 && r < 0.2)	x2--;
			else				x2++;

			// If we turned a corner on a purple tile,
			// put red tile across (to guarantee solvability).
			if (this[x][y] == TILE.PURPLE) {
				let x1 = sPath.at(-2).x;
				let y1 = sPath.at(-2).y;
				let dx = x2 - x1;
				let dy = y2 - y1;

				// Corner tile
				// (Vectors -- if either delta X or delta Y are zero (falsy), we didn't turn)
				if (dx && dy) {
					let x3 = 2*x-x1;
					let y3 = 2*y-y1;
					if (this.isInBounds(x3,y3))
						this[x3][y3] = TILE.RED;
				}
			}

			// If headed out of bounds, go right instead.
			// Set coords.
			if (!this.isInBounds(x2,y2))
				x++;
			else {
				x = x2;
				y = y2;
			}

			// If coords were set too far right, go back and place finish tile instead.
			if (x >= this.width) {
				this[this.width-1][y] = TILE.PLAID;
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

		// Sanity check for rare case where solution path intersects with self and becomes unsolvable
		state = STATE.NEUTRAL;
		for (let i=0; i<sPath.length; i++) {
			let x = sPath[i].x;
			let y = sPath[i].y;
			switch (this[x][y]) {
				case TILE.ORANGE:
					state = STATE.ORANGES;
					break;
				case TILE.PURPLE:
					state = STATE.LEMONS;
					break;
				case TILE.BLUE:
					if (state == STATE.ORANGES)
						this[x][y] = TILE.PINK;
					break;
			}
		}

		// Place starting tile (we do it at the end in case it was overwritten by the solution path)
		this[0][this.startY] = TILE.PLAID;

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
						sPath.push({x:x,y:y});
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

		function _weightedRandomTile() {
			return Math.min(1 + randInt(7) + randInt(2), 7);
		}

		// Fill rest of maze with random tiles
		for (let x=0; x<this.width; x++) {
			for (let y=0; y<this.height; y++) {
				if (!this[x][y])
					// Weighted with +0-2
					this[x][y] = _weightedRandomTile();
			}
		}

		// Electrify tiles
		this.electrify();

		// Un-electrify any tiles on the solution path (not the most efficient solution, but it's simpler than making `electrify()` double-check)
		function _unelectrify(m,x,y) {
			if (m[x][y] == TILE.ELEC) {
				m[x][y] = TILE.BLUE;
				return true;
			}
			else if (m[x][y] == TILE.YELLOW) {
				let tile = _weightedRandomTile();
				m[x][y] = (tile!=TILE.YELLOW ? tile : TILE.RED);
				return true;
			}
			else return false;
		}
		for (let i=0; i<sPath.length; i++)
			this.floodFill(sPath[i].x, sPath[i].y, _unelectrify);
	}

	static random(w,h) {
		let maze = new Maze(w,h);

		maze.fillRandom(maze.generateSolution());
		return maze;
	}

	electrify() {
		function _electrify(m,x,y) {
			if (m[x][y] == TILE.BLUE) {
				m[x][y] = TILE.ELEC;
				return true;
			}
			else return false;
		}

		for (let x=0; x<this.width; x++) {
			for (let y=0; y<this.height; y++) {
				if (this[x][y] == TILE.YELLOW) {
					this.floodFill(x-1, y, _electrify);
					this.floodFill(x+1, y, _electrify);
					this.floodFill(x, y-1, _electrify);
					this.floodFill(x, y+1, _electrify);
				}
			}
		}
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
		// (and convert TILE.ELEC (9) to TILE.BLUE (5))
		for (let i=0; i<tileBuf.length; i+=2)
			b64 += Maze.b64s.charAt(
				((tileBuf[i]==TILE.ELEC ? TILE.BLUE : tileBuf[i])-1 << 3)
				| (tileBuf[i+1]==TILE.ELEC ? TILE.BLUE : tileBuf[i+1])-1
			);

		// Prepend maze height, return
		return Maze.b64s.charAt(this.height-1) + b64;
	}

	static fromBase64(base64) {
		let h = 1 + Maze.b64s.indexOf(base64.charAt(0));
		let w = (base64.length - 1) * 2 / h;	// w*h=a, a/h=w

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
				maze[x][y] = tileBuf[i++]+1;

		maze.electrify();
		return maze;
	}
}
