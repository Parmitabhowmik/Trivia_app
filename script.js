const API_BASE_URL = "https://the-trivia-api.com/v2";
const players = {
  player1: { name: "", score: 0 },
  player2: { name: "", score: 0 },
};
let currentPlayer = "player1",
  questions = [],
  questionIndex = 0;

//start game
document.getElementById("start-game").onclick = async () => {
  const p1 = document.getElementById("player1-name").value;
  const p2 = document.getElementById("player2-name").value;
  if (!p1 || !p2) {
    return alert("Enter both player names!");
  } else {
    players.player1.name = p1;
    players.player2.name = p2;
    toggleView("player-setup", "category-selection");
    loadCategories();
  }
};

async function loadCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  const categories = await res.json();
  document.getElementById("category-list").innerHTML = Object.entries(
    categories
  )
    .map(([key, value]) => `<option value="${key}">${value}</option>`)
    .join("");
}

document.getElementById("select-category").onclick = async () => {
  const category = document.getElementById("category-list").value;
  if (!category) {
    return alert("Select a category!");
  } else {
    toggleView("category-selection", "question-section");
    questions = await fetchQuestions(category);
    displayQuestion();
  }
};

async function fetchQuestions(category) {
  const res = await fetch(
    `${API_BASE_URL}/questions?categories=${category}&limit=10`
  );
  return res.json();
}

function displayQuestion() {
  const question = questions[questionIndex];
  if (!question) {
    return endGame();
  } else {
    document.getElementById("current-player").innerText = `Current Player: ${players[currentPlayer].name}`;
    document.getElementById("question-text").innerText = question.question.text;
    document.getElementById("answer-options").innerHTML = [...question.incorrectAnswers,question.correctAnswer,].sort(() => Math.random() - 0.5).map((opt) =>`<button onclick="checkAnswer('${opt}', '${question.correctAnswer}')">${opt}</button>`).join("");
    document.getElementById("next-question").classList.add("hidden");
  }
}

function checkAnswer(selected, correct) {
  if (selected === correct) {
    players[currentPlayer].score += 1;
  } else {
    currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
    questionIndex++;
    document.getElementById("next-question").classList.remove("hidden");
  }
}

document.getElementById("next-question").onclick = displayQuestion;

function endGame() {
  toggleView("question-section", "results-section");
  const { player1, player2 } = players;
  document.getElementById(
    "final-scores"
  ).innerText = `${player1.name}: ${player1.score}, ${player2.name}: ${player2.score}`;
  document.getElementById("winner").innerText =
    player1.score > player2.score
      ? `${player1.name} wins!`
      : player2.score > player1.score
      ? `${player2.name} wins!`
      : "It's a tie!";
}

document.getElementById("restart-game").onclick = () => {
  Object.keys(players).forEach((p) => (players[p].score = 0));
  currentPlayer = "player1";
  questionIndex = 0;
  toggleView("results-section", "player-setup");
};

function toggleView(hide, show) {
  document.getElementById(hide).classList.add("hidden");
  document.getElementById(show).classList.remove("hidden");
}
