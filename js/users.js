/* ================= USER ACCOUNTS + SETTINGS ================= */
let authMode='login';
let pendingSignupAvatar='';

/* Safe storage helpers: localStorage can THROW (not just fail) in private/incognito
   modes, in-app browsers (WhatsApp/Facebook/Instagram), and some restricted WebViews.
   Every localStorage call in this app must go through these so a blocked storage
   engine can never silently break a button click. */
function safeGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function safeSet(k,v){try{localStorage.setItem(k,v);return true;}catch(e){return false;}}
function safeRemove(k){try{localStorage.removeItem(k);}catch(e){}}

function users(){try{return JSON.parse(safeGet('studydz_users_v2'))||{};}catch(e){return {};}}
async function hashPassword(password){
  // Works both on GitHub/HTTPS and when the user opens index.html directly.
  if(window.crypto?.subtle){
    try{
      const bytes=new TextEncoder().encode(password);
      const digest=await crypto.subtle.digest('SHA-256',bytes);
      return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
    }catch(e){}
  }
  // Local-file fallback: deterministic hash so registration/login still work offline.
  let h1=0x811c9dc5,h2=0x9e3779b9;
  for(let i=0;i<password.length;i++){
    const c=password.charCodeAt(i);
    h1=Math.imul(h1^c,16777619)>>>0;
    h2=Math.imul(h2^(c+i),2246822519)>>>0;
  }
  return 'local-'+h1.toString(16).padStart(8,'0')+h2.toString(16).padStart(8,'0');
}
function normalizedName(v){return v.trim().replace(/\s+/g,' ');}
function normalizeUsername(v){
  let s=(v||'').trim().toLowerCase().replace(/^@/,'').replace(/[^a-z0-9_]/g,'');
  return s.slice(0,20);
}
function usernameTaken(username, all, exceptKey=''){
  return Object.keys(all).some(k=>k!==exceptKey && normalizeUsername(all[k]?.username||'')===username);
}

function fileToDataURL(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});}
function saveUsersSafe(all){
  const ok=safeSet('studydz_users_v2',JSON.stringify(all));
  if(!ok){
    const msg=document.getElementById('loginMsg');
    if(msg)msg.textContent='تعذر حفظ الحساب على هذا المتصفح. جرّب بدون صورة، أو افتح الموقع من المتصفح مباشرة (وليس من واتساب/فيسبوك)، أو امسح بعض بيانات الموقع.';
  }
  return ok;
}
function setAvatar(el,data){if(!el)return;if(data){el.classList.add('has-image');el.style.backgroundImage=`url("${data}")`;el.textContent='';}else{el.classList.remove('has-image');el.style.backgroundImage='';el.textContent='👤';}}

async function previewSignupAvatar(input){
  const file=input.files?.[0];if(!file)return;
  if(file.size>2*1024*1024){document.getElementById('loginMsg').textContent='الصورة كبيرة جدًا. اختر صورة أقل من 2MB.';input.value='';return;}
  pendingSignupAvatar=await fileToDataURL(file);setAvatar(document.getElementById('signupAvatarPreview'),pendingSignupAvatar);
}

