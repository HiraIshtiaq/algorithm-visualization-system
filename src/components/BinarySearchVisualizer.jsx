

// import { useState } from "react";
// import { binarySearch } from "../algorithms/binarySearch";

// function BinarySearchVisualizer() {

//   const [array, setArray] = useState([10,20,30,40,50,60,70,80,90]);
//   const [target, setTarget] = useState(50);

//   const [left, setLeft] = useState(null);
//   const [right, setRight] = useState(null);
//   const [mid, setMid] = useState(null);

//   const [message, setMessage] = useState("");

//   function delay(){
//     return new Promise(res => setTimeout(res, 900));
//   }

//   async function startSearch(){

//     await binarySearch(
//       array,
//       target,
//       setLeft,
//       setRight,
//       setMid,
//       setMessage,
//       delay
//     );

//   }

//   function generateArray(){

//     let arr = [];

//     for(let i = 0; i < 10; i++){
//       arr.push(Math.floor(Math.random() * 90) + 10);
//     }

//     arr.sort((a,b)=>a-b);

//     setArray(arr);

//     let randomTarget = arr[Math.floor(Math.random()*arr.length)];

//     setTarget(randomTarget);

//     setLeft(null);
//     setRight(null);
//     setMid(null);
//     setMessage("");

//   }

//   return (

//     <div className="visualizer">

//       <h2>Binary Search Visualization</h2>

//       <h3>Target Value : {target}</h3>

//       <div className="binary-container">

//         {array.map((value,index)=>{

//           let className = "binary-box";

//           if(index === mid) className += " binary-mid";
//           else if(index === left) className += " binary-left";
//           else if(index === right) className += " binary-right";

//           return(

//             <div
//               key={index}
//               className={className}
//             >
//               {value}
//             </div>

//           )

//         })}

//       </div>

//       <p className="binary-message">{message}</p>

//       <div className="controls">

//         <button onClick={startSearch}>
//           Start Search
//         </button>

//         <button onClick={generateArray}>
//           Generate Array
//         </button>

//       </div>

//     </div>

//   );

// }

// export default BinarySearchVisualizer;

// import { useState } from "react";
// import { binarySearch } from "../algorithms/binarySearch";

// function BinarySearchVisualizer() {

//   const [arrayInput,setArrayInput] = useState("");
//   const [targetInput,setTargetInput] = useState("");

//   const [array,setArray] = useState([]);
//   const [target,setTarget] = useState(null);

//   const [left,setLeft] = useState(null);
//   const [right,setRight] = useState(null);
//   const [mid,setMid] = useState(null);

//   const [message,setMessage] = useState("");

//   function delay(){
//     return new Promise(res => setTimeout(res,900));
//   }

//   function loadArray(){

//     let arr = arrayInput
//       .split(",")
//       .map(num => parseInt(num.trim()))
//       .filter(num => !isNaN(num));

//     arr.sort((a,b)=>a-b);

//     setArray(arr);
//     setTarget(parseInt(targetInput));

//     setLeft(null);
//     setRight(null);
//     setMid(null);
//     setMessage("");
//   }

//   async function startSearch(){

//     if(array.length === 0){
//       setMessage("Please enter array first");
//       return;
//     }

//     await binarySearch(
//       array,
//       target,
//       setLeft,
//       setRight,
//       setMid,
//       setMessage,
//       delay
//     );

//   }

//   return (

//     <div className="visualizer">

//       <h2>Binary Search Visualization</h2>

//       <div className="controls">

//         <input
//           type="text"
//           placeholder="Enter array e.g. 10,20,30,40"
//           value={arrayInput}
//           onChange={(e)=>setArrayInput(e.target.value)}
//         />

//         <input
//           type="number"
//           placeholder="Target"
//           value={targetInput}
//           onChange={(e)=>setTargetInput(e.target.value)}
//         />

//         <button onClick={loadArray}>
//           Load Array
//         </button>

//         <button onClick={startSearch}>
//           Start Search
//         </button>

//       </div>

//       <h3>Target Value : {target}</h3>

//       <div className="binary-container">

//         {array.map((value,index)=>{

//           let className="binary-box";

//           if(index===mid) className+=" binary-mid";
//           else if(index===left) className+=" binary-left";
//           else if(index===right) className+=" binary-right";

//           return(

//             <div
//               key={index}
//               className={className}
//             >
//               {value}
//             </div>

//           )

//         })}

//       </div>

//       <p className="binary-message">{message}</p>

//     </div>

//   );

// }

// export default BinarySearchVisualizer;

import { useState } from "react";
import { binarySearch } from "../algorithms/binarySearch";

function BinarySearchVisualizer() {

  const [array,setArray] = useState([]);
  const [arrayInput,setArrayInput] = useState("");
  const [target,setTarget] = useState("");

  const [left,setLeft] = useState(null);
  const [right,setRight] = useState(null);
  const [mid,setMid] = useState(null);

  const [message,setMessage] = useState("");

  function delay(){
    return new Promise(res => setTimeout(res,900));
  }

  // generate random sorted array
  function generateRandomArray(){

    let arr = [];

    for(let i=0;i<10;i++){
      arr.push(Math.floor(Math.random()*90)+10);
    }

    arr.sort((a,b)=>a-b);

    setArray(arr);

    setLeft(null);
    setRight(null);
    setMid(null);
    setMessage("");

  }

  // load user array
  function loadUserArray(){

    let arr = arrayInput
      .split(",")
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));

    arr.sort((a,b)=>a-b);

    setArray(arr);

    setLeft(null);
    setRight(null);
    setMid(null);
    setMessage("");

  }

  async function startSearch(){

    if(array.length === 0){
      setMessage("Please generate or add array first");
      return;
    }

    if(target === ""){
      setMessage("Please enter target value");
      return;
    }

    await binarySearch(
      array,
      parseInt(target),
      setLeft,
      setRight,
      setMid,
      setMessage,
      delay
    );

  }

  return (

    <div className="visualizer">

      <h2>Binary Search Visualization</h2>

      <div className="controls">

        {/* user array input */}
        <input
          type="text"
          placeholder="Enter array (e.g. 10,20,30)"
          value={arrayInput}
          onChange={(e)=>setArrayInput(e.target.value)}
        />

        <button onClick={loadUserArray}>
          Add Your Array
        </button>

        {/* random array */}
        <button onClick={generateRandomArray}>
          Generate Random Array
        </button>

      </div>

      <div className="controls">

        {/* target input */}
        <input
          type="number"
          placeholder="Enter Target"
          value={target}
          onChange={(e)=>setTarget(e.target.value)}
        />

        <button onClick={startSearch}>
          Start Search
        </button>

      </div>

      <div className="binary-container">

        {array.map((value,index)=>{

          let className="binary-box";

          if(index===mid) className+=" binary-mid";
          else if(index===left) className+=" binary-left";
          else if(index===right) className+=" binary-right";

          return(

            <div
              key={index}
              className={className}
            >
              {value}
            </div>

          )

        })}

      </div>

      <p className="binary-message">{message}</p>

    </div>

  );

}

export default BinarySearchVisualizer;