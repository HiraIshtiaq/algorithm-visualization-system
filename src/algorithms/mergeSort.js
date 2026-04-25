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

  // Sort left half 
  mergeSortHelper(auxiliaryArray, startIdx, midIdx, mainArray, animations);
  // Sort right half
  mergeSortHelper(auxiliaryArray, midIdx + 1, endIdx, mainArray, animations);

  // Merge two halves back into mainArray
  doMerge(mainArray, startIdx, midIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(mainArray, startIdx, midIdx, endIdx, auxiliaryArray, animations) {
  let k = startIdx; // pointer into mainArray
  let i = startIdx; // into left sub-array  
  let j = midIdx + 1; // into right sub-array 

  while (i <= midIdx && j <= endIdx) {
    animations.push({ type: 'compare', indices: [i, j] });
    animations.push({ type: 'revert', indices: [i, j] });

    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      animations.push({ type: 'overwrite', indices: [k], value: auxiliaryArray[i] });
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      animations.push({ type: 'overwrite', indices: [k], value: auxiliaryArray[j] });
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  // copy remaining elements of the left half
  while (i <= midIdx) {
    animations.push({ type: 'compare', indices: [i, i] });
    animations.push({ type: 'revert', indices: [i, i] });
    animations.push({ type: 'overwrite', indices: [k], value: auxiliaryArray[i] });
    mainArray[k++] = auxiliaryArray[i++];
  }

  // copy remaining elements of the right half
  while (j <= endIdx) {
    animations.push({ type: 'compare', indices: [j, j] });
    animations.push({ type: 'revert', indices: [j, j] });
    animations.push({ type: 'overwrite', indices: [k], value: auxiliaryArray[j] });
    mainArray[k++] = auxiliaryArray[j++];
  }
}

//  generate a random integer array of given length,
export function generateRandomArray(length = 30, min = 5, max = 100) {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}
