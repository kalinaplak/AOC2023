import { filtermap, intersect, map, pipe, sum, toarray } from 'powerseq';

const fs = require('fs');

interface Card {
  winning: number[];
  given: number[];
  givenWinning: number[];
  copies: number;
}

function parseNumbers(line: string): number[] {
  return pipe(
    line.split(' '),
    filtermap((n: string) => (n ? parseInt(n) : null)),
    toarray()
  );
}

function parseInput(input: string): Card[] {
  return input
    .trim()
    .split('\n')
    .map(line => {
      const [winningStr, givenStr] = line
        .split(':')[1]
        .split('|')
        .map(part => part.trim());
        
      const winningNumbers = parseNumbers(winningStr);
      const givenNumbers = parseNumbers(givenStr);

      return {
        winning: winningNumbers,
        given: givenNumbers,
        givenWinning: [...intersect(winningNumbers, givenNumbers)],
        copies: 1
      };
    });
}

//1.
function part1(cards: Card[]) {
  return sum(cards, c => (c.givenWinning.length > 0 ? Math.pow(2, c.givenWinning.length - 1) : 0));
}

//2.
function processCards(cards: Card[]){
  if(cards.length === 0) return 0;
  const [head, ...tail] = cards;
  const cardsToCopy = head.givenWinning.length;
  const newTail = pipe(tail, map((c,i)=> i < cardsToCopy ? {...c, copies: c.copies + head.copies} : c), toarray())

  return head.copies + processCards(newTail);
}

function part2(cards: Card[]) {
 return processCards(cards);
}

const input = parseInput(fs.readFileSync('./day4/input.txt', 'utf-8'));
console.log(part1(input));
console.log(part2(input));

