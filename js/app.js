const ALL_CARDS_COUNT = 16;
const STAR_RATING_MAX = 20;
const STAR_RATING_STEP = 8;
const MAX_STAR_RATING_STEPS = 8;

//-----------------------------------------------------------------
const updateLocalGameData = () => {
    console.log(localGameData.leaderboard);
    localGameData.leaderboard.push({moves: movesCount, time: timeCount});
    localGameData.leaderboard.sort((a, b) => {
        if(a.moves !== b.moves ){
            return a.moves - b.moves;
        }
        return a.time - b.time;
    });
    console.log(localGameData.leaderboard);
    localGameData.leaderboard = localGameData.leaderboard.slice(0,3);
    localStorage.setItem("BFT_1mac_memory_game", JSON.stringify(localGameData));
}
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
    // updateAndShowWinModal();
}

const formatTime = timeCount => {
    let s = timeCount % 60;
    s = s<10 ? "0"+s : s;
    let m = Math.floor(timeCount / 60);
    m = m<10 ? "0"+m : m;
    return m+":"+s;
}


const updateAndShowWinModal = () => {
    let winModalStars = Array.from(document.querySelectorAll('.win .user li'));
    updateStarRating(winModalStars, movesCount);
    document.querySelector('.win .moves').innerText = movesCount;
    let winModalTimer = document.querySelector('.win .timer .time');
    winModalTimer.innerText = formatTime(timeCount);

    let winModalLeaderboard = Array.from(document.querySelectorAll('.win .leaderboard .record'));
    localGameData.leaderboard.map((record, index) => {
        if(localGameData.leaderboard[index].moves && localGameData.leaderboard[index].time){
            winModalLeaderboard[index].querySelector('.timer .time').innerText = formatTime(record.time);
            winModalLeaderboard[index].querySelector('.moves').innerText = record.moves;
            updateStarRating(Array.from(winModalLeaderboard[index].querySelector('.stars').querySelectorAll('li')), record.moves);
        }
    })
    
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
        updateLocalGameData();
        timerStarted=false;
        updateAndShowWinModal();
    }
    openedCards = openedCards.filter(openCard => openCard !== card);
}

const checkCardsMatch = (card0, card1) => {
    return Array.from(card0.querySelector('i').classList).join(" ") === Array.from(card1.querySelector('i').classList).join(" ") ? true : false;
}

const updateStarRating = (starsArray, movesCount) => {
    let steps = Math.min(Math.ceil((movesCount-STAR_RATING_MAX) / STAR_RATING_STEP), MAX_STAR_RATING_STEPS);
    let halfStar = Boolean(steps % 2);
    let lostStars = starsArray.length-Math.floor(steps / 2);
    
    starsArray.map((star, index) => {
        star.querySelector('i').classList.remove('fa-star-half-o', 'fa-star-o');
        star.querySelector('i').classList.add('fa-star');
        if(index >= lostStars){
            star.querySelector('i').classList.replace('fa-star', 'fa-star-o');
        }
    });
    if(halfStar){
        starsArray[lostStars-1].querySelector('i').classList.replace('fa-star', 'fa-star-half-o');
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
        if(movesCount > STAR_RATING_MAX) updateStarRating(starsArray, movesCount);   
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
let deck = document.querySelector('.deck');
let winModal = document.querySelector('.win');
let winModalCloseBtn = document.querySelector('.win .close');
let loseModal = document.querySelector('.lose');
let loseModalCloseBtn = document.querySelector('.lose .close');
let allCards = Array.from(document.querySelectorAll('.card'));
let shuffldCared, openedCards, movesCount, matchedCards, timeCount, timerStarted, timerInterval;
let gameData = {
    leaderboard: [
    ]
};
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

let localGameData = JSON.parse(localStorage.getItem("BFT_1mac_memory_game")) || gameData;

localStorage.setItem("BFT_1mac_memory_game", JSON.stringify(localGameData));

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
