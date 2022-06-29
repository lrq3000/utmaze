const b = 40;	// Breadth of tile (Size in px)

function drawMaze(maze) {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        ctx.clearRect(0,0,canvas.width,canvas.height);

        for (let x=0; x<maze.length; x++) {
                for (let y=0; y<maze[0].length; y++) {
                        ctx.beginPath();
                        ctx.rect(b*x,b*y,b,b);
                        ctx.fillStyle = (COLOR[maze[x][y]] || 'black');
                        ctx.fill();
                        ctx.closePath();
                }
        }
}

function drawPlayer(player) {
	let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

	let x = player.x;
	let y = player.y;

        ctx.beginPath();
        ctx.arc(x*b+(b/2), y*b+(b/2), b/3, 0, 2*Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
}
