<script>
    import { onMount } from "svelte";
    import {HotelArtystowApi} from "../lib/HotelArtystowApi.js";
    const api = new HotelArtystowApi();

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
    birdImage.src = "/img/emojis/bee_right_emoji.png";

    let pipeImage = new Image();
    pipeImage.src = "/img/flappy_bee/wood_pipe.png";

    let backgroundImage = new Image();
    backgroundImage.src = "/img/flappy_bee/flappy_background.png";

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

    function updateBird(delta) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity*delta;

        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            isGameOver = true;
            isGameRunning = false;
            sendScore();
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
                if(score >= 10){
                    sendScore();
                }
            }
        }
    }

    function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.fillText(`Wynik: ${score}`, canvas.width / 2 , 50);
            drawPipes();
            drawBird();

            if (isGameOver) {
            ctx.fillStyle = 'red';
            // ctx.fillRect(canvas.width / 2 - 230, canvas.height /2, canvas.width / 2, canvas.height / 2);
            ctx.fillStyle = "white";
            ctx.font = '40px "Baloo 2", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("Kliknij spacje", canvas.width / 2, canvas.height / 2);
            }
    }

    let lastFrameTime;
    function gameLoop(timestamp) {

            if(!lastFrameTime) {
                lastFrameTime = timestamp;
            }

        let deltaTime = (timestamp - lastFrameTime) / 1000;

        if (!isGameRunning) return;

        updateBird(deltaTime);
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
    async function sendScore() {
            if(score >= 10){
                    await api.sendBeePoints(score);
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
