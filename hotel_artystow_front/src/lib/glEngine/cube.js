import { EngineBase } from "./engine_base.js";
import { GameObject } from "./game_object.js";
import { Renderer } from "./renderer.js";
import { Texture2D } from "./texture_2d.js";
import { Mathf } from "./utils/mathf.js";
import { Vector3 } from "./utils/vector.js";

export class Cube extends GameObject {

    mesh = new Float32Array([
        0, 0, 0,            0, 0,
        //front
        -0.5, 0.5, -0.5,    0, 1,
        -0.5, -0.5, -0.5,   0, 0,
        0.5, -0.5, -0.5,    1, 0,
        -0.5, 0.5, -0.5,    0, 1,
        0.5, 0.5, -0.5,     1, 1,
        0.5, -0.5, -0.5,    1, 0,
        
        //left
        -0.5, 0.5, 0.5,     0, 1,
        -0.5, 0.5, -0.5,    1, 1,
        -0.5, -0.5, 0.5,    0, 0,
        -0.5, 0.5, -0.5,    1, 1,
        -0.5, -0.5, -0.5,   1, 0,
        -0.5, -0.5, 0.5,    0, 0,

        //right
        0.5, 0.5, 0.5,      1, 1,
        0.5, 0.5, -0.5,     0, 1,
        0.5, -0.5, 0.5,     1, 0,
        0.5, 0.5, -0.5,    0, 1,
        0.5, -0.5, -0.5,   0, 0,
        0.5, -0.5, 0.5,    1, 0,

        //back
        -0.5, -0.5, 0.5,    0, 0,
        0.5, -0.5, 0.5,     1, 0,
        0.5, 0.5, 0.5,      1, 1,
        -0.5, -0.5, 0.5,    0, 0,
        -0.5, 0.5, 0.5,     0, 1,
        0.5, 0.5, 0.5,       1, 1,

        //top
        -0.5, 0.5, 0.5,      0, 1,
        0.5, 0.5, 0.5,      1, 1,
        -0.5, 0.5, -0.5,      0, 0,
        -0.5, 0.5, -0.5,      0, 0,
        0.5, 0.5, -0.5,      1, 0,
        0.5, 0.5, 0.5,      1, 1,

        //bottom
        -0.5, -0.5, 0.5,      0, 1,
        0.5, -0.5, 0.5,      1, 1,
        -0.5, -0.5, -0.5,      0, 0,
        -0.5, -0.5, -0.5,      0, 0,
        0.5, -0.5, -0.5,      1, 0,
        0.5, -0.5, 0.5,      1, 1,
    ])

    indicies = new Uint8Array([
        1, 2,
        2, 3,
        3, 4,
        4, 1,
        5, 6,
        6, 7,
        7, 8,
        8, 5,
        1, 5,
        4, 8,
        2, 6,
        3, 7
    ])

    sidesIndices = new Uint8Array([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
        10, 11, 12,
        13, 14, 15,
        16, 17, 18,
        19, 20, 21,
        22, 23, 24,
        25, 26, 27,
        28, 29, 30,
        31, 32, 33,
        34, 35, 36
    ]);

    /**
    * @type {WebGLBuffer}
    */
    elementBuffer;

    /**
    * @type {WebGLBuffer}
    */
    sideElementBuffer;

    /**
    * @type {Vector3}
    */
    sideColor;



    constructor() {
        super();
        const gl = EngineBase.getGlContext();

        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.mesh, gl.DYNAMIC_DRAW);

        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * 4, 0);
        gl.enableVertexAttribArray(0);

        this.elementBuffer = gl.createBuffer(gl.ELEMENT_ARRAY_BUFFER);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicies, gl.DYNAMIC_DRAW);

        this.sideElementBuffer = gl.createBuffer(gl.ELEMENT_ARRAY_BUFFER);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sideElementBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.sidesIndices, gl.DYNAMIC_DRAW);

        gl.bindVertexArray(null);
    }

    setMesh() {}

    /**
    * @public
    * @param {Texture2D} texture 
    */
    setTexture(texture) {
        this._texture = texture;
        const gl = EngineBase.getGlContext();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bindVertexArray(this.vao);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
        gl.enableVertexAttribArray(1);
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    /**
    * @public
    * @param {number} deltaTime 
    * @param {number} elapsedTime 
    */
    preDraw(deltaTime, elapsedTime) {

        const red = Math.sin(elapsedTime) / 2 + 0.7;
        const green = -1 * Math.sin(elapsedTime) / 2 + 0.7;
        const blue = Math.cos(elapsedTime) / 2 + 0.7;

        this.sideColor = new Vector3(red, green, blue);
        // this.translateLocal(new Vector3(0, Math.sin(elapsedTime) / 2, 0))
        // this.move(new Vector3(Math.sin(elapsedTime) * deltaTime, 0, 0));
        this.preDrawCallback?.call(this, deltaTime, elapsedTime);
    }

    /**
    * @public
    */
    draw() {
        const gl = EngineBase.getGlContext();
        this.calculateTransform();

        // gl.uniform3f(this.shader.getUniformLocation('uRgb'), this.sideColor.x, this.sideColor.y, this.sideColor.z);
        gl.uniformMatrix4fv(this.shader.getUniformLocation('uModel'), false, this.transformMatrix.toFloat32Array(), 0, 0);
        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sideElementBuffer);
        gl.drawElements(gl.TRIANGLES, this.sidesIndices.length, gl.UNSIGNED_BYTE, 0);

        // gl.uniform3f(this.shader.getUniformLocation('uRgb'), 0, 0, 0);
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
        // gl.drawElements(gl.LINES, this.indicies.length, gl.UNSIGNED_BYTE, 0);

        gl.bindVertexArray(null);
        this.resetTransform();
    }

    /**
    * @public
    */
    destroy() {
        const gl = EngineBase.getGlContext();
        this._texture.destroy();
        this.shader.destroy();
        Renderer.removeObjectFromQueue(this);

        gl.deleteBuffer(this.buffer);
        gl.deleteBuffer(this.elementBuffer);
        gl.deleteBuffer(this.sideElementBuffer);
        gl.deleteVertexArray(this.vao);

    }
}
