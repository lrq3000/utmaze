const b = 40;	// Breadth of tile (Size in px)

class Img extends Image {	// Because I'm sick of defining the `src` on a second line
	constructor(src) {
		super();
		this.src = src;
	}
}

var scale = 1;
const plaid = new Img('graphics/plaid.png');
let cx1;
function drawMaze(maze) {
	cx1.clearRect(0,0,canvas.width,canvas.height);

	let w = b * maze.width;
	let h = b * maze.height;
	let marginHeight = document.getElementsByTagName('header')[0].offsetHeight + document.getElementsByTagName('footer')[0].offsetHeight;
	// Magic numbers '16' and '48' are rough margins which are nigh-impossible to get with pure JS
	scale = Math.min((window.innerWidth - 16) / w, (window.innerHeight - marginHeight - 48) / h, 1);
	canvas.width = w*scale;
	canvas.height = h*scale;
	cx1.scale(scale,scale);

	for (let x=0; x<maze.width; x++) {
		for (let y=0; y<maze.height; y++) {
			let tile = maze[x][y];
			if (tile == TILE.PLAID)
				cx1.drawImage(plaid,b*x,b*y,b,b);
			else {
				cx1.beginPath();
				cx1.rect(b*x,b*y,b,b);
				cx1.fillStyle = (COLOR[tile] || 'black');
				cx1.fill();
				cx1.closePath();
			}
		}
	}
}

const heart = new Img('graphics/heart.png');
function drawPlayer(player) {
	let x = player.x;
	let y = player.y;

	cx1.drawImage(heart,(b*x)+(b*0.125),(b*y)+(b*0.125),b*0.75,b*0.75);
}

let cx2;
const flavorless= new Img('graphics/flavor_none.png');
const lemons	= new Img('graphics/flavor_lemons.png');
const oranges	= new Img('graphics/flavor_oranges.png');
const victory	= new Img('graphics/flavor_victory.png');
const scoreboard= new Img('graphics/score_ut.png');
const sucks	= new Img('graphics/timer_sucks.png');
const dog	= new Img('graphics/dog.png');
const timer	= new Img('graphics/timer_ut.png');
const digit = [
	new Img('graphics/timer_0.png'),
	new Img('graphics/timer_1.png'),
	new Img('graphics/timer_2.png'),
	new Img('graphics/timer_3.png'),
	new Img('graphics/timer_4.png'),
	new Img('graphics/timer_5.png'),
	new Img('graphics/timer_6.png'),
	new Img('graphics/timer_7.png'),
	new Img('graphics/timer_8.png'),
	new Img('graphics/timer_9.png')
];
function drawState(flavor,score) {
	// Flavor
	let flavorboard;
	switch (flavor) {
		case STATE.NEUTRAL:
		default:
			flavorboard = flavorless;
			break;

		case STATE.ORANGES:
			flavorboard = oranges;
			break;

		case STATE.LEMONS:
			flavorboard = lemons;
			break;

		case STATE.VICTORY:
			flavorboard = victory;
			break;
	}
	cx2.drawImage(flavorboard,0,0);

	// Score
	if (score > 999)
		cx2.drawImage(dog, flavorboard.width+31, 22);
	else {
		cx2.drawImage(scoreboard, flavorboard.width+4, 0);
		let digits = [];
		let offsetX = flavorboard.width + 44;
		while (score > 0) {
			digits.push(score % 10);
			score = Math.floor(score/10);
		}
		for (let i=0; i<digits.length; offsetX-=6)
			cx2.drawImage(digit[digits[i++]], offsetX, 26);
	}
}

let time;
let interval;
function drawTimer() {
	let delta = Date.now() - time;

	if (delta >= 600000)	// >10 minutes
		cx2.drawImage(sucks, scoreboard.width * 2 + 8, 0)
	else {
		let min = Math.floor(delta/1000/60);
		let sec = Math.floor(delta / 1000) % 60;
		let secTens = Math.floor(sec / 10);
		let secOnes = sec % 10;
		let dec = Math.floor(delta / 100) % 10;

		let offsetX = scoreboard.width * 2 + 8;
		let offsetY = 26;

		cx2.drawImage(timer, scoreboard.width * 2 + 8, 0);
		cx2.drawImage(digit[min], offsetX+28, offsetY);
		cx2.drawImage(digit[secTens], offsetX+36, offsetY);
		cx2.drawImage(digit[secOnes], offsetX+42, offsetY);
		cx2.drawImage(digit[dec], offsetX+50, offsetY);
	}	
}

function resetTimer() {
	time = Date.now();
	interval = setInterval(drawTimer, 50);
}

function stopTimer() {
	clearInterval(interval);
}

window.addEventListener('load', e => {
	cx1 = document.getElementById('canvas').getContext('2d');
	let sbar = document.getElementById('statusbar');
	if (sbar) {
		cx2 = sbar.getContext('2d');
		cx2.webkitImageSmoothingEnabled = false;
		cx2.mozImageSmoothingEnabled = false;
		cx2.imageSmoothingEnabled = false;
		cx2.scale(3,3);

		resetTimer();
	}
});
