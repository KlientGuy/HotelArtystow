import { Cube } from "./cube";
import { Texture2D } from "./texture_2d";

export class TexturedCube extends Cube {

    /**
    * @private
    * @type {Texture2D}
    */
    _texture;

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

    /**
    * @public
    * @param {Texture2D} texture 
    */
    setTexture(texture) {
        this._texture = texture;
    }

}
