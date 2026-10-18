(()=>{'use strict';
const $=s=>document.querySelector(s);const tr=key=>{try{return JSON.parse(document.querySelector('#ruri-i18n').textContent)[key]||key}catch{return key}};let waline=null,pageVersion=0,menuAbort=null,menuToggle=null;
function syncDark(){const mode=document.documentElement.dataset.theme;document.documentElement.classList.toggle('waline-dark',mode==='dark'||(mode!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))}
syncDark();matchMedia('(prefers-color-scheme:dark)').addEventListener('change',syncDark);
/* Reading schemes (warm / ruri). The header dots live in the page shell,
   so in-page navigation brings a fresh set; the state is read from storage each
   time instead of being cached, and applied to <html> where the CSS expects it. */
const SCHEMES=['warm','ruri'];
function activeScheme(){try{const s=localStorage.getItem('ruri-scheme');return SCHEMES.includes(s)?s:'warm'}catch{return 'warm'}}
function paintScheme(){
  const current=activeScheme();
  SCHEMES.forEach(name=>document.documentElement.classList.toggle('theme-'+name,name!=='warm'&&name===current));
  document.querySelectorAll('.scheme-switch button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scheme===current)));
  /* The bar is measured, not guessed, and a scheme can change its metrics —
     the rail and the veil hang off --header-h, so it is taken again the moment
     a palette lands rather than waiting for a resize that may never come. */
  measureHeader();
}
/* Clicking the scheme already in use clears the choice and hands the page back
   to its default, which is how the novel site behaves too. */
function chooseScheme(name){
  try{if(name===activeScheme())localStorage.removeItem('ruri-scheme');else localStorage.setItem('ruri-scheme',name)}catch{}
  paintScheme();
}
document.addEventListener('click',event=>{const button=event.target.closest('.scheme-switch button');if(button)chooseScheme(button.dataset.scheme)});
paintScheme();
let archiveObserver=null,tocObserver=null;
/* The folded rail only exists below this width, so every measurement of it is
   skipped on the desktop layout instead of forcing a layout read for nothing. */
const narrow=matchMedia('(max-width:760px)');
function initArchive(){
  archiveObserver?.disconnect();archiveObserver=null;
  const tree=$('.archive-tree');if(!tree)return;
  const years=[...tree.querySelectorAll(':scope > .archive-year')];
  if(years.length<2)return;
  const labels={
    'zh-cn':['加载更早年份','已显示全部年份'],
    'zh-tw':['載入更早年份','已顯示全部年份'],
    en:['Load earlier years','All years displayed'],
    ja:['以前の年を読み込む','すべての年を表示しました']
  };
  const [more,done]=labels[document.documentElement.lang.toLowerCase()]||labels.en;
  years.slice(1).forEach(year=>year.hidden=true);
  let shown=1;
  const footer=document.createElement('div');footer.className='archive-load';
  const button=document.createElement('button');button.type='button';
  const status=document.createElement('p');status.setAttribute('role','status');
  footer.append(button,status);tree.after(footer);
  const update=()=>{button.textContent=more+' · '+years[shown]?.dataset.year};update();
  const load=()=>{
    if(shown>=years.length||!tree.isConnected)return;
    years[shown++].hidden=false;
    if(shown===years.length){button.hidden=true;status.textContent=done;archiveObserver?.disconnect()}
    else update();
  };
  button.addEventListener('click',load);
  if('IntersectionObserver' in window){
    archiveObserver=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting))load();
    },{rootMargin:'0px 0px 160px 0px'});
    archiveObserver.observe(footer);
  }
}
/* reimu's scroll-in motion, kept for this theme's components: a card that has
   not been reached yet waits a little below its place and rises into it. The
   waiting state is a class on <html> set before first paint (baseof.html), so
   the page is complete without JavaScript — this only decides when each marked
   component gets to arrive, and the moving itself is done in CSS. */
let revealObserver=null,revealWatch=null;
function initReveal(){
  revealObserver?.disconnect();revealWatch?.disconnect();
  if(!('IntersectionObserver' in window)){
    /* Nothing to wait for: every component is simply where it belongs. */
    document.documentElement.classList.remove('reveal-on');
    window.__ruriRevealReady=true;return;
  }
  window.__ruriRevealReady=true;
  revealObserver=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    }
  },{rootMargin:'0px 0px -8% 0px',threshold:0});
  const scan=()=>document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach(node=>revealObserver.observe(node));
  scan();
  /* Archive years folded away below the first one come back on demand, and a
     year that was hidden was never observed, so the tree is watched for the
     ones that appear. */
  const tree=$('.archive-tree');
  if(tree){revealWatch=new MutationObserver(scan);revealWatch.observe(tree,{attributes:true,subtree:true,attributeFilter:['hidden']})}
}
function localizePlayer(){
 document.querySelectorAll('[data-ruri-label]').forEach(el=>{const label=tr(el.dataset.ruriLabel);el.setAttribute('aria-label',label);if(el.hasAttribute('title'))el.title=label});
 updateOrder();syncVolume();syncPlayback();if(songs.length)$('#music-count').textContent=songs.length+tr('tracks');
}
function shuffleFriends(){
  document.querySelectorAll('.friend-grid[data-shuffle="true"]').forEach(grid=>{
    const links=[...grid.children];
    for(let i=links.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [links[i],links[j]]=[links[j],links[i]];
    }
    grid.append(...links);
  });
}
/* Narrow-screen menu drawer. Same trick as the contents drawer: the listeners
   hang off a controller that is dropped on every navigation, because the shell
   (and with it the button and the panel) is replaced; anything left open is
   closed before the swap so the next page never starts behind a scrim. */
