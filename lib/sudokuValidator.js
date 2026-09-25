const SIZE = 9;
const EMPTY = 0;

// Find all existing cells that conflict with a proposed number.
export const getConflicts = (board, row, col, number) => {
	const conflicts = [];
	const conflictKeys = new Set();

	// Add a conflict once even when it belongs to multiple checked groups.
	const addConflict = (conflictRow, conflictCol) => {
		if (conflictRow === row && conflictCol === col) {
			return;
		}

		const key = `${conflictRow},${conflictCol}`;
		if (!conflictKeys.has(key)) {
			conflictKeys.add(key);
			conflicts.push({ row: conflictRow, col: conflictCol });
		}
	};

	for (let column = 0; column < SIZE; column += 1) {
		if (board[row][column] === number) {
			addConflict(row, column);
		}
	}

	for (let boardRow = 0; boardRow < SIZE; boardRow += 1) {
		if (board[boardRow][col] === number) {
			addConflict(boardRow, col);
		}
	}

	const startRow = row - (row % 3);
	const startCol = col - (col % 3);

	for (let rowOffset = 0; rowOffset < 3; rowOffset += 1) {
		for (let colOffset = 0; colOffset < 3; colOffset += 1) {
			const conflictRow = startRow + rowOffset;
			const conflictCol = startCol + colOffset;

			if (board[conflictRow][conflictCol] === number) {
				addConflict(conflictRow, conflictCol);
			}
		}
	}

	return conflicts;
};

// Determine whether every cell on a board contains a number.
export const isBoardComplete = (board) =>
	board.every((row) => row.every((cell) => cell !== EMPTY));

// Determine whether two Sudoku boards have identical dimensions and values.
export const boardsMatch = (board, solution) => {
	if (board.length !== solution.length) {
		return false;
	}

	return board.every(
		(row, rowIndex) =>
			row.length === solution[rowIndex].length &&
			row.every((cell, colIndex) => cell === solution[rowIndex][colIndex]),
	);
};
