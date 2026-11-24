export const tmjPresets = [
 {name:'Smooth opening', low:12.4, high:1.2, duration:7, opening:43, deviation:1.1, stage:'Low vibration example'},
 {name:'Reciprocal click pattern', low:42, high:7.8, duration:14, opening:39, deviation:2.8, stage:'Click-like transient example'},
 {name:'Restricted opening pattern', low:31, high:8.1, duration:42, opening:27, deviation:4.5, stage:'Restricted motion example'},
 {name:'Broadband crepitus-like pattern', low:18, high:15, duration:76, opening:34, deviation:3.2, stage:'Broadband vibration example'},
];
export function analyzeVibration(low, high, duration=20) {
 const ratio=high/Math.max(low,0.001);
 const label=ratio>=0.25 && duration>60?'Broadband vibration pattern':duration<20?'Brief transient-like pattern':'Low-frequency dominant pattern';
 return {ratio:Number(ratio.toFixed(2)), total:Number((low+high).toFixed(1)), label, duration};
}
export function estimateBrushLoad(unloaded, loaded, thd=0.08) { return Math.max(0, Math.min(500, (unloaded-loaded)*9 + thd*120)); }
