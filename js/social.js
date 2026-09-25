
/* ================= SOCIAL: USERNAMES, FRIENDS, CHAT, SHARING ================= */
let socialSelectedFriend = null;

function socialCurrent(){
  const key=currentUser();
  if(!key) return null;
  const all=users(), u=all[key];
  if(!u) return null;
  ensureUsername(u,key);
  u.friends=u.friends||[];
  u.friendRequests=u.friendRequests||[];
  u.messages=u.messages||[];
  return {key, all, u};
}
function escSocial(v){
  return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function openSocialHub(){
  showScreen('screen-social');
  renderSocial();
}
function renderSocial(){
  const s=socialCurrent(); if(!s)return;
  const {key,all,u}=s;
  const username=ensureUsername(u,key);
  const av=document.getElementById('socialMyAvatar');
  setAvatar(av,u.avatar);
  document.getElementById('socialMyName').textContent=u.displayName||key;
  document.getElementById('socialMyUsername').textContent='@'+username;
  const list=document.getElementById('friendsList');
  const ids=(u.friends||[]);
  document.getElementById('friendsCount').textContent=ids.length;
  list.innerHTML='';
  if(!ids.length){
    list.innerHTML='<div class="empty-social">لا توجد أصدقاء بعد. أضف @username لبدء التواصل.</div>';
  }else{
    ids.forEach(id=>{
      const f=all[id]; if(!f)return;
      const item=document.createElement('button');
      item.className='friend-item'+(socialSelectedFriend===id?' selected':'');
      item.onclick=()=>selectChatFriend(id);
      item.innerHTML=`<span class="friend-avatar">${f.avatar?`<img src="${escSocial(f.avatar)}">`:'👤'}</span>
        <span class="friend-main"><b>${escSocial(f.displayName||id)}</b><small>@${escSocial(ensureUsername(f,id))}</small></span>
        <span>💬</span>`;
      list.appendChild(item);
    });
  }
  renderChat();
  renderShareAchievements();
}
function addFriendByUsername(){
  const input=document.getElementById('friendUsernameInput');
  const wanted=normalizeUsername(input?.value||'');
  const s=socialCurrent(); if(!s)return;
  if(wanted.length<3){alert('اكتب اسم مستخدم صحيحًا مثل @ahmed.');return;}
  const targetKey=Object.keys(s.all).find(k=>normalizeUsername(s.all[k]?.username||'')===wanted);
  if(!targetKey){alert('لم يتم العثور على هذا المستخدم على هذا الجهاز.');return;}
  if(targetKey===s.key){alert('لا يمكنك إضافة نفسك.');return;}
  s.u.friends=s.u.friends||[];
  if(s.u.friends.includes(targetKey)){alert('هذا المستخدم موجود في أصدقائك بالفعل.');return;}
  s.u.friends.push(targetKey);
  s.all[s.key]=s.u;
  s.all[targetKey].friends=s.all[targetKey].friends||[];
  if(!s.all[targetKey].friends.includes(s.key))s.all[targetKey].friends.push(s.key);
  saveUsersSafe(s.all);
  input.value='';
  socialSelectedFriend=targetKey;
  renderSocial();
}
function selectChatFriend(key){
  socialSelectedFriend=key;
  renderSocial();
  setTimeout(()=>document.getElementById('chatInput')?.focus(),50);
}
function renderChat(){
  const box=document.getElementById('chatMessages');
  const label=document.getElementById('chatWithLabel');
  const input=document.getElementById('chatInput');
  const btn=document.getElementById('chatSendBtn');
  if(!box)return;
  const s=socialCurrent(); if(!s)return;
  if(!socialSelectedFriend || !s.all[socialSelectedFriend]){
    label.textContent='اختر صديقًا لبدء الدردشة';
    box.innerHTML='<div class="empty-social">اختر أحد أصدقائك من القائمة.</div>';
    if(input)input.disabled=true;if(btn)btn.disabled=true;return;
  }
  const f=s.all[socialSelectedFriend];
  label.textContent='💬 مع '+(f.displayName||socialSelectedFriend)+' · @'+ensureUsername(f,socialSelectedFriend);
  if(input)input.disabled=false;if(btn)btn.disabled=false;
  const pair=[s.key,socialSelectedFriend].sort().join('|');
  const msgs=(s.u.messages||[]).filter(m=>m.pair===pair).sort((a,b)=>a.time-b.time);
  box.innerHTML=msgs.length?msgs.map(m=>`<div class="chat-bubble ${m.from===s.key?'mine':'theirs'}">${escSocial(m.text)}<small>${new Date(m.time).toLocaleTimeString('ar-DZ',{hour:'2-digit',minute:'2-digit'})}</small></div>`).join(''):'<div class="empty-social">ابدأ أول رسالة 👋</div>';
  box.scrollTop=box.scrollHeight;
}
function sendChatMessage(){
  const input=document.getElementById('chatInput');
  const text=(input?.value||'').trim();
  const s=socialCurrent(); if(!s||!socialSelectedFriend||!text)return;
  const pair=[s.key,socialSelectedFriend].sort().join('|');
  const msg={pair,from:s.key,to:socialSelectedFriend,text,time:Date.now()};
  s.u.messages=s.u.messages||[];
  s.u.messages.push(msg);
  s.all[s.key]=s.u;
  // Store the same message in the friend's local account so it appears there too.
  const f=s.all[socialSelectedFriend];
  f.messages=f.messages||[]; f.messages.push(msg);
  s.all[socialSelectedFriend]=f;
  saveUsersSafe(s.all);
  input.value='';
  renderChat();
}
async function shareProfile(){
  const s=socialCurrent(); if(!s)return;
  const text=`هذا حسابي في Study DZ: @${ensureUsername(s.u,s.key)} — ${s.u.displayName||''}`;
  if(navigator.share){
    try{await navigator.share({title:'Study DZ',text});return;}catch(e){}
  }
  try{await navigator.clipboard.writeText(text);alert('تم نسخ معلومات الحساب للمشاركة.');}
  catch(e){alert(text);}
}
function todayKey(){return new Date().toISOString().slice(0,10);}
async function awardShare10(){
  const s=socialCurrent(); if(!s)return false;
  const today=todayKey();
  if(s.u.shareLastDay===today){alert('حصلت على نقاط المشاركة اليوم بالفعل. عد غدًا للحصول على +10 نقاط.');return false;}
  s.u.shareLastDay=today;
  s.u.points=(s.u.points||0)+10;
  s.all[s.key]=s.u; saveUsersSafe(s.all);
  return true;
}
async function shareAchievement(itemText){
  const text=itemText||'أنجزت تمرينًا في Study DZ 🏆';
  let shared=false;
  if(navigator.share){
    try{await navigator.share({title:'إنجازي في Study DZ',text});shared=true;}catch(e){return false;}
  }else{
    try{await navigator.clipboard.writeText(text);shared=true;alert('تم نسخ الإنجاز. يمكنك نشره على أي منصة.');}
    catch(e){alert(text);shared=true;}
  }
  if(shared && await awardShare10()){
    alert('🎉 +10 نقاط تمت إضافتها لإنجاز المشاركة اليوم!');
    renderSocial(); renderProgress();
  }
  return shared;
}
function shareLatestAchievement(){
  const p=loadProgress();
  const h=p.history?.[0];
  const text=h
    ? `🏆 إنجازي في Study DZ: ${h.subject} — ${h.grade} — النتيجة ${h.pct}% وحصلت على ${h.points} نقطة.`
    : `🏆 بدأت رحلتي في Study DZ — ${p.points||0} نقطة!`;
  shareAchievement(text);
}
function renderShareAchievements(){
  const box=document.getElementById('shareAchievementsList');
  if(!box)return;
  const p=loadProgress(), h=p.history||[];
  box.innerHTML=h.length ? h.slice(0,3).map((x,i)=>`
    <div class="share-row">
      <div><b>${escSocial(x.subject)}</b><small>${escSocial(x.grade)} · ${x.pct}%</small></div>
      <button onclick="shareAchievement('🏆 Study DZ: ${escSocial(x.subject)} — ${escSocial(x.grade)} — ${x.pct}%')">مشاركة</button>
    </div>`).join('') : '<small>أكمل امتحانًا أولًا لتظهر إنجازاتك هنا.</small>';
}
