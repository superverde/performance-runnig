const m=require('gray-matter'),fs=require('fs'),path=require('path');
const dir='content/blog';const files=fs.readdirSync(dir).filter(f=>f.endsWith('.md'));
const slugs=new Set(files.map(f=>f.replace(/\.md$/,'')));
const R={curto:[],semRefs:[],refsCortadas:[],fimCortado:[],mojibake:[],linkInternoPartido:[],linksExternosSuspeitos:[],excerptMau:[],semTitulo:[],dataFutura:[],tituloDup:{},semFaq:[],headingsDup:[],placeholders:[]};
const titles={};const today=new Date().toISOString().slice(0,10);
for(const f of files){const raw=fs.readFileSync(path.join(dir,f),'utf8');let d;try{d=m(raw)}catch(e){R.semTitulo.push(f+' YAML:'+e.message.slice(0,60));continue}
 const c=d.content, words=c.split(/\s+/).filter(Boolean).length, s=f.replace(/\.md$/,'');
 if(!d.data.title)R.semTitulo.push(f);
 (titles[(d.data.title||'').toLowerCase().trim()] ||= []).push(s);
 if(words<600)R.curto.push(`${s} (${words})`);
 const refIdx=c.search(/^##\s*(Referências|Fontes|Bibliografia)/mi);
 if(refIdx<0)R.semRefs.push(s); else {const refs=c.slice(refIdx).split('\n').slice(1).map(l=>l.trim()).filter(Boolean);
   const last=refs[refs.length-1]||''; if(!refs.length|| (last.length<45 && !/https?:\/\//.test(last)) || /[,(]$|&$|\b(e|and|In)$/.test(last)) R.refsCortadas.push(`${s}: «${last.slice(0,60)}»`);}
 const tail=c.trim().split('\n').pop().trim(); if(refIdx<0 && !/[.!?)»"*|]$/.test(tail))R.fimCortado.push(`${s}: «${tail.slice(-50)}»`);
 if(/Ã[\x80-\xBF©§£¡ª³µº¼½¾]|Ã©|Ã£|Ã§|â€/.test(raw))R.mojibake.push(s);
 for(const mm of c.matchAll(/\]\((\/[^)\s#]*)/g)){const u=mm[1];const b=u.match(/^\/blog\/([^/?]+)/);if(b&&!slugs.has(decodeURIComponent(b[1])))R.linkInternoPartido.push(`${s} → ${u}`); else if(!b) R.__int=(R.__int||new Set()).add(u)}
 for(const mm of c.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)){const u=mm[1];if(!/doi\.org|pubmed|ncbi|amazon\.|racefinder|aminhacorrida|performancerunning|wikipedia|garmin\.com|coros\.com|polar\.com|suunto\.com|strava\.com|apple\.com|nike\.com|asics\.com|hoka\.com|adidas|brooks|saucony|newbalance|salomon|decathlon|who\.int|sciencedirect|springer|wiley|tandfonline|frontiersin|bmj|journals|mdpi/.test(u))R.linksExternosSuspeitos.push(`${s} → ${u}`)}
 const ex=d.data.excerpt||''; if(ex.length<80||ex.length>170||/\.\.\.$|…$/.test(ex)||!/[.!?]$/.test(ex.trim()))R.excerptMau.push(`${s} (${ex.length}) «${ex.slice(-40)}»`);
 const dt=String(d.data.date instanceof Date?d.data.date.toISOString().slice(0,10):d.data.date||''); if(dt>today)R.dataFutura.push(`${s} ${dt}`);
 if(!d.data.faqs && !/##\s*Perguntas Frequentes/i.test(c))R.semFaq.push(s);
 const hs=[...c.matchAll(/^##\s+(.+)$/gm)].map(x=>x[1].trim().toLowerCase());const dup=hs.filter((h,i)=>hs.indexOf(h)!==i);if(dup.length)R.headingsDup.push(`${s}: ${[...new Set(dup)].join(' | ')}`);
 if(/\[(inserir|link|URL|nome)[^\]]*\]|TODO|lorem ipsum|XX\s?km|\{\{/i.test(c))R.placeholders.push(s);
}
for(const[t,v]of Object.entries(titles))if(v.length>1)R.tituloDup[t]=v;
const internos=[...(R.__int||[])];delete R.__int;
console.log('Artigos:',files.length);
for(const[k,v]of Object.entries(R)){const n=Array.isArray(v)?v.length:Object.keys(v).length;console.log(`\n## ${k}: ${n}`);(Array.isArray(v)?v:Object.entries(v).map(x=>x.join(' → '))).slice(0,40).forEach(x=>console.log('  '+x))}
console.log('\n## links internos não-blog usados:',internos.join(' '));
