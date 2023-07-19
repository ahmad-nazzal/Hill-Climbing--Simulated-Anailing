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
  center.appendChild(ChessTable);
  ChessTable.setAttribute("cellspacing", "0");
  document.getElementById("container").innerHTML = "";
  document.getElementById("container").appendChild(center);
}
createChessBoard(4);
document.getElementById("N-Queens").addEventListener("input", (event) => {
  let n = document.getElementById("N-Queens").value;
  createChessBoard(n);
});

function reset() {
  let nQueens = document.getElementById("N-Queens").value;
  for (let i = 0; i < nQueens; i++) {
    let random = Math.floor(Math.random() * nQueens) + 1;
    console.log(random);
  }
  console.log("22");
}
