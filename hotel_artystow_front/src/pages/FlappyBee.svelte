<script>
    import { onMount } from "svelte";

    let canvas;
    let ctx;

    let bird = {
        x: 50,
        y: 150,
        width: 40,
        height: 40,
        gravity: 0.1 ,
        lift: -4,
        velocity: 0,
    };

    let birdImage = new Image();
    birdImage.src = "/public/img/emojis/bee_right_emoji.png";

    let pipeImage = new Image();
    pipeImage.src = "/public/img/flappy_bee/wood_pipe.png";

    let backgroundImage = new Image();
    backgroundImage.src = "/public/img/flappy_bee/flappy_background.png";

    let pipes = [];
    let frame = 0;
    let score = 0;
    let isGameOver = false;
    let isGameRunning = false;

    const pipeWidth = 40;
    const pipeGap = 150;
    const pipeFrequency = 150; // Co ile klatek powstaje nowa rura

    function resetGame() {
        bird.y = 150;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        frame = 0;
        isGameOver = false;
        isGameRunning = true;
        gameLoop();
    }

    function createPipe() {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({
            x: canvas.width,
            y: 0,
            width: pipeWidth,
            height: pipeHeight,
        });
        pipes.push({
            x: canvas.width,
            y: pipeHeight + pipeGap,
            width: pipeWidth,
            height: canvas.height - pipeHeight - pipeGap,
        });
    }

    function drawBird() {
        ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    }

    function drawPipes() {
        // ctx.fillStyle = "green";
        pipes.forEach((pipe) => {
                ctx.drawImage(pipeImage, pipe.x, pipe.y, pipe.width, pipe.height);
        });
    }

    function updateBird() {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            isGameOver = true;
            isGameRunning = false;
        }
    }

    function updatePipes() {
        pipes.forEach((pipe) => {
            pipe.x -= 2;
        });

        if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
            pipes.splice(0, 2);
            score++;
        }

        if (frame % pipeFrequency === 0) {
            createPipe();
        }
    }

    function checkCollision() {
        for (let i = 0; i < pipes.length; i++) {
            if (
                bird.x < pipes[i].x + pipes[i].width &&
                bird.x + bird.width > pipes[i].x &&
                bird.y < pipes[i].y + pipes[i].height &&
                bird.y + bird.height > pipes[i].y
            ) {
                isGameOver = true;
                isGameRunning = false;
            }
        }
    }

    function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            drawPipes();
            drawBird();
            ctx.fillStyle = "black";
            ctx.fillText(`Score: ${score}`, 10, 20);

            if (isGameOver) {
            ctx.fillStyle = "red";
            ctx.font = "30px Arial";
            ctx.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2);
            }
    }

    function gameLoop() {
        if (!isGameRunning) return;

        updateBird();
        updatePipes();
        checkCollision();
        draw();
        frame++;
        requestAnimationFrame(gameLoop);
    }

    function handleKeyPress(event) {
        if (event.code === "Space") {
            if (isGameOver) {
                resetGame();
            } else if (!isGameRunning) {
                isGameRunning = true;
                gameLoop();
            } else {
                bird.velocity = bird.lift;
            }
        }
    }

    onMount(() => {
        canvas = document.getElementById("gameCanvas");
        ctx = canvas.getContext("2d");
        document.addEventListener("keydown", handleKeyPress);
    });
</script>

<div class="bg-primary game-container">
        <h1>Graj i zdobywaj pszczoły!</h1>
        <canvas id="gameCanvas" width="900px" height="500"></canvas>
</div>

<style>
    .game-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 70vh;
        width: 60vw;
        border-radius: 35px;
        padding: 1rem;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: #f0f0f0;
    }

    canvas {
        border: 1px solid #ffffff;
    }

    h1 {
        margin-bottom: 20px;
    }

    button {
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
    }

    button:disabled {
        cursor: not-allowed;
    }
</style>
