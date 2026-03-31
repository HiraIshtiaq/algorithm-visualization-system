import { useState, useEffect } from 'react'
import { quickSort } from '../algorithms/quickSort'

function QuickSortVisualizer() {
    const [inputArray, setInputArray] = useState('5, 3, 8, 1, 9, 2')
    const [array, setArray] = useState([5, 3, 8, 1, 9, 2])
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

    const updateArrayFromInput = () => {
        try {
            const arr = inputArray.split(',').map(n => parseInt(n.trim()))
            if (arr.some(isNaN)) {
                alert('Please enter valid numbers only')
                return
            }
            setArray(arr)
        } catch (error) {
            alert('Please enter numbers like: 5, 3, 8, 1, 9, 2')
        }
    }

    const generateRandomArray = () => {
        const random = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1)
        setInputArray(random.join(', '))
        setArray(random)
    }

    const startVisualization = () => {
        updateArrayFromInput()
        const result = quickSort(array)
        setSteps(result)
        setCurrentStep(0)
        setIsPlaying(true)
    }

    const currentStepData = steps[currentStep] || { 
        array: array, 
        explanation: 'Ready to start', 
        description: 'Enter your array and click Start Visualization' 
    }

    const maxValue = getMaxValue(currentStepData.array)
    const maxHeight = 250

    return (
        <div className="visualizer">
            <div className="input-section">
                <div className="input-row">
                    <label>Enter Array:</label>
                    <input 
                        type="text" 
                        value={inputArray} 
                        onChange={(e) => setInputArray(e.target.value)}
                        placeholder="e.g., 5, 3, 8, 1, 9, 2"
                    />
                    <button className="small-btn" onClick={generateRandomArray}>Random</button>
                    <button className="small-btn primary" onClick={updateArrayFromInput}>Update</button>
                </div>
                <div className="current-array"><strong>Current:</strong> [{array.join(', ')}]</div>
            </div>

            <button className="start-btn" onClick={startVisualization}>
                Start Quick Sort
            </button>

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

export default QuickSortVisualizer