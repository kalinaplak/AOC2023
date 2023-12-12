import { find, flatmap, pipe } from "powerseq";

const fs = require("fs");

const input = fs.readFileSync("./day10/input.txt", "utf-8");
type NodeType = '|' | '-' | 'L' | 'J' | '7' | 'F';

const nodeMap: {[key in NodeType]: {next: number[], prev: number[]}} = {
  '|': { next: [1,0],    prev: [-1, 0]},
  '-': { next: [0,1],    prev: [0, -1]},
  'L': { next: [0,1],   prev: [-1, 0]},
  'J': { next: [-1, 0],  prev: [0,-1]},
  '7': { next: [1, 0],  prev: [0,-1]},
  'F': { next: [0, 1],   prev: [1, 0]},
}

function parseInput(input: string) {
  return input.split("\n").map((line) => line.split(""));
}

function isInsideMap(x,y, map: string[][]){
  return x >= 0 && x < map.length && y >= 0 && y < map[0].length;
}

function move(map: string[][], {value, row, col}, direction: 'next' | 'prev'){
  if(nodeMap[value]){
    const [mRow, mCol] = nodeMap[value][direction];
    const [newRow, newCol] = [row + mRow, col + mCol];
    if(isInsideMap(newRow, newCol, map))
      return { value: map[newRow][newCol], row: newRow, col: col + mCol}
  } 
  return null;
}

//1.
function calculatePathLength(map: string[][]){
  const startingPos = pipe(
    map,
    flatmap((row, rowIndex) => row.map((value, col) => ({ value, row: rowIndex, col }))),
    find(r => move(map, r, 'prev')?.value === 'S')
  );
  const visited = [startingPos];
  let current = startingPos;
  while(current.value !== 'S'){
    let node = move(map, current, 'next');
    //change direction to prevent infinite loop
    if(visited.find(n=> n.row === node.row && n.col === node.col)){
      node = move(map, current, 'prev');
    }
    visited.push(node);
    current = node;
  }

  return visited.length / 2;
}

console.log(calculatePathLength(parseInput(input)));
