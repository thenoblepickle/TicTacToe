const cells = document.querySelectorAll(".cell");

const outcomeWindow = document.querySelector("#gameoutcome")
const winner = document.querySelector("#winner")
const restartBtn = document.querySelector("#restartBtn");

const statusText = document.querySelector("#current-player");
const playerWins = document.querySelector("#player-wins");
const ties = document.querySelector("#ties");
const computerWins = document.querySelector("#computer-wins");

let playerPoints = 0;
let tiePoints = 0;
let computerPoints = 0;

playerWins.textContent = `${playerPoints}`;
ties.textContent = `${tiePoints}`;
computerWins.textContent = `${computerPoints}`;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "x";
let running = false;

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (options[cellIndex] != "" || !running || currentPlayer !== "x") {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    const icon = cell.querySelector(`.fa-${currentPlayer}`);
    if(icon) icon.style.display = "block";
}

function changePlayer() {
    currentPlayer = (currentPlayer == "x") ? "o" : "x";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function computerMove() {
    if (!running) return;

    let move = findBestMove("o");
    if (move === null) move = findBestMove("x");

    if (move === null && options[4] === "") {
        move = 4;
    }

    if (move === null) {
        let availableIndices = options.map((v, i) => v === "" ? i : null).filter(v => v !== null);
        move = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    }

    if (move !== null) {
        const targetCell = document.querySelector(`.cell[cellIndex="${move}"]`);
        updateCell(targetCell, move);
        checkWinner();
    }
}

function findBestMove(symbol) {
    for (let condition of winConditions) {
        let a = options[condition[0]];
        let b = options[condition[1]];
        let c = options[condition[2]];

        if (a === symbol && b === symbol && c === "") return condition[2];
        if (a === symbol && c === symbol && b === "") return condition[1];
        if (b === symbol && c === symbol && a === "") return condition[0];
    }
    return null;
}

function checkWinner() {
    let roundWon = false;

    for (let condition of winConditions) {
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA == "" || cellB == "" || cellC == "") continue;
        if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer.toUpperCase()} Wins!`;
        if (currentPlayer == "x") {
            playerPoints++;
            updatePoints;
        } else {
            computerPoints++;
            updatePoints();
        }
        running = false;
    } else if (!options.includes("")) {
        statusText.textContent = `Tie!`;
        tiePoints++;
        updatePoints();
        running = false;
    } else {
        changePlayer();
        if (currentPlayer === "o") {
            setTimeout(computerMove, 500);
        }
    }
}

function showGameoutcome() {
    outcomeWindow.style.display = "block";
}

function hideGameoutcome() {
    outcomeWindow.style.display = "none";
}

function updatePoints() {
    playerWins.textContent = `${playerPoints}`;
    ties.textContent = `${tiePoints}`;
    computerWins.textContent = `${computerPoints}`;
}

function restartGame() {
    currentPlayer = "x";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => {
        const icons = cell.querySelectorAll('i');
        icons.forEach(icon => icon.style.display = "none");
    });
    running = true;
}
