import { filtermap, intersect, map, pipe, sum, toarray } from 'powerseq';

const fs = require('fs');

interface Card {
  winning: number[];
  given: number[];
  givenWinning: number[];
  copies: number;
}

function parseNumbers(line: string) {
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
function part2(cards: Card[]) {
  const clonedCards: Card[] = JSON.parse(JSON.stringify(cards));
  //todo xD
  return pipe(
    clonedCards,
    map((card, i) => {
      const cardsToCopy = card.givenWinning.length;
      const cardsInRange = clonedCards.slice(i + 1, i + cardsToCopy + 1);
      cardsInRange.forEach(toCopy => {
        toCopy.copies += card.copies;
      });
      return card.copies;
    }),
    sum()
  );
}

const input = parseInput(fs.readFileSync('./day4/input.txt', 'utf-8'));
console.log(part1(input));
console.log(part2(input));
