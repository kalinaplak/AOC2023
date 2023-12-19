import { flatmap, map, pipe, range, sum, toarray } from "powerseq";

const fs = require("fs");

const input = fs.readFileSync("./day15/input.txt", "utf-8");

function parseInput(input: string) {
  return input.split(",").map(s => s.split(''));
}

function processLine(line: string[]){
  return line.reduce((acc,curr)=>((acc + curr.charCodeAt(0)) * 17) % 256, 0)
}

//1.
function part1(input:string[][]){
  return pipe(
    input,
    map(l => processLine(l)),
    sum()
  )
}

const lines = parseInput(input);
console.log(part1(lines));

//2.
function calculateBoxes(input: string[][]){
  const emptyBoxes = pipe(range(0, 255), map(r => new Map<string, number>()), toarray());

  return input.reduce((acc,curr)=>{
    if(curr[curr.length -1] === '-'){
      const toDelete = curr.slice(0, curr.length -1);
      acc[processLine(toDelete)].delete(toDelete.join(''));
    } else{
      const [line, focal] = curr.join('').split('=');
      const processed = processLine(line.split(''));
      
      if(!acc[processed]) acc[processed] = new Map<string, number>();
      acc[processed].set(line, parseInt(focal));
    }
    return acc;
  }, emptyBoxes);
}

function part2(input: string[][]){
  return pipe(
    calculateBoxes(input),
    flatmap((b, i) => pipe(
      Array.from(b.values()),
      map((focal, j) => (i + 1) * (j + 1) * focal),
      toarray()
    )),
    sum()
  );

}

console.log(part2(lines));
