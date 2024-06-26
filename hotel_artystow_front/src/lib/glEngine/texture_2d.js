import { EngineBase } from "./engine_base";

export class Texture2D {

    static _texturePath = '/glEngine/textures/'
    
    /**
     * @private
     * @type {boolean}
     */
    _isAtlas;

    /**
     * @private
     * @type {HTMLImageElement}
     */
    _image;

    /**
     * @private
     * @type {WebGLTexture}
     */
    _texture;

    /**
     * @public
     * @param {HTMLImageElement} image 
     */
    constructor(image, isAtlas = false) {
        this._isAtlas = isAtlas;
        this._image = image;

        const gl = EngineBase.getGlContext();
        this._texture = gl.createTexture(gl.TEXTURE_2D);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, this._image);

        // gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    /**
     * @public
     */
    use() {
        const gl = EngineBase.getGlContext();
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
    }

    /**
    * @public
    * @static
    * @param {string} uri 
    * @param {number} width 
    * @param {number} height 
    */
    static async fromUri(uri, width, height) {
        const res = await fetch(`${this._texturePath}${uri}`);

        if(!res.ok)
            throw new DOMException(`Could not load texture ${uri}: ${res.statusText}`);

        const blob = await res.blob();
        const image = new Image();
        image.src = URL.createObjectURL(blob);
        image.width = width;
        image.height = height;

        await new Promise((resolve) => image.onload = () => resolve());

        return new Texture2D(image);
    }

    /**
    * @public
    */
    destroy() {
        const gl = EngineBase.getGlContext();
        gl.deleteTexture(this._texture);
    }
}
