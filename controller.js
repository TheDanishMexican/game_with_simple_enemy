window.addEventListener("load", start);

let lastTime = 0;
const visualPlayerContainer = document.querySelector("#player-container");
const visualPlayer = document.querySelector("#player");
const visualEnemy = document.querySelector("#enemy");
const gameField = document.querySelector("#game_field");
const gameFieldRect = gameField.getBoundingClientRect();

const controls = {
    up: false,
    down: false,
    right: false,
    left: false
};
const playerObj = {
    xPos: 50,
    yPos: 50,
    speed: 200,
    width: 32,
    height: 40
};
const enemyObj = {
    xPos: 208,
    yPos: 200,
    width: 32,
    height: 40,
    movingRight: true,
    speed: 100
};

function start() {
    document.addEventListener("keydown", keyBoardPressed);
    document.addEventListener("keyup", keyBoardReleased);
    requestAnimationFrame(tick);
}

function tick(time) {
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;

    requestAnimationFrame(tick);
    movePlayer(deltaTime);
    moveEnemy(deltaTime);
    displayModelPlayer();
}

function displayModelPlayer() {
    visualEnemy.style.transform = `translate(${enemyObj.xPos}px, ${enemyObj.yPos}px)`;
    visualPlayerContainer.style.transform = `translate(${playerObj.xPos}px, ${playerObj.yPos}px)`;
}

function movePlayer(deltaTime) {
    const newPosition = {
        xPos: playerObj.xPos,
        yPos: playerObj.yPos
    };

    if (controls.up) {
        newPosition.yPos -= playerObj.speed * deltaTime;
    }
    if (controls.down) {
        newPosition.yPos += playerObj.speed * deltaTime;
    }
    if (controls.right) {
        newPosition.xPos += playerObj.speed * deltaTime;
    }
    if (controls.left) {
        newPosition.xPos -= playerObj.speed * deltaTime;
    }

    if (canMove(playerObj, newPosition)) {
        playerObj.xPos = newPosition.xPos;
        playerObj.yPos = newPosition.yPos;
    }

    collision(playerObj, enemyObj);
}

function keyBoardPressed(event) {
    switch (event.key) {
        case "ArrowDown":
            controls.down = true;
            break;
        case "ArrowLeft":
            controls.left = true;
            break;
        case "ArrowUp":
            controls.up = true;
            break;
        case "ArrowRight":
            controls.right = true;
            break;
    }
}

function keyBoardReleased(event) {
    switch (event.key) {
        case "ArrowUp":
            controls.up = false;
            break;
        case "ArrowDown":
            controls.down = false;
            break;
        case "ArrowRight":
            controls.right = false;
            break;
        case "ArrowLeft":
            controls.left = false;
            break;
    }
}

function canMove(playerObj, newPosition) {
    const playerWidth = playerObj.width;
    const playerHeight = playerObj.height;

    if (newPosition.xPos >= 0 &&
        newPosition.xPos + playerWidth <= gameFieldRect.width &&
        newPosition.yPos >= 0 &&
        newPosition.yPos + playerHeight <= gameFieldRect.height)
        return true;

    return false;
}

function collision(playerObj, enemyObj) {
    if (
        playerObj.xPos < enemyObj.xPos + enemyObj.width &&
        playerObj.xPos + playerObj.width > enemyObj.xPos &&
        playerObj.yPos < enemyObj.yPos + enemyObj.height &&
        playerObj.yPos + playerObj.height > enemyObj.yPos
    ) {

        visualPlayer.classList.add('spin');
        setTimeout(() => { visualPlayer.classList.remove("spin"); }, 500);
    }
}

function moveEnemy(deltaTime) {
    const enemyWidth = enemyObj.width;
    const gameWidth = gameFieldRect.width;
    const minX = 0;
    const maxX = gameWidth - enemyWidth;
    const maxDeltaTime = 0.1;

    deltaTime = Math.min(deltaTime, maxDeltaTime);


    if (enemyObj.movingRight) {
        enemyObj.xPos += enemyObj.speed * deltaTime;
        if (enemyObj.xPos + enemyWidth >= maxX) {
            enemyObj.xPos = maxX;
            enemyObj.movingRight = false;
        }
    } else {
        enemyObj.xPos -= enemyObj.speed * deltaTime;
        if (enemyObj.xPos <= minX) {
            enemyObj.xPos = minX;
            enemyObj.movingRight = true;
        }
    }
}