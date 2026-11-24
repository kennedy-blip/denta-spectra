export const cdtItems=[
 {code:'D0150',name:'Comprehensive exam',median:110,high:165,category:'Diagnostic'}, {code:'D1110',name:'Adult prophylaxis',median:105,high:155,category:'Preventive'},
 {code:'D2391',name:'Posterior composite, 1 surface',median:190,high:280,category:'Restorative'}, {code:'D2740',name:'Ceramic crown',median:1120,high:1550,category:'Restorative'},
 {code:'D4341',name:'Scaling and root planing, 4+ teeth/quadrant',median:260,high:390,category:'Periodontal'}, {code:'D3330',name:'Molar root canal',median:980,high:1380,category:'Endodontic'},
 {code:'D9944',name:'Occlusal guard',median:520,high:760,category:'Adjunctive'}
];
export const brushPresets=[{name:'Gentle technique',grams:125},{name:'Over-pressure',grams:340},{name:'Feather-light',grams:35},{name:'Steady coverage',grams:165}];
export function estimateBrushForce({unloadedHz=260,loadedHz=250,harmonicRatio=.12}) {return Math.max(0,Math.min(500,Math.round((unloadedHz-loadedHz)*6+harmonicRatio*160)))}
export function auditQuote(lines=[], region='Kenya') {
 const rows=lines.map(line=>{const item=cdtItems.find(x=>x.code===line.code); if(!item)return {...line,median:0,high:0,flag:'Unknown code — request itemized explanation'}; const price=Number(line.price)||0;return {...item,price,median:item.median,high:item.high,flag:price>item.high*1.25?'Above illustrative comparison range':price>item.median*1.25?'Ask for a written breakdown':'Within illustrative comparison range'}});
 return {rows,total:rows.reduce((a,x)=>a+(Number(x.price)||0),0),reference:region,disclaimer:'Illustrative sample values only—not a local UCR fee schedule or clinical necessity determination.'};
}
