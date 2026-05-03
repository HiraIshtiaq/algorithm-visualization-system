import { useState, useRef } from "react";
import { kruskal } from "../algorithms/kruskal";

// ── Default graph data ─────────────────────────
const DEFAULT_NODES = 6;
const DEFAULT_EDGES = [
  { from: 0, to: 1, weight: 4 },
  { from: 0, to: 2, weight: 3 },
  { from: 1, to: 2, weight: 1 },
  { from: 1, to: 3, weight: 2 },
  { from: 2, to: 3, weight: 4 },
  { from: 3, to: 4, weight: 2 },
  { from: 4, to: 5, weight: 6 },
  { from: 3, to: 5, weight: 5 },
];

const DEFAULT_POSITIONS = {
  0: { x: 100, y: 80  },
  1: { x: 280, y: 80  },
  2: { x: 190, y: 200 },
  3: { x: 370, y: 200 },
  4: { x: 460, y: 80  },
  5: { x: 500, y: 230 },
};

function KruskalVisualizer() {

  // ── State ──────────────────────────────────────
  const [nodes, setNodes]         = useState(DEFAULT_NODES);
  const [edges, setEdges]         = useState(DEFAULT_EDGES);
  const [positions, setPositions] = useState(DEFAULT_POSITIONS);
  const [edgeInput, setEdgeInput] = useState("");

  const [mstEdges, setMSTEdges]           = useState([]); // edges added to MST
  const [rejectedEdges, setRejectedEdges] = useState([]); // edges that cause a cycle
  const [currentEdge, setCurrentEdge]     = useState(null); // edge being checked now
  const [sortedEdges, setSortedEdges]     = useState([]); // all edges sorted by weight

  const [message, setMessage]     = useState("");
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused]   = useState(false);
  const [speed, setSpeed]         = useState(2);

  // ── Refs (readable inside async algorithm) ─────
  const isPausedRef  = useRef(false);
  const isStoppedRef = useRef(false);
  const speedRef     = useRef(2);
  const speedVals   = { 1: 1000, 2: 500, 3: 200, 4: 50 };
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };
  function getDelay() { return speedVals[speedRef.current] || 500; }

  // ── Reset all highlights ───────────────────────
  function resetVisuals() {
    setMSTEdges([]);
    setRejectedEdges([]);
    setCurrentEdge(null);
    setSortedEdges([]);
    setMessage("");
  }

  // ── Load the built-in example graph ───────────
  function loadDefaultGraph() {
    stopAlgo();
    setNodes(DEFAULT_NODES);
    setEdges(DEFAULT_EDGES);
    setPositions(DEFAULT_POSITIONS);
    resetVisuals();
    setMessage("Default graph loaded. Press Start.");
  }

  // ── Load a graph typed by the user ────────────
  // Expected format: "0-1:4, 0-2:3, 1-2:1"
  function loadUserGraph() {
    stopAlgo();

    // Parse each "from-to:weight" entry
    let parsed = edgeInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => {
        let [nodePart, weight] = s.split(":");
        let [from, to] = nodePart.split("-").map(Number);
        return { from, to, weight: parseInt(weight) };
      });

    // Validate — every edge must have valid numbers
    let isInvalid = parsed.length === 0 ||
      parsed.some(e => isNaN(e.from) || isNaN(e.to) || isNaN(e.weight));

    if (isInvalid) {
      setMessage("Invalid format. Use: 0-1:4, 0-2:3, 1-2:1");
      return;
    }

    // Collect all unique node numbers
    let nodeSet = new Set();
    parsed.forEach(e => { nodeSet.add(e.from); nodeSet.add(e.to); });
    let nodeList = [...nodeSet].sort((a, b) => a - b);

    // Place nodes in a circle layout automatically
    let total = nodeList.length;
    let centerX = 300, centerY = 160, radius = 130;
    let newPositions = {};

    nodeList.forEach((node, i) => {
      let angle = (2 * Math.PI * i) / total - Math.PI / 2;
      newPositions[node] = {
        x: Math.round(centerX + radius * Math.cos(angle)),
        y: Math.round(centerY + radius * Math.sin(angle)),
      };
    });

    setEdges(parsed);
    setNodes(total);
    setPositions(newPositions);
    resetVisuals();
    setMessage("Graph loaded. Press Start.");
  }

  // ── Start the algorithm ────────────────────────
  async function startAlgo() {

    if (edges.length === 0) {
      setMessage("Please load a graph first");
      return;
    }

    isStoppedRef.current = false;
    isPausedRef.current  = false;
    setIsPaused(false);
    setIsSorting(true);
    resetVisuals();

    await kruskal(
      nodes, edges,
      setMSTEdges, setRejectedEdges, setCurrentEdge, setSortedEdges,
      setMessage, getDelay, isPausedRef, isStoppedRef
    );

    setIsSorting(false);
    setIsPaused(false);
  }

  // ── Pause ──────────────────────────────────────
  function pauseAlgo() {
    isPausedRef.current = true;
    setIsPaused(true);
    setMessage("Paused...");
  }

  // ── Resume ─────────────────────────────────────
  function resumeAlgo() {
    isPausedRef.current = false;
    setIsPaused(false);
    setMessage("Resuming...");
  }

  // ── Stop ───────────────────────────────────────
  function stopAlgo() {
    isStoppedRef.current = true;
    isPausedRef.current  = false;
    setIsSorting(false);
    setIsPaused(false);
    setCurrentEdge(null);
    setMessage("Stopped.");
  }

  function handleRestart() {
    stopAlgo();
    setTimeout(() => startAlgo(), 50);
  }

  function handleSpeedChange(val) { setSpeed(val); speedRef.current = val; }

  // ── Check what state an edge is in ────────────
  function isEdgeMatch(list, edge) {
    return list.some(e => e.from === edge.from && e.to === edge.to);
  }

  // Edge line color
  function getEdgeColor(edge) {
    if (currentEdge && isEdgeMatch([currentEdge], edge)) return "#f5a623"; // orange — checking
    if (isEdgeMatch(mstEdges, edge))                      return "#2ecc71"; // green  — in MST
    if (isEdgeMatch(rejectedEdges, edge))                 return "#e74c3c"; // red    — rejected
    return "#555";                                                           // grey   — not yet checked
  }

  // Edge line thickness
  function getEdgeWidth(edge) {
    let isImportant = isEdgeMatch(mstEdges, edge) ||
      (currentEdge && isEdgeMatch([currentEdge], edge));
    return isImportant ? 3 : 1.5;
  }

  // Chip class for the sorted edge list
  function getChipClass(edge) {
    if (currentEdge && isEdgeMatch([currentEdge], edge)) return "kruskal-edge-chip chip-current";
    if (isEdgeMatch(mstEdges, edge))                      return "kruskal-edge-chip chip-mst";
    if (isEdgeMatch(rejectedEdges, edge))                 return "kruskal-edge-chip chip-rejected";
    return "kruskal-edge-chip";
  }

  let nodeList = Object.keys(positions).map(Number);

  // ── Render ─────────────────────────────────────
  return (

    <div className="visualizer">

      <h2>Kruskal's Algorithm Visualization</h2>

      <div className="controls input-controls">
        <input
          type="text"
          placeholder='e.g. "0-1:4, 0-2:3, 1-2:1"'
          value={edgeInput}
          onChange={(e) => setEdgeInput(e.target.value)}
          disabled={isSorting}
        />
        <button onClick={loadUserGraph} disabled={isSorting} className="btn btn-secondary">Load Graph</button>
        <button onClick={loadDefaultGraph} disabled={isSorting} className="btn btn-secondary">Default Graph</button>
      </div>

      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        {[1, 2, 3, 4].map((s) => (
          <button key={s} className={`btn btn-speed ${speed === s ? "active" : ""}`} onClick={() => handleSpeedChange(s)}>
            {speedLabels[s]}
          </button>
        ))}
      </div>

      <div className="controls playback-controls">
        <button onClick={startAlgo} disabled={isSorting} className="btn btn-primary">Start</button>
        <button onClick={isPaused ? resumeAlgo : pauseAlgo} disabled={!isSorting} className="btn btn-secondary">{isPaused ? "Resume" : "Pause"}</button>
        <button onClick={stopAlgo} disabled={!isSorting && !isPaused} className="btn btn-danger">Stop</button>
        <button onClick={handleRestart} disabled={!isSorting && !isPaused} className="btn btn-secondary">Restart</button>
      </div>

      {/* Graph SVG */}
      <div className="bfs-graph-container">
        <svg width="620" height="320" className="bfs-svg">

          {/* Draw edges with weight labels */}
          {edges.map((edge, i) => {
            let a = positions[edge.from];
            let b = positions[edge.to];
            if (!a || !b) return null;
            return (
              <g key={i}>
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={getEdgeColor(edge)}
                  strokeWidth={getEdgeWidth(edge)}
                  style={{ transition: "stroke 0.3s" }}
                />
                <text
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2 - 6}
                  textAnchor="middle" fontSize="12" fill="#ccc" fontWeight="bold"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {/* Draw nodes */}
          {nodeList.map(node => (
            positions[node] && (
              <g key={node}>
                <circle cx={positions[node].x} cy={positions[node].y} r={22} fill="#0f3460" />
                <text
                  x={positions[node].x} y={positions[node].y + 5}
                  textAnchor="middle" fontSize="13" fontWeight="bold" fill="#e0e0e0"
                >
                  {node}
                </text>
              </g>
            )
          ))}

        </svg>
      </div>

      {/* Sorted edge chips — show after algorithm starts */}
      {sortedEdges.length > 0 && (
        <div className="kruskal-edge-list">
          <span className="bfs-queue-label">Edges (sorted):</span>
          <div className="kruskal-edges">
            {sortedEdges.map((edge, i) => (
              <span key={i} className={getChipClass(edge)}>
                {edge.from}–{edge.to} ({edge.weight})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bfs-legend">
        <span><span className="bfs-dot" style={{ background: "#f5a623" }} /> Checking</span>
        <span><span className="bfs-dot" style={{ background: "#2ecc71" }} /> In MST</span>
        <span><span className="bfs-dot" style={{ background: "#e74c3c" }} /> Rejected (cycle)</span>
        <span><span className="bfs-dot" style={{ background: "#555" }} /> Unprocessed</span>
      </div>

      <p className="binary-message">{message}</p>

    </div>

  );

}

export default KruskalVisualizer;
