const TILE = {
	NONE:	0,
	PINK:	1,
	ORANGE:	2,
	PURPLE:	3,
	GREEN:	4,
	BLUE:	5,
	YELLOW:	6,
	RED:	7,
	PLAID:	8,	// Start and End tile
	ELEC:	9	// Electrified blue tile
};
const COLOR = [false,'#FEBFC0','#FFC049','#C000C0','#9BFF78','#4040FF','#FFFF80','#FF3F3F','#555555','#4040FF'];
const STATE = {
	NEUTRAL:0,
	ORANGES:1,
	LEMONS: 2,
	VICTORY:3
}

function randInt(n) { return Math.floor(Math.random() * n); }

function translateShareCode(share) {
	let req = new XMLHttpRequest();
	req.open('GET', 'share.php?share=' + share, false);
	req.send();
	return JSON.parse(req.response);
}
