import { groupby, map, orderby, orderbydescending, pipe, sum, thenby, toarray } from "powerseq";

const fs = require("fs");

const cardsStrength = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const cardsMap =      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const cardsMapJ =     ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'A', 'L', 'M'];

const types = ['nothing', 'one', 'two', 'three', 'full', 'four', 'five'] as const;
type CardType = typeof types[number];

interface Hand {
    cards: string[];
    type: CardType;
    bid: number;
}

const input = fs.readFileSync("./day7/inputMini.txt", "utf-8");

function getHandType(cardGroupsLengths: number[]): CardType{
    if(cardGroupsLengths[0] === 5) return 'five';
    if(cardGroupsLengths[0] === 4) return 'four';
    if(cardGroupsLengths[0] === 3 ) return cardGroupsLengths[1] === 2 ? 'full' : 'three';
    if(cardGroupsLengths[0] === 2 ) return cardGroupsLengths[1] === 2 ? 'two' : 'one';
    else return 'nothing';
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

function mapCardsToHand(cards: string[], bid: number): Hand{
    const cardGroups = groupCardsInHand(cards);
    return { type: getHandType(cardGroups), cards, bid };
}

function parseInput(input: string, mapToHandFn: (cards: string[], bid: number) => Hand){
    return pipe(
        input.split('\n'),
        map(line =>{
            const [handS, bidS] =  line.split(' ');
            return mapToHandFn(handS.split(''), parseInt(bidS));
        }),
        toarray()
    );
}

//1.
function calculateBids(hands: Hand[], cMap){
    return pipe(
        hands,
        orderby(hand => types.indexOf(hand.type)),
        thenby(hand => hand.cards.map(c=> cMap[cardsStrength.indexOf(c)]).join('')),
        map((h,i)=> h.bid * (i+1)),
        sum()
    )
}
console.log(calculateBids(parseInput(input, mapCardsToHand), cardsMap));

//2.
function getHandTypeWithJoker(prevType: CardType, jokers: number): CardType{
    if(prevType === 'four' || jokers === 5) return 'five';
    if(prevType === 'three') return jokers === 2 ? 'five' : 'four';
    if(prevType === 'two') return 'full';
    if(prevType === 'one') return jokers === 3 ? 'five' : jokers === 2 ? 'four': 'three';
    else{
        if(jokers === 4) return 'five';
        if(jokers === 3) return 'four';
        if(jokers === 2) return 'three';
        if(jokers === 1) return 'one';
    }
    return null;
}

function mapCardsToHandWithJoker(cards: string[], bid: number): Hand{
    if(cards.indexOf('J') !== -1) {
        const cardsWithoutJokers = cards.filter(c => c !== 'J');
        const numberOfJokers = cards.length - cardsWithoutJokers.length;
        const cardGroups = groupCardsInHand(cardsWithoutJokers);
        const handWithoutJokerType = getHandType(cardGroups);
        return { type: getHandTypeWithJoker(handWithoutJokerType, numberOfJokers), cards, bid };
    } else {
        const cardGroups = groupCardsInHand(cards);
        return { type: getHandType(cardGroups), cards, bid };
    }
}

// console.log(parseInput(input, mapCardsToHandWithJoker))
