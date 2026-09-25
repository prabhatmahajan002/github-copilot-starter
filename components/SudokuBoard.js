'use client';

import { useEffect, useState } from 'react';
import Cell from './Cell';
import { getConflicts } from '../lib/sudokuValidator';

const SIZE = 9;
const EMPTY = 0;

// Copy a board so React state updates do not mutate the incoming puzzle.
const copyBoard = (board) => board.map((row) => [...row]);

// Collect every cell involved in a conflict on the current board.
const findConflictingCells = (board) => {
	const conflictKeys = new Set();

	board.forEach((row, rowIndex) => {
		row.forEach((value, colIndex) => {
			if (value === EMPTY) {
				return;
			}

			const conflicts = getConflicts(board, rowIndex, colIndex, value);
			if (conflicts.length > 0) {
				conflictKeys.add(`${rowIndex},${colIndex}`);
				conflicts.forEach((conflict) => {
					conflictKeys.add(`${conflict.row},${conflict.col}`);
				});
			}
		});
	});

	return [...conflictKeys].map((key) => {
		const [row, col] = key.split(',').map(Number);
		return { row, col };
	});
};

// Render and manage the interactive Sudoku board.
const SudokuBoard = ({
	puzzle = [],
	solution = [],
	difficulty = 'medium',
	board = [],
	onBoardChange = () => {},
	hintedCells = [],
}) => {
	const prefilledCells = puzzle.map((row) =>
		row.map((value) => value !== EMPTY),
	);
	const [conflictingCells, setConflictingCells] = useState([]);
	const [errorMessage, setErrorMessage] = useState('');

	// Clear board-local messages and conflicts when a new puzzle is loaded.
	useEffect(() => {
		setConflictingCells([]);
		setErrorMessage('');
	}, [puzzle]);

	// Check whether a board position is currently marked as conflicting.
	const isConflicting = (row, col) =>
		conflictingCells.some(
			(conflict) => conflict.row === row && conflict.col === col,
		);

	// Determine whether a cell was filled by the hint action.
	const isHinted = (row, col) =>
		hintedCells.some((cell) => cell.row === row && cell.col === col);

	// Handle all editable cells through the single board-level change listener.
	const handleBoardChange = (event) => {
		try {
			const input = event.target;
			if (!(input instanceof HTMLInputElement)) {
				return;
			}

			const row = Number(input.dataset.row);
			const col = Number(input.dataset.col);
			if (
				!Number.isInteger(row) ||
				!Number.isInteger(col) ||
				row < 0 ||
				row >= SIZE ||
				col < 0 ||
				col >= SIZE ||
				prefilledCells[row]?.[col] ||
				isHinted(row, col)
			) {
				return;
			}

			const nextValue = input.value.replace(/[^1-9]/g, '').slice(0, 1);
			const nextBoard = copyBoard(board);
			nextBoard[row][col] = nextValue ? Number(nextValue) : EMPTY;

			setConflictingCells(findConflictingCells(nextBoard));
			onBoardChange(nextBoard);
			setErrorMessage('');
		} catch (error) {
			setErrorMessage('We could not update that Sudoku cell. Please try again.');
			console.error('Sudoku cell update failed:', error);
		}
	};

	return (
		<section
			aria-label={`${difficulty} Sudoku board`}
			className="flex flex-col items-center gap-3 text-zinc-900 dark:text-zinc-100"
			data-difficulty={difficulty}
			data-solution-ready={solution.length === SIZE}
		>
			<div
				aria-label="Sudoku grid"
				className="grid grid-cols-9 border-2 border-zinc-800 dark:border-zinc-300"
				onChange={handleBoardChange}
				role="grid"
			>
				{board.map((row, rowIndex) =>
					row.map((value, colIndex) => (
						<Cell
							col={colIndex}
							isConflicting={isConflicting(rowIndex, colIndex)}
							isHinted={isHinted(rowIndex, colIndex)}
							isPrefilled={prefilledCells[rowIndex]?.[colIndex] ?? false}
							key={`${rowIndex}-${colIndex}`}
							onChange={handleBoardChange}
							row={rowIndex}
							value={value === EMPTY ? '' : value}
						/>
					)),
				)}
			</div>
			{errorMessage && (
				<p aria-live="polite" className="text-sm text-red-700" role="alert">
					{errorMessage}
				</p>
			)}
		</section>
	);
};

export default SudokuBoard;