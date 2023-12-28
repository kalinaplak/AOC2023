import { distinct, flatmap, map, max, pipe, range, toarray } from "powerseq";

const fs = require("fs");

const input = fs.readFileSync("./day16/input.txt", "utf-8");

function parseInput(input: string): SpaceType[][] {
  return <SpaceType[][]>input.split("\n").map((line) => line.split(""));
}

type Direction = 'top' | 'right' | 'bottom' | 'left';
type SpaceType = '.' | '\\' | '/' | '|' | '-';

const directions = {
  right: [0,1],
  left: [0,-1],
  top: [-1, 0],
  bottom: [1, 0]
}

function getNextDirection(dir: Direction, space: SpaceType): Direction[]{
  switch(space){
    case '.': return [dir];
    case '\\': return dir === 'bottom' ? ['right'] : dir === 'top' ? ['left'] : dir === 'right' ? ['bottom'] : ['top'];
    case '/': return dir === 'bottom' ? ['left']: dir === 'top' ? ['right'] : dir === 'right' ? ['top'] : ['bottom'];
    case '|': return dir === 'bottom' || dir === 'top' ? [dir] : ['top', 'bottom'];
    case '-': return dir === 'left' || dir === 'right' ? [dir] : ['left', 'right'];
    default: return null;
  }
}

function getNextPosition(dir: Direction, [i,j]){
  const [mi, mj]= directions[dir];
  return [i + mi, j + mj];
}

function isInsideMap(i,j, board: SpaceType[][]){
  return i >= 0 && i < board.length && j >= 0 && j < board[0].length;
}

function getVisitedFields(board: SpaceType[][], i: number, j: number, dir: Direction): Set<string> {
  const acc = new Set<string>();
  let stack: { i: number; j: number; dir: Direction }[] = [{ i, j, dir }];

  while (stack.length > 0) {
    const { i, j, dir } = stack.pop()!;
    if (isInsideMap(i, j, board) && !acc.has(`${dir}-${i},${j}`)) {
      acc.add(`${dir}-${i},${j}`);

      const nextCoordinates = pipe(
        getNextDirection(dir, board[i][j]),
        map(d => ({ next: getNextPosition(d, [i, j]), direction: d })),
        map(({ next: [ni, nj], direction }) => ({ i: ni, j: nj, dir: direction })),
        toarray()
      );

      stack = [...stack, ...nextCoordinates];
    }
  }

  return acc;
}

//1.
function part1(input: SpaceType[][], i = 0, j = 0, dir: Direction = 'right'){
  return pipe(
    [...getVisitedFields(input, i,j, dir)],
    map((s:any) =>  s.split('-')),
    distinct(s => s[1]),
    toarray()
  ).length
}

//2.
function part2(input: SpaceType[][]){
  const allPossibleStarts = [
    [...range(0, input[0].length - 1)].map(c => ({i: 0, j: c, dir: 'bottom'})),
    [...range(0, input[0].length - 1)].map(c => ({i: input.length - 1, j: c, dir: 'top'})),
    [...range(0, input.length - 1)].map(r => ({i: r, j: 0, dir: 'right'})),
    [...range(0, input.length - 1)].map(r => ({i: r, j: input[0].length -1, dir: 'left'})),
  ];
  
  return pipe(
    allPossibleStarts,
    flatmap(s => s, (i: any, s: any) =>  part1(input, s.i, s.j, s.dir as Direction)),
    max()
  )
}

const board: SpaceType[][] = parseInput(input);
console.log(part1(board));
console.log(part2(board));