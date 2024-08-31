const rock = document.getElementById("rock");
const paper = document.getElementById("paper");
const scissors = document.getElementById("scissors");
const choices = ["rock", "paper", "scissors"];
const result = document.getElementById("result");
const message = document.getElementById("message");

function play(event) {
    const userChoice = event.target.id;
    message.innerHTML = "You selected " + userChoice + "!" + "<br/>";

    const randomNumber = Math.floor(Math.random() * choices.length);
    const computerChoice = choices[randomNumber];
    message.innerHTML += "The computer chose " + computerChoice + "!";

    if (computerChoice === userChoice) {
        result.innerHTML = "Draw!";
      } else if (computerChoice === "rock" && userChoice === "paper") {
        result.innerHTML = "You win!";
      } else if (computerChoice === "rock" && userChoice === "scissors") {
        result.innerHTML = "You lost!";
      } else if (computerChoice === "paper" && userChoice === "scissors") {
        result.innerHTML = "You win!";
      } else if (computerChoice === "paper" && userChoice === "rock") {
        result.innerHTML = "You lose!";
      } else if (computerChoice === "scissors" && userChoice === "rock") {
        result.innerHTML = "You win!";
      } else if (computerChoice === "scissors" && userChoice === "paper") {
        result.innerHTML = "You lose!";    
    }
}

rock.addEventListener("click", play);
paper.addEventListener("click", play);
scissors.addEventListener("click", play)