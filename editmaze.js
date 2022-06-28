var maze = emptyMaze(8,4);
var brush = TILE.NONE;

var canvas = document.getElementById('canvas');
var width = document.getElementById('width');
var height = document.getElementById('height');

const rect = canvas.getBoundingClientRect();


function tick() {
	drawMaze(maze);
}

function pushCode() {
	history.pushState(null,'',window.location.pathname + "?code=" + base64(maze));
}

function getWidth()	{ return Number(width.value) }
function getHeight()	{ return Number(height.value) }

function doResize() {
	resizeMaze(maze, getWidth(), getHeight());
	pushCode();
	tick();
}
function doRandom() {
	maze = randomMaze(getWidth(), getHeight());
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
	if (x>=0 && x<getWidth() && y>=0 && y<getHeight())
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
