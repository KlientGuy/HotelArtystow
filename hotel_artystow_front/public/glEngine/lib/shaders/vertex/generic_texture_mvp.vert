#version 300 es
precision mediump float;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

uniform vec2 uTexPos;

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec2 aTextureCord;

out vec2 vTextureCord;

void main() {
    gl_Position = uProjection * uView * uModel * vec4(aPos, 1.0);
    vTextureCord = uTexPos + aTextureCord;
}
