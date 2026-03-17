// // import logo from './logo.svg';
// // import './App.css';

// // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           Edit <code>src/App.js</code> and save to reload.
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;

// // import React from "react";
// // import BubbleSortVisualizer from "./components/BubbleSortVisualizer";
// // import BinarySearchVisualizer from "./components/BinarySearchVisualizer";
// // import DFSVisualizer from "./components/DFSVisualizer";
// // import KnapsackVisualizer from "./components/KnapsackVisualizer";
// // import TowerOfHanoiVisualizer from "./components/TowerOfHanoiVisualizer";
// // import "./App.css";

// // function App() {
// //   return (
// //     <div className="app">
// //       <h1>Algorithm Visualizer</h1>

// //       <BubbleSortVisualizer />
// //       <BinarySearchVisualizer />
// //       <DFSVisualizer />
// //       <KnapsackVisualizer />
// //       <TowerOfHanoiVisualizer />
// //     </div>
// //   );
// // }

// // export default App;


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
// import BubbleSortPage from "./pages/BubbleSortPage";
// import BinarySearchPage from "./pages/BinarySearchPage";
// import DFSPage from "./pages/DFSPage";
// import KnapsackPage from "./pages/KnapsackPage";
// import TowerPage from "./pages/TowerPage";

// import "./App.css";

// function App() {

//   return (

//     <Router>

//       <Routes>

//         <Route path="/" element={<Home />} />

//         <Route path="/bubble-sort" element={<BubbleSortPage />} />
//         <Route path="/binary-search" element={<BinarySearchPage />} />
//         <Route path="/dfs" element={<DFSPage />} />
//         <Route path="/knapsack" element={<KnapsackPage />} />
//         <Route path="/tower-hanoi" element={<TowerPage />} />

//       </Routes>

//     </Router>

//   );

// }

// export default App;





// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// import BubbleSortPage from "./pages/BubbleSortPage";
// import BinarySearchPage from "./pages/BinarySearchPage";
// import DFSPage from "./pages/DFSPage";
// import KnapsackPage from "./pages/KnapsackPage";
// import TowerOfHanoiPage from "./pages/TowerPage";
// import React, { useState } from "react";
// import "./App.css";

// function App() {

//   const [page, setPage] = useState("home");

//   const algorithms = [
//     "Quick Sort","Linear Search","Prim's Algorithm","Coin Change Problem","Sudoku Solver",
//     "Bubble Sort","Binary Search","Depth-First Search","0/1 Knapsack Problem","Tower of Hanoi",
//     "Merge Sort","Selection Sort","Dijkstra's Algorithm","Bucket Sort","Tree Traversal",
//     "Insertion Sort","Heap Sort","Breadth-First Search","Kruskal's Algorithm","N-Queens Problem"
//   ];

//   return (
//     <div>

//       {/* NAVBAR */}
//       <nav className="navbar">

//         <div className="logo">Algorithm Visualizer</div>

//         <ul className="nav-links">

//           <li onClick={() => setPage("home")}>Home</li>

//           <li className="dropdown">
//             Algorithms ▾
//             <div className="dropdown-menu">
//               {algorithms.map((algo, index) => (
//                 <div key={index} className="dropdown-item">
//                   {algo}
//                 </div>
//               ))}
//             </div>
//           </li>

//           <li onClick={() => setPage("compare")}>Compare</li>

//         </ul>

//       </nav>

//       {/* HOME PAGE */}
//       {page === "home" && (
//         <div>

//           {/* HERO SECTION */}
//           <section className="hero">

//             <h1>Algorithm Visualizer</h1>

//             <p>
//               Understand algorithms through step-by-step interactive
//               visualizations.
//             </p>

//             <div className="hero-buttons">
//               <button>Explore Algorithms</button>
//               <button className="secondary">Compare Algorithms</button>
//             </div>

//           </section>


//           {/* POPULAR ALGORITHMS */}
//           <section className="cards">

//             <h2>Popular Algorithms</h2>

//             <div className="card-grid">

