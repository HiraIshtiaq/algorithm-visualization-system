export function sudokuSolver(userBoard) {
    const steps = [];

    // Use user board if provided, otherwise use default
    const initialBoard = userBoard ? JSON.parse(JSON.stringify(userBoard)) : [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    steps.push({
        board: JSON.parse(JSON.stringify(initialBoard)),
        explanation: "Start",
        description: "Starting Sudoku Solver",
        row: -1,
        col: -1
    });

    // solving algorithm
    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) return false;
            if (board[i][col] === num) return false;
            const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            const boxCol = 3 * Math.floor(col / 3) + i % 3;
            if (board[boxRow][boxCol] === num) return false;
        }
        return true;
    }

    function solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;

                            steps.push({
                                board: JSON.parse(JSON.stringify(board)),
                                explanation: "Place",
                                description: `Placing ${num} at (${row + 1}, ${col + 1})`,
                                row: row,
                                col: col
                            });

                            if (solve(board)) {
                                return true;
                            }

                            board[row][col] = 0;
                            steps.push({
                                board: JSON.parse(JSON.stringify(board)),
                                explanation: "Backtrack",
                                description: `Backtracking from (${row + 1}, ${col + 1})`,
                                row: row,
                                col: col
                            });
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    const boardCopy = JSON.parse(JSON.stringify(initialBoard));
    solve(boardCopy);

    steps.push({
        board: boardCopy,
        explanation: "Complete",
        description: "Sudoku Solved Successfully",
        row: -1,
        col: -1
    });

    return steps;
}