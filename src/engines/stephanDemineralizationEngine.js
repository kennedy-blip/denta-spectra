export const foodChallenges = [
 {name:'Water', acidity:0.08, sugar:0.02, color:'#38bdf8'},
 {name:'Sweetened coffee', acidity:0.38, sugar:0.7, color:'#b77945'},
 {name:'Cola', acidity:0.9, sugar:1, color:'#a855f7'},
 {name:'Cheese / xylitol', acidity:-0.35, sugar:0.02, color:'#10b981'},
];
export function simulateStephan({baseline=6.8, acid=0.72, saliva=1, fluoride=1450, xylitol=0, minutes=60, step=1}={}) {
 const rows=[]; let ph=baseline; let dissolution=0; const buffer=0.045+saliva*0.028+fluoride/50000+xylitol*0.04;
 for(let t=0;t<=minutes;t+=step){
  const source=acid*Math.exp(-t/8); const rescue=buffer*(baseline-ph);
  ph=Math.max(3.2,Math.min(7.2,ph+(rescue-source)*(t===0?1.55:0.10)));
  if(ph<5.5) dissolution+=step;
  rows.push({t,ph:Number(ph.toFixed(2)),zone:ph<4.5?'high-risk':ph<5.5?'demin':'recovery'});
 }
 return {rows, dissolutionMinutes:dissolution, minimumPh:Math.min(...rows.map(x=>x.ph)), recovery:rows.find(x=>x.ph>=5.5)?.t ?? null};
}
