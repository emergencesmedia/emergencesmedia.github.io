/* Émergences — moteur du site (aucune dépendance). Les contenus sont dans content.js. */
(function(){
"use strict";
var D = window.EMERGENCES, IMG = window.EM_IMG || {};
var app = document.getElementById("app");
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js");

/* ---------- utilitaires ---------- */
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function theme(slug){for(var i=0;i<D.themes.length;i++){if(D.themes[i].slug===slug)return D.themes[i];}return null;}
function themesOf(a){return (a.themes||[a.rubrique]).map(theme).filter(Boolean);}
function main(a){return themesOf(a)[0]||D.themes[0];}
function art(slug){for(var i=0;i<D.articles.length;i++){if(D.articles[i].slug===slug)return D.articles[i];}return null;}
function byTheme(slug){return D.articles.filter(function(a){return themesOf(a).some(function(t){return t.slug===slug;});});}
function img(key,alt,cls){return IMG[key]?'<img src="'+IMG[key]+'" alt="'+esc(alt||"")+'"'+(cls?' class="'+cls+'"':"")+' decoding="async">':"";}
function isExt(h){return /^https?:/.test(h);}
var FULL={camerahead:1};

function vis(a){
  var t=main(a),c=a.cover||{};
  if(a.photo&&IMG[a.photo])return '<div class="vis full" data-c="'+t.color+'">'+img(a.photo,a.photoAlt||"")+'</div>';
  return '<div class="vis cover" data-c="'+t.color+'"><span class="cv-k">'+esc(t.name)+'</span>'+
    '<span class="cv-big">'+esc(c.big||a.format)+'</span>'+(c.small?'<span class="cv-s">'+esc(c.small)+'</span>':'')+
    '<span class="cv-e" aria-hidden="true">E</span></div>';
}
function chipT(t){return '<a class="chip" data-c="'+t.color+'" href="#blog-'+t.slug+'">'+esc(t.short)+'</a>';}
function meta(a){return '<div class="meta">'+themesOf(a).map(function(t){return '<span class="chip" data-c="'+t.color+'">'+esc(t.short)+'</span>';}).join("")+'<span>'+esc(a.format)+'</span><span>'+a.read+' min</span></div>';}
function card(a){var t=main(a);return '<a class="card rv" data-c="'+t.color+'" href="#a-'+a.slug+'">'+vis(a)+'<div class="txt">'+meta(a)+'<h3>'+esc(a.title)+'</h3><p>'+esc(a.chapo)+'</p></div></a>';}
function featured(){var f=D.articles.filter(function(a){return a.featured;});return f.length?f:D.articles.slice(0,1);}
function mailBox(dark){
  return '<div class="mailbox'+(dark?" dark":"")+'"><span class="addr" id="'+(dark?"m2":"m1")+'">'+esc(D.site.email)+'</span><button type="button" class="js-copymail">Copier</button><a href="mailto:'+esc(D.site.email)+'">Écrire</a></div>';
}

/* ---------- bandes ondulées (motif du dossier de DA) ---------- */
function stripesSVG(){
  var W=1200,H=900,P=300,n=15,bw=W/n,amp=14,cols=["#C82828","#38B6FF"],out="";
  for(var i=0;i<n;i++){
    var x0=i*bw,pts=[],back=[];
    for(var y=0;y<=H+P;y+=25){
      pts.push((x0+Math.sin((y/P)*Math.PI*2+i*0.55)*amp).toFixed(1)+","+y);
      back.unshift((x0+bw+Math.sin((y/P)*Math.PI*2+(i+1)*0.55)*amp).toFixed(1)+","+y);
    }
    out+='<polygon fill="'+cols[i%2]+'" points="'+pts.concat(back).join(" ")+'"/>';
  }
  return '<svg class="stripes" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g>'+out+'</g></svg>';
}

/* ---------- écran de télévision ---------- */
function noise(canvas,ms){
  var ctx=canvas.getContext("2d");canvas.width=160;canvas.height=100;
  var scr=canvas.parentNode;scr.classList.add("static");var t0=performance.now();
  (function frame(t){var d=ctx.createImageData(160,100);
    for(var i=0;i<d.data.length;i+=4){var v=Math.random()*255|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}
    ctx.putImageData(d,0,0);if(t-t0<ms)requestAnimationFrame(frame);else scr.classList.remove("static");})(t0);
}
function tvSet(scr,idx,instant){
  var slides=$$(".slide",scr),cv=$("canvas",scr);
  function show(){slides.forEach(function(s,i){s.classList.toggle("on",i===idx);});var h=slides[idx].getAttribute("data-href");if(h&&scr.tagName==="A")scr.setAttribute("href",PATHS?(toPath(h)||h):h);scr.setAttribute("aria-label",slides[idx].getAttribute("data-label")||"");}
  if(instant||reduce){show();return;}noise(cv,260);setTimeout(show,120);
}
function slide(chip,color,title,go,href,on){
  return '<div class="slide'+(on?" on":"")+'"'+(href?' data-href="'+href+'"':"")+' data-label="'+esc(title)+'"><span class="chip" data-c="'+color+'">'+esc(chip)+'</span><h2>'+esc(title)+'</h2><span class="go">'+esc(go)+'</span></div>';
}

/* ---------- ACCUEIL ---------- */
function pageHome(){
  var F=featured(),lead=F[0],others=D.articles.filter(function(a){return a!==lead;});
  var slides=F.map(function(a,i){var t=main(a);return slide("Blog · "+t.short,t.color,a.title,"Lire →","#a-"+a.slug,i===0);}).join("")+
    D.podcast.map(function(p){var e=latest(p);return slide("Podcast "+p.short.toLowerCase(),p.color,e?(e.num?"Épisode "+e.num+" · ":"")+e.title:p.name,e?"Écouter →":p.status,"#podcast",false);}).join("")+
    slide("Appel à projets","jaune","Ton projet mérite l'antenne","Proposer →","#agir",false);
  var tickItems=D.articles.map(function(a){return '<a href="#a-'+a.slug+'">'+esc(a.title)+'</a>';}).join("")+
    D.podcast.map(function(p){return '<a href="#podcast">'+esc(p.name)+' : '+esc(p.status.toLowerCase())+'</a>';}).join("")+
    '<a href="#agir">Appel à projets ouvert</a><a href="#apropos">Écris-nous : '+esc(D.site.email)+'</a>';
  var logo="EMERGENCES".split("").map(function(c,i){return '<span class="l" style="animation-delay:'+(0.25+i*0.05)+'s">'+c+'</span>';}).join("");
  var ep=latest(D.podcast[0]);
  var tiles=[
    ['#blog','rouge','Le blog','Nos articles pour comprendre le monde','Lire le blog'],
    ['#podcast','violet','Podcast audio',ep?(ep.num?'Épisode '+ep.num+' : ':'')+ep.title:D.podcast[0].status,ep?'Écouter':'Bientôt'],
    ['#podcast','corail','Podcast vidéo',D.podcast[1].status,'Découvrir'],
    ['#agir','jaune','Appel à projets','Présente ton projet à la rédaction','Proposer']
  ].map(function(x,i){return '<a class="tile rv" href="'+x[0]+'" data-c="'+x[1]+'"'+(i===1?' data-chan="audio"':i===2?' data-chan="video"':'')+'><span class="kicker">'+esc(x[2])+'</span><b>'+esc(x[3])+'</b><span class="go">'+esc(x[4])+' →</span></a>';}).join("");

  return ''+
  '<section class="hero" aria-labelledby="h-une">'+stripesSVG()+
    img("megaphone","","floater f1")+img("star","","floater f2")+img("mouth","","floater f3")+
    '<div class="wrap hero-inner">'+
      '<div class="tvbox"><a class="screen" id="tv" href="#a-'+lead.slug+'">'+slides+'<canvas aria-hidden="true"></canvas></a>'+
        img("tv","Téléviseur vintage tenu par une main, l'écran affiche la une d'Émergences")+
        '<button class="zap" id="zap" aria-label="Changer de chaîne"></button></div>'+
      '<h1 id="h-une" class="logo" aria-label="Émergences">'+logo+'</h1>'+
      '<p class="tag">'+esc(D.site.tagline)+'</p>'+
      '<div class="sub"><button class="btn" id="zap2" type="button">Changer de chaîne ↻</button><a class="btn alt" href="#apropos">Nous comprendre en 1 minute</a></div>'+
    '</div>'+
  '</section>'+
  '<div class="ticker" role="region" aria-label="En ce moment"><span class="lbl"><i class="burst" style="width:12px;height:12px;background:var(--jaune);display:inline-block"></i>En ce moment</span><div class="track">'+tickItems+tickItems+'</div></div>'+

  '<section class="sec"><div class="wrap">'+
    '<div class="sec-head"><h2>À la une</h2></div>'+
    '<a class="feature rv" data-c="'+main(lead).color+'" href="#a-'+lead.slug+'">'+vis(lead)+'<div class="ftxt">'+meta(lead)+'<h3>'+esc(lead.title)+'</h3><p>'+esc(lead.chapo)+'</p><span class="more">Lire l\'article</span></div></a>'+
    (others.length?'<div class="list" style="margin-top:44px">'+others.slice(0,3).map(card).join("")+'</div>':"")+
    '<div class="prog4"><h3 class="kicker">Au programme</h3><div class="tiles">'+tiles+'</div></div>'+
  '</div></section>'+

  '<section class="freq" aria-label="Les thèmes du blog">'+D.themes.map(function(t){
    return '<a class="band" data-c="'+t.color+'" href="#blog-'+t.slug+'">'+img(t.img,"")+'<div class="wrap"><span class="ch">'+t.ch+'</span><span class="name">'+esc(t.name)+'</span><span class="last">'+esc(t.desc)+'</span></div></a>';
  }).join("")+'</section>'+

  '<section class="antenne sec"><div class="wrap cols">'+
    '<div class="pod-intro"><div class="pod-top"><div><h2 class="pod-h">Le podcast</h2>'+(D.site.podcastName?'<p class="pod-name">« '+esc(D.site.podcastName)+' »</p>':'')+'</div>'+rhythm()+'</div><p class="lede on-dark">Une conversation avec <span class="hl">celles et ceux qui font bouger les choses</span>, à écouter ou à regarder.</p>'+
      '<div class="grille">'+D.podcast.map(function(p){return '<a class="prog" data-c="'+p.color+'" href="#podcast" data-chan="'+p.id+'"><span class="ch">'+p.ch+'</span><span class="type">'+esc(p.name)+' · '+esc(latest(p)?epMeta(latest(p)):p.status)+'</span><b>'+esc(latest(p)?latest(p).title:p.name)+'</b></a>';}).join("")+'</div>'+
      '<div><a class="btn" href="#podcast">Allumer le poste</a></div></div>'+
    (ep&&ep.img?'<a class="pod-photo" href="#podcast" data-chan="audio">'+img(ep.img,"Enregistrement du premier épisode du podcast Émergences")+'<span class="epn">EP.01</span></a>':'')+
  '</div></section>'+

  '<section class="sec crew"><div class="wrap crew-in">'+
    '<div class="crew-ph rv">'+img("team-group","L'équipe d'Émergences devant une carte du monde")+'</div>'+
    '<div><span class="kicker">Qui sommes-nous</span><h2 class="crew-t">Quatre étudiants, un média</h2>'+
    '<p class="lede">Quatre parcours, <span class="hl">une même conviction</span> : bien comprendre le monde donne envie d\'y agir.</p>'+
    '<ul class="crew-names">'+D.team.map(function(m){return '<li data-c="'+m.color+'"><b>'+esc(m.name)+'</b><span>'+esc(m.studies)+'</span></li>';}).join("")+'</ul>'+
    '<a class="btn" href="#apropos">Nous comprendre en 1 minute</a></div>'+
  '</div></section>'+
  emergeBlock();
}

function emergeBlock(){
  return '<section class="emerge sec" id="proposer"><div class="wrap cols">'+
    '<div><span class="kicker">Ça émerge · appel à projets</span><h2>Ton projet<br>mérite<br>l\'antenne</h2>'+
    '<p style="max-width:46ch;font-size:1.1rem;margin:18px 0 0">Association, start-up à impact, collectif artistique, initiative de quartier : on cherche les projets portés par des jeunes qui changent déjà quelque chose. Les meilleurs feront l\'objet d\'un article ou d\'un épisode du podcast.</p>'+
    '<form class="box js-form" novalidate>'+
      '<div class="row2"><div class="field"><label for="p-nom">Ton prénom</label><input id="p-nom" name="nom" required autocomplete="given-name"></div>'+
      '<div class="field"><label for="p-mail">Ton e-mail</label><input id="p-mail" name="email" type="email" required autocomplete="email"></div></div>'+
      '<div class="field"><label for="p-theme">Thème</label><select id="p-theme" name="theme">'+D.themes.map(function(t){return '<option>'+esc(t.name)+'</option>';}).join("")+'<option>Autre</option></select></div>'+
      '<div class="field"><label for="p-projet">Le projet en quelques lignes</label><textarea id="p-projet" name="projet" required></textarea></div>'+
      '<div><button class="btn dark" type="submit">Envoyer à la rédaction</button></div>'+
      '<p class="notice">Tu préfères écrire directement ? '+esc(D.site.email)+'</p>'+
    '</form></div>'+
    img("woman","Jeune femme criant dans un mégaphone, collage noir et blanc","woman")+
  '</div></section>';
}

/* ---------- BLOG ---------- */
function pageBlog(filter){
  return '<header class="r-head" data-c="rouge"><div class="wrap">'+
      '<span class="ch">Le blog d\'Émergences</span><h1>Notre blog</h1><p>Articles, décryptages et portraits. Un même article peut croiser plusieurs thèmes : filtrez par celui qui vous intéresse.</p></div></header>'+
    '<section class="sec"><div class="wrap">'+
      '<div class="filters" role="group" aria-label="Filtrer par thème"><button type="button" aria-pressed="'+(!filter)+'" data-f="">Tous les articles</button>'+
        D.themes.map(function(t){return '<button type="button" data-c="'+t.color+'" aria-pressed="'+(filter===t.slug)+'" data-f="'+t.slug+'">'+esc(t.name)+'</button>';}).join("")+'</div>'+
      '<div class="list" id="blist"></div>'+
    '</div></section>'+emergeBlock();
}
function blogList(filter){
  var list=filter?byTheme(filter):D.articles, t=theme(filter);
  if(!list.length)return '<div class="empty">Pas encore d\'article sur le thème « '+esc(t?t.name:"")+' ». Le prochain arrive bientôt.<br><a class="more" href="#agir" style="display:inline-block;margin-top:12px">Proposer un sujet</a></div>';
  return list.map(card).join("")+(list.length<3?'<div class="soon rv"><span class="kicker">Bientôt sur le blog</span><b>De nouveaux articles sont en cours d\'écriture.</b><p>Suivez-nous sur Instagram pour ne rien rater.</p><a class="more" href="'+esc(D.site.instagram)+'" target="_blank" rel="noopener">@emergencesmedia ↗</a></div>':"");
}

/* ---------- ARTICLE ---------- */
function pageArticle(slug){
  var a=art(slug);if(!a)return null;var t=main(a);
  var body=a.body.map(function(b){
    if(b.p)return '<p>'+esc(b.p)+'</p>';
    if(b.h)return '<h2>'+esc(b.h)+'</h2>';
    if(b.quote)return '<blockquote><p>« '+esc(b.quote)+' »</p>'+(b.by?'<cite>'+esc(b.by)+'</cite>':"")+'</blockquote>';
    if(b.fact)return '<div class="fact"><span class="kicker">'+esc(b.label||"Repère")+'</span><p>'+esc(b.fact)+'</p></div>';
    if(b.list)return '<ul>'+b.list.map(function(li){return '<li><span>'+esc(li)+'</span></li>';}).join("")+'</ul>';
    if(b.note)return '<p class="note">'+esc(b.note)+'</p>';
    if(b.sources)return '<div class="srcs"><span class="kicker">Sources</span><ul>'+b.sources.map(function(x){return '<li><span>'+esc(x)+'</span></li>';}).join("")+'</ul></div>';
    if(b.img)return '<figure>'+img(b.img,b.alt||"")+(b.caption?'<figcaption>'+esc(b.caption)+'</figcaption>':"")+'</figure>';
    return "";
  }).join("");
  var ext=a.action&&isExt(a.action.href);
  var recos=D.articles.filter(function(x){return x!==a;}).slice(0,3);
  return '<div class="progress" data-c="'+t.color+'" id="prog"></div>'+
  '<article class="art" data-c="'+t.color+'"><div class="wrap a-grid">'+
    '<div class="a-main">'+
      '<header class="a-head2"><div class="chips">'+themesOf(a).map(chipT).join("")+'<span class="chip plain">'+esc(a.format)+'</span></div>'+
      '<h1>'+esc(a.title)+'</h1><p class="chapo">'+esc(a.chapo)+'</p>'+
      '<div class="meta"><span>Par '+esc(a.author)+'</span>'+(a.date?'<span>'+esc(a.date)+'</span>':"")+'<span>'+a.read+' min de lecture</span></div></header>'+
      '<div class="a-vis-m">'+vis(a)+'</div>'+
      '<div class="prose">'+body+'</div>'+
    '</div>'+
      '<aside class="aside"><div class="a-vis-d">'+vis(a)+'</div>'+
        (a.action?'<div class="jagis"><h2>Et maintenant, j\'agis</h2><p>'+esc(a.action.text)+'</p><a class="btn" href="'+esc(a.action.href)+'"'+(ext?' target="_blank" rel="noopener"':"")+'>'+esc(a.action.label)+(ext?" ↗":" →")+'</a></div>':
          '<div class="jagis"><h2>Une idée de sujet ?</h2><p>Une question, un projet à faire connaître, une réaction à cet article : écris à la rédaction.</p>'+mailBox(true)+'</div>')+
        '<div><span class="kicker">Partager cet article</span><div class="share" style="margin-top:10px"><button type="button" class="js-copy">Copier le lien</button><a href="'+esc(D.site.instagram)+'" target="_blank" rel="noopener">Instagram ↗</a></div><p class="copyurl" id="copyurl" hidden></p></div>'+
      '</aside></div>'+
  '</article>'+
  '<section class="sec next"><div class="wrap"><div class="sec-head"><h2 style="font-size:clamp(2.2rem,6vw,4.4rem)">'+(recos.length?"À lire ensuite":"Et ensuite ?")+'</h2><a class="more" href="#blog">Tout le blog</a></div>'+
    (recos.length?'<div class="list">'+recos.map(card).join("")+'</div>':
      '<div class="list"><a class="card" data-c="violet" href="#podcast" data-chan="audio"><div class="vis full">'+img("ep01-cover","Enregistrement du premier épisode")+'</div><div class="txt"><span class="kicker">Podcast audio</span><h3>Écouter le premier épisode</h3></div></a>'+
      '<a class="card" data-c="ciel" href="#apropos"><div class="vis full">'+img("team-group","L\'équipe d\'Émergences")+'</div><div class="txt"><span class="kicker">L\'équipe</span><h3>Qui se cache derrière Émergences ?</h3></div></a></div>')+
  '</div></section>';
}

/* ---------- PODCAST ---------- */
function rhythm(){return D.site.rhythm?'<div class="burst rhythm" role="note"><span>Nouvel épisode</span><b>'+esc(D.site.rhythm)+'</b></div>':"";}
function latest(p){return p.episodes&&p.episodes.length?p.episodes[0]:null;}
function epLinks(e){
  var L=[["YouTube",e.youtube?"https://www.youtube.com/watch?v="+e.youtube:""],["Spotify",PATHS?"":e.spotify],["Apple Podcasts",e.apple],["Deezer",e.deezer]];
  return L.filter(function(x){return x[1];}).map(function(x){return '<a class="btn alt" href="'+esc(x[1])+'" target="_blank" rel="noopener">'+x[0]+' ↗</a>';}).join("");
}
/* Lecteur Spotify intégré : l'audio est servi par Spotify, pas par l'hébergeur (site 100 % gratuit). */
function spotifyId(u){var m=String(u||"").match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(episode|show)\/([A-Za-z0-9]+)/);return m?{type:m[1],id:m[2]}:null;}
function spotifyBlock(url,title){
  var sp=spotifyId(url);
  if(!sp)return "";
  if(PATHS)return '<div class="spotify"><iframe title="Écouter '+esc(title||"le podcast")+' sur Spotify" src="https://open.spotify.com/embed/'+sp.type+'/'+sp.id+'?utm_source=generator&theme=0" width="100%" height="'+(sp.type==="show"?352:232)+'" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></div>';
  return '<a class="spotify-link" href="'+esc(url)+'" target="_blank" rel="noopener"><span class="sp-dot">▶</span><span><b>Écouter sur Spotify</b><small>Le lecteur Spotify s\'affiche ici sur le site publié</small></span></a>';
}
function audioZone(e,p){
  if(e&&e.spotify)return spotifyBlock(e.spotify,e.title);
  if(e&&e.audio)return player(e);
  if(D.site.spotify&&p&&p.id==="audio")return spotifyBlock(D.site.spotify,"le podcast Émergences");
  return e?'<span class="status"><i></i>Bientôt sur Spotify</span>':"";
}
function player(e){
  return '<div class="aplayer" data-src="'+esc(e.audio)+'"><button type="button" class="ap-btn" aria-label="Lecture"><span class="ap-play">▶</span></button>'+
    '<div class="ap-mid"><input type="range" class="ap-bar" min="0" max="1000" value="0" aria-label="Position dans l\'épisode"><div class="ap-t"><span class="ap-cur">0:00</span><span class="ap-dur">'+esc(e.duration||"")+'</span></div></div></div>';
}
function fmt(t){t=Math.floor(t||0);var h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return (h?h+":"+(m<10?"0":""):"")+m+":"+(s<10?"0":"")+s;}
function epMeta(e){return [e.num?"Épisode "+e.num:"",e.guest,e.date,e.duration].filter(Boolean).map(esc).join(" · ");}
function stage(p){
  var e=latest(p);
  if(p.id==="video"){
    var inner=e&&e.youtube?
      '<button type="button" class="js-yt yt" data-yt="'+esc(e.youtube)+'" aria-label="Lancer la vidéo : '+esc(e.title)+'"><span class="playbtn">▶</span><span class="yt-t"><span class="kicker">'+epMeta(e)+'</span><b>'+esc(e.title)+'</b></span></button>':
      '<div class="yt soon-yt"><span class="kicker">Podcast vidéo</span><b>'+esc(p.status)+'</b><span>Les épisodes se regarderont ici, en grand.</span></div>';
    return '<div class="stage16" data-c="'+p.color+'">'+(e&&e.img?img(e.img,"","bgphoto"):'<span class="cv-e big" aria-hidden="true">E</span>')+inner+'</div>'+
      (e?'<div class="ep-txt">'+(e.desc?'<p>'+esc(e.desc)+'</p>':"")+'<div class="ep-links">'+epLinks(e)+'</div></div>':"");
  }
  return '<div class="audio-card" data-c="'+p.color+'"><div class="cover'+(e&&e.img?" photo":"")+'">'+(e&&e.img?img(e.img,"Photo de l\'épisode"):'<span class="cv-e big" aria-hidden="true">E</span>')+'<span class="epn">'+(e&&e.num?"EP."+String(e.num).padStart(2,"0"):"EP.01")+'</span></div>'+
    '<div class="ep-txt"><span class="kicker">'+(e?epMeta(e):"Podcast audio · "+esc(p.status))+'</span><h3>'+(e?esc(e.title):"Le premier épisode arrive très bientôt")+'</h3>'+
    (e&&e.desc?'<p>'+esc(e.desc)+'</p>':(e?'':'<p>'+esc(p.desc)+'</p>'))+audioZone(e,p)+'<div class="ep-links">'+(e?epLinks(e):'<span class="status"><i></i>'+esc(p.status)+'</span>')+'</div></div></div>';
}
function epList(p){
  var rest=(p.episodes||[]).slice(1);
  if(!rest.length)return "";
  return '<div class="eplist"><span class="kicker">Tous les épisodes</span><ol class="eps">'+rest.map(function(e){
    var url=e.youtube?"https://www.youtube.com/watch?v="+e.youtube:(e.spotify||e.apple||e.deezer||"");
    return '<li><a href="'+esc(url||"#podcast")+'"'+(url?' target="_blank" rel="noopener"':"")+'><b>'+esc(e.title)+'</b><span>'+epMeta(e)+'</span></a></li>';}).join("")+'</ol></div>';
}
function pagePodcastPage(){
  var P=D.podcast;
  var slides=P.map(function(p,i){var e=latest(p);return slide("CH."+p.ch+" · Podcast "+p.short.toLowerCase(),p.color,e?e.title:p.name,e?epMeta(e):p.status,null,i===0);}).join("");
  return '<section class="antenne sec" style="border-bottom:3px solid var(--encre)"><div class="wrap">'+
    '<div class="pod-top"><div><h1 class="pod-h">Le podcast</h1>'+(D.site.podcastName?'<p class="pod-name">« '+esc(D.site.podcastName)+' »</p>':'')+'<p class="lede on-dark">Une conversation avec <span class="hl">celles et ceux qui font bouger les choses</span>.</p></div>'+rhythm()+'</div>'+
    '<div class="studio">'+
      '<div class="tvbox"><div class="screen" id="tv2" role="status" aria-live="polite">'+slides+'<canvas aria-hidden="true"></canvas></div>'+img("tv","Téléviseur vintage")+'</div>'+
      '<div style="display:grid;gap:18px">'+
        '<div class="remote" role="group" aria-label="Choisir le format">'+P.map(function(p,i){return '<button type="button" data-c="'+p.color+'" data-i="'+i+'" aria-pressed="'+(i===0)+'"><span class="n">'+p.ch+'</span><span class="t">Podcast '+esc(p.short.toLowerCase())+'</span></button>';}).join("")+'</div>'+
        '<div class="chan-info" id="chaninfo"></div>'+
      '</div>'+
    '</div></div></section>'+
    P.map(function(p,i){
      return '<section class="sec podsec'+(i%2?" alt":"")+'" id="ep-'+p.id+'"><div class="wrap">'+
        '<div class="sec-head"><h2 style="font-size:clamp(2.2rem,6.4vw,4.8rem)">'+esc(p.name)+'</h2></div>'+
        stage(p)+epList(p)+'</div></section>';
    }).join("")+emergeBlock();
}
function chanInfo(p){
  var e=latest(p);
  return '<span class="chip" data-c="'+p.color+'">Chaîne '+p.ch+'</span><h3>'+esc(e?e.title:p.name)+'</h3><p>'+esc(e&&e.desc?e.desc:p.desc)+'</p>'+
    '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center"><span class="status"><i></i>'+esc(e?epMeta(e):p.status)+'</span><button type="button" class="more js-goep" data-ep="'+p.id+'" style="background:none;border:0;border-bottom:3px solid var(--c,var(--rouge));padding:0 0 2px;cursor:pointer" data-c="'+p.color+'">'+(p.id==="video"?"Regarder en grand ↓":"Écouter l\'épisode ↓")+'</button></div>';
}

/* ---------- AGIR ---------- */
function pageAgir(){
  return '<header class="r-head" data-c="rouge">'+img("megaphone","")+'<div class="wrap"><span class="ch">Passer à l\'action</span><h1>J\'agis</h1><p>'+esc(D.site.tagline)+' Faire connaître un projet, proposer un sujet, rejoindre le collectif : voici par où commencer.</p></div></header>'+
    '<section class="sec agir-sec"><div class="wrap">'+
      '<div class="stats">'+
        '<div class="stat rv"><div class="burst">75%</div><p>des jeunes veulent s\'engager pour une cause<small>Source : ADEME</small></p></div>'+
        '<div class="stat rv"><div class="burst" style="background:var(--rouge);color:var(--jaune)">60%</div><p>ne savent pas comment agir concrètement<small>C\'est le vide qu\'Émergences veut combler.</small></p></div>'+
      '</div>'+
      '<div class="actions">'+
        '<a class="act int rv" data-c="jaune" href="#proposer"><span class="kicker">Ça émerge</span><b>Faire connaître ton projet</b><p>Présente-le à la rédaction avec le formulaire ci-dessous.</p><span class="go">Remplir le formulaire</span></a>'+
        '<div class="act rv" data-c="violet"><span class="kicker">La rédaction</span><b>Proposer un sujet ou un invité</b><p>Une question qui te travaille, une personne à faire parler dans le podcast.</p>'+mailBox(false)+'</div>'+
        '<a class="act rv" data-c="ciel" href="'+esc(D.site.instagram)+'" target="_blank" rel="noopener"><span class="kicker">La communauté</span><b>Nous suivre et partager</b><p>Chaque partage aide un média indépendant à grandir.</p><span class="go">instagram.com/emergencesmedia</span></a>'+
      '</div>'+
    '</div></section>'+emergeBlock();
}

/* ---------- À PROPOS ---------- */
function pageApropos(){
  var words=[["écologie","ciel"],["diplomatie","violet"],["droit international","rouge"],["passions","jaune"],["émergences","corail"],["espoir","jaune"],["nouveautés","ciel"],["technologie","violet"],["engagement","rouge"]];
  return '<header class="ab-hero">'+img("binoculars","","bin")+'<div class="wrap"><span class="kicker">À propos · fondé en '+esc(D.site.founded)+'</span>'+
      '<h1>Comprendre le monde <em>sans perdre</em> espoir</h1><p>'+esc(D.site.pitch)+' Lancé par quatre étudiants, Émergences décrypte les grands enjeux et met en lumière les projets qui font déjà bouger les lignes.</p></div></header>'+
    '<section class="sec"><div class="wrap two">'+
      '<div class="panel rv"><h2>Notre constat</h2><p>Les défis de notre époque saturent nos écrans, mais on nous donne rarement les <span class="hl">clés pour les comprendre</span>, et encore moins les moyens d\'agir. Beaucoup de jeunes décrochent ou s\'inquiètent seuls.</p></div>'+
      '<div class="panel rv"><h2>Notre objectif</h2><p>Mieux comprendre les <span class="hl">défis de notre époque</span> tout en mettant en lumière des <span class="hl">solutions concrètes</span> et des initiatives porteuses d\'espoir. Faire changer le regard, montrer les projets émergents.</p></div>'+
    '</div></section>'+
    '<section class="sec" style="padding-top:0"><div class="wrap">'+
      '<div class="group-row"><div class="group rv">'+img("team-group","Prune, Samuel, Daphnée et Vera, l\'équipe d\'Émergences, devant une carte du monde")+'</div>'+
      '<div class="group-txt"><h2 class="crew-t">L\'équipe</h2><p class="lede">Quatre étudiants, <span class="hl">quatre parcours</span>, une même conviction : bien comprendre le monde donne <span class="hl">envie d\'y agir</span>.</p>'+
      '<ul class="crew-names">'+D.team.map(function(m){return '<li data-c="'+m.color+'"><b>'+esc(m.name)+'</b><span>'+esc(m.studies)+'</span></li>';}).join("")+'</ul></div></div>'+
      '<div class="team">'+D.team.map(member).join("")+'</div>'+
    '</div></section>'+
    '<section class="sec" style="background:var(--voile);border-block:3px solid var(--encre)"><div class="wrap">'+
      '<div class="sec-head"><h2>Ce qui nous fait pousser</h2></div>'+
      '<div class="words">'+words.map(function(w,i){return '<span data-c="'+w[1]+'" style="--r:'+((i%3)-1)*2+'deg">'+esc(w[0])+'</span>';}).join("")+'</div>'+
      '<div class="figures" style="margin-top:40px"><div><b>2026</b><span>Année de lancement</span></div><div><b>4</b><span>Co-fondateurs</span></div><div><b>4</b><span>Thèmes</span></div><div><b>2</b><span>Formats de podcast</span></div></div>'+
    '</div></section>'+
    '<section class="sec"><div class="wrap two" style="align-items:center">'+
      '<div><span class="kicker">Un collectif ouvert</span><h2 class="logo" style="font-size:clamp(2.4rem,7vw,5rem);white-space:normal;margin:10px 0 16px">Rejoins-nous</h2>'+
      '<p style="max-width:48ch">À terme, Émergences veut devenir un collectif où les jeunes partagent leurs idées et leurs projets. Plume, micro, caméra, collage, montage : toutes les compétences sont bienvenues.</p>'+
      mailBox(false)+
      '<div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:20px"><a class="btn" href="#agir">Proposer un projet</a><a class="btn alt" href="'+esc(D.site.instagram)+'" target="_blank" rel="noopener">@emergencesmedia ↗</a></div></div>'+
      '<div class="vis" data-c="violet" style="border:3px solid var(--encre);box-shadow:10px 10px 0 var(--jaune)">'+img("typewriter","Machine à écrire bleue sur fond jaune")+'</div>'+
    '</div></section>';
}
function member(m){
  return '<div class="member rv" data-c="'+m.color+'"><div class="ph">'+img(m.photo,"Portrait de "+m.name)+'</div><b>'+esc(m.name)+'</b><small>'+esc(m.role)+'</small><span class="studies">'+esc(m.studies)+'</span>'+(m.quote?'<q>'+esc(m.quote)+'</q>':"")+'</div>';
}

/* ---------- habillage commun ---------- */
var NAV=[["blog","Notre blog"],["podcast","Podcast"],["agir","Agir"],["apropos","À propos"]];
function header(){
  return '<header class="top"><div class="wrap">'+
    '<a class="brand logo" href="#une" aria-label="Émergences, accueil">EMERGENCES</a>'+
    '<span class="onair"><i></i>Média par et pour les jeunes</span>'+
    '<nav aria-label="Navigation principale">'+NAV.map(function(n){return '<a href="#'+n[0]+'" data-r="'+n[0]+'">'+esc(n[1])+'</a>';}).join("")+'</nav>'+
    '<div class="tools"><button class="iconbtn js-search" type="button" aria-label="Rechercher"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="10" cy="10" r="6.5"/><path d="M15 15l6 6"/></svg></button>'+
    '<button class="iconbtn menu-btn js-menu" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18M3 12h18M3 18h12"/></svg></button></div>'+
  '</div></header>';
}
function menu(){
  var items=[["blog","Notre blog","rouge","01"],["podcast","Podcast","corail","02"],["agir","Agir","ciel","03"],["apropos","À propos","violet","04"]];
  return '<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>'+
    '<div class="menu-head"><span class="logo" style="font-size:1.8rem">EMERGENCES</span><button class="iconbtn js-close" type="button" aria-label="Fermer le menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>'+
    '<ul>'+items.map(function(n){return '<li><a href="#'+n[0]+'" style="--c:var(--'+n[2]+')"><span class="n">'+n[3]+'</span><span class="t">'+esc(n[1])+'</span><span class="bar"></span></a></li>';}).join("")+'</ul>'+
    '<div class="minor">'+D.themes.map(function(t){return '<a href="#blog-'+t.slug+'">'+esc(t.name)+'</a>';}).join("")+'<a href="'+esc(D.site.instagram)+'" target="_blank" rel="noopener">Instagram ↗</a></div>'+
    img("woman","","sticker")+
  '</div>';
}
function tabbar(){
  var ic={
    une:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="3" y="6" width="18" height="13"/><path d="M8 2l4 4 4-4"/></svg>',
    blog:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 4h16v16H4zM8 9h8M8 13h8M8 17h5"/></svg>',
    pod:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v4"/></svg>',
    nous:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="8" cy="8" r="3.2"/><circle cx="16.5" cy="9" r="2.6"/><path d="M2.5 20c.6-3.6 3-5.5 5.5-5.5s4.9 1.9 5.5 5.5M14 15.2c2.8-.5 5.6 1 6.5 4.8"/></svg>',
    s:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><circle cx="10" cy="10" r="6.5"/><path d="M15 15l6 6"/></svg>'};
  return '<nav class="tabbar" aria-label="Navigation rapide">'+
    '<a href="#une" data-r="une">'+ic.une+'La Une</a>'+
    '<a href="#blog" data-r="blog">'+ic.blog+'Blog</a>'+
    '<a href="#podcast" data-r="podcast">'+ic.pod+'Podcast</a>'+
    '<a href="#apropos" data-r="apropos">'+ic.nous+'Nous</a>'+
    '<button type="button" class="js-search">'+ic.s+'Chercher</button></nav>';
}
function footer(){
  return '<footer class="foot"><div class="wrap">'+
    '<span class="logo giant" aria-hidden="true">EMERGENCES</span>'+
    '<div class="grid">'+
      '<div><h3>Le média</h3><p style="margin:0 0 12px;max-width:30ch">'+esc(D.site.pitch)+' '+esc(D.site.tagline)+'</p>'+mailBox(true)+'</div>'+
      '<div><h3>Notre blog</h3><ul>'+D.themes.map(function(t){return '<li><a href="#blog-'+t.slug+'">'+esc(t.name)+'</a></li>';}).join("")+'</ul></div>'+
      '<div><h3>Explorer</h3><ul><li><a href="#podcast">Le podcast</a></li><li><a href="#agir">Passer à l\'action</a></li><li><a href="#apropos">À propos</a></li><li><a href="'+esc(D.site.instagram)+'" target="_blank" rel="noopener">Instagram ↗</a></li></ul></div>'+
      '<div><h3>Ne rien rater</h3><p style="margin:0 0 12px">Les nouveaux articles et les épisodes du podcast sont annoncés sur Instagram.</p><a class="btn" href="'+esc(D.site.instagram)+'" target="_blank" rel="noopener">@emergencesmedia ↗</a></div>'+
    '</div>'+
    '<div class="legal"><span>© '+esc(D.site.founded)+' Émergences · Média indépendant</span><span>Contact : '+esc(D.site.email)+'</span></div>'+
  '</div></footer>';
}

/* ---------- recherche ---------- */
function searchUI(){
  return '<div class="search" id="search" role="dialog" aria-modal="true" aria-label="Recherche" hidden><div class="panel2">'+
    '<div class="bar"><label class="sr" for="q">Rechercher</label><input id="q" type="search" placeholder="Rechercher un article, un thème…" autocomplete="off"><button type="button" class="js-sclose" aria-label="Fermer la recherche"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>'+
    '<div class="sf" role="group" aria-label="Filtrer par thème"><button type="button" aria-pressed="true" data-s="">Tout</button>'+D.themes.map(function(t){return '<button type="button" aria-pressed="false" data-s="'+t.slug+'" data-c="'+t.color+'">'+esc(t.short)+'</button>';}).join("")+'</div>'+
    '<div class="res" id="res" aria-live="polite"></div></div></div>';
}
var sTheme="";
function norm(s){return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");}
function hl(text,q){if(!q)return esc(text);var i=norm(text).indexOf(q);if(i<0)return esc(text);return esc(text.slice(0,i))+"<mark>"+esc(text.slice(i,i+q.length))+"</mark>"+esc(text.slice(i+q.length));}
function runSearch(){
  var q=norm($("#q").value.trim());
  var res=D.articles.filter(function(a){
    if(sTheme&&!themesOf(a).some(function(t){return t.slug===sTheme;}))return false;
    if(!q)return true;
    var hay=norm([a.title,a.chapo,a.format].concat(themesOf(a).map(function(t){return t.name;})).concat(a.body.map(function(b){return b.p||b.h||b.quote||b.fact||(b.list||[]).join(" ");})).join(" "));
    return hay.indexOf(q)>=0;
  });
  var pods=D.podcast.filter(function(p){return !sTheme&&(!q||norm(p.name+" "+p.desc+" podcast").indexOf(q)>=0);});
  var html=res.map(function(a){var t=main(a);return '<a href="#a-'+a.slug+'" data-c="'+t.color+'"><span class="dot"></span><span><span class="kicker" style="color:var(--gris)">Blog · '+themesOf(a).map(function(x){return esc(x.short);}).join(", ")+'</span><b>'+hl(a.title,q)+'</b><small>'+hl(a.chapo,q)+'</small></span></a>';}).join("")+
    pods.map(function(p){return '<a href="#podcast" data-c="'+p.color+'"><span class="dot"></span><span><span class="kicker" style="color:var(--gris)">Podcast</span><b>'+hl(p.name,q)+'</b><small>'+esc(p.status)+'</small></span></a>';}).join("");
  $("#res").innerHTML=html||'<p class="hint">Aucun résultat pour cette recherche. Le blog démarre : de nouveaux articles arrivent bientôt.</p>';fixLinks($("#res"));
}
var lastFocus=null;
function openSearch(){var s=$("#search");lastFocus=document.activeElement;s.hidden=false;requestAnimationFrame(function(){s.classList.add("open");});runSearch();setTimeout(function(){$("#q").focus();},50);}
function closeSearch(){var s=$("#search");s.classList.remove("open");setTimeout(function(){s.hidden=true;},250);if(lastFocus)lastFocus.focus();}
function openMenu(){var m=$("#menu");lastFocus=document.activeElement;m.hidden=false;requestAnimationFrame(function(){m.classList.add("open");});$$(".js-menu").forEach(function(b){b.setAttribute("aria-expanded","true");});setTimeout(function(){$(".js-close",m).focus();},60);document.body.style.overflow="hidden";}
function closeMenu(){var m=$("#menu");m.classList.remove("open");$$(".js-menu").forEach(function(b){b.setAttribute("aria-expanded","false");});setTimeout(function(){m.hidden=true;},550);document.body.style.overflow="";}

var tt;function toast(msg){var t=$("#toast");t.textContent=msg;t.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){t.classList.remove("on");},2600);}
function copyText(text,el){
  var fallback=function(){if(el){var r=document.createRange();r.selectNodeContents(el);var s=window.getSelection();s.removeAllRanges();s.addRange(r);}toast("Sélectionné : copiez avec Ctrl+C ou ⌘+C");};
  try{navigator.clipboard.writeText(text).then(function(){toast("Copié !");},fallback);}catch(e){fallback();}
}

/* ---------- routeur ---------- */
var timer=null,progHandler=null;
/* Deux modes : aperçu (#ancres) ou site publié (vraies adresses /blog/…, lisibles par Google). */
var PATHS=!!window.EM_PATHS;
function toPath(h){
  var r=h.replace(/^#/,"");
  if(r===""||r==="une")return "/";
  if(r==="blog")return "/blog/";
  if(r.indexOf("blog-")===0)return "/blog/theme/"+r.slice(5)+"/";
  if(r.indexOf("a-")===0)return "/blog/"+r.slice(2)+"/";
  if(r==="podcast"||r==="antenne")return "/podcast/";
  if(r==="agir")return "/agir/";
  if(r==="proposer")return "/agir/#proposer";
  if(r==="apropos")return "/a-propos/";
  return null;
}
function fromPath(p){
  p=p.replace(/index\.html$/,"");
  var m;
  if(p==="/"||p==="")return "une";
  if(p==="/blog/")return "blog";
  if((m=p.match(/^\/blog\/theme\/([^\/]+)\/$/)))return "blog-"+m[1];
  if((m=p.match(/^\/blog\/([^\/]+)\/$/)))return "a-"+m[1];
  return ({"/podcast/":"podcast","/agir/":"agir","/a-propos/":"apropos"})[p]||"une";
}
function fixLinks(root){
  if(!PATHS)return;
  $$('a[href^="#"]',root).forEach(function(a){var h=a.getAttribute("href");if($(h==="#"?"#none":h,document)&&toPath(h)===null)return;var t=toPath(h);if(t)a.setAttribute("href",t);});
}
function current(){
  if(PATHS)return fromPath(location.pathname);
  var h=(location.hash||"").replace(/^#/,"");if(h==="antenne")return "podcast";if(h==="proposer")return "agir";return h||"une";}
function info(route){
  if(route==="une")return {t:"Émergences · "+D.site.baseline,c:"rouge",d:D.site.pitch+" "+D.site.tagline};
  if(route==="blog")return {t:"Notre blog · Émergences",c:"rouge",d:"Articles, décryptages et portraits d'Émergences."};
  if(route.indexOf("blog-")===0){var th=theme(route.slice(5));if(th)return {t:th.name+" · Le blog d'Émergences",c:th.color,d:th.desc};}
  if(route.indexOf("a-")===0){var a=art(route.slice(2));if(a)return {t:a.title+" · Émergences",c:main(a).color,d:a.chapo};}
  return ({podcast:{t:"Le podcast · Émergences",c:"corail",d:"Le podcast d'Émergences, en vidéo et en audio."},
    agir:{t:"Passer à l'action · Émergences",c:"rouge",d:"Faire connaître un projet, proposer un sujet, rejoindre Émergences."},
    apropos:{t:"À propos · Émergences",c:"jaune",d:"L'équipe et le projet d'Émergences, le média par et pour les jeunes."}})[route]||null;
}
var audios=[];
function render(route){
  audios.forEach(function(a){try{a.pause();}catch(e){}});audios=[];
  clearInterval(timer);if(progHandler){window.removeEventListener("scroll",progHandler);progHandler=null;}
  var html=null,scrollTo=null;
  if(route==="une")html=pageHome();
  else if(route==="blog")html=pageBlog("");
  else if(route.indexOf("blog-")===0&&theme(route.slice(5)))html=pageBlog(route.slice(5));
  else if(route.indexOf("a-")===0)html=pageArticle(route.slice(2));
  else if(route==="podcast")html=pagePodcastPage();
  else if(route==="agir"){html=pageAgir();if((location.hash||"")==="#proposer")scrollTo="proposer";}
  else if(route==="apropos")html=pageApropos();
  if(html===null){route="une";html=pageHome();}
  app.innerHTML=html;
  var i=info(route)||info("une");document.title=i.t;
  var md=document.querySelector('meta[name="description"]');if(md)md.setAttribute("content",i.d);
  var sect=route.indexOf("blog")===0||route.indexOf("a-")===0?"blog":route;
  $$("[data-r]").forEach(function(el){if(el.getAttribute("data-r")===sect)el.setAttribute("aria-current","page");else el.removeAttribute("aria-current");});
  wire(route);
  return scrollTo;
}
var first=true;
function go(){
  if(PATHS){var id=render(current());fixLinks(document);if(location.hash){var el=$(location.hash);if(el)setTimeout(function(){el.scrollIntoView();},60);}return;}
  var route=current(),h=location.hash;
  if(h==="#proposer"&&$("#proposer",app)){ $("#proposer",app).scrollIntoView({behavior:reduce?"auto":"smooth"});return; }
  var land=function(id){if(id&&$("#"+id))$("#"+id).scrollIntoView();else window.scrollTo(0,0);};
  if(first||reduce){first=false;land(render(route));return;}
  var w=$("#wipe"),col="var(--"+((info(route)||{}).c||"rouge")+")";
  $$("span",w).forEach(function(s){s.style.background=col;});
  w.className="wipe in";
  setTimeout(function(){land(render(route));w.className="wipe out";setTimeout(function(){w.className="wipe";},640);},420);
}

/* ---------- interactions par page ---------- */
function wire(route){
  if("IntersectionObserver" in window&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove("pre");io.unobserve(e.target);}});},{rootMargin:"0px 0px -6% 0px"});
    $$(".rv",app).forEach(function(el){if(el.getBoundingClientRect().top>window.innerHeight){el.classList.add("pre");io.observe(el);}});
  }
  var tv=$("#tv",app);
  if(tv){var n=$$(".slide",tv).length,k=0,next=function(){k=(k+1)%n;tvSet(tv,k);};
    tvSet(tv,0,true);if(!reduce)timer=setInterval(next,5200);
    [$("#zap",app),$("#zap2",app)].forEach(function(b){if(b)b.addEventListener("click",function(e){e.preventDefault();clearInterval(timer);next();if(!reduce)timer=setInterval(next,7000);});});}
  var tv2=$("#tv2",app);
  if(tv2){var btns=$$(".remote button",app),box=$("#chaninfo",app);
    var pick=function(j,instant){btns.forEach(function(b,x){b.setAttribute("aria-pressed",String(x===j));});tvSet(tv2,j,instant);box.innerHTML=chanInfo(D.podcast[j]);};
    btns.forEach(function(b){b.addEventListener("click",function(){pick(+b.getAttribute("data-i"));});});
    var want=0;try{var s=sessionStorage.getItem("em-chan");if(s){D.podcast.forEach(function(p,j){if(p.id===s)want=j;});sessionStorage.removeItem("em-chan");}}catch(e){}
    pick(want,true);}
  $$("[data-chan]",app).forEach(function(p){p.addEventListener("click",function(){try{sessionStorage.setItem("em-chan",p.getAttribute("data-chan"));}catch(e){}});});
  var bl=$("#blist",app);
  if(bl){var f=route.indexOf("blog-")===0?route.slice(5):"";bl.innerHTML=blogList(f);
    $(".filters",app).addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;
      $$(".filters button",app).forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});bl.innerHTML=blogList(b.getAttribute("data-f"));fixLinks(bl);});}
  $$(".aplayer",app).forEach(function(w){
    var au=new Audio();au.preload="metadata";var src=w.getAttribute("data-src");au.src=(PATHS&&!/^(https?:)?\//.test(src))?"/"+src:src;
    var btn=$(".ap-btn",w),bar=$(".ap-bar",w),cur=$(".ap-cur",w),dur=$(".ap-dur",w),drag=false;
    au.addEventListener("loadedmetadata",function(){dur.textContent=fmt(au.duration);});
    au.addEventListener("timeupdate",function(){if(!drag&&au.duration)bar.value=Math.round(au.currentTime/au.duration*1000);cur.textContent=fmt(au.currentTime);});
    au.addEventListener("play",function(){w.classList.add("on");btn.setAttribute("aria-label","Pause");$(".ap-play",w).textContent="❚❚";});
    au.addEventListener("pause",function(){w.classList.remove("on");btn.setAttribute("aria-label","Lecture");$(".ap-play",w).textContent="▶";});
    au.addEventListener("error",function(){w.classList.add("err");cur.textContent="Lecture impossible ici";});
    btn.addEventListener("click",function(){if(au.paused)au.play().catch(function(){});else au.pause();});
    bar.addEventListener("input",function(){drag=true;if(au.duration)cur.textContent=fmt(bar.value/1000*au.duration);});
    bar.addEventListener("change",function(){if(au.duration)au.currentTime=bar.value/1000*au.duration;drag=false;});
    audios.push(au);
  });
  var pg=$("#prog",app);
  if(pg){progHandler=function(){var h=document.documentElement,max=h.scrollHeight-h.clientHeight;pg.style.transform="scaleX("+(max>0?Math.min(1,h.scrollTop/max):0)+")";};window.addEventListener("scroll",progHandler,{passive:true});progHandler();}
}

