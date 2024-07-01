<script>
    import { onDestroy, onMount } from 'svelte';
    import {EngineBase} from '../lib/glEngine/engine_base'
    import { Shader } from './glEngine/utils/shader';
    import { Cube } from './glEngine/cube';
    import { Vector3 } from './glEngine/utils/vector';
    import { Texture2D } from './glEngine/texture_2d';
    import { HotelArtystowApi } from './HotelArtystowApi';
    import FancyButton from './FancyButton.svelte';

    export let width;
    export let height;
    export let texture;
    export let vertex;
    export let fragment;
    export let canAdvance;
    export let divisionName;

    const CUBE_SPEED_MULTIPLIER = 1.005;
    const MAX_CUBE_SPEED = 1000;
    const MIN_CUBE_SPEED = 20;
    const MINIMUM_ADVANCE_ANIM_HEIGHT = calculateMinimumCubePosition();

    let nextDivisionName;
    let nextTexture;
    let canAdvanceMore = false;
    let waitTime = 1;

    /** @type {EngineBase} */
    let engineBase;
    /** @type {Cube} */
    let cube;

    let cubeRotationSpeed = MIN_CUBE_SPEED;

    onDestroy(() => {
        cube?.destroy();
        engineBase.stop();
    });

    onMount(async () => {
        engineBase = new EngineBase(document.querySelector('#division-canvas'));
        engineBase.setBaseColor(59, 27, 89);

        const shader = await Shader.fromUri(vertex, fragment, true);
        const texture2d = await Texture2D.fromUri(texture, 16, 16);

        cube = new Cube();
        cube.setShader(shader);
        cube.setTexture(texture2d, false);
        cube.translate(new Vector3(0, 0, 2));

        engineBase.run();

        cube.queueDraw(cubePreDraw);
    })

    let rotation = 0;
    let translation = 0;
    let translationSin = 0;

    let freeze = false;
    let startAnimation = false;
    /**
    * @param {number} deltaTime 
    * @param {number} elapsedTime 
    * @this {Cube}
    */
    function cubePreDraw(deltaTime, elapsedTime) {

        rotation += cubeRotationSpeed * deltaTime;

        if(!freeze) {
            translation += deltaTime;
            translationSin = Math.sin(translation) / 6;
            this.translateLocal(new Vector3(0, translationSin, 0))
        }

        if(startAnimation) {
            if(animateDown(this))
                startAnimation = false;
        }

        this.rotateGlobal(new Vector3(-25, rotation, 0))
    }

    /**
    * @param {Cube} cube 
    */
    function animateDown(cube) {
        if(translationSin > MINIMUM_ADVANCE_ANIM_HEIGHT) {
            cube.translateLocal(new Vector3(0, translationSin, 0));
            return false;
        }
        else {
            freeze = true;
            animateAdvance();
            return true;
        }
    }

    async function animateAdvance() {
        const audio = new Audio('/audio/mc_levelup.mp3');
        const buildup = new Audio('/audio/stone_break.mp3');

        const texture2d = await Texture2D.fromUri(nextTexture, 16, 16);

        buildup.play();
        buildup.addEventListener('timeupdate', () => {
            if(buildup.currentTime >= 8) {
                buildup.currentTime = 2;
            }
        })
        await animateAdvanceRotation(true);
        await new Promise(resolve => setTimeout(() => resolve(), waitTime));
        await animateAdvanceScale(texture2d, true);

        buildup.pause();
        audio.play();

        divisionName = nextDivisionName;

        animateAdvanceScale(null, false);
        await animateAdvanceRotation(false);

        canAdvance = canAdvanceMore;
        canAdvanceMore = false;
    }

    /**
    * @param {boolean} speedUp 
    */
    function animateAdvanceRotation(speedUp) {
        let interval;
        if(speedUp) {
            return new Promise((resolve) => {
                interval = setInterval(() => {
                    cubeRotationSpeed *= CUBE_SPEED_MULTIPLIER;

                    if(cubeRotationSpeed >= waitTime * 2) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 8);
            })
        } else {
            return new Promise((resolve) => {
                interval = setInterval(() => {
                    cubeRotationSpeed /= CUBE_SPEED_MULTIPLIER;

                    if(cubeRotationSpeed <= MIN_CUBE_SPEED) {
                        clearInterval(interval);
                        freeze = false;
                        resolve();
                    }
                }, 10)
            })
        }
    }

    /**
    * @param {Texture2D} texture
    * @param {boolean} scaleDown 
    */
    function animateAdvanceScale(texture, scaleDown) {
        let scale = 1;
        let interval;
        if(scaleDown) {
            return new Promise((resolve) => {
                interval = setInterval(() => {
                    scale *= 0.75;
                    cube.scale(new Vector3(scale, scale, scale));
                    if(scale <= 0.001) {
                        cube.setTexture(texture, true);
                        clearInterval(interval);
                        resolve();
                    }

                }, 50)
            })
        } else {
            return new Promise((resolve) => {
                scale = 0.001;
                interval = setInterval(() => {
                    scale *= 1.1;
                    cube.scale(new Vector3(scale, scale, scale));
                    if(scale >= 1) {
                        cube.scale(new Vector3(1,1,1));
                        clearInterval(interval);
                        resolve();
                    }

                }, 20)
            })
        }
    }

    function calculateMinimumCubePosition() {
        let min = 0;
        for(let i = 0; i <= 10; i += 0.1) {
            min = Math.min(Math.sin(i) / 6, min);
        }
        return min;
    }

    async function rankup() {
        const api = new HotelArtystowApi();

        const res = await api.advanceDivision();

        if(!res.status) return;

        canAdvance = false;
        startAnimation = true;
        nextTexture = res.data.texture;
        nextDivisionName = res.data.name;
        canAdvanceMore = res.data.canAdvanceMore;
        waitTime = res.data.waitTime;
    }

</script>

<style>
    .division-name {
        font-weight: bold;
        font-size: 1.5rem;
    }
</style>

<div class="profile-rank">
    <canvas id="division-canvas" class="bg-primary" width="{width}" height="{height}"></canvas>
</div>
<div class="division-name">{divisionName}</div>
<!-- {#if canAdvance} -->
    {#key divisionName}
        <FancyButton onclick={rankup} disabled={!canAdvance} divisionName={divisionName.toLowerCase()}/>
    {/key}
<!-- {/if} -->
