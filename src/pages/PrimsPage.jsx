import PrimsVisualizer from "../components/PrimsVisualizer";

function PrimsPage() {
    return (
        <div className="algo-page">
            <h1>Prim's Algorithm</h1>
            <p>
                Prim's Algorithm finds the Minimum Spanning Tree (MST) for a weighted 
                undirected graph. It starts from a node and repeatedly adds the smallest 
                edge that connects a vertex in the MST to a vertex outside it.
            </p>
            <h3>Time Complexity</h3>
            <ul>
                <li>Time Complexity: O(E log V)</li>
                <li>Space Complexity: O(V)</li>
            </ul>
            <PrimsVisualizer />
        </div>
    );
}

export default PrimsPage;