function closeMenu(restoreFocus){
  const drawer=$('#ruri-menu');if(!drawer)return;
  if(!drawer.classList.contains('is-open'))return;
  drawer.classList.remove('is-open');drawer.setAttribute('aria-hidden','true');
  $('#menu-scrim')?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded','false');
  if(restoreFocus)menuToggle?.focus();
}
function openMenu(){
  const drawer=$('#ruri-menu');if(!drawer)return;
  drawer.classList.add('is-open');drawer.setAttribute('aria-hidden','false');
  $('#menu-scrim')?.classList.add('is-open');
  document.body.classList.add('menu-open');
  menuToggle?.setAttribute('aria-expanded','true');
  drawer.querySelector('a[aria-current],a')?.focus({preventScroll:true});
}
function initMenu(){
  const drawer=$('#ruri-menu'),button=$('#menu-toggle'),scrim=$('#menu-scrim');
  if(!drawer||!button)return;
  /* The old controller belongs to nodes that no longer exist. */
  menuAbort?.abort();
  if(button===menuToggle&&drawer.classList.contains('is-open'))return;
  menuToggle=button;
  closeMenu(false);
  const controller=new AbortController();menuAbort=controller;const signal=controller.signal;
  button.addEventListener('click',()=>drawer.classList.contains('is-open')?closeMenu(true):openMenu(),{signal});
  scrim?.addEventListener('click',()=>closeMenu(true),{signal});
  drawer.querySelector('.menu-close')?.addEventListener('click',()=>closeMenu(true),{signal});
  /* Picking a destination closes the panel first, so the sheet that starts
     covering the page does not have to be seen sliding out from under it. */
  drawer.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu(false)},{signal});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&drawer.classList.contains('is-open'))closeMenu(true)},{signal});
}
function initPage(){tocObserver?.disconnect();window.sasaOrangeMobileUi?.refresh();initMenu();localizePlayer();paintScheme();shuffleFriends();
initArchive();initReveal();window.RuriFeatures.init();
$('#theme-toggle')?.addEventListener('click',()=>{const dark=document.documentElement.dataset.theme==='dark'||(document.documentElement.dataset.theme!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);const mode=dark?'light':'dark';document.documentElement.dataset.theme=mode;try{localStorage.setItem('ruri-theme',mode)}catch{}syncDark()});

initTabs();initComments();document.querySelectorAll('.toc ul ul').forEach(ul=>{const li=ul.parentElement;if(!li||li.querySelector(':scope > details'))return;const link=li.querySelector(':scope > a'),d=document.createElement('details'),summary=document.createElement('summary');d.open=false;if(link){summary.innerHTML=link.outerHTML;link.remove()}d.append(summary,ul);li.append(d)});loadMusic();const toc=document.querySelector('.toc');if(toc){const links=[...toc.querySelectorAll('a[href^=\"#\"]')],heads=[...document.querySelectorAll('.prose h2,.prose h3,.prose h4,.prose h5,.prose h6')];const reveal=id=>{toc.querySelectorAll('details').forEach(d=>d.open=false);const a=links.find(x=>x.getAttribute('href')==='#'+id);if(a){let d=a.closest('details');while(d){d.open=true;d=d.parentElement.closest('details')}}};const observer=new IntersectionObserver(es=>{const hit=es.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(hit)reveal(hit.target.id)},{rootMargin:'-18% 0px -68% 0px',threshold:0});tocObserver=observer;heads.forEach(h=>observer.observe(h))}document.querySelectorAll('.copy-link').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.url);b.textContent=tr('copied')}catch{b.textContent=b.dataset.url}}));
}
const audio=$('#music-audio'),tracks=$('#music-tracks'),player=$('#floating-player');
const titleText=$('#music-title'),seek=$('#music-seek'),lyricOverlay=$('#music-lyrics');
let songs=[],current=0,loading=false,lyrics=[],lyricController=null,lyricVersion=0;
let order='sequence',lyricsEnabled=true,hovering=false,listOpen=false,focusInside=false,volumeOpen=false;
try{order=localStorage.getItem('ruri-play-order')||order;lyricsEnabled=localStorage.getItem('ruri-lyrics')!=='off'}catch{}
if(!['sequence','single','shuffle'].includes(order))order='sequence';
const feedback=message=>{$('#music-feedback').textContent=message};
const saveMusicSetting=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
function showVolume(open){volumeOpen=open;$('#music-volume-panel').hidden=!open;$('#music-volume-toggle').setAttribute('aria-expanded',String(open));updatePlayer()}
$('#music-volume-toggle').addEventListener('click',()=>showVolume(!volumeOpen));
function syncVolume(){
  const level=Math.round(audio.volume*100),muted=audio.muted||level===0;
  $('#music-volume').value=level;
  $('#music-volume').style.setProperty('--volume',level+'%');
  $('#music-volume-value').textContent=muted?'0%':level+'%';
  $('#music-volume').setAttribute('aria-valuetext',level+'%');
  $('#music-mute').setAttribute('aria-pressed',String(audio.muted));
  $('#music-mute').setAttribute('aria-label',audio.muted?tr('unmute'):tr('mute'));
  $('#music-mute').title=audio.muted?tr('unmute'):tr('mute');
  player.classList.toggle('is-muted',muted);
  saveMusicSetting('ruri-volume',String(audio.volume));saveMusicSetting('ruri-muted',String(audio.muted));
}
try{const saved=localStorage.getItem('ruri-volume');if(saved!==null&&Number.isFinite(Number(saved)))audio.volume=Math.max(0,Math.min(1,Number(saved)));audio.muted=localStorage.getItem('ruri-muted')==='true'}catch{}
audio.addEventListener('volumechange',syncVolume);
$('#music-volume').addEventListener('input',()=>{audio.volume=Number($('#music-volume').value)/100;audio.muted=false;syncVolume()});
$('#music-mute').addEventListener('click',()=>{audio.muted=!audio.muted;syncVolume()});
syncVolume();
function musicTime(value){if(!Number.isFinite(value)||value<0)return '0:00';return Math.floor(value/60)+':'+String(Math.floor(value%60)).padStart(2,'0')}
function updateTitleScroll(){
  const delta=titleText.scrollWidth-titleText.parentElement.clientWidth;
  titleText.classList.toggle('is-scrolling',delta>4);
  titleText.style.setProperty('--title-shift',Math.min(0,-delta)+'px');
  titleText.style.setProperty('--title-duration',Math.max(9,delta/24+5)+'s');
  updateRailTitleScroll();
}
/* The folded rail sets its title vertically, so its overflow runs along the
   block axis and the same marquee idea pans the text up and down instead. The
   window is what clips, so the window is what the text has to be compared to. */
