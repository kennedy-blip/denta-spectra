export const shades = [
 ['0M1',94,0,8],['0M2',91,1,12],['0M3',88,2,16],['A1',82,2,14],['A2',78,3,18],['A3',70,5,22],['A3.5',65,7,24],['A4',60,8,25],['B1',86,1,16],['B2',80,2,21],['B3',73,4,25],['B4',67,6,27],['C1',78,0,7],['C2',72,1,9],['C3',65,2,11],['C4',58,3,13],['D2',79,2,11],['D3',69,4,15],['D4',63,5,13]
].map(([name,L,a,b])=>({name,L,a,b}));
export function labFromRgb(r,g,b){
 const lin=v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4}; const [R,G,B]=[lin(r),lin(g),lin(b)];
 let x=(.4124*R+.3576*G+.1805*B)/.95047, y=.2126*R+.7152*G+.0722*B, z=(.0193*R+.1192*G+.9505*B)/1.08883;
 const f=t=>t>.008856?Math.cbrt(t):7.787*t+16/116; const fx=f(x),fy=f(y),fz=f(z);
 return {L:+(116*fy-16).toFixed(1),a:+(500*(fx-fy)).toFixed(1),b:+(200*(fy-fz)).toFixed(1)};
}
export function deltaE2000(lab1, lab2){
 const rad=Math.PI/180, avgC=(Math.hypot(lab1.a,lab1.b)+Math.hypot(lab2.a,lab2.b))/2;
 const G=.5*(1-Math.sqrt(avgC**7/(avgC**7+25**7))); const a1=(1+G)*lab1.a,a2=(1+G)*lab2.a;
 const C1=Math.hypot(a1,lab1.b),C2=Math.hypot(a2,lab2.b); const h=(a,b)=>{let v=Math.atan2(b,a)/rad;return v<0?v+360:v}; const h1=h(a1,lab1.b),h2=h(a2,lab2.b);
 const dL=lab2.L-lab1.L,dC=C2-C1; let dh=h2-h1; if(C1*C2===0)dh=0; else if(dh>180)dh-=360; else if(dh< -180)dh+=360;
 const dH=2*Math.sqrt(C1*C2)*Math.sin(dh*rad/2); const avL=(lab1.L+lab2.L)/2,avC=(C1+C2)/2;
 let avh=h1+h2; if(C1*C2===0)avh=h1+h2; else if(Math.abs(h1-h2)>180)avh=avh<360?(avh+360)/2:(avh-360)/2; else avh/=2;
 const T=1-.17*Math.cos((avh-30)*rad)+.24*Math.cos(2*avh*rad)+.32*Math.cos((3*avh+6)*rad)-.20*Math.cos((4*avh-63)*rad);
 const Sl=1+.015*(avL-50)**2/Math.sqrt(20+(avL-50)**2),Sc=1+.045*avC,Sh=1+.015*avC*T;
 const Rt=-2*Math.sqrt(avC**7/(avC**7+25**7))*Math.sin(60*Math.exp(-(((avh-275)/25)**2))*rad);
 return Math.sqrt((dL/Sl)**2+(dC/Sc)**2+(dH/Sh)**2+Rt*(dC/Sc)*(dH/Sh));
}
export function matchShade(lab){return shades.map(shade=>({...shade,deltaE:+deltaE2000(lab,shade).toFixed(2)})).sort((a,b)=>a.deltaE-b.deltaE)[0]}
export function whitenessIndex({L,a,b}){return +(0.511*L-2.324*a-1.1*b).toFixed(1)}
