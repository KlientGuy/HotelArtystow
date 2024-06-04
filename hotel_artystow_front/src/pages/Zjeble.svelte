<script>
    import { HotelArtystowApi } from '../lib/HotelArtystowApi';
    import Loading from '../lib/Loading.svelte';
    import * as Types from '../lib/types';
    
    let lives = ['', '', ''];
    const goodLife = '❤️';
    const lostLife = '🖤';
    const winLife = '💛';
    let leftLives = 2;

    const api = new HotelArtystowApi();

    /** @type {Types.ZjebleUserSession} */
    let userSession;

    let imageUrl = '/public/img/profile_pics/patryk.jpg';
    let inputDisabled = false;

    async function getSession() {
        const res = await api.getZjebleUserSession();

        userSession = res.data;

        lives.fill(goodLife, 0, userSession.livesLeft);
        lives.fill(lostLife, userSession.livesLeft, 3);
        
        await fetchImage();
    }

    async function fetchImage() {
        const imgRes = await api.getZjebleImage();
        imageUrl = window.URL.createObjectURL(imgRes.data);
    }

    /**
    * @param {number} lifeIndex 
    */
    async function removeHeartCool(lifeIndex) {
        lives[lifeIndex] = lostLife;
        for(let i = 0; i < 3; i++) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    lives[lifeIndex] = i % 2 == 1 ? lostLife : goodLife;
                    resolve();
                }, 180);
            })
        }
        lives[lifeIndex] = lostLife;
    }

    /**
    * @param {SubmitEvent & {currentTarget: EventTarget & HTMLFormElement}} e 
    */
    async function handleAnswerSubmit(e) {
        const answer = (new FormData(e.currentTarget)).get("gameAnswer").toString();

        const res = await api.submitZjebleAnswer(answer);

        if(!res.data.status) {
            removeHeartCool(leftLives);
            leftLives--;
            await fetchImage();
        }
        else {
            lives = [winLife, winLife, winLife];
        }

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
{#await getSession()}
    <div class="main-game bg-primary card-rounded">
        <div class="row justify-center">
            <div class="col justify-center">
                <Loading/>
            </div>
        </div>
    </div>
{:then}
    <div class="main-game bg-primary card-rounded">
        <div class="row justify-center">
            <div class="col justify-center" style="">
                <span class="game-title">
                    Zjeble
                </span>
                <div class="game-photo">
                    <img class="card-rounded" src="{imageUrl}" width="512" height="512" alt="">
                </div>
                <form action="#" on:submit|preventDefault={(e) => handleAnswerSubmit(e)}>
                    <div class="game-input row justify-center">
                        <div class="form-group">
                            <input name="gameAnswer" disabled={inputDisabled} class="form-field" id="game-answer" type="text" placeholder="Zgadnij kto to">
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
{/await}
