import { useState, useEffect, useRef } from 'react'
import { linearSearch } from '../algorithms/linearSearch'

function LinearSearchVisualizer() {
    const [inputArray, setInputArray] = useState('5, 3, 8, 1, 9, 2')
    const [target, setTarget] = useState('5')
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(2)

    const speedVals   = { 1: 1500, 2: 800, 3: 300, 4: 50 };
    const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };
    const timerRef = useRef(null)

    const stopAnimationInternal = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
        setIsPlaying(false)
    }

    const stopAnimation = () => {
        stopAnimationInternal()
    }

    const startAnimation = (stepList) => {
        if (!stepList || stepList.length === 0) return
        setIsPlaying(true)
        timerRef.current = setInterval(() => {
            setCurrentStep(prev => {
                if (prev + 1 >= stepList.length) {
                    stopAnimationInternal()
                    return prev
                }
                return prev + 1
            })
        }, speedVals[speed] || 800)
    }

    const pauseAnimation = () => stopAnimationInternal()
    const resumeAnimation = () => {
        if (steps.length === 0 || currentStep >= steps.length - 1) return
        startAnimation(steps)
    }

    useEffect(() => {
        return () => stopAnimationInternal()
    }, [])

    useEffect(() => {
        if (steps.length > 0 && currentStep === steps.length - 1) {
            stopAnimationInternal()
        }
    }, [currentStep, steps.length])

    const startSearch = () => {
        stopAnimationInternal()
        const arr = inputArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
        if (arr.length === 0) return
        const result = linearSearch(arr, target)
        setSteps(result)
        setCurrentStep(0)
        startAnimation(result)
    }

    const handleRestart = () => {
        stopAnimationInternal()
        setCurrentStep(0)
        setTimeout(() => startSearch(), 50)
    }

    const generateRandomArray = () => {
        stopAnimationInternal()
        const random = Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) + 1)
        setInputArray(random.join(', '))
        setSteps([])
        setCurrentStep(0)
    }

    const currentStepData = steps[currentStep] || {
        array: inputArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)),
        explanation: 'Ready',
        description: 'Enter array and target, then click Start',
        comparing: [],
        found: []
    }

    const getMaxValue = (arr) => Math.max(...arr, 1)
    const maxValue = getMaxValue(currentStepData.array)
    const maxHeight = 250

    return (
        <div className="visualizer">
            <h2>Linear Search Visualizer</h2>
            <div className="controls input-controls">
                <input 
                    type="text" 
                    value={inputArray} 
                    onChange={(e) => setInputArray(e.target.value)}
                    placeholder="e.g. 5, 3, 8, 1, 9, 2"
                    disabled={isPlaying}
                />
                <button onClick={generateRandomArray} disabled={isPlaying} className="btn btn-secondary">Randomize</button>
            </div>
            
            <div className="controls input-controls" style={{ marginTop: '10px' }}>
                <span style={{ marginRight: '10px' }}>Target:</span>
                <input 
                    type="number" 
                    value={target} 
                    onChange={(e) => setTarget(e.target.value)} 
                    disabled={isPlaying}
                    style={{ width: '100px' }}
                />
            </div>

            <div className="speed-control">
                <span className="speed-label">Speed:</span>
                {[1, 2, 3, 4].map((s) => (
                    <button
                        key={s}
                        className={`btn btn-speed ${speed === s ? "active" : ""}`}
                        onClick={() => setSpeed(s)}
                    >
                        {speedLabels[s]}
                    </button>
                ))}
            </div>

            {steps.length > 0 && (
                <div className="visualization-area">
                    <div className="bars-container">
                        {currentStepData.array.map((value, index) => {
                            let barClass = 'bar'
                            if (currentStepData.comparing?.includes(index)) barClass += ' comparing'
                            if (currentStepData.found?.includes(index)) barClass += ' found'
                            const barHeight = (value / maxValue) * maxHeight
                            return (
                                <div key={index} className={barClass} style={{ height: `${barHeight}px` }}>
                                    <span className="value">{value}</span>
                                    <span className="index">{index}</span>
                                </div>
                            )
                        })}
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
                <button onClick={startSearch} disabled={isPlaying} className="btn btn-primary">Start</button>
                <button onClick={isPlaying ? pauseAnimation : resumeAnimation} disabled={steps.length === 0} className="btn btn-secondary">
                    {isPlaying ? "Pause" : "Resume"}
                </button>
                <button onClick={stopAnimation} disabled={steps.length === 0} className="btn btn-danger">Stop</button>
                <button onClick={handleRestart} disabled={steps.length === 0} className="btn btn-secondary">Restart</button>
            </div>
        </div>
    )
}

export default LinearSearchVisualizer