function viewAverages(maze) {
	let count = Array(COLOR.length).fill(0);
	let w = maze.length;
	let h = maze[0].length;
	for (let x=0; x<w; x++)
		for (let y=0; y<h; y++)
			count[maze[x][y]]++;

	let t = w*h;
	for (let i=0; i<count.length; i++)
		console.log(""+COLOR[i]+": "+count[i]/t);
}


var m = randomMaze(16,10);
drawMaze(m);
viewAverages(m);
