import { count, filter, filtermap, map, pipe, range, sum, toarray } from "powerseq";

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

function getMarchingCharactersInRow(row1: string[], row2: string[]){
  return pipe( row1, count((r1v, i)=> r1v === row2[i]));
}

function getNormalizedRows(matrix: string[][], col: number){
  const [row1, row2] = [matrix.slice(0,col), matrix.slice(col, matrix.length)];
  const p1 = row1.length > row2.length ? row1.slice(-row2.length) : row1;
  const p2 = (row2.length > row1.length ? row2.slice(0, row1.length) : row2).reverse();
  return [p1,p2];
}

function checkMirror(matrix: string[][], col: number, allowUnequal){
  const [r1,r2] = getNormalizedRows(matrix, col);

  if(!allowUnequal){
    return r1.every((r, i) => compareRows(r, r2[i]))
  } else{
    const comparedSum = pipe(r1.map((r, i) => getMarchingCharactersInRow(r, r2[i])), sum());
    const totalSum = pipe(r1, map(r => r.length), sum())
    //results with 1 error 
    return comparedSum === totalSum -1;
  }
}

function checkMatrix(matrix: string[][], allowUnequal){
  return pipe(
    range(0, matrix.length),
    filtermap(col => checkMirror(matrix, col, allowUnequal) ? col : null),
    sum()
  )
}

function checkMatrixes(matrixes: string[][][], allowUnequal = false){
  return pipe(
    matrixes,
    map(m => {
      const check = checkMatrix(m, allowUnequal);
      const transposed = check === 0;
      const transposedCheck = transposed ? checkMatrix(transpose(m), allowUnequal) : null;
      return {check: transposed ? transposedCheck : check, transposed, matrix: m}
    }),
    map((m:any) => m.transposed ? m.check : m.check * 100),
    sum()
  )
}

const matrixes = parseInput(input);
//1.
console.log(checkMatrixes(matrixes));
//2.
console.log(checkMatrixes(matrixes, true));