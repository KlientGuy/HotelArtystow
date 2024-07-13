<script>
    import { onDestroy, onMount } from "svelte";
    import {HotelArtystowApi} from "../lib/HotelArtystowApi.js";
    import { beesStore } from "../lib/bees-store.js";
    const api = new HotelArtystowApi();

    let highScores = {
        overall: 0,
        mine: 0,
        todays: 0
    }
    let title = 'Graj i zdobywaj pszczoły!';

    /** @type {HTMLCanvasElement} */
    let canvas;
    let ctx;

    let bird = {
        x: 50,
        y: 150,
        width: 40,
        height: 40,
        gravity: 13,
        lift: -4.5,
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
    let isGameOver = true;

    const pipeWidth = 40;
    const pipeGap = 150;
    const pipeFrequency = 175; // Co ile klatek powstaje nowa rura
    const pipeSpeed = 200;

    function resetGame() {
        bird.y = 150;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        frame = 0;
        isGameOver = false;
        createPipe();
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
        pipes.forEach((pipe) => ctx.drawImage(pipeImage, pipe.x, pipe.y, pipe.width, pipe.height));
    }

    /**
    * @param {number} delta 
    */
    function updateBird(delta) {
        bird.velocity += bird.gravity * 100 * delta;
        bird.y += bird.velocity * delta;

        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            isGameOver = true;
            sendScore();
        }
    }

    /**
    * @param {number} deltaTime 
    */
    function updatePipes(deltaTime) {
        pipes.forEach((pipe) => {
            pipe.x -= pipeSpeed * deltaTime;
        });

        if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
            pipes.splice(0, 2);
            score++;
        }

        if(pipes[pipes.length - 1].x < (canvas.width / 3) * 2) {
            createPipe();
        }

        // if (frame % pipeFrequency === 0) {
            // createPipe();
        // }
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
            ctx.fillText("Naciśnij spacje lub zacznij klikać", canvas.width / 2, canvas.height / 2);
        }
    }

    let lastFrameTime;
    /**
    * @param {number} timestamp 
    */
    function gameLoop(timestamp) {
        timestamp |= 0;

        if(!lastFrameTime) {
            lastFrameTime = timestamp;
        }

        draw();

        const deltaTime = (timestamp - lastFrameTime) / 1000;
        lastFrameTime = timestamp;

        if (isGameOver) {
            handle = requestAnimationFrame(gameLoop);
            return; 
        }

        if(jumpQueued)
            jump(deltaTime);

        updateBird(deltaTime);
        updatePipes(deltaTime);

        checkCollision();
        handle = requestAnimationFrame(gameLoop);
    }

    let jumpQueued = false;
    function queueJump() {
        jumpQueued = true;
    }

    /**
    * @param {number} delta 
    */
    function jump(delta) {
        bird.velocity = bird.lift * 100;
        jumpQueued = false;
    }

    /**
    * @param {KeyboardEvent} event 
    */
    function handleKeyPress(event) {
        if (event.code === "Space") {
            isGameOver ? resetGame() : queueJump();
        }
    }

    function handleTap() {
        isGameOver ? resetGame() : queueJump()
    }

    let handle = requestAnimationFrame(gameLoop);

    async function sendScore() {
        if(score >= 10) {

            if(score > highScores.mine) {
                highScores.mine = score;
            }

            if(score > highScores.overall) {
                highScores.overall = score;
            }

            if(score > highScores.todays) {
                highScores.todays = score;
            }

            const res = await api.sendBeePoints(score);
            if(!res.status) {
                const mess = JSON.parse(res.message);
                title = mess.message;
                return;
            }

            $beesStore += res.data.beesAdded;
        }
    }

    onMount(async () => {
        canvas = document.querySelector("#gameCanvas");
        ctx = canvas.getContext("2d");

        document.addEventListener("keydown", handleKeyPress);
        canvas.addEventListener('mousedown', handleTap);
        canvas.addEventListener('touchstart', handleTap);

        const res = await api.getFlappyBeeHighScores();
        if(res.status) {
            highScores = res.data;
        }
    });

    onDestroy(() => {
        cancelAnimationFrame(handle);
        document.removeEventListener('keydown', handleKeyPress);
        canvas.removeEventListener('mousedown', handleTap);
        canvas.removeEventListener('touchstart', handleTap);
    })
</script>

<div class="bg-primary game-container">
    <h1 class="game-title">{title}</h1>
    <canvas id="gameCanvas" width="800" height="500"></canvas>
    <div class="row justify-center score-title" style="">
        Highscore
    </div>
    <div class="row high-scores space-around w-100">
        <span class="overall">Ogólnie: {highScores.overall ?? 0}</span>
        <span class="mine">Mój: {highScores.mine ?? 0}</span>
        <span class="todays">Dzisiejszy: {highScores.todays ?? 0}</span>
    </div>
</div>

<style>

    .high-scores {
        font-size: 1.8rem;
    }

    .score-title {
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 20px;
        font-size: 2rem;
    }

    .game-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /* height: 70vh; */
        margin-top: 100px;
        width: 60vw;
        border-radius: 35px;
        padding: 1rem;
    }

    canvas {
        border: 1px solid #ffffff;
    }

    h1 {
        margin-bottom: 20px;
    }

    @media only screen and (max-width: 500px) {
        .game-container {
            width: 90vw;
        }

        .game-title {
            font-size: 1.2rem;
        }

        #gameCanvas {
            width: 420px;
            height: 500px;
        }
    }
</style>
