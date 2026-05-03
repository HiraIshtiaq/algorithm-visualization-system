import { BrowserRouter as Router } from "react-router-dom";

import BubbleSortPage from "./pages/BubbleSortPage";
import BinarySearchPage from "./pages/BinarySearchPage";
import DFSPage from "./pages/DFSPage";
import KnapsackPage from "./pages/KnapsackPage";
import TowerOfHanoiPage from "./pages/TowerPage";
import React, { useState } from "react";
import "./App.css";
import NQueensPage from "./pages/NQueensPage";
import BFSPage from "./pages/BFSPage";
import KruskalPage from "./pages/KruskalPage";
import HeapSortPage from "./pages/HeapSortPage";
import InsertionSortPage from "./pages/InsertionSortPage";
import QuickSortPage from "./pages/QuickSortPage";
import PrimsPage from "./pages/PrimsPage";
import LinearSearchPage from "./pages/LinearSearchPage"
import CoinChangePage from "./pages/CoinChangePage"
import SudokuPage from "./pages/SudokuPage";
import MergeSortPage     from './pages/mergeSortPage';
import SelectionSortPage from './pages/selectionSortPage';
import BucketSortPage    from './pages/bucketSortPage';
import DijkstrasPage     from './pages/dijkstrasAlgorithmPage';
import TreeTraversalPage from './pages/treeTraversalPage';

