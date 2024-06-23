import { Vector3 } from "./vector.js";
import { Mathf } from "./mathf.js";

export class Matrix4 {

    matrix = [
        1, 0, 0 ,0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    /**
     *  @param {Array<number>} array 
     */
    constructor(array = null) {

        if(array === null)
            return;

        if(typeof array !== 'object') {
            throw new DOMException('Matrix4 construct: argument is not array');
        }

        if(array.length !== 16) {
            throw new DOMException('Matrix4 construct: argument is not length of 16 (4x4 matrix)')
        }

        this.matrix = array;
    }

    /**
    * @param {Vector3} vec4 
    * @returns {Matrix4}
    */
    translate(vec3) {
        this.matrix[12] = vec3.x;
        this.matrix[13] = vec3.y;
        this.matrix[14] = vec3.z;

        return this;
    }

    /**
    * @param {Vector3} vec3 
    */
    scale(vec3) {
        this.matrix[0] += vec3.x;
        this.matrix[5] += vec3.y;
        this.matrix[10] += vec3.z;

        return this;
    }

    /**
    * @param {Vector3} vec3 
    */
    scaleTimes(vec3) {
        this.matrix[0] *= vec3.x;
        this.matrix[5] *= vec3.y;
        this.matrix[10] *= vec3.z;
    }

    /**
     * @param {number} deg
     * @private
     */
    getTrigOfDeg(deg) {
        const radians = Mathf.degreesToRadians(deg);
        const sine = Math.sin(radians);
        const cosine = Math.cos(radians);

        return {sine, cosine}
    }

    /**
     * @param {Matrix4} rotationMatrix 
     * @private
     */
    multiplyRotation(rotationMatrix) {
        rotationMatrix.multiply(this);
        this.matrix = rotationMatrix.toArray();
    }

    /**
     * @param {number} deg 
     */
    rotateX(deg) {
        const trig = this.getTrigOfDeg(deg);

        const rotationMatrix = [
            1, 0,           0,          0,
            0, trig.cosine, trig.sine,  0,
            0, -trig.sine, trig.cosine, 0,
            0, 0,           0,          1
        ] 

        const instance = new Matrix4(rotationMatrix);

        this.multiplyRotation(instance);

        return this;
    }

    /**
     * @param {number} deg 
     */
    rotateY(deg) {
        const trig = this.getTrigOfDeg(deg);

        const rotationMatrix = [
            trig.cosine, 0, -trig.sine,  0,
            0,           1, 0,           0,
            trig.sine,   0, trig.cosine, 0,
            0,           0, 0,           1
        ]

        const instance = new Matrix4(rotationMatrix);

        this.multiplyRotation(instance);

        return this;
    }

    /**
     * @param {number} deg 
     */
    rotateZ(deg) {
        const trig = this.getTrigOfDeg(deg);

        const rotationMatrix = [
            trig.cosine, trig.sine,   0, 0,
            -trig.sine,  trig.cosine, 0, 0,
            0,           0,           1, 0,
            0,           0,           0, 1
        ]

        const instance = new Matrix4(rotationMatrix);

        this.multiplyRotation(instance);

        return this;
    }

    /**
    * @param {Matrix4} by 
    */
    multiply(by) {

        by = by.toArray();
        const res = [];

        for(let row = 0; row <= 12; row += 4) {
            for(let column = 0; column <= 3; column++) {
                let tmpSum = 0;
                
                let i = 0;
                for(let rowBy = 0; rowBy <= 12; rowBy += 4) {
                    tmpSum += this.matrix[row + i] * by[column + rowBy];
                    i++;
                }

                res[row + column] = tmpSum;
            }
        }

        this.matrix = res;
    }

    multiplyVec3(by) {
        by = [by.x, by.y, by.z, 0];
        const res = [];

        let vecIndex = 0;
        for (let row = 0; row <= 12; row += 4) {
            let tmpSum = 0;

            for (let column = 0; column <= 3; column++) {
                tmpSum += this.matrix[row + column] * by[column];
            }

            res[vecIndex] = tmpSum;
            vecIndex++;
        }

        return new Vector3(res[0], res[1], res[2]);
    }

    static createPerspective(fov, aspectRatio, nearZ, farZ) {
        const fovRadian = Mathf.degreesToRadians(fov);

        const fovScalingFactor = 1 / Math.tan(fovRadian / 2);
        const x = aspectRatio * fovScalingFactor;
        const depthFactor = farZ / (farZ - nearZ);

        const matrix =  new Matrix4([
            x, 0, 0, 0,
            0, fovScalingFactor, 0, 0,
            0, 0, depthFactor, (-farZ * nearZ) / (farZ - nearZ),
            0, 0, 1, 0
        ]);

        matrix.transpose();

        return matrix;
    }

    transpose() {
        this.matrix = [
            this.matrix[0], this.matrix[4], this.matrix[8], this.matrix[12],
            this.matrix[1], this.matrix[5], this.matrix[9], this.matrix[13],
            this.matrix[2], this.matrix[6], this.matrix[10], this.matrix[14],
            this.matrix[3], this.matrix[7], this.matrix[11], this.matrix[15]
        ];
    }

    toFloat32Array() {
        return new Float32Array(this.matrix);
    }

    toArray() {
        return this.matrix;
    }

    reset() {
        this.matrix = [
            1, 0, 0 ,0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    toString() {
        return `
        [
            ${this.matrix[0]}, ${this.matrix[1]}, ${this.matrix[2]}, ${this.matrix[3]},
            ${this.matrix[4]}, ${this.matrix[5]}, ${this.matrix[6]}, ${this.matrix[7]},
            ${this.matrix[8]}, ${this.matrix[9]}, ${this.matrix[10]}, ${this.matrix[11]},
            ${this.matrix[12]}, ${this.matrix[13]}, ${this.matrix[14]}, ${this.matrix[15]}
        ]
        `;
    }
}
