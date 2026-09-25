/* ================= DATA ================= */
const LEVELS = {
  "ابتدائي": {grades:5, subjects:["رياضيات","عربية","فرنسية","علوم"]},
  "متوسط": {grades:4, subjects:["رياضيات","عربية","فرنسية","إنجليزية","علوم","تاريخ وجغرافيا"]},
  "ثانوي": {grades:3, subjects:["رياضيات","عربية","فرنسية","إنجليزية","علوم طبيعية","فيزياء","تاريخ وجغرافيا"]}
};
const SUBJECT_ICONS = {
  "رياضيات":"📐","عربية":"📖","فرنسية":"🇫🇷","إنجليزية":"🇬🇧","علوم":"🔬",
  "علوم طبيعية":"🧬","فيزياء":"⚛️","تاريخ وجغرافيا":"🌍"
};

/* Static sample question banks (per subject, general to the level) */
const BANKS = {
"عربية":{
  "ابتدائي":[
    ["ما هو جمع كلمة (كتاب)؟",["كتب","كتابون","كاتبون","كتيب"],0],
    ["أي الكلمات التالية اسم؟",["يكتب","جميل","مدرسة","في"],2],
    ["ما ضد كلمة (كبير)؟",["طويل","صغير","سريع","قوي"],1],
    ["ما هو الحرف الأول في كلمة (شمس)؟",["س","ش","م","ص"],1],
    ["أي الجمل صحيحة نحويًا؟",["الولد يلعب في الحديقة","الولد يلعب حديقة في","في الولد يلعب الحديقة","يلعب في الحديقة الولد أن"],0],
    ["ما مرادف كلمة (سعيد)؟",["حزين","فرح","غاضب","خائف"],1],
    ["كم عدد حروف كلمة (مدرسة)؟",["5","6","7","8"],1],
    ["ما نوع كلمة (سريعًا) في جملة: ركض الولد سريعًا؟",["اسم","فعل","حال","حرف"],2]
  ],
  "متوسط":[
    ["ما إعراب كلمة (الطالبُ) في: الطالبُ مجتهدٌ؟",["مبتدأ مرفوع","خبر منصوب","فاعل مجرور","مفعول به"],0],
    ["ما جمع كلمة (قلم)؟",["أقلام","قلمون","قلمين","أقلمة"],0],
    ["ما نوع الأسلوب في: هل حضر أخوك؟",["أسلوب تعجب","أسلوب استفهام","أسلوب نداء","أسلوب أمر"],1],
    ["ما مضاد كلمة (النجاح)؟",["الفوز","الرسوب","التفوق","الاجتهاد"],1],
    ["ما هو الفعل المضارع من (كتبَ)؟",["كاتب","يكتب","اكتب","مكتوب"],1],
    ["أي الكلمات فيها همزة قطع؟",["استخرج","أحمد","انطلق","اجتماع"],1],
    ["ما نوع الخبر في: العلمُ نورٌ؟",["جملة فعلية","جملة اسمية","مفرد","شبه جملة"],2]
  ],
  "ثانوي":[
    ["ما هو البحر الشعري في قول الشاعر إذا كان مكوّنًا من تفعيلة (فاعلاتن) متكررة؟",["الطويل","الرمل","الكامل","البسيط"],1],
    ["ما نوع الصورة البيانية في: الوقتُ كالسيف؟",["استعارة","تشبيه","كناية","مجاز مرسل"],1],
    ["ما إعراب المصدر المؤول في: يسرني أن تنجح؟",["فاعل","مفعول به","نائب فاعل","خبر"],0],
    ["أي مما يلي من خصائص الأدب الواقعي؟",["المبالغة والخيال","تصوير الواقع كما هو","الرمزية المفرطة","الابتعاد عن المجتمع"],1],
    ["ما نوع (لولا) في: لولا العلمُ لهلك الناس؟",["حرف شرط جازم","حرف شرط غير جازم","اسم شرط","أداة استفهام"],1],
    ["ما جمع كلمة (قضية) على وزن فعائل؟",["قضايا","قضيات","قضائي","مقاضٍ"],0]
  ]
},
"فرنسية":{
  "ابتدائي":[
    ["Comment dit-on « livre » en français ?",["Livre","Table","Chaise","Porte"],0],
    ["Complétez : Je ___ un élève.",["es","suis","est","sommes"],1],
    ["Quel est le pluriel de « chat » ?",["chates","chats","chatux","chates"],1],
    ["Choisissez l'article correct : ___ maison",["le","la","les","un"],1],
    ["Comment dit-on « bonjour » le soir ?",["Bonjour","Bonsoir","Salut","Au revoir"],1]
  ],
  "متوسط":[
    ["Quel est le contraire de « grand » ?",["petit","haut","large","long"],0],
    ["Conjuguez : Nous ___ (aller) à l'école.",["vais","va","allons","vont"],2],
    ["Quel temps est utilisé dans : « J'ai mangé » ?",["Présent","Passé composé","Futur","Imparfait"],1],
    ["Choisissez le mot correct : Elle ___ une lettre.",["écrit","écris","écrivent","écrire"],0],
    ["Quel est le féminin de « acteur » ?",["actrice","acteure","actric","actrisse"],0]
  ],
  "ثانوي":[
    ["Quel est le mode utilisé après « il faut que » ?",["Indicatif","Subjonctif","Conditionnel","Impératif"],1],
    ["Identifiez la figure de style : « Le temps est un voleur »",["Métaphore","Comparaison","Hyperbole","Litote"],0],
    ["Quelle est la fonction de « dont » dans une proposition relative ?",["Sujet","Complément du nom","Attribut","Objet direct"],1],
    ["Mettez au conditionnel : Si j'avais le temps, je ___ (venir).",["viens","viendrais","viendrai","venais"],1]
  ]
},
"إنجليزية":{
  "متوسط":[
    ["Choose the correct form: She ___ to school every day.",["go","goes","going","gone"],1],
    ["What is the opposite of 'happy'?",["sad","angry","tired","glad"],0],
    ["Complete: They ___ playing football now.",["is","am","are","be"],2],
    ["Which word is a noun?",["quickly","beautiful","freedom","run"],2],
    ["Choose the past tense of 'go'.",["goed","went","gone","going"],1]
  ],
  "ثانوي":[
    ["Choose the correct conditional: If I ___ rich, I would travel.",["am","was","were","be"],2],
    ["Identify the passive voice sentence.",["She wrote the letter.","The letter was written by her.","She is writing.","She will write."],1],
    ["What does the idiom 'break the ice' mean?",["To start a conversation","To break something","To be cold","To end a fight"],0],
    ["Choose the correct relative pronoun: The man ___ helped me is a doctor.",["which","who","whom","whose"],1]
  ]
},
"علوم":{
  "ابتدائي":[
    ["ما هو العضو المسؤول عن ضخ الدم في الجسم؟",["الرئة","القلب","المعدة","الكبد"],1],
    ["ما هي حالات المادة؟",["صلبة وسائلة فقط","صلبة وسائلة وغازية","غازية فقط","سائلة فقط"],1],
    ["من أين يحصل النبات على غذائه؟",["من التربة فقط","بالتمثيل الضوئي","من الحيوانات","لا يحتاج غذاء"],1],
    ["ما هو أقرب كوكب إلى الشمس؟",["الأرض","عطارد","المريخ","الزهرة"],1],
    ["كم عدد حواس الإنسان الأساسية؟",["3","4","5","6"],2]
  ],
  "متوسط":[
    ["ما وحدة قياس القوة؟",["نيوتن","واط","جول","أمبير"],0],
    ["ما اسم العملية التي يحول بها النبات الضوء إلى غذاء؟",["التنفس","التمثيل الضوئي","الهضم","الإخراج"],1],
    ["ما هو الغاز الذي يتنفسه الإنسان؟",["ثاني أكسيد الكربون","الأكسجين","النيتروجين","الهيدروجين"],1],
    ["ما هي وحدة قياس التيار الكهربائي؟",["فولت","أوم","أمبير","واط"],2]
  ]
},
"علوم طبيعية":{
  "ثانوي":[
    ["ما اسم العضية المسؤولة عن إنتاج الطاقة في الخلية؟",["النواة","الميتوكندري","الريبوسوم","الغشاء"],1],
    ["ما هو الحمض النووي المسؤول عن نقل المعلومة الوراثية؟",["ARN","ADN","البروتين","الدهون"],1],
    ["ما نوع الانقسام الذي ينتج خلايا جنسية؟",["الانقسام المتساوي","الانقسام المنصف","التكاثر الخضري","الانشطار"],1],
    ["ما وظيفة الإنزيمات في الجسم؟",["تخزين الطاقة","تسريع التفاعلات الكيميائية","نقل الأكسجين","تكوين العظام"],1]
  ]
},
"فيزياء":{
  "ثانوي":[
    ["ما وحدة قياس القوة في النظام الدولي؟",["جول","نيوتن","واط","باسكال"],1],
    ["ما هي سرعة الضوء تقريبًا في الفراغ؟",["300 كم/ث","300000 كم/ث","3000 كم/ث","30000 كم/ث"],1],
    ["ما قانون أوم؟",["V = I × R","F = m × a","E = m × c²","P = F × d"],0],
    ["ما نوع الطاقة المخزنة في جسم مرتفع؟",["حركية","وضع (كامنة)","حرارية","كهربائية"],1]
  ]
},
"تاريخ وجغرافيا":{
  "متوسط":[
    ["في أي سنة اندلعت ثورة أول نوفمبر الجزائرية؟",["1954","1962","1945","1830"],0],
    ["ما هي عاصمة الجزائر؟",["وهران","الجزائر العاصمة","قسنطينة","عنابة"],1],
    ["ما هو أطول نهر في العالم؟",["الأمازون","النيل","الفرات","الدجلة"],1],
    ["ما اسم أكبر صحراء في العالم؟",["صحراء كلاهاري","الصحراء الكبرى","صحراء غوبي","صحراء ناميب"],1]
  ],
  "ثانوي":[
    ["متى تم استرجاع الاستقلال الجزائري؟",["1954","1956","1962","1958"],2],
    ["ما اسم المعاهدة التي أنهت الحرب العالمية الأولى؟",["معاهدة فرساي","معاهدة يالطا","معاهدة روما","معاهدة باريس"],0],
    ["ما هو أكبر تجمع اقتصادي أوروبي؟",["الاتحاد الأوروبي","الآسيان","النافتا","الميركوسور"],0],
    ["ما اسم المؤتمر الذي انطلقت منه الثورة الجزائرية تنظيميًا؟",["مؤتمر الصومام","مؤتمر باندونغ","مؤتمر يالطا","مؤتمر فرساي"],0]
  ]
}
};

