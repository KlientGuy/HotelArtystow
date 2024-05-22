<script>

</script>

<ul>
    <li><a  class="nav-logo-element" href="#"><img src="/public/svg/logo_test.svg" alt="logo" class="nav-logo"></a></li>
    <li><a href="#">Home</a></li>
    <li><a href="#">News</a></li>
    <li><a href="#">Contact</a></li>
    <li style="float:right"><a href="#">About</a></li>
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
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #3B1B59;
    }

    li {
        float: left;
    }

    li a {
        display: block;
        color: white;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
    }

    li a:hover:not(.nav-logo-element) {
        background-color: #111;
        height: 7vh;
        text-align: center;
        /*color: #e70000;*/
    }

    .active {
        background-color: #2a0b59;
    }

</style>