<script>

</script>

<style>
    .loading-conatiner{
        background-color: #3B1B59;
        width: 20rem;
        height: 40rem;
        /*padding: 10rem;*/
    }

    .spinner {
        width: 14.4px;
        height: 14.4px;
        animation: spinner-o824ag 0.8s infinite linear;
    }

    .spinner div {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #594a67;
        border-radius: 50%;
        animation: spinner-vse6n7 1s infinite ease;
    }

    .spinner div:nth-child(1) {
        --rotation: 90;
    }

    .spinner div:nth-child(2) {
        --rotation: 180;
    }

    .spinner div:nth-child(3) {
        --rotation: 270;
    }

    .spinner div:nth-child(4) {
        --rotation: 360;
    }

    @keyframes spinner-vse6n7 {
        0%, 100% {
            transform: rotate(calc(var(--rotation) * 1deg)) translateY(0);
        }

        50% {
            transform: rotate(calc(var(--rotation) * 1deg)) translateY(300%);
        }
    }

    @keyframes spinner-o824ag {
        to {
            transform: rotate(360deg);
        }
    }

    @media only screen and (max-width: 500px) {
        .loading-conatiner {
            height: 75vh;
            width: auto;
        }
    }
</style>

<div class="loading-conatiner justify-center align-items-center col">
    <img src="/svg/logo_test.svg" alt="logo" class="nav-logo">
    <div class="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>