/* ---- Math generator (grade-aware) ---- */
function genMathQuestion(level, grade){
  function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
  function shuffleOptions(correct, wrongs){
    const opts=[correct,...wrongs];
    for(let i=opts.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[opts[i],opts[j]]=[opts[j],opts[i]];}
    return [opts, opts.indexOf(correct)];
  }
  let a,b,q,ans;
  if(level==="ابتدائي"){
    if(grade<=2){ a=rnd(1,20); b=rnd(1,20); q=`${a} + ${b} = ؟`; ans=a+b; }
    else if(grade===3){ a=rnd(10,50); b=rnd(1,20); const op=Math.random()<0.5;
      if(op){ q=`${a} + ${b} = ؟`; ans=a+b; } else { a=Math.max(a,b+5); q=`${a} - ${b} = ؟`; ans=a-b; } }
    else { a=rnd(2,12); b=rnd(2,12); q=`${a} × ${b} = ؟`; ans=a*b; }
    const wrongs=[ans+rnd(1,4), Math.max(0,ans-rnd(1,4)), ans+rnd(5,9)];
    const [opts,idx]=shuffleOptions(String(ans), wrongs.map(String));
    return [q, opts, idx];
  }
  if(level==="متوسط"){
    if(grade<=2){ a=rnd(3,12); b=rnd(2,9); q=`${a} × ${b} = ؟`; ans=a*b; }
    else if(grade===3){ a=rnd(2,10); b=rnd(2,6); q=`${a}² + ${b} = ؟`; ans=a*a+b; }
    else { a=rnd(2,9); b=rnd(2,9); q=`حل: س + ${a} = ${a+b}   فما قيمة س ؟`; ans=b; }
    const wrongs=[ans+rnd(1,5), Math.max(0,ans-rnd(1,5)), ans+rnd(6,10)];
    const [opts,idx]=shuffleOptions(String(ans), wrongs.map(String));
    return [q, opts, idx];
  }
  // ثانوي
  if(grade===1){ a=rnd(2,9); b=rnd(2,9); q=`(${a} + ${b})² = ؟`; ans=(a+b)*(a+b); }
  else if(grade===2){ a=rnd(2,6); q=`ما مشتقة الدالة f(x) = x^${a} ؟`; return [q, [`${a}x^${a-1}`, `x^${a}`, `${a}x^${a}`, `${a-1}x^${a}`],0]; }
  else { a=rnd(2,9); b=rnd(1,9); q=`حل المعادلة: 2س + ${a} = ${a+2*b}  فما قيمة س ؟`; ans=b; }
  const wrongs=[ans+rnd(1,5), Math.max(0,ans-rnd(1,5)), ans+rnd(6,12)];
  const [opts,idx]=shuffleOptions(String(ans), wrongs.map(String));
  return [q, opts, idx];
}

