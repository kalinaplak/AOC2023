import fs from 'fs';
import { count, filter, map, pipe, range, sum, toarray } from 'powerseq';

const input = fs.readFileSync('./day14/input.txt', 'utf8');

function parseInput(input){
  return input.split("\n").map(l => l.trim().split('')) 
}

function canMoveUp(matrix, i, j) {
  return i > 0 && matrix[i - 1][j] === ".";
}

function moveUp(matrix, i, j) {
  matrix[i][j] = ".";
  matrix[i - 1][j] = "O";
}

function moveRock(matrix, i, j) {
  while (canMoveUp(matrix, i, j)) {
    moveUp(matrix, i, j);
    i -= 1;
  }
}

function findRockPositions(matrix) {
  return matrix.flatMap((row, i) => pipe(
    row,
    map((cell, j) => ({ cell, i, j })),
    filter(({ cell }) => cell === 'O'),
    toarray()
  ));
}

function moveAllRocks(matrix){
  const rocks = findRockPositions(matrix);
  rocks.forEach(r =>{
    moveRock(matrix, r.i, r.j);
  })
}

function countRocksInRow(i, matrix) {
  return pipe(
    matrix[i],
    count(c => c === 'O')
  )
}

function countTotalLoad(matrix) {
  return pipe(
    range(0, matrix.length),
    sum((i) => (matrix.length - i) * countRocksInRow(i, matrix))
  )
}

function part1(matrix){
  moveAllRocks(matrix);
  return countTotalLoad(matrix);
}

const matrix = parseInput(input);
console.log(part1(matrix));
