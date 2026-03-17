// export async function knapsack(values, weights, capacity, setResult, delay) {
//   const n = values.length;
//   const dp = Array(n + 1)
//     .fill()
//     .map(() => Array(capacity + 1).fill(0));

//   for (let i = 1; i <= n; i++) {
//     for (let w = 0; w <= capacity; w++) {
//       dp[i][w] = dp[i - 1][w];
//       if (weights[i - 1] <= w) {
//         dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
//       }
//     }
//     setResult([...dp[i]]);
//     await delay();
//   }
// }
export async function knapsack(items, capacity, setActiveItem, setBag, setMessage, delay) {

  const n = items.length;

  // DP table (for visualization we don’t need full table)
  let dp = Array(n+1).fill(0).map(()=>Array(capacity+1).fill(0));

  for(let i=1;i<=n;i++){

    setActiveItem(i-1);
    setMessage(`Considering item ${i} (Weight: ${items[i-1].weight}, Value: ${items[i-1].value})`);
    await delay();

    for(let w=0; w<=capacity; w++){

      if(items[i-1].weight <= w){
        dp[i][w] = Math.max(dp[i-1][w], dp[i-1][w-items[i-1].weight] + items[i-1].value);
      } else {
        dp[i][w] = dp[i-1][w];
      }

    }

    // Visualize bag after considering this item
    let bagContent = [];
    let w = capacity;
    for(let j=i; j>0; j--){
      if(dp[j][w] != dp[j-1][w]){
        bagContent.push(items[j-1]);
        w -= items[j-1].weight;
      }
    }

    setBag([...bagContent]);
    await delay();

  }

  setMessage("Knapsack optimization complete!");
  setActiveItem(null);

}