/* ---------- événements globaux ---------- */
function boot(){
  document.getElementById("shell-top").innerHTML=header()+menu();
  document.getElementById("shell-bottom").innerHTML=footer()+tabbar()+searchUI()+'<div class="wipe" id="wipe" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="toast" id="toast" role="status"></div>';
  document.addEventListener("click",function(e){
    var t=e.target;
    if(t.closest(".js-menu")){openMenu();return;}
    if(t.closest(".js-close")){closeMenu();return;}
    if(t.closest(".js-search")){if($("#menu").classList.contains("open"))closeMenu();openSearch();return;}
    if(t.closest(".js-sclose")||t.id==="search"){closeSearch();return;}
    var sf=t.closest(".sf button");
    if(sf){sTheme=sf.getAttribute("data-s");$$(".sf button").forEach(function(b){b.setAttribute("aria-pressed",String(b===sf));});runSearch();return;}
    var yt=t.closest(".js-yt");
    if(yt){var id=yt.getAttribute("data-yt");var f=document.createElement("iframe");f.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(id)+"?autoplay=1&rel=0";f.title="Lecteur vidéo YouTube";f.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";f.allowFullscreen=true;f.className="ytframe";yt.replaceWith(f);return;}
    var ge=t.closest(".js-goep");if(ge){var sec=$("#ep-"+ge.getAttribute("data-ep"));if(sec)sec.scrollIntoView({behavior:reduce?"auto":"smooth"});return;}
    var cm=t.closest(".js-copymail");if(cm){copyText(D.site.email,cm.parentNode.querySelector(".addr"));return;}
    if(t.closest(".js-copy")){var p=$("#copyurl");p.textContent=location.href;p.hidden=false;copyText(location.href,p);return;}
    var link=t.closest('a[href^="#"]');
    if(link){if($("#menu").classList.contains("open"))closeMenu();if($("#search").classList.contains("open"))closeSearch();
      var href=link.getAttribute("href");
      if(href===location.hash||(href==="#une"&&!location.hash)){e.preventDefault();window.scrollTo({top:0,behavior:reduce?"auto":"smooth"});}}
  });
  document.addEventListener("submit",function(e){
    var f=e.target;if(!f.classList.contains("js-form"))return;e.preventDefault();
    var bad=$$("[required]",f).filter(function(i){return !i.value.trim()||(i.type==="email"&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value));});
    if(bad.length){bad[0].focus();toast(bad[0].type==="email"?"Vérifiez l'adresse e-mail":"Ce champ est obligatoire");return;}
    /* Pas de serveur : on prépare un e-mail adressé à la rédaction dans la messagerie du visiteur. */
    var v=function(n){var el=f.querySelector('[name="'+n+'"]');return el?el.value.trim():"";};
    var body="Prénom : "+v("nom")+"\nE-mail : "+v("email")+"\nThème : "+v("theme")+"\n\n"+v("projet");
    var href="mailto:"+D.site.email+"?subject="+encodeURIComponent("Appel à projets · "+v("nom"))+"&body="+encodeURIComponent(body);
    try{window.location.href=href;}catch(err){}
    var d=document.createElement("div");d.className="ok";d.setAttribute("role","status");
    d.innerHTML="Ta messagerie s'ouvre avec ton message prêt à partir : il ne reste qu'à l'envoyer. Rien ne s'ouvre ? Écris-nous directement :"+mailBox(true);
    f.replaceWith(d);
  });
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"){if($("#search").classList.contains("open"))closeSearch();else if($("#menu").classList.contains("open"))closeMenu();}
    if(e.key==="/"&&!/input|textarea|select/i.test(document.activeElement.tagName)){e.preventDefault();openSearch();}
  });
  $("#q").addEventListener("input",runSearch);
  if(!PATHS)window.addEventListener("hashchange",go);
  go();
}
boot();
})();
