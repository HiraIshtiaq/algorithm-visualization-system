import { useState, useRef } from "react";
import { dfs } from "../algorithms/dfs";

function DFSVisualizer() {
  const [graph, setGraph] = useState({
    A: ["B", "C"], B: ["D", "E"], C: ["F", "G"], D: [], E: [], F: [], G: []
  });
  const [graphInput, setGraphInput] = useState("");
  const [visited, setVisited] = useState([]);
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(2);

  const flags = useRef({ stop: false, pause: false });
  const speedRef = useRef(2);

  const speedVals   = { 1: 1000, 2: 500, 3: 200, 4: 50 };
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };

  function delay(ms) {
    const actualMs = ms !== undefined ? ms : (speedVals[speedRef.current] || 500);
    return new Promise(res => setTimeout(res, actualMs));
  }

  async function startDFS() {
    setVisited([]); setMessage("");
    flags.current.stop = false; flags.current.pause = false;
    setRunning(true); setPaused(false);
    const startNode = Object.keys(graph)[0];
    if (!startNode) { setMessage("Graph is empty!"); return; }
    await dfs(graph, startNode, setVisited, setMessage, delay, flags.current);
    setRunning(false);
  }

  function pauseDFS()  { flags.current.pause = true;  setPaused(true);  setMessage("Paused"); }
  function resumeDFS() { flags.current.pause = false; setPaused(false); setMessage("Resumed"); }

  const stopDFSInternal = () => {
    flags.current.stop = true; flags.current.pause = false;
    setRunning(false); setPaused(false); setVisited([]);
  }

  function stopDFS() {
    stopDFSInternal();
    setMessage("Stopped");
  }

  function handleRestart() {
    stopDFSInternal();
    setTimeout(() => startDFS(), 50);
  }

  function handleSpeedChange(val) { setSpeed(val); speedRef.current = val; }

  function loadUserGraph() {
    try {
      const obj = JSON.parse(graphInput);
      setGraph(obj); setVisited([]); setMessage("Custom graph loaded!");
    } catch {
      try {
        const edges = graphInput.split(",").map(s => s.trim()).filter(Boolean);
        const newGraph = {};
        edges.forEach(edge => {
          const [a, b] = edge.split("-").map(s => s.trim());
          if (!newGraph[a]) newGraph[a] = [];
          if (!newGraph[b]) newGraph[b] = [];
          newGraph[a].push(b);
        });
        setGraph(newGraph); setVisited([]); setMessage("Graph loaded from edges!");
      } catch {
        setMessage('Invalid format! Use edges like "A-B, A-C, B-D" or JSON');
      }
    }
  }

  const positions = {};
  const layers = [];
  const seen = new Set();

  function buildLayers(node, depth = 0) {
    if (seen.has(node)) return;
    seen.add(node);
    if (!layers[depth]) layers[depth] = [];
    layers[depth].push(node);
    (graph[node] || []).forEach(n => buildLayers(n, depth + 1));
  }

  const root = Object.keys(graph)[0];
  if (root) buildLayers(root);

  const canvasWidth = 800;
  layers.forEach((layer, y) => {
    const totalWidth = layer.length * 100;
    const startX = (canvasWidth - totalWidth) / 2;
    layer.forEach((node, i) => { positions[node] = { x: startX + i * 100, y: 80 + y * 100 }; });
  });

  const edges = [];
  Object.keys(graph).forEach(from => { (graph[from] || []).forEach(to => edges.push([from, to])); });

  return (
    <div className="visualizer">
      <h2>DFS Graph Visualizer</h2>

      <div className="controls input-controls">
        <input
          type="text"
          placeholder='Edges: "A-B, A-C, B-D" or JSON'
          value={graphInput}
          onChange={(e) => setGraphInput(e.target.value)}
          disabled={running}
        />
        <button onClick={loadUserGraph} disabled={running} className="btn btn-secondary">Load Graph</button>
        <button onClick={() => { setGraph({ A: ["B","C"], B: ["D","E"], C: ["F","G"], D:[], E:[], F:[], G:[] }); setVisited([]); setMessage(""); }} disabled={running} className="btn btn-secondary">Default</button>
      </div>

      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        {[1, 2, 3, 4].map((s) => (
          <button key={s} className={`btn btn-speed ${speed === s ? "active" : ""}`} onClick={() => handleSpeedChange(s)}>
            {speedLabels[s]}
          </button>
        ))}
      </div>

      <div className="graph-canvas">
        <svg className="graph-svg">
          {edges.map(([from, to]) => (
            <line key={from + "-" + to}
              x1={positions[from]?.x + 0.5} y1={positions[from]?.y + 0.5}
              x2={positions[to]?.x + 0.5} y2={positions[to]?.y + 0.5}
              stroke="#333" strokeWidth="2" strokeLinecap="round"
            />
          ))}
        </svg>
        {Object.keys(graph).map(node => (
          <div key={node}
            className={`graph-node ${visited.includes(node) ? "visited" : ""}`}
            style={{ left: (positions[node]?.x || 0) - 25, top: (positions[node]?.y || 0) - 25 }}
          >
            {node}
          </div>
        ))}
      </div>

      <div className="controls playback-controls">
        <button onClick={startDFS} disabled={running} className="btn btn-primary">Start</button>
        <button onClick={paused ? resumeDFS : pauseDFS} disabled={!running} className="btn btn-secondary">{paused ? "Resume" : "Pause"}</button>
        <button onClick={stopDFS} disabled={!running && !paused} className="btn btn-danger">Stop</button>
        <button onClick={handleRestart} disabled={!running && !paused} className="btn btn-secondary">Restart</button>
      </div>

      <p className="message">{message}</p>
    </div>
  );
}

export default DFSVisualizer;