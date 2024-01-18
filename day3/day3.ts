import { concat, filter, filtermap, flat, flatmap, map, pairwise, pipe, sum, take, toarray } from 'powerseq';
const fs = require('fs');

interface PartNumber {
  number: number;
  row: number;
  column: number;
}

function matchDigitsAndNotDigits(line: string): string[] {
  return line.match(/[^0-9]+|[0-9]+/g) || [];
}

function matchDigits(line: string) {
  return /^\d+$/.test(line);
}

function mapDigitsAndNotDigits(value: string): (number | string)[] {
  return matchDigits(value) ? Array(value.length).fill(parseInt(value, 10)) : [...value.split('')];
}

function parseInput(inputString: string): (number | string)[][] {
  return pipe(
    inputString.trim().split('\n'),
    map((row: string) => matchDigitsAndNotDigits(row).flatMap(mapDigitsAndNotDigits)),
    toarray()
  );
}

function isInsideMatrix(r: number, c: number, grid: any[][]): boolean {
  return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length;
}

function removeNumbrResultDuplicates(partNumbers: PartNumber[]): PartNumber[] {
  return pipe(
    concat(take(partNumbers, 1), partNumbers),
    pairwise(),
    filter(
      ([first, second]) =>
        first === second ||
        first.row !== second.row ||
        first.number !== second.number ||
        second.column - first.column > 1
    ),
    map(([_, second]) => second),
    toarray()
  );
}

//prettier-ignore
const ADJACENT_NEIGHBOURS_M = [ [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

//1.
function isPartNumber(grid: (number | string)[][], row: number, col: number) {
  return ADJACENT_NEIGHBOURS_M.some(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;

    if (!isInsideMatrix(newRow, newCol, grid)) return false;

    const value = grid[newRow][newCol];
    return typeof value !== 'number' && value !== '.';
  });
}

function getPartNumbersInRow(rowIndex, grid): PartNumber[] {
  return pipe(
    grid[rowIndex],
    filtermap((cell, colIndex) =>
      typeof cell === 'number' && isPartNumber(grid, rowIndex, colIndex)
        ? { number: cell, row: rowIndex, column: colIndex }
        : null
    ),
    toarray()
  );
}

function part1(grid: (number | string)[][]) {
  return pipe(
    grid,
    map((r, i) => getPartNumbersInRow(i, grid)),
    flatmap(r => removeNumbrResultDuplicates(r)),
    sum(n => n.number)
  );
}

//2.
function getNumberNeighbours(grid: (number | string)[][], row: number, col: number): PartNumber[] {
  return pipe(
    ADJACENT_NEIGHBOURS_M,
    filtermap(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      if (!isInsideMatrix(newRow, newCol, grid)) return null;
      const value = grid[newRow][newCol];
      return typeof value === 'number' ? { number: value, row: newRow, column: newCol } : null;
    }),
    flat(),
    toarray()
  );
}

function getRowNeighboursSum(grid, index) {
  return pipe(
    grid[index],
    filtermap((col, colIndex) => (col === '*' ? getNumberNeighbours(grid, index, colIndex) : null)),
    map(r => removeNumbrResultDuplicates(r)),
    sum(n => (n.length === 2 ? n[0].number * n[1].number : 0))
  );
}

function part2(grid: (number | string)[][]) {
  return pipe(
    grid,
    map((r, i) => getRowNeighboursSum(grid, i)),
    sum()
  );
}

const input = parseInput(fs.readFileSync('./day3/input.txt', 'utf-8'));
console.log(part1(input));
console.log(part2(input));
