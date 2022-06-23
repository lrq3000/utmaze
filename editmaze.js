var maze = emptyMaze(8,6);
var brush = TILE.NONE;

var canvas = document.getElementById('canvas');
var codebar = document.getElementById('levelcode');

function tick() {
	drawMaze(maze);
	codebar.value = base64(maze);
}

function initMaze() {
	maze = emptyMaze(document.getElementById('width').value, document.getElementById('height').value);
	tick();
}

function paintTile(e) {
	const rect = canvas.getBoundingClientRect();
	maze[Math.floor((e.clientX - rect.left) / b)][Math.floor((e.clientY - rect.top) / b)] = brush;
	tick();
}
canvas.addEventListener('mousedown', e => { /*e.preventDefault();*/ paintTile(e) });
canvas.addEventListener('mousemove', e => { if (e.buttons == 1) paintTile(e) });

document.addEventListener('keydown', e => { if (!isNaN(e.key)) brush = parseInt(e.key) });

tick();
