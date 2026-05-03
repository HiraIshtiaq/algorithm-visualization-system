import { useState, useRef } from "react";
import { towerOfHanoi } from "../algorithms/towerOfHanoi";

function TowerOfHanoiVisualizer() {
  const [numDisks, setNumDisks] = useState(4);
  const [rods, setRods] = useState([[4, 3, 2, 1], [], []]);
  const [message, setMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(2);

  const pauseRef = useRef(false);
  const stopRef  = useRef(false);
  const speedRef = useRef(2);

  const speedVals   = { 1: 1500, 2: 800, 3: 300, 4: 50 };
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };

  function delay(ms) {
    const actualMs = ms !== undefined ? ms : (speedVals[speedRef.current] || 800);
    return new Promise(res => setTimeout(res, actualMs));
  }

  function buildInitialRods(n) {
    return [Array.from({ length: n }, (_, i) => n - i), [], []];
  }

  async function startHanoi() {
    const initialRods = buildInitialRods(numDisks);
    setRods(initialRods);
    setIsRunning(true);
    setIsPaused(false);
    stopRef.current = false;
    pauseRef.current = false;

    let moves = [];
    towerOfHanoi(numDisks, 0, 2, 1, moves);

    for (let move of moves) {
      if (stopRef.current) break;
      while (pauseRef.current) { await delay(200); }
      setMessage(`Move disk from Rod ${move.from + 1} → Rod ${move.to + 1}`);
      setRods(prev => {
        const newRods = prev.map(r => [...r]);
        const disk = newRods[move.from].pop();
        newRods[move.to].push(disk);
        return newRods;
      });
      await delay();
    }

    if (!stopRef.current) setMessage("Tower of Hanoi Completed!");
    setIsRunning(false);
  }

  function pauseHanoi()   { setIsPaused(true);  pauseRef.current = true; }
  function resumeHanoi()  { setIsPaused(false); pauseRef.current = false; }

  function stopHanoiInternal() {
    stopRef.current = true;
    pauseRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
  }

  function stopHanoi() {
    stopHanoiInternal();
    setMessage("Stopped.");
  }

  function restartHanoi() {
    stopHanoiInternal();
    setRods(buildInitialRods(numDisks));
    setMessage("");
    setTimeout(() => startHanoi(), 50);
  }

  function handleSpeedChange(val) { setSpeed(val); speedRef.current = val; }

  function handleDiskChange(e) {
    const n = Number(e.target.value);
    setNumDisks(n);
    setRods(buildInitialRods(n));
    setMessage("");
    stopHanoiInternal();
  }

  return (
    <div className="visualizer">
      <h2>Tower of Hanoi Visualizer</h2>

      <div className="controls input-controls">
        <span style={{ marginRight: '10px' }}>Number of Disks: <strong>{numDisks}</strong></span>
        <input
          type="range" min="2" max="7" step="1"
          value={numDisks}
          onChange={handleDiskChange}
          disabled={isRunning}
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

      <div className="rods-container">
        {rods.map((rod, index) => (
          <div key={index} className="rod">
            <div className="disks">
              {rod.map((disk, i) => (
                <div key={i} className="disk" style={{ width: `${disk * 40}px` }}>{disk}</div>
              ))}
            </div>
            <div className="rod-base"></div>
          </div>
        ))}
      </div>

      <div className="controls playback-controls">
        <button onClick={startHanoi} disabled={isRunning} className="btn btn-primary">Start</button>
        <button onClick={isPaused ? resumeHanoi : pauseHanoi} disabled={!isRunning} className="btn btn-secondary">
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button onClick={stopHanoi} disabled={!isRunning && !isPaused} className="btn btn-danger">Stop</button>
        <button onClick={restartHanoi} disabled={!isRunning && !isPaused} className="btn btn-secondary">Restart</button>
      </div>

      <p className="message">{message}</p>
    </div>
  );
}

export default TowerOfHanoiVisualizer;
