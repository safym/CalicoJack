export function getSumCards(array) {
  let sum = array.reduce((a, b) => a + b, 0);
  return sum;
}