<script>
    import { HotelArtystowApi } from '../lib/HotelArtystowApi';
    import Loading from '../lib/Loading.svelte';
    import { beesStore } from '../lib/bees-store';
    import * as Types from '../lib/types';
    
    let lives = ['', '', ''];
    const goodLife = '❤️';
    const lostLife = '🖤';
    const winLife = '💛';
    let leftLives = 2;

    const api = new HotelArtystowApi();

    let responseMessage = 'Zjeble';

    /** @type {Types.ZjebleUserSession} */
    let userSession;

    let imageUrl = '';
    let inputDisabled = false;

    const badAudio = new Audio('/audio/familiada_bad.mp3');
    const winningAudio = new Audio('/audio/cheer.mp3');
    winningAudio.volume = 0.25;

    async function getSession() {
        const res = await api.getZjebleUserSession();

        if(!res.status) {
            responseMessage = 'Coś się wyjebało';
            return;
        }
        userSession = res.data;

        if(userSession.endedAt && userSession.livesLeft > 0) {
            lives = [winLife, winLife, winLife];
        }
        else {
            lives.fill(goodLife, 0, userSession.livesLeft);
            lives.fill(lostLife, userSession.livesLeft, 3);
            leftLives = userSession.livesLeft - 1;
        }
        
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
        if(answer == '')
            return;

        /** @type {HTMLInputElement} */
        const input = document.querySelector('#game-answer');
        input.value = null;

        const res = await api.submitZjebleAnswer(answer);

        responseMessage = res.data.message;
        if(!res.data.status) {

            if(res.data.noAction)
                return;

            removeHeartCool(leftLives);
            badAudio.currentTime = 0;
            badAudio.play();
            leftLives--;
            await fetchImage();
        }
        else {
            winningAudio.play();
            lives = [winLife, winLife, winLife];
            $beesStore += (leftLives + 1) * 10;
            await fetchImage();
        }

    }
</script>
<style>
    .main-game {
        width: 60vw;
        height: 80vh;
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

    @media only screen and (max-width: 500px) {
        .main-game {
            height: auto;
            margin-top: 0;
        }
    }
</style>
{#await getSession()}
    <div class="main-game bg-primary card-rounded">
        <div class="row row-500 justify-center">
            <div class="col justify-center">
                <Loading/>
            </div>
        </div>
    </div>
{:then}
    <div class="main-game bg-primary card-rounded">
        <div class="row row-500 justify-center">
            <div class="col justify-center" style="">
                <span class="game-title">
                    {responseMessage} 
                </span>
                <div class="game-photo">
                    <picture>
                        <source media="(max-width: 350px)" width="128" height="128" srcset="{imageUrl}">
                        <source media="(max-width: 850px)" width="256" height="256" srcset="{imageUrl}">
                        <source media="(min-width: 850px)" width="512" height="512" srcset="{imageUrl}">
                        <img class="card-rounded" src="{imageUrl}" alt="">
                    </picture>
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
