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


function tick() {
	drawMaze(m);
	drawPlayer(p);
	drawState(p.state, p.score);
}

async function share() {
	try {
		fetch('rainmaze/share.php?code=' + m.toBase64());
	}
	catch (e) {}
}

function openNewMaze() {
	window.location = 'play.html?w=' + width.value + '&h=' + height.value;
}
function openEditor() {
	window.location = 'edit.html?code=' + new URLSearchParams(window.location.search).get('code');
}

let begun = false;
function move(direction) {
	p.move(VEC[direction]);
	if (!begun) {
		begun = true;
		resetTimer();
	}

	tick();
}
function reset() {
	p = new Player(m);
	tick();
}
document.addEventListener('keydown', e => {
	if (e.key.includes('Arrow')) {
		e.preventDefault();
		move(e.key.substring(5).toUpperCase());
	}
	else if (e.key == 'r')
		reset();
});
document.addEventListener('swiped', e => {
	e.preventDefault();
	move(e.detail.dir.toUpperCase());
});


window.addEventListener('resize', e => {
	tick();
});

window.addEventListener('load', e => {
	let btn_rules = document.getElementById('btn_rules');
	let rules = document.getElementById('rules');
	btn_rules.addEventListener('mouseover', e => rules.style.display = 'block' );
	btn_rules.addEventListener('mouseleave', e => rules.style.display = 'none' );

	tick();
	drawTimer();
	stopTimer();
});
