import { useState, useEffect } from 'react'
import { linearSearch } from '../algorithms/linearSearch'

function LinearSearchVisualizer() {
    const [inputArray, setInputArray] = useState('16, 14, 13, 10, 15, 17')
    const [target, setTarget] = useState('5')
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        let timer
        if (isPlaying && currentStep < steps.length - 1) {
            timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1)
            }, 1500)
        } else if (currentStep === steps.length - 1) {
            setIsPlaying(false)
        }
        return () => clearTimeout(timer)
    }, [isPlaying, currentStep, steps.length])

    const getMaxValue = (arr) => {
        return Math.max(...arr, 10)
    }

    const startSearch = () => {
        try {
            const arr = inputArray.split(',').map(n => parseInt(n.trim()))
            if (arr.some(isNaN)) {
                alert('Please enter valid numbers only')
                return
            }
            const result = linearSearch(arr, target)
            setSteps(result)
            setCurrentStep(0)
            setIsPlaying(true)
        } catch (error) {
            alert('Please enter numbers like: 5, 3, 8, 1, 9, 2')
        }
    }

    const generateRandomArray = () => {
        const random = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1)
        setInputArray(random.join(', '))
    }

    const currentStepData = steps[currentStep] || { 
        array: inputArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)),
        explanation: 'Ready', 
        description: 'Click Start Search to begin',
        comparing: [],
        found: []
    }

    const maxValue = getMaxValue(currentStepData.array)
    const maxHeight = 250

    return (
        <div className="visualizer">
            <div className="input-section">
                <div className="input-row">
                    <label>Array:</label>
                    <input 
                        type="text" 
                        value={inputArray} 
                        onChange={(e) => setInputArray(e.target.value)}
                        placeholder="e.g., 5, 3, 8, 1, 9, 2"
                    />
                    <button className="small-btn" onClick={generateRandomArray}>Random</button>
                </div>
                <div className="input-row">
                    <label>Target:</label>
                    <input 
                        type="number" 
                        value={target} 
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="Enter number"
                    />
                    <button className="small-btn primary" onClick={startSearch}>Start Search</button>
                </div>
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
                                <div
                                    key={index}
                                    className={barClass}
                                    style={{ height: `${barHeight}px` }}
                                >
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
                        <div 
                            className="progress-fill"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LinearSearchVisualizer