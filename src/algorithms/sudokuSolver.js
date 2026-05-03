
export function sudokuSolver(userBoard, boardSize = 9) {
  const steps = [];
  const movesLog = [];
  const N = boardSize;
  const boxSize = Math.sqrt(N); // 2 for 4x4, 3 for 9x9

  const DEFAULT_9x9 = [
    [5,3,0,0,7,0,0,0,0], [6,0,0,1,9,5,0,0,0], [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3], [4,0,0,8,0,3,0,0,1], [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0], [0,0,0,4,1,9,0,0,5], [0,0,0,0,8,0,0,7,9]
  ];

  const DEFAULT_4x4 = [
    [1, 0, 0, 4],
    [0, 4, 1, 0],
    [0, 1, 4, 0],
    [4, 0, 0, 1]
  ];

  const initialBoard = userBoard
    ? userBoard.map(r => [...r])
    : (N === 4 ? DEFAULT_4x4 : DEFAULT_9x9).map(r => [...r]);

  steps.push({
    board: initialBoard.map(r => [...r]),
    explanation: "Start",
    description: `Starting ${N}×${N} Sudoku Solver`,
    row: -1, col: -1, movesLog: []
  });

  function isValid(board, row, col, num) {
    for (let i = 0; i < N; i++) {
      if (board[row][i] === num) return false;
      if (board[i][col] === num) return false;
      const br = boxSize * Math.floor(row / boxSize) + Math.floor(i / boxSize);
      const bc = boxSize * Math.floor(col / boxSize) + i % boxSize;
      if (board[br][bc] === num) return false;
    }
    return true;
  }

  function solve(board) {
    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= N; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              movesLog.push({ step: movesLog.length + 1, action: 'Place', row: row + 1, col: col + 1, value: num });
              steps.push({
                board: board.map(r => [...r]),
                explanation: "Place",
                description: `Placing ${num} at (${row + 1}, ${col + 1})`,
                row, col, movesLog: movesLog.map(m => ({ ...m }))
              });

              if (solve(board)) return true;

              board[row][col] = 0;
              movesLog.push({ step: movesLog.length + 1, action: 'Backtrack', row: row + 1, col: col + 1, value: num });
              steps.push({
                board: board.map(r => [...r]),
                explanation: "Backtrack",
                description: `Backtracking from (${row + 1}, ${col + 1})`,
                row, col, movesLog: movesLog.map(m => ({ ...m }))
              });
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  const boardCopy = initialBoard.map(r => [...r]);
  solve(boardCopy);

  steps.push({
    board: boardCopy,
    explanation: "Complete",
    description: `${N}×${N} Sudoku Solved!`,
    row: -1, col: -1, movesLog: movesLog.map(m => ({ ...m }))
  });

  return steps;
}
