import { useState, useRef } from "react";
import { bfs } from "../algorithms/bfs";

const DEFAULT_GRAPH = {
  0: [1, 2], 1: [0, 3, 4], 2: [0, 5, 6], 3: [1], 4: [1], 5: [2], 6: [2],
};
const DEFAULT_POSITIONS = {
  0: { x: 300, y: 40 }, 1: { x: 150, y: 130 }, 2: { x: 450, y: 130 },
  3: { x: 70, y: 230 }, 4: { x: 230, y: 230 }, 5: { x: 370, y: 230 }, 6: { x: 530, y: 230 },
};

function BFSVisualizer() {
  const [graph, setGraph]           = useState(DEFAULT_GRAPH);
  const [positions, setPositions]   = useState(DEFAULT_POSITIONS);
  const [graphInput, setGraphInput] = useState("");
  const [startInput, setStartInput] = useState("0");
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [currentNode, setCurrentNode]   = useState(null);
  const [queueNodes, setQueueNodes]     = useState([]);
  const [message, setMessage]   = useState("");
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused]   = useState(false);
  const [speed, setSpeed]         = useState(2);

  const isPausedRef  = useRef(false);
  const isStoppedRef = useRef(false);
  const speedRef     = useRef(2);

  const speedVals   = { 1: 1000, 2: 500, 3: 200, 4: 50 };
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };

  function getDelay() { return speedVals[speedRef.current] || 500; }

  function resetVisuals() {
    setVisitedNodes([]); setCurrentNode(null); setQueueNodes([]); setMessage("");
  }

  function loadDefaultGraph() {
    stopBFSInternal(); setGraph(DEFAULT_GRAPH); setPositions(DEFAULT_POSITIONS);
    setStartInput("0"); resetVisuals(); setMessage("Default graph loaded.");
  }

  function loadUserGraph() {
    stopBFSInternal();
    let entries = graphInput.split("|").map(s => s.trim()).filter(Boolean);
    if (entries.length === 0) { setMessage('Invalid format. Use: 0:1,2 | 1:0,3 | 2:0'); return; }
    let newGraph = {};
    entries.forEach(entry => {
      let [node, neighbors] = entry.split(":").map(s => s.trim());
      let nodeNum = parseInt(node);
      let neighborNums = neighbors ? neighbors.split(",").map(n => parseInt(n.trim())).filter(n => !isNaN(n)) : [];
      newGraph[nodeNum] = neighborNums;
    });
    let nodeList = Object.keys(newGraph).map(Number);
    let total = nodeList.length, centerX = 300, centerY = 150, radius = 120;
    let newPositions = {};
    nodeList.forEach((node, i) => {
      let angle = (2 * Math.PI * i) / total - Math.PI / 2;
      newPositions[node] = { x: Math.round(centerX + radius * Math.cos(angle)), y: Math.round(centerY + radius * Math.sin(angle)) };
    });
    setGraph(newGraph); setPositions(newPositions); resetVisuals(); setMessage("Graph loaded.");
  }

  async function startBFS() {
    let start = parseInt(startInput);
    if (!(start in graph)) { setMessage("Invalid start node"); return; }
    isStoppedRef.current = false; isPausedRef.current = false;
    setIsPaused(false); setIsSorting(true); resetVisuals();
    await bfs(graph, start, setVisitedNodes, setCurrentNode, setQueueNodes, setMessage, getDelay, isPausedRef, isStoppedRef);
    setIsSorting(false); setIsPaused(false);
  }

  function pauseBFS() { isPausedRef.current = true; setIsPaused(true); setMessage("Paused..."); }
  function resumeBFS() { isPausedRef.current = false; setIsPaused(false); setMessage("Resuming..."); }

  const stopBFSInternal = () => {
    isStoppedRef.current = true; isPausedRef.current = false;
    setIsSorting(false); setIsPaused(false);
    setCurrentNode(null); setQueueNodes([]); setVisitedNodes([]);
  }

  function stopBFS() {
    stopBFSInternal();
    setMessage("Stopped.");
  }

  function handleRestart() {
    stopBFSInternal();
    setTimeout(() => startBFS(), 50);
  }

  function handleSpeedChange(val) { setSpeed(val); speedRef.current = val; }

  function getNodeColor(node) {
    if (node === currentNode)        return "#f5a623";
    if (visitedNodes.includes(node)) return "#2ecc71";
    if (queueNodes.includes(node))   return "#e74c3c";
    return "#0f3460";
  }
  function getNodeTextColor(node) {
    return (node === currentNode || visitedNodes.includes(node)) ? "#1a1a2e" : "#e0e0e0";
  }

  let nodeList = Object.keys(graph).map(Number);
  let edges = [], seen = new Set();
  nodeList.forEach(node => {
    (graph[node] || []).forEach(neighbor => {
      let edgeKey = [Math.min(node, neighbor), Math.max(node, neighbor)].join("-");
      if (!seen.has(edgeKey) && positions[node] && positions[neighbor]) { seen.add(edgeKey); edges.push([node, neighbor]); }
    });
  });

  return (
    <div className="visualizer">
      <h2>BFS Graph Visualizer</h2>

      <div className="controls input-controls">
        <input
          type="text"
          placeholder='e.g. "0:1,2 | 1:0,3 | 2:0"'
          value={graphInput}
          onChange={(e) => setGraphInput(e.target.value)}
          disabled={isSorting}
        />
        <button onClick={loadUserGraph} disabled={isSorting} className="btn btn-secondary">Load Graph</button>
        <button onClick={loadDefaultGraph} disabled={isSorting} className="btn btn-secondary">Default Graph</button>
      </div>

      <div className="controls input-controls" style={{ marginTop: '10px' }}>
        <span style={{ marginRight: '10px' }}>Start Node:</span>
        <input
          type="number"
          value={startInput}
          onChange={(e) => setStartInput(e.target.value)}
          disabled={isSorting}
          style={{ width: '80px' }}
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

      <div className="bfs-graph-container">
        <svg width="600" height="300" className="bfs-svg">
          {edges.map(([a, b], i) => (
            <line key={i} x1={positions[a].x} y1={positions[a].y} x2={positions[b].x} y2={positions[b].y} stroke="#444" strokeWidth="2" />
          ))}
          {nodeList.map(node => positions[node] && (
            <g key={node}>
              <circle cx={positions[node].x} cy={positions[node].y} r={24} fill={getNodeColor(node)} style={{ transition: "fill 0.3s ease" }} />
              <text x={positions[node].x} y={positions[node].y + 5} textAnchor="middle" fontSize="14" fontWeight="bold" fill={getNodeTextColor(node)}>{node}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="bfs-queue-container">
        {queueNodes.length > 0 && (
          <div className="bfs-queue">
            <span className="bfs-queue-label">Queue:</span>
            {queueNodes.map((node, i) => <div key={i} className="binary-box bfs-queue-box">{node}</div>)}
          </div>
        )}
        {visitedNodes.length > 0 && (
          <div className="bfs-queue">
            <span className="bfs-queue-label">Visited:</span>
            {visitedNodes.map((node, i) => <div key={i} className="binary-box binary-right bfs-queue-box">{node}</div>)}
          </div>
        )}
      </div>

      <div className="bfs-legend">
        <span><span className="bfs-dot" style={{ background: "#f5a623" }} /> Current</span>
        <span><span className="bfs-dot" style={{ background: "#e74c3c" }} /> In Queue</span>
        <span><span className="bfs-dot" style={{ background: "#2ecc71" }} /> Visited</span>
        <span><span className="bfs-dot" style={{ background: "#0f3460" }} /> Unvisited</span>
      </div>

      <div className="controls playback-controls">
        <button onClick={startBFS} disabled={isSorting} className="btn btn-primary">Start</button>
        <button onClick={isPaused ? resumeBFS : pauseBFS} disabled={!isSorting} className="btn btn-secondary">{isPaused ? "Resume" : "Pause"}</button>
        <button onClick={stopBFS} disabled={!isSorting && !isPaused} className="btn btn-danger">Stop</button>
        <button onClick={handleRestart} disabled={!isSorting && !isPaused} className="btn btn-secondary">Restart</button>
      </div>

      <p className="binary-message">{message}</p>
    </div>
  );
}

export default BFSVisualizer;
