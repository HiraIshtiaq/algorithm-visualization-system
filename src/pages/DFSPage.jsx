import DFSVisualizer from "../components/DFSVisualizer";

function DFSPage(){

  return(

    <div className="algo-page">

      <h1>Depth First Search (DFS)</h1>

      <p>
      Depth First Search is a graph traversal algorithm that explores as far as 
      possible along each branch before backtracking. It is commonly used for 
      searching graphs, solving puzzles, and detecting cycles.
      </p>

      <h3>Time Complexity</h3>

      <ul>
        <li>Best Case: O(V + E)</li>
        <li>Average Case: O(V + E)</li>
        <li>Worst Case: O(V + E)</li>
      </ul>

      <DFSVisualizer/>

    </div>

  )

}

export default DFSPage;