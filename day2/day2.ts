const fs = require('fs');
import { filter, map, pipe, sum } from "powerseq";

interface GameSet {
  red: number;
  blue: number;
  green: number;
}

function parseGameSet(setInfo: string): GameSet{
  const colors = [...setInfo.match(/\d+ \w+/g) ?? []];
  return colors.reduce((acc, curr) =>{
    const [quantity, type] = curr.split(' ');
    acc[type] = parseInt(quantity);
    return acc;
  }, { red: 0, blue: 0, green: 0})
}

function parseGames(input: string): GameSet[][] {
  return input.split('\n').map((gameString) => gameString.split(';').map(s => parseGameSet(s)));
}
  
const games = fs.readFileSync('./day2/input.txt', "utf-8");
const gameSets = parseGames(games);

//1.
function isGamePossible(sets: GameSet[], maxSetValue: GameSet){
  return sets.every(s => s.red <= maxSetValue.red &&
    s.green <= maxSetValue.green &&
    s.blue <= maxSetValue.blue 
  );
}

function getPossibleGamesSum(games: GameSet[][], maxSetValue: GameSet){
 return pipe(
    games,
    map((g, index) => ({game: index+1, possible: isGamePossible(g, maxSetValue)})),
    filter(g => g.possible),
    sum(g => g.game)
 )
}

const maxSetValue: GameSet = {red: 12, green: 13, blue: 14};
console.log(getPossibleGamesSum(gameSets, maxSetValue));

//2.
function getMaxCubesPower(sets: GameSet[]): number{
  const maxCubes = sets.reduce((acc,curr) =>{
    if(curr.red > acc.red) acc.red = curr.red;
    if(curr.green > acc.green) acc.green = curr.green;
    if(curr.blue > acc.blue) acc.blue = curr.blue;
    return acc;
  },{ red: -1, green: -1, blue:-1});

  return maxCubes.red * maxCubes.green * maxCubes.blue;
}

function getGamesPowerSum(games: GameSet[][]){
  return sum(games, getMaxCubesPower);
}

console.log(getGamesPowerSum(gameSets))