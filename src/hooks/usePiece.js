export function spawn(t) {
  var type, color;
  color = t === t.toUpperCase() ? "white" : "black";
  switch (t.toUpperCase()) {
    case "P":
      type = "pawn";
      break;
    case "K":
      type = "king";
      break;
    case "Q":
      type = "queen";
      break;
    case "N":
      type = "knight";
      break;
    case "B":
      type = "bishop";
      break;
    case "R":
      type = "rook";
      break;
  }

  return { type, color };
}

export function move(board, origin, destination) {
  board[destination] = board[origin];
  delete board[origin];
  return { ...board };
}

export function remove(board, position) {
  delete board[position];
  return { ...board };
}
