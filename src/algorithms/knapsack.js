
export async function knapsack(
  items,
  capacity,
  setActiveItem,
  setBag,
  setMessage,
  delay,
  controlRef
) 
{

  const n = items.length;
  let dp = Array(n+1).fill(0).map(()=>Array(capacity+1).fill(0));

  for(let i=1;i<=n;i++){

    if(controlRef.current.stop) return;

    while(controlRef.current.pause){
      await delay(200);
    }

    setActiveItem(i-1);
    setMessage(`Considering ${items[i-1].name}`);
    await delay();

    for(let w=0; w<=capacity; w++){
      if (controlRef.current.stop) return;
      while (controlRef.current.pause) {
        await delay(200);
      }


      if(items[i-1].weight <= w){
        dp[i][w] = Math.max(
          dp[i-1][w],
          dp[i-1][w-items[i-1].weight] + items[i-1].value
        );
      } else {
        dp[i][w] = dp[i-1][w];
      }

    }

    // Build bag
    let bagContent = [];
    let w = capacity;

    for(let j=i; j>0; j--){
      if(dp[j][w] !== dp[j-1][w]){
        bagContent.push(items[j-1]);
        w -= items[j-1].weight;
      }
    }

    setBag([...bagContent]);
    await delay();
  }

  setMessage("Knapsack Complete");
  setActiveItem(null);
}