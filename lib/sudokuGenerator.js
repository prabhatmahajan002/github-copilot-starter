const SIZE = 9;
const EMPTY = 0;
const MAX_SOLUTIONS = 2;

const CLUE_COUNTS = {
	easy: 45,
	medium: 35,
	hard: 25,
};

// Create a deep copy so board generation and validation do not share rows.
export const deepCopy = (board) => board.map((row) => [...row]);

// Create a blank nine-by-nine Sudoku board.
export const createEmptyBoard = () =>
	Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));

// Determine whether a candidate number is valid at a board position.
export const isSafe = (board, row, col, number) => {
	for (let index = 0; index < SIZE; index += 1) {
		if (board[row][index] === number || board[index][col] === number) {
			return false;
		}
	}

	const startRow = row - (row % 3);
	const startCol = col - (col % 3);

	for (let rowOffset = 0; rowOffset < 3; rowOffset += 1) {
		for (let colOffset = 0; colOffset < 3; colOffset += 1) {
			if (board[startRow + rowOffset][startCol + colOffset] === number) {
				return false;
			}
		}
	}

	return true;
};

// Randomize an array in place so generated boards do not follow one pattern.
const shuffle = (items) => {
	for (let index = items.length - 1; index > 0; index -= 1) {
		const randomIndex = Math.floor(Math.random() * (index + 1));
		[items[index], items[randomIndex]] = [items[randomIndex], items[index]];
	}

	return items;
};

// Fill every empty cell using randomized recursive backtracking.
export const fillBoard = (board) => {
	for (let row = 0; row < SIZE; row += 1) {
		for (let col = 0; col < SIZE; col += 1) {
			if (board[row][col] !== EMPTY) {
				continue;
			}

			const candidates = shuffle(
				Array.from({ length: SIZE }, (_, index) => index + 1),
			);

			for (const candidate of candidates) {
				if (isSafe(board, row, col, candidate)) {
					board[row][col] = candidate;

					if (fillBoard(board)) {
						return true;
					}

					board[row][col] = EMPTY;
				}
			}

			return false;
		}
	}

	return true;
};

// Count solutions while stopping as soon as the board has two solutions.
const countSolutions = (board, limit = MAX_SOLUTIONS) => {
	let solutionCount = 0;

	const search = () => {
		if (solutionCount >= limit) {
			return;
		}

		let emptyCell = null;

		for (let row = 0; row < SIZE && !emptyCell; row += 1) {
			for (let col = 0; col < SIZE; col += 1) {
				if (board[row][col] === EMPTY) {
					emptyCell = { row, col };
					break;
				}
			}
		}

		if (!emptyCell) {
			solutionCount += 1;
			return;
		}

		const { row, col } = emptyCell;
		for (let candidate = 1; candidate <= SIZE; candidate += 1) {
			if (isSafe(board, row, col, candidate)) {
				board[row][col] = candidate;
				search();
				board[row][col] = EMPTY;

				if (solutionCount >= limit) {
					return;
				}
			}
		}
	};

	search();
	return solutionCount;
};

// Remove cells while retaining exactly one solution at every accepted step.
export const removeCells = (board, clues) => {
	if (!Number.isInteger(clues) || clues < 0 || clues > SIZE * SIZE) {
		throw new Error('The clue count must be an integer from 0 to 81.');
	}

	const cells = shuffle(
		Array.from({ length: SIZE * SIZE }, (_, index) => index),
	);
	const cellsToRemove = SIZE * SIZE - clues;
	let removedCells = 0;

	for (const cellIndex of cells) {
		if (removedCells === cellsToRemove) {
			break;
		}

		const row = Math.floor(cellIndex / SIZE);
		const col = cellIndex % SIZE;
		const originalValue = board[row][col];

		if (originalValue === EMPTY) {
			continue;
		}

		board[row][col] = EMPTY;
		if (countSolutions(board) === 1) {
			removedCells += 1;
		} else {
			board[row][col] = originalValue;
		}
	}

	if (removedCells !== cellsToRemove) {
		throw new Error('Unable to create a puzzle with the requested clue count.');
	}

	return board;
};

// Generate a solved board and a uniquely solvable puzzle at the requested difficulty.
export const generatePuzzle = (difficulty = 'medium') => {
	try {
		const normalizedDifficulty = String(difficulty).toLowerCase();
		const clues = CLUE_COUNTS[normalizedDifficulty];

		if (!clues) {
			throw new Error('Difficulty must be easy, medium, or hard.');
		}

		const solution = createEmptyBoard();
		if (!fillBoard(solution)) {
			throw new Error('Unable to generate a complete Sudoku solution.');
		}

		const puzzle = deepCopy(solution);
		removeCells(puzzle, clues);

		return {
			puzzle,
			solution: deepCopy(solution),
		};
	} catch (error) {
		throw new Error(`Sudoku generation failed: ${error.message}`);
	}
};
