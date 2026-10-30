const $=s=>document.querySelector(s), $=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const state={lessons:[],cases:[],scams:[],checklist:[],ipos:[],currentScam:0,quiz:[],buildInfo:{build_date:"not recorded"}};
const safeStorageGet=(key,fallback=null)=>{try{const value=localStorage.getItem(key);return value===null?fallback:value}catch{return fallback}};
const safeStorageSet=(key,value)=>{try{localStorage.setItem(key,value);return true}catch{return false}};
const safeStorageRemove=key=>{try{localStorage.removeItem(key);return true}catch{return false}};
const shuffledQuestion=q=>IPOLogic.shuffleQuestion(q);
async function json(path){const r=await fetch(path);if(!r.ok)throw new Error("Could not load "+path);return r.json()}
const money=n=>"₹"+Number(n).toLocaleString("en-IN",{maximumFractionDigits:2})+" crore";
async function boot(){
 const [a,c,s,g,i,sources,policy,buildInfo]=await Promise.all([
  json("data/academy.json"),json("data/cases.json"),json("data/scams.json"),json("data/checklist.json"),
  json("data/ipo_records.json"),json("data/source_registry.json"),json("data/regulatory_policy.json"),
  json("data/build-info.json").catch(()=>({build_date:"not recorded"}))
 ]);
 state.lessons=a.modules;state.cases=c.cases;state.scams=s.items;state.checklist=g.items;state.ipos=i.records;state.buildInfo=buildInfo;
 renderIPO();renderAcademy();renderCases();renderScams(s);renderChecklist();renderGChecklist();renderSources(sources);wireResearch();wireToolTabs();wireD1();wireD2();wireD3();wireQuiz();wireTheme();wireToolJumps();
 $("#footer-date").textContent="BUILT · "+(buildInfo.build_date||"date not recorded");
}
function renderIPO(){
 const search=$("#ipo-search"),board=$("#ipo-board"),status=$("#ipo-status"),host=$("#ipo-results");
 const populate=(select,key,label)=>{
  const counts=new Map();
  state.ipos.forEach(r=>{const v=r[key];if(v)counts.set(v,(counts.get(v)||0)+1)});
  const current=select.value;
  select.innerHTML=`<option value="">All ${label}</option>`+[...counts.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([v,n])=>`<option value="${esc(v)}">${esc(v.replace(/(^|[-_ ])\w/g,x=>x.toUpperCase()))} (${n})</option>`).join("");
  if(counts.has(current))select.value=current;
  select.hidden=counts.size===0;
 };
 populate(board,"board","boards");populate(status,"issue_status","statuses");
 function draw(){
  const rows=state.ipos.filter(x=>(!search.value||x.company_name.toLowerCase().includes(search.value.toLowerCase()))&&(!board.value||x.board===board.value)&&(!status.value||x.issue_status===status.value));
  if(!rows.length){host.className="empty-state";host.innerHTML=`<div class="empty-mark">⌕</div><h3>${state.ipos.length?"No matching issuer record":"No verified issuer records published yet"}</h3><p>Only records checked against official offer documents and exchange disclosures appear here. Missing records are not filled with estimates.</p>`;return}
  host.className="table-wrap";host.innerHTML=`<p class="record-count">${rows.length} of ${state.ipos.length} source-reviewed issuer record${state.ipos.length===1?"":"s"}</p><table><thead><tr><th>Company</th><th>Board</th><th>Status</th><th>Research status</th><th>Last checked</th><th>Documents</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.company_name)}</td><td>${esc(r.board)}</td><td>${esc(r.issue_status)}</td><td>${esc(r.research_status||"Source review pending")}</td><td>${esc(r.last_checked)}</td><td>${(r.documents||[]).map(d=>`<a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.type)}</a>`).join(" · ")}</td></tr>`).join("")}</tbody></table>`;
 }
 [search,board,status].forEach(x=>x.addEventListener("input",draw));draw();
}
function renderAcademy(){
 const host=$("#lesson-list"),view=$("#lesson-view"),search=$("#lesson-search"),priority=$("#lesson-priority");
 function draw(){
  const rows=state.lessons.filter(l=>(!search.value||l.title.toLowerCase().includes(search.value.toLowerCase())||l.id.toLowerCase().includes(search.value.toLowerCase()))&&(!priority.value||l.priority===priority.value));
  host.innerHTML=rows.map(l=>`<button data-id="${esc(l.id)}"><strong>Lesson ${String(l.number).padStart(2,"0")} · ${esc(l.title)}</strong><small>${esc(l.priority)}</small></button>`).join("");
  host.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>showLesson(b.dataset.id,b)));
 }
 function showLesson(id,btn){
  const l=state.lessons.find(x=>x.id===id);if(!l)return;
  const questions=l.quiz.map(shuffledQuestion);
  host.querySelectorAll("button").forEach(x=>x.classList.toggle("selected",x===btn));
  view.innerHTML=`<div class="eyebrow">LESSON ${String(l.number).padStart(2,"0")} / ${esc(l.priority).toUpperCase()}</div><h3>${esc(l.title)}</h3><p><b>In simple words</b><br>${esc(l.plain)}</p><h4>Relatable Indian example</h4><p>${esc(l.example)}</p><div class="lesson-diagram">${esc(l.diagram)}</div><h4>Formula / how to read it</h4><p>${esc(l.formula)}</p><h4>What you can infer</h4><p>${esc(l.can_infer)}</p><h4>What you cannot infer</h4><p>${esc(l.cannot_infer)}</p><h4>Authoritative source material</h4><p>${l.sources.map(s=>`<a target="_blank" rel="noopener" href="${esc(s.url)}">${esc(s.name)} ↗</a>`).join(" · ")}</p><div class="lesson-quiz"><div class="eyebrow">KNOWLEDGE CHECK · ${questions.length} QUESTIONS</div>${questions.map((q,n)=>`<div class="quiz-q"><b>${n+1}. ${esc(q.question)}</b><div>${q.options.map((o,j)=>`<button data-q="${n}" data-a="${j}">${esc(o)}</button>`).join("")}</div><div class="quiz-feedback" id="lesson-feedback-${n}" aria-live="polite"></div></div>`).join("")}</div>`;
  view.querySelectorAll(".quiz-q button").forEach(b=>b.addEventListener("click",()=>{
   const q=questions[Number(b.dataset.q)],a=Number(b.dataset.a),out=view.querySelector(`#lesson-feedback-${b.dataset.q}`);
   if(out.dataset.answered==="1")return;
   out.dataset.answered="1";
   out.textContent=(a===q.answer?"Correct. ":"Not quite. ")+q.explanation;
   out.style.color=a===q.answer?"var(--feedback-good)":"var(--feedback-bad)";
   b.setAttribute("aria-pressed","true");
  }));
 }
 search.addEventListener("input",draw);priority.addEventListener("change",draw);draw();
}
function renderCases(){
 $("#case-grid").innerHTML=state.cases.map(c=>`<article class="case-card"><span class="year">${esc(c.year)} · SOURCE-LINKED EXAMPLE</span><h3>${esc(c.name)}</h3><p>${esc(c.theme)}</p><small>${esc(c.status)}</small><ul>${c.items_to_verify.slice(0,3).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>${(c.sources||[]).map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a>`).join(" · ")}</article>`).join("");
}
function renderScams(data){
 $("#scam-library").innerHTML=state.scams.map(s=>`<article class="scam-card"><small>${esc(s.scenario_type)}</small><h3>${esc(s.title)}</h3><div class="claim">${esc(s.claim)}</div><p><b>Reality:</b> ${esc(s.reality)}</p><p><b>Safer action:</b> ${esc(s.action)}</p></article>`).join("");
 $("#help-links").innerHTML=data.official_help.map(h=>`<a href="${esc(h.url)}" target="_blank" rel="noopener">${esc(h.label)} ↗</a><span>${esc(h.description)}</span>`).join("");
 renderScamChallenge();
}
function renderScamChallenge(){
 const s=state.scams[state.currentScam%state.scams.length],host=$("#scam-challenge");
 const challenge=s.challenge;
 if(!challenge||!Array.isArray(challenge.options)){host.textContent="A challenge for this scenario is not available yet.";return}
 const options=IPOLogic.shuffleItems(challenge.options);
 host.innerHTML=`<div class="scam-case"><small>FICTIONAL SCENARIO ${state.currentScam%state.scams.length+1} / ${state.scams.length}</small><p><b>Message received:</b> ${esc(s.claim)}</p><p>Which response is safest?</p>${options.map(o=>`<button data-choice="${esc(o[0])}">${esc(o[1])}</button>`).join("")}<div class="quiz-feedback" id="scam-feedback" aria-live="polite"></div><button id="scam-next" class="link-button">Next scenario →</button></div>`;
 host.querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>{
  const correct=b.dataset.choice===challenge.correct,out=$("#scam-feedback");
  if(out.dataset.answered==="1")return;
  out.dataset.answered="1";
  out.textContent=(correct?"Correct. ":"Not quite. ")+challenge.explanation+" "+s.action;
  out.style.color=correct?"var(--feedback-good)":"var(--feedback-bad)";
 }));
 $("#scam-next").addEventListener("click",()=>{state.currentScam++;renderScamChallenge()});
}
function renderChecklist(){
 let saved={};try{saved=JSON.parse(safeStorageGet("ipoRealityChecklist","{}")||"{}")}catch{}
 const host=$("#checklist-list");
 host.innerHTML=state.checklist.map(x=>`<div class="check-row"><div><b>${esc(x.title)}</b><small>${esc(x.rhp_section)} · ${esc(x.what_to_check)}</small></div><select data-check="${esc(x.id)}" aria-label="Status for ${esc(x.title)}"><option value="review">Needs review</option><option value="verified">Verified</option><option value="missing">Missing</option></select></div>`).join("");
 host.querySelectorAll("select").forEach(s=>{s.value=saved[s.dataset.check]||"review";s.addEventListener("change",()=>{const all={};host.querySelectorAll("select").forEach(v=>all[v.dataset.check]=v.value);safeStorageSet("ipoRealityChecklist",JSON.stringify(all));updateChecklistProgress()})});
 $("#checklist-reset").addEventListener("click",()=>{safeStorageRemove("ipoRealityChecklist");host.querySelectorAll("select").forEach(x=>x.value="review");updateChecklistProgress()});
 updateChecklistProgress();
}
function updateChecklistProgress(){
 const vals=$$("#checklist-list select").map(x=>x.value),v=vals.filter(x=>x==="verified").length,m=vals.filter(x=>x==="missing").length;
 $("#checklist-progress").textContent=`${v} verified · ${m} missing · ${vals.length-v-m} needs review · ${vals.length} items`;
}
function renderGChecklist(){
 $("#g-checklist").innerHTML=state.checklist.map((x,i)=>`<article class="g-item"><span>${String(i+1).padStart(2,"0")}</span><div><b>${esc(x.title)}</b><small><strong>${esc(x.rhp_section)}:</strong> ${esc(x.what_to_check)}</small></div></article>`).join("");
}
function renderSources(data){
 const preferred=["SEBI","NSE","BSE","ISSUER","REGISTRAR","MONITORING"];
 const rows=preferred.map(id=>data.sources.find(s=>s.id===id)).filter(Boolean);
 $("#source-list").innerHTML=rows.map(s=>`<article class="competitor"><div><b>${esc(s.name)}</b></div><p>${esc(s.role)}</p><p>${(s.links||[]).slice(0,4).map(link=>`<a href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.label)} ↗</a>`).join(" · ")}</p></article>`).join("");
}
function wireResearch(){
 const detail=$("#research-detail");
 const labels={
  money:["MONEY TRAIL","Follow the proceeds","Separate fresh issue from OFS, then trace the issuer's stated use of net proceeds against later reported utilisation."],
  ledger:["PROCEEDS ACCOUNTABILITY","Keep the original allocation visible","Compare the offer-document baseline with every reported utilisation snapshot and source reference."],
  clock:["DEPLOYMENT TIMELINE","Compare disclosed plans with reported progress","Only assign a schedule interpretation where a dated deployment milestone is disclosed."],
  seller:["SELLER DISCLOSURES","Who received OFS proceeds?","Review selling shareholders, quantities and weighted-average acquisition cost using the stated basis."]
 };
 const value=x=>x===null||x===undefined||x===""?"Not available":"₹"+Number(x).toLocaleString("en-IN",{maximumFractionDigits:3})+" cr";
 const findDoc=(record,id)=>Array.isArray(record?.documents)?record.documents.find(d=>d.id===id):null;
 const docLink=(record,evidence)=>{
  if(!evidence||!evidence.document_id)return "Source reference not recorded";
  const d=findDoc(record,evidence.document_id);if(!d)return "Source document not found in record";
  const page=evidence.page?(" · printed p. "+evidence.page):"";
  return `<a target="_blank" rel="noopener" href="${esc(d.url)}">${esc(d.title)}${page} ↗</a>`;
 };
 function renderExtra(key,record){
  if(!record)return "";
  if(key==="money"){
   const m=record.money_flow;if(!m)return "<p>Issue-structure data is not present for this issuer.</p>";
   return `<div class="research-evidence"><h4>Issuer issue structure</h4><div class="research-stats"><div><small>Total issue</small><b>${value(m.gross_proceeds_inr_crore)}</b></div><div><small>Fresh issue → company</small><b>${value(m.fresh_issue_inr_crore)}</b></div><div><small>OFS → sellers</small><b>${value(m.ofs_inr_crore)}</b></div><div><small>Net fresh-issue proceeds</small><b>${value(m.net_proceeds_inr_crore)}</b></div></div><p class="fine-print">${docLink(record,m.evidence)}</p></div>`;
  }
  if(key==="ledger"){
   const objects=Array.isArray(record.objects_of_issue)?record.objects_of_issue:[];
   const rows=objects.flatMap(o=>{
    const reports=Array.isArray(o.reports)?o.reports:[];
    if(!reports.length)return [`<tr><td>${esc(o.name||o.id)}</td><td>${value(o.baseline_allocation_inr??o.rhp_allocation_inr)}</td><td colspan="3">No monitoring report entered for this object.</td></tr>`];
    return reports.map(r=>{
     const u=r.utilisation||{};
     return `<tr><td>${esc(o.name||o.id)}</td><td>${value(o.baseline_allocation_inr??o.rhp_allocation_inr)}</td><td>${value(u.cumulative_used_inr)}</td><td>${value(u.unspent_inr)}</td><td>${esc(r.reporting_period_end||r.quarter||"Period not recorded")} · ${docLink(record,u.evidence)}</td></tr>`;
    });
   }).join("");
   return `<div class="research-evidence"><h4>Reported proceeds utilisation</h4>${objects.length?`<div class="table-wrap"><table><thead><tr><th>Use of proceeds</th><th>Offer allocation</th><th>Reported cumulative use</th><th>Reported unspent</th><th>Reporting period and evidence</th></tr></thead><tbody>${rows}</tbody></table></div>`:"<p>No use-of-proceeds objects have been entered for this issuer.</p>"}<p class="fine-print">The original offer-document allocation remains the baseline. Each report is shown as a separate reporting-period snapshot; a missing report is not treated as zero utilisation.</p>${record.monitoring_agency_scope?`<p class="fine-print"><b>Monitoring-agency limitation:</b> ${esc(record.monitoring_agency_scope.text)} ${docLink(record,record.monitoring_agency_scope.evidence)}</p>`:""}</div>`;
  }
  if(key==="clock"){
   const objects=Array.isArray(record.objects_of_issue)?record.objects_of_issue:[];
   const rows=objects.flatMap(o=>{
    const schedule=o.schedule||{},milestones=Array.isArray(schedule.milestones)?schedule.milestones:[];
    const reports=Array.isArray(o.reports)?o.reports:[];
    if(schedule.status==="not_disclosed"||!milestones.length){
     return [`<tr><td>${esc(o.name||o.id)}</td><td>No schedule disclosed</td><td>${reports.length?reports.map(r=>esc(r.reporting_period_end||r.quarter||"Period not recorded")+" · "+value(r.utilisation?.cumulative_used_inr)).join("<br>"):"No report recorded"}</td><td>No ahead/on-time/behind verdict can be assigned.</td></tr>`];
    }
    return milestones.map(m=>{
     const reportText=reports.length?reports.map(r=>esc(r.reporting_period_end||r.quarter||"Period not recorded")+" · "+value(r.utilisation?.cumulative_used_inr)).join("<br>"):"No report recorded";
     return `<tr><td>${esc(o.name||o.id)}</td><td>${esc(m.period||m.due_date||"Milestone not dated")} · ${value(m.planned_cumulative_inr)} · ${docLink(record,m.evidence)}</td><td>${reportText}</td><td>Compare only after matching the report date and schedule basis.</td></tr>`;
    });
   }).join("");
   return `<div class="research-evidence"><h4>Disclosed deployment schedule and reports</h4>${objects.length?`<div class="table-wrap"><table><thead><tr><th>Object</th><th>Disclosed schedule</th><th>Reported cumulative use</th><th>Interpretation</th></tr></thead><tbody>${rows}</tbody></table></div>`:"<p>No issue objects have been entered for this issuer.</p>"}<p class="fine-print">An annual schedule must not be judged using an incomparable interim snapshot. Missing schedules remain unclassified.</p></div>`;
  }
  if(key==="seller"){
   const sellers=Array.isArray(record.sellers)?record.sellers:[];
   if(!sellers.length)return "<div class='research-evidence'><p>No selling-shareholder records are available for this issuer.</p></div>";
   const rows=sellers.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.type)}</td><td>${Number(x.shares_offered||0).toLocaleString("en-IN")}</td><td>₹${Number(x.waca).toFixed(2)}</td><td>${esc(x.waca_basis||"Basis not recorded")}</td></tr>`).join("");
   return `<div class="research-evidence"><h4>Prospectus seller disclosures</h4><div class="table-wrap"><table><thead><tr><th>Seller</th><th>Type</th><th>Shares offered</th><th>WACA</th><th>Basis</th></tr></thead><tbody>${rows}</tbody></table></div>${sellers.map(x=>x.multiple_caveat?`<p class="fine-print">${esc(x.multiple_caveat)} ${docLink(record,x.evidence)}</p>`:"").join("")}</div>`;
  }
  return "";
 }
 function openPanel(key){
  const label=labels[key];if(!label)return;
  const initial=state.ipos[0];
  const make=record=>{
   const selector=state.ipos.length>1?`<label class="issuer-select-label" for="research-issuer">Issuer <select id="research-issuer">${state.ipos.map(r=>`<option value="${esc(r.id)}" ${record?.id===r.id?"selected":""}>${esc(r.company_name)}</option>`).join("")}</select></label>`:`<p class="fine-print"><b>Issuer:</b> ${esc(record?.company_name||"No source-reviewed issuer selected")}</p>`;
   detail.hidden=false;
   detail.innerHTML=`${selector}<small class="eyebrow">${esc(label[0])}</small><h3>${esc(label[1])}</h3><p>${esc(label[2])}</p>${renderExtra(key,record)}<p class="fine-print"><b>Coverage note:</b> only issuer records present in the dataset are shown. Missing information is not inferred.</p>`;
   const select=$("#research-issuer");if(select)select.addEventListener("change",()=>make(state.ipos.find(r=>r.id===select.value)));
  };
  make(initial);
  detail.scrollIntoView({behavior:"smooth",block:"nearest"});
 }
 $$("[data-open]").forEach(b=>b.addEventListener("click",()=>openPanel(b.dataset.open)));
}
function wireToolTabs(){
 const tabs=$(".tool-tabs button"),panels=$(".tool-panel"),list=$(".tool-tabs");
 list.setAttribute("role","tablist");
 function activate(tab,focus=false){
  tabs.forEach((b,i)=>{
   const active=b===tab;b.setAttribute("role","tab");b.id="tab-"+b.dataset.tool;
   b.setAttribute("aria-selected",String(active));b.tabIndex=active?0:-1;b.classList.toggle("active",active);
   const panel=panels.find(p=>p.id==="tool-"+b.dataset.tool);
   if(panel){panel.setAttribute("role","tabpanel");panel.setAttribute("aria-labelledby",b.id);panel.hidden=!active;panel.classList.toggle("active",active);}
  });
  if(focus)tab.focus();
 }
 tabs.forEach((b,i)=>{
  b.addEventListener("click",()=>activate(b));
  b.addEventListener("keydown",e=>{
   let next=null;
   if(e.key==="ArrowRight")next=tabs[(i+1)%tabs.length];
   if(e.key==="ArrowLeft")next=tabs[(i-1+tabs.length)%tabs.length];
   if(e.key==="Home")next=tabs[0];
   if(e.key==="End")next=tabs[tabs.length-1];
   if(next){e.preventDefault();activate(next,true);}
  });
 });
 activate(tabs.find(b=>b.classList.contains("active"))||tabs[0]);
}
function wireToolJumps(){
 $("[data-jump-tool]").forEach(b=>b.addEventListener("click",()=>{
  const target=$(`.tool-tabs button[data-tool="${b.dataset.jumpTool}"]`);
  if(target){target.click();$("#tools").scrollIntoView({behavior:"smooth",block:"start"});}
 }));
}
function wireD1(){
 const t=$("#d1-total"),f=$("#d1-fresh");
 const draw=()=>{const total=+t.value,p=+f.value,fa=total*p/100,ofs=total-fa;$("#d1-total-label").textContent=money(total);$("#d1-fresh-label").textContent=p+"%";$("#d1-fresh-value").textContent=money(fa);$("#d1-ofs-value").textContent=money(ofs);$("#d1-fresh-bar").style.width=p+"%";$("#d1-ofs-bar").style.width=(100-p)+"%"};
 t.addEventListener("input",draw);f.addEventListener("input",draw);draw();
}
function wireD2(){
 const run=()=>{
  const offered=Number($("#d2-offer").value),floor=Number($("#d2-floor").value),cap=Number($("#d2-cap").value),out=$("#d2-output");
  const book=IPOLogic.buildDemandCurve(offered,floor,cap);
  if(book.error){out.innerHTML=`<p class="input-error">${esc(book.error)}</p>`;return}
  const status=book.undersubscribed
   ?`<p class="book-status warning"><b>Undersubscribed at every price.</b> Maximum cumulative hypothetical demand (${book.totalDemand.toLocaleString("en-IN")}) is below ${offered.toLocaleString("en-IN")} shares offered. No cut-off price is calculated.</p>`
   :`<p class="book-status success"><b>Illustrative cut-off price: ₹${book.cutOff.toFixed(2)}</b> · Highest price where cumulative eligible demand reaches at least ${offered.toLocaleString("en-IN")} shares.</p>`;
  out.innerHTML=status+`<p class="fine-print">Price steps: ₹${book.step.toFixed(2)} · Demand is simulated for learning, not sourced from a live issue book.</p><div class="table-wrap"><table><thead><tr><th>Bid price</th><th>Hypothetical bids at this price</th><th>Eligible cumulative demand at this price or higher</th></tr></thead><tbody>${book.rows.map(r=>`<tr><td>₹${r.price.toFixed(2)}</td><td>${r.bidsAtPrice.toLocaleString("en-IN")}</td><td>${r.cumulative.toLocaleString("en-IN")}</td></tr>`).join("")}</tbody></table></div><small>This is a simplified teaching model, not the actual exchange book-building or allotment algorithm.</small>`;
 };
 $("#d2-run").addEventListener("click",run);run();
}
function wireD3(){
 const fields=["revenue","ebitda","pat","ocf","debt","equity","interest","ebit","average","capital","capex","receivables","inventory","cogs","current-assets","current-liabilities","market-cap","cash","book-equity"];
 const draw=()=>{
  const inputs=Object.fromEntries(fields.map(id=>[id,$("#f-"+id).value]));
  const items=IPOLogic.calculateFinancialMetrics(inputs);
  $("#finance-results").innerHTML=items.map(x=>`<div class="ratio"><small>${esc(x[0])}</small><b>${esc(x[1])}</b><em>${esc(x[2])}</em></div>`).join("");
 };
 fields.forEach(x=>$("#f-"+x).addEventListener("input",draw));draw();
}
function wireQuiz(){
 $("#quiz-start").addEventListener("click",()=>{
  const level=$("#quiz-level").value;
  state.quiz=IPOLogic.questionsForLevel(state.lessons,level,5);
  let at=0,score=0;
  const show=()=>{
   const host=$("#quiz-area");
   if(at>=state.quiz.length){host.innerHTML=`<h3>Quiz completed</h3><p>You answered ${score} of ${state.quiz.length} correctly. Review the explanations and the Academy lessons; this score is not an assessment of investment suitability.</p><button id="quiz-again" class="button primary">Try again</button>`;$("#quiz-again").addEventListener("click",()=>$("#quiz-start").click());return}
   const q=state.quiz[at];host.innerHTML=`<small class="eyebrow">${level.toUpperCase()} · QUESTION ${at+1} / ${state.quiz.length}</small><p><b>${esc(q.question)}</b></p><small>Lesson: ${esc(q.topic)}</small><div>${q.options.map((o,j)=>`<button class="quiz-option" data-a="${j}">${esc(o)}</button>`).join("")}</div><div id="quiz-feedback" class="quiz-feedback" aria-live="polite"></div>`;
   host.querySelectorAll(".quiz-option").forEach(b=>b.addEventListener("click",()=>{const out=$("#quiz-feedback");if(out.dataset.done)return;const ok=+b.dataset.a===q.answer;if(ok)score++;out.dataset.done="1";out.textContent=(ok?"Correct. ":"Not quite. ")+q.explanation;const next=document.createElement("button");next.className="link-button";next.textContent=at===state.quiz.length-1?"See result →":"Next question →";next.addEventListener("click",()=>{at++;show()});out.appendChild(next)}));
  };
  show();
 });
}
function wireTheme(){
 let dark=safeStorageGet("ipoRealityDark","1")!=="0";
 const button=$("#theme");
 const apply=()=>{document.body.classList.toggle("dark",dark);button.setAttribute("aria-pressed",String(dark));button.setAttribute("aria-label",dark?"Switch to light theme":"Switch to dark theme");};
 apply();
 button.addEventListener("click",()=>{dark=!dark;apply();safeStorageSet("ipoRealityDark",dark?"1":"0");});
}
boot().catch(e=>{console.error(e);document.body.insertAdjacentHTML("afterbegin",`<div style="padding:12px;background:#f6e9e7;color:#762">App data failed to load. Run through a local web server, not by opening index.html directly. ${esc(e.message)}</div>`)});
