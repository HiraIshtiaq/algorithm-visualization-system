// export async function towerOfHanoi(n, from, to, aux, setMoves, delay) {
//   if (n === 0) return;
//   await towerOfHanoi(n - 1, from, aux, to, setMoves, delay);
//   setMoves(prev => [...prev, `Move disk ${n} from ${from} to ${to}`]);
//   await delay();
//   await towerOfHanoi(n - 1, aux, to, from, setMoves, delay);
// }

export function towerOfHanoi(n, from, to, aux, moves) {

  if (n === 0) return;

  towerOfHanoi(n - 1, from, aux, to, moves);

  moves.push({ from, to });

  towerOfHanoi(n - 1, aux, to, from, moves);

}