import { useState, useEffect, useRef } from 'react'
import { primsAlgorithm } from '../algorithms/primsAlgorithm'

function PrimsVisualizer() {
  const [edgeInput, setEdgeInput] = useState('A-B:4, A-C:2, B-C:1, B-D:5, C-D:3')
  const [nodes, setNodes] = useState(['A', 'B', 'C', 'D'])
  const [edges, setEdges] = useState([
    { from: 'A', to: 'B', weight: 4 }, { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 }, { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 3 }
  ])
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(2)
  const timerRef = useRef(null)

  const speedVals   = { 1: 2000, 2: 1000, 3: 400, 4: 50 }
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" }

  const stopAnimation = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setIsPlaying(false)
  }

  const runInterval = (stepList) => {
    timerRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev + 1 >= stepList.length) { stopAnimation(); return prev; }
        return prev + 1
      })
    }, speedVals[speed] || 1000)
  }

  const pauseAnimation  = () => stopAnimation()
  const resumeAnimation = () => {
    if (steps.length === 0 || currentStep >= steps.length - 1) return
    setIsPlaying(true); runInterval(steps)
  }

  const restartAnimation = () => {
    stopAnimation(); setCurrentStep(0)
    if (steps.length > 0) { setIsPlaying(true); runInterval(steps) }
  }

  const reset = () => { stopAnimation(); setSteps([]); setCurrentStep(0) }

  useEffect(() => { return () => stopAnimation() }, [])
  useEffect(() => {
    if (steps.length > 0 && currentStep === steps.length - 1) stopAnimation()
  }, [currentStep, steps.length])

  const loadEdgesFromInput = () => {
    stopAnimation()
    try {
      const edgeList = edgeInput.split(',').map(e => e.trim())
      const parsedEdges = []
      const nodeSet = new Set()
      for (let edge of edgeList) {
        const match = edge.match(/([A-Za-z0-9]+)-([A-Za-z0-9]+):(\d+)/)
        if (match) {
          parsedEdges.push({ from: match[1], to: match[2], weight: parseInt(match[3]) })
          nodeSet.add(match[1]); nodeSet.add(match[2])
        } else { alert(`Invalid edge format: ${edge}. Use format: A-B:4`); return }
      }
      setEdges(parsedEdges); setNodes([...nodeSet]); reset()
    } catch { alert('Please enter edges like: A-B:4, A-C:2') }
  }

  const generateRandomGraph = () => {
    stopAnimation()
    const weights = () => Math.floor(Math.random() * 9) + 1
    const e = [
      { from: 'A', to: 'B', weight: weights() }, { from: 'A', to: 'C', weight: weights() },
      { from: 'B', to: 'C', weight: weights() }, { from: 'B', to: 'D', weight: weights() },
      { from: 'C', to: 'D', weight: weights() }
    ]
    setEdgeInput(e.map(x => `${x.from}-${x.to}:${x.weight}`).join(', '))
    setEdges(e); setNodes(['A', 'B', 'C', 'D']); reset()
  }

  const startVisualization = () => {
    stopAnimation()
    const result = primsAlgorithm(nodes, edges)
    setSteps(result); setCurrentStep(0); setIsPlaying(true); runInterval(result)
  }

  const currentStepData = steps[currentStep] || {
    graph: { nodes, edges }, explanation: 'Ready', description: 'Enter edges and click Start', visited: [], edges: []
  }

  const getNodeCoordinates = (nodeList) => {
    const coords = {}
    const positions = [
      { x: 100, y: 50 }, { x: 300, y: 50 }, { x: 200, y: 150 },
      { x: 100, y: 250 }, { x: 300, y: 250 }, { x: 200, y: 300 }
    ]
    nodeList.forEach((node, index) => { coords[node] = positions[index % positions.length] })
    return coords
  }

  const coords = getNodeCoordinates(nodes)

  return (
    <div className="visualizer">
      <h2>Prim's Algorithm Visualizer</h2>

      <div className="controls input-controls">
        <input
          type="text"
          placeholder="Edges e.g. A-B:4, A-C:2, B-C:1"
          value={edgeInput}
          onChange={(e) => setEdgeInput(e.target.value)}
          disabled={isPlaying}
        />
        <button onClick={loadEdgesFromInput} disabled={isPlaying} className="btn btn-secondary">Load Graph</button>
        <button onClick={generateRandomGraph} disabled={isPlaying} className="btn btn-secondary">Randomize</button>
      </div>

      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        {[1, 2, 3, 4].map((s) => (
          <button key={s} className={`btn btn-speed ${speed === s ? "active" : ""}`} onClick={() => setSpeed(s)}>
            {speedLabels[s]}
          </button>
        ))}
      </div>

      {steps.length > 0 && (
        <div className="visualization-area">
          <svg width="400" height="300" style={{ margin: '0 auto', display: 'block' }}>
            {currentStepData.graph.edges.map((edge, i) => {
              const isSelected = currentStepData.edges?.some(e =>
                (e[0] === edge.from && e[1] === edge.to) || (e[0] === edge.to && e[1] === edge.from)
              )
              if (!coords[edge.from] || !coords[edge.to]) return null
              return (
                <g key={i}>
                  <line x1={coords[edge.from].x} y1={coords[edge.from].y}
                        x2={coords[edge.to].x} y2={coords[edge.to].y}
                        stroke={isSelected ? '#10b981' : '#ccc'} strokeWidth={isSelected ? 4 : 2} />
                  <text x={(coords[edge.from].x + coords[edge.to].x) / 2}
                        y={(coords[edge.from].y + coords[edge.to].y) / 2 - 5}
                        textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">{edge.weight}</text>
                </g>
              )
            })}
            {currentStepData.graph.nodes.map(node => {
              const isVisited = currentStepData.visited?.includes(node)
              if (!coords[node]) return null
              return (
                <g key={node}>
                  <circle cx={coords[node].x} cy={coords[node].y} r="25"
                          fill={isVisited ? '#10b981' : '#667eea'} stroke="#333" strokeWidth="2" />
                  <text x={coords[node].x} y={coords[node].y} textAnchor="middle" dy=".3em"
                        fill="white" fontWeight="bold">{node}</text>
                </g>
              )
            })}
          </svg>

          <div className="step-explanation">
            <span className="step-badge">{currentStepData.explanation}</span>
            <p className="step-description">{currentStepData.description}</p>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
          </div>
        </div>
      )}

      <div className="controls playback-controls">
        <button onClick={startVisualization} disabled={isPlaying} className="btn btn-primary">Start</button>
        <button onClick={isPlaying ? pauseAnimation : resumeAnimation} disabled={steps.length === 0} className="btn btn-secondary">
          {isPlaying ? "Pause" : "Resume"}
        </button>
        <button onClick={stopAnimation} disabled={steps.length === 0} className="btn btn-danger">Stop</button>
        <button onClick={restartAnimation} disabled={steps.length === 0} className="btn btn-secondary">Restart</button>
      </div>
    </div>
  )
}

export default PrimsVisualizer