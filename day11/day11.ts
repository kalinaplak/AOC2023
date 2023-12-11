import { filter, flatmap, map, pipe, sum, toarray } from "powerseq";
const fs = require("fs");

const input = fs.readFileSync("./day11/input.txt", "utf-8");

function parseInput(input: string) {
  return input.split("\n").map((line) => line.split(""));
}

function transpose(universe: string[][]): string[][] {
  return universe[0].map((_, columnIndex) => universe.map(row => row[columnIndex]));
}

function expandDimension(universe: string[][]): string[][]{
  return pipe(
    universe,
    flatmap(row=> row.every(c => c === '.') ? [[...row], [...row]] : [row]),
    toarray()
  );
}

function expandUniverse(universe: string[][]): string[][]{
  const expandedRows = expandDimension(universe)
  const transposed = transpose(expandedRows);
  const expandedRowsAndCols = expandDimension(transposed);
  return transpose(expandedRowsAndCols);
}

function getGalaxiesPoints(universe: string[][]){
  return pipe(
    universe,
    flatmap((row, i) => row.map((col, j) => (col === "#" ? [i, j] : null))),
    filter(g => g !== null),
    toarray()
  );
}

//1.
function calculateDistancesSum(universe: string[][]){
  const expandedMap = expandUniverse(universe);
  const galaxiesPoints = getGalaxiesPoints(expandedMap);  
  return pipe(
    galaxiesPoints,
    flatmap((x, i) => galaxiesPoints.slice(i + 1).map(y => [x, y])), //pairs
    map(([[p1x, p1y],[p2x, p2y]])=> Math.abs(p1x - p2x) + Math.abs(p1y - p2y)),
    sum()
  )
}

const universeMap = parseInput(input);
console.log(calculateDistancesSum(universeMap));


