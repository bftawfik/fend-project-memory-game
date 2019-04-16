const flipCardBack = card => {
    card.classList.remove('open','show');
    openedCards = openedCards.filter(openCard => openCard !== card);
}

const freezeCard = card => {
    card.classList.add('match');
    openedCards = openedCards.filter(openCard => openCard !== card);
}

const checkCardsMatch = (card0, card1) => {
    return Array.from(card0.querySelector('i').classList).join(" ") === Array.from(card1.querySelector('i').classList).join(" ") ? true : false;
}

const updateMovesCounter = (movesCounter, movesCount) => {
    movesCounter.innerText = movesCount;
}

const clickHandler = e => {
    let card = e.target.closest("LI");
    if (!card) return;

    if(!card.classList.contains('show') && !card.classList.contains('match')){
        card.classList.add('open','show');
        openedCards.push(card);
        movesCount++;
        updateMovesCounter(movesCounter, movesCount);
        console.log(movesCount, movesCount);
    }
    if(openedCards.length > 1){
        setTimeout(() => {
            checkCardsMatch(...openedCards) ? openedCards.map(card => freezeCard(card)) :  openedCards.map(card => flipCardBack(card));
        }, 500);
    }
}

//-----------------------------------------------------------------
let allCards = Array.from(document.querySelectorAll('.card'));
let shuffldCared = shuffle(allCards.slice());
let deck = document.querySelector('.deck');
let openedCards = [];
let movesCount = 0;
let movesCounter = document.querySelector('.moves');
//-----------------------------------------------------------------
updateMovesCounter(movesCounter, movesCount);
deck.addEventListener('click', clickHandler, false);
for(let cardsCount=0; cardsCount<shuffldCared.length; cardsCount++){
    deck.appendChild(shuffldCared[cardsCount]);
    // cards[cardsCount].addEventListener('click', clcikHandler)
}


/*
 * Create a list that holds all of your cards
 */
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */





// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
