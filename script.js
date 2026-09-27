const road = document.querySelector("#road");
const playerCar = document.querySelector("#player-car");

const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");

const startBtn = document.querySelector("#start-btn");
const resetBtn = document.querySelector("#reset-btn");

let playerPosition = 135;
let score = 0;
let highScore = localStorage.getItem("carHighScore") || 0;

let gameRunning = false;
let gameLoop;
let enemyCars = [];

highScoreElement.innerText = highScore;
function startGame() {
    if (gameRunning) return;

    gameRunning = true;
    score = 0;
    playerPosition = 135;

    scoreElement.innerText = score;
    playerCar.style.left = playerPosition + "px";

    enemyCars.forEach(car => car.remove());
    enemyCars = [];

    gameLoop = setInterval(updateGame, 30);

    createEnemy();
}
document.addEventListener("keydown", function(event) {

    if (!gameRunning) return;

    if (event.key === "ArrowLeft") {
        playerPosition -= 15;

        if (playerPosition < 10) {
            playerPosition = 10;
        }

        playerCar.style.left = playerPosition + "px";
    }

    if (event.key === "ArrowRight") {
        playerPosition += 15;

        if (playerPosition > 255) {
            playerPosition = 255;
        }

        playerCar.style.left = playerPosition + "px";
    }
});
function createEnemy() {

    if (!gameRunning) return;

    const enemy = document.createElement("div");

    enemy.innerText = "🚙";

    enemy.style.position = "absolute";
    enemy.style.fontSize = "45px";
    enemy.style.top = "-50px";

    const randomPosition = Math.floor(Math.random() * 250) + 10;

    enemy.style.left = randomPosition + "px";

    road.appendChild(enemy);

    enemyCars.push(enemy);
}
function updateGame() {

    enemyCars.forEach((enemy, index) => {

        let currentTop = parseInt(enemy.style.top);

        currentTop += 6;

        enemy.style.top = currentTop + "px";
        if (checkCollision(playerCar, enemy)) {
            gameOver();
        }
        if (currentTop > 500) {

            enemy.remove();

            enemyCars.splice(index, 1);

            score++;

            scoreElement.innerText = score;

            if (score > highScore) {
                highScore = score;

                highScoreElement.innerText = highScore;

                localStorage.setItem(
                    "carHighScore",
                    highScore
                );
            }

            createEnemy();
        }
    });
}
function checkCollision(car1, car2) {

    const rect1 = car1.getBoundingClientRect();
    const rect2 = car2.getBoundingClientRect();

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}
function gameOver() {

    gameRunning = false;

    clearInterval(gameLoop);

    alert("🏁 Game Over! Your Score: " + score);
}
resetBtn.addEventListener("click", function() {

    clearInterval(gameLoop);

    enemyCars.forEach(car => car.remove());

    enemyCars = [];

    score = 0;
    playerPosition = 135;

    scoreElement.innerText = score;
    playerCar.style.left = playerPosition + "px";

    gameRunning = false;
});
startBtn.addEventListener("click", startGame);