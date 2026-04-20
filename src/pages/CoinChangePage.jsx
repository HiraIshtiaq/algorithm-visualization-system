import CoinChangeVisualizer from "../components/CoinChangeVisualizer";

function CoinChangePage() {
    return (
        <div className="algo-page">
            <h1>Coin Change Problem</h1>
            <p>
                The Coin Change Problem finds the minimum number of coins needed to 
                make a given amount using a given set of coin denominations.
            </p>
            <h3>Time Complexity</h3>
            <ul>
                <li>Time Complexity: O(amount × coins)</li>
                <li>Space Complexity: O(amount)</li>
            </ul>
            <CoinChangeVisualizer />
        </div>
    );
}

export default CoinChangePage;