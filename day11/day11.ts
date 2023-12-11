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

console.log(calculateDistancesSum(parseInput(input)));

//2. 
function getIndexesToExpand(universe: string[][]){
  return  pipe(
    universe,
    map((row, index) => ({ row, index })),
    filter(({ row }) => row.every(item => item === '.')),
    map(({ index }) => index),
    toarray()
  );
}

function calculateDistancesWithExpandLevel(universe: string[][], expandLevel = 1000000){
  const expandRows =getIndexesToExpand(universe);
  const expandColumns = getIndexesToExpand(transpose(universe));
  const galaxiesPoints = getGalaxiesPoints(universe);
  const expandRatio = expandLevel -1;
  return pipe(
    galaxiesPoints,
    flatmap((x, i) => galaxiesPoints.slice(i + 1).map(y => [x, y])), //pairs
    map(([[p1x, p1y],[p2x, p2y]])=> {
      const distance = Math.abs(p1x - p2x) + Math.abs(p1y - p2y);
      const expandedRowsInRange = expandRows.filter(x => (p1x < x && x < p2x) || (p2x < x && x < p1x)).length * expandRatio;
      const expandedColsInRange = expandColumns.filter(y => (p1y < y && y < p2y) || (p2y < y && y < p1y)).length * expandRatio;
      return distance + expandedRowsInRange + expandedColsInRange;
    }),
    sum()
  )
}

console.log(calculateDistancesWithExpandLevel(parseInput(input), 1000000));

