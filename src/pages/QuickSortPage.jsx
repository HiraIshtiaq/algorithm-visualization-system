import QuickSortVisualizer from "../components/QuickSortVisualizer";

function QuickSortPage() {
    return (
        <div className="algo-page">
            <h1>Quick Sort</h1>
            <p>
                Quick Sort is a divide-and-conquer algorithm. It picks a pivot element 
                and partitions the array around it, putting smaller elements before it 
                and larger elements after it. This process is repeated recursively.
            </p>
            <h3>Time Complexity</h3>
            <ul>
                <li>Best Case: O(n log n)</li>
                <li>Average Case: O(n log n)</li>
                <li>Worst Case: O(n²)</li>
            </ul>
            <QuickSortVisualizer />
        </div>
    );
}

export default QuickSortPage;