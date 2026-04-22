
export async function dfs(graph, start, setVisited, setMessage, delay, flags) {
  let visited = new Set();

  async function dfsVisit(node) {
    if (flags.stop) return;

    visited.add(node);
    setVisited(prev => [...prev, node]);
    setMessage("Visiting node " + node);

    await delay();

    for (let neighbor of graph[node] || []) {
      if (flags.stop) return;

      while (flags.pause) {
        await new Promise(r => setTimeout(r, 100));
      }

      if (!visited.has(neighbor)) {
        setMessage("Going deeper from " + node + " to " + neighbor);
        await delay();
        await dfsVisit(neighbor);
      }
    }
  }

  await dfsVisit(start);

  if (!flags.stop) {
    setMessage("DFS Traversal Complete");
  }
}