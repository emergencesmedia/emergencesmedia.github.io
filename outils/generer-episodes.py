#!/usr/bin/env python3
"""Génère une page /podcast/<slug>/ par épisode à partir de js/content.js.
Usage (depuis la racine du site) : python3 outils/generer-episodes.py
Met aussi à jour EM_IMG, le sitemap et les données structurées.
Si Playwright est installé, pré-rend le contenu des pages (meilleur pour Google)."""
import json, re, subprocess, html, os, glob, datetime, sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
SITE="https://emergencesmedia.com"
data=json.loads(subprocess.check_output(["node","-e",'global.window={};require("./js/content.js");console.log(JSON.stringify(window.EMERGENCES))']))
def slugify(t):
    import unicodedata
    t=unicodedata.normalize("NFD",t.lower()); t="".join(c for c in t if unicodedata.category(c)!="Mn")
    return re.sub(r"[^a-z0-9]+","-",t).strip("-")
eps={}; order=[]
for p in data["podcast"]:
    for e in p.get("episodes",[]):
        k=e.get("slug") or slugify(e["title"])
        if k not in eps: eps[k]={"slug":k,"formats":[]}; order.append(k)
        m=eps[k]
        for x,v in e.items():
            if v not in ("",None) and x not in m: m[x]=v
        m["formats"].append(p["id"])
eps=sorted(eps.values(),key=lambda e:-(e.get("num") or 0))
# 1) images déclarées partout
keys={}
for e in eps:
    for f in ("img","imgWide"):
        if e.get(f):
            for ext in ("webp","jpg","png"):
                if os.path.exists(f"assets/{e[f]}.{ext}"): keys[e[f]]=f"/assets/{e[f]}.{ext}"
for f in glob.glob("**/*.html",recursive=True):
    s=open(f).read(); m=re.search(r"window\.EM_IMG=(\{.*?\});",s)
    if not m: continue
    d=json.loads(m.group(1)); n=dict(d); n.update({k:v for k,v in keys.items() if k not in d})
    if n!=d: s=s[:m.start(1)]+json.dumps(n,ensure_ascii=False)+s[m.end(1):]; open(f,"w").write(s)
# 2) pages épisodes
tpl=open("podcast/index.html").read()
def ld_episode(e,url):
    o={"@type":"PodcastEpisode","name":e["title"],"partOfSeries":{"@id":SITE+"/podcast/#serie"},"url":url,"inLanguage":"fr-FR",
       "episodeNumber":e.get("num"),"datePublished":e.get("dateISO"),"description":e.get("desc","")}
    media=[]
    if e.get("spotify"):
        sid=re.search(r"episode/([A-Za-z0-9]+)",e["spotify"]).group(1)
        media.append({"@type":"AudioObject","embedUrl":"https://open.spotify.com/embed/episode/"+sid})
    if e.get("youtube"):
        v={"@type":"VideoObject","name":e["title"],"description":e.get("desc",""),"uploadDate":e.get("dateISO"),
           "thumbnailUrl":"https://i.ytimg.com/vi/%s/hqdefault.jpg"%e["youtube"],"embedUrl":"https://www.youtube.com/embed/"+e["youtube"],
           "contentUrl":"https://www.youtube.com/watch?v="+e["youtube"]}
        if e.get("credit"): v["productionCompany"]={"@type":"Organization","name":e["credit"]}
        media.append(v)
    if media: o["associatedMedia"]=media if len(media)>1 else media[0]
    same=[x for x in [e.get("spotify"),("https://www.youtube.com/watch?v="+e["youtube"]) if e.get("youtube") else None] if x]
    if same: o["sameAs"]=same if len(same)>1 else same[0]
    if e.get("img") and e["img"] in keys: o["image"]=SITE+keys[e["img"]]
    return {k:v for k,v in o.items() if v is not None}
ldm=re.search(r'(<script type="application/ld\+json">)(.*?)(</script>)',tpl,re.S)
base=json.loads(ldm.group(2))
org=[x for x in base["@graph"] if x.get("@type")=="NewsMediaOrganization"][0]
serie=[x for x in base["@graph"] if x.get("@type")=="PodcastSeries"][0]
def meta(s,attr,name,val):
    return re.sub(r'(<meta %s="%s" content=")[^"]*(")'%(attr,re.escape(name)),lambda m:m.group(1)+html.escape(val,quote=True).replace("&#x27;","&#x27;")+m.group(2),s)
