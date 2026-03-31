import LinearSearchVisualizer from "../components/LinearSearchVisualizer";

function LinearSearchPage() {
    return (
        <div className="algo-page">
            <h1>Linear Search</h1>
            <p>
                Linear Search sequentially checks each element of the array until 
                the target is found or the end is reached.
            </p>
            <h3>Time Complexity</h3>
            <ul>
                <li>Best Case: O(1)</li>
                <li>Average Case: O(n)</li>
                <li>Worst Case: O(n)</li>
            </ul>
            <LinearSearchVisualizer />
        </div>
    );
}

export default LinearSearchPage;