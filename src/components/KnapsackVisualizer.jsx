// import { useState } from "react";
// import { knapsack } from "../algorithms/knapsack";

// function KnapsackVisualizer() {
//   const values = [60, 100, 120];
//   const weights = [10, 20, 30];
//   const capacity = 50;
//   const [result, setResult] = useState([]);

//   function delay() {
//     return new Promise(res => setTimeout(res, 500));
//   }

//   async function startKnapsack() {
//     await knapsack(values, weights, capacity, setResult, delay);
//   }

//   return (
//     <div className="visualizer">
//       <h2>0/1 Knapsack Visualization</h2>
//       <div className="array-container">
//         {result.map((val, i) => (
//           <div key={i} className="bar" style={{ height: `${val}px` }}></div>
//         ))}
//       </div>
//       <div className="controls">
//         <button onClick={startKnapsack}>Start Knapsack</button>
//       </div>
//     </div>
//   );
// }

// export default KnapsackVisualizer;


import { useState } from "react";
import { knapsack } from "../algorithms/knapsack";

function KnapsackVisualizer() {

  const initialItems = [
    { name: "Item 1", weight: 3, value: 25 },
    { name: "Item 2", weight: 2, value: 20 },
    { name: "Item 3", weight: 4, value: 40 },
    { name: "Item 4", weight: 5, value: 50 },
  ];

  const capacity = 7;

  const [items, setItems] = useState(initialItems);
  const [activeItem, setActiveItem] = useState(null);
  const [bag, setBag] = useState([]);
  const [message, setMessage] = useState("");

  function delay() {
    return new Promise(res => setTimeout(res, 1000));
  }

  async function startKnapsack() {
    await knapsack(items, capacity, setActiveItem, setBag, setMessage, delay);
  }

  return (
    <div className="visualizer">

      <h2>0/1 Knapsack Visualization</h2>
      <h3>Bag Capacity: {capacity}</h3>

      {/* Items to consider */}
      <div className="items-container">
        {items.map((item, index) => {
          let className = "item-box";
          if (index === activeItem) className += " active";
          return (
            <div key={index} className={className}>
              {item.name}<br />
              W:{item.weight}, V:{item.value}
            </div>
          );
        })}
      </div>

      {/* Bag visualization */}
      <h3>Bag:</h3>
      <div className="bag">
        {bag.map((item, index) => (
          <div key={index} className="item-in-bag">
            {item.name} (V:{item.value})
          </div>
        ))}
      </div>

      <p>{message}</p>

      <button onClick={startKnapsack}>Start Knapsack</button>

    </div>
  );
}

export default KnapsackVisualizer;