import { EngineBase } from "../engine_base.js";

export class Shader {

    /** @type {string} */
    static shaderDir = '/glEngine/lib/shaders';
    /** @type {WebGLProgram} */
    glProgram;

    /** @type {WebGLShader} */
    vertexShader;

    /** @type {WebGLShader} */
    fragmentShader;

    /** 
     * @private
     * @type {WebGL2RenderingContext}
     */
    gl;

    /**
     *  @private
     *  @type {Map<string, WebGLUniformLocation>}
     */
    uniformMap = new Map();

    /**
    *   @param {string} vertexCode
    *   @param {string} fragmentCode
    *   @param {boolean} compile
    */
    constructor(vertexCode, fragmentCode, compile = false) {
        const gl = EngineBase.getGlContext();
        
        this.gl = gl;
        this.glProgram = gl.createProgram();

        if(compile) {
            this.compileShader(this.vertexShader, vertexCode, gl.VERTEX_SHADER);
            this.compileShader(this.fragmentShader, fragmentCode, gl.FRAGMENT_SHADER);
            this.linkProgram();
        }
    }

    /**
    *  @private
    *  @param {WebGLShader} target 
    *  @param {string} source 
    *  @param {number} type 
    */
    compileShader(target, source, type) {
        const gl = this.gl;

        target = gl.createShader(type);
        gl.shaderSource(target, source);
        gl.compileShader(target);

        if (!gl.getShaderParameter(target, gl.COMPILE_STATUS)) {
            let shaderType;

            if(type === gl.VERTEX_SHADER) 
                shaderType = 'vertex';
            else if(type === gl.FRAGMENT_SHADER)
                shaderType = 'fragment';

            console.log(source);

            throw new DOMException(`Error compiling ${shaderType} shader: ${gl.getShaderInfoLog(target)}`);
        }

        gl.attachShader(this.glProgram, target);
    }

    linkProgram() {
        const gl = this.gl;
        gl.linkProgram(this.glProgram);

        if(!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
            throw new DOMException(`Error linking program: ${gl.getProgramInfoLog(this.glProgram)}`);
        }
    }

    use() {
        this.gl.useProgram(this.glProgram);
    }

    /**
     *  @param {string} name 
     */
    getUniformLocation(name) {
        const gl = this.gl;

        let uniform = this.uniformMap.get(name);

        if(uniform === undefined) {
            uniform = gl.getUniformLocation(this.glProgram, name);
            this.uniformMap.set(name, uniform);
        }

        return uniform;
    }

    /**
    *   @param {string} vertexEndpoint 
    *   @param {string} fragmentEndpoint
    *   @param {boolean} compile 
    */
    static async fromUri(vertexEndpoint, fragmentEndpoint, compile = false) {
        const vertexSource = await (await fetch(`${this.shaderDir}/vertex/${vertexEndpoint}`)).text();
        const fragmentSource = await (await fetch(`${this.shaderDir}/fragment/${fragmentEndpoint}`)).text();

        return new Shader(vertexSource, fragmentSource, compile);
    }

    /**
    * @public
    */
    destroy() {
        const gl = EngineBase.getGlContext();
        gl.deleteProgram(this.glProgram);
        gl.deleteShader(this.vertexShader);
        gl.deleteShader(this.fragmentShader);
    }
}