function updateRailTitleScroll(){
  if(!narrow.matches)return;
  const win=$('#player-rail-window'),el=$('#player-rail-title');if(!win||!el)return;
  const overflow=el.offsetHeight-win.clientHeight;
  const long=overflow>4;
  win.classList.toggle('has-overflow',long);
  el.classList.toggle('is-scrolling',long);
  el.style.setProperty('--rail-shift',Math.min(0,-overflow)+'px');
  el.style.setProperty('--rail-duration',Math.max(9,overflow/24+5)+'s');
}
if(window.ResizeObserver){
  const measure=new ResizeObserver(updateTitleScroll);
  measure.observe(titleText.parentElement);
  /* The rail title only gains a box once the player takes its folded shape, so
     observe it directly and re-measure the moment it becomes visible. */
  const railWindow=$('#player-rail-window');if(railWindow)measure.observe(railWindow);
}
/* Only a really open player lifts the floating lyrics out of the way. */
function updatePlayer(){player.classList.toggle('expanded',hovering||listOpen||volumeOpen||focusInside);document.body.classList.toggle('player-expanded',player.classList.contains('expanded'));requestAnimationFrame(updateTitleScroll)}
function showPlaylist(open){listOpen=open;$('#music-playlist').hidden=!open;$('#music-list-toggle').setAttribute('aria-expanded',String(open));updatePlayer()}
player.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovering=true;updatePlayer()}});
player.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hovering=false;updatePlayer()}});
player.addEventListener('focusin',e=>{focusInside=e.target!==$('#player-toggle');updatePlayer()});
player.addEventListener('focusout',()=>{queueMicrotask(()=>{focusInside=player.contains(document.activeElement)&&document.activeElement!==$('#player-toggle');updatePlayer()})});
player.addEventListener('keydown',e=>{if(e.key==='Escape'){showVolume(false);showPlaylist(false);$('#player-toggle').focus()}});
$('#music-list-toggle').addEventListener('click',()=>showPlaylist(!listOpen));
$('#music-list-close').addEventListener('click',()=>{showPlaylist(false);$('#music-list-toggle').focus()});
document.addEventListener('pointerdown',e=>{if(!player.contains(e.target)){showVolume(false);showPlaylist(false);focusInside=false;hovering=false;updatePlayer()}});
// Touch users can reveal controls without a hover-capable pointer.
$('#player-toggle').addEventListener('click',()=>{const collapsed=player.classList.contains('rail')&&!player.classList.contains('expanded');if(collapsed||matchMedia('(hover: none)').matches){focusInside=true;updatePlayer()}if(!collapsed)toggleMusic()});
// The expanded mobile rail folds back on any outside tap, since hover never ends there.
document.addEventListener('pointerdown',e=>{if(!player.classList.contains('rail')||!player.classList.contains('expanded'))return;if(player.contains(e.target)||$('#toc-toggle')?.contains(e.target)||document.body.classList.contains('toc-open'))return;focusInside=false;hovering=false;updatePlayer()},true);
function updateOrder(){const label={sequence:tr('sequence'),single:tr('single'),shuffle:tr('shuffle')}[order];$('#music-order').dataset.order=order;$('#music-order').setAttribute('aria-label',label+tr('order_hint'));$('#music-order').title=label+tr('order_hint')}
updateOrder();
$('#music-order').addEventListener('click',()=>{const modes=['sequence','single','shuffle'];order=modes[(modes.indexOf(order)+1)%3];saveMusicSetting('ruri-play-order',order);updateOrder()});
function renderLyric(){
  let currentLine=null;
  if(lyricsEnabled&&!audio.paused&&!audio.ended&&!audio.error){
    for(const line of lyrics){if(line.time>audio.currentTime)break;currentLine=line}
  }
  const original=lyricOverlay.querySelector('.lyric-original'),translation=lyricOverlay.querySelector('.lyric-translation');
  original.textContent=currentLine?.text||'';
  translation.textContent=currentLine?.translation||'';
  translation.hidden=!translation.textContent;
  lyricOverlay.hidden=!original.textContent;
}
$('#music-lyrics-toggle').setAttribute('aria-pressed',String(lyricsEnabled));
$('#music-lyrics-toggle').addEventListener('click',()=>{lyricsEnabled=!lyricsEnabled;saveMusicSetting('ruri-lyrics',lyricsEnabled?'on':'off');$('#music-lyrics-toggle').setAttribute('aria-pressed',String(lyricsEnabled));renderLyric()});
function parseMusicLrc(text){
  const result=[],offset=Number(text.match(/\[offset:([+-]?\d+)\]/i)?.[1]||0)/1000;
  for(const row of text.split(String.fromCharCode(10))){
    const tags=[...row.matchAll(/\[(\d+):(\d{1,2}(?:\.\d+)?)\]/g)];
    if(!tags.length)continue;
    const words=row.replace(/\[[^\]]*\]/g,'').trim();
    for(const tag of tags)result.push({time:Math.max(0,Number(tag[1])*60+Number(tag[2])+offset),text:words});
  }
  result.sort((a,b)=>a.time-b.time);
  return result;
}
function combineMusicLyrics(original,translated=[]){
  const grouped=[];
  for(const line of original){
    let group=grouped[grouped.length-1];
    if(!group||Math.abs(group.time-line.time)>.001){group={time:line.time,text:line.text,translation:''};grouped.push(group)}
    else if(line.text&&line.text!==group.text){group.translation=[group.translation,line.text].filter(Boolean).join(' / ')}
  }
  for(const group of grouped){
    const matches=translated.filter(line=>Math.abs(line.time-group.time)<.15&&line.text&&line.text!==group.text);
    if(matches.length)group.translation=[...new Set(matches.map(line=>line.text))].join(' / ');
  }
  return grouped;
}
async function loadLyrics(song){
  lyricController?.abort();lyricController=new AbortController();
  const controller=lyricController,version=++lyricVersion;lyrics=[];renderLyric();
  async function readSource(source){
    if(source&&typeof source==='object')return source;
    if(typeof source!=='string'||!source.trim())return '';
    if(parseMusicLrc(source).length)return source;
    const url=new URL(source,location.href);if(!['http:','https:'].includes(url.protocol))return '';
    const response=await fetch(url,{signal:AbortSignal.any([controller.signal,AbortSignal.timeout(10000)])});
    if(!response.ok)throw Error('lyrics');
    const text=await response.text();try{return JSON.parse(text)}catch{return text}
  }
  const lyricText=value=>typeof value==='string'?value:(value?.lyric||'');
  try{
    const payload=await readSource(song.lrc||song.lyric||'');
    const data=typeof payload==='object'?(payload.data||payload):null;
    const original=typeof payload==='string'?payload:lyricText(data?.lrc||data?.lyric);
    const translationSource=data?.tlyric||data?.translation||song.tlyric||song.translation||song.translatedLyric;
    let translated='';
    // Translation failures must not hide otherwise playable original lyrics.
    try{const result=await readSource(translationSource);translated=lyricText(result?.tlyric||result?.lrc||result)}catch{}
    if(version!==lyricVersion)return;
    lyrics=combineMusicLyrics(parseMusicLrc(original),parseMusicLrc(translated));renderLyric();
  }catch{if(version===lyricVersion){lyrics=[];renderLyric()}}
}
async function playMusic(){try{await audio.play();feedback('')}catch{feedback(tr('play_error'))}}
function toggleMusic(){if(!songs.length)return;if(audio.paused)playMusic();else audio.pause()}
$('#music-play').addEventListener('click',toggleMusic);
$('#cover-state').addEventListener('click',e=>{e.stopPropagation();toggleMusic()});
function syncPlayback(){
  const playing=!audio.paused&&!audio.ended;


  $('#cover-state').setAttribute('aria-label',playing?tr('pause_music'):tr('play_music'));$('#cover-state').setAttribute('aria-pressed',String(playing));$('#cover-state').title=playing?tr('pause_music'):tr('play_music');
  $('#music-play').setAttribute('aria-label',playing?tr('pause'):tr('play'));
  $('#music-play').title=playing?tr('pause'):tr('play');
  $('#player-toggle').setAttribute('aria-label',playing?tr('pause_music'):tr('play_music'));
  $('#player-toggle').setAttribute('aria-pressed',String(playing));
  player.classList.toggle('is-playing',playing);renderLyric();
}
function syncProgress(){
  const duration=audio.duration,valid=Number.isFinite(duration)&&duration>0;
  seek.disabled=!valid;seek.value=valid?Math.round(audio.currentTime/duration*1000):0;
  seek.style.setProperty('--progress',Number(seek.value)/10+'%');
  $('#music-elapsed').textContent=musicTime(audio.currentTime);$('#music-duration').textContent=musicTime(duration);
  seek.setAttribute('aria-valuetext',musicTime(audio.currentTime)+' / '+musicTime(duration));renderLyric();
}
seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0){audio.currentTime=Number(seek.value)/1000*audio.duration;syncProgress()}});
for(const event of ['timeupdate','durationchange','loadedmetadata','emptied','seeked'])audio.addEventListener(event,syncProgress);
for(const event of ['play','pause','ended'])audio.addEventListener(event,syncPlayback);
function selectTrack(n,play=false){
  if(!songs.length)return;current=(n+songs.length)%songs.length;
  const song=songs[current];audio.src=song.url;
  const title=song.name+' · '+(Array.isArray(song.artist)?song.artist.join(' / '):(song.artist||''));
  titleText.textContent=title;titleText.parentElement.title=title;const railTitle=$('#player-rail-title');if(railTitle){railTitle.textContent=title;railTitle.title=title}requestAnimationFrame(updateTitleScroll);
  tracks.querySelectorAll('button').forEach((button,i)=>{button.setAttribute('aria-current',String(i===current))});
  const cover=$('#music-cover');cover.src=song.pic||song.cover||player.dataset.fallback;cover.onerror=()=>{cover.onerror=null;cover.src=player.dataset.fallback};
  feedback('');syncProgress();syncPlayback();loadLyrics(song);if(play)playMusic();
}
function nextIndex(direction=1){if(order==='shuffle'&&songs.length>1)return(current+1+Math.floor(Math.random()*(songs.length-1)))%songs.length;return current+direction}
$('#music-prev').addEventListener('click',()=>selectTrack(nextIndex(-1),true));
$('#music-next').addEventListener('click',()=>selectTrack(nextIndex(),true));
audio.addEventListener('ended',()=>{if(order==='single'){audio.currentTime=0;playMusic()}else selectTrack(nextIndex(),true)});
audio.addEventListener('error',()=>{feedback(tr('audio_error'));renderLyric()});
async function loadMusic(){
  if(!player||player.dataset.enabled==='false')return;if(songs.length){player.hidden=false;return}if(loading)return;if(!player.dataset.api&&(!player.dataset.audio||player.dataset.audio==='null'))return;loading=true;
  try{
    songs=JSON.parse(player.dataset.audio||'[]');
    if(!Array.isArray(songs))songs=[];
    if(!songs.length&&!player.dataset.api)return;if(!songs.length){const url=player.dataset.api.replace(':server',encodeURIComponent(player.dataset.server)).replace(':type',encodeURIComponent(player.dataset.type)).replace(':id',encodeURIComponent(player.dataset.id)).replace(':r',String(Math.random()));const response=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error();songs=await response.json()}
    songs=songs.filter(song=>song.url&&/^https?:\/\//.test(song.url));if(!songs.length)throw Error();
    tracks.replaceChildren();songs.forEach((song,i)=>{const li=document.createElement('li'),button=document.createElement('button'),name=document.createElement('strong'),artist=document.createElement('small');button.type='button';name.textContent=song.name;artist.textContent=Array.isArray(song.artist)?song.artist.join(' / '):(song.artist||'');button.append(name,artist);button.addEventListener('click',()=>selectTrack(i,true));li.append(button);tracks.append(li)});
    $('#music-count').textContent=songs.length+tr('tracks');player.hidden=false;selectTrack(0);
  }catch{songs=[]}finally{loading=false}
}
let walineModule;
async function initComments(){const button=$('#comments-load');if(!button)return;const version=pageVersion;button.disabled=true;button.textContent=tr('comments_loading');try{if(!$('#waline-css')){const css=document.createElement('link');css.id='waline-css';css.rel='stylesheet';css.href='https://cdn.jsdelivr.net/npm/@waline/client@3/dist/waline.css';document.head.append(css)}walineModule??=import('https://cdn.jsdelivr.net/npm/@waline/client@3/dist/waline.js').catch(e=>{walineModule=null;throw e});const {init}=await walineModule;if(version!==pageVersion||!button.isConnected)return;waline=init({...JSON.parse(button.dataset.options),el:'#waline',serverURL:button.dataset.server,lang:button.dataset.lang,path:location.pathname,comment:true,dark:'html.waline-dark'});button.hidden=true}catch{if(!button.isConnected)return;button.disabled=false;button.textContent=tr('comments_error');button.onclick=initComments}}
function initTabs(){const widget=$('.post-tabs');if(!widget)return;const candidates=JSON.parse(widget.querySelector('.post-candidates').textContent);function render(list,items){list.replaceChildren();items.forEach(x=>{const li=document.createElement('li'),a=document.createElement('a');a.href=x.url;a.textContent=x.title+(x.count===undefined?'':' · '+x.count);li.append(a);list.append(li)})}const shuffled=[...candidates];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]}render(widget.querySelector('[data-panel="random"] ol'),shuffled.slice(0,5));let popularLoaded=false;
widget.querySelectorAll('[role=tab]').forEach(button=>{button.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const tabs=[...widget.querySelectorAll('[role=tab]')],i=tabs.indexOf(button);tabs[(i+(e.key==='ArrowRight'?1:2))%3].focus();tabs[(i+(e.key==='ArrowRight'?1:2))%3].click()});button.addEventListener('click',async()=>{widget.querySelectorAll('[role=tab]').forEach(b=>b.setAttribute('aria-selected',String(b===button)));widget.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==button.dataset.tab);if(button.dataset.tab!=='popular'||popularLoaded)return;const status=widget.querySelector('.popular-status');status.textContent=tr('views_loading');try{const counts=[];for(let i=0;i<candidates.length;i+=20){const batch=candidates.slice(i,i+20),url=new URL(widget.dataset.server.replace(/\/$/,'')+'/api/article');url.searchParams.set('path',batch.map(x=>x.url).join(','));url.searchParams.set('type','time');const r=await fetch(url,{signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error();const payload=await r.json();if(!Array.isArray(payload.data))throw Error();counts.push(...payload.data.map((item,j)=>({...item,url:batch[j]?.url})))}const mapped=candidates.map(x=>({...x,count:Number(counts.find(c=>decodeURI(c.url||c.path||'')===decodeURI(x.url))?.time||0)})).filter(x=>x.count>0).sort((a,b)=>b.count-a.count);render(widget.querySelector('[data-panel="popular"] ol'),mapped.slice(0,5));status.textContent=mapped.length?tr('views_sort'):tr('views_empty');popularLoaded=true}catch{status.textContent=tr('views_error')}})})}
let navigationController;
/* ---- in-page navigation feedback -------------------------------------------
   Clicking a link used to do nothing visible until the next page had been
   fetched, parsed and swapped in. On the archive that is a second or more of a
   frozen screen, which reads as a broken link.

   Four things now mark the wait, and they answer two different questions.

   "Where am I going?" is answered by the header itself: the menu item that was
   clicked takes the current-page mark straight away, so the reader sees where
   they are headed before a single byte arrives. The mark is borrowed, not
   moved — every other item keeps its own, and the swapped-in page brings the
   real one. Link clicks have always been cancelable (`defaultPrevented` guards
   this listener), so a plain link is marked and the navigation proceeds.

   "Is it working?" is answered below the menu: two opaque halves of paper slide
   in from the sides and close over the page — the loader motion of
   hugo-theme-reimu — with a big cog turning in the middle where reimu puts its
   taiji, and one line of text under it. The header, the menu and the sidebar
   stay above the paper, untouched and clickable, which is what makes a slow
   page feel handled rather than stuck. The veil covers the page being left —
   not a blank rectangle — so it reads as fog over a room, and it leaves the
   moment the new page is parsed and its scripts are ready.

   A hairline bar riding the header's own rule fills from left to right as the
   wait goes on. It is the quietest of the four and the one that survives a
   cancelled navigation.

   All of it is skipped or stilled when the reader asked for reduced motion, and
   none of it takes a click: clicking the page mid-wait cancels the navigation.
   Screen readers get `aria-busy` on <main> and the veil's own live region
   instead of a progress indicator with no percentage to report. */
