import { Dictionary } from "powerseq/common/types";
const fs = require("fs");

type Direction = "R" | "L";
type Instruction = { L: string; R: string };

const input = fs.readFileSync("./day8/input.txt", "utf-8");

function parseInput(input: string) {
  const [line1, _, ...lines] = input.split("\n");
   const directionMap: Dictionary<Instruction> = lines.reduce((acc,l) => {
    acc[l.slice(0, 3)] = { L: l.slice(7, 10), R: l.slice(12, 15) };
    return acc;
  }, {});
  
  return { instructions: [...line1] as Direction[], directionMap };
}

//1.
function processInstructions({instructions, directionMap}, startLocation, endConditionFn: (loc) => boolean) {
  let currentLocation = startLocation;
  let steps = 0;
  while (!endConditionFn(currentLocation)) {
    const instructionIndex = steps % instructions.length;
    currentLocation = directionMap[currentLocation][instructions[instructionIndex]];
    steps++;
  }
  return steps;
}

console.log(processInstructions(parseInput(input), "AAA", l => l === "ZZZ"));

//2.
function findGreatestCommonDivisor(a: number, b: number): number {
  // Euclidean algorithm to find Greatest Common Divisor
  return b === 0 ? a : findGreatestCommonDivisor(b, a % b);
}

function getLeastCommonMultiple(a:number, b:number){
  const gcd = findGreatestCommonDivisor(a, b);
  return (a * b) / gcd;
}

function processGhostInstructions({ instructions, directionMap }) {
  const starts = Object.keys(directionMap).filter((id) => id[2] === "A");
  const lengths = starts.map((start) => processInstructions({instructions, directionMap}, start, l => l[2] === "Z"));
  return lengths.reduce((acc, curr) => getLeastCommonMultiple(curr, acc), 1);
}

console.log(processGhostInstructions(parseInput(input)));
