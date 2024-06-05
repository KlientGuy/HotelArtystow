import { Matrix4 } from "./utils/matrix4.js";
import { Vector3 } from "./utils/vector.js";

export class Camera {

    /**
    * @type {Matrix4}
    * @private
    */
    viewMatrix = new Matrix4();

    /**
     * @type {Matrix4}
     * @private
     */
    translationMatrix = new Matrix4();

    /**
     * @type {Matrix4}
     * @public
     */
    rotationMatrix = new Matrix4();

    moveSpeed = 1;
    moveSpeedMultiplier = 1;

    /**
     * @type {Vector3}
     * @private
     */
    direction = new Vector3(0,0,0);

    rotation = new Vector3(0, 0, 0);

    /**
     * @type {HTMLCanvasElement}
     */
    canvas;

    /** 
     * @param {HTMLCanvasElement} canvasElement 
     */
    constructor(canvasElement) {
        this.canvas = canvasElement;
    }

    enableMovement() {
        document.addEventListener('keydown', (e) => {

            if(e.key === 'r' || e.key === 'Control' || e.key === 'F12' || e.repeat)
            return;

            e.preventDefault();

            if(e.key === 'Shift') {
                this.moveSpeedMultiplier = 3;
                return;
            }

            this.handleCameraMovement(e.key);
        })

        document.addEventListener('keyup', (e) => {

            if (e.key === 'r' || e.key === 'Control')
            return;

            e.preventDefault();

            if (e.key === 'Shift') {
                this.moveSpeedMultiplier = 1;
            }

            this.cancelCameraMovement(e.key);
        })

        /** @param {MouseEvent} e */
        const mouseListener = (e) => this.handleMousemoveEvent(e);

        document.addEventListener('pointerlockchange', () => {
            if(document.pointerLockElement === this.canvas)
            document.addEventListener('mousemove', mouseListener);
            else
            document.removeEventListener('mousemove', mouseListener);
        });

        this.setupPointerLock();
    }

    setupPointerLock() {
        const self = this;
        this.canvas.addEventListener('click', async () => {
            if(document.pointerLockElement === self.canvas)
                return;

            self.canvas.requestPointerLock({
                unadjustedMovement: true
            });
        })
    }

    getMatrix() {

        this.viewMatrix = new Matrix4(this.translationMatrix.toArray());
        this.viewMatrix.multiply(this.rotationMatrix);

        return this.viewMatrix;
    }

    getDirection() {
        return this.direction;
    }

    /**
    * @param {Vector3} vec3 
    */
    move(vec3) {
        const newTrans = new Matrix4();
        newTrans.translate(vec3);

        this.translationMatrix.multiply(newTrans);

        return this;
    }

    /**
     * @param {Vector3} vec3 
     */
    rotate(vec3) {
        this.rotationMatrix
            .rotateY(vec3.y)
            .rotateZ(vec3.z)
            .rotateX(vec3.x);
    }

    /**
     * @param {string} keycode 
     */
    handleCameraMovement(keycode) {
        switch(keycode.toLowerCase()) {
            case 'w':
                this.direction.z = -1;
            break;
            case 's':
                this.direction.z = 1;
            break;
            case 'd':
                this.direction.x = -1;
            break;
            case 'a':
                this.direction.x = 1;
            break;
            case ' ':
                this.direction.y = -1;
            break;
            case 'alt':
                this.direction.y = 1;
            break;
        }
    }

    /**
     * @param {string} keycode 
     */
    cancelCameraMovement(keycode) {
        switch(keycode.toLowerCase()) {
            case 'w':
            case 's':
                this.direction.z = 0;
                break;
            case 'd':
            case 'a':
                this.direction.x = 0;
            break;
            case ' ':
            case 'alt':
                this.direction.y = 0;
            break;
        }
    }

    x = 0; y = 0;

    /**
    * @param {MouseEvent} e 
    */
    handleMousemoveEvent(e) {
        clearTimeout(this.mousestopTimeout);

        this.mousestopTimeout = setTimeout(() => {
            // this.rotation.y = 0;
        }, 10);

        this.x += e.movementX;
        this.y += e.movementY;

        this.rotation.x = this.y * 0.1;
        this.rotation.y = this.x * 0.1;

        this.rotationMatrix.reset();
        this.rotationMatrix.rotateY(-this.rotation.y);
        const right = this.rotationMatrix.multiplyVec3(new Vector3(1, 0, 0));

        right.x *= -this.rotation.x;
        right.y *= -this.rotation.x;
        right.z *= -this.rotation.x;
        this.rotate(right);
    }
}