let progressTimer=0,progressValue=0,progressToken=0;
/* The bar is pinned to the bottom of the header, and the header's height depends
   on the viewport (one row on a desktop, two on a phone), on how much the
   toolbar holds and on which page it is sitting over. Measured rather than
   guessed, and re-measured on every load and every resize. */
function measureHeader(){
  const header=$('.site-header');
  if(!header)return;
  document.documentElement.style.setProperty('--header-h',Math.round(header.getBoundingClientRect().height+2)+'px');
}
measureHeader();
addEventListener('resize',measureHeader,{passive:true});
addEventListener('orientationchange',measureHeader);
/* A face that arrives after the first measurement can change the bar's height
   (the brand sets in the reader's own serif); take it again once the faces
   that are going to load have loaded. */
document.fonts?.ready.then(measureHeader);
/* The bar and the veil live inside the page shell, so fresh copies arrive with
   every page and the references have to be re-read rather than cached across
   navigations. */
function progressFill(){return $('.nav-progress i')}
function progressBar(){return $('.nav-progress')}
function paintProgress(value){
  const bar=progressBar();if(!bar)return;
  bar.classList.add('is-running');
  progressFill().style.transform='scaleX('+value.toFixed(3)+')';
}
/* The visited page sits under the veil but is not gone: it keeps its scroll
   position, its sidebar and its player, so nothing is frozen or reflowed while
   the reader waits. */
