const holdBtn = document.getElementById("hold");
const rollBtn = document.getElementById("roll");

holdBtn.addEventListener("click", hold);
rollBtn.addEventListener("click", roll);

let p1holdValue = 0; // Amount saved from previous turns
let p2holdValue = 0; // Amount saved from previous turns
let turnTotal = 0; // Amount added to score
let p1Turn = true; // If it is Player 1's turn, set to true

// Function to "hold" player position
function hold() {
  switchPlayer();
}

// Function to roll dice
function roll() {
  const faceValue = Math.floor(Math.random() * 6) + 1;
  const output = "&#x268" + (faceValue - 1) + "; ";
  const die = document.getElementById("die");
  die.innerHTML = output;

  // Score Logic
  if (faceValue != 1) {
    turnTotal += faceValue;
    updateScore(turnTotal);
  } else {
    turnTotal = 0;
    updateScore(0);
    switchPlayer();
  }
}

// Function to initialize player or update score values
function initializePlayer(player, setScore, turnValue) {
  holdString = "p1-hold";
  scoreString = "p1-score"
  if (player === 2) {
    holdString = "p2-hold";
    scoreString = "p2-score"
  }

  document.getElementById(holdString).style.width = turnValue + "%";
  document.getElementById(holdString).setAttribute("aria-valuenow", turnValue);
  document.getElementById(holdString).innerText = turnValue;
  document.getElementById(scoreString).style.width = setScore + "%";
  document.getElementById(scoreString).setAttribute("aria-valuenow", setScore);
  document.getElementById(scoreString).innerText = setScore;
}

// Function to update the score and check for a winner
function updateScore(turnValue) {
  if (p1Turn) {
    initializePlayer(1, p1holdValue, turnValue);
  } else {
    initializePlayer(2, p2holdValue, turnValue);
  }

  // Check if there is a winner within the 2 players
  if (p1holdValue + turnValue >= 100 && p1Turn) {
    initializePlayer(1, 100, 0);
    configureWinner();
  }
  if (p2holdValue + turnValue >= 100 && !p1Turn) {
    initializePlayer(2, 100, 0);
    configureWinner();
  }
}

// Switches the player, turns total
function switchPlayer() {
  const textChange = document.getElementById("result");

  if (p1Turn) {
    // Change UI
    p1Turn = false;
    textChange.innerText = "Player-2 Turn!";

    // Update Player 1 Values
    p1holdValue += turnTotal;
    initializePlayer(1, p1holdValue, 0);
  } else {
    // Change UI
    p1Turn = true;
    textChange.innerText = "Player-1 Turn!";

    // Update Player 2 Values
    p2holdValue += turnTotal;
    initializePlayer(2, p2holdValue, 0);
  }

  // Reset turn value
  turnTotal = 0;
}

// Function to complete the winner status
function configureWinner() {
  if (p1Turn) { // Player 1 wins (can only win on turn)
    // Update the bar
    document.getElementById("result").innerText = "Player-1 won!"
    document.getElementById("p1-score").classList.add("bg-success");
    document.getElementById("p1-score").innerText = "100 🎉";
  } else { // Player 2 wins
    // Update the bar
    document.getElementById("result").innerText = "Player-2 won!"
    document.getElementById("p2-score").classList.add("bg-success");
    document.getElementById("p2-score").innerText = "100 🎉";
  }
  // Disable the buttons
  document.getElementById("hold").disabled = true;
  document.getElementById("roll").disabled = true;
}

// Load the page!
initializePlayer(1, 0, 0);
initializePlayer(2, 0, 0);


