import { Camera } from "./camera.js";
import { EngineBase } from "./engine_base.js";
import { GameObject } from "./game_object.js";
import { Colors } from "./utils/colors.js";
import { Matrix4 } from "./utils/matrix4.js";
import { Vector3 } from "./utils/vector.js";

export class Renderer {

    /** 
     * @type {Map<string, GameObject>}
     * @private
     * @static
     */
    static drawQueue = new Map();

    /**
     * @type {Map<string, GameObject>}
     * @private
     * @static
     */
    static destroyQueue = new Map();

    /**
     * @type {Camera}
     * @private
     * @static
     */
    static camera;
    
    /**
     * @type {WebGL2RenderingContext}
     * @private
     */
    gl;

    /**
     * @type {Matrix4}
     * @private
     */
    projectionMatrix;

    /**
     * @type {number}
     * @private
     */
    lastFrameTime;

    /**
     * @type {number}
     * @private
     */
    fps = 0;

    /**
     * @type {number}
     * @private
     */
    targetFps;

    /**
     * @type {number}
     * @private
     */
    frames = 0;

    /**
     * @type {number}
     * @private
     */
    _animationFrameHandler;

    /**
     * @private
     * @type {object}
     */
    static baseColor = {
        r: null,
        g: null,
        b: null,
        a: null
    };

    constructor() {
        const gl = EngineBase.getGlContext();

        this.projectionMatrix = Matrix4.createPerspective(60, gl.drawingBufferHeight / gl.drawingBufferWidth, 0.1, 150);
    }

    startRenderLoop() {
        this.draw();
    }

    /**
    *   @private
    *   @returns {void}
    */
    draw() {

        setInterval(this.countFps.bind(this), 1000);

        // this.limitFps(5);

        /* for(let i = 0; i <= 120; i++) {
            const renderer = this;
            setTimeout(function() {
                renderer.limitFps(i)
                console.log(i);
            }, 1000 * i);
        } */

        const gl = EngineBase.getGlContext();
        const drawFunction = (timestamp) => {
            timestamp |= 0;

            if(!this.lastFrameTime) {
                this.lastFrameTime = timestamp;
            }

            let deltaTime = timestamp - this.lastFrameTime;

            if(this.targetFps) {
                if(deltaTime < 1000 / this.targetFps) {
                    this._animationFrameHandler = requestAnimationFrame(drawFunction);
                    return;
                }
            }


            this.lastFrameTime = timestamp;
            this.frames++;

            deltaTime /= 1000;
            const elapsedTime = timestamp / 1000;

            gl.clearColor(Renderer.baseColor.r, Renderer.baseColor.g, Renderer.baseColor.b, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            for(const [key, one] of Renderer.destroyQueue.entries()) {
                one.getShader().use();
                one.getTexture().use();
                one.destroy(false, false);
                Renderer.destroyQueue.delete(one.id);
            }

            for(const [key, one] of Renderer.drawQueue.entries()) {
                const shader = one.getShader();
                const texture = one.getTexture();
                shader.use();
                texture.use();
                gl.uniformMatrix4fv(shader.getUniformLocation('uProjection'), false, this.projectionMatrix.toFloat32Array(), 0, 0);

                this.moveCamera(deltaTime);
                gl.uniformMatrix4fv(shader.getUniformLocation('uView'), false, Renderer.camera.getMatrix().toFloat32Array(), 0, 0);
                one.preDraw(deltaTime, elapsedTime);
                one.draw();
            }

            this._animationFrameHandler = requestAnimationFrame(drawFunction);
        }
        drawFunction();
    }

    /**
     * @public
     */
    stop() {
        cancelAnimationFrame(this._animationFrameHandler);
    }

    /**
     * @private
     * @param {number} deltatime 
     */
    moveCamera(deltatime) {
        const cam = Renderer.camera;
        const direction = cam.getDirection();

        const movement = Vector3.fromVector(direction);
        const moveSpeed = cam.moveSpeed * cam.moveSpeedMultiplier;
        movement.multiplyByNumber(moveSpeed).multiplyByNumber(deltatime);

        const rotationDirection = Vector3.fromVector(cam.rotation);
        rotationDirection.multiplyByNumber(deltatime).multiplyByNumber(10);

        // cam.rotationMatrix.reset();
        // cam.rotate(rotationDirection);
        cam.move(movement);
    }

    /**
     * @private
     */
    countFps(frames) {
        this.fps = frames;
        this.frames = 0;
    }

    /**
     * @private
     * @returns {number}
     */
    getFps() {
        return this.fps;
    }

    /**
     * @param {number} targetFps 
     */
    limitFps(targetFps) {
        this.targetFps = targetFps;
    }

    /**
     * @public
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     */
    static setBaseColor(r, g, b) {
        this.baseColor = Colors.normalizeRgb(r, g, b);
    }

    /**
    *   @param {GameObject} object 
    */
    static queueObjectDraw(object) {
        this.drawQueue.set(object.id, object);
    }

    /**
     * @param {GameObject} object 
     */
    static queueObjectDestroy(object) {
        this.destroyQueue.set(object.id, object);
    }

    /**
     * @public
     * @param {GameObject} object 
     */
    static removeObjectFromQueue(object) {
        // this.drawQueue.splice(this.drawQueue.indexOf(object));
        this.drawQueue.delete(object.id);
    }

    /**
    * @param {Camera} camera 
    * @static
    */
    static setCamera(camera) {
        
        if(!camera instanceof Camera) {
            throw new DOMException(`Renderer setCamera: Expecting Camera got ${typeof camera}`);
        }

        Renderer.camera = camera;
    }
}
