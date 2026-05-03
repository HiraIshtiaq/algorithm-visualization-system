import { useState, useEffect, useRef } from 'react'
import { coinChange } from '../algorithms/coinChange'

function CoinChangeVisualizer() {
  const [coinInput, setCoinInput] = useState('1, 2, 5')
  const [amountInput, setAmountInput] = useState('11')
  const [coins, setCoins] = useState([1, 2, 5])
  const [amount, setAmount] = useState(11)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(2)
  const timerRef = useRef(null)

  const speedVals   = { 1: 2000, 2: 800, 3: 300, 4: 50 };
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };

  const stopAnimation = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setIsPlaying(false)
  }

  const runInterval = (stepList, startFrom = 0) => {
    timerRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev + 1 >= stepList.length) { stopAnimation(); return prev; }
        return prev + 1;
      })
    }, speedVals[speed] || 800)
  }

  const pauseAnimation  = () => stopAnimation()
  const resumeAnimation = () => {
    if (steps.length === 0 || currentStep >= steps.length - 1) return;
    setIsPlaying(true); runInterval(steps);
  }

  const restartAnimation = () => {
    stopAnimation(); setCurrentStep(0);
    if (steps.length > 0) { setIsPlaying(true); runInterval(steps); }
  }

  const reset = () => { stopAnimation(); setSteps([]); setCurrentStep(0); }

  useEffect(() => { return () => stopAnimation() }, [])
  useEffect(() => {
    if (steps.length > 0 && currentStep === steps.length - 1) stopAnimation()
  }, [currentStep, steps.length])

  const applyCoins = () => {
    const arr = coinInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0)
    if (arr.length === 0) return;
    setCoins(arr); reset();
  }

  const applyAmount = () => {
    const val = parseInt(amountInput)
    if (!isNaN(val) && val > 0) { setAmount(val); reset(); }
  }

  const startVisualization = () => {
    stopAnimation()
    const parsedCoins  = coinInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0)
    const parsedAmount = parseInt(amountInput)
    if (parsedCoins.length === 0 || isNaN(parsedAmount) || parsedAmount <= 0) return;
    setCoins(parsedCoins); setAmount(parsedAmount);
    const result = coinChange(parsedCoins, parsedAmount)
    setSteps(result); setCurrentStep(0); setIsPlaying(true);
    timerRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev + 1 >= result.length) { stopAnimation(); return prev; }
        return prev + 1;
      })
    }, speedVals[speed] || 800)
  }

  const generateRandomCoins = () => {
    stopAnimation()
    const random = Array.from({ length: 3 }, () => Math.floor(Math.random() * 5) + 1)
    setCoinInput(random.join(', ')); setCoins(random); reset();
  }

  const currentStepData = steps[currentStep] || {
    explanation: 'Ready', description: 'Enter coins and amount, then click Start',
    amount: 0, coin: 0, minCoins: 0, coinsUsed: []
  }

  return (
    <div className="visualizer">
      <h2>Coin Change Visualizer</h2>

      <div className="controls input-controls">
        <input
          type="text"
          placeholder="Coins e.g. 1, 2, 5"
          value={coinInput}
          onChange={(e) => setCoinInput(e.target.value)}
          disabled={isPlaying}
        />
        <button onClick={applyCoins} disabled={isPlaying} className="btn btn-secondary">Set Coins</button>
        <button onClick={generateRandomCoins} disabled={isPlaying} className="btn btn-secondary">Randomize</button>
      </div>

      <div className="controls input-controls" style={{ marginTop: '10px' }}>
        <span style={{ marginRight: '10px' }}>Amount:</span>
        <input
          type="number"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          disabled={isPlaying}
          min="1"
          style={{ width: '100px' }}
        />
        <button onClick={applyAmount} disabled={isPlaying} className="btn btn-secondary">Set Amount</button>
      </div>

      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        {[1, 2, 3, 4].map((s) => (
          <button key={s} className={`btn btn-speed ${speed === s ? "active" : ""}`} onClick={() => setSpeed(s)}>
            {speedLabels[s]}
          </button>
        ))}
      </div>

      {/* DP Table */}
      {steps.length > 0 && currentStepData.dpTable && (
        <div className="dp-table-container" style={{ overflowX: "auto", margin: "16px 0" }}>
          <h3>DP Table</h3>
          <table className="dp-table" style={{ borderCollapse: "collapse", textAlign: "center" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount →</th>
                {currentStepData.dpTable.map((_, idx) => (
                  <th key={idx} style={{ border: "1px solid #ccc", padding: "8px", background: idx === currentStepData.amount ? "#fbbf24" : "" }}>{idx}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>Min Coins</td>
                {currentStepData.dpTable.map((val, idx) => (
                  <td key={idx} style={{ border: "1px solid #ccc", padding: "8px", background: idx === currentStepData.amount ? "#fbbf24" : "" }}>
                    {val === Infinity ? '∞' : val}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Result */}
      {steps.length > 0 && currentStepData.minCoins > 0 && (
        <div className="result-container">
          <div className="result-box">
            <span className="result-label">Minimum Coins:</span>
            <span className="result-value">{currentStepData.minCoins}</span>
          </div>
          {currentStepData.coinsUsed && currentStepData.coinsUsed.length > 0 && (
            <div className="result-box">
              <span className="result-label">Coins Used:</span>
              <span className="result-value coins-list">
                {currentStepData.coinsUsed.join(' + ')} = {currentStepData.coinsUsed.reduce((a, b) => a + b, 0)}
              </span>
            </div>
          )}
        </div>
      )}

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

export default CoinChangeVisualizer