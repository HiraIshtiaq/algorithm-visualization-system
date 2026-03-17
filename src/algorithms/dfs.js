// export async function dfs(graph, start, setVisited, delay) {
//   const visited = new Set();
//   async function traverse(node) {
//     visited.add(node);
//     setVisited([...visited]);
//     await delay();
//     for (let neighbor of graph[node]) {
//       if (!visited.has(neighbor)) await traverse(neighbor);
//     }
//   }
//   await traverse(start);
// }
export async function dfs(graph, start, setVisited, setMessage, delay) {

  let visited = new Set();

  async function dfsVisit(node) {

    visited.add(node);

    setVisited(prev => [...prev, node]);
    setMessage("Visiting node " + node);

    await delay();

    for (let neighbor of graph[node]) {

      if (!visited.has(neighbor)) {

        setMessage("Going deeper from " + node + " to " + neighbor);

        await delay();

        await dfsVisit(neighbor);

      }

    }

  }

  await dfsVisit(start);

  setMessage("DFS Traversal Complete");

}