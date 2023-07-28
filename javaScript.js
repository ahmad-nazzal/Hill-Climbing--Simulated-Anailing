let speed = 1000;
let selected = "hill";
let settings = document.getElementById("settings");
let tcText = document.getElementById("tc");
function speedd() {
  speed = document.getElementById("speedRange").value;
  let queens = document.getElementsByClassName("queen");
  for (let index = 0; index < queens.length; index++) {
    queens[index].style.transition = "all " + speed / 1000 + "s";
  }
}
function createChessBoard(dimension) {
  if (dimension > 8) dimension = 8;
  else if (dimension < 4) dimension = 4;
  var center = document.createElement("div");

  var ChessTable = document.createElement("table");
  for (var i = 0; i < dimension; i++) {
    var tr = document.createElement("tr");
    for (var j = 0; j < dimension; j++) {
      var td = document.createElement("td");
      if ((i + j) % 2 == 0) {
        td.setAttribute("class", "cell whitecell");
      } else {
        td.setAttribute("class", "cell blackcell");
      }
      tr.appendChild(td);
    }

    ChessTable.appendChild(tr);
  }
  ChessTable.setAttribute("id", "chess");
  center.appendChild(ChessTable);
  ChessTable.setAttribute("cellspacing", "0");
  document.getElementById("container").innerHTML = "";
  document.getElementById("container").appendChild(center);
}

function reset() {
  let deletePrev = document.querySelectorAll(".queen");
  deletePrev.forEach((element) => {
    element.remove();
  });
  let locations = new Array();
  let nQueens = document.getElementById("N-Queens").value;
  for (let i = 0; i < nQueens; i++) {
    let queen = document.createElement("span");
    queen.setAttribute("class", "queen");
    queen.innerHTML = "&#9819;";
    let random = Math.floor(Math.random() * nQueens);
    let topp = 175;
    let leftt = 625;
    let locationRow = topp + 63.5 * random;
    let locationCol = leftt + 63.5 * i;
    // {col: ?, row:?}
    locations[i] = random;
    queen.style.position = "fixed";
    queen.style.top = locationRow + "px";
    queen.style.left = locationCol + "px";
    document.body.appendChild(queen);
  }
  speedd();
  start([...locations]);
}

//-n/2
function heuristic(locations) {
  let attacks = 0;

  for (let i = 0; i < locations.length; i++) {
    for (let j = 0; j < locations.length; j++) {
      if (
        i != j &&
        (locations[i] == locations[j] ||
          Math.abs(locations[i] - locations[j]) ==
            //col i - col j
            Math.abs(i - j))
      )
        attacks++;
    }
  }
  return (attacks / 2) * -1;
}

function start(locations) {
  if (selected == "sim") simulatedAnnealing([...locations]);
  else if (selected == "hill") hillClimbing([...locations]);
}
async function hillClimbing(locations) {
  let mainHeuristicLocations = [];
  let maxHeuristicChildren = -Infinity;
  locations.forEach((element) => {
    // mainHeuristicLocations.push(Object.assign({}, element));
    mainHeuristicLocations.push(element);
  });
  let closeList = new Set();
  let mainHeuristic = heuristic(locations);
  let duplicateMaxHueLocationsChildren = [];
  settings.innerHTML = "";
  while (true) {
    maxHeuristicChildren = -Infinity;
    settings.innerHTML +=
      "------------------------------------------------------------------ <br> <br>";

    console.log("----------------------------------------------");
    console.log(mainHeuristicLocations);
    for (let i = 0; i < locations.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        if (mainHeuristicLocations[i] != j) {
          let tempLocations = [];
          mainHeuristicLocations.forEach((element) => {
            tempLocations.push(element);
          });

          tempLocations[i] = j;
          let h = heuristic(tempLocations);

          //decode the locations to set
          let encrypt = "";
          for (let index = 0; index < tempLocations.length; index++) {
            encrypt += tempLocations[index];
          }

          if (!closeList.has(encrypt) && h >= maxHeuristicChildren) {
            closeList.add(encrypt);
            if (h > maxHeuristicChildren) {
              duplicateMaxHueLocationsChildren = [];
            }
            let arr = [];
            for (let index = 0; index < tempLocations.length; index++) {
              arr.push(tempLocations[index]);
            }
            duplicateMaxHueLocationsChildren.push(arr);
            maxHeuristicChildren = h;
          }
        }
      }
    }
    let randomChildIndex = Math.floor(
      Math.random() * duplicateMaxHueLocationsChildren.length
    );
    console.log(duplicateMaxHueLocationsChildren);
    console.log(mainHeuristic + " max parent");
    console.log(maxHeuristicChildren + " max children");
    console.log(duplicateMaxHueLocationsChildren[randomChildIndex]);
    console.log(
      "--------------------------------------------------------------------------"
    );
    settings.innerHTML +=
      "Parent Locations is: " +
      mainHeuristicLocations +
      " with heuristic: " +
      mainHeuristic +
      "  <br> <br>";
    settings.innerHTML +=
      "Location of Max Heuristic from children is: " +
      duplicateMaxHueLocationsChildren[randomChildIndex] +
      " with heuristic: " +
      maxHeuristicChildren +
      "  <br>";
    settings.innerHTML +=
      "<br>------------------------------------------------------------------ <br> <br>";
    if (maxHeuristicChildren >= mainHeuristic) {
      changeChess(
        mainHeuristicLocations,
        duplicateMaxHueLocationsChildren[randomChildIndex]
      );
      await sleep(speed);
    }
    if (maxHeuristicChildren < mainHeuristic || maxHeuristicChildren == 0) {
      if (maxHeuristicChildren == 0) alert("Success :)");
      else alert("Can't solved :(");
      return duplicateMaxHueLocationsChildren[randomChildIndex];
    } else {
      mainHeuristic = maxHeuristicChildren;

      mainHeuristicLocations = [];
      duplicateMaxHueLocationsChildren[randomChildIndex].forEach((element) => {
        mainHeuristicLocations.push(element);
      });
    }
  }
}

