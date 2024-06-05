import { EngineBase } from "./engine_base.js";
import { GameObject } from "./game_object.js";
import { Mathf } from "./utils/mathf.js";
import { Vector3 } from "./utils/vector.js";

export class Cube extends GameObject {

    mesh = new Float32Array([
        0, 0, 0,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
    ])

    indicies = new Uint8Array([
        0, 1,
        1, 2,
        2, 3,
        3, 0,
        4, 5,
        5, 6,
        6, 7,
        7, 4,
        0, 4,
        3, 7,
        1, 5,
        2, 6
    ])

    sidesIndices = new Uint8Array([
        0, 1, 2,
        2, 3, 0,
        0, 4, 7,
        7, 3, 0,
        2, 6, 7,
        7, 3, 2,
        4, 5, 6,
        6, 7, 4,
        0, 1, 5,
        5, 4, 0,
        1, 2, 6,
        6, 5, 2
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

        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * 4, 0);
        gl.enableVertexAttribArray(0);

        for(let i = 0; i < this.indicies.length; i++) {
            this.indicies[i]++;
        }

        for(let i = 0; i < this.sidesIndices.length; i++) {
            this.sidesIndices[i]++;
        }

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

        gl.uniform3f(this.shader.getUniformLocation('uRgb'), this.sideColor.x, this.sideColor.y, this.sideColor.z);
        gl.uniformMatrix4fv(this.shader.getUniformLocation('uModel'), false, this.transformMatrix.toFloat32Array(), 0, 0);
        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sideElementBuffer);
        gl.drawElements(gl.TRIANGLES, this.sidesIndices.length, gl.UNSIGNED_BYTE, 0);

        gl.uniform3f(this.shader.getUniformLocation('uRgb'), 0, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
        gl.drawElements(gl.LINES, this.indicies.length, gl.UNSIGNED_BYTE, 0);

        gl.bindVertexArray(null);
        this.resetTransform();
    }
}
