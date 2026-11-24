#version 300 es
precision highp float;
uniform vec2 u_resolution; uniform float u_time; uniform float u_ph;
out vec4 outColor;
void main(){vec2 uv=gl_FragCoord.xy/u_resolution;vec2 p=(uv-.5)*vec2(u_resolution.x/u_resolution.y,1.);float a=atan(p.y,p.x);float r=length(p);float lattice=abs(sin(a*18.+sin(r*24.-u_time*.18)*.35));float rods=smoothstep(.06,.0,abs(lattice-.12))*smoothstep(.8,.1,r);float caustic=pow(max(0.,sin(22.*r-2.4*a+u_time*.25)),8.)*.22;vec3 calm=vec3(.02,.11,.16);vec3 acid=vec3(.20,.035,.12);vec3 c=mix(calm,acid,clamp((5.5-u_ph)/2.0,0.,1.));c+=vec3(.04,.42,.52)*rods*.48+vec3(.1,.38,.3)*caustic;outColor=vec4(c,1.);}
