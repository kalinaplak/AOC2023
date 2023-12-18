import { filter, map, pipe, range, sum, toarray } from "powerseq";

const fs = require("fs");

const input = fs.readFileSync("./day13/input.txt", "utf-8");

function parseInput(input: string) {
  return pipe(
    input.split("\n\n"),
    map((line) => line.split("\n").map(l => l.split(''))),
    toarray()
  );
}

function transpose(matrix: string[][]): string[][] {
  return matrix[0].map((_, columnIndex) => matrix.map(row => row[columnIndex]));
}

function compareRows(row1: string[], row2: string[]){
  return row1.join('') === row2.join('');
}

function getNormalizedRows(matrix: string[][], col: number){
  const [row1, row2] = [matrix.slice(0,col), matrix.slice(col, matrix.length)];
  const p1 = row1.length > row2.length ? row1.slice(-row2.length) : row1;
  const p2 = (row2.length > row1.length ? row2.slice(0, row1.length) : row2).reverse();
  return [p1,p2];
}

function checkMirror(matrix: string[][], col: number){
  const [r1,r2] = getNormalizedRows(matrix, col);
  return r1.every((r, i) => compareRows(r, r2[i]))
}

function checkMatrix(matrix: string[][]){
  return pipe(
    range(0, matrix.length),
    map(col => checkMirror(matrix, col) ? col : null),
    filter (col => !!col),
    sum()
  )
}

function checkMatrixes(matrixes: string[][][]){
  return pipe(
    matrixes,
    map(m => {
      const check = checkMatrix(m);
      const transposed = check === 0;
      const transposedCheck = transposed ? checkMatrix(transpose(m)) : null;
      return transposed ? transposedCheck : check * 100;
    }),
    sum()
  )
}

const matrixes = parseInput(input);
console.log(checkMatrixes(matrixes));