const board = document.getElementById('board');
const resultContainer = document.getElementById('result');

const numRows = 8;
let numCols = 20;

const totalAreas = numRows * numCols;
const result = 1000000000;
let takes = 0;
const home = document.getElementById('home');
const contact = document.getElementById('contact');
let sticky_parent = document.getElementById('sticky_parent');
let timeline_parent = document.getElementsByClassName('timeline_parent');
timeline_parent = timeline_parent[0];
if (home.clientWidth < 500) {
	timeline_parent.style.width = '600vw';
	sticky_parent.style.height = '600vh';
}

console.log(
	'home inner height: ',
	home.innerHeight,
	' client Width: ',
	home.clientWidth
);
console.log(
	'contact inner height: ',
	contact.innerHeight,
	' client width: ',
	contact.clientWidth
);
console.log(
	'window client width: ',
	window.clientWidth,
	' window inner width: ',
	window.innerWidth
);
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

window.addEventListener('resize', () => {
	if (home.clientWidth < 500) {
		timeline_parent.style.width = '600vw';
		sticky_parent.style.height = '600vh';
	}

	if (home.clientWidth > 500) {
		timeline_parent.style.width = '200vw';
		sticky_parent.style.height = '200vh';
	}
});
//enable horizontal scroll
function transform() {
	let time_parent = document.getElementsByClassName('timeline_parent');
	time_parent = time_parent[0];
	console.log('time_parent: ', time_parent);
	let max_width = 200;
	if (time_parent.style.width == '600vw') {
		max_width = 600;
	}
	console.log('max_width in transform: ', max_width);
	const stickySection = document.querySelector('.sticky');
	const offsetTop = stickySection.parentElement.offsetTop;
	let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100;
	percentage =
		percentage < 0 ? 0 : percentage > max_width ? max_width : percentage;
	const timeline_parent = stickySection.querySelector('.timeline_parent');
	timeline_parent.style.transform = `translate3d(${-percentage}vw, 0, 0)`;
}
