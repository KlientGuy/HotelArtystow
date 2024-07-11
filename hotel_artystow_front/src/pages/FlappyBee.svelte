<script>
    import { onDestroy, onMount } from "svelte";
    import {HotelArtystowApi} from "../lib/HotelArtystowApi.js";
    import { beesStore } from "../lib/bees-store.js";
    const api = new HotelArtystowApi();

    let title = 'Graj i zdobywaj pszczoły!';

    /** @type {HTMLCanvasElement} */
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
    let isGameOver = true;

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
        bird.velocity += bird.gravity * delta;
        bird.y += bird.velocity;

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
            pipe.x -= 2 *deltaTime;
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

        const deltaTime = (timestamp - lastFrameTime) / 10;
        lastFrameTime = timestamp;

        draw();

        if (isGameOver) {
            handle = requestAnimationFrame(gameLoop);
            return; 
        }

        if(jumpQueued)
            jump(deltaTime);

        updateBird(deltaTime);
        updatePipes(deltaTime);
        checkCollision();
        frame++;
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
        bird.velocity = bird.lift * delta;
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
            const res = await api.sendBeePoints(score);
            if(!res.status) {
                const mess = JSON.parse(res.message);
                title = mess.message;
                return;
            }

            $beesStore += res.data.beesAdded;
        }
    }

    onMount(() => {
        canvas = document.querySelector("#gameCanvas");
        ctx = canvas.getContext("2d");
        document.addEventListener("keydown", handleKeyPress);
        canvas.addEventListener('mousedown', handleTap);
        canvas.addEventListener('touchstart', handleTap);
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
