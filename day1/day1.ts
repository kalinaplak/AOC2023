const fs = require('fs');
import { pipe, sum } from 'powerseq';

function parseInput(input: string) {
  return input.split('\n');
}

function getCalibrationNumber(stringNumbers: string[]): number {
  const first = stringNumbers[0];
  const last = stringNumbers[stringNumbers.length - 1];
  return parseInt(first + last);
}

//1.
function calculateCalibrationSum1(lines: string[]): number {
  return pipe(
    lines,
    sum(line => getCalibrationNumber(line.match(/\d/g)))
  );
}

//2.
function calculateCalibrationSum2(lines: string[]) {
  //prettier-ignore
  const wordDict = { one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9'};
  return pipe(
    lines,
    sum(line => {
      const lineWordNumbers = [...line.matchAll(/(?=(one|two|three|four|five|six|seven|eight|nine|\d))/g)];
      const digits = lineWordNumbers.map(([_, matched]) => wordDict[matched] ?? matched);
      return getCalibrationNumber(digits);
    })
  );
}

const lines = parseInput(fs.readFileSync('./day1/input.txt', 'utf-8'));
const result1 = calculateCalibrationSum1(lines);
console.log(result1);
const result2 = calculateCalibrationSum2(lines);
console.log(result2);
