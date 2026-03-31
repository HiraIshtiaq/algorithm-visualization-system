import { useState, useEffect } from 'react'
import { sudokuSolver } from '../algorithms/sudokuSolver'

function SudokuVisualizer() {
    const [boardInput, setBoardInput] = useState([
        [5,3,0,0,7,0,0,0,0], [6,0,0,1,9,5,0,0,0], [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3], [4,0,0,8,0,3,0,0,1], [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0], [0,0,0,4,1,9,0,0,5], [0,0,0,0,8,0,0,7,9]
    ])
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

    const startVisualization = () => {
        const result = sudokuSolver(boardInput)
        setSteps(result)
        setCurrentStep(0)
        setIsPlaying(true)
    }

    const currentStepData = steps[currentStep] || { 
        board: boardInput,
        explanation: 'Ready', 
        description: 'Click Start to begin',
        row: -1, col: -1
    }

    return (
        <div className="visualizer">
            <button className="start-btn" onClick={startVisualization}>Solve Sudoku</button>

            {steps.length > 0 && (
                <div className="visualization-area">
                    <div style={{ display: 'inline-block', margin: '0 auto' }}>
                        {currentStepData.board.map((row, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                                {row.map((cell, j) => {
                                    const isHighlighted = i === currentStepData.row && j === currentStepData.col
                                    const isOriginal = boardInput[i] && boardInput[i][j] !== 0
                                    return (
                                        <div key={j} style={{
                                            width: '45px', height: '45px', border: '1px solid #ccc',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold', fontSize: '1.2rem',
                                            backgroundColor: isHighlighted ? '#fbbf24' : (isOriginal ? '#e9d5ff' : 'white'),
                                            color: isOriginal ? '#6b21a8' : '#1f2937'
                                        }}>
                                            {cell !== 0 ? cell : ''}
                                        </div>
                                    )
                                })}
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
        </div>
    )
}

export default SudokuVisualizer