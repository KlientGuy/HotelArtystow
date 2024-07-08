<script>
    import { HotelArtystowApi } from "./HotelArtystowApi";
    import { navigateTo } from "./navigation";

    const api = new HotelArtystowApi();
    let navbarData = {
        profilePic: 'Hotpot.png',
        userStatistics: {
            bees: 0,
            loginStreak: 0
        }
    };

    api.getNavbarData().then((res) => {
        navbarData = res.data;
    })

    async function logoutClick() {
        await api.logout();
        navigateTo('/login');
    }

</script>

<style>
    ul {
        position: fixed;
        display: flex;
        flex-direction: row;
        align-items: center;
        top: 0;
        width: 100vw;
        height: 10vh;
        list-style-type: none;
        /*justify-content: space-between;*/
        margin: 0;
        padding: 0;
        z-index: 1;
        overflow: hidden;
        background-color: #3B1B59;
    }
    .profile {
        margin-left: auto;
        padding: 0 30px;
        /*width: 3vw*/
        /*position: absolute;*/
        /*right: 0;*/
    }

    li a{
        display: block;
        color: white;
        text-align: center;
        text-decoration: none;
    }

    li {
        display: block;
        border-radius: 20%;
        color: white;
        text-align: center;
        padding: 0 16px;
        text-decoration: none;
        /*width: 4vw;*/
        transition: color .3s ease-in-out, box-shadow .3s ease-in-out;
    }

    /* ul > li:not(:first-child):not(:nth-child(5)):not(:nth-child(4)):not(:nth-child(3)):hover {
        box-shadow: inset 100px 0 0 0 #716085;
    } */

    .nav-emoji {
        font-size: 1.2rem;
        width: 2vw;
        height: 2vw;
        margin-bottom: 40px;
        margin-right: 30px;
    }

    .nav-emoji-fa {
        font-size: 1.7vw;
        margin-right: 15px;
    }

    .stats-wrapper {
        align-items: stretch;
    }

    .rotate-hover {
        transition: rotate 500ms cubic-bezier(.68,-0.55,.27,1.55), color 500ms ease-out;
    }

    .rotate-hover:hover {
        rotate: 180deg;
        color: #fbc41b;
    }

    .logout-hover > i {
        transition: color 250ms ease-out, scale 500ms;
        cursor: pointer;
    }

    .logout-hover:hover > i {
        color: red;
        scale: -1 1;
    }
    .nav-button {
        width: auto;
        height: auto;
        display: block;
        padding: 0;
        background-color: transparent;
    }
    .nav-button:hover {
        border-color: transparent;
    }

    .spacer {
        position: absolute;
        top: 0;
        height: 10vh;
        margin-bottom: 50px;
    }

    @media only screen and (max-width: 500px) {

        .spacer {
            position: relative;
        }
        .nav-logo {
            width: 50px;
            height: 50px;
        }
        .profile {
            margin-left: 0;
            width: 100%;
            padding: 0;
            padding-left: 30px;
        }

        .profile > .stats-wrapper {
            justify-content: space-around;
        }

        .nav-emoji {
            width: 20px;
            height: 20px;
        }

        .nav-emoji-fa {
            font-size: 1.2rem;
        }

        .profile-navbar-image {
            width: 40px;
            height: 40px;
        }
    }

</style>

<div class="spacer"></div>
<ul>
    <li><a class="nav-logo img-link" href="/"><img src="/svg/logo_test.svg" alt="logo"></a></li>
    <!-- <li><a href="/zjeble">Zjeble</a></li> -->
    <li class="profile">
        <div class="row align-items-center stats-wrapper">
            <div class="nav-emoji">{navbarData.userStatistics.bees}<img class="nav-emoji" src="/img/emojis/bee_emoji.png" alt="bee emoji"></div>
            <div class="nav-emoji">{navbarData.userStatistics.loginStreak}<img class="nav-emoji" src="/img/emojis/fire_emoji.png" alt="fire emoji"></div>
            <div class="row align-items-center">
                <a href="/settings" class="img-link nav-emoji-fa"><i class="fa fa-cog rotate-hover"></i></a>
                <button on:click={logoutClick} class="img-link nav-emoji-fa nav-button logout-hover"><i class="fa fa-right-from-bracket"></i></button>
                <a href="/profile" class="img-link"><img class="profile-navbar-image" src="/img/profile_pics/{navbarData.profilePic}" alt="profile_pic"></a>
            </div>
        </div>
    </li>
</ul>
