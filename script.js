const wordDisplay = document.getElementById('word-display');
const inputElement = document.getElementById('input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const resultElement = document.getElementById('result');
const restartButton = document.getElementById('restart');

let words = [];
let currentIndex = 0;
let startTime = 0;
let timerInterval = null;
let isGameActive = false;
let correctCharacters = 0;
let totalCharacters = 0;

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
    wordDisplay.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
}

async function startGame() {
    resultElement.textContent = 'Loading words...';
    words = await fetchWords();
    
    if (words.length === 0) {
        resultElement.textContent = 'Failed to load words. Please try again.';
        return;
    }

    currentIndex = 0;
    startTime = new Date().getTime();
    isGameActive = true;
    correctCharacters = 0;
    totalCharacters = 0;
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
    const wpm = Math.round((correctCharacters / 5 / totalTime) * 60);
    const accuracy = Math.round((correctCharacters / totalCharacters) * 100) || 100;
    resultElement.textContent = `Game Over! Your speed: ${wpm} WPM | Accuracy: ${accuracy}%`;
}

function updateTimer() {
    const currentTime = Math.floor((new Date().getTime() - startTime) / 1000);
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const wpm = Math.round((correctCharacters / 5 / (currentTime / 60)) || 0);
    wpmElement.textContent = `${wpm} WPM`;

    const accuracy = Math.round((correctCharacters / totalCharacters) * 100) || 100;
    accuracyElement.textContent = `${accuracy}%`;
}

function checkInput() {
    const typedText = inputElement.value;
    const originalText = words.join(' ');
    
    let correctChars = 0;
    let html = '';

    for (let i = 0; i < originalText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === originalText[i]) {
                html += `<span class="correct">${originalText[i]}</span>`;
                correctChars++;
            } else {
                html += `<span class="incorrect">${originalText[i]}</span>`;
            }
        } else {
            html += originalText[i];
        }
    }

    wordDisplay.innerHTML = html;
    correctCharacters = correctChars;
    totalCharacters = typedText.length;
    updateTimer();

    if (typedText.length >= originalText.length) {
        endGame();
    }
}

restartButton.addEventListener('click', startGame);
inputElement.addEventListener('input', checkInput);

startGame();