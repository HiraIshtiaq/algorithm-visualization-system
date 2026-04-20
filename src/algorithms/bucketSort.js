/**
 * bucketSort.js
 * Generates animation steps for visualizing Bucket Sort.
 *
 * Step types:
 *   { type: 'bucket',   indices: [i], bucketId: number }   → bar i placed into a bucket (color = bucket color)
 *   { type: 'compare',  indices: [i, j] }                  → comparing two bars inside a bucket
 *   { type: 'revert',   indices: [i, j] }                  → un-highlight
 *   { type: 'overwrite', indices: [pos], value: number, bucketId: number } → writing back to main array
 *   { type: 'sorted',   indices: [i] }                     → bar fully placed and sorted
 */

// 10 distinct bucket colors (used both in algorithm and legend)
export const BUCKET_COLORS = [
  '#f72585', // bucket 0 — hot pink
  '#ff9f1c', // bucket 1 — orange
  '#f9e900', // bucket 2 — yellow
  '#06d6a0', // bucket 3 — mint
  '#4cc9f0', // bucket 4 — sky blue
  '#7b61ff', // bucket 5 — violet
  '#ff6b6b', // bucket 6 — coral
  '#43aa8b', // bucket 7 — teal
  '#a8dadc', // bucket 8 — ice blue
  '#e9c46a', // bucket 9 — gold
];

export function getBucketSortAnimations(array) {
  const animations = [];
  const arr = array.slice();
  const n = arr.length;
  if (n <= 1) return animations;

  const numBuckets = Math.min(10, n);
  const maxVal = Math.max(...arr);
  const minVal = Math.min(...arr);
  const range = maxVal - minVal || 1;

  // Build buckets and track original indices
  const buckets = Array.from({ length: numBuckets }, () => []);
  const indexMap = arr.map((val, i) => ({ val, origIdx: i }));

  // Assign each element to a bucket — emit 'bucket' animation
  indexMap.forEach(({ val, origIdx }) => {
    const bucketId = Math.min(
      Math.floor(((val - minVal) / range) * numBuckets),
      numBuckets - 1
    );
    buckets[bucketId].push({ val, origIdx });
    animations.push({ type: 'bucket', indices: [origIdx], bucketId });
  });

  // Sort each bucket (insertion sort) with compare animations
  buckets.forEach((bucket, bucketId) => {
    for (let i = 1; i < bucket.length; i++) {
      let j = i;
      while (j > 0 && bucket[j - 1].val > bucket[j].val) {
        animations.push({ type: 'compare', indices: [bucket[j - 1].origIdx, bucket[j].origIdx] });
        animations.push({ type: 'revert',  indices: [bucket[j - 1].origIdx, bucket[j].origIdx] });
        [bucket[j - 1], bucket[j]] = [bucket[j], bucket[j - 1]];
        j--;
      }
    }
  });

  // Concatenate buckets back and emit overwrite animations
  let pos = 0;
  buckets.forEach((bucket, bucketId) => {
    bucket.forEach(({ val }) => {
      animations.push({ type: 'overwrite', indices: [pos], value: val, bucketId });
      animations.push({ type: 'sorted', indices: [pos] });
      pos++;
    });
  });

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
