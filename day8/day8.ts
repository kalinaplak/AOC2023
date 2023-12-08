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

function processInstructions({instructions, directionMap}, startLocation) {
  const endCondition = "ZZZ";
  let currentLocation = startLocation;
  let steps = 0;

  while (currentLocation !== endCondition) {
    const instructionIndex = steps % instructions.length;
    currentLocation = directionMap[currentLocation][instructions[instructionIndex]];
    steps++;
  }

  return steps;
}

console.log(processInstructions(parseInput(input), "AAA"));
