<script>
    import { elasticIn } from "svelte/easing";
    import { HotelArtystowApi } from "../lib/HotelArtystowApi";
    import Loading from "../lib/Loading.svelte";
    import DivisionCanvas from "../lib/DivisionCanvas.svelte";
    import * as Types from '../lib/types';

    /** @type {Types.RouterParams} */
    export let params;

    /** @type {Types.UserData} */
    let userData;

    let isEditing = false;
    let profileDesc = "Lorem ipusm Lorem ipusm Lorem ipusm Lorem ipusm Lorem ipusm Lorem ipusm Lorem ipusm";
    let profileError = null;

    const api = new HotelArtystowApi();

    let counters = {
        loginStreak: 0,
        bees: 0
    }

    async function getUserData() {
        const res = await api.getProfileData(params.route.id);

        if(!res.status) {

        }

        userData = res.data;
        profileDesc = userData.description ?? '';

        requestAnimationFrame((timestamp) => startCounter(timestamp, 'loginStreak'));
        requestAnimationFrame((timestamp) => startCounter(timestamp, 'bees'));
    }

    let start;
    let end;
    let counterDuration = 1000 * 5;
    let countersVisible = false;

    /**
    * @param {number} startTimestamp
    * @param {string} prop 
    */
    function startCounter(startTimestamp, prop) {
        const valueToGo = userData.userStatistics[prop];
        // userData.userStatistics[prop] = '';
        start = startTimestamp;
        end = startTimestamp + 5000;
        incrementCounter(startTimestamp, prop, valueToGo);
    }

    /**
    * @param {number} now 
    * @param {string} prop 
    */
    function incrementCounter(now, prop, val) {
        if(now > end) {
            countersVisible = true;
            counters[prop] = '';
            return;
        }

        let progress = (now - start) / counterDuration;
        let progressVal = val * (1 - Math.pow(1 - progress, 3)) //EaseOut cubic;

        counters[prop] = progressVal.toFixed(0);

        requestAnimationFrame((timestamp) => incrementCounter(timestamp, prop, val));
    }

    function editProfile() {
        isEditing = true;
    }

    /**
    * @param {HTMLElement} e 
    */
    const focusDescField = (e) => e.focus();

    /**
    * @param {Event & {target: HTMLTextAreaElement}} e 
    */
    async function saveDescription(e) {
        profileError = null;
        const newDesc = e.target.value;
        isEditing = false

        const res = await api.saveProfileDescription(newDesc);

        if(!res.status) {
            profileError = "Nie udało się zapisać opisu";
            return;
        }

        profileDesc = newDesc;
    }
        
</script>

<style>
    .invisible {
        visibility: hidden;
    }


   .profile-container {
       width: 70vw;
       height: 70vh;
       display: flex;
       flex-direction: column;
       border-radius: 35px;
       padding: 1rem;
   } 

   .profile-name {
       flex-basis: 10%;
   }

   .profile-info {
       flex-basis: 90%;
   }

   .profile-stats {
       font-size: 2rem;
       font-weight: bold;
   }
   .profile-stats .count {
       font-size: 2.5em;
       /* overflow: hidden; */
       transition: --beeCount 5s;
       counter-reset: beeCount var(--beeCount);
   }

   .profile-stats .count::before {
       content: attr(data-count);
       position: absolute;
   }

   .profile-stats .count:hover {
       --beeCount: 10;
   }

   .profile-desc {
       font-size: 1.3rem;
   }

   .profile-pic-wrap {
       flex-basis: 50%;
   }

   .profile-pic img, .profile-rank div {
       border-radius: 15px;
   }

   .profile-name {
       font-size: 2rem;
       font-weight: bold;
   }

   .profile-emoji{
       height: 5rem;
       width: 5rem;
   }

   .text-area{
        background-color: #716085;
        border: none;
        border-radius: 15px;
        padding: 0.5rem;
        /*font-size: 1.5rem;*/
   }

   #edit-desc-field {
       width: 100%;
       resize: none;
       height: 10em;
   }
</style>

{#await getUserData()}
    <div class="bg-primary profile-container">
        <div class="row justify-center">
            <div class="col justify-center">
                <Loading/>
            </div>
        </div>
    </div>
{:then}
    <div class="bg-primary profile-container">
        <div class="w-100 text-center profile-name">
            <span class="profile-name">{userData.firstname}</span>
        </div>
        <div class="col space-around profile-info">
            <div class="row space-around">
                <div class="col space-around profile-pic-wrap">
                    <div class="profile-pic">
                        <img src="/public/img/profile_pics/{userData.profilePic}" width="256" height="256" alt="ja">
                    </div>
                    <div class="profile-desc row justify-center">
                        {#if isEditing}
                            <textarea class="text-area" name="editDescField" id="edit-desc-field" spellcheck="false" use:focusDescField on:focusout={saveDescription}>{profileDesc}</textarea>
                        {:else}
                            <div class="text-center col align-items-center" id="edit-description" style="max-width: 20em;">
                                {profileDesc}
                                <button type="button" class="btn" style="font-size: 1rem;" on:click={editProfile}>
                                    Edytuj opis
                                </button>
                            </div>
                        {/if}
                    </div>
                    {#if profileError !== null}
                        <span style="color: red">{profileError}</span>
                    {/if}
                </div>
                <div class="profile-rank">
                    <DivisionCanvas width={256} height={256}/>
                    <!-- <div style="width: 256px; height: 256px; background-color: black;"></div> -->
                </div>
            </div>
            <div class="row space-around profile-stats">
                <div class="login-streak">
                    <div class="count" data-count="{counters.loginStreak}"><span class:invisible={!countersVisible}>{userData.userStatistics.loginStreak}</span> <img class="profile-emoji" src="/public/img/emojis/fire_emoji.png" alt="fire emoji"></div>
                    <div class="stat-text">Login streak</div>
                </div>
                <div class="profile-ranking">
                    <div class="count">10 <img class="profile-emoji" src="/public/img/emojis/trophy_emoji.png" alt="trophy emoji"></div>
                    <div class="stat-text">Ranking</div>
                </div>
                <div class="profile-bees">
                    <div class="count" data-count="{counters.bees}"><span class:invisible={!countersVisible}>{userData.userStatistics.bees}</span> <img class="profile-emoji" src="/public/img/emojis/bee_emoji.png" alt="bee emoji"></div>
                    <div class="stat-text">Pszczoły</div>
                </div>
            </div>
        </div>
    </div>
{/await}
