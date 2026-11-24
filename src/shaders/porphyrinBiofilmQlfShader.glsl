#version 300 es
precision highp float;
uniform sampler2D u_image;
uniform float u_time;
uniform float u_gain;
in vec2 v_uv;
out vec4 outColor;
void main(){
 vec4 px=texture(u_image,v_uv);
 float ratio=px.r/(px.g+.025);
 float porphyrinLike=smoothstep(1.02,1.45,ratio)*u_gain;
 float scatterLike=smoothstep(.48,.18,px.g)*.32;
 vec3 color=mix(px.rgb,vec3(1.0,.18,.27),porphyrinLike*.76);
 color=mix(color,vec3(.59,.82,1.0),scatterLike);
 outColor=vec4(color,px.a);
}
