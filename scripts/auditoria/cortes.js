const m=require('gray-matter'),fs=require('fs');const dir='content/blog';
const out={semRefs:[],refsCortadas:[],corpoCortadoAntesRefs:[]};
const okEnd=/[.!?)»"*:|`]$|^---$|https?:\/\/\S+$|\d$/;
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.md'))){
 const s=f.slice(0,-3), c=m(fs.readFileSync(dir+'/'+f,'utf8')).content.replace(/\s+$/,'');
 const re=/^#{2,4}\s*(Refer[êe]ncias[^\n]*|Fontes[^\n]*|Bibliografia[^\n]*)$/mi; const mt=c.match(re);
 if(!mt){const tail=c.split('\n').pop().trim(); out.semRefs.push(`${s} | fim: «${tail.slice(-70)}» ${okEnd.test(tail)?'':'[CORTADO]'}`);continue}
 const before=c.slice(0,mt.index).replace(/\s+$/,'').split('\n').filter(l=>l.trim()).pop().trim();
 if(!okEnd.test(before)) out.corpoCortadoAntesRefs.push(`${s}: «${before.slice(-60)}»`);
 const refs=c.slice(mt.index+mt[0].length).split('\n').map(l=>l.trim()).filter(l=>l&&l!=='---');
 const last=refs[refs.length-1]||'';
 const fine= refs.length && ( /https?:\/\/\S+$/.test(last) || /\.\s*$/.test(last) && last.length>50 || /\(\d{4}\)\.?.*\.$/.test(last));
 if(!fine) out.refsCortadas.push(`${s} [${refs.length} linhas]: «${last}»`);
}
for(const[k,v]of Object.entries(out)){console.log(`\n## ${k}: ${v.length}`);v.forEach(x=>console.log('  '+x))}