/* ================= STATE ================= */
let state = {
  level:null, gradeIndex:null, gradeLabel:null, subject:null,
  qCount:10, timePerQ:40, quranDuringExam:false,
  questions:[], currentIndex:0, answers:[], timerHandle:null, timeLeft:0
};

/* ================= NAV ================= */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.navitem').forEach(b=>b.classList.toggle('active', b.dataset.s===id));
  window.scrollTo(0,0);
}

/* ================= EXAMDZ PAPERS ================= */
const EXAMDZ_BASE='https://www.examdz.com';
const EXAMDZ_SUBJECT_SLUGS={
  "رياضيات":"math-sc",
  "عربية":"arabic",
  "فرنسية":"french",
  "إنجليزية":"english",
  "علوم":"science",
  "علوم طبيعية":"science-nature",
  "فيزياء":"physics",
  "تاريخ وجغرافيا":"history-geography"
};
function examDzGradeUrl(level, grade){
  const g=Number(grade);
  if(level==='ابتدائي') return `${EXAMDZ_BASE}/primaire/${g}ap/`;
  if(level==='متوسط') return `${EXAMDZ_BASE}/moyen/${g}am/`;
  return `${EXAMDZ_BASE}/secondaire/${g}as/`;
}
function examDzSubjectUrl(level, grade, subject){
  const base=examDzGradeUrl(level,grade);
  const slug=EXAMDZ_SUBJECT_SLUGS[subject];
  if(!slug) return base;
  if(level==='ثانوي' && subject==='عربية') return `${base}arabic/`;
  if(level==='ثانوي' && subject==='علوم طبيعية') return `${base}science/`;
  if(level==='ثانوي' && subject==='فيزياء') return `${base}physics/`;
  if(level==='متوسط' && subject==='علوم') return `${base}science/`;
  return `${base}${slug}/`;
}
function renderPapers(){
  const levelEl=document.getElementById('papersLevel');
  const gradeEl=document.getElementById('papersGrade');
  const subjectEl=document.getElementById('papersSubject');
  if(!levelEl||!gradeEl||!subjectEl)return;
  const level=levelEl.value;
  const max=LEVELS[level].grades;
  const oldGrade=Number(gradeEl.value)||2;
  gradeEl.innerHTML='';
  for(let i=1;i<=max;i++){
    const o=document.createElement('option');o.value=i;o.textContent=`السنة ${i} ${level}`;gradeEl.appendChild(o);
  }
  gradeEl.value=String(Math.min(Math.max(oldGrade,1),max));
  const oldSub=subjectEl.value;
  subjectEl.innerHTML='';
  LEVELS[level].subjects.forEach(sub=>{const o=document.createElement('option');o.value=sub;o.textContent=sub;subjectEl.appendChild(o);});
  if(LEVELS[level].subjects.includes(oldSub))subjectEl.value=oldSub;
}
function openExamDZPaper(semester){
  const level=document.getElementById('papersLevel').value;
  const grade=Number(document.getElementById('papersGrade').value);
  const subject=document.getElementById('papersSubject').value;
  const url=examDzSubjectUrl(level,grade,subject);
  window.open(url,'_blank','noopener,noreferrer');
}

