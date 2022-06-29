class Maze extends Array {
	constructor(w,h) {
		super(w);
		for (let i=0; i<w; i++)
			this[i] = new Array(h);
	}

	resize(w2,h2) {
		let w1 = this.length;

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
	}

	random(w,h) {
		let state = STATE.NEUTRAL;
		let par = 0;

		// Initialize X,Y and pick random starting Y
		let x = 0;
		let y = randInt(h);

		/* GENERATE SOLUTION PATH */
		while (true) {
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
					par++;
					break;
			}

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
			if (x2 <= 0 || y2 < 0 || y2 >= h)
				x++;
			else {
				x = x2;
				y = y2;
			}

			// If coords were set too far right, go back and place finish tile instead.
			if (x >= w) {
				this[--x][y] = TILE.END;
				break;
			}
		}

		/* Fill rest of maze with random blocks */
		for (let x=0; x<w; x++) {
			for (let y=0; y<h; y++) {
				if (!this[x][y])
					// Weighted with +0-1.5
					this[x][y] = Math.min(1 + randInt(7) + randInt(1.5), 7);
			}
		}

		console.log(par);
		this.electrify();
	}

	electrify() {
		for (let x=0; x<this.length; x++) {
			for (let y=0; y<this[0].length; y++) {
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
		if (x<0 || x>=this.length || y<0 || y>=this[0].length)
			return;

		if (this[x][y] != TILE.BLUE)
			return;

		this[x][y] = TILE.ELEC;
		this.#electrify(x-1,y);
		this.#electrify(x+1,y);
		this.#electrify(x,y-1);
		this.#electrify(x,y+1);
	}

	static b64s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

	toBase64() {
		let b64 = '';
		let tileBuf = [];

		// Load tiles into 1-dimensional buffer
		for (let x=0; x<this.length; x++)
			tileBuf = tileBuf.concat(this[x]);

		// 6 bits per character base64-encoded, 3 bits per tile
		for (let i=0; i<tileBuf.length; )
			b64 += b64s.charAt((tileBuf[i++] << 3) | tileBuf[i++]);

		// Encode maze height (max 64)
		return b64s.charAt(this[0].length-1)+b64;
	}

	fromBase64(base64) {
		let h = 1 + b64s.indexOf(base64.charAt(0));
		let w = (base64.length - 1) * 2 / h;    // w*h=a, a/h=w

		let tileBuf = [];
		for (let i=1; i<base64.length; i++) {
			let octets = b64s.indexOf(base64.charAt(i));
			tileBuf.push(octets >>> 3);
			tileBuf.push(octets & 0b111);
		}

		let i=0;
		for (let x=0; x<w; x++)
			for (let y=0; y<h; y++)
				this[x][y] = tileBuf[i++];

		electrify(this);
	}
}
