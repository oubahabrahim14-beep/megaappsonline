(function(){
  const KEY='megaapps_play_v2';
  const APP_KEY='megaapps_app_v1';
  function page(){return(document.body&&document.body.getAttribute('data-page'))||'';}
  function loadCounts(){try{return JSON.parse(localStorage.getItem(KEY)||'{}');}catch(e){return{};}}
  function saveCounts(c){try{localStorage.setItem(KEY,JSON.stringify(c));}catch(e){}}

  window.MegaApps=window.MegaApps||{};
  window.MegaApps.trackPlay=function(slug){
    if(!slug)return true;
    const c=loadCounts();c[slug]=(c[slug]||0)+1;saveCounts(c);
    try{localStorage.setItem('megaapps_last_played',String(Date.now()));}catch(e){}
    return true;
  };
  window.MegaApps.trackApp=function(slug){
    try{const k=APP_KEY+slug;localStorage.setItem(k,String((parseInt(localStorage.getItem(k)||'0',10)+1)));}catch(e){}
    return true;
  };

  const catTag={FPS:'t-fps',IO:'t-io',Racing:'t-race',Sports:'t-sport',Action:'t-action',Puzzle:'t-puzzle',Arcade:'t-arcade',Strategy:'t-strat',Social:'t-io'};

  function renderTrending(){
    // Handle both home page block and trending page list
    const block=document.getElementById('trendingBlock');
    const list =document.getElementById('trendingList');
    if(!block&&!list)return;

    const counts=loadCounts();
    const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
    const isHome=page()==='home';
    const limit=isHome?4:10;
    const top=entries.slice(0,limit);

    let data=[];
    try{const r=document.getElementById('gamesData');if(r)data=JSON.parse(r.textContent||'[]');}catch(e){}
    const map=new Map((data||[]).map(g=>[g.slug,g]));

    if(top.length===0){
      // Hide trending section silently on home, show message on trending page
      if(list)list.innerHTML='<p class="meta" style="padding:16px 0">Play some games first and this will update automatically!</p>';
      return;
    }

    function tCard(slug,score){
      const g=map.get(slug)||{name:slug,slug,desc:'Play online free.',category:'Game'};
      const tag=catTag[g.category]||'';
      return `<div class="card">
        <div class="thumb-wrap play-ov">
          <img class="thumb" src="/images/${slug}.webp" alt="${g.name}" loading="lazy" width="400" height="155" onerror="this.onerror=null;this.src='/images/fallback.webp'">
          <div class="cbadge cbadge-gold">🔥 ${score} plays</div>
        </div>
        <div class="card-body">
          <div class="kv"><span class="${tag}">${g.category||'Game'}</span><span class="t-hot">Trending</span></div>
          <h3>${g.name}</h3>
          <p class="meta">${g.desc||'Play online free.'}</p>
          <div class="card-btns">
            <a class="btn small green" href="/play/${slug}.html" onclick="return MegaApps.trackPlay('${slug}')">▶ Play</a>
            <a class="btn small outline" href="/games/${slug}.html">Details</a>
          </div>
        </div>
      </div>`;
    }

    const cards=top.map(([s,n])=>tCard(s,n)).join('');

    if(list){
      list.innerHTML=`<div class="grid">${cards}</div>`;
      return;
    }

    if(block){
      block.innerHTML=`
        <div class="section-hd" style="margin-top:28px">
          <h2>🔥 Trending on Your Device</h2>
          <a href="/trending.html" class="see-all">View all →</a>
        </div>
        <div class="grid">${cards}</div>`;
    }
  }

  document.addEventListener('DOMContentLoaded',renderTrending);
})();
