import { groupby, map, orderby, orderbydescending, pipe, sum, thenby, toarray } from "powerseq";

const fs = require("fs");

const cardsStrength = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const cardsMap =      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const cardsMapJ =     ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'J', 'k', 'l', 'm'];

const types = ['nothing', 'one', 'two', 'three', 'full', 'four', 'five'] as const;
type CardType = typeof types[number];

interface Hand {
    cards: string[];
    type: CardType;
    bid: number;
}

const input = fs.readFileSync("./day7/input.txt", "utf-8");

function getHandType(cardGroupsLengths: number[]): CardType {
    const [firstGroupLength, secondGroupLength] = cardGroupsLengths;
    switch (firstGroupLength) {
        case 5: return 'five';
        case 4: return 'four';
        case 3: return secondGroupLength === 2 ? 'full' : 'three';
        case 2: return secondGroupLength === 2 ? 'two' : 'one';
        default: return 'nothing';
    }
}

function groupCardsInHand(cards: string[]){
    return pipe( 
        cards, 
        groupby(c => c), 
        map(g => [...g].length),
        orderbydescending(n => n),
        toarray()
    );
}

function mapCardsToHand(cards: string[], bid: number): Hand {
    const cardGroups = groupCardsInHand(cards);
    return { type: getHandType(cardGroups), cards, bid };
}

function parseInput(input: string, mapToHandFn: (cards: string[], bid: number) => Hand) {
    return pipe(
        input.split('\n'),
        map(line =>{
            const [handS, bidS] =  line.split(' ');
            return mapToHandFn(handS.split(''), parseInt(bidS));
        }),
        toarray()
    );
}

function calculateCardStrengthString(cards: string[], strengthMap){
    return cards.map(c => strengthMap[cardsStrength.indexOf(c)]).join('');
}

//1.
function calculateBids(hands: Hand[], strengthMap) {
    return pipe(
        hands,
        orderby(hand => types.indexOf(hand.type)),
        thenby(hand => calculateCardStrengthString(hand.cards, strengthMap)),
        map((h,i)=> h.bid * (i+1)),
        sum()
    )
}
console.log(calculateBids(parseInput(input, mapCardsToHand), cardsMap));

//2.
function getHandTypeWithJoker(withoutJType: CardType, jokers: number): CardType{
    if(withoutJType === 'four' || jokers === 5) return 'five';
    if(withoutJType === 'three') return jokers === 2 ? 'five' : 'four';
    if(withoutJType === 'two') return 'full';
    if(withoutJType === 'one') return jokers === 3 ? 'five' : jokers === 2 ? 'four': 'three';
   
    switch (jokers) {
        case 4: return 'five';
        case 3: return 'four';
        case 2: return 'three';
        case 1: return 'one';
        default: return null;
    }
    
}

function mapCardsToHandWithJoker(cards: string[], bid: number): Hand {
    if (cards.includes('J')) {
        const cardsWithoutJokers = cards.filter(c => c !== 'J');
        const numberOfJokers = cards.length - cardsWithoutJokers.length;
        const handWithoutJokerType = getHandType(groupCardsInHand(cardsWithoutJokers));
        const typeWithJoker = getHandTypeWithJoker(handWithoutJokerType, numberOfJokers);
        return { type: typeWithJoker, cards, bid };
    } else {
        const cardGroups = groupCardsInHand(cards);
        const type = getHandType(cardGroups);
        return { type, cards, bid };
    }
}

console.log(calculateBids(parseInput(input, mapCardsToHandWithJoker), cardsMapJ))