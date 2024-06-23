<script>
    import { HotelArtystowApi } from "./HotelArtystowApi";

    const api = new HotelArtystowApi();
    let navbarData = {
        bees: 0,
        loginStreak: 0
    };

    api.getNavbarData().then((res) => {
        navbarData = res.data;
    })

</script>

<ul>
    <li><a class="nav-logo-element" href="/"><img src="/svg/logo_test.svg" alt="logo" class="nav-logo"></a></li>
    <li><a href="/zjeble">Zjeble</a></li>
<!--    <li class="stats">999<img class="nav-emoji" src="/img/emojis/bee_emoji.png" alt="bee emoji"></li>-->
<!--    <li class="stats">999<img class="nav-emoji" src="/img/emojis/fire_emoji.png" alt="fire emoji"></li>-->
    <li class="profile">
        <div class="row align-items-center">
            <div class="nav-emoji">{navbarData.bees}<img class="nav-emoji" src="/img/emojis/bee_emoji.png" alt="bee emoji"></div>
            <div class="nav-emoji">{navbarData.loginStreak}<img class="nav-emoji" src="/img/emojis/fire_emoji.png" alt="fire emoji"></div>
            <a href="/profile"><img class="profile-navbar-image" src="/img/profile_pics/Hotpot.png" alt="ja"></a>
        </div>
    </li>
</ul>

<style>
    ul {
        position: absolute;
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
        overflow: hidden;
        background-color: #3B1B59;
    }
    .profile {
        margin-left: auto;
        padding: 30px;
        /*width: 3vw*/
        /*position: absolute;*/
        /*right: 0;*/
    }
    .stats {
        /*margin-left: auto;*/
        /*margin-right: auto;*/
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
        padding: 14px 16px;
        text-decoration: none;
        /*width: 4vw;*/
        transition: color .3s ease-in-out, box-shadow .3s ease-in-out;
    }

    ul > li:not(:first-child):not(:nth-child(5)):not(:nth-child(4)):not(:nth-child(3)):hover {
        box-shadow: inset 100px 0 0 0 #716085;
    }
    .nav-emoji {
        width: 2vw;
        height: 2vw;
        margin-bottom: 40px;
        margin-right: 30px;
    }

</style>