function setAuthMessage(message,type='error'){
  const msg=document.getElementById('loginMsg');
  if(!msg)return;
  msg.textContent=message||'';
  msg.className='login-msg'+(type==='ok'?' ok':'');
}
function toggleAuthMode(){
  try{
    authMode=authMode==='login'?'signup':'login';
    const signup=authMode==='signup';
    const box=document.getElementById('signupOnly');
    if(box)box.classList.toggle('show',signup);
    const title=document.getElementById('loginTitle');
    const btn=document.getElementById('authBtn');
    const sw=document.getElementById('authSwitch');
    if(title)title.textContent=signup?'أنشئ حسابك واحفظ تقدمك على هذا الجهاز.':'سجّل دخولك واحفظ تقدمك وشعلتك على هذا الجهاز.';
    if(btn)btn.textContent=signup?'إنشاء الحساب ✨':'تسجيل الدخول 🚀';
    if(sw)sw.textContent=signup?'لديك حساب؟ تسجيل الدخول':'ليس لديك حساب؟ إنشاء حساب';
    const pass=document.getElementById('loginPass');if(pass)pass.autocomplete=signup?'new-password':'current-password';
    setAuthMessage('');
    // On short screens the extra signup fields can push the guest/submit buttons
    // down; bring the card into view so nothing ends up hidden under the keyboard.
    if(signup){
      const card=document.querySelector('.login-card');
      if(card&&card.scrollIntoView)card.scrollIntoView({block:'start',behavior:'smooth'});
    }
  }catch(err){console.error(err);}
}
async function submitAuth(){
  const name=normalizedName(document.getElementById('loginName')?.value||'');
  const pass=document.getElementById('loginPass')?.value||'';
  const confirm=document.getElementById('loginPassConfirm')?.value||'';
  if(name.length<3){setAuthMessage('اسم الطالب يجب أن يكون 3 أحرف على الأقل.');return;}
  if(pass.length<6){setAuthMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');return;}
  try{
    const key=name.toLocaleLowerCase('ar');
    const all=users();
    if(authMode==='signup'){
      let username=normalizeUsername(name);
      if(username.length<3) username='student';
      let base=username, n=2;
      while(usernameTaken(username,all)){username=(base.slice(0,17)+n).slice(0,20);n++;}
      if(pass!==confirm){setAuthMessage('كلمتا المرور غير متطابقتين.');return;}
      const robot=document.getElementById('robotCheck');
      const terms=document.getElementById('termsCheck');
      if(robot && !robot.checked){setAuthMessage('فعّل خيار «أنا لست روبوتًا».');return;}
      if(terms && !terms.checked){setAuthMessage('يجب الموافقة على الشروط أولًا.');return;}
      if(all[key]){setAuthMessage('اسم المستخدم مستخدم بالفعل على هذا الجهاز.');return;}
      all[key]={displayName:name,username:username,passwordHash:await hashPassword(pass),avatar:pendingSignupAvatar||'',points:0,history:[],locks:{},streak:0,lastDay:null,createdAt:new Date().toISOString(),friends:[],friendRequests:[],messages:[],shareLastDay:null};
      if(!saveUsersSafe(all))return;
      safeSet('studydz_current_user_v2',key);
      enterApp(key);
      return;
    }
    const u=all[key];
    if(!u){setAuthMessage('لا يوجد حساب بهذا الاسم. اضغط «إنشاء حساب» أولًا.');return;}
    const hash=await hashPassword(pass);
    if(u.passwordHash!==hash){setAuthMessage('اسم الطالب أو كلمة المرور غير صحيحة.');return;}
    safeSet('studydz_current_user_v2',key);
    enterApp(key);
  }catch(err){
    console.error(err);
    setAuthMessage('حدث خطأ في التسجيل. جرّب مرة أخرى أو استخدم الدخول كضيف.');
  }
}
function continueAsGuest(){
  try{
    safeSet('studydz_guest_mode','1');
    enterGuestMode();
  }catch(err){
    console.error(err);
    // Never let the button do nothing: fall back to a bare, working guest screen.
    const screen=document.getElementById('loginScreen');if(screen)screen.style.display='none';
    const app=document.getElementById('app');if(app)app.classList.add('guest-mode');
    setAuthMessage('تعذّر حفظ التقدم على هذا المتصفح، لكن يمكنك المتابعة كضيف الآن.','ok');
  }
}
function enterGuestMode(){
  const screen=document.getElementById('loginScreen');if(screen)screen.style.display='none';
  const top=document.getElementById('userNameTop');if(top)top.textContent='زائر 👤';
  const app=document.getElementById('app');if(app)app.classList.add('guest-mode');
  safeRemove('studydz_current_user_v2');
  try{
    const p=loadProgress();
    if(typeof renderProgress==='function')renderProgress();
    if(typeof updateDailyStreakUI==='function')updateDailyStreakUI(p);
    if(typeof initLanguageSettings==='function')initLanguageSettings();
  }catch(err){
    // Even if progress/UI init fails, the guest screen itself must stay usable.
    console.error(err);
  }
}

function ensureUsername(u,key){
  if(!u) return '';
  if(!u.username){
    const base=normalizeUsername(u.displayName||key)||'student';
    u.username=base;
    const all=users();
    let candidate=base, n=2;
    while(usernameTaken(candidate,all,key)){candidate=(base.slice(0,17)+n).slice(0,20);n++;}
    u.username=candidate;
    all[key]=u; saveUsersSafe(all);
  }
  return normalizeUsername(u.username);
}
function refreshProfileUI(){
  const key=currentUser();const u=users()[key];if(!u)return;
  const name=u.displayName||key;
  ensureUsername(u,key);
  const topName=document.getElementById('userNameTop');if(topName)topName.textContent=name;
  const settingsName=document.getElementById('settingsDisplayName');if(settingsName)settingsName.textContent=name;
  const nameInput=document.getElementById('settingsNameInput');if(nameInput)nameInput.value=name;
  setAvatar(document.getElementById('topAvatar'),u.avatar);
  setAvatar(document.getElementById('settingsAvatar'),u.avatar);
}
function enterApp(key){
  const u=users()[key];if(!u){logout();return;}
  document.getElementById('loginScreen').style.display='none';
  refreshProfileUI();renderProgress();updateDailyStreakUI(loadProgress());
  initLanguageSettings();
}
function logout(){safeRemove('studydz_current_user_v2');safeRemove('studydz_guest_mode');location.reload();}
function currentUser(){return safeGet('studydz_current_user_v2');}
function isGuest(){return safeGet('studydz_guest_mode')==='1';}
function loadProgress(){const key=currentUser();if(key){const u=users()[key];if(u)return {points:u.points||0,history:u.history||[],locks:u.locks||{},streak:u.streak||0,lastDay:u.lastDay||null};} if(isGuest()){try{return JSON.parse(safeGet('studydz_guest_progress'))||{points:0,history:[],locks:{},streak:0,lastDay:null};}catch(e){}} return {points:0,history:[],locks:{},streak:0,lastDay:null};}
function saveProgress(p){const key=currentUser();if(key){const all=users();const u=all[key];if(!u)return;u.points=p.points||0;u.history=p.history||[];u.locks=p.locks||{};u.streak=p.streak||0;u.lastDay=p.lastDay||null;all[key]=u;saveUsersSafe(all);return;} if(isGuest()){safeSet('studydz_guest_progress',JSON.stringify(p));}}
function lockKey(){return `${state.level}|${state.gradeIndex}|${state.subject}`;}
function isStageLocked(){return !!loadProgress().locks?.[lockKey()];}
function updateStreak(prog){const today=new Date().toISOString().slice(0,10);if(prog.lastDay===today)return;const prev=new Date();prev.setDate(prev.getDate()-1);const yesterday=prev.toISOString().slice(0,10);prog.streak=(prog.lastDay===yesterday?(prog.streak||0)+1:1);prog.lastDay=today;}
function openTerms(){document.getElementById('termsModal').classList.add('show');document.getElementById('termsModal').setAttribute('aria-hidden','false');}
function closeTerms(){document.getElementById('termsModal').classList.remove('show');document.getElementById('termsModal').setAttribute('aria-hidden','true');}
function acceptTerms(){document.getElementById('termsCheck').checked=true;closeTerms();}

/* settings */
function openSettings(){refreshProfileUI();if(typeof updateReminderUI==='function')updateReminderUI();document.getElementById('settingsDrawer').classList.add('show');document.getElementById('settingsOverlay').classList.add('show');document.getElementById('settingsDrawer').setAttribute('aria-hidden','false');document.body.classList.add('settings-open');}
function closeSettings(){document.getElementById('settingsDrawer').classList.remove('show');document.getElementById('settingsOverlay').classList.remove('show');document.getElementById('settingsDrawer').setAttribute('aria-hidden','true');document.body.classList.remove('settings-open');}
async function changeProfileImage(input){
  const file=input.files?.[0];if(!file)return;
  if(file.size>2*1024*1024){alert('اختر صورة أقل من 2MB.');input.value='';return;}
  const key=currentUser(),all=users(),u=all[key];if(!u)return;
  u.avatar=await fileToDataURL(file);all[key]=u;if(saveUsersSafe(all))refreshProfileUI();
}
function saveDisplayName(){
  const input=document.getElementById('settingsNameInput');const newName=normalizedName(input.value);
  if(newName.length<3){alert('الاسم يجب أن يكون 3 أحرف على الأقل.');return;}
  const key=currentUser(),all=users(),u=all[key];if(!u)return;
  u.displayName=newName;all[key]=u;if(!saveUsersSafe(all))return;refreshProfileUI();
  const btn=document.getElementById('saveNameBtn'),old=btn.textContent;btn.textContent='تم ✓';setTimeout(()=>btn.textContent=old,1200);
}

const SETTINGS_I18N={
  ar:{title:'الإعدادات',account:'الحساب',edit:'تعديل الاسم',save:'حفظ',logout:'تسجيل الخروج',language:'اللغة',uiLang:'لغة الواجهة',version:'نسخة الموقع',versionText:'نسخة 2026 · واجهة جديدة + ExamDZ + حسابات محلية'},
  en:{title:'Settings',account:'Account',edit:'Edit name',save:'Save',logout:'Log out',language:'Language',uiLang:'Interface language',version:'Website version',versionText:'2026 edition · New UI + ExamDZ + Local accounts'},
  fr:{title:'Paramètres',account:'Compte',edit:'Modifier le nom',save:'Enregistrer',logout:'Déconnexion',language:'Langue',uiLang:"Langue de l’interface",version:'Version du site',versionText:'Édition 2026 · Nouvelle interface + ExamDZ + Comptes locaux'}
};
function setAppLanguage(lang){
  if(!SETTINGS_I18N[lang])lang='ar';safeSet('studydz_language',lang);
  const t=SETTINGS_I18N[lang];
  document.getElementById('settingsTitle').textContent=t.title;document.getElementById('accountSettingsLabel').textContent=t.account;document.getElementById('editNameLabel').textContent=t.edit;document.getElementById('saveNameBtn').textContent=t.save;document.getElementById('logoutLabel').textContent=t.logout;document.getElementById('languageSettingsLabel').textContent=t.language;document.getElementById('languageLabel').textContent=t.uiLang;document.getElementById('versionSettingsLabel').textContent=t.version;document.getElementById('versionText').textContent=t.versionText;
  document.documentElement.lang=lang;document.getElementById('settingsDrawer').dir=lang==='ar'?'rtl':'ltr';
}
function initLanguageSettings(){const lang=safeGet('studydz_language')||'ar';const sel=document.getElementById('languageSelect');if(sel)sel.value=lang;setAppLanguage(lang);}

document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSettings();});