let veilLink=null,borrowedCurrent=null;
function openVeil(link){
  /* A page swap takes the old veil away along with the shell; this also covers
     a navigation that never gets that far. */
  const veil=$('.nav-veil');if(!veil)return;
  veilLink=link;
  veil.classList.add('is-open');
  /* One `aria-current` on the page: the borrowed mark replaces whatever the
     previous page marked, or the menu would claim two places at once. */
  if(link){
    borrowedCurrent=[...document.querySelectorAll('.main-nav a[aria-current]')];
    borrowedCurrent.forEach(item=>item.removeAttribute('aria-current'));
    link.setAttribute('aria-current','page');
  }
}
function closeVeil(){
  const veil=$('.nav-veil');if(veil)veil.classList.remove('is-open');
  /* Hand the marks back to the page: either the swap already brought the real
     one (the old links are detached and this is a no-op) or the navigation was
     cancelled and the reader is still where they were. */
  borrowedCurrent?.forEach(item=>{if(item.isConnected&&!item.hasAttribute('aria-current'))item.setAttribute('aria-current','page')});
  borrowedCurrent=null;veilLink=null;
}
/* The mark belongs to the menu, not to a particular click path: a browser
   back/forward lands on a page whose own markup already carries it, and a
   navigation that was cancelled puts it back where it was. */
