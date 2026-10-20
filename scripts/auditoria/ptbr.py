import re,glob,sys,collections
NB=r'[^\wÀ-ÖØ-öø-ÿ]'
def w(p): return re.compile(rf'(?<!\w)(?:{p})(?![\wÀ-ÖØ-öø-ÿ])',re.I)
PAT={
'você':w('vocês?'),'treinamento':w('treinamentos?'),'panturrilha':w('panturrilhas?'),'esteira':w('esteiras?'),
'esporte':w('esportes?|esportiv[oa]s?'),'celular':w('celulares?'),'carboidrato':w('carboidratos?'),
'planejar':w('planej\\w*'),'mídia':w('mídias?'),'controle':w('controles?'),'contato':w('contatos?'),
'registro':w('registros?'),'de fato':w('de fato'),'estresse':w('estresse'),'câimbra':w('câimbras?|caimbras?'),
'trilha':w('trilhas?'),'usuário':w('usuári[oa]s?'),'aplicativo':w('aplicativos?'),'tela':w('telas?'),
'arquivo':w('arquivos?'),'baixar':w('baixar|baixe'),'café da manhã':w('café da manhã'),'suco':w('sucos?'),
'academia':w('academias?'),'camiseta':w('camisetas?'),'cadarço':w('cadarços?'),'bermuda':w('bermudas?'),
'fone':w('fones? de ouvido'),'banheiro':w('banheiros?'),'ônibus':w('ônibus'),'trem':w('trem'),
'acentos ô/ê':re.compile(r'(?:econôm|acadêm|eletrôn|fenôm|goniôm|tênis|crônic|anatôm|quilômetr|milímetr|centímetr|gênero|prêmio|ônus|fisionom|autônom|ergonôm|harmônic|hormôn|imunológ)',re.I),
'gerúndio':re.compile(r'(?<![\wÀ-ÿ])(?:est(?:á|ás|ão|ava|avam|ou|amos|eja|ejam)|continua[rm]?|vai|vão|fica[rm]?|segue[m]?|começa[rm]?|anda[rm]?)\s+(?!sendo\b)[a-zà-ÿ]{3,}(?:ando|endo|indo)(?![\wÀ-ÿ])',re.I),
'umidade':w('umidade'),'ótimo/time':w('time'),
}
hits=collections.defaultdict(list)
for f in sorted(glob.glob('content/blog/*.md')):
    s=open(f,encoding='utf-8').read()
    for k,r in PAT.items():
        for m in r.finditer(s):
            hits[k].append((f.split('/')[-1],m.group(0)))
for k,v in sorted(hits.items(),key=lambda x:-len(x[1])):
    files=len(set(a for a,_ in v))
    print(f"{k:16} {len(v):4} ocorr. em {files:3} artigos  ex: {collections.Counter(b.lower() for _,b in v).most_common(4)}")
