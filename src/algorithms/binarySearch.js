// export async function binarySearch(array, target, setActive, delay) {
//   let left = 0;
//   let right = array.length - 1;

//   while (left <= right) {
//     const mid = Math.floor((left + right) / 2);
//     setActive([mid]);
//     await delay();

//     if (array[mid] === target) return mid;
//     if (array[mid] < target) left = mid + 1;
//     else right = mid - 1;
//   }

//   setActive([]);
//   return -1;
// }
export async function binarySearch(
  array,
  target,
  setLeft,
  setRight,
  setMid,
  setMessage,
  delay
) {

  let left = 0;
  let right = array.length - 1;

  setMessage("Starting Binary Search");

  while (left <= right) {

    setLeft(left);
    setRight(right);

    let mid = Math.floor((left + right) / 2);
    setMid(mid);

    setMessage(
      "Checking middle value " + array[mid] + " with target " + target
    );

    await delay();

    if (array[mid] === target) {
      setMessage("Target Found at index " + mid);
      return;
    }

    if (array[mid] < target) {
      setMessage(
        array[mid] + " < " + target + " → Searching Right Half"
      );
      left = mid + 1;
    }
    else {
      setMessage(
        array[mid] + " > " + target + " → Searching Left Half"
      );
      right = mid - 1;
    }

    await delay();
  }

  setMessage("Target Not Found");
}