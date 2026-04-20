/**
 * mergeSort.js
 * Generates an array of animation steps for visualizing Merge Sort.
 * Each step describes which bars to highlight, compare, or overwrite.
 */

/**
 * Returns an array of animation steps.
 * Each step is an object:
 *   { type: 'compare' | 'overwrite', indices: [i, j], value?: number }
 *
 * - 'compare'  → highlight indices[0] and indices[1] (comparison phase)
 * - 'overwrite' → set arr[indices[0]] = value        (merge write phase)
 */
export function getMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;

  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  return animations;
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
  if (startIdx === endIdx) return;

  const midIdx = Math.floor((startIdx + endIdx) / 2);

  // Sort left half (roles of main / auxiliary swap each level)
  mergeSortHelper(auxiliaryArray, startIdx, midIdx, mainArray, animations);
  // Sort right half
  mergeSortHelper(auxiliaryArray, midIdx + 1, endIdx, mainArray, animations);

  // Merge the two halves back into mainArray
  doMerge(mainArray, startIdx, midIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(mainArray, startIdx, midIdx, endIdx, auxiliaryArray, animations) {
  let k = startIdx; // pointer into mainArray
  let i = startIdx; // pointer into left sub-array  (in auxiliaryArray)
  let j = midIdx + 1; // pointer into right sub-array (in auxiliaryArray)

  while (i <= midIdx && j <= endIdx) {
    // Record the two indices being compared
    animations.push({ type: 'compare', indices: [i, j] });
    // Revert the highlight on the next step
    animations.push({ type: 'revert', indices: [i, j] });

    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      // Overwrite mainArray[k] with auxiliaryArray[i]
      animations.push({ type: 'overwrite', indices: [k], value: auxiliaryArray[i] });
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      animations.push({ type: 'overwrite', indices: [k], value: auxiliaryArray[j] });
      mainArray[k++] = auxiliaryArray[j++];
    }
  }

  // Copy remaining elements of the left half
  while (i <= midIdx) {
    animations.push({ type: 'compare', indices: [i, i] });
    animations.push({ type: 'revert', indices: [i, i] });
    animations.push({ type: 'overwrite', indices: [k], value: auxiliaryArray[i] });
    mainArray[k++] = auxiliaryArray[i++];
  }

  // Copy remaining elements of the right half
  while (j <= endIdx) {
    animations.push({ type: 'compare', indices: [j, j] });
    animations.push({ type: 'revert', indices: [j, j] });
    animations.push({ type: 'overwrite', indices: [k], value: auxiliaryArray[j] });
    mainArray[k++] = auxiliaryArray[j++];
  }
}

/**
 * Utility: generate a random integer array of given length,
 * values between min and max (inclusive).
 */
export function generateRandomArray(length = 30, min = 5, max = 100) {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}
