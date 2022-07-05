var m;	// maze

let width = document.getElementById('w');
let height = document.getElementById('h');

let qs = new URLSearchParams(window.location.search);
function init() {
	m = Maze.random(Number(qs.get('w')) || 8, Number(qs.get('h')) || 6);
	history.replaceState(null,'',window.location.pathname + "?code=" + m.toBase64());
}
if (qs.get('code'))
	m = Maze.fromBase64(qs.get('code'));
else if (qs.get('share')) {
	let c = fetch('rainmaze/share.php?share=' + qs.get('share')).json();
	if (c) {
		m = Maze.fromBase64(c);
	}
	else
		init();
}
else
	init();

width.value = m.width;
height.value = m.height;

var p = new Player(m);


function tick() {
	drawMaze(m);
	drawPlayer(p);
	drawState(p.state, p.score);
}

async function share() {
	let link = 'https://loganhall.net/rainmaze/play.html';
	try {
		let r = await fetch(
			'rainmaze/share.php?code=' + m.toBase64(),
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}
		);
		let s = await r.json();
		if (s)
			link += '?share=' + s;
		else {
			console.log('Could not generate sharecode');
			return;
		}
	}
	catch (e) {
		console.log(e);
		link += '?code=' + m.toBase64();
	}

	try {
		await navigator.clipboard.writeText(link);
	}
	catch (e) {
		alert('Copy: ' + link);
	}
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
