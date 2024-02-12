import { groupby, map, orderby, orderbydescending, pipe, sum, thenby, toarray } from 'powerseq';

const fs = require('fs');

const cardsStrength = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const cardsMap =      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const cardsMapJ =     ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'J', 'k', 'l', 'm'];

const types = ['nothing', 'pair', 'twopairs', 'three', 'full', 'four', 'five'] as const;
type CardType = (typeof types)[number];

interface Hand {
  cards: string[];
  type: CardType;
  bid: number;
}

const input = fs.readFileSync('./day7/input.txt', 'utf-8');

function parseInput(input: string, withJoker = false) {
  return pipe(
    input.split('\n'),
    map(line => {
      const [handS, bidS] = line.split(' ');
      return mapCardsToHand(handS.split(''), parseInt(bidS), withJoker);
    }),
    toarray()
  );
}

function mapCardsToHand(cards: string[], bid: number, withJoker = false): Hand {
  if (!withJoker || !cards.includes('J')) {
    return { type: getCardTypeInHand(cards), cards, bid };
  } else {
    const cardsWithoutJokers = cards.filter(c => c !== 'J');
    const numberOfJokers = cards.length - cardsWithoutJokers.length;
    const handWithoutJokerType = getCardTypeInHand(cardsWithoutJokers);
    const typeWithJoker = getCardTypeInHandWithJoker(handWithoutJokerType, numberOfJokers);
    return { type: typeWithJoker, cards, bid };
  }
}

function getCardTypeInHand(cards: string[]): CardType {
  const groupedCards = pipe(
    cards,
    groupby(c => c),
    map(([_, values]) => values.length),
    orderbydescending(n => n),
    toarray()
  );
  return getCardTypeForGroupedCardsHand(groupedCards);
}

//prettier-ignore
function getCardTypeInHandWithJoker(withoutJType: CardType, jokers: number): CardType {
  if (withoutJType === 'four' || jokers === 5 || jokers === 4) return 'five';
  else if (withoutJType === 'three') return jokers === 2 ? 'five' : 'four';
  else if (withoutJType === 'twopairs') return 'full';
  else if (withoutJType === 'pair') return jokers === 3 ? 'five' : jokers === 2 ? 'four' : 'three';
  else if(withoutJType === 'nothing'){
    switch (jokers) {
      case 3:  return 'four';
      case 2:  return 'three';
      case 1:  return 'pair';
      default: return 'nothing';
    }
  }
}

//prettier-ignore
function getCardTypeForGroupedCardsHand(cardGroupsLengths: number[]): CardType {
  const [firstGroupLength, secondGroupLength] = cardGroupsLengths;
  switch (firstGroupLength) {
    case 5:  return 'five';
    case 4:  return 'four';
    case 3:  return secondGroupLength === 2 ? 'full' : 'three';
    case 2:  return secondGroupLength === 2 ? 'twopairs' : 'pair';
    default: return 'nothing';
  }
}

function calculateCardStrengthString(cards: string[], strengthMap) {
  return cards.map(c => strengthMap[cardsStrength.indexOf(c)]).join('');
}

function calculateBids(hands: Hand[], strengthMap) {
  return pipe(
    hands,
    orderby(hand => types.indexOf(hand.type)),
    thenby(hand => calculateCardStrengthString(hand.cards, strengthMap)),
    map((h, i) => h.bid * (i + 1)),
    sum()
  );
}

//1.
function part1(input: string) {
  return calculateBids(parseInput(input), cardsMap);
}

//2.
function part2(input: string) {
  return calculateBids(parseInput(input, true), cardsMapJ);
}

console.log(part1(input));
console.log(part2(input));
