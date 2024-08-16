const quoteElement = document.getElementById('quote');
const inputElement = document.getElementById('input');
const resultElement = document.getElementById('result');
const startButton = document.getElementById('start');
const timerElement = document.getElementById('timer');

let startTime, endTime, timerInterval;

const quotes = [
    'The quick brown fox jumps over the lazy dog.',
    'To be or not to be, that is the question.',
    'All that glitters is not gold.',
    'A journey of a thousand miles begins with a single step.',
    'The only way to do great work is to love what you do.'
];

function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function startGame() {
    const randomQuote = getRandomQuote();
    quoteElement.textContent = randomQuote;
    inputElement.value = '';
    inputElement.disabled = false;
    startButton.disabled = true;
    resultElement.textContent = '';
    startTime = new Date().getTime();
    inputElement.focus();

    timerInterval = setInterval(updateTimer, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    endTime = new Date().getTime();
    inputElement.disabled = true;
    startButton.disabled = false;

    const timeTaken = (endTime - startTime) / 1000;
    const wordsTyped = inputElement.value.trim().split(/\s+/).length;
    const charactersTyped = inputElement.value.length;
    const wpm = Math.round((wordsTyped / timeTaken) * 60);
    const accuracy = calculateAccuracy(quoteElement.textContent, inputElement.value);

    resultElement.innerHTML = `
        Time: ${timeTaken.toFixed(2)}s<br>
        Speed: ${wpm} WPM<br>
        Accuracy: ${accuracy}%<br>
        Characters: ${charactersTyped}
    `;
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    timerElement.textContent = `Time: ${elapsedTime}s`;
}

function calculateAccuracy(original, typed) {
    const originalWords = original.trim().split(/\s+/);
    const typedWords = typed.trim().split(/\s+/);
    let correctWords = 0;

    for (let i = 0; i < Math.min(originalWords.length, typedWords.length); i++) {
        if (originalWords[i] === typedWords[i]) {
            correctWords++;
        }
    }

    return Math.round((correctWords / originalWords.length) * 100);
}

function checkInput() {
    const currentInput = inputElement.value;
    const currentQuote = quoteElement.textContent;

    if (currentInput === currentQuote) {
        endGame();
    }
}

startButton.addEventListener('click', startGame);
inputElement.addEventListener('input', checkInput);