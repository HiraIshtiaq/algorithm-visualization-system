// export async function nQueens(
//   n,
//   setBoard,
//   setCurrentRow,
//   setCurrentCol,
//   setConflictCells,
//   setSolutions,
//   setMessage,
//   getDelay,
//   isPausedRef,
//   isStoppedRef
// ) {
 
//   // ── Board and solution counter ─────────────────
//   let board     = Array.from({ length: n }, () => Array(n).fill(0));
//   let solutionCount = 0;
 
//   // ── Wait for delay + pause support ────────────
//   async function wait() {
//     await new Promise(res => setTimeout(res, getDelay()));
//     while (isPausedRef.current && !isStoppedRef.current) {
//       await new Promise(res => setTimeout(res, 100));
//     }
//   }
 
//   // ── Check if placing a queen at (row, col) is safe ──
//   function isSafe(row, col) {
 
//     // Check same column above
//     for (let i = 0; i < row; i++) {
//       if (board[i][col] === 1) return false;
//     }
 
//     // Check upper-left diagonal
//     for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
//       if (board[i][j] === 1) return false;
//     }
 
//     // Check upper-right diagonal
//     for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
//       if (board[i][j] === 1) return false;
//     }
 
//     return true;
//   }
 
//   // ── Find which existing queens conflict with (row, col) ──
//   function getConflicts(row, col) {
//     let conflicts = [];
 
//     for (let i = 0; i < row; i++) {
//       if (board[i][col] === 1) conflicts.push({ r: i, c: col });
//     }
 
//     for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
//       if (board[i][j] === 1) conflicts.push({ r: i, c: j });
//     }
 
//     for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
//       if (board[i][j] === 1) conflicts.push({ r: i, c: j });
//     }
 
//     return conflicts;
//   }
 
//   // ── Copy the board so React re-renders it ─────
//   function updateBoard() {
//     setBoard(board.map(row => [...row]));
//   }
 
//   // ── Main backtracking function ─────────────────
//   async function solve(row) {
 
//     if (isStoppedRef.current) return;
 
//     // All rows filled — solution found!
//     if (row === n) {
//       solutionCount++;
//       setSolutions(solutionCount);
//       setMessage(`Solution #${solutionCount} found!`);
//       updateBoard();
//       await wait();
//       return;
//     }
 
//     // Try placing a queen in each column of this row
//     for (let col = 0; col < n; col++) {
 
//       if (isStoppedRef.current) return;
 
//       // Show which cell we are trying
//       setCurrentRow(row);
//       setCurrentCol(col);
//       setMessage(`Trying Queen at row ${row}, col ${col}...`);
//       await wait();
//       if (isStoppedRef.current) return;
 
//       if (isSafe(row, col)) {
 
//         // Place the queen
//         board[row][col] = 1;
//         updateBoard();
//         setConflictCells([]);
//         setMessage(`Placed Queen at row ${row}, col ${col}`);
//         await wait();
//         if (isStoppedRef.current) return;
 
//         // Move to next row
//         await solve(row + 1);
//         if (isStoppedRef.current) return;
 
//         // Backtrack — remove the queen
//         board[row][col] = 0;
//         updateBoard();
//         setMessage(`Backtracking from row ${row}, col ${col}`);
//         await wait();
 
//       } else {
 
//         // Show the conflicting queens in red
//         setConflictCells(getConflicts(row, col));
//         setMessage(`Conflict at row ${row}, col ${col} — backtracking`);
//         await wait();
//         if (isStoppedRef.current) return;
//         setConflictCells([]);
 
//       }
//     }
//   }
 
//   // ── Kick off the algorithm ─────────────────────
//   setMessage(`Solving ${n}-Queens problem...`);
//   await wait();
//   if (isStoppedRef.current) return;
 
//   await solve(0);
 
//   // ── Show final result ──────────────────────────
//   if (!isStoppedRef.current) {
//     setCurrentRow(null);
//     setCurrentCol(null);
//     setConflictCells([]);
//     if (solutionCount === 0) {
//       setMessage(`No solution exists for ${n}-Queens.`);
//     } else {
//       setMessage(`Done! Found ${solutionCount} solution(s) for ${n}-Queens.`);
//     }
//   }
 
// }

