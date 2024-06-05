export class Vector4 {
    x = 0;
    y = 0;
    z = 0;
    w = 0;

    /**
    * @param {number} x 
    * @param {number} y 
    * @param {number} z 
    * @param {boolean} position 
    */
    constructor(x, y, z, position = true) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = position ? 1 : 0;
    };
}

export class Vector3 {
    x = 0;
    y = 0;
    z = 0;

    /**
    * @param {number} x 
    * @param {number} y 
    * @param {number} z 
    */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    };

    /**
    * @param {number} number 
    */
    multiplyByNumber(number) {
        this.x *= number;
        this.y *= number;
        this.z *= number;

        return this;
    }

    /**
    * @param {Vector3} vec3 
    */
    static fromVector(vec3) {
        return new Vector3(vec3.x, vec3.y, vec3.z);
    }

}
