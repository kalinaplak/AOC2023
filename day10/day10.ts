import { find, flatmap, pipe, sum } from 'powerseq';

const fs = require('fs');

const input = fs.readFileSync('./day10/input.txt', 'utf-8');
type NodeType = '|' | '-' | 'L' | 'J' | '7' | 'F' | 'S';
type Direction = 'next' | 'prev';
type DirectionMap = { [key in Direction]: number[] };
interface NodeElement {
  value: NodeType;
  row: number;
  col: number;
}

//prettier-ignore
const nodeToDirMap: {[key in NodeType]?: DirectionMap} = {
  '|': { next: [1,0],    prev: [-1, 0]},
  '-': { next: [0,1],    prev: [0, -1]},
  'L': { next: [0,1],    prev: [-1, 0]},
  'J': { next: [-1, 0],  prev: [0,-1]},
  '7': { next: [1, 0],   prev: [0,-1]},
  'F': { next: [0, 1],   prev: [1, 0]},
}

function parseInput(input: string): NodeType[][] {
  return input.split('\n').map(line => line.split('')) as NodeType[][];
}

function isInsideMap(x, y, map: string[][]) {
  return x >= 0 && x < map.length && y >= 0 && y < map[0].length;
}

function getNextNodeElement(map: NodeType[][], node: NodeElement, direction: Direction): NodeElement {
  const { value, row, col } = node;
  if (nodeToDirMap[value]) {
    const [moveR, moveC] = nodeToDirMap[value][direction];
    const [newRow, newCol] = [row + moveR, col + moveC];
    if (isInsideMap(newRow, newCol, map)) return { value: map[newRow][newCol], row: newRow, col: newCol };
  }
  return null;
}

function getFirstNodeAfterStart(map: NodeType[][]): NodeElement {
  return pipe(
    map,
    flatmap((row, rowIndex) => row.map((value, col) => ({ value, row: rowIndex, col }))),
    find(node => getNextNodeElement(map, node, 'prev')?.value === 'S')
  );
}

function getFullPathFromStartingNode(map: NodeType[][]) {
  const startingPos = getFirstNodeAfterStart(map);
  const visited = [startingPos];

  let current = startingPos;
  let direction: Direction = 'next';
  while (current.value !== 'S') {
    let node = getNextNodeElement(map, current, direction);
    //change direction to prevent infinite loop
    if (visited.find(n => n.row === node.row && n.col === node.col)) {
      direction = direction === 'next' ? 'prev' : 'next';
      node = getNextNodeElement(map, current, direction);
    }
    visited.push(node);
    current = node;
  }

  return visited;
}

//1.
function part1(map: NodeType[][]) {
  return getFullPathFromStartingNode(map).length / 2;
}

//2.
function part2(pipesMap: NodeType[][]) {
  const path = getFullPathFromStartingNode(pipesMap);
  return pipe(
    pipesMap,
    flatmap((nodeRow, i) => {
      let isInsideLoop = false;
      return nodeRow.map((nodeValue, j) => {
        const nodeInPath = path.find(p => p.row === i && p.col === j);
        if (nodeInPath) {
          const isSNodeWithAdjacentVertical = nodeInPath.value === 'S' && ['|', 'L', 'J'].includes(pipesMap[i + 1][j]);
          const isVerticalNode = ['|', 'F', '7'].includes(nodeValue);
          if (isSNodeWithAdjacentVertical || isVerticalNode) isInsideLoop = !isInsideLoop;
        } else if (isInsideLoop) {
          return 1;
        }
        return 0;
      });
    }),
    sum()
  );
}

const pipesMap = parseInput(input);
console.log(part1(pipesMap));
console.log(part2(pipesMap));
