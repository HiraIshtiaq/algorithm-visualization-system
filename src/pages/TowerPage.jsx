import TowerOfHanoiVisualizer from "../components/TowerOfHanoiVisualizer";

function TowerPage(){

  return(

    <div className="algo-page">

      <h1>Tower of Hanoi</h1>

      <p>
      The Tower of Hanoi is a classic recursive problem where a set of disks 
      must be moved from one rod to another following specific rules. Only one 
      disk can be moved at a time and a larger disk cannot be placed on a 
      smaller disk.
      </p>

      <h3>Time Complexity</h3>

      <ul>
        <li>Best Case: O(2ⁿ)</li>
        <li>Average Case: O(2ⁿ)</li>
        <li>Worst Case: O(2ⁿ)</li>
      </ul>

      <TowerOfHanoiVisualizer/>

    </div>

  )

}

export default TowerPage;