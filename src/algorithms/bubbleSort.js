export async function bubbleSort(array, setArray, setActive, delay) {

  let arr = [...array];

  for (let i = 0; i < arr.length; i++) {

    for (let j = 0; j < arr.length - i - 1; j++) {

      setActive([j, j + 1]);
      await delay();

      if (arr[j] > arr[j + 1]) {

        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        setArray([...arr]);

        await delay();
      }

    }

  }

  setActive([]);
}
