
export function getSelectionSortAnimations(array) {
  const animations = [];
  const arr = array.slice();
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      // compare current with current minimum
      animations.push({ type: 'compare', indices: [minIdx, j] });
      animations.push({ type: 'revert',  indices: [minIdx, j] });

      if (arr[j] < arr[minIdx]) {
        // revert old minimum color before marking new one
        animations.push({ type: 'newMin', indices: [j] });
        minIdx = j;
      }
    }

    // swap minimum element into sorted position
    if (minIdx !== i) {
      animations.push({ type: 'swap', indices: [i, minIdx] });
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }

    // mark position i as sorted
    animations.push({ type: 'sorted', indices: [i] });
  }

  // to mark last element as sorted
  animations.push({ type: 'sorted', indices: [n - 1] });

  return animations;
}

  // Utility: generate a random integer array
export function generateRandomArray(length = 30, min = 5, max = 100) {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}