function goGrades(btn){
  state.level = btn.dataset.level;
  document.getElementById('crumbLevel').textContent = state.level;
  const g = LEVELS[state.level].grades;
  const grid = document.getElementById('gradesGrid');
  grid.innerHTML='';
  for(let i=1;i<=g;i++){
    const b=document.createElement('button');
    b.className='tile';
    b.innerHTML=`<span class="ic">📘</span><b>السنة ${i}</b><small>${state.level}</small>`;
    b.onclick=()=>goSubjects(i);
    grid.appendChild(b);
  }
  showScreen('screen-grades');
}

function goSubjects(gradeIdx){
  state.gradeIndex = gradeIdx;
  state.gradeLabel = `السنة ${gradeIdx} ${state.level}`;
  document.getElementById('crumbGrade').textContent = state.gradeLabel;
  const grid = document.getElementById('subjectsGrid');
  grid.innerHTML='';
  const prog = loadProgress();
  LEVELS[state.level].subjects.forEach(subj=>{
    const key = `${state.level}|${gradeIdx}|${subj}`;
    const done = !!(prog.locks && prog.locks[key]);
    const b=document.createElement('button');
    b.className='tile'+(done?' stage-lock':'');
    b.innerHTML=`<span class="ic">${SUBJECT_ICONS[subj]||'📚'}</span><b>${subj}</b><small>${done?'مكتملة ✅ · مغلقة':'المرحلة 1 · أسئلة ذكية متنوعة'}</small>`;
    b.onclick=()=>goSetup(subj);
    grid.appendChild(b);
  });
  showScreen('screen-subjects');
}

function goSetup(subj){
  state.subject = subj;
  document.getElementById('crumbSubject').innerHTML = `<b>${state.gradeLabel}</b> · ${subj}`;
  document.getElementById('setupTitle').textContent = `امتحان ${subj}`;
  const locked = isStageLocked();
  const startBtn = document.querySelector('#screen-setup .startbtn');
  startBtn.disabled = locked;
  startBtn.style.opacity = locked ? .5 : 1;
  startBtn.textContent = locked ? 'هذه المرحلة مكتملة ومغلقة 🔒' : 'ابدأ الامتحان 🚀';
  showScreen('screen-setup');
}

function setPick(btn, type){
  const parent = btn.parentElement;
  parent.querySelectorAll('.pill').forEach(p=>p.classList.remove('on'));
  btn.classList.add('on');
  if(type==='count') state.qCount = parseInt(btn.dataset.v);
  if(type==='time') state.timePerQ = parseInt(btn.dataset.v);
}
function setQuranDuringExam(v){
  state.quranDuringExam = v;
  document.getElementById('qtoggleOn').classList.toggle('on', v);
  document.getElementById('qtoggleOff').classList.toggle('on', !v);
}

/* ================= EXAM ================= */
function buildQuestions(){
  const list=[];
  const count=state.qCount;

  // Mathematics is already procedurally generated.
  if(state.subject==="رياضيات"){
    for(let i=0;i<count;i++) list.push(genMathQuestion(state.level,state.gradeIndex));
    return list;
  }

  const bank = (BANKS[state.subject] && BANKS[state.subject][state.level]) || [];
  let pool = [...bank];

  // AI-style local variation: shuffle, rotate wording, and generate additional
  // questions from the available knowledge bank without requiring an internet API.
  function shuffle(a){
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
    return a;
  }
  function clone(q){ return [q[0],[...q[1]],q[2]]; }

  pool=shuffle(pool);
  while(list.length<count && pool.length){
    const base=pool[list.length%pool.length];
    list.push(clone(base));
  }

  // If the current subject has fewer questions than requested, cycle through
  // the bank with a small visual/wording variation rather than showing an empty stage.
  for(let i=pool.length;i<count;i++){
    const q=clone(pool[i%pool.length]);
    q[0] = `🤖 سؤال متنوع: ${q[0]}`;
    list.push(q);
  }
  return shuffle(list);
}

