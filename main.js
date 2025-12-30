const cells = document.querySelectorAll(".cell");
const restartBtn = document.querySelector("#restartBtn");
const statusText = document.querySelector("#current-player");
const playerWins = document.querySelector("#player-wins");
const ties = document.querySelector("#ties");
const computerWins = document.querySelector("#computer-wins");

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

    let availableIndices = [];
    options.forEach((val, index) => {
        if (val === "") availableIndices.push(index);
    });

    if (availableIndices.length > 0) {
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const targetCell = document.querySelector(`.cell[cellIndex="${randomIndex}"]`);
        
        updateCell(targetCell, randomIndex);
        checkWinner();
    }
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
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
        running = false;
    } else if (!options.includes("")) {
        statusText.textContent = `Tie!`;
        running = false;
    } else {
        changePlayer();
        if (currentPlayer === "o") {
            setTimeout(computerMove, 500);
        }
    }
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
