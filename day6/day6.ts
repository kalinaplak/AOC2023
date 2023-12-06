import { map, pipe, reduce, sum } from "powerseq";

const fs = require("fs");

interface Race {
  time: number;
  distance: number;
}
const input = fs.readFileSync("./day6/input.txt", "utf-8");

function parseLine(line: string) {
  return line
    .trim()
    .split(/\s+/)
    .map((n) => parseInt(n));
}

function parseInput(input: string): Race[] {
  const [times, distances] = input
    .split("\n")
    .map((l) => parseLine(l.split(":")[1]));

  const races: Race[] = times.map((time, index) => ({
    time,
    distance: distances[index],
  }));

  return races;
}

console.log(parseInput(input));

//1.
function calculateWinningValues(totalTime: number, distance: number): number[] {
  const possibleXValues: number[] = [];
  for (let x = 0; x < totalTime; x++) {
    const equationResult = totalTime * x - x * x;
    if (equationResult > distance) {
      possibleXValues.push(x);
    }
  }
  return possibleXValues;
}

function calculateResult(races: Race[]) {
  return pipe(
    races,
    map((r) => calculateWinningValues(r.time, r.distance).length),
    reduce((acc, curr) => {
      acc = acc * curr;
      return acc;
    }, 1)
  );
}

console.log(calculateResult(parseInput(input)));