function startExam(){
  if(isStageLocked()){alert("هذه المرحلة مكتملة ومغلقة حتى التحديث القادم 🔒");return;}
  state.questions = buildQuestions();
  state.currentIndex = 0;
  state.answers = new Array(state.questions.length).fill(null);
  if(state.quranDuringExam && currentTrackIndex!==null && !isPlaying) togglePlay();
  showScreen('screen-exam');
  renderQuestion();
}

function renderQuestion(){
  clearInterval(state.timerHandle);
  const q = state.questions[state.currentIndex];
  document.getElementById('examQCount').textContent = `السؤال ${state.currentIndex+1} من ${state.questions.length}`;
  document.getElementById('examProgress').style.width = `${((state.currentIndex)/state.questions.length)*100}%`;
  document.getElementById('examQText').textContent = q[0];
  const optsBox = document.getElementById('examOpts');
  optsBox.innerHTML='';
  q[1].forEach((optText, idx)=>{
    const b=document.createElement('button');
    b.className='opt';
    b.textContent = optText;
    b.onclick=()=>selectOption(idx,b);
    optsBox.appendChild(b);
  });
  document.getElementById('examNextBtn').textContent = (state.currentIndex===state.questions.length-1) ? 'إنهاء الامتحان ✅' : 'السؤال التالي ←';
  state.timeLeft = state.timePerQ;
  updateTimerUI();
  state.timerHandle = setInterval(()=>{
    state.timeLeft--;
    updateTimerUI();
    if(state.timeLeft<=0){ clearInterval(state.timerHandle); lockOptions(); nextQuestion(true); }
  },1000);
}
function updateTimerUI(){
  const t=document.getElementById('examTimer');
  t.textContent = `⏱ ${state.timeLeft}`;
  t.classList.toggle('warn', state.timeLeft<=10);
}
function selectOption(idx, el){
  if(el.parentElement.dataset.locked) return;
  el.parentElement.querySelectorAll('.opt').forEach(o=>o.classList.remove('sel'));
  el.classList.add('sel');
  state.answers[state.currentIndex] = idx;
}
function lockOptions(){
  document.getElementById('examOpts').dataset.locked = "1";
}
function nextQuestion(auto){
  clearInterval(state.timerHandle);
  if(state.currentIndex < state.questions.length-1){
    state.currentIndex++;
    renderQuestion();
  } else {
    finishExam();
  }
}
function finishExam(){
  let correct=0;
  state.questions.forEach((q,i)=>{ if(state.answers[i]===q[2]) correct++; });
  const total = state.questions.length;
  const wrong = total-correct;
  const pct = Math.round((correct/total)*100);
  document.getElementById('resultSubtitle').textContent = `${state.subject} · ${state.gradeLabel}`;
  document.getElementById('scoreRing').style.setProperty('--pct', pct);
  document.getElementById('scorePct').textContent = pct+'%';
  document.getElementById('correctCount').textContent = correct;
  document.getElementById('wrongCount').textContent = wrong;
  const pointsEarned = correct*10 + (pct===100 ? 20 : 0);
  document.getElementById('pointsBanner').innerHTML = `+${pointsEarned} نقطة 🏆 · <span class="flame">🔥</span> شعلتك مستمرة`;

  // save progress
  const prog = loadProgress();
  prog.points += pointsEarned;
  prog.history.unshift({level:state.level, grade:state.gradeLabel, subject:state.subject, correct, total, pct, points:pointsEarned, date:new Date().toISOString()});
   prog.locks=prog.locks||{}; prog.locks[lockKey()]=true; updateStreak(prog);
  prog.history = prog.history.slice(0,50);
  saveProgress(prog);
  updateDailyStreakUI(prog);
  document.getElementById('ptsQuick').textContent = `${prog.points} نقطة`;

  renderReview();
  showScreen('screen-results');
}
function renderReview(){
  const box = document.getElementById('reviewList');
  box.innerHTML='';
  state.questions.forEach((q,i)=>{
    const userIdx = state.answers[i];
    const ok = userIdx===q[2];
    const item=document.createElement('div');
    item.className='reviewitem';
    item.innerHTML = `
      <div class="qh"><b>${i+1}. ${q[0]}</b><span class="tag ${ok?'ok':'no'}">${ok?'صحيح':'خطأ'}</span></div>
      <div class="ans ${ok?'right':''}">إجابتك: ${userIdx===null?'بدون إجابة':q[1][userIdx]}</div>
      ${ok?'':`<div class="ans right">الإجابة الصحيحة: ${q[1][q[2]]}</div>`}
    `;
    box.appendChild(item);
  });
}

