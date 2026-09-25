// Render one controlled Sudoku cell with its current visual state.
const Cell = ({
	value = '',
	isPrefilled = false,
	isConflicting = false,
	isHinted = false,
	onChange,
	row,
	col,
}) => {
	const isShadedBox =
		(Math.floor(row / 3) + Math.floor(col / 3)) % 2 === 1;
	const cellClasses = [
		'h-11 w-11 border border-zinc-300 text-center text-lg font-semibold outline-none transition-colors',
		'focus:z-10 focus:border-sky-500 focus:ring-2 focus:ring-sky-200',
		isPrefilled
			? isShadedBox
				? 'bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100'
				: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-100'
			: isShadedBox
				? 'bg-slate-50 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100'
				: 'bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
		isHinted ? 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100' : '',
		isConflicting
			? 'border-red-500 bg-red-100 text-red-700 focus:border-red-600 focus:ring-red-200 dark:bg-red-900 dark:text-red-100'
			: '',
	].filter(Boolean).join(' ');

	return (
		<input
			aria-label={`Sudoku cell, row ${row + 1}, column ${col + 1}`}
			aria-invalid={isConflicting}
			className={cellClasses}
			data-col={col}
			data-row={row}
			disabled={isPrefilled || isHinted}
			inputMode="numeric"
			maxLength={1}
			onChange={onChange}
			pattern="[1-9]"
			type="text"
			value={value || ''}
		/>
	);
};

export default Cell;
