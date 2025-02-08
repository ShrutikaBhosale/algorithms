export const convertTo8BitBinary = (text) => {
  let binary = "";
  [...text].forEach((char) => {
    binary += char.charCodeAt().toString(2).padStart(8, "0");
  });
  return binary;
};

export const computeInitialHash = () => {
  const nums = [2, 3, 5, 7, 11, 13, 17, 19];
  return nums.map((n) => Math.sqrt(n).toString(16).split(".")[1].slice(0, 8));
};

export const msgDecomposition = (msg) => {
  const decomposedMsg = msg.match(/\d{32}/g);
  return decomposedMsg;
};

export const messagePadding = (text) => {
  const binaryRepresentation = convertTo8BitBinary(text);
  const padWith1 = binaryRepresentation + 1;
  const numOfZeros = 512 - (padWith1.length + 64);
  const textWithZero = padWith1 + "0".repeat(numOfZeros);
  const lengthOfText = binaryRepresentation.length;
  const lengthPaddedWith64 = lengthOfText.toString(2).padStart(64, "0");
  const finalRepresentation = textWithZero + lengthPaddedWith64;
  return finalRepresentation;
};

function rotateRight(number, numOfBits) {
  numOfBits = numOfBits % number.length;
  return number.slice(-numOfBits) + number.slice(0, -numOfBits);
}

function shiftRight(number, numOfBits) {
  return number
    .slice(0, number.length - numOfBits)
    .padStart(number.length, "0");
}

function sigma0(number) {
  return (
    rotateRight(number, 7) ^ rotateRight(number, 18) ^ shiftRight(number, 3)
  );
}

function sigma1(number) {
  return (
    rotateRight(number, 17) ^ rotateRight(number, 19) ^ shiftRight(number, 10)
  );
}

const msgExpansion = (msg) => {
  for (let word = 16; word < 64; word++) {
    const word16 = msg[word - 16];
    const word15 = msg[word - 15];
    const word7 = msg[word - 7];
    const word2 = msg[word - 2];

    const sigma0Of15 = sigma0(word15);
    const sigma1Of2 = sigma1(word2);

    const currentWord =
      (parseInt(word16, 2) +
        parseInt(sigma0Of15, 2) +
        parseInt(word7, 2) +
        parseInt(sigma1Of2, 2)) >>>
      0;

    msg[word] = currentWord.toString(2).padStart(32, "0");
  }

  return msg;
};

export const main = (text) => {
  const finalRepresentation = messagePadding(text);
  return msgExpansion(msgDecomposition(finalRepresentation));
};

console.log(main("abc")); //last step remaining
