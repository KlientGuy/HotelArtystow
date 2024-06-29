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

    let shader;
    onMount(async () => {
        engineBase = new EngineBase(document.querySelector('#division-canvas'));
        engineBase.setBaseColor(59, 27, 89);

        // const shader = await Shader.fromUri('generic_mvp.vert', 'generic_flat_color.frag', true);
        // const shader = await Shader.fromUri('generic_texture_mvp.vert', 'generic_texture.frag', true);
        shader = await Shader.fromUri(vertex, fragment, true);
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

    function moveUpSmall(deltaTime, elapsedTime) {
        translation = 1 * deltaTime;
        // let translationx = (Math.random() - .5) * deltaTime;
        let translationx = Math.sin(elapsedTime * 10) / 10;
        this.translateLocal(new Vector3(translationx, 0, 0));
        this.move(new Vector3(0, translation, 0));
    }

    async function animateAdvance() {


        const audio = new Audio('/audio/mc_levelup.mp3');
        const buildup = new Audio('/audio/stone_break.mp3');
        const index = Math.floor(Math.random() * 6);
        const texture2d = await Texture2D.fromUri(textures[index], 16, 16);
        const texture2d2 = await Texture2D.fromUri('divisions/dirt_block.png', 16, 16);
        const cubesArr = [];
        let interval = setInterval(() => {
            let x = Math.random() - 0.5;
            let y = Math.random() * 0.5;
            let z = Math.random() + 1.5;
            const smallCube = new Cube();
            smallCube.setShader(shader);
            smallCube.setTexture(texture2d2, false);
            smallCube.scale(new Vector3(.25, .25, .25))
            smallCube.translate(new Vector3(x, y, z));
            smallCube.queueDraw(moveUpSmall);
            
            cubesArr.push(smallCube);
        }, 250);
        buildup.play();
        buildup.addEventListener('timeupdate', () => {
            if(buildup.currentTime >= 8) {
                buildup.currentTime = 2;
            }
        })
        await animateAdvanceRotation(true);
        // await new Promise(resolve => setTimeout(() => resolve(), 1000 * index));
        clearInterval(interval);
        await animateAdvanceScale(texture2d, true);

        cubesArr.forEach((elem) => elem.queueDestroy(false, false));

        buildup.pause();
        audio.play();

        animateAdvanceScale(null, false);
        animateAdvanceRotation(false);

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

                    if(cubeRotationSpeed >= MAX_CUBE_SPEED) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 8);
            })
        } else {
            interval = setInterval(() => {
                cubeRotationSpeed /= CUBE_SPEED_MULTIPLIER;

                if(cubeRotationSpeed <= MIN_CUBE_SPEED) {
                    clearInterval(interval);
                    freeze = false;
                }
            }, 10)
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

</script>

<div class="profile-rank">
    <canvas id="division-canvas" class="bg-primary" width="{width}" height="{height}"></canvas>
</div>
{#if canAdvance}
    <button type="button" class="btn" on:click={() => startAnimation = true}>Awansuj</button>
{/if}
