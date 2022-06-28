var maze = emptyMaze(8,4);
var brush = TILE.NONE;

var canvas = document.getElementById('canvas');
var width = document.getElementById('width');
var height = document.getElementById('height');

const rect = canvas.getBoundingClientRect();


function tick() {
	drawMaze(maze, width.value, height.value);
}

function pushCode() {
	history.pushState(null,'',window.location.pathname + "?code=" + base64(maze));
}

function doResize() {
	resizeMaze(maze, width.value, height.value);
	pushCode();
	tick();
}

function doMazeLoad(base64) {
	maze = load(base64);
	width.value = maze.length;
	height.value = maze[0].length;
	tick();
}

function paintTile(e) {
	let x = Math.floor((e.clientX - rect.left) / b);
	let y = Math.floor((e.clientY - rect.top) / b)
	if (x>=0 && x<width.value && y>=0 && y<height.value)
		maze[x][y] = brush;
	tick();
}
canvas.addEventListener('mousedown', e => { /*e.preventDefault();*/ paintTile(e) });
canvas.addEventListener('mousemove', e => { if (e.buttons == 1) paintTile(e) });
canvas.addEventListener('mouseup', e => {
	if (
		e.clientX >= rect.left
		&& e.clientX <= rect.right
		&& e.clientY >= rect.top
		&& e.clientY <= rect.bottom
	)
		pushCode();
});

document.addEventListener('keydown', e => { if (!isNaN(e.key)) brush = parseInt(e.key) });
document.addEventListener('popstate', e => {
	doMazeLoad(new URLSearchParams(window.location.search).get('code'));
});

doMazeLoad(new URLSearchParams(window.location.search).get('code'));

tick();
