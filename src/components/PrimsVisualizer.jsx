import { useState } from 'react'
import { primsAlgorithm } from '../algorithms/primsAlgorithm'

function PrimsVisualizer() {
    const [nodeInput, setNodeInput] = useState('A, B, C, D')
    const [edgeInput, setEdgeInput] = useState('A-B:4, A-C:2, B-C:1, B-D:5, C-D:3')
    const [nodes, setNodes] = useState(['A', 'B', 'C', 'D'])
    const [edges, setEdges] = useState([
        { from: 'A', to: 'B', weight: 4 },
        { from: 'A', to: 'C', weight: 2 },
        { from: 'B', to: 'C', weight: 1 },
        { from: 'B', to: 'D', weight: 5 },
        { from: 'C', to: 'D', weight: 3 }
    ])
    
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    const updateNodesFromInput = () => {
        try {
            const arr = nodeInput.split(',').map(n => n.trim())
            if (arr.length < 2) {
                alert('Please enter at least 2 nodes')
                return
            }
            setNodes(arr)
        } catch (error) {
            alert('Please enter nodes like: A, B, C, D')
        }
    }

    const updateEdgesFromInput = () => {
        try {
            const edgeList = edgeInput.split(',').map(e => e.trim())
            const parsedEdges = []
            
            for (let edge of edgeList) {
                const match = edge.match(/([A-Za-z0-9]+)-([A-Za-z0-9]+):(\d+)/)
                if (match) {
                    parsedEdges.push({
                        from: match[1],
                        to: match[2],
                        weight: parseInt(match[3])
                    })
                } else {
                    alert(`Invalid edge format: ${edge}. Use format: A-B:4`)
                    return
                }
            }
            setEdges(parsedEdges)
        } catch (error) {
            alert('Please enter edges like: A-B:4, A-C:2')
        }
    }

    const generateRandomGraph = () => {
        const randomNodes = ['A', 'B', 'C', 'D']
        const randomEdges = [
            { from: 'A', to: 'B', weight: Math.floor(Math.random() * 10) + 1 },
            { from: 'A', to: 'C', weight: Math.floor(Math.random() * 10) + 1 },
            { from: 'B', to: 'C', weight: Math.floor(Math.random() * 10) + 1 },
            { from: 'B', to: 'D', weight: Math.floor(Math.random() * 10) + 1 },
            { from: 'C', to: 'D', weight: Math.floor(Math.random() * 10) + 1 }
        ]
        
        setNodeInput(randomNodes.join(', '))
        setNodes(randomNodes)
        
        const edgeString = randomEdges.map(e => `${e.from}-${e.to}:${e.weight}`).join(', ')
        setEdgeInput(edgeString)
        setEdges(randomEdges)
    }

    const startVisualization = () => {
        const result = primsAlgorithm(nodes, edges)
        setSteps(result)
        setCurrentStep(0)
        setIsPlaying(true)
        
        let step = 0
        const timer = setInterval(() => {
            if (step < result.length - 1) {
                setCurrentStep(++step)
            } else {
                clearInterval(timer)
                setIsPlaying(false)
            }
        }, 1500)
    }

    const currentStepData = steps[currentStep] || { 
        graph: { nodes: nodes, edges: edges },
        explanation: 'Ready', 
        description: 'Enter graph and click Start',
        visited: [],
        edges: []
    }

    const getNodeCoordinates = (nodeList) => {
        const coords = {}
        const positions = [
            { x: 100, y: 50 }, { x: 300, y: 50 },
            { x: 200, y: 150 }, { x: 100, y: 250 },
            { x: 300, y: 250 }, { x: 200, y: 300 }
        ]
        nodeList.forEach((node, index) => {
            coords[node] = positions[index % positions.length]
        })
        return coords
    }

    const coords = getNodeCoordinates(nodes)

    return (
        <div className="visualizer">
            <div className="input-section">
                <div className="input-row">
                    <label>Nodes:</label>
                    <input type="text" value={nodeInput} onChange={(e) => setNodeInput(e.target.value)} />
                    <button className="small-btn" onClick={updateNodesFromInput}>Update Nodes</button>
                </div>
                <div className="input-row">
                    <label>Edges:</label>
                    <input type="text" value={edgeInput} onChange={(e) => setEdgeInput(e.target.value)} />
                    <button className="small-btn" onClick={updateEdgesFromInput}>Update Edges</button>
                </div>
                <div className="input-row">
                    <button className="small-btn" onClick={generateRandomGraph}>Random Graph</button>
                </div>
                <div className="current-array">
                    <strong>Current:</strong> Nodes [{nodes.join(', ')}] | Edges: {edges.map(e => `${e.from}-${e.to}:${e.weight}`).join(', ')}
                </div>
            </div>

            <button className="start-btn" onClick={startVisualization}>Start Prim's Algorithm</button>

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
                                          stroke={isSelected ? '#10b981' : '#ccc'} strokeWidth={isSelected ? 3 : 1} />
                                    <text x={(coords[edge.from].x + coords[edge.to].x) / 2}
                                          y={(coords[edge.from].y + coords[edge.to].y) / 2 - 5}
                                          textAnchor="middle" fontSize="10" fill="#666">{edge.weight}</text>
                                </g>
                            )
                        })}
                        {currentStepData.graph.nodes.map(node => {
                            const isVisited = currentStepData.visited?.includes(node)
                            if (!coords[node]) return null
                            return (
                                <g key={node}>
                                    <circle cx={coords[node].x} cy={coords[node].y} r="25" fill={isVisited ? '#10b981' : '#667eea'} stroke="#333" strokeWidth="1" />
                                    <text x={coords[node].x} y={coords[node].y} textAnchor="middle" dy=".3em" fill="white" fontWeight="bold">{node}</text>
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
        </div>
    )
}

export default PrimsVisualizer