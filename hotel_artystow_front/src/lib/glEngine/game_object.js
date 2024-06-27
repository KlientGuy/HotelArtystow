import { EngineBase } from "./engine_base.js";
import { Renderer } from "./renderer.js";
import { Texture2D } from "./texture_2d.js";
import { Matrix4 } from "./utils/matrix4.js";
import { Shader } from "./utils/shader.js";
import { Vector3 } from "./utils/vector.js";

export class GameObject {

    /**
    * @type {Float32Array}
    * @protected
    */
    mesh = new Float32Array([]);

    /**
     *  @type {WebGLBuffer}
     *  @protected
     */
    buffer;

    /**
     *  @type {WebGLVertexArrayObject}
     *  @protected
     */
    vao;

    /**
     *  @type {Shader}
     *  @protected
     */
    shader;

    /**
     * @type {Texture2D}
     * @protected
     */
    texture;

    /**
     *  @type {number}
     *  @protected
     */
    meshSize = 0;

    /**
     * @type {Matrix4}
     * @protected
     */
    translationMatrix = new Matrix4();

    /**
     * @type {Matrix4}
     * @protected
     */
    localTranslationMatrix = new Matrix4();

    /**
     * @type {Matrix4}
     * @protected
     */
    moveMatrix = new Matrix4();

    /**
     * @type {Matrix4}
     * @protected
     */
    scaleMatrix = new Matrix4();

    /**
     * @type {Matrix4}
     * @protected
     */
    rotationMatrix = new Matrix4();

    /**
     * @type {Matrix4}
     * @protected
     */
    transformMatrix = new Matrix4();

    /**
     * @protected
     * @type {Function|null}
     */
    preDrawCallback;

    constructor() {
        const gl = EngineBase.getGlContext();

        this.buffer = gl.createBuffer();
        this.vao = gl.createVertexArray();
    }

    /**
     *  @param {Float32Array} mesh 
     *  @param {number} usage
     *  @param {string} type
     */
    setMesh(mesh, usage, positionSize, positionStride) {
        const gl = EngineBase.getGlContext();
        this.mesh = mesh;

        for(let i = 0; i < mesh.length; i += positionStride) {
            this.meshSize += positionSize;
        }

        this.meshSize /= positionSize;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, mesh, usage);
    }

    clearNotMesh() {
        this.notMesh = 0;
    }

    setShader(shader) {
        this.shader = shader;
    }

    getShader() {
        return this.shader;
    }

    /**
     * @public
     * @param {Texture2D} texture 
     * @param {boolean} freePrevious 
     * @virtual
     */
    setTexture(texture, freePrevious) {};

    /**
     * @public
     * @returns {Texture2D}
     */
    getTexture() {
        return this.texture;
    }

    /**
     * @param {Vector3} vec3 
     */
    translate(vec3) {
        this.translationMatrix.translate(vec3);

        return this;
    }

    /**
     * @param {Vector3} vec3 
     */
    translateLocal(vec3) {
        this.localTranslationMatrix.translate(vec3);

        return this;

    }

    /**
     * @param {Vector3} vec3 
     */
    move(vec3) {
        const newTrans = new Matrix4();
        newTrans.translate(vec3);

        this.moveMatrix.multiply(newTrans);

        return this;
    }

    /**
     * @param {Vector3} vec3 
     */
    scale(vec3) {
        this.scaleMatrix.scale(vec3);

        return this;
    }

    /**
     * @public
     * @param {Vector3} vec3 
     */
    scaleTimes(vec3) {
        this.scaleMatrix.scaleTimes(vec3);

        return this;
    }

    /**
     * @param {Vector3} vec3 
     */
    rotate(vec3) {
        // this.rotationMatrix.reset();
        this.rotationMatrix
            .rotateY(vec3.y)
            .rotateZ(vec3.z)
            .rotateX(vec3.x);

        return this;
    } 

    /**
     * @public
     * @param {Vector3} vec3 
     */
    rotateGlobal(vec3) {

        this.rotationMatrix.reset();
        this.rotationMatrix
            .rotateX(vec3.x)
            .rotateZ(vec3.z)
            .rotateY(vec3.y)

        return this;
    }

    /**
     * @protected
     */
    calculateTransform() {
        this.transformMatrix = new Matrix4(this.scaleMatrix.toArray());
        this.transformMatrix.multiply(this.rotationMatrix);
        this.transformMatrix.multiply(this.calculateTranslation());

        // this.transformMatrix = new Matrix4(this.rotationMatrix.toArray());
        // this.transformMatrix.multiply(this.calculateTranslation());
        // this.transformMatrix.multiply(this.scaleMatrix);
    }

    /**
     * @protected
     * @returns {Matrix4}
     */
    calculateTranslation() {
        const temp = new Matrix4(this.translationMatrix.toArray());
        temp.multiply(this.localTranslationMatrix);
        temp.multiply(this.moveMatrix);

        return temp;
    }

    resetTransform() {
        this.transformMatrix.reset();
    }

    /**
    *   @param {Array<{
    *       index: number,
    *       size: number,
    *       type: number,
    *       normalized: boolean,
    *       stride: number,
    *       offset: number,
    *       notPosition: boolean
    *   }>} attribArray 
    */
    setVertexAttribPointers(attribArray) {
        const gl = EngineBase.getGlContext();

        gl.bindVertexArray(this.vao);

        for(const one of attribArray) {
            gl.enableVertexAttribArray(one.index);
            gl.vertexAttribPointer(one.index, one.size, one.type, one.normalized, one.stride, one.offset);
        }

        gl.bindVertexArray(null);
    }

    /**
    * @public
    * @virtual
    * @param {number} deltaTime 
    * @param {number} elapsedTime 
    */
    preDraw(deltaTime, elapsedTime) {
        this.preDrawCallback?.call(this, deltaTime, elapsedTime)
    };

    /**
    * @public
    * @virtual
    */
    draw() {
        const gl = EngineBase.getGlContext();
        this.calculateTransform();

        gl.uniformMatrix4fv(this.shader.getUniformLocation('uModel'), false, this.transformMatrix.toFloat32Array(), 0, 0);
        gl.bindVertexArray(this.vao);
        gl.drawArrays(gl.TRIANGLES, 0, this.meshSize);
        gl.bindVertexArray(null);
    }

    /**
    * @param {Function|null} preDrawCallback 
    */
    queueDraw(preDrawCallback = null) {
        this.preDrawCallback = preDrawCallback;
        Renderer.queueObjectDraw(this);
    }
}
