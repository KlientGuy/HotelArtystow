import { Colors } from './utils/colors.js';
import { Shader } from './utils/shader.js';
import { GameObject } from './game_object.js';
import { Renderer } from './renderer.js';
import { Cube } from './cube.js';
import { Matrix4 } from './utils/matrix4.js';
import { Vector3 } from './utils/vector.js';
import { Camera } from './camera.js';

"use strict"

export class EngineBase {
    /**
     *  @type WebGL2RenderingContext
     *  @private
     *  @static
     */
    static gl = null;

    /**
     * @type {HTMLCanvasElement}
     */
    canvas;

    /**
     * @private
     * @type {Renderer}
     */
    renderer;

    /**
     *   @param {HTMLCanvasElement} canvasElement
     */
    constructor(canvasElement) {
        const gl = canvasElement.getContext('webgl2');
        this.canvas = canvasElement;

        if(!gl) console.error('Could not grab webgl context');

        EngineBase.gl = gl;
        gl.enable(gl.DEPTH_TEST);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        Renderer.setBaseColor(23.0, 232.0, 201.0);
    }

    /**
    * @public
    */
    run() {
        const renderer = new Renderer();
        const camera = new Camera(this.canvas);

        Renderer.setCamera(camera);

        renderer.startRenderLoop();
        this.renderer = renderer;
    }

    /**
     * @public
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     */
    setBaseColor(r, g, b) {
        Renderer.setBaseColor(r, g, b);
    }

    static getGlContext() {
        return EngineBase.gl;
    }
}