function cooling(i, T) {
  let selectedFunction = document.getElementById("functions");
  if (selectedFunction.value == 1) return T / Math.log(i);
  else if (selectedFunction.value == 2)
    return T / (1 + 100 * Math.log10(1 + i));
  else return T / (1 + 0.01 * i);
}
async function simulatedAnnealing(locations) {
  let maxTemp = document.getElementById("temp").value;

  let currentHeuristicLocations = [];
  locations.forEach((element) => {
    // mainHeuristicLocations.push(Object.assign({}, element));
    currentHeuristicLocations.push(element);
  });
  let currentHeuristic = heuristic([...locations]);
  let nextHeuristic;
  let nextHeuristicLocations;
  let bestHeuristic;
  let bestHeuristicLocations;
  bestHeuristic = currentHeuristic;
  bestHeuristicLocations = [...currentHeuristicLocations];

  let lastMoveLocations = [...currentHeuristicLocations];

  let allSuccessor = [];
  let i = 2;
  let visitedLocations = new Set();
  settings.innerHTML = "";
  while (true) {
    allSuccessor = [];
    let len = document.getElementById("N-Queens").value;

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        if (currentHeuristicLocations[i] != j) {
          let tempLocations = [];
          currentHeuristicLocations.forEach((element) => {
            tempLocations.push(element);
          });
          tempLocations[i] = j;
          let arr = [];
          for (let index = 0; index < tempLocations.length; index++) {
            arr.push(tempLocations[index]);
          }
          allSuccessor.push(arr);
        }
      }
    }

    let randomChildIndex = Math.floor(Math.random() * allSuccessor.length);
    let encrypt = "";
    for (
      let index = 0;
      index < allSuccessor[randomChildIndex].length;
      index++
    ) {
      encrypt += allSuccessor[randomChildIndex][index];
    }
    if (visitedLocations.has(encrypt)) continue;
    visitedLocations.add(encrypt);
    nextHeuristicLocations = [...allSuccessor[randomChildIndex]];
    nextHeuristic = heuristic([...nextHeuristicLocations]);
    let deltaE = nextHeuristic - currentHeuristic;
    let tc = cooling(i++, maxTemp);
    console.log("----------------------------------------------");
    tcText.innerHTML = "Current Tempreture is: " + tc + "<br>";
    tcText.innerHTML += "Iteration " + i;

    console.log(currentHeuristicLocations);
    console.log(currentHeuristic + " parent");
    console.log(nextHeuristic + " random child");
    console.log(allSuccessor[randomChildIndex]);
    console.log(
      "--------------------------------------------------------------------------"
    );

    if (deltaE > 0) {
      currentHeuristic = nextHeuristic;
      currentHeuristicLocations = [...nextHeuristicLocations];
      if (bestHeuristic < currentHeuristic) {
        bestHeuristic = currentHeuristic;
        bestHeuristicLocations = [...currentHeuristicLocations];
        changeChess(lastMoveLocations, bestHeuristicLocations);
        await sleep(speed);
        lastMoveLocations = [...bestHeuristicLocations];
        settings.innerHTML +=
          "------------------------------------------------------------------ <br> <br>";
        settings.innerHTML +=
          "Best Location is " + bestHeuristicLocations + "<br>";
        settings.innerHTML += "with hueristic: " + bestHeuristic + "<br>";
        settings.innerHTML +=
          "<br>------------------------------------------------------------------ <br> <br>";
        console.log("best " + bestHeuristic);
        console.log(bestHeuristicLocations);
        if (bestHeuristic == 0) {
          console.log("The goal is found: " + bestHeuristic);
          alert("Success :)");
          break;
        }
      }
    } else if (Math.pow(Math.E, -deltaE / tc)) {
      currentHeuristic = nextHeuristic;
      currentHeuristicLocations = [...nextHeuristicLocations];
    }

    if (tc <= 2) {
      settings.innerHTML += "Last best heuristic is: " + bestHeuristic + "<br>";
      settings.innerHTML += "wit location: " + bestHeuristicLocationsc + "<br>";
      console.log("last best " + bestHeuristic);
      alert(":( The best goal found is: " + bestHeuristic);
      break;
    }
  }
}
function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
function changeChess(previousLocations, nextLocations) {
  let queens = document.getElementsByClassName("queen");
  for (let i = 0; i < previousLocations.length; i++) {
    let movment = -63.5 * (previousLocations[i] - nextLocations[i]);
    let tt = queens[i].offsetTop;
    movment += tt;
    queens[i].style.top = movment + "px";
  }
}

createChessBoard(4);
document.getElementById("N-Queens").addEventListener("input", (event) => {
  let deletePrev = document.querySelectorAll(".queen");
  deletePrev.forEach((element) => {
    element.remove();
  });
  let n = document.getElementById("N-Queens").value;
  createChessBoard(n);
});

const radioButtons = document.querySelectorAll('input[name="algos"]');
for (let index = 0; index < radioButtons.length; index++) {
  radioButtons[index].addEventListener("change", () => {
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        selected = radioButton.value;
        break;
      }
    }
    // show the output:
    if (selected == "hill") {
      document.getElementById("temp-container").style.display = "none";
    } else if (selected == "sim") {
      document.getElementById("temp-container").style.display = "flex";
    }
    tcText.innerHTML = "";
    settings.innerHTML = "`";
  });
}
