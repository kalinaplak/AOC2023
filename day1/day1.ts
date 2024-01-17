const fs = require('fs');
import { pipe, map, sum } from 'powerseq';

function getCalibrationNumber(stringNumbers: string[]): number{
  const first = stringNumbers[0];
  const last = stringNumbers[stringNumbers.length - 1];
  return parseInt(first + last);
}

function calculateCalibrationSum(input: string[], mapFn: (line: string)=> number){
  return pipe(input, map(mapFn), sum());
}

const lines = fs.readFileSync('./day1/input.txt', "utf-8").split('\n');

//1.
function calculateCalibrationSum1(lines: string[]): number {
  return calculateCalibrationSum(
    lines, 
    line => getCalibrationNumber(line.match(/\d/g))
  );
}

const result1 = calculateCalibrationSum1(lines);
console.log(result1);

//2.
function calculateCalibrationSum2(lines: string[]){
  const wordDict = { one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9'};
  return calculateCalibrationSum(
    lines,
    line => {
      const digits = [...line.matchAll(/(?=(one|two|three|four|five|six|seven|eight|nine|\d))/g)]
        .map(([_, group]) => wordDict[group] ?? group);
      return getCalibrationNumber(digits);
    }
  );
}

const result2 = calculateCalibrationSum2(lines);
console.log(result2);

