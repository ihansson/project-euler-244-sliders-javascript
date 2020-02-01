// Cell Types

const W = 'W';

// Directions

const L = 'L';
const R = 'R';
const U = 'U';
const D = 'D';

// Process input

function processData(input){

	// Process input and format boards into strings

    const args = input.split("\n")

    const boardSize_N = parseInt(args[0]);
    const startBoard_S = args.slice(1, boardSize_N+1).join('');
    const targetBoard_E = args.slice(boardSize_N+1).join('');

    // Boards 

    return calculateMinimumLengthPath(boardSize_N, startBoard_S, targetBoard_E);


}

// Calculate minimum length path from board state A to B

function calculateMinimumLengthPath(boardSize_N, startBoard_S, targetBoard_E){

	// Boards already match

    if(startBoard_S === targetBoard_E){
    	return 0;
    }

    const answers = stepOrResolve(boardSize_N, [[startBoard_S, [], []]], targetBoard_E);

    console.log(total_moves)

	return answers.reduce((total, moves) => {
		return total + moves.reduce(calcChecksum, 0)
	}, 0) % 100000007;

}

// Calculate paths recursively

let total_moves = 0;
let boardHistory = {};

function stepOrResolve(boardSize_N, boards, targetBoard_E){

	let nextBoards = [];
	let solvedBoards = [];

	for(_board of boards){

		let [startBoard_S, moves, history] = _board;

		if(boardHistory[startBoard_S]) continue;
		if(history.includes(startBoard_S)) continue;
		history.push(startBoard_S);

		let wPosition = startBoard_S.indexOf(W);
		let wPositionCol = wPosition % boardSize_N;
		let wPositionRow = wPosition >= boardSize_N ? Math.floor(wPosition / boardSize_N) % boardSize_N : 0;

		let last_move = moves[moves.length -1];

	    for(direction of [L,R,U,D]){
	    	
			if     (direction === L && wPositionCol === boardSize_N - 1) continue;
			else if(direction === R && wPositionCol === 0) continue;
			else if(direction === U && wPositionRow === boardSize_N - 1) continue;
			else if(direction === D && wPositionRow === 0) continue;
			else if(direction === L && last_move === R) continue;
			else if(direction === R && last_move === L) continue;
			else if(direction === U && last_move === D) continue;
			else if(direction === D && last_move === U) continue;

			total_moves++;

			const board = createBoardFromMove(boardSize_N, startBoard_S, wPosition, direction);

			let _moves = moves.slice(0);
			_moves.push(direction);

			if(board === targetBoard_E){
				solvedBoards.push(_moves);
			} else {
				nextBoards.push([board, _moves, history.slice(0)]);
			}

	    }

	}

	boards.map(board => {
		board[2].map(state => {
			boardHistory[state] = true;
		})
	})

	if(solvedBoards.length > 0){
		return solvedBoards;
	} else if(nextBoards.length > 0) {
		return stepOrResolve(boardSize_N, nextBoards, targetBoard_E);
	} else {
		return [];
	}

}

// Calculate checksum

function calcChecksum(checksum, letter){
	return (checksum * 243 + asciiValue(letter)) % 100000007
}

function asciiValue(letter){
	if(letter === L) return 76;
	if(letter === R) return 82;
	if(letter === U) return 85;
	if(letter === D) return 68;
}

// Return resulting board from a move

let boardMoveCache = {};

function createBoardFromMove(boardSize_N, startBoard_S, wPosition, direction){
	let newBoard;

	if(boardMoveCache[startBoard_S+direction]) return boardMoveCache[startBoard_S+direction];

	if(direction === L){
		newBoard = startBoard_S.slice(0, wPosition) + startBoard_S.charAt(wPosition + 1) + W + startBoard_S.slice(wPosition + 2);
	}
	else if(direction === R){
		newBoard = startBoard_S.slice(0, wPosition - 1) + W + startBoard_S.charAt(wPosition - 1) + startBoard_S.slice(wPosition + 1);
	}
	else if(direction === U){
		newBoard = startBoard_S.slice(0, wPosition)  + startBoard_S.charAt(wPosition + boardSize_N) + startBoard_S.slice(wPosition + 1, wPosition + boardSize_N) + W + startBoard_S.slice(wPosition + boardSize_N + 1);
	}
	else if(direction === D){
		newBoard = startBoard_S.slice(0, wPosition - boardSize_N)  + W + startBoard_S.slice(wPosition - boardSize_N + 1, wPosition) + startBoard_S.charAt(wPosition - boardSize_N) + startBoard_S.slice(wPosition + 1);
	}

	boardMoveCache[startBoard_S+direction] = newBoard;

	return newBoard;
}


// Testing

function runTest(profile){
	const res = processData(profile.input);
	console.log(res, profile.answer, profile.answer === res)
}

function runTests(testProfiles){
	testProfiles.map(function(testProfile){
		const start = new Date();
		cache = {};
		runTest(testProfile);
		console.info('Execution time: %dms', new Date() - start)
	})
}

runTests([
	/*
	{
		input: "2\nWR\nBB\nWR\nBB",
		answer: 0
	},
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
	*/
	{
		input: "4\nRRRR\nRRRR\nBWBB\nBBBB\nBBBB\nBWBB\nRRRR\nRRRR",
		answer: 46012996
	},
]);