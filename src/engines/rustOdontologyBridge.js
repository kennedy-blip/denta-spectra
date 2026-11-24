// Deterministic JavaScript mirror for client-only builds. Rust sources document the optional native DSP implementation.
export function summarizeSpectrum(samples, sampleRate=48000){
 if(!samples?.length)return {peakHz:0,lowEnergy:0,highEnergy:0,ratio:0};
 let low=0,high=0,peak=0,peakPower=0; const n=samples.length;
 for(let k=1;k<n/2;k++){let re=0,im=0;for(let i=0;i<n;i++){const w=.5-.5*Math.cos(2*Math.PI*i/(n-1));const a=2*Math.PI*k*i/n;re+=samples[i]*w*Math.cos(a);im-=samples[i]*w*Math.sin(a)}const p=re*re+im*im,f=k*sampleRate/n;if(f>=20&&f<300)low+=p;if(f>=300&&f<=1200)high+=p;if(f>=20&&f<=1200&&p>peakPower){peakPower=p;peak=f}}
 return {peakHz:+peak.toFixed(1),lowEnergy:low,highEnergy:high,ratio:+(high/Math.max(low,1e-9)).toFixed(3)};
}
export function detectPiperStage(ratio, durationMs){ if(ratio>.4&&durationMs>60)return 'Vb-like broadband pattern'; if(durationMs<20)return 'Transient click-like pattern'; if(ratio<.2)return 'Low-frequency dominant pattern'; return 'Mixed vibration pattern'; }
export function stephanRk4(state, params={}, dt=.1){const f=(s)=>({acid:(params.acidRate||.1)*Math.exp(-s.t/8)-(params.buffer||.08)*(s.h-(params.restH||1.58)),t:1});const add=(s,k,a)=>({h:s.h+k.acid*a,t:s.t+k.t*a});const k1=f(state),k2=f(add(state,k1,dt/2)),k3=f(add(state,k2,dt/2)),k4=f(add(state,k3,dt));return {h:state.h+dt*(k1.acid+2*k2.acid+2*k3.acid+k4.acid)/6,t:state.t+dt};}
