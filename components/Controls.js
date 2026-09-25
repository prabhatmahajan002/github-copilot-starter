'use client';

const DIFFICULTIES = [
	{ label: 'Easy', value: 'easy' },
	{ label: 'Medium', value: 'medium' },
	{ label: 'Hard', value: 'hard' },
];

// Render difficulty and game action controls for the Sudoku application.
const Controls = ({
	difficulty = 'medium',
	onDifficultyChange = () => {},
	onNewGame = () => {},
	onCheck = () => {},
	onHint = () => {},
	isDarkMode = false,
	onToggleDarkMode = () => {},
}) => (
	<div
		aria-label="Sudoku controls"
		className="flex flex-wrap items-end justify-center gap-3"
	>
		<label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
			<span>Difficulty</span>
			<select
				className="h-10 rounded border border-zinc-300 bg-white px-3 text-zinc-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
				id="difficulty"
				onChange={(event) => onDifficultyChange(event.target.value)}
				value={difficulty}
			>
				{DIFFICULTIES.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</label>
		<button
			className="h-10 rounded bg-sky-600 px-4 font-medium text-white transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
			onClick={onNewGame}
			type="button"
		>
			New Game
		</button>
		<button
			className="h-10 rounded border border-zinc-300 bg-white px-4 font-medium text-zinc-800 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
			onClick={onCheck}
			type="button"
		>
			Check
		</button>
		<button
			className="h-10 rounded border border-amber-300 bg-amber-100 px-4 font-medium text-amber-900 transition-colors hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
			onClick={onHint}
			type="button"
		>
			Hint
		</button>
		<button
			aria-pressed={isDarkMode}
			className="h-10 rounded border border-zinc-300 bg-white px-4 font-medium text-zinc-800 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
			onClick={onToggleDarkMode}
			type="button"
		>
			{isDarkMode ? 'Light Mode' : 'Dark Mode'}
		</button>
	</div>
);

export default Controls;
