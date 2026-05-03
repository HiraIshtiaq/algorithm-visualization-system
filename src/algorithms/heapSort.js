export async function heapSort(
  array,
  setArray,
  setCurrentIndex,
  setCompareIndex,
  setSortedIndices,
  setMessage,
  getDelay,
  isPausedRef,
  isStoppedRef,
  setHeapSize   // NEW: tracks active heap boundary for tree rendering
) {

  let arr = [...array];
  let n = arr.length;
  let sorted = [];

  async function wait() {
    await new Promise(res => setTimeout(res, getDelay()));
    while (isPausedRef.current && !isStoppedRef.current) {
      await new Promise(res => setTimeout(res, 100));
    }
  }

  async function heapify(arr, heapN, i) {
    if (isStoppedRef.current) return;

    let largest = i;
    let left  = 2 * i + 1;
    let right = 2 * i + 2;

    setCurrentIndex(i);
    setMessage(`Heapify: checking node [${i}] = ${arr[i]}`);
    await wait();
    if (isStoppedRef.current) return;

    if (left < heapN && arr[left] > arr[largest])   largest = left;
    if (right < heapN && arr[right] > arr[largest])  largest = right;

    if (largest !== i) {
      setCompareIndex(largest);
      setMessage(`Swap ${arr[i]} ↔ ${arr[largest]} (node [${i}] ↔ [${largest}])`);
      await wait();
      if (isStoppedRef.current) return;

      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      await wait();
      if (isStoppedRef.current) return;

      setCompareIndex(null);
      await heapify(arr, heapN, largest);
    }
  }

  // Phase 1 — Build Max Heap
  setMessage("Phase 1: Building Max Heap...");
  if (setHeapSize) setHeapSize(n);
  await wait();
  if (isStoppedRef.current) return;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (isStoppedRef.current) return;
    await heapify(arr, n, i);
  }

  setMessage("✅ Max Heap built! Starting extraction...");
  setCurrentIndex(null);
  setCompareIndex(null);
  await wait();
  if (isStoppedRef.current) return;

  // Phase 2 — Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    if (isStoppedRef.current) return;

    setCurrentIndex(0);
    setCompareIndex(i);
    setMessage(`Extract root ${arr[0]} → place at index ${i}`);
    await wait();
    if (isStoppedRef.current) return;

    [arr[0], arr[i]] = [arr[i], arr[0]];
    setArray([...arr]);

    sorted.unshift(i);
    setSortedIndices([...sorted]);
    if (setHeapSize) setHeapSize(i); // shrink heap boundary

    setCurrentIndex(null);
    setCompareIndex(null);
    await wait();
    if (isStoppedRef.current) return;

    await heapify(arr, i, 0);
    if (isStoppedRef.current) return;
  }

  setSortedIndices(arr.map((_, idx) => idx));
  if (setHeapSize) setHeapSize(0);
  setCurrentIndex(null);
  setCompareIndex(null);
  setMessage("✅ Array fully sorted!");
}