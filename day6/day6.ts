import { filter, map, pipe, range, reduce, toarray } from 'powerseq';

const fs = require('fs');

interface Race {
  time: number;
  distance: number;
}

const input = fs.readFileSync('./day6/input.txt', 'utf-8');

function parseLine(line: string) {
  return line.trim().split(/\s+/).map(Number);
}

function parseInput(input: string): Race[] {
  const [times, distances] = input.split('\n').map(l => parseLine(l.split(':')[1]));
  return times.map((time, index) => ({
    time,
    distance: distances[index]
  }));
}

//1.
function calculateWinningValues(totalTime: number, distance: number): number {
  return pipe(
    range(0, totalTime),
    filter(x => totalTime * x - x * x > distance),
    toarray()
  ).length;
}

function part1(races: Race[]) {
  return pipe(
    races,
    map(r => calculateWinningValues(r.time, r.distance)),
    reduce((acc, curr) => acc * curr, 1)
  );
}

//2.
function parseInputToSingleRace(input: string): Race {
  const [time, distance] = input.split('\n').map(l => parseInt(l.split(':')[1].split(/\s+/).join('')));
  return { distance, time };
}

function part2(input: string) {
  return part1([parseInputToSingleRace(input)]);
}

console.log(part1(parseInput(input)));
console.log(part2(input));
