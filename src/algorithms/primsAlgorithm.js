export function primsAlgorithm(nodes, edges, startNode = null) {
    const steps = [];

    const graph = {
        nodes: nodes || ['A', 'B', 'C', 'D'],
        edges: edges || [
            { from: 'A', to: 'B', weight: 4 },
            { from: 'A', to: 'C', weight: 2 },
            { from: 'B', to: 'C', weight: 1 },
            { from: 'B', to: 'D', weight: 5 },
            { from: 'C', to: 'D', weight: 3 }
        ]
    };

    // 👇 FIND THE EDGE WITH MINIMUM WEIGHT (SMALLEST EDGE IN WHOLE GRAPH)
    function findGlobalMinEdge(edges) {
        let minEdge = null;
        let minWeight = Infinity;

        for (let edge of edges) {
            if (edge.weight < minWeight) {
                minWeight = edge.weight;
                minEdge = edge;
            }
        }
        return minEdge;
    }

    // 👇 FIND MINIMUM EDGE FROM CURRENT MST TO UNVISITED NODES
    function findMinEdgeFromMST(visited, edges) {
        let minEdge = null;
        let minWeight = Infinity;

        for (let edge of edges) {
            const fromVisited = visited.includes(edge.from);
            const toVisited = visited.includes(edge.to);

            // Edge connects visited node to unvisited node
            if ((fromVisited && !toVisited) || (!fromVisited && toVisited)) {
                if (edge.weight < minWeight) {
                    minWeight = edge.weight;
                    minEdge = edge;
                }
            }
        }
        return minEdge;
    }

    // 👇 DETERMINE START NODE
    let startNodeName = startNode;
    if (!startNodeName) {
        // If no start node provided, find the node with the smallest edge
        const minEdge = findGlobalMinEdge(graph.edges);
        if (minEdge) {
            // Start from either endpoint of the smallest edge
            startNodeName = minEdge.from;
        } else {
            startNodeName = graph.nodes[0];
        }
    }

    let visited = [startNodeName];
    const mstEdges = [];

    steps.push({
        graph: JSON.parse(JSON.stringify(graph)),
        explanation: "Start",
        description: `Starting Prim's Algorithm from node ${startNodeName} (node with minimum edge)`,
        visited: [...visited],
        edges: [...mstEdges]
    });

    // 👇 MAIN PRIM'S LOOP
    while (visited.length < graph.nodes.length) {
        const edge = findMinEdgeFromMST(visited, graph.edges);
        if (!edge) break;

        // Determine which node is new (not yet visited)
        let newNode;
        if (!visited.includes(edge.to)) {
            newNode = edge.to;
        } else {
            newNode = edge.from;
        }

        visited.push(newNode);
        mstEdges.push([edge.from, edge.to]);

        steps.push({
            graph: JSON.parse(JSON.stringify(graph)),
            explanation: "Add Edge",
            description: `Selected edge ${edge.from}-${edge.to} (weight ${edge.weight}) → Added node ${newNode}`,
            visited: [...visited],
            edges: [...mstEdges],
            newEdge: [edge.from, edge.to],
            newNode: newNode
        });
    }

    const totalWeight = mstEdges.reduce((sum, [f, t]) => {
        const edge = graph.edges.find(e =>
            (e.from === f && e.to === t) || (e.from === t && e.to === f)
        );
        return sum + (edge ? edge.weight : 0);
    }, 0);

    steps.push({
        graph: JSON.parse(JSON.stringify(graph)),
        explanation: "Complete",
        description: `Minimum Spanning Tree Complete! Total weight: ${totalWeight}`,
        visited: [...visited],
        edges: [...mstEdges]
    });

    return steps;
}