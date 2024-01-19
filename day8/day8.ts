import { filter, map, pipe, reduce, toobject } from 'powerseq';

const fs = require('fs');

type Direction = 'R' | 'L';
type Instruction = { L: string; R: string };

const input = fs.readFileSync('./day8/input.txt', 'utf-8');

function parseInput(input: string) {
  const [line1, _, ...lines] = input.split('\n');
  const regex = /\b[A-Z]{3}\b/g;
  const directionMap: { [K in Direction]?: Instruction } = pipe(
    lines,
    map(l => l.match(regex)),
    toobject(
      ([curr]) => curr,
      ([_, left, right]) => ({ L: left, R: right })
    )
  );

  return { instructions: [...line1] as Direction[], directionMap };
}

//1.
function processInstructions({ instructions, directionMap }, startLocation, ghostMode = false) {
  let currentLocation = startLocation;
  let steps = 0;
  while (!ghostMode ? currentLocation !== 'ZZZ' : currentLocation.slice(-1) !== 'Z') {
    const instructionIndex = steps % instructions.length;
    currentLocation = directionMap[currentLocation][instructions[instructionIndex]];
    steps++;
  }
  return steps;
}

function part1(input: string) {
  return processInstructions(parseInput(input), 'AAA');
}

//2.
function findGreatestCommonDivisor(a: number, b: number): number {
  // Euclidean algorithm to find Greatest Common Divisor
  return b === 0 ? a : findGreatestCommonDivisor(b, a % b);
}

function getLeastCommonMultiple(a: number, b: number) {
  const gcd = findGreatestCommonDivisor(a, b);
  return (a * b) / gcd;
}

function part2(input: string) {
  const { instructions, directionMap } = parseInput(input);
  return pipe(
    Object.keys(directionMap),
    filter(id => id[2] === 'A'),
    map(start => processInstructions({ instructions, directionMap }, start, true)),
    reduce((acc, curr) => getLeastCommonMultiple(curr, acc), 1)
  );
}

console.log(part1(input));
console.log(part2(input));
