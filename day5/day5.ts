import { buffer, distinct, filter, filtermap, flatmap, map, min, pipe, reverse, some, toarray } from 'powerseq';
const fs = require('fs');

const input = fs.readFileSync('./day5/input.txt', 'utf8');

interface SeedData {
  seeds: number[];
  almanac: number[][][];
}

function parseAlmanacLines(lines: string[]): number[][][] {
  return lines.map(line =>
    pipe(
      line.split(':')[1].split('\n'),
      filtermap(sl => (!!sl ? sl.split(' ').map(Number) : null)),
      toarray()
    )
  );
}

function parseInput(input: string): SeedData {
  const [seedsLine, ...mapsLines] = input.split('\n\n');
  const seeds = seedsLine.replace('seeds: ', '').split(' ').map(Number);
  const almanac = parseAlmanacLines(mapsLines);
  return { seeds, almanac };
}

function isInputValueInRange(input, source, range) {
  return input >= source && input <= source + range;
}

function getValueFromMapType(input: number, mapType: number[][], reverse = false): number {
  const map = mapType.find(([dest, source, range]) => isInputValueInRange(input, !reverse ? source : dest, range));
  const [destIndex, sourceIndex] = !reverse ? [0, 1] : [1, 0];
  return map ? map[destIndex] + input - map[sourceIndex] : input;
}

function getProcessedValue(seed: number, almanac: number[][][], reverse = false) {
  return almanac.reduce((initial, almanacEntry) => getValueFromMapType(initial, almanacEntry, reverse), seed);
}

//1.
function part1(seeds: number[], almanac: number[][][]) {
  return min(seeds, s => getProcessedValue(s, almanac));
}

//2.
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

function reverseAlmanac(almanac: number[][][]) {
  return pipe(
    almanac,
    reverse(),
    map(m => [...reverse(m)]),
    toarray()
  );
}

function isSeedInRange(seeds: number[], seed: number) {
  return pipe(
    seeds,
    buffer(2),
    some(([start, count]) => start < seed && start + count >= seed)
  );
}

function processReversedMapsRanges(maps, almanac: number[][][], index): number[] {
  const almanacForIndex = almanac.slice(index + 1, almanac.length);
  return maps.flatMap(([_, start, range]) => {
    const end = start + range - 1;
    return [getProcessedValue(start, almanacForIndex, true), getProcessedValue(end, almanacForIndex, true)];
  });
}

function part2(seedsRanges: number[], almanac: number[][][]) {
  const reversedAlmanac = reverseAlmanac(almanac);
  const seedsFromAlmanacLocations = pipe(
    reversedAlmanac,
    flatmap((maps, i) => processReversedMapsRanges(maps, reversedAlmanac, i)),
    distinct(),
    filter(s => isSeedInRange(seedsRanges, s)),
    toarray()
  );
  //todo: consider seeds not matched in almanac form seed ranges
  return part1(seedsFromAlmanacLocations, almanac);
}

const { seeds, almanac } = parseInput(input);
console.log(almanac);
console.log(part1(seeds, almanac));
console.log(part2(seeds, almanac));
