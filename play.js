var m;	// maze

let width = document.getElementById('w');
let height = document.getElementById('h');

let qs = new URLSearchParams(window.location.search);
if (qs.get('code'))
	m = Maze.fromBase64(qs.get('code'));
else {
	m = Maze.random(Number(qs.get('w')) || 8, Number(qs.get('h')) || 6);
	history.replaceState(null,'',window.location.pathname + "?code=" + m.toBase64());
}
width.value = m.width;
height.value = m.height;

var p = new Player(m);

function openNewMaze() {
	window.location = 'play.html?w=' + width.value + '&h=' + height.value;
}
function openEditor() {
	window.location = 'edit.html?code=' + new URLSearchParams(window.location.search).get('code');
}

let begun = false;
document.addEventListener('keydown', e => {
	if (e.key.includes('Arrow')) {
		e.preventDefault();
		p.move(VEC[e.key.substring(5).toUpperCase()]);
		if (!begun) {
			begun = true;
			resetTimer();
		}
	}
	else if (e.key == 'r')
		p = new Player(m);

	// Player wins!
	if (m[p.x][p.y] == TILE.PLAID && p.x != 0) {
		stopTimer();
	}

	drawMaze(m);
	drawPlayer(p);
	drawState(p.state, p.score);
});

window.addEventListener('load', e => {
	let btn_rules = document.getElementById('btn_rules');
	let rules = document.getElementById('rules');
	btn_rules.addEventListener('mouseover', e => rules.style.display = 'block' );
	btn_rules.addEventListener('mouseleave', e => rules.style.display = 'none' );

	drawMaze(m);
	drawPlayer(p);
	drawState(p.state, p.score);
	drawTimer();
	stopTimer();
});
