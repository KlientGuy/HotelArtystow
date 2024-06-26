<script>
    import { onDestroy, onMount } from 'svelte';
    import {EngineBase} from '../lib/glEngine/engine_base'
    import { Shader } from './glEngine/utils/shader';
    import { Cube } from './glEngine/cube';
    import { Vector3 } from './glEngine/utils/vector';
    import { Texture2D } from './glEngine/texture_2d';

    export let width;
    export let height;
    export let texture;
    export let vertex;
    export let fragment;
    export let canAdvance;

    const CUBE_SPEED_MULTIPLIER = 1.005;
    const MAX_CUBE_SPEED = 1000;
    const MIN_CUBE_SPEED = 20;
    const MINIMUM_ADVANCE_ANIM_HEIGHT = calculateMinimumCubePosition();

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

        // const shader = await Shader.fromUri('generic_mvp.vert', 'generic_flat_color.frag', true);
        // const shader = await Shader.fromUri('generic_texture_mvp.vert', 'generic_texture.frag', true);
        const shader = await Shader.fromUri(vertex, fragment, true);
        // const texture = await Texture2D.fromUri('divisions/shrex.png', 207, 207);
        // const texture = await Texture2D.fromUri('divisions/diamond_block.png', 16, 16);
        const texture2d = await Texture2D.fromUri(texture, 16, 16);

        cube = new Cube();
        cube.setShader(shader);
        cube.setTexture(texture2d, false);
        cube.translate(new Vector3(0, 0, 2));
        // cube.rotateGlobal(new Vector3(-25, 45, 0));

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

    const textures = [
        'divisions/stone_block.png',
        'divisions/iron_block.png',
        'divisions/gold_block.png',
        'divisions/diamond_block.png',
        'divisions/emerald_block.png',
        'divisions/bedrock_block.png',
    ];

    async function animateAdvance() {
        const texture2d = await Texture2D.fromUri(textures[Math.round(Math.random() * 6)], 16, 16);
        animateAdvanceRotation(texture2d, true);
    }

    /**
    * @param {Texture2D} texture2d 
    * @param {boolean} speedUp 
    */
    function animateAdvanceRotation(texture2d, speedUp) {
        let interval;
        if(speedUp) {
            interval = setInterval(() => {
                cubeRotationSpeed *= CUBE_SPEED_MULTIPLIER;

                if(cubeRotationSpeed >= MAX_CUBE_SPEED) {
                    clearInterval(interval);

                    cube.setTexture(texture2d, true);
                    animateAdvanceRotation(null, false)
                }
            }, 10);
        } else {
            interval = setInterval(() => {
                cubeRotationSpeed /= CUBE_SPEED_MULTIPLIER;

                if(cubeRotationSpeed <= MIN_CUBE_SPEED) {
                    clearInterval(interval);
                    freeze = false;
                }
            }, 8)
        }
    }

    function calculateMinimumCubePosition() {
        let min = 0;
        for(let i = 0; i <= 10; i += 0.1) {
            min = Math.min(Math.sin(i) / 6, min);
        }
        return min;
    }

</script>

<div class="profile-rank">
    <canvas id="division-canvas" class="bg-primary" width="{width}" height="{height}"></canvas>
</div>
{#if canAdvance}
    <button type="button" class="btn" on:click={() => startAnimation = true}>Awansuj</button>
{/if}
