var maze = emptyMaze(16,10);
var brush = TILE.NONE;

var canvas = document.getElementById('canvas');
function paintTile(e) {
	const rect = canvas.getBoundingClientRect();
	maze[Math.floor((e.clientX - rect.left) / b)][Math.floor((e.clientY - rect.top) / b)] = brush;
	drawMaze(maze);
}
canvas.addEventListener('mousedown', e => { paintTile(e) });
canvas.addEventListener('mousemove', e => { if (e.buttons == 1) paintTile(e) });

document.addEventListener('keydown', e => { if (!isNaN(e.key)) brush = parseInt(e.key) });

drawMaze(maze);
