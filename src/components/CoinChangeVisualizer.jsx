import { useState, useEffect } from 'react'
import { coinChange } from '../algorithms/coinChange'

function CoinChangeVisualizer() {
    const [coinInput, setCoinInput] = useState('1, 2, 5')
    const [amountInput, setAmountInput] = useState('11')
    const [coins, setCoins] = useState([1, 2, 5])
    const [amount, setAmount] = useState(11)
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

    const updateCoinsFromInput = () => {
        try {
            const arr = coinInput.split(',').map(n => parseInt(n.trim()))
            if (arr.some(isNaN)) {
                alert('Please enter valid numbers only')
                return
            }
            setCoins(arr)
        } catch (error) {
            alert('Please enter coins like: 1, 2, 5')
        }
    }

    const updateAmountFromInput = () => {
        const val = parseInt(amountInput)
        if (isNaN(val) || val <= 0) {
            alert('Please enter a valid positive number')
            return
        }
        setAmount(val)
    }

    const startVisualization = () => {
        updateCoinsFromInput()
        updateAmountFromInput()
        const result = coinChange(coins, amount)
        setSteps(result)
        setCurrentStep(0)
        setIsPlaying(true)
    }

    const generateRandomCoins = () => {
        const random = Array.from({ length: 3 }, () => Math.floor(Math.random() * 5) + 1)
        setCoinInput(random.join(', '))
        setCoins(random)
    }

    const currentStepData = steps[currentStep] || { 
        explanation: 'Ready', 
        description: 'Enter coins and amount, then click Start'
    }

    return (
        <div className="visualizer">
            <div className="input-section">
                <div className="input-row">
                    <label>Coins:</label>
                    <input type="text" value={coinInput} onChange={(e) => setCoinInput(e.target.value)} />
                    <button className="small-btn" onClick={generateRandomCoins}>Random</button>
                    <button className="small-btn primary" onClick={updateCoinsFromInput}>Update</button>
                </div>
                <div className="input-row">
                    <label>Amount:</label>
                    <input type="number" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} min="1" />
                    <button className="small-btn primary" onClick={updateAmountFromInput}>Set</button>
                </div>
                <div className="current-array">
                    <strong>Current:</strong> Coins [{coins.join(', ')}], Amount = {amount}
                </div>
            </div>

            <button className="start-btn" onClick={startVisualization}>Start Coin Change</button>

            {steps.length > 0 && (
                <div className="visualization-area">
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

export default CoinChangeVisualizer