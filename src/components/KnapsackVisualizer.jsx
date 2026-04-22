
import { useState, useRef } from "react";
import { knapsack } from "../algorithms/knapsack";

function KnapsackVisualizer() {

  const [items, setItems] = useState([
    { name: "Item1", weight: 3, value: 25 },
    { name: "Item2", weight: 2, value: 20 },
    { name: "Item3", weight: 4, value: 40 }
  ]);

  const [capacity, setCapacity] = useState(7);
  const [activeItem, setActiveItem] = useState(null);
  const [bag, setBag] = useState([]);
  const [message, setMessage] = useState("");

  const controlRef = useRef({ pause: false, stop: false });

  function delay(ms = 800) {
    return new Promise(res => setTimeout(res, ms));
  }

  async function startKnapsack() {
    controlRef.current.stop = false;
    controlRef.current.pause = false;
    setBag([]);

    await knapsack(
      items,
      capacity,
      setActiveItem,
      setBag,
      setMessage,
      delay,
      controlRef
    );
  }

  function pauseKnapsack() {
    controlRef.current.pause = true;
  }

  function resumeKnapsack() {
    controlRef.current.pause = false;
  }

  function stopKnapsack() {
    controlRef.current.stop = true;
    setMessage("Stopped ");
    setActiveItem(null);
  }

  function handleItemsChange(e) {
    try {
      const parsed = JSON.parse(e.target.value);
      setItems(parsed);
    } catch {
      setMessage("Invalid JSON");
    }
  }

  return (
    <div className="visualizer">

      <h2>0/1 Knapsack Visualizer</h2>

      <textarea
        placeholder='[{"name":"Item1","weight":2,"value":20}]'
        onChange={handleItemsChange}
      />

      <input
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(Number(e.target.value))}
        placeholder="Capacity"
      />

      <div className="items-container">
        {items.map((item, index) => {
          let cls = "item-box";
          if(index === activeItem) cls += " active";

          return (
            <div key={index} className={cls}>
              {item.name}<br/>
              W:{item.weight} V:{item.value}
            </div>
          );
        })}
      </div>

      <h3>Bag</h3>
      <div className="bag">
        {bag.map((item, i) => (
          <div key={i} className="item-in-bag">
            {item.name}
          </div>
        ))}
      </div>

      <p>{message}</p>

      <div className="controls">
        <button onClick={startKnapsack}>Start</button>
        <button onClick={pauseKnapsack}>Pause</button>
        <button onClick={resumeKnapsack}>Resume</button>
        <button onClick={stopKnapsack}>Stop</button>
      </div>

    </div>
  );
}

export default KnapsackVisualizer;