/* Both menus carry the mark: the header's inline links on wide screens and the
   drawer's rows on narrow ones. Re-marking only one of them left the other
   pointing at the page just left. */
function syncCurrent(url){
  const path=new URL(url,location.href).pathname;
  document.querySelectorAll('.main-nav a,#ruri-menu a').forEach(item=>{
    const target=new URL(item.href,location.href).pathname;
    item.toggleAttribute('aria-current',target===path);
  });
}
/* The busy flag goes on the article column: the rest of the shell is not going
   anywhere, so announcing it as busy would be wrong. */
function busyTarget(){return $('main')}
function startProgress(link){
  measureHeader();
  document.documentElement.classList.add('is-loading');
  busyTarget()?.setAttribute('aria-busy','true');
  openVeil(link);
  /* A second click while the first page is still loading: the older bar owns
     nothing any more, and its late timeout must not clear the new one. */
  const token=++progressToken;
  clearInterval(progressTimer);
  progressValue=0;
  /* Slow down as the bar approaches the end: a fetch that finishes in 80ms
     should not have the bar most of the way across, and one that hangs must not
     sit still either. 0.82 is where it waits for the swap. */
  progressValue=.12;paintProgress(progressValue);
  progressTimer=setInterval(()=>{
    progressValue+=(.82-progressValue)*(1-progressValue)*.16+progressValue*.004;
    progressValue=Math.min(progressValue,.82);
    if(token===progressToken)paintProgress(progressValue);
  },90);
}
function finishProgress(){
  const token=++progressToken;
  clearInterval(progressTimer);progressTimer=0;
  document.documentElement.classList.remove('is-loading');
  document.querySelectorAll('[aria-busy="true"]').forEach(node=>node.removeAttribute('aria-busy'));
  closeVeil();
  paintProgress(1);
  /* The fill is taken away by the page swap, which is the point: the new page
     arrives with an empty bar rather than with a finished one fading out. A
     navigation that failed instead has to put its own bar away. */
  window.setTimeout(()=>{if(token===progressToken)paintProgress(0)},180);
}
async function navigate(url,push=true,link){
  closeMenu(false);
  navigationController?.abort();
  const controller=new AbortController();navigationController=controller;
  startProgress(link);
  try{
    const response=await fetch(url,{signal:controller.signal,headers:{'X-Ruri-Navigation':'1'}});
    if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))throw Error();
    const doc=new DOMParser().parseFromString(await response.text(),'text/html'),next=doc.querySelector('#page-shell');
    if(!next)throw Error();
    if(controller.signal.aborted)return;
    window.RuriFeatures.destroy();waline?.destroy();waline=null;pageVersion++;
    document.querySelectorAll('#ruri-page-extras').forEach(x=>x.remove());
    $('#page-shell').replaceWith(next);
    document.title=doc.title;document.documentElement.lang=doc.documentElement.lang;
    document.querySelectorAll('head link[rel=canonical],head link[rel=alternate],head meta[name=description],head meta[property^="og:"]').forEach(x=>x.remove());
    doc.querySelectorAll('head link[rel=canonical],head link[rel=alternate],head meta[name=description],head meta[property^="og:"]').forEach(x=>document.head.append(x.cloneNode(true)));
    if(push)history.pushState({},'',response.url+new URL(url).hash);
    /* The veil that arrived with the new shell is closed; the menu it brought
       carries its own mark. The borrowed marks and the old veil belong to nodes
       that are no longer in the document, so this only stops them being reused —
       and it must run before initPage(), which re-reads the new shell. */
    veilLink=null;borrowedCurrent=null;
    syncCurrent(response.url);
    initPage();
    for(const old of next.querySelectorAll('script[data-page-script]')){
      const script=document.createElement('script');
      for(const attr of old.attributes)script.setAttribute(attr.name,attr.value);
      script.textContent=old.textContent;
      if(script.src){await new Promise(resolve=>{script.onload=()=>{if(!controller.signal.aborted&&script.src.includes('auto-render')&&window.renderMathInElement)window.renderMathInElement($('.prose'),{delimiters:[{left:'$$',right:'$$',display:true},{left:'\\[',right:'\\]',display:true},{left:'$',right:'$',display:false},{left:'\\(',right:'\\)',display:false}],throwOnError:false});resolve()};script.onerror=resolve;old.replaceWith(script)})}else old.replaceWith(script);
      if(controller.signal.aborted)return;
    }
    const hash=new URL(url).hash;
    const target=hash?document.getElementById(decodeURIComponent(hash.slice(1))):null;
    if(target)target.scrollIntoView();else window.scrollTo(0,0);
    finishProgress();
  }catch(e){
    if(e.name==='AbortError'){
      /* Two ways to get here. A newer click took over and owns the marks now,
         so this call must keep its hands off them. Or the reader clicked the
         veil to stay where they are: that call already cleaned up. */
      if(navigationController!==controller)return;
      return;
    }
    finishProgress();
    location.assign(url);
  }
}
/* The veil covers the page but swallows nothing, so the reader is free to
   change their mind: clicking anything that is not a link means "stay here",
   and the fetch is dropped so the page is handed back as it was. A link click is
   left alone — the listener below starts a fresh navigation, which is how a
   second choice beats the first rather than cancelling both. The header and the
   menu sit above the veil for the same reason: the tools, the language menu
   and the search button stay usable mid-wait, and a tool is not a change of
   mind — pressing the theme button while the next page loads switches the theme
   and leaves the navigation alone. */
const TOOLS='.site-header button,.site-header summary,.site-header a';
document.addEventListener('click',event=>{
  if(!document.documentElement.classList.contains('is-loading'))return;
  if(event.target.closest('a')||event.target.closest(TOOLS))return;
  navigationController?.abort();
  finishProgress();
},true);
/* Coming back from the back/forward cache gives back the page exactly as it was
   left, including the veil and the bar of a navigation that the browser then
   took over. Clear them; the page itself needs nothing. */
window.addEventListener('pageshow',event=>{if(event.persisted)finishProgress()});
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;const u=new URL(a.href,location.href);if(u.origin!==location.origin||!/^https?:$/.test(u.protocol)||/\.[a-z0-9]+$/i.test(u.pathname))return;if(u.pathname===location.pathname&&u.search===location.search&&u.hash)return;e.preventDefault();navigate(u.href,true,a)});
window.addEventListener('popstate',()=>navigate(location.href,false));document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();$('#search-open')?.click()}});
initPage();
})();
