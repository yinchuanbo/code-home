const random = document.querySelector("#random");
const exclude = document.querySelector("#exclude");
const random10 = document.querySelector("#random10");
const output = document.querySelector("#output");
const numDom = document.querySelector("#num");

let lock = false,
  num = 0;

let lotteryArrs = [];

random.onclick = () => {
  lock = true;
  const tickets = generateLottoNumbers(100);
  random10.value = tickets;
};

exclude.onclick = () => {
  if (lock) {
    excludeNumbers();
  }
};

function generateLottoNumbers(numberOfTickets) {
  let lottoNumbers = [];
  for (let i = 0; i < numberOfTickets; i++) {
    let redNumbers = [];
    while (redNumbers.length < 6) {
      let randomNumber = Math.floor(Math.random() * 33) + 1;
      if (!redNumbers.includes(randomNumber)) {
        redNumbers.push(randomNumber);
      }
    }
    redNumbers.sort((a, b) => a - b);
    let blueNumber = Math.floor(Math.random() * 16) + 1;
    let lottoNumberString = redNumbers.join(",") + " - " + blueNumber;
    lottoNumbers.push(lottoNumberString);
  }
  lotteryArrs = lottoNumbers;
  return lottoNumbers.join("\n");
}

function excludeNumbers() {
  let redBalls = Array.from({ length: 33 }, (_, index) => index + 1);
  let blueBalls = Array.from({ length: 16 }, (_, index) => index + 1);
  if (lotteryArrs?.length) {
    for (let i = 0; i < lotteryArrs.length; i++) {
      const lotteryArr = lotteryArrs[i];
      const balls = lotteryArr.split("-");
      let reds = balls[0];
      reds = reds.split(",");
      const blues = balls[1];
      for (let j = 0; j < reds.length; j++) {
        const red = reds[j];
        if (redBalls.length > 6) {
          redBalls = redBalls.filter((num) => num != red);
        }
      }
      if (blueBalls.length > 1) {
        blueBalls = blueBalls.filter((num) => num != blues);
      }
    }
    const code = redBalls + " - " + blueBalls;
    console.log("output.value", output.value);
    output.value = (output.value + "\n" + code).trim();
    lock = false;
    num++;
    numDom.textContent = num;
  }
}

// function getRandomNumberFromArray(arr) {
//   const randomIndex = Math.floor(Math.random() * arr.length);
//   return arr[randomIndex];
// }
