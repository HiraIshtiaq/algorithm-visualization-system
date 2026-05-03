import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getBucketSortAnimations, generateRandomArray, BUCKET_COLORS } from '../algorithms/bucketSort';

const BAR = {
  DEFAULT: '#1976d2',
  COMPARE: '#ef5350',
  SORTED:  '#43a047',
};
const MIN_BARS = 5, MAX_BARS = 50, MIN_D = 10, MAX_D = 500;

const LEGEND = [
  { color: BAR.DEFAULT, label: 'Unsorted' },
  { color: BAR.COMPARE, label: 'Comparing' },
  { color: BAR.SORTED,  label: 'Sorted ✓' },
];

export default function BucketSortVisualizer() {
  const [length,    setLength]    = useState(28);
  const [speed,     setSpeed]     = useState(2);
  const [array,     setArray]     = useState([]);
  const [colors,    setColors]    = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused,  setIsPaused]  = useState(false);
  const [isSorted,  setIsSorted]  = useState(false);
  const [step,      setStep]      = useState('');
  const [stepType,  setStepType]  = useState('idle');
  const [inputVal,  setInputVal]  = useState('');
  const timers   = useRef([]);
  const pauseRef = useRef(false);

  const speedVals   = { 1: 1000, 2: 400, 3: 100, 4: 10 };
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };
  const getDelay    = () => speedVals[speed] || 400;

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const applyArray = useCallback((arr) => {
    clearTimers();
    setArray(arr); setColors(new Array(arr.length).fill(BAR.DEFAULT));
    setIsSorting(false); setIsPaused(false); setIsSorted(false);
    pauseRef.current = false;
    setStep('Array ready. Press Start to begin sorting.'); setStepType('idle');
  }, []);

  const resetArray = useCallback((len = length) => {
    applyArray(generateRandomArray(len, 5, 100));
  }, [length, applyArray]);

  useEffect(() => { resetArray(); }, []); // eslint-disable-line

  const handleLengthChange = (e) => { const l = +e.target.value; setLength(l); resetArray(l); };

  const handleAddArray = () => {
    const parsed = inputVal.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
    if (parsed.length < 2) {
      setStep('⚠ Please enter at least 2 valid positive numbers.'); setStepType('error'); return;
    }
    applyArray(parsed.slice(0, MAX_BARS)); setInputVal('');
  };

  const stopSortInternal = () => {
    clearTimers(); setIsSorting(false); setIsPaused(false); pauseRef.current = false;
  }

  const handleStop = () => {
    stopSortInternal();
    setStep('Stopped.'); setStepType('idle');
  };

  const handlePause = () => {
    if (!isSorting) return;
    const next = !isPaused; setIsPaused(next); pauseRef.current = next;
    setStep(next ? 'Paused...' : 'Resuming...'); setStepType('idle');
  };

  const handleSort = () => {
    if (isSorting || isSorted) return;
    setIsSorting(true); setIsPaused(false); pauseRef.current = false;
    const numBuckets = Math.min(10, array.length);
    setStep(`Starting Bucket Sort — distributing into ${numBuckets} buckets…`); setStepType('');

    const animations = getBucketSortAnimations(array.slice());
    const delay = getDelay();
    const arr = array.slice();
    let t = 0;

    const schedule = (fn, d) => {
      const tid = setTimeout(function tick() {
        if (pauseRef.current) { const r = setTimeout(tick, 150); timers.current.push(r); return; }
        fn();
      }, d);
      timers.current.push(tid);
    };

    animations.forEach((anim) => {
      const d = t * delay;
      const { type, indices } = anim;

      if (type === 'bucket') {
        schedule(() => {
          setColors(prev => { const n=[...prev]; n[indices[0]] = BUCKET_COLORS[anim.bucketId % BUCKET_COLORS.length]; return n; });
          setStep(`Element ${arr[indices[0]]} → Bucket ${anim.bucketId}`); setStepType('');
        }, d);
      } else if (type === 'compare') {
        schedule(() => {
          setColors(prev => { const n=[...prev]; n[indices[0]]=BAR.COMPARE; n[indices[1]]=BAR.COMPARE; return n; });
          setStep(`Comparing ${arr[indices[0]]} and ${arr[indices[1]]}`); setStepType('');
        }, d);
      } else if (type === 'revert') {
        schedule(() => {
          setColors(prev => { const n=[...prev]; if(n[indices[0]]!==BAR.SORTED) n[indices[0]]=BAR.DEFAULT; if(n[indices[1]]!==BAR.SORTED) n[indices[1]]=BAR.DEFAULT; return n; });
        }, d);
      } else if (type === 'overwrite') {
        schedule(() => {
          arr[indices[0]] = anim.value; setArray([...arr]);
          setColors(prev => { const n=[...prev]; n[indices[0]] = BUCKET_COLORS[anim.bucketId % BUCKET_COLORS.length]; return n; });
          setStep(`Writing ${anim.value} from Bucket ${anim.bucketId}`); setStepType('');
        }, d);
      } else if (type === 'sorted') {
        schedule(() => {
          setColors(prev => { const n=[...prev]; n[indices[0]]=BAR.SORTED; return n; });
        }, d);
      }
      t++;
    });

    schedule(() => {
      setColors(new Array(arr.length).fill(BAR.SORTED));
      setIsSorting(false); setIsSorted(true);
      setStep('✅ Array fully sorted!'); setStepType('success');
    }, t * delay + 200);
  };

  const handleRestart = () => {
    stopSortInternal();
    setIsSorted(false);
    setTimeout(() => handleSort(), 50);
  };

  const maxVal = Math.max(...array, 1);
  const showNums = length <= 40;
  const numBuckets = Math.min(10, length);

  return (
    <div className="visualizer">
      <h2>Bucket Sort Visualizer</h2>

      <div className="controls input-controls">
        <input
          type="text"
          placeholder="e.g. 50, 30, 80, 20"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={isSorting}
          onKeyDown={(e) => e.key === 'Enter' && handleAddArray()}
        />
        <button onClick={handleAddArray} disabled={isSorting} className="btn btn-secondary">Load Array</button>
        <button onClick={() => resetArray()} disabled={isSorting} className="btn btn-secondary">Randomize</button>
      </div>

      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        {[1, 2, 3, 4].map((s) => (
          <button key={s} className={`btn btn-speed ${speed === s ? "active" : ""}`} onClick={() => setSpeed(s)}>
            {speedLabels[s]}
          </button>
        ))}
      </div>

      <div className="controls input-controls" style={{ marginTop: '10px' }}>
        <span style={{ marginRight: '10px' }}>Array Length: {length}</span>
        <input type="range" min={MIN_BARS} max={MAX_BARS} value={length} disabled={isSorting} onChange={handleLengthChange} />
      </div>

      <div className="viz-canvas">
        <div className="bars-wrap">
          {array.map((val, idx) => (
            <div key={idx} className="bar"
              style={{ height: `${(val / maxVal) * 100}%`, background: colors[idx] || BAR.DEFAULT }}>
              {showNums && <span className="bar-num">{val}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="legend-row">
        {LEGEND.map(({ color, label }) => (
          <div key={label} className="legend-item">
            <div className="legend-dot" style={{ background: color }} />
            <span>{label}</span>
          </div>
        ))}
        <span style={{ fontSize: 12, color: '#777', margin: '0 4px' }}>|</span>
        {Array.from({ length: numBuckets }, (_, i) => (
          <div key={i} className="legend-item">
            <div className="legend-dot" style={{ background: BUCKET_COLORS[i] }} />
            <span>B{i}</span>
          </div>
        ))}
      </div>

      <div className="controls playback-controls">
        <button onClick={handleSort} disabled={isSorting || isSorted} className="btn btn-primary">Start</button>
        <button onClick={handlePause} disabled={!isSorting} className="btn btn-secondary">{isPaused ? "Resume" : "Pause"}</button>
        <button onClick={handleStop} disabled={!isSorting && !isPaused} className="btn btn-danger">Stop</button>
        <button onClick={handleRestart} disabled={!isSorting && !isPaused && !isSorted} className="btn btn-secondary">Restart</button>
      </div>

      <div className={`step-panel ${stepType}`}>
        {step || 'Press Start to begin the visualization.'}
      </div>
    </div>
  );
}
