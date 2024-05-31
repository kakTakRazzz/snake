const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const messageElement = document.getElementById('message');

const gridSize = 20;
const canvasSize = 400;
canvas.width = canvas.height = canvasSize;

let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreElement.textContent = `Счёт: ${score}`;
    messageElement.textContent = '';
    placeFood();
}

function placeFood() {
    food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        placeFood();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = 'white';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function update() {
    const head = { x: snake[0].x + direction.x * gridSize, y: snake[0].y + direction.y * gridSize };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Счёт: ${score}`;
        placeFood();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        messageElement.textContent = 'Вы проиграли!';
        setTimeout(resetGame, 3000); // Сброс игры через 3 секунды
    }

    if (snake.length * gridSize === canvasSize * canvasSize) {
        messageElement.textContent = 'Игра окончена, победа!';
        setTimeout(resetGame, 3000); // Сброс игры через 3 секунды
    }
}

function changeDirection(event) {
    const key = event.key;
    if (key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (key === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
}

document.addEventListener('keydown', changeDirection);
setInterval(() => {
    if (direction.x !== 0 || direction.y !== 0) {
        update();
        draw();
    }
}, 100); // Уменьшен интервал для увеличения скорости игры

resetGame();
