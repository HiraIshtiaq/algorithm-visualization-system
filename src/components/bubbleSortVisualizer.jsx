import { useState } from "react";
import { bubbleSort } from "../algorithms/bubbleSort";

function BubbleSortVisualizer() {

  const [array, setArray] = useState([50, 30, 80, 20, 60, 10]);
  const [active, setActive] = useState([]);

  function delay() {
    return new Promise(res => setTimeout(res, 400));
  }

  function startSort() {
    bubbleSort(array, setArray, setActive, delay);
  }

  function randomArray() {

    let arr = [];

    for (let i = 0; i < 10; i++) {
      arr.push(Math.floor(Math.random() * 200) + 20);
    }

    setArray(arr);
  }

  return (

    <div className="visualizer">

      <h2>Bubble Sort Visualization</h2>

      <div className="array-container">

        {array.map((value, index) => (

          <div
            key={index}
            className={`bar ${active.includes(index) ? "active" : ""}`}
            style={{ height: `${value}px` }}
          >

          </div>

        ))}

      </div>

      <div className="controls">

        <button onClick={startSort}>Start Sort</button>
        <button onClick={randomArray}>Generate Array</button>

      </div>

    </div>

  );
}

export default BubbleSortVisualizer;
