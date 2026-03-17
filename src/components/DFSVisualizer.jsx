// import { useState } from "react";
// import { dfs } from "../algorithms/dfs";

// function DFSVisualizer() {
//   const graph = {
//     0: [1, 2],
//     1: [0, 3],
//     2: [0, 3],
//     3: [1, 2],
//   };
//   const [visited, setVisited] = useState([]);

//   function delay() {
//     return new Promise(res => setTimeout(res, 500));
//   }

//   async function startDFS() {
//     await dfs(graph, 0, setVisited, delay);
//   }

//   return (
//     <div className="visualizer">
//       <h2>DFS Visualization</h2>
//       <div className="array-container">
//         {Object.keys(graph).map(node => (
//           <div
//             key={node}
//             className={`bar ${visited.includes(parseInt(node)) ? "active" : ""}`}
//             style={{ height: "50px" }}
//           >
//             {node}
//           </div>
//         ))}
//       </div>
//       <div className="controls">
//         <button onClick={startDFS}>Start DFS</button>
//       </div>
//     </div>
//   );
// }

// export default DFSVisualizer;

import { useState } from "react";
import { dfs } from "../algorithms/dfs";

function DFSVisualizer() {

  const graph = {
    A: ["B","C"],
    B: ["D","E"],
    C: ["F"],
    D: [],
    E: [],
    F: []
  };

  const [visited,setVisited] = useState([]);
  const [message,setMessage] = useState("");

  function delay(){
    return new Promise(res => setTimeout(res,900));
  }

  async function startDFS(){

    setVisited([]);

    await dfs(
      graph,
      "A",
      setVisited,
      setMessage,
      delay
    );

  }

  function nodeClass(node){

    if(visited.includes(node))
      return "node visited";

    return "node";

  }

  return(

    <div className="visualizer">

      <h2>DFS Graph Visualization</h2>

      <div className="graph-container">

        {/* Row 1 */}
        <div className="graph-row">
          <div className={nodeClass("A")}>A</div>
        </div>

        {/* Row 2 */}
        <div className="graph-row">
          <div className={nodeClass("B")}>B</div>
          <div className={nodeClass("C")}>C</div>
        </div>

        {/* Row 3 */}
        <div className="graph-row">
          <div className={nodeClass("D")}>D</div>
          <div className={nodeClass("E")}>E</div>
          <div className={nodeClass("F")}>F</div>
        </div>

      </div>

      <p>{message}</p>

      <button onClick={startDFS}>
        Start DFS
      </button>

    </div>

  );

}

export default DFSVisualizer;