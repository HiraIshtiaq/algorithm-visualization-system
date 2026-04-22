
export function towerOfHanoi(n, from, to, aux, moves) {

  if (n === 0) return;

  towerOfHanoi(n - 1, from, aux, to, moves);

  moves.push({ from, to });

  towerOfHanoi(n - 1, aux, to, from, moves);

}
