import { map, pipe, sum, toarray } from "powerseq";

const fs = require("fs");

const input = fs.readFileSync("./day12/input.txt", "utf-8");

interface SpringRow {
  springRow: string;
  damaged: number[];
}

function parseInput(input: string): SpringRow[] {
  return pipe(
    input.split("\n"),
    map((line) => line.split(" ")),
    map(([map, nums]) => ({
      springRow: map,
      damaged: nums.split(",").map((n) => parseInt(n)),
    })),
    toarray()
  );
}

const springRows = parseInput(input);

function getMapKey(springRow, damaged) {
  return [springRow, damaged.join(",")].join(" ");
}

function trimDots(springRow: string){
  return springRow.replace(/^\.+|\.+$/, '');
}

function getNextDamagedWithoutUnknownGroupLength(springRow: string){
  return springRow.match(/^#+(?=\.|$)/)?.[0]?.length || 0;
}

function replaceUnknownChar(char: '#' | '.', sr: string, damaged: number[]): SpringRow{
  return { springRow: sr.replace('?', char), damaged };
}

function countPossibleOptions({ springRow, damaged }: SpringRow, cache): number {
  springRow = trimDots(springRow);
  if (springRow === '') return damaged.length ? 0 : 1;
  if (!damaged.length) return springRow.includes('#') ? 0 : 1;

  const key = getMapKey(springRow, damaged);
  if (cache.has(key)) return cache.get(key);

  let result = 0;
  const damagedLength = getNextDamagedWithoutUnknownGroupLength(springRow);
  if (damagedLength) {
    if (damagedLength === damaged[0]) {
      result += countPossibleOptions({ springRow: springRow.slice(damaged[0]), damaged: damaged.slice(1)}, cache);
    }
  } else if (springRow.includes('?')) {
    result += countPossibleOptions(replaceUnknownChar('.', springRow, damaged), cache);
    result += countPossibleOptions(replaceUnknownChar('#', springRow, damaged), cache);
  }
  
  cache.set(key, result);
  return result;
}

function part1(input: SpringRow[]) {
  const cache = new Map<string, number>();
  return pipe(
    input,
    map(sr => countPossibleOptions(sr, cache)),
    sum()
  )
}

function part2(input: SpringRow[]) {
  const cache = new Map<string, number>();
  return pipe(
    input,
    map(sr => ({
      springRow: [...Array(5)].fill(sr.springRow).join('?'),
      damaged: [...Array(5)].fill(sr.damaged).flat()
    })),
    map(sr => countPossibleOptions(sr, cache)),
    sum()
  )
}

console.log(part1(springRows));
console.log(part2(springRows));