/* ================= LOGIN-SCREEN READINESS + SAFETY NET =================
   Two real-world failure modes on weak/old devices, neither of which shows any
   visible error to the user:
   1) The three buttons use onclick="fn()". If the person taps a button before
      this script has fully finished downloading/running (slow connection, slow
      CPU), the function doesn't exist yet and the tap just does nothing.
   2) Any *uncaught* JS error anywhere aborts the click silently — the page
      just sits there ("hangs"). We already tried to make every storage call
      safe above; this is the last-resort net for anything we missed.
*/
(function loginScreenSafety(){
  function enableAuthButtons(){
    document.querySelectorAll('.login-card [data-auth-btn]').forEach(function(btn){
      btn.disabled=false;
    });
    const note=document.getElementById('authLoadingNote');
    if(note)note.style.display='none';
  }
  // Buttons are marked ready as soon as users.js (this file) has finished
  // defining everything a tap needs. app.js also confirms readiness once it
  // finishes initializing, so both real-world race conditions are covered.
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',enableAuthButtons);
  }else{
    enableAuthButtons();
  }
  // Absolute fail-safe: whatever else goes wrong, never leave the buttons
  // permanently disabled on a real device.
  setTimeout(enableAuthButtons,4000);

  window.addEventListener('error',function(e){
    const screen=document.getElementById('loginScreen');
    if(screen&&screen.style.display!=='none'){
      setAuthMessage('حدث خطأ غير متوقع. حاول تحديث الصفحة، أو استخدم «الدخول كضيف».');
    }
    enableAuthButtons();
  });
  window.addEventListener('unhandledrejection',function(e){
    enableAuthButtons();
  });
})();
