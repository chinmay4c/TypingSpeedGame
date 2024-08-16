const wordDisplay = document.getElementById('word-display');
const inputElement = document.getElementById('input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const resultElement = document.getElementById('result');
const restartButton = document.getElementById('restart');

let words = [];
let wordIndex = 0;
let startTime = 0;
let timerInterval = null;
let isGameActive = false;

const API_URL = 'https://random-word-api.herokuapp.com/word?number=50';

async function fetchWords() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch words');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching words:', error);
        return [];
    }
}

function displayWords() {
    wordDisplay.innerHTML = '';
    words.forEach((word, index) => {
        const wordElement = document.createElement('span');
        wordElement.textContent = word;
        wordElement.classList.add('word');
        if (index === wordIndex) {
            wordElement.classList.add('current');
        }
        wordDisplay.appendChild(wordElement);
    });
}

async function startGame() {
    resultElement.textContent = 'Loading words...';
    words = await fetchWords();
    
    if (words.length === 0) {
        resultElement.textContent = 'Failed to load words. Please try again.';
        return;
    }

    wordIndex = 0;
    startTime = new Date().getTime();
    isGameActive = true;
    displayWords();
    inputElement.value = '';
    inputElement.disabled = false;
    inputElement.focus();
    resultElement.textContent = '';
    timerInterval = setInterval(updateTimer, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    isGameActive = false;
    inputElement.disabled = true;
    const totalTime = (new Date().getTime() - startTime) / 1000;
    const wpm = Math.round((wordIndex / totalTime) * 60);
    resultElement.textContent = `Game Over! Your speed: ${wpm} WPM`;
}

function updateTimer() {
    const currentTime = Math.floor((new Date().getTime() - startTime) / 1000);
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const wpm = Math.round((wordIndex / (currentTime / 60)) || 0);
    wpmElement.textContent = `${wpm} WPM`;
}

function checkInput() {
    const currentWord = words[wordIndex];
    const typedWord = inputElement.value.trim();

    if (typedWord === currentWord) {
        inputElement.value = '';
        wordIndex++;

        if (wordIndex === words.length) {
            endGame();
        } else {
            displayWords();
        }
    }
}

restartButton.addEventListener('click', startGame);
inputElement.addEventListener('input', checkInput);

startGame();