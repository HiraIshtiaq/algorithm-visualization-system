import { useState, useEffect } from 'react'
import { quickSort } from '../algorithms/quickSort'

function QuickSortVisualizer() {
    const [inputArray, setInputArray] = useState('5, 3, 8, 1, 9, 2')
    const [array, setArray] = useState([5, 3, 8, 1, 9, 2])
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(2)

    const speedMap = { 1: 3000, 2: 1500, 3: 500, 4: 100 }
    const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" }

    useEffect(() => {
        let timer
        const ms = speedMap[speed] || 1500
        if (isPlaying && currentStep < steps.length - 1) {
            timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1)
            }, ms)
        } else if (currentStep === steps.length - 1) {
            setIsPlaying(false)
        }
        return () => clearTimeout(timer)
    }, [isPlaying, currentStep, steps.length, speed])

    const getMaxValue = (arr) => Math.max(...arr, 1)

    const updateArrayFromInput = () => {
        try {
            const arr = inputArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
            if (arr.length === 0) return
            setArray(arr); setSteps([]); setCurrentStep(0); setIsPlaying(false);
        } catch (error) {
            alert('Please enter numbers like: 5, 3, 8, 1, 9, 2')
        }
    }

    const generateRandomArray = () => {
        const random = Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) + 1)
        setInputArray(random.join(', '))
        setArray(random); setSteps([]); setCurrentStep(0); setIsPlaying(false);
    }

    const startVisualization = () => {
        const result = quickSort(array)
        setSteps(result); setCurrentStep(0); setIsPlaying(true)
    }

    const handlePauseResume = () => setIsPlaying(!isPlaying)

    const handleStop = () => {
        setIsPlaying(false); setSteps([]); setCurrentStep(0)
    }

    const handleRestart = () => {
        handleStop();
        setTimeout(() => startVisualization(), 50);
    }

    const currentStepData = steps[currentStep] || { 
        array: array, 
        explanation: 'Ready', 
        description: 'Enter your array and click Start' 
    }

    const maxValue = getMaxValue(currentStepData.array)
    const maxHeight = 250

    return (
        <div className="visualizer">
            <h2>Quick Sort Visualizer</h2>
            <div className="controls input-controls">
                <input 
                    type="text" 
                    value={inputArray} 
                    onChange={(e) => setInputArray(e.target.value)}
                    placeholder="e.g. 5, 3, 8, 1, 9, 2"
                    disabled={isPlaying}
                />
                <button onClick={updateArrayFromInput} disabled={isPlaying} className="btn btn-secondary">Load Array</button>
                <button onClick={generateRandomArray} disabled={isPlaying} className="btn btn-secondary">Randomize</button>
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
                    <div className="bars-container">
                        {currentStepData.array.map((value, index) => (
                            <div
                                key={index}
                                className="bar"
                                style={{ height: `${(value / maxValue) * maxHeight}px` }}
                            >
                                <span className="value">{value}</span>
                                <span className="index">{index}</span>
                            </div>
                        ))}
                    </div>

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
                <button onClick={handlePauseResume} disabled={steps.length === 0} className="btn btn-secondary">
                    {isPlaying ? "Pause" : "Resume"}
                </button>
                <button onClick={handleStop} disabled={steps.length === 0} className="btn btn-danger">Stop</button>
                <button onClick={handleRestart} disabled={steps.length === 0} className="btn btn-secondary">Restart</button>
            </div>
        </div>
    )
}
export default QuickSortVisualizer
