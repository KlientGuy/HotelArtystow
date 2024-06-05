#version 300 es
precision mediump float;

uniform vec3 uRgb;

out vec4 fragColor;

void main() {
    fragColor = vec4(uRgb, 1.0);
}
