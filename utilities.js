export function formatArray(array, hidden) {
  let formattedArray = [];

  console.log(array, hidden);

  if (hidden) {
    let hiddenArray = [];

    array.forEach((element) => {
      hiddenArray.push(element);
    });

    hiddenArray[0] = "?";

    formattedArray = hiddenArray;
    formattedArray = hiddenArray.map((card) => {
      return "[" + card + "] ";
    });
  }

  if (!hidden) {
    formattedArray = array.map((card) => {
      return "[" + card + "] ";
    });
  }

  let formattedText = formattedArray.toString().replace(/[\s,]/g, "");

  return formattedText;
}

export function getSumCards(array) {
  let sum = array.reduce((a, b) => a + b, 0);
  return sum;
}