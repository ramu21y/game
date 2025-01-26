// Constants
const TIMER_DURATION = 5; // 5 minutes in seconds
const LEVEL_1_SOLUTION = `<a href="https://www.example.com">This is a link</a>
<address>
  Contact us at:<br>
  <a href="mailto:contact@example.com">Email us</a><br>
  <a href="tel:+1234567890">Call us</a>
</address>
<article>
  <h2>Article Title</h2>
  <p>This is an article with an <a href="#" target="_blank">external link</a>.</p>
</article>`
;

// State
let isGameActive = false;
let timeLeft = TIMER_DURATION;
let timerInterval;
let showingPreview = false;
let levelCompleted = false;

// DOM Elements
const startButton = document.getElementById('startButton');
const timer = document.getElementById('timer');
const timeDisplay = document.getElementById('timeDisplay');
const gameContent = document.getElementById('gameContent');
const gameResult = document.getElementById('gameResult');
const previewButton = document.getElementById('previewButton');
const previewContent = document.getElementById('previewContent');
const codeEditor = document.getElementById('codeEditor');
const outputPreview = document.getElementById('outputPreview');
const errorMessage = document.getElementById('errorMessage');
const submitButton = document.getElementById('submitButton');
const completionBadge = document.getElementById('completionBadge');

// Initialize Lucide icons
lucide.createIcons();

// Helper Functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showError(message) {
    errorMessage.innerHTML = `
        <i data-lucide="alert-triangle"></i>
        <p>${message}</p>
    `;
    errorMessage.classList.remove('hidden');
    lucide.createIcons();
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function checkSolution() {
    const normalizedCode = codeEditor.value.replace(/\s+/g, '').toLowerCase();
    const normalizedSolution = LEVEL_1_SOLUTION.replace(/\s+/g, '').toLowerCase();
    return normalizedCode === normalizedSolution;
}

function updateOutput() {
    outputPreview.innerHTML = codeEditor.value;
}

function showGameResult(victory) {
    const resultHTML = victory
        ? `
            <h3 class="text-xl font-bold flex items-center gap-2">
                <i data-lucide="trophy"></i>
                Crewmate Victory!
            </h3>
            <p class="mt-2">Congratulations! You've successfully completed the challenge!</p>
        `
        : `
            <h3 class="text-xl font-bold flex items-center gap-2">
                <i data-lucide="x-circle"></i>
                Imposter Victory!
            </h3>
            <p class="mt-2">Time's up! The Imposter has won this round.</p>
        `;

    gameResult.innerHTML = resultHTML + `
        <button id="tryAgainButton" class="start-button" style="margin-top: 1rem;">
            <i data-lucide="play"></i>
            Try Again
        </button>
    `;
    
    gameResult.classList.remove('hidden');
    gameResult.classList.add(victory ? 'victory' : 'defeat');
    
    if (victory) {
        completionBadge.classList.remove('hidden');
        levelCompleted = true;
    }

    lucide.createIcons();

    document.getElementById('tryAgainButton').addEventListener('click', startGame);
}

// Game Functions
function startGame() {
    isGameActive = true;
    timeLeft = TIMER_DURATION;
    
    // Reset UI
    codeEditor.value = '';
    outputPreview.innerHTML = '';
    hideError();
    gameResult.classList.add('hidden');
    gameContent.classList.remove('hidden');
    timer.classList.remove('hidden');
    startButton.classList.add('hidden');
    showingPreview = false;
    previewContent.classList.add('hidden');
    previewButton.innerHTML = '<i data-lucide="eye"></i>Show Preview';
    
    // Start timer
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = formatTime(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isGameActive = false;
            showGameResult(false);
        }
    }, 1000);
    
    lucide.createIcons();
}

function handleSubmit() {
    if (!codeEditor.value.trim()) {
        showError('Please write some code before submitting.');
        return;
    }

    if (checkSolution()) {
        clearInterval(timerInterval);
        isGameActive = false;
        showGameResult(true);
        hideError();
    } else {
        showError('The code does not match the expected output. Please check your code and try again.');
    }
}

// Event Listeners
startButton.addEventListener('click', startGame);

previewButton.addEventListener('click', () => {
    showingPreview = !showingPreview;
    previewContent.classList.toggle('hidden');
    previewContent.innerHTML = LEVEL_1_SOLUTION;
    previewButton.innerHTML = showingPreview
        ? '<i data-lucide="eye"></i>Hide Preview'
        : '<i data-lucide="eye"></i>Show Preview';
    lucide.createIcons();
});

codeEditor.addEventListener('input', updateOutput);
submitButton.addEventListener('click', handleSubmit);

// Initialize completion badge if level was previously completed
if (levelCompleted) {
    completionBadge.classList.remove('hidden');
}
