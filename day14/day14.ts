import fs from "fs";
import { count, filter, map, pipe, range, sum, toarray } from "powerseq";

const input = fs.readFileSync("./day14/input.txt", "utf8");
type Direction = "up" | "down" | "left" | "right";

function parseInput(input) {
  return input.split("\n").map((l) => l.trim().split(""));
}

function canMove(matrix: string[][], i, j, dir: Direction) {
  switch (dir) {
    case "down":
      return i < matrix.length - 1 && matrix[i + 1][j] === ".";
    case "up":
      return i > 0 && matrix[i - 1][j] === ".";
    case "left":
      return j > 0 && matrix[i][j - 1] === ".";
    case "right":
      return j < matrix[0].length - 1 && matrix[i][j + 1] === ".";
  }
}

function move(matrix: string[][], i, j, dir: Direction) {
  switch (dir) {
    case "down":
      matrix[i][j] = ".";
      matrix[i + 1][j] = "O";
      return;
    case "up":
      matrix[i][j] = ".";
      matrix[i - 1][j] = "O";
      return;
    case "left":
      matrix[i][j] = ".";
      matrix[i][j - 1] = "O";
      return;
    case "right":
      matrix[i][j] = ".";
      matrix[i][j + 1] = "O";
      return;
  }
}

function performRockMove(matrix, i, j, dir: Direction) {
  while (canMove(matrix, i, j, dir)) {
    move(matrix, i, j, dir);
    switch (dir) {
      case "up":
        i -= 1;
        break;
      case "down":
        i += 1;
        break;
      case "left":
        j -= 1;
        break;
      case "right":
        j += 1;
        break;
    }
  }
}

function findRockPositions(matrix) {
  return matrix.flatMap((row, i) =>
    pipe(
      row,
      map((cell, j) => ({ cell, i, j })),
      filter(({ cell }) => cell === "O"),
      toarray()
    )
  );
}

function moveAllRocks(matrix, dir: Direction) {
  let rocksToMove = findRockPositions(matrix);
  while (rocksToMove.length > 0) {
    // const rocks = findRockPositions(matrix);
    rocksToMove.forEach((r) => {
      performRockMove(matrix, r.i, r.j, dir);
    });
    rocksToMove = findRockPositions(matrix).filter((r) =>
      canMove(matrix, r.i, r.j, dir)
    );
  }
}

function countRocksInRow(i, matrix) {
  return pipe(
    matrix[i],
    count((c) => c === "O")
  );
}

function countTotalLoad(matrix) {
  return pipe(
    range(0, matrix.length),
    sum((i) => (matrix.length - i) * countRocksInRow(i, matrix))
  );
}

function matrixToString(matrix: string[][]) {
  return matrix.map((m) => m.join("")).join("\n");
}

function part1(matrix) {
  moveAllRocks(matrix, "up");
  return countTotalLoad(matrix);
}

function part2(matrix) {
  const cycles = 1000000000;
  let cycleStateIndex = -1;
  let index = 0;
  const states = [matrixToString(matrix)];
  while (cycleStateIndex === -1) {
    index += 1;
    moveAllRocks(matrix, "up");
    moveAllRocks(matrix, "left");
    moveAllRocks(matrix, "down");
    moveAllRocks(matrix, "right");
    const newState = matrixToString(matrix);
    cycleStateIndex = states.findIndex((s) => s === newState);
    if (cycleStateIndex === -1) states.push(newState);
  }

  const cycleLength = index - cycleStateIndex;
  const indexToCheck =
    cycleStateIndex + ((cycles - cycleStateIndex) % cycleLength);
  return countTotalLoad(parseInput(states[indexToCheck]));
}

const matrix = parseInput(input);
console.log(part1(JSON.parse(JSON.stringify(matrix))));
console.log(part2(JSON.parse(JSON.stringify(matrix))));
