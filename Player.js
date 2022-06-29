const VEC = {
	UP:	{x:0,y:-1},
	RIGHT:	{x:1,y:0},
	DOWN:	{x:0,y:1},
	LEFT:	{x:-1,y:0},
	reverse: vec => ({x:-1*vec.x, y:-1*vec.y})
};

class Player {
	constructor(maze) {
		this.maze = maze;
		this.x = 0;
		this.y = maze.startY || 0;
		this.score = 0;
		this.state = STATE.NEUTRAL;
	}

	move(vec) {
		let x2 = this.x + vec.x;
		let y2 = this.y + vec.y;

		if (x2<0 || x2>=this.maze.width || y2<0 || y2>=this.maze.height)
			return;

		switch (this.maze[x2][y2]) {
			case TILE.ORANGE:
				this.state = STATE.ORANGES;
			case TILE.PINK:
			case TILE.PLAID:
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
