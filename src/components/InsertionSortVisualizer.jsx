import { useState, useRef } from "react";
import { insertionSort } from "../algorithms/insertionSort";

function InsertionSortVisualizer() {

  // ── State ──────────────────────────────────────
  const [array, setArray]           = useState([40, 10, 30, 20, 60]);
  const [arrayInput, setArrayInput] = useState("");

  const [currentIndex, setCurrentIndex]   = useState(null); // orange box
  const [compareIndex, setCompareIndex]   = useState(null); // red box
  const [sortedIndices, setSortedIndices] = useState([]);   // green boxes

  const [message, setMessage]     = useState("Ready to sort.");
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused]   = useState(false);
  const [speed, setSpeed]         = useState(2);

  // ── Refs (readable inside async algorithm) ─────
  const isPausedRef  = useRef(false);
  const isStoppedRef = useRef(false);
  const speedRef     = useRef(2);

  const speedVals   = { 1: 1000, 2: 600, 3: 200, 4: 50 };
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };

  function getDelay() {
    return speedVals[speedRef.current] || 600;
  }

  // ── Reset highlights ───────────────────────────
  function resetVisuals() {
    setCurrentIndex(null);
    setCompareIndex(null);
    setSortedIndices([]);
  }

  // ── Generate a random array ────────────────────
  function generateRandomArray() {
    stopSortInternal();
    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(Math.floor(Math.random() * 90) + 10);
    }
    setArray(arr);
    resetVisuals();
    setMessage("Random array generated.");
  }

  // ── Load array typed by user ───────────────────
  function loadUserArray() {
    stopSortInternal();
    let arr = arrayInput
      .split(",")
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));
    if (arr.length === 0) return setMessage("No valid numbers. Use format: 40,10,30");
    setArray(arr);
    resetVisuals();
    setMessage("Custom array loaded.");
  }

  // ── Start sorting ──────────────────────────────
  async function startSort() {
    if (array.length === 0) {
      setMessage("Please generate or add array first");
      return;
    }

    isStoppedRef.current = false;
    isPausedRef.current  = false;
    setIsPaused(false);
    setIsSorting(true);
    resetVisuals();
    setMessage("Sorting...");

    await insertionSort(
      array,
      setArray,
      setCurrentIndex,
      setCompareIndex,
      setSortedIndices,
      setMessage,
      getDelay,
      isPausedRef,
      isStoppedRef
    );

    setIsSorting(false);
    setIsPaused(false);
  }

  // ── Pause ──────────────────────────────────────
  function pauseSort() {
    isPausedRef.current = true;
    setIsPaused(true);
    setMessage("Paused...");
  }

  // ── Resume ─────────────────────────────────────
  function resumeSort() {
    isPausedRef.current = false;
    setIsPaused(false);
    setMessage("Resuming...");
  }

  // ── Stop ───────────────────────────────────────
  const stopSortInternal = () => {
    isStoppedRef.current = true;
    isPausedRef.current  = false;
    setIsSorting(false);
    setIsPaused(false);
    resetVisuals();
  }

  function stopSort() {
    stopSortInternal();
    setMessage("Stopped.");
  }

  function handleRestart() {
    stopSortInternal();
    setTimeout(() => startSort(), 50);
  }

  function handleSpeedChange(val) {
    setSpeed(val);
    speedRef.current = val;
  }

  // ── Box color logic ────────────────────────────
  function getBoxClass(index) {
    if (index === currentIndex)        return "binary-box binary-mid";   // orange
    if (index === compareIndex)        return "binary-box binary-left";  // red
    if (sortedIndices.includes(index)) return "binary-box binary-right"; // green
    return "binary-box";                                                 // default
  }

  // ── Render ─────────────────────────────────────
  return (
    <div className="visualizer">
      <h2>Insertion Sort Visualizer</h2>

      <div className="controls input-controls">
        <input
          type="text"
          placeholder="e.g. 40, 10, 30, 20"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          disabled={isSorting}
        />
        <button onClick={loadUserArray} disabled={isSorting} className="btn btn-secondary">
          Load Array
        </button>
        <button onClick={generateRandomArray} disabled={isSorting} className="btn btn-secondary">
          Randomize
        </button>
      </div>

      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        {[1, 2, 3, 4].map((s) => (
          <button
            key={s}
            className={`btn btn-speed ${speed === s ? "active" : ""}`}
            onClick={() => handleSpeedChange(s)}
          >
            {speedLabels[s]}
          </button>
        ))}
      </div>

      <div className="binary-container">
        {array.map((value, index) => (
          <div key={index} className={getBoxClass(index)}>
            {value}
          </div>
        ))}
      </div>

      <div className="bfs-legend">
        <span><span className="bfs-dot" style={{ background: "#f5a623" }} /> Key (Current)</span>
        <span><span className="bfs-dot" style={{ background: "#e74c3c" }} /> Comparing</span>
        <span><span className="bfs-dot" style={{ background: "#2ecc71" }} /> Sorted Portion</span>
      </div>

      <div className="controls playback-controls">
        <button onClick={startSort} disabled={isSorting} className="btn btn-primary">
          Start
        </button>
        <button onClick={isPaused ? resumeSort : pauseSort} disabled={!isSorting} className="btn btn-secondary">
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button onClick={stopSort} disabled={!isSorting && !isPaused} className="btn btn-danger">
          Stop
        </button>
        <button onClick={handleRestart} disabled={!isSorting && !isPaused} className="btn btn-secondary">
          Restart
        </button>
      </div>

      <p className="binary-message">{message}</p>
    </div>
  );
}

export default InsertionSortVisualizer;