function App() {
  const [page, setPage] = useState("home");

  const algorithms = [
    "Quick Sort","Linear Search","Prim's Algorithm","Coin Change Problem","Sudoku Solver",
    "Bubble Sort","Binary Search","Depth-First Search","0/1 Knapsack Problem","Tower of Hanoi",
    "Merge Sort","Selection Sort","Dijkstra's Algorithm","Bucket Sort","Tree Traversal",
    "Insertion Sort","Heap Sort","Breadth-First Search","Kruskal's Algorithm","N-Queens Problem",
  ];

  const algorithmPages = {
    "Bubble Sort": <BubbleSortPage />,
    "Binary Search": <BinarySearchPage />,
    "Depth-First Search": <DFSPage />,
    "0/1 Knapsack Problem": <KnapsackPage />,
    "Tower of Hanoi": <TowerOfHanoiPage />,
    "N-Queens Problem":<NQueensPage />,
    "Kruskal's Algorithm":<KruskalPage />,
    "Insertion Sort":<InsertionSortPage />,
    "Breadth-First Search": <BFSPage/>,
    "Heap Sort":<HeapSortPage />,
    "Quick Sort":<QuickSortPage/>,
    "Prim's Algorithm":<PrimsPage/>,
    "Linear Search":<LinearSearchPage/>,
    "Coin Change Problem":<CoinChangePage/>,
    "Sudoku Solver":<SudokuPage/>,
    "Merge Sort": <MergeSortPage />,
  "Selection Sort": <SelectionSortPage />,
  "Dijkstra's Algorithm": <DijkstrasPage />,
  "Bucket Sort": <BucketSortPage />,
  "Tree Traversal": <TreeTraversalPage />,

  };
      // ── Category data for Compare page ──
    const categories = {
        "Sorting": {
            algorithms: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Heap Sort", "Merge Sort"],
            showStable: true,
            data: {
                "Bubble Sort":    { best: "O(n)",       avg: "O(n²)",      worst: "O(n²)",      space: "O(1)",    stable: "Yes" },
                "Insertion Sort": { best: "O(n)",       avg: "O(n²)",      worst: "O(n²)",      space: "O(1)",    stable: "Yes" },
                "Quick Sort":     { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)",      space: "O(log n)",stable: "No"  },
                "Heap Sort":      { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)",    stable: "No"  },
                "Merge Sort":     { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)",    stable: "Yes" },
            }
        },
        "Searching": {
            algorithms: ["Linear Search", "Binary Search"],
            showStable: false,
            data: {
                "Linear Search": { best: "O(1)",     avg: "O(n)",     worst: "O(n)",     space: "O(1)" },
                "Binary Search": { best: "O(1)",     avg: "O(log n)", worst: "O(log n)", space: "O(1)" },
            }
        },
        "Graph": {
            algorithms: ["Breadth-First Search", "Depth-First Search", "Dijkstra's Algorithm", "Kruskal's Algorithm", "Prim's Algorithm"],
            showStable: false,
            data: {
                "Breadth-First Search": { best: "O(V+E)",   avg: "O(V+E)",   worst: "O(V+E)",   space: "O(V)"   },
                "Depth-First Search":   { best: "O(V+E)",   avg: "O(V+E)",   worst: "O(V+E)",   space: "O(V)"   },
                "Dijkstra's Algorithm": { best: "O(E log V)",avg: "O(E log V)",worst: "O(E log V)",space: "O(V)" },
                "Kruskal's Algorithm":  { best: "O(E log E)",avg: "O(E log E)",worst: "O(E log E)",space: "O(V+E)"},
                "Prim's Algorithm":     { best: "O(E log V)",avg: "O(E log V)",worst: "O(E log V)",space: "O(V)" },
            }
        },
        "Dynamic Programming": {
            algorithms: ["Coin Change Problem", "0/1 Knapsack Problem"],
            showStable: false,
            data: {
                "Coin Change Problem":   { best: "O(n·m)", avg: "O(n·m)", worst: "O(n·m)", space: "O(n)"   },
                "0/1 Knapsack Problem":  { best: "O(n·W)", avg: "O(n·W)", worst: "O(n·W)", space: "O(n·W)" },
            }
        },
        "Backtracking": {
            algorithms: ["N-Queens Problem", "Sudoku Solver"],
            showStable: false,
            data: {
                "N-Queens Problem": { best: "O(n!)",  avg: "O(n!)",  worst: "O(n!)",  space: "O(n)" },
                "Sudoku Solver":    { best: "O(9^m)", avg: "O(9^m)", worst: "O(9^m)", space: "O(m)" },
            }
        },
    };


    const [compareCategory, setCompareCategory] = useState("Sorting");


    return (
        <Router>
            <div>
                {/* NAVBAR */}
                <nav className="navbar">
                    <div className="logo">Algorithm Visualizer</div>
                    <ul className="nav-links">
                        <li onClick={() => setPage("home")}>Home</li>
                        <li className="dropdown">
                            Algorithms ▾
                            <div className="dropdown-menu">
                                {algorithms.map((algo, index) => (
                                    <div
                                        key={index}
                                        className="dropdown-item"
                                        onClick={() => { if (algorithmPages[algo]) setPage(algo); }}
                                    >
                                        {algo}
                                    </div>
                                ))}
                            </div>
                        </li>
                        <li onClick={() => setPage("compare")}>Compare</li>
                    </ul>
                </nav>


                {/* HOME PAGE */}
                {page === "home" && (
                    <div>
                        <section className="hero">
                            <h1>Algorithm Visualizer</h1>
                            <p>Understand algorithms through step-by-step interactive visualizations.</p>
                            <div className="hero-buttons">
                                <button className="secondary" onClick={() => setPage("compare")}>Compare Algorithms</button>
                            </div>
                        </section>


                        {/* POPULAR ALGORITHMS — now clickable */}
                        <section className="cards">
                            <h2>Popular Algorithms</h2>
                            <div className="card-grid">
                                {[
                                    "Quick Sort",
                                    "Merge Sort",
                                    "Bubble Sort",
                                    "Binary Search",
                                    "Breadth-First Search",
                                    "Dijkstra's Algorithm",

                                ].map((algo) => (
                                    <div
                                        key={algo}
                                        className="card"
                                        style={{ cursor: algorithmPages[algo] ? "pointer" : "default" }}
                                        onClick={() => { if (algorithmPages[algo]) setPage(algo); }}
                                    >
                                        {algo}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}


                {/* COMPARE PAGE */}
                {page === "compare" && (
                    <div className="compare-page">
                        <h1>Compare Algorithms</h1>
                        <p className="compare-subtitle">Select a category to compare time and space complexities.</p>


                        {/* Category tabs */}
                        <div className="compare-tabs">
                            {Object.keys(categories).map(cat => (
                                <button
                                    key={cat}
                                    className={`compare-tab${compareCategory === cat ? " active" : ""}`}
                                    onClick={() => setCompareCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>


                        {/* Comparison table */}
                        <div className="compare-table-wrapper">
                            <table className="compare-table">
                                <thead>
                                    <tr>
                                        <th>Algorithm</th>
                                        <th>Best Case</th>
                                        <th>Average Case</th>
                                        <th>Worst Case</th>
                                        <th>Space</th>
                                        {categories[compareCategory].showStable && <th>Stable</th>}
                                        <th>Visualize</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories[compareCategory].algorithms.map(algo => {
                                        const d = categories[compareCategory].data[algo];
                                        return (
                                            <tr key={algo}>
                                                <td className="compare-algo-name">{algo}</td>
                                                <td><span className="complexity-badge best">{d.best}</span></td>
                                                <td><span className="complexity-badge avg">{d.avg}</span></td>
                                                <td><span className="complexity-badge worst">{d.worst}</span></td>
                                                <td><span className="complexity-badge space">{d.space}</span></td>
                                                {categories[compareCategory].showStable && <td>{d.stable}</td>}
                                                <td>
                                                    {algorithmPages[algo] ? (
                                                        <button className="compare-link-btn" onClick={() => setPage(algo)}>
                                                            Visualize →
                                                        </button>
                                                    ) : (
                                                        <span className="compare-soon">Soon</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


                {/* ALGORITHM PAGES */}
                {Object.keys(algorithmPages).map((algo) =>
                    page === algo ? <div key={algo}>{algorithmPages[algo]}</div> : null
                )}
            </div>
        </Router>
    );
}

export default App;