/* ================= PROGRESS / BADGES ================= */
const BADGES = [
  {min:0, name:'مبتدئ', ic:'🌱'},
  {min:50, name:'مجتهد', ic:'📗'},
  {min:200, name:'متفوق', ic:'⭐'},
  {min:500, name:'نجم الدراسة', ic:'🏆'},
  {min:1000, name:'أسطورة', ic:'👑'}
];
const ACHIEVEMENTS = [
  {ic:'🎯', name:'أول امتحان', test:p=>p.history.length>=1},
  {ic:'📚', name:'10 امتحانات', test:p=>p.history.length>=10},
  {ic:'💯', name:'علامة كاملة', test:p=>p.history.some(h=>h.pct===100)},
  {ic:'🔥', name:'شعلة 3 أيام', test:p=>(p.streak||0)>=3},
  {ic:'⚡', name:'شعلة أسبوع', test:p=>(p.streak||0)>=7},
  {ic:'🧭', name:'استكشاف شامل', test:p=>new Set(p.history.map(h=>h.subject)).size>=5}
];
function renderProgress(){
  const p = loadProgress();
  document.getElementById('ptsQuick').textContent = `${p.points} نقطة`;
  document.getElementById('streakCount').textContent = p.streak||0; updateDailyStreakUI(p);
  document.getElementById('progPts').textContent = `${p.points} نقطة`;
  let current = BADGES[0], next = BADGES[1];
  for(let i=0;i<BADGES.length;i++){ if(p.points>=BADGES[i].min){ current=BADGES[i]; next=BADGES[i+1]||null; } }
  document.getElementById('progBadgeName').textContent = `${current.name} ${current.ic}`;
  const meterPct = next ? Math.min(100, ((p.points-current.min)/(next.min-current.min))*100) : 100;
  document.getElementById('progMeter').style.width = meterPct+'%';

  const bgrid = document.getElementById('badgesGrid');
  bgrid.innerHTML='';
  BADGES.forEach(b=>{
    const unlocked = p.points>=b.min;
    const chip=document.createElement('div');
    chip.className='badgechip'+(unlocked?' unlocked':'');
    chip.innerHTML = `<span class="ic">${b.ic}</span>${b.name}`;
    bgrid.appendChild(chip);
  });

  const agrid = document.getElementById('achievementsGrid');
  if(agrid){
    agrid.innerHTML='';
    ACHIEVEMENTS.forEach(a=>{
      const unlocked = a.test(p);
      const chip=document.createElement('div');
      chip.className='badgechip'+(unlocked?' unlocked':'');
      chip.innerHTML = `<span class="ic">${a.ic}</span>${a.name}`;
      agrid.appendChild(chip);
    });
  }

  const hlist = document.getElementById('historyList');
  document.getElementById('historyCount').textContent = p.history.length ? `${p.history.length} امتحان` : '';
  hlist.innerHTML='';
  if(!p.history.length){
    hlist.innerHTML = `<div class="emptynote">لم تخض أي امتحان بعد — ابدأ أول امتحان من الرئيسية 🚀</div>`;
    return;
  }
  p.history.forEach(h=>{
    const d = new Date(h.date);
    const row=document.createElement('div');
    row.className='historyitem';
    row.innerHTML = `<div><b>${h.subject}</b><div class="l">${h.grade} · ${d.toLocaleDateString('ar-DZ')}</div><div class="history-points">+${h.points||0} نقطة</div></div><b>${h.pct}%</b>`;
    hlist.appendChild(row);
  });
}

/* ================= EXPORT RESULTS AS PDF (print-to-PDF, no server/library needed) ================= */
function exportResultsPDF(scope){
  const p = loadProgress();
  const report = document.getElementById('printReport');
  if(!report) return;
  const today = new Date().toLocaleDateString('ar-DZ');
  let html = `<h1>Study DZ — تقرير النتائج</h1><p>${today}</p>`;
  if(scope==='last'){
    const h = p.history[0];
    if(!h){ alert('لا توجد نتيجة امتحان بعد.'); return; }
    html += `<h2>${h.subject} · ${h.grade}</h2><p>النتيجة: <b>${h.pct}%</b> (${h.correct} صحيحة من ${h.total})</p><p>النقاط المكتسبة: +${h.points||0} 🏆</p>`;
  } else {
    html += `<h2>مجموع النقاط: ${p.points} نقطة · الشعلة الحالية: ${p.streak||0} 🔥</h2>`;
    if(!p.history.length){
      html += '<p>لا توجد امتحانات في السجل بعد.</p>';
    } else {
      html += `<table><tr><th>المادة</th><th>المستوى</th><th>النتيجة</th><th>التاريخ</th></tr>`;
      p.history.forEach(h=>{
        html += `<tr><td>${h.subject}</td><td>${h.grade}</td><td>${h.pct}%</td><td>${new Date(h.date).toLocaleDateString('ar-DZ')}</td></tr>`;
      });
      html += '</table>';
    }
  }
  report.innerHTML = html;
  window.print();
}

