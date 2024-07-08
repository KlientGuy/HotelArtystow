<script>

import {navigateTo} from '../lib/navigation';

</script>

<style>

    .container {
        overflow: visible;
        padding: 20px;
    }
    .container > .app-block {
        display: flex;
        gap: 20px;
        justify-content: center;
    }

    .container > .app-block > .hex > i {
        color: #978249;
    }

    .hex:hover{
        transform: scale(1.1);
    }

    .container > .app-block > .hex {
        width: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
        aspect-ratio: 0.866;
        flex-shrink: 0;
        clip-path: polygon(0 25%,50% 0,100% 25%,100% 75%,50% 100%,0 75%);
        background: rgb(109,54,159);
        background: radial-gradient(circle, rgba(109,54,159,1) 0%, rgba(59,27,89,1) 100%);
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .container > .app-block:last-child {
        transform: translateY(calc(20px - 25%));
    }

    .container > .app-block:last-child > .hex:nth-child(10) {
        background: black;
    }

    button:hover {
        border: none;
    }
    button:focus{
        outline: none;
    }

    @media only screen and (max-width: 800px) {
        :root {
            --translateX: 70px;
        }
        .container > .app-block {
            display: flex;
            flex-direction: column;
        }

        .container > .app-block > .hex:nth-child(even) {
            width: 200px;
            translate: var(--translateX);
        }

        .container > .app-block > .hex:nth-child(odd) {
            width: 200px;
            translate: calc(var(--translateX) * -1);
        }

        .container > .app-block-2 > .hex:nth-child(odd) {
            translate: var(--translateX) 80px!important;
        }

        .container > .app-block-2 > .hex:nth-child(even) {
            translate: calc(var(--translateX) * -1)!important;
        }
    }

</style>

<div class="container">
    <div class="app-block">
        <button class="hex">
            <i class="fa-solid fa-7x fa-cloud-arrow-up"></i>
        </button>
        <button on:click={() => navigateTo('/zjeble')} class="hex zjeble">
            <i class="fa-solid fa-7x fa-camera-retro"></i>
        </button>
        <button on:click={() => navigateTo('/flappybee')} class="hex zjeble">
            <img src="/svg/bee.svg" alt="">
        </button>
    </div>
    <div class="app-block app-block-2">
        <button on:click={() => navigateTo('/ranking')} class="hex">
            <i class="fa-solid fa-7x fa-ranking-star"></i>
        </button>
        <button on:click={() => navigateTo('/zjeble')} class="hex">
            ZAPCHAJ DZIURA BO CHUJOWO WYGLADA JAK JEST NIESYMETRYCZNIE
        </button>
    </div>
</div>
