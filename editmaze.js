var maze = emptyMaze(16,10);
var brush = TILE.NONE;

document.addEventListener('click', e => {
	maze[Math.floor(e.clientX / b)][Math.floor(e.clientY / b)] = brush;
	drawMaze(maze);
});

document.addEventListener('keydown', e => { if (!isNaN(e.key)) brush = parseInt(e.key) });

drawMaze(maze);
