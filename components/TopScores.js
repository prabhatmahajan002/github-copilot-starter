'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'sudokuTopScores';
const MAX_SCORES = 10;

// Format a stored score duration as minutes and seconds for display.
const formatScoreTime = (time) => {
	const minutes = Math.floor(time / 60).toString().padStart(2, '0');
	const seconds = (time % 60).toString().padStart(2, '0');
	return `${minutes}:${seconds}`;
};

// Read valid scores from localStorage without breaking the game if storage fails.
const readScores = () => {
	try {
		const storedScores = window.localStorage.getItem(STORAGE_KEY);
		const parsedScores = storedScores ? JSON.parse(storedScores) : [];

		return Array.isArray(parsedScores)
			? parsedScores.filter(
					(score) =>
						typeof score?.name === 'string' &&
						Number.isFinite(score?.time) &&
						typeof score?.level === 'string' &&
						Number.isFinite(score?.hints),
				)
			: [];
	} catch (error) {
		console.error('Could not read Sudoku scores:', error);
		return [];
	}
};

// Render and update the top scores for the selected difficulty.
const TopScores = ({ completion = null, level = 'easy' }) => {
	const [scores, setScores] = useState([]);
	const [errorMessage, setErrorMessage] = useState('');

	// Load saved scores after the component reaches the browser.
	useEffect(() => {
		setScores(readScores());
	}, []);

	// Prompt for a name and save a newly completed qualifying game once.
	useEffect(() => {
		if (!completion) {
			return;
		}

		try {
			const storedScores = readScores();
			const levelScores = storedScores
				.filter((score) => score.level === completion.level)
				.sort((first, second) => first.time - second.time);

			if (
				levelScores.length >= MAX_SCORES &&
				completion.time >= levelScores[MAX_SCORES - 1].time
			) {
				setScores(storedScores);
				return;
			}

			const enteredName = window.prompt(
				`You made the ${completion.level} top 10! Enter your name:`,
			);
			if (enteredName === null) {
				setScores(storedScores);
				return;
			}

			const newScore = {
				name: enteredName.trim() || 'Anonymous',
				time: completion.time,
				level: completion.level,
				hints: completion.hints,
			};
			const updatedLevelScores = [...levelScores, newScore]
				.sort((first, second) => first.time - second.time)
				.slice(0, MAX_SCORES);
			const otherLevelScores = storedScores.filter(
				(score) => score.level !== completion.level,
			);
			const updatedScores = [...otherLevelScores, ...updatedLevelScores].sort(
				(first, second) => first.time - second.time,
			);

			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
			setScores(updatedScores);
			setErrorMessage('');
		} catch (error) {
			setErrorMessage('Scores could not be saved on this device.');
			console.error('Could not save Sudoku score:', error);
		}
	}, [completion]);

	const visibleScores = scores
		.filter((score) => score.level === level)
		.sort((first, second) => first.time - second.time)
		.slice(0, MAX_SCORES);

	return (
		<section
			aria-labelledby="top-scores-heading"
			className="w-full max-w-xl rounded border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
		>
			<h2
				className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100"
				id="top-scores-heading"
			>
				Top 10 Scores - {level[0].toUpperCase() + level.slice(1)}
			</h2>
			<table className="w-full border-collapse text-left text-sm">
				<caption className="sr-only">
					Top Sudoku scores for {level} difficulty
				</caption>
				<thead className="border-b border-zinc-300 text-zinc-600 dark:border-zinc-600 dark:text-zinc-300">
					<tr>
						<th className="px-2 py-2" scope="col">Rank</th>
						<th className="px-2 py-2" scope="col">Name</th>
						<th className="px-2 py-2" scope="col">Time</th>
						<th className="px-2 py-2" scope="col">Level</th>
						<th className="px-2 py-2" scope="col">Hints</th>
					</tr>
				</thead>
				<tbody>
					{visibleScores.length > 0 ? (
						visibleScores.map((score, index) => (
							<tr
								className="even:bg-zinc-100 dark:even:bg-zinc-800"
								key={`${score.name}-${score.time}-${index}`}
							>
								<td className="px-2 py-2 text-zinc-700 dark:text-zinc-200">{index + 1}</td>
								<td className="px-2 py-2 text-zinc-900 dark:text-zinc-100">{score.name}</td>
								<td className="px-2 py-2 text-zinc-700 dark:text-zinc-200">{formatScoreTime(score.time)}</td>
								<td className="px-2 py-2 capitalize text-zinc-700 dark:text-zinc-200">{score.level}</td>
								<td className="px-2 py-2 text-zinc-700 dark:text-zinc-200">{score.hints}</td>
							</tr>
						))
					) : (
						<tr>
							<td
								className="px-2 py-4 text-center text-zinc-500 dark:text-zinc-400"
								colSpan={5}
							>
								No scores yet.
							</td>
						</tr>
					)}
				</tbody>
			</table>
			{errorMessage && (
				<p aria-live="polite" className="mt-3 text-sm text-red-700 dark:text-red-300" role="alert">
					{errorMessage}
				</p>
			)}
		</section>
	);
};

export default TopScores;
