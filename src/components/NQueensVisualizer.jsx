import { useState, useRef } from "react";
import { nQueens } from "../algorithms/nQueens";

function NQueensVisualizer() {
  const [n, setN]           = useState(6);
  const [board, setBoard]   = useState([]);
  const [solutions, setSolutions] = useState(0);
  const [currentRow, setCurrentRow]       = useState(null);
  const [currentCol, setCurrentCol]       = useState(null);
  const [conflictCells, setConflictCells] = useState([]);
  const [message, setMessage]     = useState("");
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused]   = useState(false);
  const [speed, setSpeed]         = useState(2);
  const [dpStats, setDpStats]     = useState([]); // [{row, before, after}]

  const isPausedRef  = useRef(false);
  const isStoppedRef = useRef(false);
  const speedRef     = useRef(2);

  const speedVals   = { 1: 800, 2: 300, 3: 100, 4: 10 };
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };

  function getDelay() { return speedVals[speedRef.current] || 300; }

  function resetVisuals() {
    setBoard(Array.from({ length: n }, () => Array(n).fill(0)));
    setSolutions(0); setCurrentRow(null); setCurrentCol(null);
    setConflictCells([]); setMessage(""); setDpStats([]);
  }

  async function startAlgo() {
    isStoppedRef.current = false; isPausedRef.current = false;
    setIsPaused(false); setIsSorting(true); resetVisuals();
    await nQueens(
      n, setBoard, setCurrentRow, setCurrentCol,
      setConflictCells, setSolutions, setMessage,
      getDelay, isPausedRef, isStoppedRef,
      setDpStats   // ← pass DP stats callback
    );
    setIsSorting(false); setIsPaused(false);
  }

  function pauseAlgo()  { isPausedRef.current = true;  setIsPaused(true);  setMessage("Paused..."); }
  function resumeAlgo() { isPausedRef.current = false; setIsPaused(false); setMessage("Resuming..."); }

  function stopAlgo() {
    isStoppedRef.current = true; isPausedRef.current = false;
    setIsSorting(false); setIsPaused(false);
    setCurrentRow(null); setCurrentCol(null); setConflictCells([]); setMessage("Stopped.");
  }

  function handleBoardSizeChange(e) {
    stopAlgo();
    const newN = Number(e.target.value);
    setN(newN); setBoard([]); setSolutions(0); setMessage(""); setDpStats([]);
  }

  function handleSpeedChange(val) { setSpeed(val); speedRef.current = val; }

  function getCellClass(r, c) {
    let isQueen    = board[r] && board[r][c] === 1;
    let isCurrent  = r === currentRow && c === currentCol;
    let isConflict = conflictCells.some(cc => cc.r === r && cc.c === c);
    let isDark     = (r + c) % 2 === 1;
    if (isCurrent)  return "nq-cell nq-current";
    if (isConflict) return "nq-cell nq-conflict";
    if (isQueen)    return "nq-cell nq-queen";
    return `nq-cell ${isDark ? "nq-dark" : "nq-light"}`;
  }

  let cellSize = Math.min(54, Math.floor(420 / n));

  return (
    <div className="visualizer">
      <h2>N-Queens Visualizer</h2>

      <div className="controls input-controls">
        <span style={{ marginRight: '10px' }}>Board Size (N): <strong>{n}</strong></span>
        <input
          type="range" min="4" max="10" step="1"
          value={n}
          onChange={handleBoardSizeChange}
          disabled={isSorting}
        />
      </div>

      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        {[1, 2, 3, 4].map((s) => (
          <button key={s} className={`btn btn-speed ${speed === s ? "active" : ""}`} onClick={() => handleSpeedChange(s)}>
            {speedLabels[s]}
          </button>
        ))}
      </div>

      {solutions > 0 && (
        <div className="nq-solutions">Solutions found so far: <strong>{solutions}</strong></div>
      )}

      {/* Chess board */}
      <div className="nq-board-wrapper">
        <div className="nq-board" style={{ gridTemplateColumns: `repeat(${n}, ${cellSize}px)` }}>
          {board.length === n && board.map((row, r) =>
            row.map((cell, c) => (
              <div key={`${r}-${c}`} className={getCellClass(r, c)} style={{ width: cellSize, height: cellSize, fontSize: cellSize * 0.5 }}>
                {cell === 1 ? "♛" : ""}
              </div>
            ))
          )}
        </div>
      </div>

      {/* DP State Table */}
      {dpStats.length > 0 && (
        <div className="dp-table-container" style={{ overflowX: "auto", margin: "16px 0" }}>
          <h3 style={{ marginBottom: "8px" }}>DP State Table</h3>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>
            Shows how many valid partial placements survive after processing each row.
          </p>
          <table className="dp-table" style={{ borderCollapse: "collapse", textAlign: "center", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px 14px", background: "#1a2240", color: "#fff" }}>Row</th>
                <th style={{ border: "1px solid #ccc", padding: "8px 14px", background: "#1a2240", color: "#fff" }}>States Entering</th>
                <th style={{ border: "1px solid #ccc", padding: "8px 14px", background: "#1a2240", color: "#fff" }}>States Surviving</th>
                <th style={{ border: "1px solid #ccc", padding: "8px 14px", background: "#1a2240", color: "#fff" }}>Pruned</th>
              </tr>
            </thead>
            <tbody>
              {dpStats.map((s, i) => {
                const isCurrentRow = s.row === currentRow;
                const survived = s.after;
                const pruned   = s.before - s.after;
                return (
                  <tr key={i} style={{
                    background: isCurrentRow ? "#fbbf24" : survived === 0 ? "#ffe5e5" : i % 2 === 0 ? "#0d1b3a" : "#111d35",
                    color: isCurrentRow ? "#1a1a2e" : "#e0e0e0",
                    fontWeight: isCurrentRow ? "bold" : "normal"
                  }}>
                    <td style={{ border: "1px solid #333", padding: "7px 14px" }}>Row {s.row + 1}</td>
                    <td style={{ border: "1px solid #333", padding: "7px 14px" }}>{s.before}</td>
                    <td style={{ border: "1px solid #333", padding: "7px 14px", color: survived === 0 ? "#ef5350" : "#4ade80" }}>
                      <strong>{survived}</strong>
                    </td>
                    <td style={{ border: "1px solid #333", padding: "7px 14px", color: pruned > 0 ? "#f87171" : "#888" }}>
                      {pruned > 0 ? `−${pruned}` : "0"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="bfs-legend">
        <span><span className="bfs-dot" style={{ background: "#f5a623" }} /> Trying</span>
        <span><span className="bfs-dot" style={{ background: "#4a90d9" }} /> Queen Placed</span>
        <span><span className="bfs-dot" style={{ background: "#e74c3c" }} /> Conflict</span>
      </div>

      <div className="controls playback-controls">
        <button onClick={startAlgo} disabled={isSorting} className="btn btn-primary">Start</button>
        <button onClick={isPaused ? resumeAlgo : pauseAlgo} disabled={!isSorting} className="btn btn-secondary">{isPaused ? "Resume" : "Pause"}</button>
        <button onClick={stopAlgo} disabled={!isSorting && !isPaused} className="btn btn-danger">Stop</button>
      </div>

      <p className="binary-message">{message}</p>
    </div>
  );
}

export default NQueensVisualizer;
