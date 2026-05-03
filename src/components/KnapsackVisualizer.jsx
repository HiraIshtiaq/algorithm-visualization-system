
import { useState, useRef } from "react";
import { knapsack } from "../algorithms/knapsack";

function KnapsackVisualizer() {

  const [items, setItems] = useState([
    { name: "Item1", weight: 3, value: 25 },
    { name: "Item2", weight: 2, value: 20 },
    { name: "Item3", weight: 4, value: 40 }
  ]);

  const [capacity, setCapacity] = useState(7);
  const [activeItem, setActiveItem] = useState(null);
  const [bag, setBag] = useState([]);
  const [dpTable, setDpTable] = useState([]);
  const [backtrackLog, setBacktrackLog] = useState([]); // [{step,item,action,weight,value,remainingCap}]
  const [message, setMessage] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(2);

  const [newItemName, setNewItemName] = useState("");
  const [newItemWeight, setNewItemWeight] = useState("");
  const [newItemValue, setNewItemValue] = useState("");

  const controlRef = useRef({ pause: false, stop: false });
  const speedRef = useRef(2);

  const speedMap = { 1: 1500, 2: 800, 3: 300, 4: 50 };
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };

  function delay() {
    const ms = speedMap[speedRef.current] ?? 800;
    return new Promise((res) => {
      const start = Date.now();
      const check = () => {
        if (controlRef.current.stop) return res("stopped");
        if (controlRef.current.pause) return setTimeout(check, 50);
        if (Date.now() - start >= ms) return res();
        setTimeout(check, 50);
      };
      check();
    });
  }

  async function startKnapsack() {
    controlRef.current.stop = false;
    controlRef.current.pause = false;
    setIsPaused(false);
    setIsRunning(true);
    setBag([]);
    setDpTable([]);
    setBacktrackLog([]);

    await knapsack(
      items, capacity,
      setActiveItem, setBag, setMessage,
      delay, controlRef, setDpTable,
      setBacktrackLog   // ← new backtrack callback
    );

    setIsRunning(false);
  }

  function handlePauseResume() {
    setIsPaused((prev) => {
      controlRef.current.pause = !prev;
      return !prev;
    });
  }

  function handleStop() {
    controlRef.current.stop = true;
    controlRef.current.pause = false;
    setIsRunning(false);
    setIsPaused(false);
    setMessage("Stopped");
    setActiveItem(null);
  }

  function handleSpeedChange(val) { setSpeed(val); speedRef.current = val; }

  function handleAddItem() {
    if (!newItemName || !newItemWeight || !newItemValue) return;
    setItems([...items, { name: newItemName, weight: Number(newItemWeight), value: Number(newItemValue) }]);
    setNewItemName(""); setNewItemWeight(""); setNewItemValue("");
  }

  function clearItems() {
    setItems([]); setBag([]); setDpTable([]); setBacktrackLog([]);
  }

  // Highlight DP row/col of activeItem
  const activeRow = activeItem !== null ? activeItem + 1 : null;

  return (
    <div className="visualizer">
      <h2>0/1 Knapsack Visualizer</h2>

      {/* Item inputs */}
      <div className="controls input-controls">
        <input type="text"   placeholder="Item Name"  value={newItemName}   onChange={e => setNewItemName(e.target.value)}   disabled={isRunning} style={{ width: "120px" }} />
        <input type="number" placeholder="Weight"     value={newItemWeight} onChange={e => setNewItemWeight(e.target.value)} disabled={isRunning} style={{ width: "80px" }} />
        <input type="number" placeholder="Value"      value={newItemValue}  onChange={e => setNewItemValue(e.target.value)}  disabled={isRunning} style={{ width: "80px" }} />
        <button onClick={handleAddItem} disabled={isRunning} className="btn btn-secondary">Add Item</button>
        <button onClick={clearItems}   disabled={isRunning} className="btn btn-danger">Clear</button>
      </div>

      <div className="controls input-controls" style={{ marginTop: '10px' }}>
        <span style={{ marginRight: '10px' }}>Capacity:</span>
        <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} disabled={isRunning} style={{ width: "80px" }} />
      </div>

      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        {[1, 2, 3, 4].map((s) => (
          <button key={s} className={`btn btn-speed ${speed === s ? "active" : ""}`} onClick={() => handleSpeedChange(s)}>
            {speedLabels[s]}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="items-container">
        {items.map((item, index) => {
          let cls = "item-box";
          if (index === activeItem) cls += " active";
          // Highlight in backtrack phase: included = green, excluded = red
          const btStep = backtrackLog.find(b => b.item === item.name && index === activeItem);
          const inBag  = bag.some(b => b.name === item.name);
          const wasBTd = backtrackLog.some(b => b.item === item.name);
          return (
            <div key={index} className={cls} style={{
              background: wasBTd
                ? inBag ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.2)"
                : undefined,
              border: wasBTd
                ? inBag ? "2px solid #4ade80" : "2px solid #f87171"
                : undefined
            }}>
              {item.name}<br />
              W:{item.weight} V:{item.value}
            </div>
          );
        })}
      </div>

      {/* DP Table */}
      {dpTable.length > 0 && (
        <div className="dp-table-container" style={{ overflowX: "auto", margin: "20px 0" }}>
          <h3>Phase 1 — DP Fill Table</h3>
          <table className="dp-table" style={{ borderCollapse: "collapse", textAlign: "center" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #555", padding: "8px", background: "#1a2240", color: "#fff" }}>Item / Cap →</th>
                {Array.from({ length: capacity + 1 }).map((_, w) => (
                  <th key={w} style={{ border: "1px solid #555", padding: "8px", background: "#1a2240", color: "#fff" }}>{w}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dpTable.map((row, i) => (
                <tr key={i}>
                  <td style={{
                    border: "1px solid #555", padding: "8px", fontWeight: "bold",
                    background: i === activeRow ? "#fbbf24" : "#0d1b3a",
                    color: i === activeRow ? "#1a1a2e" : "#fff"
                  }}>
                    {i === 0 ? "0 (∅)" : items[i - 1]?.name}
                  </td>
                  {row.map((val, w) => (
                    <td key={w} style={{
                      border: "1px solid #333", padding: "8px",
                      background: i === activeRow ? "rgba(251,191,36,0.15)" : i % 2 === 0 ? "#0d1b3a" : "#111d35",
                      color: "#e0e0e0"
                    }}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Backtracking Trace Table */}
      {backtrackLog.length > 0 && (
        <div className="dp-table-container" style={{ overflowX: "auto", margin: "20px 0" }}>
          <h3>Phase 2 — Backtracking Trace</h3>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>
            Tracing back through DP table to find the optimal item selection.
          </p>
          <table className="dp-table" style={{ borderCollapse: "collapse", textAlign: "center" }}>
            <thead>
              <tr>
                {["Step", "Item", "Action", "Weight", "Value", "Remaining Cap"].map(h => (
                  <th key={h} style={{ border: "1px solid #555", padding: "8px 14px", background: "#1a2240", color: "#fff" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {backtrackLog.map((row, idx) => {
                const isInclude = row.action === "Include";
                const isLast    = idx === backtrackLog.length - 1;
                return (
                  <tr key={row.step} style={{
                    background: isLast ? "#fbbf24" : isInclude ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.08)",
                    color: isLast ? "#1a1a2e" : "#e0e0e0",
                    fontWeight: isLast ? "bold" : "normal"
                  }}>
                    <td style={{ border: "1px solid #333", padding: "7px 12px" }}>{row.step}</td>
                    <td style={{ border: "1px solid #333", padding: "7px 12px", fontWeight: "bold" }}>{row.item}</td>
                    <td style={{ border: "1px solid #333", padding: "7px 12px", color: isInclude ? "#4ade80" : "#f87171", fontWeight: "bold" }}>
                      {isInclude ? "✓ Include" : "✗ Exclude"}
                    </td>
                    <td style={{ border: "1px solid #333", padding: "7px 12px" }}>{row.weight}</td>
                    <td style={{ border: "1px solid #333", padding: "7px 12px" }}>{row.value}</td>
                    <td style={{ border: "1px solid #333", padding: "7px 12px" }}>{row.remainingCap}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bag */}
      <h3>Bag (Selected Items)</h3>
      <div className="bag">
        {bag.length === 0
          ? <span style={{ color: "#888", fontStyle: "italic" }}>Empty</span>
          : bag.map((item, i) => (
            <div key={i} className="item-in-bag">
              {item.name}<br />
              <small>W:{item.weight} V:{item.value}</small>
            </div>
          ))
        }
      </div>

      <div className="controls playback-controls">
        <button onClick={startKnapsack} disabled={isRunning} className="btn btn-primary">Start</button>
        <button onClick={handlePauseResume} disabled={!isRunning} className="btn btn-secondary">{isPaused ? "Resume" : "Pause"}</button>
        <button onClick={handleStop} disabled={!isRunning} className="btn btn-danger">Stop</button>
      </div>

      <p className="message">{message}</p>
    </div>
  );
}

export default KnapsackVisualizer;