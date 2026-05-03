import { useState, useRef } from "react";
import { heapSort } from "../algorithms/heapSort";

// ── Compute (x,y) positions for a binary tree laid out in an SVG ──────────
function buildTreeLayout(arr, heapSize) {
  const nodes = [];
  const W = 700, levelH = 80;
  for (let i = 0; i < heapSize && i < arr.length; i++) {
    const depth  = Math.floor(Math.log2(i + 1));
    const offset = i - (Math.pow(2, depth) - 1);
    const count  = Math.pow(2, depth);
    const x      = ((offset + 0.5) / count) * W;
    const y      = 40 + depth * levelH;
    nodes.push({ i, val: arr[i], x, y });
  }
  return { nodes, W, H: 40 + Math.ceil(Math.log2(heapSize + 1)) * levelH };
}

function HeapSortVisualizer() {
  const [array, setArray]           = useState([]);
  const [arrayInput, setArrayInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [compareIndex, setCompareIndex] = useState(null);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [heapSize, setHeapSize]     = useState(0);
  const [message, setMessage]       = useState("");
  const [isSorting, setIsSorting]   = useState(false);
  const [isPaused, setIsPaused]     = useState(false);
  const [speed, setSpeed]           = useState(2);

  const isPausedRef  = useRef(false);
  const isStoppedRef = useRef(false);
  const speedRef     = useRef(2);

  const speedVals   = { 1: 1000, 2: 600, 3: 200, 4: 50 };
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };

  function getDelay() { return speedVals[speedRef.current] || 600; }

  function resetVisuals() {
    setCurrentIndex(null); setCompareIndex(null);
    setSortedIndices([]); setHeapSize(0); setMessage("");
  }

  function generateRandomArray() {
    stopSort();
    const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(arr); resetVisuals();
  }

  function loadUserArray() {
    stopSort();
    const arr = arrayInput.split(",").map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (arr.length === 0) { setMessage("No valid numbers. Use e.g. 40,10,30,20"); return; }
    setArray(arr); resetVisuals();
  }

  async function startSort() {
    if (array.length === 0) { setMessage("Please generate or enter an array first"); return; }
    isStoppedRef.current = false; isPausedRef.current = false;
    setIsPaused(false); setIsSorting(true); resetVisuals();
    await heapSort(
      array, setArray,
      setCurrentIndex, setCompareIndex, setSortedIndices,
      setMessage, getDelay, isPausedRef, isStoppedRef,
      setHeapSize
    );
    setIsSorting(false); setIsPaused(false);
  }

  function pauseSort()  { isPausedRef.current = true;  setIsPaused(true);  setMessage("Paused..."); }
  function resumeSort() { isPausedRef.current = false; setIsPaused(false); setMessage("Resuming..."); }

  function stopSort() {
    isStoppedRef.current = true; isPausedRef.current = false;
    setIsSorting(false); setIsPaused(false); resetVisuals(); setMessage("Stopped.");
  }

  function handleSpeedChange(val) { setSpeed(val); speedRef.current = val; }

  // ── Node color logic ──────────────────────────────────────────────────────
  function nodeColor(i) {
    if (i === currentIndex)        return "#f5a623";   // orange — being heapified
    if (i === compareIndex)        return "#e74c3c";   // red — being swapped
    if (sortedIndices.includes(i)) return "#2ecc71";   // green — sorted
    if (i < heapSize)              return "#4a90d9";   // blue — in heap
    return "#555";                                      // grey — inactive
  }

  function barColor(i) {
    if (i === currentIndex)        return "#f5a623";
    if (i === compareIndex)        return "#e74c3c";
    if (sortedIndices.includes(i)) return "#2ecc71";
    return "#4a90d9";
  }

  // ── Tree layout ────────────────────────────────────────────────────────────
  const displayHeapSize = heapSize > 0 ? heapSize : array.length;
  const { nodes, W, H } = buildTreeLayout(array, displayHeapSize);
  const maxVal = Math.max(...array, 1);

  return (
    <div className="visualizer">
      <h2>Heap Sort Visualizer</h2>

      {/* Input */}
      <div className="controls input-controls">
        <input
          type="text"
          placeholder="e.g. 40, 10, 30, 20, 60"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          disabled={isSorting}
        />
        <button onClick={loadUserArray} disabled={isSorting} className="btn btn-secondary">Load Array</button>
        <button onClick={generateRandomArray} disabled={isSorting} className="btn btn-secondary">Randomize</button>
      </div>

      {/* Speed */}
      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        {[1, 2, 3, 4].map((s) => (
          <button key={s} className={`btn btn-speed ${speed === s ? "active" : ""}`} onClick={() => handleSpeedChange(s)}>
            {speedLabels[s]}
          </button>
        ))}
      </div>

      {/* ── Heap Tree SVG ─────────────────────────────────────────────────── */}
      {array.length > 0 && (
        <div style={{ overflowX: "auto", margin: "16px 0" }}>
          <h3 style={{ marginBottom: "8px" }}>
            Heap Tree
            <span style={{ fontSize: "12px", color: "#888", marginLeft: "12px" }}>
              (blue = in heap, orange = heapifying, red = swap target, green = sorted)
            </span>
          </h3>
          <svg width={W} height={H} style={{ display: "block", margin: "0 auto" }}>
            {/* Edges */}
            {nodes.map(({ i, x, y }) => {
              const leftChild  = nodes.find(n => n.i === 2 * i + 1);
              const rightChild = nodes.find(n => n.i === 2 * i + 2);
              return (
                <g key={`edges-${i}`}>
                  {leftChild  && <line x1={x} y1={y} x2={leftChild.x}  y2={leftChild.y}  stroke="#444" strokeWidth="2" />}
                  {rightChild && <line x1={x} y1={y} x2={rightChild.x} y2={rightChild.y} stroke="#444" strokeWidth="2" />}
                </g>
              );
            })}
            {/* Nodes */}
            {nodes.map(({ i, val, x, y }) => (
              <g key={`node-${i}`} style={{ transition: "all 0.3s" }}>
                <circle cx={x} cy={y} r={24} fill={nodeColor(i)} style={{ transition: "fill 0.25s" }} />
                <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="bold"
                  fill={sortedIndices.includes(i) || i === currentIndex || i === compareIndex ? "#1a1a2e" : "#fff"}>
                  {val}
                </text>
                <text x={x} y={y + 38} textAnchor="middle" fontSize="10" fill="#888">[{i}]</text>
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* ── Bar chart ──────────────────────────────────────────────────────── */}
      {array.length > 0 && (
        <div style={{ margin: "16px 0" }}>
          <h3 style={{ marginBottom: "8px" }}>Array View</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "140px" }}>
            {array.map((val, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{
                  width: "100%", background: barColor(i),
                  height: `${Math.max((val / maxVal) * 120, 16)}px`,
                  borderRadius: "4px 4px 0 0", transition: "height 0.25s, background 0.25s",
                  minWidth: "24px"
                }} />
                <span style={{ fontSize: "11px", marginTop: "2px", color: "#ccc" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bfs-legend">
        <span><span className="bfs-dot" style={{ background: "#4a90d9" }} /> In Heap</span>
        <span><span className="bfs-dot" style={{ background: "#f5a623" }} /> Heapifying</span>
        <span><span className="bfs-dot" style={{ background: "#e74c3c" }} /> Swap Target</span>
        <span><span className="bfs-dot" style={{ background: "#2ecc71" }} /> Sorted</span>
      </div>

      {/* Playback */}
      <div className="controls playback-controls">
        <button onClick={startSort} disabled={isSorting} className="btn btn-primary">Start</button>
        <button onClick={isPaused ? resumeSort : pauseSort} disabled={!isSorting} className="btn btn-secondary">
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button onClick={stopSort} disabled={!isSorting && !isPaused} className="btn btn-danger">Stop</button>
      </div>

      <p className="binary-message">{message}</p>
    </div>
  );
}

export default HeapSortVisualizer;
