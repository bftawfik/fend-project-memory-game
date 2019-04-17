const ALL_CARDS_COUNT = 16;
const STAR_RATING_MAX = 20;
const STAR_RATING_STEP = 8;
const MAX_STAR_RATING_STEPS = 8;

//-----------------------------------------------------------------
const updateTimer = (timer, timeCount) => {
    let s = timeCount % 60;
    s = s<10 ? "0"+s : s;
    let m = Math.floor(timeCount / 60);
    m = m<10 ? "0"+m : m;
    timer.innerText = m+":"+s;
    if(Math.floor(timeCount / 60) > 59){
        timerStarted=false;
        updateAndShowLoseModal();
    }
}

const updateMovesCounter = (movesCounter, movesCount) => {
    movesCounter.innerText = movesCount;
}

const restCard = card => {
    card.classList.remove('open', 'show', 'match', 'hide');
    openedCards = openedCards.filter(openCard => openCard !== card);
}

const flipCardBack = card => {
    setTimeout(() => {
        card.classList.toggle('open');
        card.classList.toggle('show');
        card.classList.toggle('hide');
    }, 600, card);
    openedCards = openedCards.filter(openCard => openCard !== card);
}

const resetGame = () => {
    openedCards = [];
    allCards.map(card => restCard(card));
    shuffldCared = shuffle(allCards.slice());
    for(let cardsCount=0; cardsCount<shuffldCared.length; cardsCount++){
        deck.appendChild(shuffldCared[cardsCount]);
    }
    movesCount = 0;
    matchedCards = 0;
    timeCount = 0;
    timerStarted = false;
    updateMovesCounter(movesCounter, movesCount);
    starsArray.map(star => {
        star.querySelector('i').classList.remove('fa-star-half-o', 'fa-star-o');
        star.querySelector('i').classList.add('fa-star');
    });
    updateTimer(timer, timeCount);
}

const restartClickHandler = e => {
    resetGame();
}

const updateAndShowWinModal = () => {
    let winModalStars = Array.from(document.querySelectorAll('.win .stars li'));
    for(let i=0; i < winModalStars.length; i++){
        winModalStars[i].querySelector('i').classList.value = starsArray[i].querySelector('i').classList.value;
    }
    document.querySelector('.win .moves').innerText = movesCount;
    let winModalTimer = document.querySelector('.win .timer .time');   
    let s = timeCount % 60;
    s = s<10 ? "0"+s : s;
    let m = Math.floor(timeCount / 60);
    m = m<10 ? "0"+m : m;
    winModalTimer.innerText = m+":"+s;
    winModal.style.display = "block";
}

const updateAndShowLoseModal = () => {
    loseModal.style.display = "block";
}

const closeWinModalClickHandler = e => {
    winModal.style.display = "none";
    resetGame();
}

const closeLoseModalClickHandler = e => {
    loseModal.style.display = "none";
    resetGame();
}

const freezeCard = card => {
    setTimeout(() => {
        card.classList.add('match');
        card.classList.remove('open');
        card.classList.remove('show');
    }, 600, card);
    
    matchedCards++;
    if(matchedCards === ALL_CARDS_COUNT){
        console.log("you win!");
        timerStarted=false;
        updateAndShowWinModal();
    }
    openedCards = openedCards.filter(openCard => openCard !== card);
}

const checkCardsMatch = (card0, card1) => {
    return Array.from(card0.querySelector('i').classList).join(" ") === Array.from(card1.querySelector('i').classList).join(" ") ? true : false;
}

const updateStarRating = (movesCount) => {
    let steps = Math.min(Math.ceil((movesCount-STAR_RATING_MAX) / STAR_RATING_STEP), MAX_STAR_RATING_STEPS);
    let halfStar = Boolean(steps % 2);
    let wholeStars = Math.floor(steps / 2);
    if(halfStar){
        starsArray[starsArray.length-1-wholeStars].querySelector('i').classList.replace('fa-star', 'fa-star-half-o');
    }
    if(wholeStars > 0){
        starsArray[starsArray.length-wholeStars].querySelector('i').classList.replace('fa-star-half-o', 'fa-star-o');
    }  
}

const cardClickHandler = e => {
    let card = e.target.closest("LI");
    if (!card) return;
    if(!timerStarted) timerStarted=true;
    if(!card.classList.contains('show') && !card.classList.contains('match')){
        card.classList.remove('hide');
        card.classList.add('show', 'open');
        openedCards.push(card);
        movesCount++;
        updateMovesCounter(movesCounter, movesCount);
        if(movesCount > STAR_RATING_MAX) updateStarRating(movesCount);   
    }

    if(openedCards.length == 2){
        checkCardsMatch(...openedCards) ? openedCards.map(card => freezeCard(card)) : openedCards.map(card => flipCardBack(card));
    }
}
//-----------------------------------------------------------------
let resetBtn = document.querySelector('.score-panel .restart');
let movesCounter = document.querySelector('.score-panel .moves');
let starsArray = Array.from(document.querySelectorAll('.score-panel .stars li'));
let timer = document.querySelector('.score-panel .timer .time');
console.log(timer);

let deck = document.querySelector('.deck');
let winModal = document.querySelector('.win');
let winModalCloseBtn = document.querySelector('.win .close');
let loseModal = document.querySelector('.lose');
let loseModalCloseBtn = document.querySelector('.lose .close');
let allCards = Array.from(document.querySelectorAll('.card'));
let shuffldCared, openedCards, movesCount, matchedCards, timeCount, timerStarted, timerInterval;
//-----------------------------------------------------------------
resetBtn.addEventListener('click', restartClickHandler);
deck.addEventListener('click', cardClickHandler);
winModalCloseBtn.addEventListener('click', closeWinModalClickHandler);
loseModalCloseBtn.addEventListener('click', closeLoseModalClickHandler);

timerInterval = setInterval(() => {
    if(timerStarted){
        timeCount++;
        updateTimer(timer, timeCount);
    }
}, 1000);

resetGame();


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
    let currentIndex = array.length, temporaryValue, randomIndex;

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