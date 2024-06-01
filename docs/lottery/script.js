const random = document.querySelector("#random");
const exclude = document.querySelector("#exclude");
const random10 = document.querySelector("#random10");
const output = document.querySelector("#output");
const numDom = document.querySelector("#num");
const create = document.querySelector("#create");

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

create.onclick = () => {
  const outputVal = output.value;
  console.log("outputVal", outputVal);
  let outputValArr = outputVal.split("\n");

  outputValArr = outputValArr.map((item) => {
    const s1 = item.split("-");
    const s2 = s1[0].split(",");
    s2.push(s1[1]);
    return s2;
  });
  console.log("outputValArr", outputValArr);
  createCanvas(outputValArr);
};

const createCanvas = (arr) => {
  var canvas = document.createElement("canvas");
  canvas.width = 410;
  canvas.height = 290;
  var ctx = canvas.getContext("2d");
  var values = arr;
  var rows = values.length;
  var cols = values[0].length;
  var cellWidth = 50;
  var cellHeight = 50;
  var rowSpacing = 10; // 每一行之间的间距
  var redBallSpacing = 10; // 红球之间的间距
  var blueBallSpacing = 20; // 最后一个蓝球离红球的间距

  for (var i = 0; i < rows; i++) {
    var xOffset = 0; // 每行的起始偏移量
    for (var j = 0; j < cols; j++) {
      var value = values[i][j];
      var x = j * (cellWidth + redBallSpacing) + xOffset;
      var y = i * (cellHeight + rowSpacing); // 根据间距调整y坐标
      ctx.beginPath();
      ctx.arc(
        x + cellWidth / 2,
        y + cellHeight / 2,
        Math.min(cellWidth, cellHeight) / 2,
        0,
        2 * Math.PI
      );
      if (j === cols - 1) {
        ctx.fillStyle = "rgb(71, 136, 244)"; // 蓝色球
        xOffset += blueBallSpacing; // 更新偏移量以留出蓝色球的间距
      } else {
        ctx.fillStyle = "rgb(250, 78, 78)"; // 红色球
        xOffset = 0; // 重置偏移量
      }
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "18px hack";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      value = value.trim();
      value = value < 10 ? "0" + value : value;
      ctx.fillText(value.toString(), x + cellWidth / 2, y + cellHeight / 2 + 2);
    }
  }
  var dataURL = canvas.toDataURL("image/png");
  var link = document.createElement("a");
  link.href = dataURL;
  link.download = "canvas_image.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function convertArray(arr) {
  var result = "";
  for (var i = 0; i < arr.length; i++) {
    var row = arr[i];
    var rowString = row.slice(0, row.length - 1).join(", ");
    result += rowString + " - " + row[row.length - 1] + "\n";
  }
  return result.trim();
}

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
