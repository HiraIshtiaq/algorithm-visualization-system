import SudokuVisualizer from "../components/SudokuVisualizer";

function SudokuPage() {
    return (
        <div className="algo-page">
            <h1>Sudoku Solver</h1>
            <p>
                Sudoku Solver uses backtracking to solve a 9x9 Sudoku puzzle. 
                It tries numbers from 1 to 9 and backtracks when a conflict occurs.
            </p>
            <h3>Time Complexity</h3>
            <ul>
                <li>Time Complexity: O(9^(n²))</li>
                <li>Space Complexity: O(n²)</li>
            </ul>
            <SudokuVisualizer />
        </div>
    );
}

export default SudokuPage;