<script>
    import { onDestroy, onMount } from "svelte";

    /** @type {Function} */
    export let onclick;
    export let divisionName;
    export let disabled = false;

    const GRADIENTS = {
        // 'dirt': 'linear-gradient(var(--bg-angle), #823700 0%, #823700 100%);',
        'dirt': 'linear-gradient(var(--bg-angle), #828282 0%, #969696 100%);',
        'stone': 'linear-gradient(var(--bg-angle), #1c827a 0%, #d57400 100%);',
        'miedź': 'linear-gradient(var(--bg-angle), #989898 70%, #ffffff 100%);',
        'żelazo': 'linear-gradient(var(--bg-angle), #ffea00 25%, #ffcb00 75%, #ffad00 100%);',
        'złoto': 'linear-gradient(var(--bg-angle), rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);',
        'diament': 'linear-gradient(var(--bg-angle), #1a1a1a 0%, #14ff00 50%, rgba(0,212,255,1) 100%);',
        'szmaragd': 'linear-gradient(var(--bg-angle), rgba(25,0,143,1) 0%, rgba(197,137,0,1) 48%, rgba(151,0,255,1) 100%);',
        'bedrock': 'linear-gradient(var(--bg-angle), rgba(255,0,0,1) 0%, rgba(255,154,0,1) 23%, rgba(103,255,90,1) 51%, rgba(131,154,177,1) 80%, rgba(255,0,230,1) 100%);'
    }
    /* const GRADIENTS = {
        'dirt': 'linear-gradient(var(--bg-angle), #823700 0%, #823700 100%);',
        'stone': 'linear-gradient(var(--bg-angle), #828282 0%, #969696 100%);',
        'miedź': 'linear-gradient(var(--bg-angle), #1c827a 0%, #d57400 100%);',
        'żelazo': 'linear-gradient(var(--bg-angle), #989898 70%, #ffffff 100%);',
        'złoto': 'linear-gradient(var(--bg-angle), #ffea00 25%, #ffcb00 75%, #ffad00 100%);',
        'diament': 'linear-gradient(var(--bg-angle), rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);',
        'szmaragd': 'linear-gradient(var(--bg-angle), #1a1a1a 0%, #14ff00 50%, rgba(0,212,255,1) 100%);',
        'bedrock': 'linear-gradient(var(--bg-angle), rgba(25,0,143,1) 0%, rgba(197,137,0,1) 48%, rgba(151,0,255,1) 100%);'
    } */

    const BORDER_ROTATION_SPEED = 150;
    let borderRotMultiplier = 1;

    let deg = 0;

    /** @type {number} */
    let handle;

    /** @type {HTMLElement} */
    let button;

    onDestroy(() => {
        cancelAnimationFrame(handle);
    })

    console.log(GRADIENTS[divisionName]);

    onMount(() => {
        button = document.querySelector('.fancy-btn');
        button.style.cssText = `--bg-gradient: ${GRADIENTS[divisionName]}`;
        handle = requestAnimationFrame(rotateBorder);
    })

    let lastFrameTime = 0;
    /**
    * @param {number} timestamp 
    */
    function rotateBorder(timestamp) {

        const deltaTime = (timestamp - lastFrameTime) / 1000;
        let addedRot = 0;

        if((deg > 30 && deg < 140) || (deg > 200 && deg < 320))
            addedRot = BORDER_ROTATION_SPEED * 2.5 * deltaTime * borderRotMultiplier;
        else
            addedRot = BORDER_ROTATION_SPEED * deltaTime * borderRotMultiplier;

        if(disabled)
            addedRot *= 4;

        deg += addedRot;
        if(deg >= 360)
            deg = 0;

        button.style.setProperty('--bg-angle', `${deg}deg`);
        lastFrameTime = timestamp;
        requestAnimationFrame(rotateBorder);
    }
</script>

<style>
    .fancy-btn-border {
        position: relative;
        z-index: 1;
    }
    .fancy-btn {
        position: relative;
        --bg-angle: 0deg;
        /* --bg-gradient: linear-gradient(var(--bg-angle), #823700 0%, #823700 100%); */
        /* --bg-gradient: linear-gradient(var(--bg-angle), rgba(25,0,143,1) 0%, rgba(197,137,0,1) 48%, rgba(151,0,255,1) 100%); */
        border: 0;
    }

    .fancy-btn:hover {
        border: 0;
    }

    .fancy-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
        margin: -3px;
        /* background: linear-gradient(var(--bg-angle), #1a1a1a 24%, rgba(151,0,255,1) 100%); */
        background: var(--bg-gradient);
        animation: rotateBorder 2s linear infinite;
        border-radius: inherit;
    }
</style>

<div class="fancy-btn-border">
    <button 
        type="button"
        class="fancy-btn"
        disabled={disabled}
        on:mouseenter={() => borderRotMultiplier = disabled ? 1 : 2}
        on:mouseleave={() => borderRotMultiplier = 1}
        on:click={() => {
            if(disabled) return;

            borderRotMultiplier = 1;
            onclick()
        }}
    >Awansuj</button>
</div>
