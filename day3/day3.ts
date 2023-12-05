import { filter, map, pipe, sum, toarray } from "powerseq";

const fs = require('fs');
const input = fs.readFileSync('./day3/input.txt', "utf-8");

function parseInput(inputString: string): (number | string)[][] {
  const rows: string[] = inputString.trim().split('\n');
  return rows.map((row: string): (number | string)[] => {
    //not digits and digits
    const elements: string[] = row.match(/[^0-9]+|[0-9]+/g) || [];
    return elements.flatMap(element =>
      <any>(/^\d+$/.test(element) ? Array(element.length).fill(parseInt(element, 10)) : [...element.split('')])
    );
  });
}

function isInsideMatrix(r: number, c: number, grid: any[][]): boolean {
  const rows = grid.length;
  const cols = grid[0].length;
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

const ADJACENT_NEIGHBOURS_M = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function removeNumbrResultDuplicates(partNumbers: any[]) {
  return pipe(
    partNumbers,
    filter((num, index) => (
      index === 0 ||
      partNumbers[index - 1].row !== num.row ||
      partNumbers[index - 1].number !== num.number ||
      num.column - partNumbers[index - 1].column > 1
    )),
    toarray()
  )
}

//1.
function isPartNumber(grid: (number | string)[][], row: number, col: number) {
  return ADJACENT_NEIGHBOURS_M.some(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;

    if(!isInsideMatrix(newRow, newCol, grid)) return false;

    const value = grid[newRow][newCol];
    return typeof value !== 'number' && value !== '.';
  });
}

function getAdjacentNumbersSum(grid: (number | string)[][]) {
  const partNumbers = removeNumbrResultDuplicates(
    grid.flatMap((row, rowIndex) =>
      pipe(
        row,
        map((cell, colIndex)=> {
          return typeof cell === 'number' && isPartNumber(grid, rowIndex, colIndex) 
          ? { number: cell, row: rowIndex, column: colIndex } 
          : null
        }),
        filter(v => !!v),
        toarray()
      ),
    )
  );
  return sum(partNumbers, n => n.number);
}

console.log(getAdjacentNumbersSum(parseInput(input)));

//2.
function getNumberNeighbours(grid: (number | string)[][], row: number, col: number) {
  return ADJACENT_NEIGHBOURS_M.reduce((acc, [dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;

    if(!isInsideMatrix(newRow, newCol, grid)) return acc;

    const value = grid[newRow][newCol];
    if(typeof value === 'number')
      acc.push({number: value, row: newRow, column: newCol});
    return acc;
  }, [] as any[]);
}

function getGearNumbersMultiply(grid: (number | string)[][]) {
  return sum(grid.flatMap((row, rowIndex) => 
    pipe(
      row,
      map((col, colIndex)=> {
        if(col !== '*') return [];
        return removeNumbrResultDuplicates(getNumberNeighbours(grid, rowIndex, colIndex));
      }),
      filter(n => n.length === 2),
      map(([first,second]) => first.number * second.number),
      sum()
    )
  ))
}

console.log(getGearNumbersMultiply(parseInput(input)))

