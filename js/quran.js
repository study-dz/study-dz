/* ================= QURAN PLAYER (Hybrid: local MP3 + optional YouTube) ================= */
const BUILTIN_TRACKS = [
  {name:'001 — سورة الفاتحة · محمد اللحيدان', url:'assets/audio/001.mp3', builtin:true, kind:'mp3'},
  /* Al-Baqarah is ~104MB — far too large to bundle with the site (this was the
     "takes forever to load" problem). It now streams from the reciter's own
     official server instead of shipping inside the app, so the site itself
     stays light; this track needs an internet connection to play. */
  {name:'002 — سورة البقرة · محمد اللحيدان', url:'https://server8.mp3quran.net/lhdan/002.mp3', builtin:true, kind:'mp3', external:true}
];
const YT_TRACKS_KEY = 'studydz_yt_tracks';


/* Full Quran online player: direct audio, no YouTube redirect. */
const QURAN_SURAH_NAMES=["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];
const QURAN_RECITERS={
  "ar.alafasy":{
    name:"مشاري العفاسي",
    base:"https://server8.mp3quran.net/afs/"
  },
  "ar.abdulbasitmurattal":{
    name:"عبد الباسط عبد الصمد",
    base:"https://server7.mp3quran.net/basit/"
  },
  "ar.husary":{
    name:"محمود خليل الحصري",
    base:"https://server13.mp3quran.net/husr/"
  }
};
function renderOnlineSurahs(){
  const box=document.getElementById('onlineSurahGrid'); if(!box)return;
  const term=(document.getElementById('quranOnlineSearch')?.value||'').trim();
  const reader=document.getElementById('quranReaderSelect')?.value||'ar.alafasy';
  const rows=QURAN_SURAH_NAMES.map((name,i)=>({num:i+1,name}))
    .filter(s=>!term || s.name.includes(term) || String(s.num)===term);
  box.innerHTML=rows.map(s=>{
    const n=String(s.num).padStart(3,'0');
    return `<button class="online-surah-card" onclick="playOnlineSurah(${s.num})">
      <span class="surah-number">${s.num}</span>
      <span class="surah-info"><b>${s.name}</b><small>${QURAN_RECITERS[reader]} · استماع مباشر</small></span>
      <span class="surah-play">▶</span>
    </button>`;
  }).join('');
}
function playOnlineSurah(num){
  const audio=document.getElementById('quranAudio'); if(!audio)return;
  const reader=document.getElementById('quranReaderSelect')?.value||'ar.alafasy';
  const rec=QURAN_RECITERS[reader]||QURAN_RECITERS["ar.alafasy"];
  const n=String(num).padStart(3,'0');

  // The important fix: the audio source now comes from the selected reciter.
  audio.pause();
  audio.src=rec.base+n+'.mp3';
  audio.load();

  const title=document.getElementById('quranNowTitle');
  const readerEl=document.getElementById('quranNowReader');
  if(title)title.textContent=`سورة ${QURAN_SURAH_NAMES[num-1]}`;
  if(readerEl)readerEl.textContent=rec.name+' · استماع مباشر';

  const cover=document.getElementById('quranNowCover');
  if(cover)cover.textContent=String(num).padStart(3,'0');

  audio.play().catch(()=>{});
}
function initFullQuranOnline(){
  renderOnlineSurahs();
}

let playlist = [...BUILTIN_TRACKS];
let currentTrackIndex = null;
let isPlaying = false;
let sleepTimeoutHandle = null;
let audioEl;

/* ---- YouTube (hybrid, additional-only) ---- */
let ytApiReady=false, ytApiLoading=false, ytPlayer=null, ytPendingVideoId=null, ytPendingAutoplay=false;
function loadSavedYouTubeTracks(){
  try{
    const saved=JSON.parse(safeGet(YT_TRACKS_KEY))||[];
    saved.forEach(t=>playlist.push({name:t.name, videoId:t.videoId, builtin:false, kind:'youtube'}));
  }catch(e){}
}
function persistYouTubeTracks(){
  const yt=playlist.filter(t=>t.kind==='youtube').map(t=>({name:t.name, videoId:t.videoId}));
  safeSet(YT_TRACKS_KEY, JSON.stringify(yt));
}
function extractYouTubeId(url){
  if(!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(url.trim()) ? url.trim() : null);
}
async function addYouTubeTrack(){
  const input=document.getElementById('ytUrlInput');
  const raw=input?.value.trim();
  if(!raw){alert('الصق رابط فيديو يوتيوب أولًا.');return;}
  const id=extractYouTubeId(raw);
  if(!id){alert('تعذّر التعرف على رابط يوتيوب. تأكد من الرابط وحاول مجددًا.');return;}
  let name=`فيديو يوتيوب — ${id}`;
  try{
    const res=await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
    if(res.ok){ const data=await res.json(); if(data?.title) name=data.title; }
  }catch(e){ /* offline or blocked — keep generic name, still works as an extra option */ }
  playlist.push({name, videoId:id, builtin:false, kind:'youtube'});
  persistYouTubeTracks();
  if(input) input.value='';
  renderPlaylist();
  if(currentTrackIndex===null) loadTrack(playlist.length-1);
}
function loadYouTubeIframeAPI(cb){
  if(ytApiReady){ cb(); return; }
  if(!ytApiLoading){
    ytApiLoading=true;
    const tag=document.createElement('script');
    tag.src='https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }
  const check=setInterval(()=>{
    if(window.YT && window.YT.Player){
      clearInterval(check); ytApiReady=true; cb();
    }
  },250);
  setTimeout(()=>{ if(!ytApiReady){ clearInterval(check); alert('تعذّر تحميل مشغّل يوتيوب. تحقق من اتصالك بالإنترنت.'); } },10000);
}
window.onYouTubeIframeAPIReady=function(){ ytApiReady=true; };
function ensureYtPlayer(videoId, autoplay){
  loadYouTubeIframeAPI(()=>{
    if(ytPlayer){
      ytPlayer.loadVideoById(videoId);
      if(!autoplay) ytPlayer.pauseVideo();
    } else {
      ytPlayer=new YT.Player('ytPlayer',{
        videoId, playerVars:{playsinline:1},
        events:{
          onReady:()=>{ if(!autoplay) ytPlayer.pauseVideo(); ytPlayer.setVolume(Number(document.getElementById('volumeSlider')?.value||80)); },
          onStateChange:(e)=>{
            if(e.data===YT.PlayerState.ENDED) playNext();
            if(e.data===YT.PlayerState.PLAYING){ isPlaying=true; updateTransportUI(); }
            if(e.data===YT.PlayerState.PAUSED){ isPlaying=false; updateTransportUI(); }
          }
        }
      });
    }
  });
}
function updateTransportUI(){
  document.getElementById('playPauseBtn').textContent = isPlaying?'⏸':'▶';
  document.getElementById('miniPlayBtn').textContent = isPlaying?'⏸':'▶';
  renderPlaylist();
}

function initQuranPlayer(){
  audioEl=document.getElementById('audioEl');
  audioEl.addEventListener('ended',playNext);
  audioEl.addEventListener('error',()=>{
    const t=currentTrackIndex!==null?playlist[currentTrackIndex]:null;
    if(t&&t.external){
      isPlaying=false;updateTransportUI();
      alert('تعذّر تشغيل سورة البقرة. هذه السورة تُشغَّل مباشرة من الإنترنت لتخفيف حجم الموقع — تأكد من اتصالك بالإنترنت وحاول مجددًا.');
    }
  });
  loadSavedYouTubeTracks();
  loadQuranSettings();renderPlaylist();updateNowPlaying();
}
function handleFiles(files){
  Array.from(files).forEach(f=>playlist.push({name:f.name.replace(/\.[^/.]+$/,''),url:URL.createObjectURL(f),builtin:false,kind:'mp3'}));
  renderPlaylist();if(currentTrackIndex===null&&playlist.length)loadTrack(0);
}
function renderPlaylist(){
  const box=document.getElementById('playlistBox');if(!box)return;box.innerHTML='';
  const term=(document.getElementById('quranSearch')?.value||'').trim();
  playlist.forEach((t,i)=>{
    if(term && !t.name.includes(term)) return;
    const row=document.createElement('div');
    row.className='trackrow'+(i===currentTrackIndex?' playing':'')+(t.builtin?' builtin':'')+(t.kind==='youtube'?' youtube':'');
    const remove=t.builtin?'':`<button onclick="event.stopPropagation();removeTrack(${i})">🗑</button>`;
    const icon = i===currentTrackIndex&&isPlaying ? '🎵' : (t.kind==='youtube' ? '🎬' : (t.external ? '🌐' : '📖'));
    row.innerHTML=`<span>${icon}</span><span class="n">${t.name}${t.external?' <small style="opacity:.6">(تشغيل أونلاين)</small>':''}</span>${remove}`;
    row.onclick=()=>{loadTrack(i);play();};box.appendChild(row);
  });
  if(term && !box.children.length){
    box.innerHTML='<div class="empty-tool">لا توجد نتائج مطابقة في قائمتك.</div>';
  }
}
function filterPlaylist(){ renderPlaylist(); }
function removeTrack(i){
  if(playlist[i]?.builtin)return;
  const wasYoutube = playlist[i]?.kind==='youtube';
  if(i===currentTrackIndex){audioEl.pause();if(ytPlayer)try{ytPlayer.stopVideo();}catch(e){}isPlaying=false;currentTrackIndex=null;}
  playlist.splice(i,1);
  if(wasYoutube) persistYouTubeTracks();
  renderPlaylist();updateNowPlaying();
}
function loadTrack(i){
  if(!playlist[i])return;
  currentTrackIndex=i;
  const t=playlist[i];
  const ytBox=document.getElementById('ytPlayerBox');
  if(t.kind==='youtube'){
    audioEl.pause();
    if(ytBox) ytBox.style.display='block';
    ensureYtPlayer(t.videoId, false);
  } else {
    if(ytBox) ytBox.style.display='none';
    if(ytPlayer) try{ytPlayer.pauseVideo();}catch(e){}
    audioEl.src=t.url;
  }
  updateNowPlaying();renderPlaylist();
}
function updateNowPlaying(){const label=currentTrackIndex!==null?playlist[currentTrackIndex].name:'اختر سورة للتشغيل';document.getElementById('nowPlaying').textContent=label;document.getElementById('miniTrackName').textContent=label;document.getElementById('miniPlayer').classList.toggle('show',currentTrackIndex!==null);}
function play(){
  if(currentTrackIndex===null){if(playlist.length)loadTrack(0);else return;}
  const t=playlist[currentTrackIndex];
  if(t.kind==='youtube'){
    loadYouTubeIframeAPI(()=>{ if(ytPlayer){ ytPlayer.playVideo(); } else { ensureYtPlayer(t.videoId, true); } });
    isPlaying=true; updateTransportUI();
    return;
  }
  audioEl.play().then(()=>{isPlaying=true;updateTransportUI();}).catch(()=>{});
}
function pause(){
  const t=currentTrackIndex!==null?playlist[currentTrackIndex]:null;
  if(t && t.kind==='youtube'){ if(ytPlayer) try{ytPlayer.pauseVideo();}catch(e){} isPlaying=false; updateTransportUI(); return; }
  audioEl.pause();isPlaying=false;updateTransportUI();
}
function togglePlay(){isPlaying?pause():play();}
function playNext(){if(!playlist.length)return;const loop=document.getElementById('loopMode').value;let i=currentTrackIndex??0;if(loop==='one'){loadTrack(i);play();return;}i=(i+1)%playlist.length;if(i===0&&loop==='none'){pause();return;}loadTrack(i);play();}
function playPrev(){if(!playlist.length)return;let i=((currentTrackIndex??0)-1+playlist.length)%playlist.length;loadTrack(i);play();}
function setVolume(v){audioEl.volume=v/100;if(ytPlayer)try{ytPlayer.setVolume(Number(v));}catch(e){}saveQuranSettings();}
function setSleepTimer(mins){clearTimeout(sleepTimeoutHandle);saveQuranSettings();if(parseInt(mins)>0)sleepTimeoutHandle=setTimeout(()=>pause(),parseInt(mins)*60*1000);}
function saveQuranSettings(){safeSet('studydz_quran',JSON.stringify({volume:document.getElementById('volumeSlider').value,loop:document.getElementById('loopMode').value,sleep:document.getElementById('sleepTimer').value}));}
function loadQuranSettings(){try{const s=JSON.parse(safeGet('studydz_quran'));const vol=s?.volume??80;document.getElementById('volumeSlider').value=vol;document.getElementById('loopMode').value=s?.loop??'all';audioEl.volume=vol/100;}catch(e){audioEl.volume=.8;}}
