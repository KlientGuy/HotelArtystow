<script>
    import { onMount } from 'svelte';
    import {EngineBase} from '../lib/glEngine/engine_base'
    import { Shader } from './glEngine/utils/shader';
    import { Cube } from './glEngine/cube';
    import { Vector3 } from './glEngine/utils/vector';

    export let width;
    export let height;

    /** @type {EngineBase} */
    let engineBase;
    /** @type {Cube} */
    let cube;

    let cubeRotationSpeed = 20;

    onMount(async () => {
        engineBase = new EngineBase(document.querySelector('#division-canvas'));
        engineBase.setBaseColor(59, 27, 89);

        const shader = await Shader.fromUri('generic_mvp.vert', 'generic_flat_color.frag', true);
        cube = new Cube();
        cube.setShader(shader);
        cube.translate(new Vector3(0, 0, 2));
        cube.rotateGlobal(new Vector3(-25, 45, 0));

        engineBase.run();

        cube.queueDraw(cubePreDraw);
    })

    /**
    * @param {number} deltaTime 
    * @param {number} elapsedTime 
    * @this {Cube}
    */
    function cubePreDraw(deltaTime, elapsedTime) {
        this.rotateGlobal(new Vector3(-25, elapsedTime * cubeRotationSpeed, 0))
        this.translateLocal(new Vector3(0, Math.sin(elapsedTime) / 6, 0))
        // this.move(new Vector3(Math.sin(elapsedTime) * deltaTime, 0, 0));
    }

</script>

<canvas id="division-canvas" class="bg-primary" width="{width}" height="{height}"></canvas>
