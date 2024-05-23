<script>
    import { HotelArtystowApi } from "../lib/HotelArtystowApi";
    import * as Types from '../lib/types';

    /** @type {Types.UserData} */
    let userData;

    const api = new HotelArtystowApi();

    async function getUserData() {
        const res = await api.getProfileData(parseInt(sessionStorage.getItem('userId')));

        if(!res.status) {

        }

        userData = res.data;
    }
</script>

<style>
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
   }

   .profile-desc {
       font-size: 1.3rem;
   }

   .profile-pic-wrap {
       flex-basis: 50%;
   }

   .profile-name {
       font-size: 2rem;
       font-weight: bold;
   }
</style>

{#await getUserData()}
    adam
{:then}
<div class="bg-primary profile-container">
    <div class="w-100 text-center profile-name">
        <span class="profile-name">{userData.Firstname}</span>
    </div>
    <div class="col space-around profile-info">
        <div class="row space-around">
            <div class="col space-around profile-pic-wrap">
                <div class="profile-pic">
                    <img src="img/ja.jpg" width="256" height="256" alt="ja">
                </div>
                <div class="profile-desc row justify-center">
                    <div class="text-center" style="max-width: 20em;">
                        Lorem ipusm Lorem ipusm Lorem ipusm Lorem ipusm Lorem ipusm Lorem ipusm Lorem ipusm
                    </div>
                </div>
            </div>
            <div class="profile-rank">
                <!-- <canvas width="256" height="256"></canvas> -->
                <div style="width: 256px; height: 256px; background-color: black;"></div>
            </div>
        </div>
        <div class="row space-around profile-stats">
            <div class="login-streak">
                <div class="count">10 🔥</div>
                <div class="stat-text">Login streak</div>
            </div>
            <div class="profile-ranking">
                <div class="count">10 🏆</div>
                <div class="stat-text">Ranking</div>
            </div>
            <div class="profile-bees">
                <div class="count">999 🐝</div>
                <div class="stat-text">Pszczoły</div>
            </div>
        </div>
    </div>
</div>
{/await}