made=[]
for e in eps:
    url=f"{SITE}/podcast/{e['slug']}/"; title=f"{e['title']} · Le podcast Émergences"; desc=e.get("desc","")[:300]
    s=tpl
    s=re.sub(r"<title>.*?</title>","<title>"+html.escape(title)+"</title>",s)
    s=meta(s,"name","description",desc); s=meta(s,"property","og:title",title); s=meta(s,"property","og:description",desc)
    s=meta(s,"name","twitter:title",title); s=meta(s,"name","twitter:description",desc); s=meta(s,"property","og:url",url)
    s=re.sub(r'<link rel="canonical" href="[^"]*">','<link rel="canonical" href="%s">'%url,s)
    s=meta(s,"property","og:type","article")
    og=None
    for cand in (e.get("img","")+"-og.jpg", (e.get("img") or "").replace("-cover","-og")+".jpg"):
        if cand and os.path.exists("assets/"+cand): og="/assets/"+cand; break
    if not og and e.get("img") in keys: og=keys[e["img"]]
    if og: s=meta(s,"property","og:image",SITE+og); s=meta(s,"name","twitter:image",SITE+og)
    s=meta(s,"property","og:image:alt",e.get("imgAlt") or e["title"])
    graph={"@context":"https://schema.org","@graph":[org,serie,ld_episode(e,url),{"@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Accueil","item":SITE+"/"},{"@type":"ListItem","position":2,"name":"Podcast","item":SITE+"/podcast/"},
        {"@type":"ListItem","position":3,"name":e["title"],"item":url}]}]}
    m=re.search(r'(<script type="application/ld\+json">)(.*?)(</script>)',s,re.S)
    s=s[:m.start(2)]+json.dumps(graph,ensure_ascii=False)+s[m.end(2):]
    os.makedirs(f"podcast/{e['slug']}",exist_ok=True); open(f"podcast/{e['slug']}/index.html","w").write(s); made.append(e)
# 3) données structurées de la page podcast : chaque épisode pointe vers sa page
s=open("podcast/index.html").read(); m=re.search(r'(<script type="application/ld\+json">)(.*?)(</script>)',s,re.S); d=json.loads(m.group(2))
d["@graph"]=[x for x in d["@graph"] if x.get("@type")!="PodcastEpisode"]
pos=[i for i,x in enumerate(d["@graph"]) if x.get("@type")=="BreadcrumbList"][0]
for e in reversed(eps): d["@graph"].insert(pos,ld_episode(e,f"{SITE}/podcast/{e['slug']}/"))
s=s[:m.start(2)]+json.dumps(d,ensure_ascii=False)+s[m.end(2):]; open("podcast/index.html","w").write(s)
# 4) sitemap
sm=open("sitemap.xml").read()
for e in eps:
    loc=f"{SITE}/podcast/{e['slug']}/"
    line=f"  <url><loc>{loc}</loc><lastmod>{e.get('dateISO') or datetime.date.today().isoformat()}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n"
    if loc not in sm: sm=sm.replace("</urlset>",line+"</urlset>")
open("sitemap.xml","w").write(sm)
# 5) pré-rendu (facultatif)
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Playwright absent : pages créées sans pré-rendu (elles s'affichent quand même)."); sys.exit()
import http.server, threading, functools
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(("127.0.0.1",0),functools.partial(Quiet,directory=ROOT))
threading.Thread(target=srv.serve_forever,daemon=True).start(); port=srv.server_address[1]
pages={"/":"index.html","/podcast/":"podcast/index.html","/404.html":"404.html"}
pages.update({f"/podcast/{e['slug']}/":f"podcast/{e['slug']}/index.html" for e in eps})
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1300,"height":900})
    for u,f in pages.items():
        pg.goto(f"http://127.0.0.1:{port}{u}",wait_until="domcontentloaded"); pg.wait_for_timeout(700)
        r=pg.evaluate('document.getElementById("app").innerHTML').replace(' rv pre"',' rv"')
        s=open(f).read(); m=re.search(r'<main id="app" tabindex="-1">(.*?)</main><div id="shell-bottom">',s,re.S)
        s=s[:m.start(1)]+r+s[m.end(1):]
        if u.startswith("/podcast/") and u!="/podcast/": s=re.sub(r'(<a href="/podcast/" data-r="podcast")(?! aria-current)',r'\1 aria-current="page"',s)
        open(f,"w").write(s)
    b.close()
srv.shutdown(); print("ok :",", ".join(e["slug"] for e in made))
