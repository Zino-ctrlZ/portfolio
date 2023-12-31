const board = document.getElementById('board');
const resultContainer = document.getElementById('result');

const numRows = 8;
const numCols = 20;
const totalAreas = numRows * numCols;
const result = 1000000000;
let takes = 0;

async function playGame() {
	while (takes < result) {
		await playRound();
		await new Promise((resolve) => setTimeout(resolve, 5));
		takes++;
	}
}

async function playRound() {
	initializeBoard();
	let stepsTaken = 0;
	let winner = null;

	while (true) {
		stepsTaken++;
		playRandomMove(stepsTaken);

		if (isGameOver(stepsTaken)) {
			winner = board.children[0].value;
			fillRemainingBoard();
			displayResult(takes);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			break;
		}
	}
}

function initializeBoard() {
	board.innerHTML = '';
	for (let i = 0; i < totalAreas; i++) {
		const textarea = document.createElement('div');
		textarea.setAttribute('id', `area${i}`);
		textarea.setAttribute('class', 'cell');
		board.appendChild(textarea);
	}
}

function playRandomMove(stepsTaken) {
	const emptyAreas = Array.from(board.children).filter(
		(area) => area.value === ''
	);
	if (emptyAreas.length > 0) {
		const randomIndex = Math.floor(Math.random() * emptyAreas.length);
		const textarea = emptyAreas[randomIndex];
		const currentPlayer = stepsTaken % 2 === 0 ? 1 : 0;
		textarea.value = currentPlayer;
	}
}

function isGameOver(stepsTaken) {
	for (let i = 0; i < totalAreas; i++) {
		if (checkWinner(i)) {
			return true;
		}
	}

	if (stepsTaken === totalAreas) {
		return true;
	}

	return false;
}

function checkWinner(index) {
	const currentValue = board.children[index].value;
	if (currentValue === '') return false;

	// Check horizontally
	if (index % numCols <= numCols - 6 && checkLine(index, 1, 0)) return true;

	// Check vertically
	if (index >= numCols * 5 && checkLine(index, 0, 1)) return true;

	// Check diagonally
	if (
		index % numCols <= numCols - 6 &&
		index >= numCols * 5 &&
		checkLine(index, 1, -1)
	)
		return true;

	return false;
}

function checkLine(index, deltaX, deltaY) {
	const currentValue = board.children[index].textContent;
	for (let i = 1; i < 6; i++) {
		const newIndex = index + i * (deltaX + deltaY * numCols);

		// Check if newIndex is within bounds
		if (newIndex < 0 || newIndex >= totalAreas) {
			return false;
		}

		if (board.children[newIndex].textContent !== currentValue) {
			return false;
		}
	}
	return true;
}
function fillRemainingBoard() {
	for (let i = 0; i < totalAreas; i++) {
		if (board.children[i].textContent === '') {
			board.children[i].textContent = Math.random() < 0.5 ? 0 : 1;
		}
	}
}

function displayResult(takes) {
	resultContainer.innerHTML = ``;
}

// Start the game
playGame();

window.addEventListener('scroll', (e) => {
	transform();
});

//enable horizontal scroll
function transform() {
	const stickySection = document.querySelector('.sticky');
	const offsetTop = stickySection.parentElement.offsetTop;
	console.log('Window.Scrolly: ', window.scrollY, ' offset');
	let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100;
	percentage = percentage < 0 ? 0 : percentage > 300 ? 300 : percentage;
	const timeline_parent = stickySection.querySelector('.timeline_parent');
	timeline_parent.style.transform = `translate3d(${-percentage}vw, 0, 0)`;
}
