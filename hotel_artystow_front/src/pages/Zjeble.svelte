<script>
    const lives = ['❤️', '❤️', '❤️'];
    const lostLife = '🖤';
    let leftLives = 2;

    function handleAnswerSubmit() {
        lives[leftLives] = lostLife;
        leftLives--;

        /** @type {HTMLInputElement} */
        const input = document.querySelector('#game-answer');
        input.value = null;
    }
</script>
<style>
    .main-game {
        width: 60vw;
        height: 80vh;
        margin-top: 10vh;
        padding: 1.2rem;
    }

    .game-title {
        font-size: 2rem;
        margin-bottom: 10px
    }

    .game-lives {
        font-size: 3rem;
        justify-content: space-evenly;
        width: 70%;
    }
</style>
<div class="main-game bg-primary card-rounded">
    <div class="row justify-center">
        <div class="col justify-center" style="">
            <span class="game-title">
                Zjeble
            </span>
            <div class="game-photo">
                <img class="card-rounded" src="/public/img/profile_pics/patryk.jpg" width="512" height="512" alt="">
            </div>
            <form action="#" on:submit|preventDefault={handleAnswerSubmit}>
                <div class="game-input row justify-center">
                    <div class="form-group">
                        <input class="form-field" id="game-answer" type="text" placeholder="Zgadnij kto to">
                        <label for="game-answer" class="form-label">Zgadnij kto to</label>
                    </div>
                </div>
            </form>
            <div class="row justify-center">
                <div class="game-lives row">
                    <div class="single-life" data-index="1">
                        {lives[0]}
                    </div>
                    <div class="single-life" data-index="2">
                        {lives[1]}
                    </div>
                    <div class="single-life" data-index="3">
                        {lives[2]}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
