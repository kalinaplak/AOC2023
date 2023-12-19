import { map, pipe, sum } from "powerseq";

const fs = require("fs");

const input = fs.readFileSync("./day15/input.txt", "utf-8");

function parseInput(input: string) {
  return input.split(",").map(s => s.split(''));
}

function processLine(line: string[]){
  return line.reduce((acc,curr)=>((acc + curr.charCodeAt(0)) * 17) % 256, 0)
}

function part1(input:string[][]){
  return pipe(
    input,
    map(l => processLine(l)),
    sum()
  )
}

const lines = parseInput(input);
console.log(part1(lines));