const cards = ['🍎', '🍎', '🍉', '🍉', '🍌', '🍌', '🍒', '🍒', '🍓', '🍓', '🍋', '🍋', '🍍', '🍍', '🥥', '🥥', '🍇', '🍇', '🍊', '🍊', '🍏', '🍏', '🥭', '🥭', '🍑', '🍑', '🍐', '🍐']; // Each symbol appears twice to create a matching pair
let flippedCards = [];
let matchedCards = [];
let lockBoard = false;
let lives = 10;
let timer = 120; // 2 minutes in seconds
let timerInterval;

function createBoard() {
    const gameContainer = document.getElementById('game-container');

    // Shuffle the cards array
    const shuffledCards = shuffle(cards);

    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.card = card;
        cardElement.innerText = '';
        cardElement.addEventListener('click', flipCard);
        gameContainer.appendChild(cardElement);
    });

    // Display lives
    const livesDisplay = document.createElement('div');
    livesDisplay.classList.add('lives');
    livesDisplay.innerText = `Lives: ${lives}`;
    gameContainer.appendChild(livesDisplay);

    // Display timer
    const timerDisplay = document.createElement('div');
    timerDisplay.classList.add('timer');
    timerDisplay.innerText = `Time: ${formatTime(timer)}`;
    gameContainer.appendChild(timerDisplay);

    // Start the timer
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timer--;
    const timerDisplay = document.querySelector('.timer');
    timerDisplay.innerText = `Time: ${formatTime(timer)}`;

    if (timer === 0) {
        endGame(false); // Timer ran out, end the game
    }
}

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return; // Prevent double-clicking the same card

    this.innerText = this.dataset.card;
    this.classList.add('flipped');

    if (!flippedCards.length) {
        flippedCards.push(this);
        return;
    }

    flippedCards.push(this);
    checkForMatch();
}

function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.card === secondCard.dataset.card) {
        matchedCards.push(...flippedCards);
        flippedCards = [];
        if (matchedCards.length === cards.length) {
            endGame(true); // All cards matched, end the game with a win
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            flippedCards.forEach(card => {
                card.innerText = '';
                card.classList.remove('flipped');
            });
            flippedCards = [];
            lockBoard = false;
            lives--;
            updateLivesDisplay();
            if (lives === 0) {
                endGame(false); // Lives ran out, end the game
            }
        }, 1000);
    }
}

function updateLivesDisplay() {
    const livesDisplay = document.querySelector('.lives');
    livesDisplay.innerText = `Lives: ${lives}`;
}

function endGame(win) {
    clearInterval(timerInterval); // Stop the timer

    if (win) {
        alert('Congratulations! You won!');
    } else {
        updateLivesDisplay();
        setTimeout(() => {
            alert("Game over! You ran out of lives or time.");
            resetGame();
        }, 500);
    }
}

function resetGame() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';
    flippedCards = [];
    matchedCards = [];
    lockBoard = false;
    lives = 10;
    timer = 120;
    createBoard();
}

// Function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

createBoard();

