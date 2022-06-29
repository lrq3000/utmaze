const TILE = {
	NONE:	0,
	PINK:	1,
	ORANGE:	2,
	PURPLE:	3,
	GREEN:	4,
	BLUE:	5,
	YELLOW:	6,
	RED:	7,
	PLAID:	8,
	ELEC:	9,
	START:	10,
	END:	11
};
const COLOR = ['Black','#FEBFC0','#FFC049','#C000C0','#9BFF78','#4040FF','#FFFF80','#FF3F3F','plaid','#8080FF','light gray','Gray'];
const STATE = {
	NEUTRAL:0,
	ORANGES:1,
	LEMONS: 2
}

function randInt(n) { return Math.floor(Math.random() * n); }
