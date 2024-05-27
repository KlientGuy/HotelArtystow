<script>

</script>

<ul>
    <li><a class="nav-logo-element" href="/"><img src="/public/svg/logo_test.svg" alt="logo" class="nav-logo"></a></li>
    <li><a href="/zjeble">Zjeble</a></li>
<!--    <li class="profile"><a href="/profile"><img src="/public/img/profile_pics/{userData.profilePic}" width="256" height="256" alt="ja"></a></li>-->
    <li class="profile"><a href="/profile"><img class="profile-navbar-image" src="/public/img/profile_pics/Hotpot.png" alt="ja"></a></li>
</ul>

<style>
    ul {
        position: absolute;
        display: flex;
        align-items: center;
        top: 0;
        width: 100vw;
        height: 10vh;
        list-style-type: none;
        justify-content: space-between;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #3B1B59;
    }
    .profile {
        margin-left: auto;
        padding: 30px;
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
        transition: color .3s ease-in-out, box-shadow .3s ease-in-out;
    }

    ul > li:not(:first-child):not(:nth-child(3)):hover {
        box-shadow: inset 100px 0 0 0 #716085;
    }

</style>
