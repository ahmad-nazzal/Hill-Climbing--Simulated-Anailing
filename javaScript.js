let speed = 1000;
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
createChessBoard(4);

document.getElementById("N-Queens").addEventListener("input", (event) => {
  let deletePrev = document.querySelectorAll(".queen");
  deletePrev.forEach((element) => {
    element.remove();
  });
  let n = document.getElementById("N-Queens").value;
  createChessBoard(n);
});

//+63.5
let topp = 182;
let leftt = 627;

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

async function start(locations) {
  let mainHeuristicLocations = [];
  let maxHeuristicChildren = -Infinity;
  locations.forEach((element) => {
    // mainHeuristicLocations.push(Object.assign({}, element));
    mainHeuristicLocations.push(element);
  });
  let closeList = new Set();
  let mainHeuristic = heuristic(locations);
  let duplicateHueLocations = [];
  //while infinte but we need to sure that it will not go to top then botom then top .......
  while (true) {
    maxHeuristicChildren = -Infinity;
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
              duplicateHueLocations = [];
            }
            let arr = [];
            for (let index = 0; index < tempLocations.length; index++) {
              arr.push(tempLocations[index]);
            }
            duplicateHueLocations.push(arr);

            // maxHeuristicLocations = [];
            // tempLocations.forEach((element) => {
            //   maxHeuristicLocations.push(element);
            // });
            maxHeuristicChildren = h;
          }
        }
      }
    }
    let randomChildIndex = Math.floor(
      Math.random() * duplicateHueLocations.length
    );
    console.log(duplicateHueLocations);
    console.log(mainHeuristic + " max parent");
    console.log(maxHeuristicChildren + " max children");
    console.log(duplicateHueLocations[randomChildIndex]);
    console.log(
      "--------------------------------------------------------------------------"
    );
    if (maxHeuristicChildren >= mainHeuristic) {
      changeChess(
        mainHeuristicLocations,
        duplicateHueLocations[randomChildIndex]
      );
      await sleep(speed);
    }
    if (maxHeuristicChildren < mainHeuristic || maxHeuristicChildren == 0) {
      return duplicateHueLocations[randomChildIndex];
    } else {
      mainHeuristic = maxHeuristicChildren;

      mainHeuristicLocations = [];
      duplicateHueLocations[randomChildIndex].forEach((element) => {
        mainHeuristicLocations.push(element);
      });
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
