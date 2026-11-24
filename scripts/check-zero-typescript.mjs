import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();const ignored=new Set(['.git','node_modules','dist','build']);let bad=[];
function visit(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(item.isDirectory()){if(!ignored.has(item.name))visit(path.join(dir,item.name));continue}const file=path.join(dir,item.name);if(/\.(ts|tsx)$/.test(item.name)||item.name==='tsconfig.json')bad.push(file);if(item.name.endsWith('.vue')&&/lang\s*=\s*["']ts["']/.test(fs.readFileSync(file,'utf8')))bad.push(`${file}: lang="ts"`)}}
visit(root);if(bad.length){console.error('TypeScript artifacts found:\n'+bad.join('\n'));process.exit(1)}console.log('Zero TypeScript source/config files found.');
