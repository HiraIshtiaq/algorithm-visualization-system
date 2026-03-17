import BinarySearchVisualizer from "../components/BinarySearchVisualizer";

function BinarySearchPage(){

  return(

    <div className="algo-page">

      <h1>Binary Search</h1>

      <p>
      Binary Search is an efficient algorithm used to find a target value in a 
      sorted array. It repeatedly divides the search interval in half. If the 
      target is smaller than the middle element, the search continues in the 
      left half; otherwise it continues in the right half.
      </p>

      <h3>Time Complexity</h3>

      <ul>
        <li>Best Case: O(1)</li>
        <li>Average Case: O(log n)</li>
        <li>Worst Case: O(log n)</li>
      </ul>

      <BinarySearchVisualizer/>

    </div>

  )

}

export default BinarySearchPage;