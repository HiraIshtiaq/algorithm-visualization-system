/**
 * dijkstrasAlgorithm.js
 *
 * Provides:
 *   1. A set of pre-built sample graphs (nodes + weighted edges)
 *   2. getDijkstraAnimations(graph, startId) — returns ordered animation steps
 *
 * Animation step types:
 *   { type: 'visit',     nodeId }              — popped from priority queue (processing)
 *   { type: 'consider',  nodeId, via, dist }   — neighbor being considered / relaxed
 *   { type: 'settled',   nodeId, dist }        — shortest path confirmed for node
 *   { type: 'edgeActive',   from, to }         — edge being traversed
 *   { type: 'edgeSettled',  from, to }         — edge is part of shortest path tree
 *   { type: 'pathTrace', nodeId }              — final path highlight from end→start
 */

// ─── Graph definitions ────────────────────────────────────────────────────────

/**
 * Graph format:
 *   nodes: [{ id, label, x, y }]           — x,y in 0–100 coordinate space
 *   edges: [{ from, to, weight }]           — undirected
 *   start: nodeId
 *   end:   nodeId
 */
export const SAMPLE_GRAPHS = {
  simple: {
    label: 'Simple Graph',
    nodes: [
      { id: 'A', label: 'A', x: 10, y: 45 },
      { id: 'B', label: 'B', x: 30, y: 15 },
      { id: 'C', label: 'C', x: 30, y: 75 },
      { id: 'D', label: 'D', x: 55, y: 45 },
      { id: 'E', label: 'E', x: 75, y: 15 },
      { id: 'F', label: 'F', x: 75, y: 75 },
      { id: 'G', label: 'G', x: 92, y: 45 },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'D', weight: 8 },
      { from: 'C', to: 'F', weight: 10 },
      { from: 'D', to: 'E', weight: 2 },
      { from: 'D', to: 'F', weight: 6 },
      { from: 'E', to: 'G', weight: 3 },
      { from: 'F', to: 'G', weight: 5 },
    ],
    start: 'A',
    end: 'G',
  },

  medium: {
    label: 'City Network',
    nodes: [
      { id: 'S', label: 'S', x: 8,  y: 50 },
      { id: '1', label: '1', x: 25, y: 20 },
      { id: '2', label: '2', x: 25, y: 80 },
      { id: '3', label: '3', x: 45, y: 10 },
      { id: '4', label: '4', x: 45, y: 50 },
      { id: '5', label: '5', x: 45, y: 85 },
      { id: '6', label: '6', x: 65, y: 25 },
      { id: '7', label: '7', x: 65, y: 70 },
      { id: '8', label: '8', x: 80, y: 45 },
      { id: 'E', label: 'E', x: 93, y: 50 },
    ],
    edges: [
      { from: 'S', to: '1', weight: 7  },
      { from: 'S', to: '2', weight: 9  },
      { from: '1', to: '3', weight: 6  },
      { from: '1', to: '4', weight: 3  },
      { from: '2', to: '4', weight: 4  },
      { from: '2', to: '5', weight: 2  },
      { from: '3', to: '6', weight: 5  },
      { from: '4', to: '6', weight: 8  },
      { from: '4', to: '7', weight: 7  },
      { from: '5', to: '7', weight: 6  },
      { from: '6', to: '8', weight: 3  },
      { from: '7', to: '8', weight: 5  },
      { from: '8', to: 'E', weight: 2  },
      { from: '3', to: '4', weight: 9  },
      { from: '6', to: '7', weight: 4  },
    ],
    start: 'S',
    end: 'E',
  },
};

// ─── Dijkstra with animation recording ───────────────────────────────────────

export function getDijkstraAnimations(graph, startId, endId) {
  const { nodes, edges } = graph;
  const animations = [];

  // Build adjacency list
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(({ from, to, weight }) => {
    adj[from].push({ node: to, weight });
    adj[to].push({ node: from, weight });
  });

  // Distance + previous maps
  const dist = {};
  const prev = {};
  const visited = new Set();
  nodes.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; });
  dist[startId] = 0;

  // Min-heap (simple array-based priority queue)
  const pq = [{ id: startId, dist: 0 }];

  while (pq.length > 0) {
    // Extract min
    pq.sort((a, b) => a.dist - b.dist);
    const { id: u } = pq.shift();

    if (visited.has(u)) continue;
    visited.add(u);

    animations.push({ type: 'visit', nodeId: u });
    animations.push({ type: 'settled', nodeId: u, dist: dist[u] });

    if (u === endId) break;

    for (const { node: v, weight } of adj[u]) {
      if (visited.has(v)) continue;
      animations.push({ type: 'edgeActive', from: u, to: v });
      const alt = dist[u] + weight;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        animations.push({ type: 'consider', nodeId: v, via: u, dist: alt });
        pq.push({ id: v, dist: alt });
      }
    }
  }

  // Trace shortest path back from end → start
  const path = [];
  let cur = endId;
  while (cur !== null) {
    path.unshift(cur);
    cur = prev[cur];
  }

  // Only emit path trace if a path actually exists
  if (path[0] === startId) {
    for (let i = 0; i < path.length; i++) {
      animations.push({ type: 'pathTrace', nodeId: path[i] });
      if (i < path.length - 1) {
        animations.push({ type: 'edgeSettled', from: path[i], to: path[i + 1] });
      }
    }
  }

  return { animations, dist, prev, path };
}
