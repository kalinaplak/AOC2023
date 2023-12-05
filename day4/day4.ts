import { intersect, map, pipe, sum } from "powerseq";

const fs = require('fs');

interface Card {
  winning: number[];
  given: number[];
  givenWinning: number[];
  copies: number;
}

const input = fs.readFileSync('./day4/input.txt', "utf-8");

function parseInput(input: string): Card[] {
  return input.trim().split('\n').map(line => {
    const [winningStr, givenStr] = line.split(':')[1].split('|').map(part => part.trim());
    const winningNumbers = winningStr.split(' ').filter(n=> !!n).map(n => parseInt(n));
    const givenNumbers = givenStr.split(' ').filter(n => !!n).map(n => parseInt(n));

    return {
      winning: winningNumbers,
      given: givenNumbers,
      givenWinning: [...intersect(winningNumbers, givenNumbers)],
      copies: 1
    };
  });
}

//1.
function calculateWinningPoints(cards: Card[]){
  return pipe(
    cards,
    map(c => c.givenWinning.length > 0 
      ? Math.pow(2, c.givenWinning.length - 1) 
      : 0
    ),
    sum()
  )
}

console.log(calculateWinningPoints(parseInput(input)));

//2.
function calculateWinningCards(cards: Card[]){
  const clonedCards = cards.map(card => ({ ...card }));
  return clonedCards.reduce((acc, card, i) => {
    const cardsToCopy = card.givenWinning.length;
    const cardsInRange = clonedCards.slice(i + 1, i + cardsToCopy + 1);
    cardsInRange.forEach(toCopy => {
      toCopy.copies += card.copies;
    });
    return acc + card.copies;
  }, 0);
}

console.log(calculateWinningCards(parseInput(input)));