import KnapsackVisualizer from "../components/KnapsackVisualizer";

function KnapsackPage(){

  return(

    <div className="algo-page">

      <h1>0/1 Knapsack Problem</h1>

      <p>
      The 0/1 Knapsack Problem is an optimization problem where we must choose 
      items with given weights and values to maximize total value without 
      exceeding the capacity of the bag. Each item can either be taken or not taken.
      </p>

      <h3>Time Complexity</h3>

      <ul>
        <li>Best Case: O(nW)</li>
        <li>Average Case: O(nW)</li>
        <li>Worst Case: O(nW)</li>
      </ul>

      <KnapsackVisualizer/>

    </div>

  )

}

export default KnapsackPage;