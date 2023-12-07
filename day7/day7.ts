import { groupby, map, orderby, orderbydescending, pipe, sum, thenby, thenbydescending, toarray } from "powerseq";

const fs = require("fs");

const cardsStrength = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const cardsMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const types = ['nothing', 'one', 'two', 'three', 'full', 'four', 'five'];
type CardType = typeof types[number];
interface Hand {
    cards: string[];
    type: CardType;
    bid: number;
}

const input = fs.readFileSync("./day7/input.txt", "utf-8");

function getHandType(cardGroupsLengths: number[]): CardType{
    if(cardGroupsLengths[0] === 5) return 'five';
    if(cardGroupsLengths[0] === 4) return 'four';
    if(cardGroupsLengths[0] === 3 ) return cardGroupsLengths.length === 2 ? 'full' : 'three';
    if(cardGroupsLengths[0] === 2 ) return cardGroupsLengths.length === 3 ? 'two' : 'one';
    else return 'nothing';
}

function mapCardsToHand(cards: string[], bid: number): Hand{
    const cardGroups = pipe( 
        cards, 
        groupby(c => c), 
        map(g => [...g].length),
        orderbydescending(n => n),
        toarray()
    );
    return { type: getHandType(cardGroups), cards, bid };
}

function parseInput(input: string){
    return pipe(
        input.split('\n'),
        map(line =>{
            const [handS, bidS] =  line.split(' ');
            return mapCardsToHand(handS.split(''), parseInt(bidS));
        }),
        toarray()
    );
}

//1.
function calculateBids(hands: Hand[]){
    return pipe(
        hands,
        orderby(hand => types.indexOf(hand.type)),
        thenby(hand => hand.cards.map(c=> cardsMap[cardsStrength.indexOf(c)]).join('')),
        map((h,i)=> h.bid * (i+1)),
        sum()
    )
}

console.log(calculateBids(parseInput(input)));