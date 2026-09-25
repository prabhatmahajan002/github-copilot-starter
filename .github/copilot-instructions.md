# Project Instructions for Copilot

This project refactors a legacy vanilla JavaScript Sudoku game into a 
modern React + NextJS application.

## Coding Standards
- Use ES6+ JavaScript only. Never use `var` — use `let` and `const`.
- Use arrow functions where appropriate.
- Use event delegation for event listeners instead of attaching 
  listeners to individual elements.
- All functions must have comments explaining their purpose in the 
  overall program (e.g., "// Populate board with initial numbers").
- Use try/catch blocks for error handling, with user-friendly 
  notifications on failure.

## Framework
- Use React with NextJS (App Router).
- Use ESLint.
- Split the app into small, reusable components (e.g., separate 
  components for the game board and the Top 10 scores table).

## Style
- Use modular CSS or Tailwind — keep it accessible and responsive.
- 3x3 Sudoku squares must alternate in color.
- Support light and dark mode via a toggle button.