//               <div className="card">Quick Sort</div>
//               <div className="card">Merge Sort</div>
//               <div className="card">Bubble Sort</div>
//               <div className="card">Binary Search</div>
//               <div className="card">Dijkstra's Algorithm</div>
//               <div className="card">Breadth First Search</div>

//             </div>

//           </section>

//         </div>
//       )}


//       {/* COMPARE PAGE */}
//       {page === "compare" && (

//         <div className="compare-page">

//           <h1>Compare Algorithms</h1>

//           <p>Select algorithms and compare their performance visually.</p>

//           <button>Start Comparison</button>

//         </div>

//       )}

//     </div>
//   );
// }

// export default App;






import { BrowserRouter as Router } from "react-router-dom";

import BubbleSortPage from "./pages/BubbleSortPage";
import BinarySearchPage from "./pages/BinarySearchPage";
import DFSPage from "./pages/DFSPage";
import KnapsackPage from "./pages/KnapsackPage";
import TowerOfHanoiPage from "./pages/TowerPage";
import React, { useState } from "react";
import "./App.css";
// import NQueensPage from "./pages/NQueensPage";
// import BFSPage from "./pages/BFSPage";
// import KruskalPage from "./pages/KruskalPage";
// import HeapSortPage from "./pages/HeapSortPage";
// import InsertionSortPage from "./pages/InsertionSortPage";

function App() {
  const [page, setPage] = useState("home");

  const algorithms = [
    "Quick Sort","Linear Search","Prim's Algorithm","Coin Change Problem","Sudoku Solver",
    "Bubble Sort","Binary Search","Depth-First Search","0/1 Knapsack Problem","Tower of Hanoi",
    "Merge Sort","Selection Sort","Dijkstra's Algorithm","Bucket Sort","Tree Traversal",
    "Insertion Sort","Heap Sort","Breadth-First Search","Kruskal's Algorithm","N-Queens Problem"
  ];

  // Map algorithm names to components
  const algorithmPages = {
    "Bubble Sort": <BubbleSortPage />,
    "Binary Search": <BinarySearchPage />,
    "Depth-First Search": <DFSPage />,
    "0/1 Knapsack Problem": <KnapsackPage />,
    "Tower of Hanoi": <TowerOfHanoiPage />,
    // "N-Queens Problem":<NQueensPage />,
    // "Kruskal's Algorithm":<KruskalPage />,
    // "Insertion Sort":<InsertionSortPage />,
    // "Breadth-First Search": <BFSPage/>,
    // "Heap Sort":<HeapSortPage />,
  };

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
                    onClick={() => {
                      if (algorithmPages[algo]) {
                        setPage(algo); // set page to algorithm name
                      }
                    }}
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
            {/* HERO SECTION */}
            <section className="hero">
              <h1>Algorithm Visualizer</h1>
              <p>
                Understand algorithms through step-by-step interactive
                visualizations.
              </p>
              <div className="hero-buttons">
                <button>Explore Algorithms</button>
                <button className="secondary">Compare Algorithms</button>
              </div>
            </section>

            {/* POPULAR ALGORITHMS */}
            <section className="cards">
              <h2>Popular Algorithms</h2>
              <div className="card-grid">
                <div className="card">Quick Sort</div>
                <div className="card">Merge Sort</div>
                <div className="card">Bubble Sort</div>
                <div className="card">Binary Search</div>
                <div className="card">Dijkstra's Algorithm</div>
                <div className="card">Breadth First Search</div>
              </div>
            </section>
          </div>
        )}

        {/* COMPARE PAGE */}
        {page === "compare" && (
          <div className="compare-page">
            <h1>Compare Algorithms</h1>
            <p>Select algorithms and compare their performance visually.</p>
            <button>Start Comparison</button>
          </div>
        )}

        {/* ALGORITHM PAGES */}
        {Object.keys(algorithmPages).map((algo) => {
          return page === algo ? <div key={algo}>{algorithmPages[algo]}</div> : null;
        })}
      </div>
    </Router>
  );
}

export default App;
