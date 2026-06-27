/**
 * Construit le contenu du fichier kairos-tracker.js pour un client.
 * Le script envoie les events vers l'Edge Function publique `kairos-track`.
 */
export function buildTracker(clientId: string, functionsUrl: string): string {
  const endpoint = `${functionsUrl.replace(/\/$/, "")}/kairos-track`;

  return `/*! kairos-tracker.js — WAY Agency — client:${clientId} */
(function(){
  "use strict";
  var CLIENT_ID=${JSON.stringify(clientId)};
  var ENDPOINT=${JSON.stringify(endpoint)};
  if(window.__kairos)return; window.__kairos=true;

  function hasConsent(){
    try{
      if(window.__kairosConsent===true)return true;
      if(localStorage.getItem("kairos_consent")==="granted")return true;
      if(/(?:^|;\\s*)(kairos_consent|cookie_consent)=(granted|accepted|true)/.test(document.cookie))return true;
    }catch(e){}
    return false;
  }
  window.kairosGrantConsent=function(){try{localStorage.setItem("kairos_consent","granted");}catch(e){} start();};

  function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,10);}
  var sid;
  try{sid=sessionStorage.getItem("kairos_sid");if(!sid){sid=uid();sessionStorage.setItem("kairos_sid",sid);}}catch(e){sid=uid();}

  var queue=[], started=false, pageStart=Date.now(), maxScroll=0;
  function path(){return location.pathname+location.search;}
  function push(type,data){queue.push({type:type,page:path(),data:data||{},t:Date.now()});if(queue.length>=12)flush(false);}

  function flush(useBeacon){
    if(!queue.length)return;
    var payload=JSON.stringify({client_id:CLIENT_ID,session_id:sid,events:queue});
    queue=[];
    try{
      if(useBeacon&&navigator.sendBeacon){navigator.sendBeacon(ENDPOINT,payload);return;}
      fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"text/plain"},body:payload,keepalive:true,mode:"cors"}).catch(function(){});
    }catch(e){}
  }

  function selector(el){
    if(!el||el.nodeType!==1)return"inconnu";
    if(el.id)return el.tagName.toLowerCase()+"#"+el.id;
    var cls=(typeof el.className==="string"&&el.className)?"."+el.className.trim().split(/\\s+/).slice(0,2).join("."):"";
    return el.tagName.toLowerCase()+cls;
  }
  function label(el){var t=(el.innerText||el.value||el.getAttribute&&el.getAttribute("aria-label")||"").trim();return t.slice(0,60);}

  var lastEl=null, clickTimes=[];
  function onClick(e){
    var el=e.target;
    push("click",{selector:selector(el),text:label(el),x:e.clientX,y:e.clientY});
    var now=Date.now();
    if(el!==lastEl){lastEl=el;clickTimes=[];}
    clickTimes.push(now);
    clickTimes=clickTimes.filter(function(ts){return now-ts<1000;});
    if(clickTimes.length>3){push("rage_click",{selector:selector(el),text:label(el),count:clickTimes.length});clickTimes=[];}
  }

  var scrollTimer=null, lastDepth=0, pauseTimer=null;
  function depth(){
    var h=document.documentElement, b=document.body;
    var sh=Math.max(h.scrollHeight,b.scrollHeight)-window.innerHeight;
    if(sh<=0)return 100;
    return Math.min(100,Math.round((window.scrollY/sh)*100));
  }
  function onScroll(){
    var d=depth();
    if(d>maxScroll)maxScroll=d;
    if(!scrollTimer){scrollTimer=setTimeout(function(){scrollTimer=null;var dd=depth();if(Math.abs(dd-lastDepth)>=10){lastDepth=dd;push("scroll",{depth:dd});}},400);}
    if(pauseTimer)clearTimeout(pauseTimer);
    var atDepth=d;
    pauseTimer=setTimeout(function(){push("scroll_pause",{depth:atDepth,pausedMs:2000});},2000);
  }

  function onLeave(){
    push("pageview_end",{durationMs:Date.now()-pageStart,maxScroll:maxScroll});
    push("session_end",{durationMs:Date.now()-(window.__kairosSessionStart||pageStart),maxScroll:maxScroll});
    flush(true);
  }

  function start(){
    if(started||!hasConsent())return;
    started=true;
    window.__kairosSessionStart=window.__kairosSessionStart||Date.now();
    pageStart=Date.now();
    push("pageview",{url:location.href,referrer:document.referrer||null});
    document.addEventListener("click",onClick,true);
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("pagehide",onLeave);
    document.addEventListener("visibilitychange",function(){if(document.visibilityState==="hidden")flush(true);});
    setInterval(function(){flush(false);},15000);
  }

  if(hasConsent()){start();}
  else{
    document.addEventListener("kairos:consent",start);
    var poll=setInterval(function(){if(hasConsent()){clearInterval(poll);start();}},2000);
  }
})();
`;
}

/** Déclenche le téléchargement du fichier kairos-tracker.js. */
export function downloadTracker(clientId: string, functionsUrl: string) {
  const blob = new Blob([buildTracker(clientId, functionsUrl)], {
    type: "application/javascript",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "kairos-tracker.js";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
