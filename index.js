// Solution

function processData(input) {
    
    const args = input.split("\n")

    const N = parseInt(args[0]);
    const S = args.slice(1, N+1).map(row => row.split(''));
    const E = args.slice(N+1).map(row => row.split(''));

    const letters = ['L','R','U','D'];

    let whitePosition = [0,0];
    for(let x = 0; x < N; x++){
    	for(let i = 0; i < N; i++){
    		if(S[x][i] === 'W'){
	    		whitePosition = [x, i]
    		}
    	}
    }

    let res = broadSearch(letters, [[S, whitePosition, [], 0]], E, 1);

    return res;

}

function broadSearch(letters, searches, target, depth){
	let continuations = [];
	let answers = [];
	for(search of searches){
		let [board, whitePosition, moves, last_move] = search;
		let key = hash(board);
		if(cache[key]){
			continue;
		}
		for(letter of letters){
			if(shouldMove(board, whitePosition, last_move, letter)){
				let [_board, _whitePosition] = calculateMove(board, whitePosition, letter);
				let _moves = moves.slice(0);
				_moves.push(letter);
				if(compareBoards(_board, target)){
					answers.push(_moves)
				} else {
					continuations.push([_board, _whitePosition, _moves, letter])
				}
			}
		}
	}
	searches.map(con => {
		let x = hash(con[0])
		cache[x] = con[2];
	})
	if(answers.length > 0){
		return answers.reduce((total, moves) => {
			return total + moves.reduce(calcChecksum, 0)
		}, 0) % 100000007;
	} else if(continuations.length > 0){
		return broadSearch(letters, continuations, target, depth + 1);
	}
}

let cache = {};

function hash(board){
	let key = '';
    for(let x = 0; x < board.length; x++){
    	for(let i = 0; i < board.length; i++){
    		key += board[x][i];
    	}
    }
    return key;
}

function shouldMove(board, whitePosition, last_move, direction){

	if(last_move){
		if(last_move === 'R' && direction === 'L') return false;
		else if(last_move === 'D' && direction === 'U') return false;
		else if(last_move === 'L' && direction === 'R') return false;
		else if(last_move === 'U' && direction === 'D') return false;
	}

	if(direction == 'R' && whitePosition[0] === 0) return false;
	else if(direction == 'D' && whitePosition[1] === 0) return false;
	else if(direction == 'L' && whitePosition[0] === board.length - 1) return false;
	else if(direction == 'U' && whitePosition[1] === board.length - 1) return false;

	return true;

}


function calculateMove(board, whitePosition, direction){

	let swapPosition = [whitePosition[0],whitePosition[1]];
	if(direction == 'R') swapPosition[0] -= 1;
	else if(direction == 'D') swapPosition[1] -= 1;
	else if(direction == 'L') swapPosition[0] += 1;
	else if(direction == 'U') swapPosition[1] += 1;

	let newBoard = swapBoardPositions(board, whitePosition, swapPosition);

	return [newBoard, swapPosition];

}

function swapBoardPositions(board, A, B){

	let newBoard = board.slice(0).map(row => row.slice(0));

	newBoard[A[1]][A[0]] = board[B[1]][B[0]]
	newBoard[B[1]][B[0]] = 'W'

	return newBoard;
}

function compareBoards(A, B){
	for(x in A){
		for(y in A){
			if(A[x][y] !== B[x][y]) return false;
		}
	}
	return true;
}

function calcChecksum(checksum, letter){
	return (checksum * 243 + asciiValue(letter)) % 100000007
}

function asciiValue(letter){
	if(letter === 'L') return 76;
	if(letter === 'R') return 82;
	if(letter === 'U') return 85;
	if(letter === 'D') return 68;
}

const tests = [
	{
		input: "2\nWR\nBB\nRB\nBW",
		answer: 18553
	},
	{
		input: "3\nBBB\nBWR\nRRR\nRBR\nBWB\nRBR",
		answer: 86665639
	},
	{
		input: "4\nWRBB\nRRBB\nRRBB\nRRBB\nRRBB\nRBBB\nRWRB\nRRBB",
		answer: 91440058
	},
	{
		input: "4\nWRBB\nRRBB\nRRBB\nRRBB\nWBRB\nBRBR\nRBRB\nBRBR",
		answer: 91440058
	},
]

function test(profile){
	const res = processData(profile.input);
	console.log(res, profile.answer, profile.answer === res)
}

test(tests[3])

return;

tests.map(function(profile){
	const start = new Date();
	cache = {};
	test(profile);
	console.info('Execution time: %dms', new Date() - start)
})
