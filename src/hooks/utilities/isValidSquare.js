export default function isValidSquare(square) {
  if (
    square.length === 2 &&
    square[0] >= "a" &&
    square[0] <= "h" &&
    square[1] >= "1" &&
    square[1] <= "8"
  )
    return true;
  return false;
}
