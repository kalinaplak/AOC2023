import { map, pipe, toarray, reverse, sum, pairwise } from 'powerseq';

const fs = require('fs');

const input = fs.readFileSync('./day9/input.txt', 'utf-8');

function parseInput(input: string) {
  return input.split('\n').map(line => line.split(' ').map(Number));
}

function processLineRec(line: number[], acc: number[][] = []) {
  if (acc.length === 0) acc = [line];
  if (line.every(i => i === 0)) return acc;
  const newLine = pipe(
    pairwise(line),
    map(([prev, curr]) => curr - prev),
    toarray()
  );
  return processLineRec(newLine, [...acc, newLine]);
}

function extrapolateNextValueInLine(line: number[]) {
  return pipe(
    processLineRec(line),
    reverse(),
    sum((numbers: number[]) => numbers[numbers.length - 1])
  );
}

//1.
function part1(lines: number[][]) {
  return sum(lines, extrapolateNextValueInLine);
}

//2.
function part2(lines: number[][]) {
  return part1(lines.map(l => l.reverse()));
}

const lines = parseInput(input);
console.log(part1(lines));
console.log(part2(lines));
