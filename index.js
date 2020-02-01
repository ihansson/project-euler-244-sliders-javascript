// Helpers

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

// Solution

function processData(input) {
    
    const args = input.split("\n")

    const N = parseInt(args[0]);
    const S = args.slice(1, N+1);
    const E = args.slice(N+1);
    // console.log(N,S,E)

    const letters = ['L','R','U','D'];

    let whitePosition = [0,0];
    for(let x = 0; x < N; x++){
    	let wPos = S[x].indexOf('W');
    	if(wPos > -1){
    		whitePosition = [x, wPos]
    		break;
    	}
    }

    let res = broadSearch(letters, [[S, whitePosition, [], 0]], E, 0);

    return res;

}

function broadSearch(letters, searches, target, move){
	let continuations = [];
	let answers = [];
	for(search of searches){
		let [board, whitePosition, moves, checkSum] = search;
		for(letter of letters){
			if(movePossible(board, whitePosition, letter)){
				let [_board, _whitePosition] = calculateMove(board, whitePosition, letter);
				let _moves = moves.slice(0);
				let _checkSum = calcChecksum(checkSum, letter)
				_moves.push(letter);
				if(compareBoards(_board, target)){
					answers.push(_checkSum)
					// answers.push([_board, _whitePosition, _moves, _checkSum, letter])
				} else {
					continuations.push([_board, _whitePosition, _moves, _checkSum])
				}
			}
		}
	}
	if(answers.length > 0){
		return answers.reduce((total, answer) => total + answer, 0);
	} else if(continuations.length > 0){
		return broadSearch(letters, continuations, target);
	}
}

function movePossible(board, whitePosition, direction){

	if(direction == 'R' && whitePosition[0] === 0) return false;
	else if(direction == 'D' && whitePosition[1] === 0) return false;
	else if(direction == 'L' && whitePosition[0] === board.length - 1) return false;
	else if(direction == 'U' && whitePosition[1] === board.length - 1) return false;

	return true;

}

function calculateMove(board, whitePosition, direction){

	let swapPosition = whitePosition.slice(0);
	if(direction == 'R') swapPosition[0] -= 1;
	else if(direction == 'D') swapPosition[1] -= 1;
	else if(direction == 'L') swapPosition[0] += 1;
	else if(direction == 'U') swapPosition[1] += 1;

	let newBoard = swapBoardPositions(board, whitePosition, swapPosition);

	return [newBoard, swapPosition];

}

function swapBoardPositions(board, A, B){
	let newBoard = board.slice(0);
	let x = board[A[1]].charAt(A[0]);
	let y = board[B[1]].charAt(B[0]);
	newBoard[A[1]] = newBoard[A[1]].replaceAt(A[0], y);
	newBoard[B[1]] = newBoard[B[1]].replaceAt(B[0], x);
	return newBoard;
}

function compareBoards(A, B){
	return JSON.stringify(A) == JSON.stringify(B)
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
		answer: 19761398
	}
]

function test(profile){
	const res =processData(profile.input);
	console.log(res, profile.answer, profile.answer === res)
}

tests.map(function(i){
	console.log(i);
})
test(tests[1]);