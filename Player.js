const VEC = {
	UP:	[0,-1],
	RIGHT:	[1,0],
	DOWN:	[0,1],
	LEFT:	[-1,0],
	reverse: vec => [-1*vec[0], -1*vec[1]]
};

class Player {
	constructor(maze,x,y) {
		this.maze = maze;
		this.x = x;
		this.y = y;
		this.score = 0;
		this.state = STATE.NEUTRAL;
	}

	move(vec) {
		let x2 = this.x + vec[0];
		let y2 = this.y + vec[1];

		if (x2<0 || x2>=this.maze.width || y2<0 || y2>=this.maze.height)
			return;

		switch (this.maze[x2][y2]) {
			case TILE.ORANGE:
				this.state = STATE.ORANGES;
			case TILE.PINK:
				this.x = x2;
				this.y = y2;
				break;

			case TILE.PURPLE:
				this.state = STATE.LEMONS;
				this.x = x2;
				this.y = y2;
				this.move(vec);
				break;

			case TILE.GREEN:
				this.score++;
				this.x = x2;
				this.y = y2;
				break;

			case TILE.BLUE:
				if (this.state != STATE.ORANGES) {
					this.x = x2;
					this.y = y2;
					break;
				}
			case TILE.YELLOW:
			case TILE.ELEC:
				this.x = x2;
				this.y = y2;
				this.move(VEC.reverse(vec));
				break;

			case TILE.NONE:
			case TILE.RED:
			default:
				return;
		}
	}
}
