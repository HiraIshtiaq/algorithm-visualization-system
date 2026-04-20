/**
 * selectionSort.js
 * Generates animation steps for visualizing Selection Sort.
 *
 * Step types:
 *   { type: 'compare',  indices: [i, j] }         → comparing bar j against current minimum
 *   { type: 'revert',   indices: [i, j] }         → un-highlight those bars
 *   { type: 'newMin',   indices: [minIdx] }        → mark new minimum found
 *   { type: 'swap',     indices: [i, minIdx] }     → swap two bars
 *   { type: 'sorted',   indices: [i] }             → mark bar as permanently sorted
 */

export function getSelectionSortAnimations(array) {
  const animations = [];
  const arr = array.slice();
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      // Compare current element with current minimum
      animations.push({ type: 'compare', indices: [minIdx, j] });
      animations.push({ type: 'revert',  indices: [minIdx, j] });

      if (arr[j] < arr[minIdx]) {
        // Revert old minimum color before marking new one
        animations.push({ type: 'newMin', indices: [j] });
        minIdx = j;
      }
    }

    // Swap minimum element into sorted position
    if (minIdx !== i) {
      animations.push({ type: 'swap', indices: [i, minIdx] });
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }

    // Mark position i as sorted
    animations.push({ type: 'sorted', indices: [i] });
  }

  // Mark last element as sorted
  animations.push({ type: 'sorted', indices: [n - 1] });

  return animations;
}

/**
 * Utility: generate a random integer array
 */
export function generateRandomArray(length = 30, min = 5, max = 100) {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}
