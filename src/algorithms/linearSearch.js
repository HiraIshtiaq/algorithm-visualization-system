// Searching/linearSearch.js
export function linearSearch(array, target) {
    const steps = [];
    const arr = [...array];
    const searchTarget = parseInt(target);

    steps.push({
        array: [...arr],
        explanation: "Ready",
        description: `Searching for ${searchTarget} in the array`,
        comparing: [],
        found: []
    });

    for (let i = 0; i < arr.length; i++) {
        steps.push({
            array: [...arr],
            explanation: "Checking",
            description: `Index ${i}: value = ${arr[i]} - comparing with target ${searchTarget}`,
            comparing: [i],
            found: []
        });

        if (arr[i] === searchTarget) {
            steps.push({
                array: [...arr],
                explanation: "Found",
                description: `Target ${searchTarget} found at index ${i}`,
                comparing: [],
                found: [i]
            });
            return steps;
        }
    }

    steps.push({
        array: [...arr],
        explanation: "Not Found",
        description: `Target ${searchTarget} does not exist in the array`,
        comparing: [],
        found: []
    });

    return steps;
}