export async function nQueens(
  n,
  setBoard,
  setCurrentRow,
  setCurrentCol,
  setConflictCells,
  setSolutions,
  setMessage,
  getDelay,
  isPausedRef,
  isStoppedRef
) {

  // ── Wait helper ────────────────────────────────────────────────────────────
  async function wait(multiplier = 1) {
    await new Promise(res => setTimeout(res, getDelay() * multiplier));
    while (isPausedRef.current && !isStoppedRef.current) {
      await new Promise(res => setTimeout(res, 100));
    }
  }

  // ── Build board from cols array ────────────────────────────────────────────
  function buildBoard(cols, upToRow) {
    let board = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r <= upToRow && r < cols.length; r++) {
      if (cols[r] >= 0) board[r][cols[r]] = 1;
    }
    return board;
  }

  const ALL_COLS = (1 << n) - 1;

  // ── DP table ───────────────────────────────────────────────────────────────
  let dpCurrent = [{ cols: [], colMask: 0, ldMask: 0, rdMask: 0 }];

  setMessage(`Starting DP bottom-up for ${n}-Queens...`);
  await wait();
  if (isStoppedRef.current) return;

  // ── Row-by-row DP ──────────────────────────────────────────────────────────
  for (let row = 0; row < n; row++) {

    if (isStoppedRef.current) return;

    setCurrentRow(row);
    setCurrentCol(null);
    setMessage(`Row ${row}: checking ${dpCurrent.length} partial state(s)...`);
    await wait();
    if (isStoppedRef.current) return;

    let dpNext = [];

    for (let stateIdx = 0; stateIdx < dpCurrent.length; stateIdx++) {

      let { cols, colMask, ldMask, rdMask } = dpCurrent[stateIdx];
      let blocked = colMask | ldMask | rdMask;
      let placedInThisState = false; // track if we placed at least once

      for (let col = 0; col < n; col++) {

        if (isStoppedRef.current) return;

        let bit = 1 << col;

        // Show current board state (queens placed so far in this state)
        setBoard(buildBoard(cols, row - 1));
        setCurrentRow(row);
        setCurrentCol(col);
        await wait(0.6);
        if (isStoppedRef.current) return;

        if (blocked & bit) {
          // ── BLOCKED: flash conflict, then clear ───────────────────────────
          setConflictCells([{ r: row, c: col }]);
          setMessage(`Row ${row}, Col ${col} — attacked ✗`);
          await wait(0.8);
          if (isStoppedRef.current) return;
          setConflictCells([]);

        } else {
          // ── PLACE queen ───────────────────────────────────────────────────
          let newCols = [...cols, col];
          setBoard(buildBoard(newCols, row));
          setConflictCells([]);
          setMessage(`♛ Placed at Row ${row}, Col ${col}`);
          await wait(1.2); // longer pause so placement is visible
          if (isStoppedRef.current) return;

          let newColMask = colMask | bit;
          let newLdMask  = ((ldMask | bit) << 1) & ALL_COLS;
          let newRdMask  = ((rdMask | bit) >> 1);
          dpNext.push({ cols: newCols, colMask: newColMask, ldMask: newLdMask, rdMask: newRdMask });
          placedInThisState = true;

          // ── BACKTRACK: remove queen, return to row start visually ─────────
          // (only backtrack-show if there are more columns to try)
          if (col < n - 1) {
            await wait(0.5);
            if (isStoppedRef.current) return;

            // Step 1: highlight queen being removed
            setConflictCells([{ r: row, c: col }]);
            setMessage(`↩ Backtracking — removing ♛ from Row ${row}, Col ${col}`);
            await wait(1.0);
            if (isStoppedRef.current) return;

            // Step 2: remove queen, board goes back to before this row
            setBoard(buildBoard(cols, row - 1));
            setConflictCells([]);
            setCurrentCol(null);
            setMessage(`↩ Back to start of Row ${row} — trying next column...`);
            await wait(0.8);
            if (isStoppedRef.current) return;
          }
        }
      }

      // ── If no placement worked for this state, show dead-end message ───────
      if (!placedInThisState && row < n) {
        setBoard(buildBoard(cols, row - 1));
        setCurrentRow(row);
        setCurrentCol(null);
        setConflictCells([]);
        setMessage(`Row ${row}: no valid column for this state — state discarded`);
        await wait(1.0);
        if (isStoppedRef.current) return;
      }
    }

    dpCurrent = dpNext;

    setCurrentCol(null);
    setConflictCells([]);
    setMessage(`Row ${row} done — ${dpCurrent.length} valid partial placement(s) survive`);
    await wait(1.2);
    if (isStoppedRef.current) return;
  }

  // ── All rows done ──────────────────────────────────────────────────────────
  const solutionCount = dpCurrent.length;
  setSolutions(solutionCount);

  if (solutionCount === 0) {
    setMessage(`No solution exists for ${n}-Queens.`);
    return;
  }

  setMessage(`DP complete! Found ${solutionCount} solution(s). Replaying all...`);
  await wait();
  if (isStoppedRef.current) return;

  // ── Replay each complete solution ─────────────────────────────────────────
  for (let i = 0; i < solutionCount; i++) {
    if (isStoppedRef.current) return;

    setBoard(buildBoard(dpCurrent[i].cols, n - 1));
    setCurrentRow(null);
    setCurrentCol(null);
    setConflictCells([]);
    setMessage(`Solution ${i + 1} / ${solutionCount}: columns [${dpCurrent[i].cols.join(", ")}]`);
    await wait(2.0); // extra long pause per solution so user can read it
  }

  // ── Final ──────────────────────────────────────────────────────────────────
  if (!isStoppedRef.current) {
    setCurrentRow(null);
    setCurrentCol(null);
    setConflictCells([]);
    setMessage(`Done! Found ${solutionCount} solution(s) for ${n}-Queens.`);
  }
}