// Sorting/quickSort.js
export function quickSort(array) {
    const steps = [];
    const arr = [...array];

    steps.push({
        array: [...arr],
        explanation: "Initial",
        description: `Starting Quick Sort with array: [${arr.join(', ')}]`
    });

    function partition(arr, low, high) {
        const pivot = arr[high];
        steps.push({
            array: [...arr],
            explanation: "Select Pivot",
            description: `Selected pivot: ${pivot} at index ${high}`
        });

        let i = low - 1;

        for (let j = low; j < high; j++) {
            steps.push({
                array: [...arr],
                explanation: "Compare",
                description: `Comparing ${arr[j]} with pivot ${pivot}`
            });

            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                steps.push({
                    array: [...arr],
                    explanation: "Swap",
                    description: `Swapped ${arr[i]} and ${arr[j]} (${arr[j]} < ${pivot})`
                });
            }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        steps.push({
            array: [...arr],
            explanation: "Place Pivot",
            description: `Placed pivot ${pivot} at position ${i + 1}`
        });

        return i + 1;
    }

    function quickSortHelper(arr, low, high) {
        if (low < high) {
            const pi = partition(arr, low, high);
            quickSortHelper(arr, low, pi - 1);
            quickSortHelper(arr, pi + 1, high);
        }
    }

    quickSortHelper(arr, 0, arr.length - 1);

    steps.push({
        array: [...arr],
        explanation: "Complete",
        description: `Array sorted! Result: [${arr.join(', ')}]`
    });

    return steps;
}