import { buffer, flatmap, map, minby, pipe, range, toarray } from "powerseq";
const fs = require("fs");

const input = fs.readFileSync("./day5/input.txt", "utf8");

interface SeedData {
  seeds: number[];
  maps: any[];
}

function parseInput(input: string): SeedData{
  const [seedsLine, ...mapsLines] = input.split("\n\n");
  const seeds = seedsLine.replace("seeds: ", "").split(" ").map(n => parseInt(n));
  const maps = mapsLines.map(l => l.split(':')[1].split('\n').filter(l => !!l).map(sl => sl.split(' ').map(n => parseInt(n))))
  return { seeds, maps }
}

const { seeds, maps } = parseInput(input);

function getValueFromMapType(initial: number, mapType: number[][]): number{
  const map = mapType.find(([_, source, range])=>{
    return initial >= source && initial <= source + range;
  });
  return map ? map[0] + initial - map[1] : initial;
}

function getSeedLocation(seed: number, almanac: number[][][]){
  return almanac.reduce((initial, almanacEntry) => {
    initial = getValueFromMapType(initial, almanacEntry);
    return initial;
  }, seed);
}

//1.
function getLowestLocation(seeds: number[], almanac: number[][][]){
  return pipe(
    seeds,
    map(s => getSeedLocation(s, almanac)),
    minby(v => v)
  )
}

console.log(getLowestLocation(seeds, maps));

//2.
function convertSeedsRange(input: number[]){
  return pipe(
    input,
    buffer(2),
    flatmap(([start, count])=> range(start, count)),
    toarray()
  )
}

// console.log(getLowestLocation(convertSeedsRange(seeds), maps));