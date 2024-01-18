const fs = require('fs');
import { map, max, pipe, sum, toarray, toobject } from 'powerseq';
import { Dictionary } from 'powerseq/common/types';

interface GameSet extends Dictionary<number> {
  red: number;
  blue: number;
  green: number;
}

function getMatchingColorAndQuantity(line: string) {
  return [...(line.match(/\d+ \w+/g) ?? [])].map(l => l.split(' '));
}

function parseGameSet(setInfo: string): GameSet {
  const colorAndQuantity = getMatchingColorAndQuantity(setInfo);
  const defaultValues: GameSet = { red: 0, blue: 0, green: 0 };
  const result = toobject(
    colorAndQuantity,
    ([_, color]) => color,
    ([quantity, _]) => parseInt(quantity)
  ) as GameSet;
  return { ...defaultValues, ...result };
}

function parseGames(input: string): GameSet[][] {
  return pipe(
    input.split('\n'),
    map(gameString => gameString.split(';').map(parseGameSet)),
    toarray()
  );
}

//1.
function isGamePossible(sets: GameSet[], maxSetValue: GameSet) {
  return sets.every(s => s.red <= maxSetValue.red && s.green <= maxSetValue.green && s.blue <= maxSetValue.blue);
}

function part1(games: GameSet[][], maxSetValue: GameSet) {
  return pipe(
    games,
    map((g, index) => (isGamePossible(g, maxSetValue) ? index + 1 : 0)),
    sum()
  );
}

//2.
function part2(games: GameSet[][]) {
  return sum(games, sets => max(sets, s => s.red) * max(sets, s => s.green) * max(sets, s => s.blue));
}

const games = fs.readFileSync('./day2/input.txt', 'utf-8');
const gameSets = parseGames(games);

console.log(part1(gameSets, { red: 12, green: 13, blue: 14 }));
console.log(part2(gameSets));
