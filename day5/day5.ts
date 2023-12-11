import { buffer, distinct, filter, flatmap, map, minby, pipe, some, toarray } from "powerseq";
const fs = require("fs");

const input = fs.readFileSync("./day5/input.txt", "utf8");

interface SeedData {
  seeds: number[];
  almanac: any[];
}

function parseInput(input: string): SeedData{
  const [seedsLine, ...mapsLines] = input.split("\n\n");
  const seeds = seedsLine.replace("seeds: ", "").split(" ").map(n => parseInt(n));
  const almanac = mapsLines.map(l => l.split(':')[1].split('\n').filter(l => !!l).map(sl => sl.split(' ').map(n => parseInt(n))))
  return { seeds, almanac }
}

const { seeds, almanac } = parseInput(input);

function getValueFromMapType(initial: number, mapType: number[][]): number{
  const map = mapType.find(([_, source, range])=>{
    return initial >= source && initial <= source + range;
  });
  return map ? map[0] + initial - map[1] : initial;
}

function getProcessedValue(seed: number, almanac: number[][][], processMapFn: (v: number, map: number[][]) => number){
  return almanac.reduce((initial, almanacEntry) => processMapFn(initial, almanacEntry), seed);
}

//1.
function getLowestLocation(seeds: number[], almanac: number[][][]){
  return pipe(
    seeds,
    map(s => getProcessedValue(s, almanac, getValueFromMapType)),
    minby(v => v)
  )
}
console.log(getLowestLocation(seeds, almanac));

//2.
function isSeedInRange(seeds: number[], seed: number){
  return pipe(
    seeds,
    buffer(2),
    some(([start, count])=> start < seed && start + count >= seed)
  )
}

function getValueFromReversedMapType(initial: number, mapType: number[][]): number{
  const map = mapType.find(([source, destination, range])=>{
    return initial >= source && initial <= source + range;
  });
  return map ? map[1] + initial - map[0] : initial;
}

/*
  Testing each lower bound (dest start) of every mapping.
  Mapped each back up to a seed, checked if it was valid, then mapped that back down to the location and took the smallest one.
  
  So for each mapping it considers the seed that would map to the lower bound of that mapping. So for the example input:

  soil 50 is mapped backwards to seed 98. candidate seeds: [ 98 ]
  soil 52 is mapped back to seed 50. candidate seeds: [ 98, 50 ]
  fertilizer 0 -> soil 15 -> seed 15. candidate seeds: [ 98, 50, 15 ]
  etc until the candidate seeds are all [ 98, 50, 15, 50, 0, 14, 26, 15, 22, 44, 99, 82, 54, 69, 70, 26, 92, 62 ]

  Then each is checked if it is a valid seed (i.e. within any of the seed ranges), which leaves [ 82, 92, 62 ]. 
  These are all mapped forwards to their corresponding locations which are [ 46, 60, 56 ],
  and the minimum of them is returned as the answer.
*/
function getLowestLocationByRange(seedsRange: number[], almanac: number[][][]){
  const reversedAlmanac = JSON.parse(JSON.stringify(almanac)).reverse().map(m => m.reverse());
  const seedfromAlmanac2 = pipe(
    reversedAlmanac,
    flatmap((maps: any, i) => maps.flatMap(([_, source, range]) => {
        const sourceEnd = source + range - 1;
        return [
          getProcessedValue(source, reversedAlmanac.slice(i + 1, reversedAlmanac.length), getValueFromReversedMapType),
          getProcessedValue(sourceEnd, reversedAlmanac.slice(i + 1, reversedAlmanac.length), getValueFromReversedMapType),
        ]
      })
    ),
    distinct(),
    filter((s:number) => isSeedInRange(seedsRange, s)),
    toarray()
  )
  return getLowestLocation([ ...seedfromAlmanac2], almanac);
}

console.log(getLowestLocationByRange(seeds, almanac));
