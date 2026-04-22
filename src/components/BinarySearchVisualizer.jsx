
import { useState, useRef } from "react";
import { binarySearch } from "../algorithms/binarySearch";

function BinarySearchVisualizer() {
  const [array, setArray] = useState([]);
  const [arrayInput, setArrayInput] = useState("");
  const [target, setTarget] = useState("");

  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [mid, setMid] = useState(null);

  const [message, setMessage] = useState("");

  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  const pauseRef = useRef(isPaused);
  const stopRef = useRef(isStopped);

  function delay(ms = 900) {
    return new Promise(res => {
      const start = Date.now();
      const check = () => {
        if (stopRef.current) return res("stopped");
        if (pauseRef.current) setTimeout(check, 50);
        else if (Date.now() - start >= ms) res();
        else setTimeout(check, 50);
      };
      check();
    });
  }

  function generateRandomArray() {
    let arr = [];
    for (let i = 0; i < 10; i++) arr.push(Math.floor(Math.random() * 90) + 10);
    arr.sort((a, b) => a - b);
    setArray(arr);
    setLeft(null);
    setRight(null);
    setMid(null);
    setMessage("");
  }

  function loadUserArray() {
    let arr = arrayInput
      .split(",")
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));
    arr.sort((a, b) => a - b);
    setArray(arr);
    setLeft(null);
    setRight(null);
    setMid(null);
    setMessage("");
  }

  async function startSearch() {
    if (array.length === 0) {
      setMessage("Please generate or add array first");
      return;
    }
    if (target === "") {
      setMessage("Please enter target value");
      return;
    }

    setIsPaused(false);
    setIsStopped(false);
    pauseRef.current = false;
    stopRef.current = false;

    const result = await binarySearch(
      array,
      parseInt(target),
      setLeft,
      setRight,
      setMid,
      setMessage,
      delay,
      pauseRef,
      stopRef
    );

    if (result === "stopped") setMessage("Search stopped");
  }

  const handlePauseResume = () => {
    setIsPaused(prev => {
      pauseRef.current = !prev;
      return !prev;
    });
  };

  const handleStop = () => {
    setIsStopped(true);
    stopRef.current = true;
  };

  return (
    <div className="visualizer">
      <h2>Binary Search Visualization</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Enter array (e.g. 10,20,30)"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
        />
        <button onClick={loadUserArray}>Add Your Array</button>
        <button onClick={generateRandomArray}>Generate Random Array</button>
      </div>

      <div className="controls">
        <input
          type="number"
          placeholder="Enter Target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <button onClick={startSearch}>Start Search</button>
        <button onClick={handlePauseResume}>{isPaused ? "Resume" : "Pause"}</button>
        <button onClick={handleStop}>Stop</button>
      </div>

      <div className="binary-container">
        {array.map((value, index) => {
          let className = "binary-box";
          if (index === mid) className += " binary-mid";
          else if (index === left) className += " binary-left";
          else if (index === right) className += " binary-right";

          return (
            <div key={index} className={className}>
              {value}
            </div>
          );
        })}
      </div>

      <p className="binary-message">{message}</p>
    </div>
  );
}

export default BinarySearchVisualizer;