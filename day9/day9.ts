import { map, pipe, toarray, zip, reverse, reduce, sum } from "powerseq";

const fs = require("fs");

const input = fs.readFileSync("./day9/input.txt", "utf-8");

function parseInput(input: string) {
  return input.split("\n").map((line) => line.split(" ").map(n => parseInt(n)));
}

function processLineRec(line: number[], acc: number[][] = []){
  if(acc.length === 0) acc = [line];
  if(line.every(i => i ===0)) return acc;
  const [_, ...tail]= line;
  const newLine = pipe(zip(line, tail, (prev,next)=> next - prev), toarray());
  return processLineRec(newLine, [...acc, newLine]);
}

function extrapolateNextValueInLine(line: number[]){
  const result = pipe(
    processLineRec(line),
    reverse(),
    reduce((acc, curr: any)=>{ acc += curr[curr.length -1]; return acc; }, 0),
  );
  return result;
}

//1.
function sumExtrapolatedValues(lines: number[][]){
  return pipe(
    lines,
    map(extrapolateNextValueInLine),
    sum()
  );
}

const lines = parseInput(input);
console.log(sumExtrapolatedValues(lines));
