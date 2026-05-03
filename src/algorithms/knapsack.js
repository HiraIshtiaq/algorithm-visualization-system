
export async function knapsack(
  items,
  capacity,
  setActiveItem,
  setBag,
  setMessage,
  delay,
  controlRef,
  setDpTable,
  setBacktrackLog  // new: called with [{step, item, action, weight, value, remainingCap}]
) {

  const n = items.length;
  let dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
  setDpTable(dp.map(row => [...row]));

  // ── Phase 1: Fill DP table ─────────────────────────────────────────────────
  for (let i = 1; i <= n; i++) {

    if (controlRef.current.stop) return;
    while (controlRef.current.pause) { await delay(200); }

    setActiveItem(i - 1);
    setMessage(`Phase 1 — Considering item: ${items[i - 1].name} (W:${items[i-1].weight}, V:${items[i-1].value})`);
    await delay();

    for (let w = 0; w <= capacity; w++) {
      if (controlRef.current.stop) return;
      while (controlRef.current.pause) { await delay(200); }

      if (items[i - 1].weight <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - items[i - 1].weight] + items[i - 1].value
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
      setDpTable(dp.map(row => [...row]));
    }
  }

  // ── Phase 2: Backtrack to find selected items ──────────────────────────────
  setMessage("Phase 2 — Backtracking through DP table to find selected items...");
  setActiveItem(null);
  await delay();

  if (controlRef.current.stop) return;

  let w = capacity;
  const selected = [];
  const traceLog = [];
  let step = 1;

  for (let i = n; i >= 1; i--) {
    if (controlRef.current.stop) return;
    while (controlRef.current.pause) { await delay(200); }

    setActiveItem(i - 1);
    const item = items[i - 1];

    if (dp[i][w] !== dp[i - 1][w]) {
      // Item i was included
      selected.push(item);
      traceLog.push({
        step: step++,
        item: item.name,
        action: "Include",
        weight: item.weight,
        value: item.value,
        remainingCap: w - item.weight
      });
      setMessage(`↗ Include "${item.name}" (W:${item.weight}, V:${item.value}) — remaining cap: ${w - item.weight}`);
      w -= item.weight;
    } else {
      // Item i was excluded
      traceLog.push({
        step: step++,
        item: item.name,
        action: "Exclude",
        weight: item.weight,
        value: item.value,
        remainingCap: w
      });
      setMessage(`↘ Exclude "${item.name}" — not beneficial at cap ${w}`);
    }

    if (setBacktrackLog) setBacktrackLog([...traceLog]);
    setBag([...selected]);
    await delay();
  }

  const totalValue  = selected.reduce((s, x) => s + x.value, 0);
  const totalWeight = selected.reduce((s, x) => s + x.weight, 0);
  setMessage(`✅ Done! Optimal value: ${totalValue} | Total weight: ${totalWeight} / ${capacity}`);
  setActiveItem(null);
}