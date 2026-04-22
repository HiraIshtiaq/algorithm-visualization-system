
import { useState, useRef } from "react";
import { towerOfHanoi } from "../algorithms/towerOfHanoi";

function TowerOfHanoiVisualizer() {

  const numDisks = 4;

  const initialRods = [
    [4,3,2,1],
    [],
    []
  ];

  const [rods, setRods] = useState(initialRods);
  const [message, setMessage] = useState("");

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const pauseRef = useRef(false);
  const stopRef = useRef(false);

  function delay(ms = 800){
    return new Promise(res => setTimeout(res, ms));
  }

  async function startHanoi(){

    setIsRunning(true);
    stopRef.current = false;

    let moves = [];
    towerOfHanoi(numDisks,0,2,1,moves);

    for(let move of moves){

      if(stopRef.current) break;

      while(pauseRef.current){
        await delay(200);
      }

      setMessage(`Move disk from Rod ${move.from+1} → Rod ${move.to+1}`);

      setRods(prev => {
        const newRods = prev.map(r => [...r]);
        const disk = newRods[move.from].pop();
        newRods[move.to].push(disk);
        return newRods;
      });

      await delay();
    }

    if(!stopRef.current){
      setMessage("Tower of Hanoi Completed!");
    }

    setIsRunning(false);
  }

  function pauseHanoi(){
    setIsPaused(true);
    pauseRef.current = true;
  }

  function resumeHanoi(){
    setIsPaused(false);
    pauseRef.current = false;
  }

  function stopHanoi(){
    stopRef.current = true;
    setIsRunning(false);
    setMessage("Stopped!");
  }

  function restartHanoi(){
    stopRef.current = true;
    setRods(initialRods);
    setMessage("");
    setIsRunning(false);
    setIsPaused(false);
    pauseRef.current = false;
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

      <div className="controls">
        <button onClick={startHanoi} disabled={isRunning}>Start</button>

        <button onClick={pauseHanoi} disabled={!isRunning || isPaused}>
          Pause
        </button>

        <button onClick={resumeHanoi} disabled={!isPaused}>
          Resume
        </button>

        <button onClick={stopHanoi} disabled={!isRunning}>
          Stop
        </button>

        <button onClick={restartHanoi}>
          Restart
        </button>
      </div>

    </div>
  );
}

export default TowerOfHanoiVisualizer;