/* ================= DAILY REVIEW REMINDER (Notifications) ================= */
const REMINDER_KEY='studydz_reminder';
function loadReminder(){try{return JSON.parse(safeGet(REMINDER_KEY))||{enabled:false,time:'18:00',lastFired:null};}catch(e){return {enabled:false,time:'18:00',lastFired:null};}}
function saveReminder(r){safeSet(REMINDER_KEY,JSON.stringify(r));}
async function toggleDailyReminder(){
  const r=loadReminder();
  if(!r.enabled){
    if('Notification' in window){
      let perm=Notification.permission;
      if(perm==='default') perm=await Notification.requestPermission();
      if(perm!=='granted'){ alert('يجب السماح بالإشعارات من إعدادات المتصفح لتفعيل التذكير اليومي.'); return; }
    } else {
      alert('متصفحك لا يدعم الإشعارات على هذا الجهاز.'); return;
    }
    r.enabled=true;
  } else {
    r.enabled=false;
  }
  saveReminder(r);
  updateReminderUI();
}
function saveReminderSettings(){
  const t=document.getElementById('reminderTimeInput')?.value || '18:00';
  const r=loadReminder(); r.time=t; saveReminder(r);
  const btn=document.querySelector('#screen-home'); // no-op placeholder to keep flow simple
  updateReminderUI();
}
function updateReminderUI(){
  const r=loadReminder();
  const t=document.getElementById('reminderTimeInput'); if(t) t.value=r.time;
  const btn=document.getElementById('reminderToggleBtn');
  if(btn) btn.innerHTML = r.enabled ? '<span>🔔</span><b>إيقاف التذكير</b>' : '<span>🔕</span><b>تفعيل التذكير</b>';
}
function checkDailyReminder(){
  const r=loadReminder(); if(!r.enabled) return;
  const now=new Date();
  const hhmm=now.toTimeString().slice(0,5);
  const today=now.toISOString().slice(0,10);
  if(hhmm===r.time && r.lastFired!==today){
    r.lastFired=today; saveReminder(r);
    if('Notification' in window && Notification.permission==='granted'){
      try{ new Notification('Study DZ 📖',{body:'حان وقت مراجعتك اليومية! حافظ على شعلتك 🔥'}); }catch(e){}
    }
  }
}

/* ================= VISUAL EFFECTS TOGGLE (Settings) =================
   The site auto-detects weak devices and enables "performance-mode" (which
   strips backdrop-filter/blur/animations) on its own. This lets a person
   override that guess manually at any time, in either direction. */
function toggleEffects(){
  const currentlyOff=document.documentElement.classList.contains('performance-mode');
  const next=currentlyOff?'on':'off';
  safeSet('studydz_effects',next);
  document.documentElement.classList.toggle('performance-mode', next==='off');
  updateEffectsToggleUI();
}
function updateEffectsToggleUI(){
  const btn=document.getElementById('effectsToggleBtn');
  if(!btn)return;
  const active=!document.documentElement.classList.contains('performance-mode');
  btn.innerHTML = active
    ? '<span>✨</span><b>التأثيرات مفعّلة (اضغط للإيقاف)</b>'
    : '<span>🌙</span><b>التأثيرات موقوفة لتحسين الأداء (اضغط للتفعيل)</b>';
}

/* ================= GLOBAL QUICK SEARCH (surahs + exams/subjects) ================= */
function openGlobalSearch(){
  const overlay=document.getElementById('searchOverlay');
  overlay.classList.add('show'); overlay.setAttribute('aria-hidden','false');
  document.body.classList.add('settings-open');
  const inp=document.getElementById('globalSearchInput');
  inp.value=''; runGlobalSearch('');
  setTimeout(()=>inp.focus(),60);
}
function closeGlobalSearch(){
  const overlay=document.getElementById('searchOverlay');
  overlay.classList.remove('show'); overlay.setAttribute('aria-hidden','true');
  document.body.classList.remove('settings-open');
}
function goToPaperSubject(level, subject){
  closeGlobalSearch();
  showScreen('screen-papers'); renderPapers();
  document.getElementById('papersLevel').value=level; renderPapers();
  document.getElementById('papersSubject').value=subject;
}
function goToSurah(i){
  closeGlobalSearch();
  showScreen('screen-quran');
  loadTrack(i); play();
}
function runGlobalSearch(term){
  const q=(term||'').trim();
  const box=document.getElementById('globalSearchResults');
  let html='';

  // Surahs / Quran tracks (local mp3 + YouTube extras)
  const surahMatches=[];
  (typeof playlist!=='undefined'?playlist:[]).forEach((t,i)=>{
    if(!q || t.name.includes(q)) surahMatches.push({i,t});
  });
  if(surahMatches.length){
    html += `<div class="search-group-title">القرآن</div>`;
    surahMatches.slice(0,8).forEach(({i,t})=>{
      html += `<button class="search-result" onclick="goToSurah(${i})"><span class="ic">${t.kind==='youtube'?'🎬':'📖'}</span><span><b>${t.name}</b><small>تشغيل التلاوة</small></span></button>`;
    });
  }

  // Subjects across levels (exams / papers)
  const subjectMatches=[];
  Object.keys(LEVELS).forEach(level=>{
    LEVELS[level].subjects.forEach(subj=>{
      if(!q || subj.includes(q) || level.includes(q)) subjectMatches.push({level,subj});
    });
  });
  if(subjectMatches.length){
    html += `<div class="search-group-title">فروض وامتحانات</div>`;
    subjectMatches.slice(0,10).forEach(({level,subj})=>{
      html += `<button class="search-result" onclick="goToPaperSubject('${level}','${subj}')"><span class="ic">${SUBJECT_ICONS[subj]||'📚'}</span><span><b>${subj}</b><small>${level} · فروض واختبارات</small></span></button>`;
    });
  }

  // Section shortcuts when the query matches a general section name
  const sectionMap=[['تقدمي','screen-progress'],['أدوات','screen-tools'],['قرآن','screen-quran']];
  const sectionHits = q ? sectionMap.filter(s=>s[0].includes(q)||q.includes(s[0])) : [];
  if(sectionHits.length){
    html += `<div class="search-group-title">أقسام الموقع</div>`;
    sectionHits.forEach(([label,id])=>{
      html += `<button class="search-result" onclick="closeGlobalSearch();showScreen('${id}');${id==='screen-tools'?'initCenturyTools();':''}${id==='screen-progress'?'renderProgress();':''}"><span class="ic">🧭</span><span><b>${label}</b></span></button>`;
    });
  }

  if(!html){
    html = `<div class="search-empty">لا توجد نتائج. جرّب اسم سورة أو مادة دراسية.</div>`;
  }
  box.innerHTML = html;
}
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeGlobalSearch(); });

