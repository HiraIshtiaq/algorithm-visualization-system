
import { useState, useRef } from "react";
import { dfs } from "../algorithms/dfs";

function DFSVisualizer() {
  const [graph, setGraph] = useState({
    A: ["B", "C"],
    B: ["D", "E"],
    C: ["F","G"],
    D: [],
    E: [],
    F: [],
    G: []
  });

  const [visited, setVisited] = useState([]);
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  const flags = useRef({ stop: false, pause: false });

  function delay(ms = 800) {
    return new Promise(res => setTimeout(res, ms));
  }

  async function startDFS() {
    setVisited([]);
    setMessage("");

    flags.current.stop = false;
    flags.current.pause = false;

    setRunning(true);
    setPaused(false);

    const startNode = Object.keys(graph)[0];

    if (!startNode) {
      setMessage("Graph is empty!");
      return;
    }

    await dfs(graph, startNode, setVisited, setMessage, delay, flags.current);

    setRunning(false);
  }

  function pauseDFS() {
    flags.current.pause = true;
    setPaused(true);
    setMessage("Paused");
  }

  function resumeDFS() {
    flags.current.pause = false;
    setPaused(false);
    setMessage("Resumed");
  }

  function stopDFS() {
    flags.current.stop = true;
    flags.current.pause = false;

    setRunning(false);
    setPaused(false);
    setVisited([]);
    setMessage("Stopped");
  }

  function handleGraphInput(e) {
    try {
      const obj = JSON.parse(e.target.value);
      setGraph(obj);
      setVisited([]);
      setMessage("Custom graph loaded!");
    } catch {
      setMessage("Invalid JSON format!");
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

  layer.forEach((node, i) => {
    positions[node] = {
      x: startX + i * 100,
      y: 80 + y * 100
    };
  });
});

  const edges = [];
  Object.keys(graph).forEach(from => {
    (graph[from] || []).forEach(to => edges.push([from, to]));
  });

  return (
    <div className="visualizer">
      <h2>DFS Graph Visualizer</h2>

      <textarea
        placeholder='{"A":["B","C"],"B":["D"],"C":[],"D":[]}'
        onChange={handleGraphInput}
      />

      <div className="graph-canvas">
        <svg className="graph-svg">
          {edges.map(([from, to]) => (
            <line
                key={from + "-" + to}
                x1={positions[from]?.x + 0.5}
                y1={positions[from]?.y + 0.5}
                x2={positions[to]?.x + 0.5}
                y2={positions[to]?.y + 0.5}
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
            />
          ))}
        </svg>

        {Object.keys(graph).map(node => (
          <div
            key={node}
            className={`graph-node ${visited.includes(node) ? "visited" : ""}`}
            style={{
              left: (positions[node]?.x || 0) - 25,
              top: (positions[node]?.y || 0) - 25
            }}
          >
            {node}
          </div>
        ))}
      </div>

      <p>{message}</p>

      <div className="controls">
        <button onClick={startDFS} disabled={running}>Start</button>
        <button onClick={pauseDFS} disabled={!running || paused}>Pause</button>
        <button onClick={resumeDFS} disabled={!running || !paused}>Resume</button>
        <button onClick={stopDFS} disabled={!running}>Stop</button>
      </div>
    </div>
  );
}

export default DFSVisualizer;