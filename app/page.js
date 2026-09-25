'use client';

import { useEffect, useState } from 'react';
import SudokuBoard from '../components/SudokuBoard';
import Controls from '../components/Controls';
import TopScores from '../components/TopScores';
import { generatePuzzle } from '../lib/sudokuGenerator';
import { boardsMatch, isBoardComplete } from '../lib/sudokuValidator';

const INITIAL_DIFFICULTY = 'easy';
const EMPTY = 0;

// Format elapsed seconds as a compact minutes-and-seconds display.
const formatElapsedTime = (elapsedSeconds) => {
  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

// Copy a board before storing it in state so generated data stays immutable.
const copyBoard = (board) => board.map((row) => [...row]);

export default function Home() {
  const [difficulty, setDifficulty] = useState(INITIAL_DIFFICULTY);
  const [puzzle, setPuzzle] = useState([]);
  const [solution, setSolution] = useState([]);
  const [board, setBoard] = useState([]);
  const [hintedCells, setHintedCells] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [gameMessage, setGameMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [completion, setCompletion] = useState(null);

  useEffect(() => {
    try {
      const generatedGame = generatePuzzle(INITIAL_DIFFICULTY);
      setPuzzle(generatedGame.puzzle);
      setSolution(generatedGame.solution);
      setBoard(copyBoard(generatedGame.puzzle));
      setCompletion(null);
    } catch (error) {
      setErrorMessage('We could not start a new Sudoku game. Please try again.');
      console.error('Initial Sudoku generation failed:', error);
    }
  }, []);

  useEffect(() => {
    if (board.length === 0 || isSolved) {
      return undefined;
    }

    const timerId = setInterval(() => {
      setElapsedSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [board.length, isSolved]);

  const handleNewGame = () => {
    try {
      const generatedGame = generatePuzzle(difficulty);
      setPuzzle(generatedGame.puzzle);
      setSolution(generatedGame.solution);
      setBoard(copyBoard(generatedGame.puzzle));
      setHintedCells([]);
      setElapsedSeconds(0);
      setHintCount(0);
      setGameMessage('');
      setErrorMessage('');
      setIsSolved(false);
      setCompletion(null);
    } catch (error) {
      setErrorMessage('We could not create that Sudoku game. Please try again.');
      console.error('New Sudoku game generation failed:', error);
    }
  };

  const handleDifficultyChange = (nextDifficulty) => {
    setDifficulty(nextDifficulty);
    setGameMessage('');
  };

  // Evaluate a changed board and publish a completion event when it is solved.
  const processBoardChange = (nextBoard, nextHintCount = hintCount) => {
    const solved =
      nextBoard.length > 0 &&
      isBoardComplete(nextBoard) &&
      boardsMatch(nextBoard, solution);

    setBoard(nextBoard);
    setIsSolved(solved);
    if (solved) {
      setGameMessage('Congratulations! You solved it!');
      if (!isSolved) {
        setCompletion({
          hints: nextHintCount,
          level: difficulty,
          time: elapsedSeconds,
        });
      }
    } else {
      setCompletion(null);
      setGameMessage('');
    }

    return solved;
  };

  const handleCheck = () => {
    try {
      if (board.length === 0) {
        return;
      }

      const solved = isBoardComplete(board) && boardsMatch(board, solution);
      setIsSolved(solved);
      setGameMessage(
        solved
          ? 'Congratulations! You solved it!'
          : 'Some cells are incorrect.',
      );
      if (solved && !isSolved) {
        setCompletion({ hints: hintCount, level: difficulty, time: elapsedSeconds });
      }
    } catch (error) {
      setErrorMessage('We could not check this Sudoku board. Please try again.');
      console.error('Sudoku check failed:', error);
    }
  };

  const handleHint = () => {
    try {
      const emptyCells = [];
      board.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          if (value === EMPTY && solution[rowIndex]?.[colIndex]) {
            emptyCells.push({ row: rowIndex, col: colIndex });
          }
        });
      });

      if (emptyCells.length === 0) {
        setGameMessage('There are no empty cells left to hint.');
        return;
      }

      const selectedCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const nextBoard = copyBoard(board);
      nextBoard[selectedCell.row][selectedCell.col] =
        solution[selectedCell.row][selectedCell.col];

      const nextHintCount = hintCount + 1;
        const solved = processBoardChange(nextBoard, nextHintCount);
      setHintedCells((currentHints) => [...currentHints, selectedCell]);
      setHintCount(nextHintCount);
        if (!solved) {
          setGameMessage('A correct cell has been filled in.');
        }
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('We could not provide a hint. Please try again.');
      console.error('Sudoku hint failed:', error);
    }
  };

  const handleBoardChange = (nextBoard) => {
    try {
      processBoardChange(nextBoard);
    } catch (error) {
      setErrorMessage('We could not update the Sudoku board. Please try again.');
      console.error('Sudoku board update failed:', error);
    }
  };

  return (
    <main className={`${isDarkMode ? 'dark' : ''} flex min-h-screen flex-col items-center gap-6 bg-zinc-50 px-4 py-10 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100`}>
      <header className="text-center">
        <h1 className="text-3xl font-bold">Sudoku</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {difficulty[0].toUpperCase() + difficulty.slice(1)} difficulty
        </p>
      </header>
      <Controls
        difficulty={difficulty}
        onCheck={handleCheck}
        onDifficultyChange={handleDifficultyChange}
        onHint={handleHint}
        onNewGame={handleNewGame}
        onToggleDarkMode={() => setIsDarkMode((currentMode) => !currentMode)}
        isDarkMode={isDarkMode}
      />
      <div className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
        <span>Time: {formatElapsedTime(elapsedSeconds)}</span>
        <span>Hints: {hintCount}</span>
      </div>
      {puzzle.length > 0 && (
        <SudokuBoard
          board={board}
          difficulty={difficulty}
          hintedCells={hintedCells}
          onBoardChange={handleBoardChange}
          puzzle={puzzle}
          solution={solution}
        />
      )}
      <TopScores completion={completion} level={difficulty} />
      {gameMessage && (
        <p aria-live="polite" className="font-medium text-sky-700">
          {gameMessage}
        </p>
      )}
      {errorMessage && (
        <p aria-live="assertive" className="font-medium text-red-700" role="alert">
          {errorMessage}
        </p>
      )}
    </main>
  );
}