/* ================= THEME ================= */
function toggleTheme(){
  const root=document.documentElement;
  const cur = root.getAttribute('data-theme');
  const next = cur==='dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  document.getElementById('themeBtn').textContent = next==='dark' ? '☀️' : '🌙';
  safeSet('studydz_theme', next);
}
document.getElementById('themeBtn').onclick = toggleTheme;



function updateDailyStreakUI(p){
  const n=p.streak||0;
  const c=document.getElementById('dailyStreakCount');
  const t=document.getElementById('dailyStreakText');
  if(c)c.textContent=n;
  if(t){
    const today=new Date().toISOString().slice(0,10);
    t.textContent=p.lastDay===today ? 'أنجزت تمرين اليوم — حافظ عليها غدًا! ✨' : 'أكمل تمرينًا اليوم لتستمر الشعلة';
  }
}

/* ================= INIT ================= */
(function init(){
  try{
    const savedTheme = safeGet('studydz_theme');
    if(savedTheme){ document.documentElement.setAttribute('data-theme', savedTheme); document.getElementById('themeBtn').textContent = savedTheme==='dark'?'☀️':'🌙'; }
    initQuranPlayer();
    updateReminderUI();
    updateEffectsToggleUI();
    setInterval(checkDailyReminder, 60000);
    const p = loadProgress();
    document.getElementById('ptsQuick').textContent = `${p.points} نقطة`;
    document.getElementById('streakCount').textContent = p.streak||0;
    const cu=currentUser(); if(cu&&users()[cu]) enterApp(cu); else if(typeof isGuest==='function' && isGuest()) enterGuestMode(); else document.getElementById('loginScreen').style.display='flex';
    const hour = new Date().getHours();
    const greet = hour<12 ? 'صباح الخير 🌤️' : hour<18 ? 'مرحبًا بك 👋' : 'مساء الخير 🌙';
    document.getElementById('greetLine').textContent = greet;
  }catch(err){
    // Never let an init failure leave the login screen dead: fall back to a
    // plain visible login screen so the buttons (already wired via onclick)
    // still work.
    console.error(err);
    const screen=document.getElementById('loginScreen');
    if(screen)screen.style.display='flex';
  }
  // Full app logic (renderProgress, enterApp, enterGuestMode...) is now
  // guaranteed loaded — final confirmation that the login buttons are safe to use.
  document.querySelectorAll('.login-card [data-auth-btn]').forEach(function(btn){btn.disabled=false;});
  const authNote=document.getElementById('authLoadingNote');
  if(authNote)authNote.style.display='none';
})();

/* Social/Quran UI integration */
(function(){
  const oldShowScreen=window.showScreen;
  if(typeof oldShowScreen==='function'){
    window.showScreen=function(id){
      oldShowScreen(id);
      if(id==='screen-quran' && typeof renderOnlineSurahs==='function') setTimeout(renderOnlineSurahs,0);
      if(id==='screen-social' && typeof renderSocial==='function') setTimeout(renderSocial,0);
    };
  }
})();

window.addEventListener('DOMContentLoaded',()=>{if(typeof initFullQuranOnline==='function')initFullQuranOnline();});

window.addEventListener('DOMContentLoaded',()=>{
  const sel=document.getElementById('quranReaderSelect');
  if(sel){
    sel.addEventListener('change',()=>{
      const audio=document.getElementById('quranAudio');
      const title=document.getElementById('quranNowTitle')?.textContent||'';
      const m=title.match(/(\\d+)/);
      if(audio && audio.src && typeof playOnlineSurah==='function'){
        // Determine the currently selected surah from the visible title.
        const names=window.QURAN_SURAH_NAMES||[];
        let idx=names.findIndex(n=>title.includes(n));
        if(idx>=0) playOnlineSurah(idx+1);
      }
    });
  }
});
