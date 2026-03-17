import BubbleSortVisualizer from "../components/BubbleSortVisualizer";

function BubbleSortPage(){

  return(

    <div className="algo-page">

      <h1>Bubble Sort</h1>

      <p>
      Bubble Sort repeatedly compares adjacent elements and swaps them if they are in the wrong order.
      It continues until the array becomes sorted.
      </p>

      <h3>Time Complexity</h3>

      <ul>
        <li>Best Case: O(n)</li>
        <li>Average Case: O(n²)</li>
        <li>Worst Case: O(n²)</li>
      </ul>

      <BubbleSortVisualizer/>

    </div>

  )

}

export default BubbleSortPage;