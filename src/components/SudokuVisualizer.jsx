import { useState, useEffect } from 'react'
import { sudokuSolver } from '../algorithms/sudokuSolver'

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

function makeEmpty(n) { return Array(n).fill(null).map(() => Array(n).fill(0)); }

function SudokuVisualizer() {
  const [boardSize, setBoardSize]     = useState(9);
  const [boardInput, setBoardInput]   = useState(DEFAULT_9x9.map(r => [...r]));
  const [steps, setSteps]             = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [speed, setSpeed]             = useState(2);

  const speedVals   = { 1: 3000, 2: 1500, 3: 400, 4: 50 };
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };

  // playback tick
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;
    if (currentStep >= steps.length - 1) { setIsPlaying(false); return; }
    const t = setTimeout(() => setCurrentStep(p => p + 1), speedVals[speed] || 1500);
    return () => clearTimeout(t);
  }, [isPlaying, currentStep, steps.length, speed]);

  const startVisualization = () => {
    const result = sudokuSolver(boardInput.map(r => [...r]), boardSize);
    setSteps(result); setCurrentStep(0); setIsPlaying(true);
  };

  const handlePauseResume = () => setIsPlaying(p => !p);

  const handleStop = () => { setIsPlaying(false); setSteps([]); setCurrentStep(0); };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setTimeout(() => setIsPlaying(true), 50);
  };

  const handleCellChange = (i, j, val) => {
    const n = parseInt(val);
    if (isNaN(n) || n < 0 || n > boardSize) return;
    setBoardInput(prev => { const next = prev.map(r => [...r]); next[i][j] = n; return next; });
  };

  // Switch board size
  const handleSizeChange = (newSize) => {
    handleStop();
    setBoardSize(newSize);
    setBoardInput(newSize === 4 ? DEFAULT_4x4.map(r => [...r]) : DEFAULT_9x9.map(r => [...r]));
  };

  const resetBoard  = () => { handleStop(); setBoardInput(boardSize === 4 ? DEFAULT_4x4.map(r=>[...r]) : DEFAULT_9x9.map(r=>[...r])); };
  const clearBoard  = () => { handleStop(); setBoardInput(makeEmpty(boardSize)); };

  const currentData = steps[currentStep] || {
    board: boardInput, explanation: 'Ready',
    description: 'Select size, edit the grid, then click Start',
    row: -1, col: -1, movesLog: []
  };

  const defaultBoard = boardSize === 4 ? DEFAULT_4x4 : DEFAULT_9x9;
  const boxSize      = boardSize === 4 ? 2 : 3;
  const cellPx       = boardSize === 4 ? 60 : 44;
  const visibleMoves = (currentData.movesLog || []).slice(-15);

  // Stats counters from log
  const placedCount    = (currentData.movesLog || []).filter(m => m.action === 'Place').length;
  const backtrackedCount = (currentData.movesLog || []).filter(m => m.action === 'Backtrack').length;

  return (
    <div className="visualizer">
      <h2>Sudoku Solver Visualizer</h2>

      {/* Board size selector */}
      <div className="controls input-controls">
        <span style={{ marginRight: '10px', fontWeight: 'bold' }}>Board Size:</span>
        {[4, 9].map(size => (
          <button
            key={size}
            className={`btn ${boardSize === size ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleSizeChange(size)}
            disabled={isPlaying}
          >
            {size}×{size}
          </button>
        ))}
        <button onClick={resetBoard} disabled={isPlaying} className="btn btn-secondary" style={{ marginLeft: '12px' }}>Load Default</button>
        <button onClick={clearBoard} disabled={isPlaying} className="btn btn-secondary">Clear Board</button>
      </div>

      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        {[1, 2, 3, 4].map((s) => (
          <button key={s} className={`btn btn-speed ${speed === s ? "active" : ""}`} onClick={() => setSpeed(s)}>
            {speedLabels[s]}
          </button>
        ))}
      </div>

      {/* Stats */}
      {steps.length > 0 && (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '10px', fontSize: '13px' }}>
          <span>Step <strong>{currentStep + 1}</strong> / {steps.length}</span>
          <span>✅ Placed: <strong style={{ color: '#4ade80' }}>{placedCount}</strong></span>
          <span>↩ Backtracks: <strong style={{ color: '#f87171' }}>{backtrackedCount}</strong></span>
        </div>
      )}

      {/* Main layout: board + trace table side by side */}
      <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", justifyContent: "center", margin: "12px 0" }}>

        {/* Grid */}
        <div>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px', textAlign: 'center' }}>
            {boardSize}×{boardSize} grid — {boardSize === 4 ? '2×2' : '3×3'} boxes, values 1–{boardSize}
          </div>
          {currentData.board.map((row, i) => (
            <div key={i} style={{ display: 'flex' }}>
              {row.map((cell, j) => {
                const isHighlighted = steps.length > 0 && i === currentData.row && j === currentData.col;
                const isBacktrack   = isHighlighted && currentData.explanation === "Backtrack";
                const isOriginal    = defaultBoard[i]?.[j] !== 0;
                const isBoxRight    = (j + 1) % boxSize === 0 && j < boardSize - 1;
                const isBoxBottom   = (i + 1) % boxSize === 0 && i < boardSize - 1;
                const borderRight   = isBoxRight  ? '3px solid #555' : '1px solid #aaa';
                const borderBottom  = isBoxBottom ? '3px solid #555' : '1px solid #aaa';
                const bg = isBacktrack ? '#ef5350'
                         : isHighlighted ? '#fbbf24'
                         : isOriginal    ? '#e9d5ff'
                         : 'white';
                return (
                  <input
                    key={j}
                    type="text"
                    inputMode="numeric"
                    maxLength={boardSize === 9 ? 1 : 1}
                    value={cell !== 0 ? cell : ''}
                    onChange={(e) => handleCellChange(i, j, e.target.value || '0')}
                    disabled={isPlaying || steps.length > 0}
                    style={{
                      width: cellPx, height: cellPx,
                      textAlign: 'center', fontWeight: 'bold',
                      fontSize: boardSize === 4 ? '1.4rem' : '1.1rem',
                      border: 'none', borderRight, borderBottom,
                      backgroundColor: bg,
                      color: isOriginal ? '#6b21a8' : '#1f2937',
                      outline: 'none'
                    }}
                  />
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div style={{ display: "flex", gap: "14px", marginTop: "10px", fontSize: "12px", flexWrap: "wrap" }}>
            <span><span style={{ display:"inline-block", width:12, height:12, background:"#e9d5ff", border:"1px solid #ccc", marginRight:4, verticalAlign:"middle" }}></span>Given</span>
            <span><span style={{ display:"inline-block", width:12, height:12, background:"#fbbf24", border:"1px solid #ccc", marginRight:4, verticalAlign:"middle" }}></span>Placing</span>
            <span><span style={{ display:"inline-block", width:12, height:12, background:"#ef5350", border:"1px solid #ccc", marginRight:4, verticalAlign:"middle" }}></span>Backtrack</span>
          </div>
        </div>

        {/* Backtracking Trace Table */}
        <div style={{ minWidth: "280px", flex: 1 }}>
          <h3 style={{ marginBottom: "8px" }}>Backtracking Trace</h3>
          <p style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>
            Last {visibleMoves.length} moves shown
          </p>
          {visibleMoves.length === 0 ? (
            <p style={{ color: "#888", fontStyle: "italic", fontSize: "13px" }}>Table builds as solver runs…</p>
          ) : (
            <div style={{ overflowY: "auto", maxHeight: "420px" }}>
              <table className="dp-table" style={{ borderCollapse: "collapse", textAlign: "center", width: "100%", fontSize: "13px" }}>
                <thead>
                  <tr>
                    {["#", "Action", "Row", "Col", "Value"].map(h => (
                      <th key={h} style={{ border: "1px solid #ccc", padding: "7px 10px", background: "#1a2240", color: "#fff", position: "sticky", top: 0 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleMoves.map((m, idx) => {
                    const isLast = idx === visibleMoves.length - 1;
                    const isBack = m.action === "Backtrack";
                    return (
                      <tr key={m.step} style={{
                        background: isLast ? "#fbbf24" : isBack ? "#3a1a1a" : idx % 2 === 0 ? "#0d1b3a" : "#111d35",
                        color: isLast ? "#1a1a2e" : isBack ? "#f87171" : "#e0e0e0",
                        fontWeight: isLast ? "bold" : "normal"
                      }}>
                        <td style={{ border: "1px solid #333", padding: "5px 8px" }}>{m.step}</td>
                        <td style={{ border: "1px solid #333", padding: "5px 8px", color: isBack ? "#f87171" : "#4ade80", fontWeight: "bold" }}>{m.action}</td>
                        <td style={{ border: "1px solid #333", padding: "5px 8px" }}>{m.row}</td>
                        <td style={{ border: "1px solid #333", padding: "5px 8px" }}>{m.col}</td>
                        <td style={{ border: "1px solid #333", padding: "5px 8px", fontWeight: "bold" }}>{m.value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Step explanation */}
      {steps.length > 0 && (
        <div className="visualization-area">
          <div className="step-explanation">
            <span className="step-badge">{currentData.explanation}</span>
            <p className="step-description">{currentData.description}</p>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
          </div>
        </div>
      )}

      <div className="controls playback-controls">
        <button onClick={startVisualization} disabled={isPlaying} className="btn btn-primary">Start</button>
        <button onClick={handlePauseResume}  disabled={steps.length === 0} className="btn btn-secondary">{isPlaying ? "Pause" : "Resume"}</button>
        <button onClick={handleStop}         disabled={steps.length === 0} className="btn btn-danger">Stop</button>
        <button onClick={handleRestart}      disabled={steps.length === 0} className="btn btn-secondary">Restart</button>
      </div>
    </div>
  );
}

export default SudokuVisualizer;
