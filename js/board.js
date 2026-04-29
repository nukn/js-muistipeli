import { createCardElement, flipCard } from './card.js';

const allCards = [
    '🍎', '🍐', '🍒', '🍉', '🍇', '🍓', '🍌', '🍍', '🥝', '🥥', '🍑', '🍈', '🍋', '🍊', '🍏', '🍅'
];
const gameBoard = document.getElementById('game-board');
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let pairs = 0
let attempts = 0

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function createBoard() {
    const cardCount = parseInt(prompt("Syötä korttien määrä (parillinen luku):"), 10);
    if (!cardCount || isNaN(cardCount) || cardCount % 2 !== 0) {
        alert("Korttien määrän täytyy olla parillinen luku.");
        return;
    }
    gameBoard.innerHTML = '';
    pairs = 0;
    attempts = 0;
    document.getElementById('attempt-counter').textContent = 0;

    const selectedCards = allCards.slice(0, cardCount / 2);
    const cards = [...selectedCards, ...selectedCards];
    shuffle(cards);
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        cardElement.addEventListener('click', () => flipCard(cardElement, handleCardFlip, lockBoard));
        gameBoard.appendChild(cardElement);
    });
}

document.getElementById('restart-btn').addEventListener('click', () => {
        resetBoard();
        createBoard();
    });

function handleCardFlip(cardElement) {
    if (lockBoard) return;
    if (cardElement === firstCard) return;


    if (!firstCard) {
        firstCard = cardElement;
        return;
    }

    secondCard = cardElement;
    lockBoard =true

    attempts++;
    document.getElementById('attempt-counter').textContent = attempts

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    pairs++;
    if (pairs === gameBoard.children.length / 2) {
        setTimeout(() => alert(`Voitit pelin! Yrityksiä: ${attempts}`), 300)
    }

    resetBoard();
}

function unflipCards() {
    
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}