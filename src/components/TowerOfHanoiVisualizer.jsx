// import { useState } from "react";
// import { towerOfHanoi } from "../algorithms/towerOfHanoi";

// function TowerOfHanoiVisualizer() {
//   const [moves, setMoves] = useState([]);

//   function delay() {
//     return new Promise(res => setTimeout(res, 500));
//   }

//   async function startHanoi() {
//     setMoves([]);
//     await towerOfHanoi(3, "A", "C", "B", setMoves, delay);
//   }

//   return (
//     <div className="visualizer">
//       <h2>Tower of Hanoi Visualization</h2>
//       <div className="array-container" style={{ flexDirection: "column" }}>
//         {moves.map((move, i) => (
//           <div key={i} className="bar" style={{ height: "30px", marginBottom: "5px" }}>
//             {move}
//           </div>
//         ))}
//       </div>
//       <div className="controls">
//         <button onClick={startHanoi}>Start Tower of Hanoi</button>
//       </div>
//     </div>
//   );
// }

// export default TowerOfHanoiVisualizer;

import { useState } from "react";
import { towerOfHanoi } from "../algorithms/towerOfHanoi";

function TowerOfHanoiVisualizer() {

  const numDisks = 4;

  const [rods, setRods] = useState([
    [4,3,2,1],
    [],
    []
  ]);

  const [message, setMessage] = useState("");

  function delay(ms = 800){
    return new Promise(res => setTimeout(res, ms));
  }

  async function startHanoi(){

    let moves = [];

    towerOfHanoi(numDisks,0,2,1,moves);

    for(let move of moves){

      setMessage(`Move disk from Rod ${move.from+1} → Rod ${move.to+1}`);

      setRods(prev => {

        const newRods = prev.map(r => [...r]);

        const disk = newRods[move.from].pop();

        newRods[move.to].push(disk);

        return newRods;

      });

      await delay();

    }

    setMessage("Tower of Hanoi Completed!");

  }

  return (

    <div className="visualizer">

      <h2>Tower of Hanoi Visualization</h2>

      <div className="rods-container">

        {rods.map((rod,index)=>(
          <div key={index} className="rod">

            <div className="disks">

              {rod.map((disk,i)=>(
                <div
                  key={i}
                  className="disk"
                  style={{ width:`${disk*40}px` }}
                >
                  {disk}
                </div>
              ))}

            </div>

            <div className="rod-base"></div>

          </div>
        ))}

      </div>

      <p className="message">{message}</p>

      <button onClick={startHanoi}>Start Tower of Hanoi</button>

    </div>

  );
}

export default TowerOfHanoiVisualizer;