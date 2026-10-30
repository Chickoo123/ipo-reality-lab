const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const state={lessons:[],cases:[],scams:[],checklist:[],ipos:[],currentScam:0,quiz:[]};
async function json(path){const r=await fetch(path);if(!r.ok)throw new Error("Could not load "+path);return r.json()}
const money=n=>"₹"+Number(n).toLocaleString("en-IN",{maximumFractionDigits:2})+" crore";
async function boot(){
 const [a,c,s,g,i,competitors,policy]=await Promise.all([
  json("data/academy.json"),json("data/cases.json"),json("data/scams.json"),json("data/checklist.json"),
  json("data/ipo_records.json"),json("data/competitor_matrix.json"),json("data/regulatory_policy.json")
 ]);
 state.lessons=a.modules;state.cases=c.cases;state.scams=s.items;state.checklist=g.items;state.ipos=i.records;
 renderIPO();renderAcademy();renderCases();renderScams(s);renderChecklist();renderGChecklist();renderCompetitors(competitors);renderPhases();wireResearch();wireToolTabs();wireD1();wireD2();wireD3();wireQuiz();wireTheme();
 $("#footer-date").textContent="BUILD · 30 OCT 2026";
}
function renderIPO(){
 const search=$("#ipo-search"),board=$("#ipo-board"),status=$("#ipo-status"),host=$("#ipo-results");
 function draw(){
  const rows=state.ipos.filter(x=>(!search.value||x.company_name.toLowerCase().includes(search.value.toLowerCase()))&&(!board.value||x.board===board.value)&&(!status.value||x.issue_status===status.value));
  if(!rows.length){host.className="empty-state";host.innerHTML=`<div class="empty-mark">⌕</div><h3>${state.ipos.length?"No matching verified IPO record":"No verified IPO records published yet"}</h3><p>Only records checked against official offer documents and exchange filings appear here. The database is intentionally empty rather than filled with estimates.</p>`;return}
  host.className="table-wrap";host.innerHTML=`<table><thead><tr><th>Company</th><th>Board</th><th>Status</th><th>Research status</th><th>Last checked</th><th>Documents</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.company_name)}</td><td>${esc(r.board)}</td><td>${esc(r.issue_status)}</td><td>${esc(r.research_status||"Source review pending")}</td><td>${esc(r.last_checked)}</td><td>${(r.documents||[]).map(d=>`<a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.type)}</a>`).join(" · ")}</td></tr>`).join("")}</tbody></table>`;
 }
 [search,board,status].forEach(x=>x.addEventListener("input",draw));draw();
}
function renderAcademy(){
 const host=$("#lesson-list"),view=$("#lesson-view"),search=$("#lesson-search"),priority=$("#lesson-priority");
 function draw(){
  const rows=state.lessons.filter(l=>(!search.value||l.title.toLowerCase().includes(search.value.toLowerCase())||l.id.toLowerCase().includes(search.value.toLowerCase()))&&(!priority.value||l.priority===priority.value));
  host.innerHTML=rows.map(l=>`<button data-id="${esc(l.id)}"><strong>${esc(l.id)} · ${esc(l.title)}</strong><small>${esc(l.priority)}</small></button>`).join("");
  host.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>showLesson(b.dataset.id,b)));
 }
 function showLesson(id,btn){
  const l=state.lessons.find(x=>x.id===id);if(!l)return;
  host.querySelectorAll("button").forEach(x=>x.classList.toggle("selected",x===btn));
  view.innerHTML=`<div class="eyebrow">${esc(l.id)} / ${esc(l.priority)} PRIORITY</div><h3>${esc(l.title)}</h3><p><b>In simple words</b><br>${esc(l.plain)}</p><h4>Relatable Indian example</h4><p>${esc(l.example)}</p><div class="lesson-diagram">${esc(l.diagram)}</div><h4>Formula / how to read it</h4><p>${esc(l.formula)}</p><h4>What you can infer</h4><p>${esc(l.can_infer)}</p><h4>What you cannot infer</h4><p>${esc(l.cannot_infer)}</p><h4>Authoritative source material</h4><p>${l.sources.map(s=>`<a target="_blank" rel="noopener" href="${esc(s.url)}">${esc(s.name)} ↗</a>`).join(" · ")}</p><div class="lesson-quiz"><div class="eyebrow">KNOWLEDGE CHECK</div>${l.quiz.map((q,n)=>`<div class="quiz-q"><b>${n+1}. ${esc(q.question)}</b><div>${q.options.map((o,j)=>`<button data-q="${n}" data-a="${j}">${esc(o)}</button>`).join("")}</div><div class="quiz-feedback" id="lesson-feedback-${n}" aria-live="polite"></div></div>`).join("")}</div>`;
  view.querySelectorAll(".quiz-q button").forEach(b=>b.addEventListener("click",()=>{
   const q=l.quiz[Number(b.dataset.q)],a=Number(b.dataset.a),out=view.querySelector(`#lesson-feedback-${b.dataset.q}`);
   out.textContent=(a===q.answer?"Correct. ":"Not quite. ")+q.explanation;
   out.style.color=a===q.answer?"#1e644b":"#9b5d4b";
  }));
 }
 search.addEventListener("input",draw);priority.addEventListener("change",draw);draw();
}
function renderCases(){
 $("#case-grid").innerHTML=state.cases.map(c=>`<article class="case-card"><span class="year">${esc(c.year)} · HISTORICAL CASE</span><h3>${esc(c.name)}</h3><p>${esc(c.theme)}</p><small>${esc(c.status)}</small><ul>${c.items_to_verify.slice(0,3).map(x=>`<li>${esc(x)}</li>`).join("")}</ul><a href="${esc(c.official_start||"https://www.sebi.gov.in/filings/public-issues.html")}" target="_blank" rel="noopener">Start with official filings ↗</a></article>`).join("");
}
function renderScams(data){
 $("#scam-library").innerHTML=state.scams.map(s=>`<article class="scam-card"><small>${esc(s.scenario_type)}</small><h3>${esc(s.title)}</h3><div class="claim">${esc(s.claim)}</div><p><b>Reality:</b> ${esc(s.reality)}</p><p><b>Safer action:</b> ${esc(s.action)}</p></article>`).join("");
 $("#help-links").innerHTML=data.official_help.map(h=>`<a href="${esc(h.url)}" target="_blank" rel="noopener">${esc(h.label)} ↗</a><span>${esc(h.description)}</span>`).join("");
 renderScamChallenge();
}
function renderScamChallenge(){
 const s=state.scams[state.currentScam%state.scams.length],host=$("#scam-challenge");
 host.innerHTML=`<div class="scam-case"><small>FICTIONAL SCENARIO ${state.currentScam%state.scams.length+1} / ${state.scams.length}</small><p><b>Message received:</b> ${esc(s.claim)}</p><p>What should you do?</p><button data-choice="safe">Treat it as a red flag and verify independently</button><button data-choice="trust">Trust it because it mentions an IPO</button><div class="quiz-feedback" id="scam-feedback" aria-live="polite"></div><button id="scam-next" class="link-button">Next scenario →</button></div>`;
 host.querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>{
  const safe=b.dataset.choice==="safe";$("#scam-feedback").textContent=(safe?"Correct. ":"Incorrect. ")+s.reality+" "+s.action;$("#scam-feedback").style.color=safe?"#1e644b":"#9b5d4b";
 }));
 $("#scam-next").addEventListener("click",()=>{state.currentScam++;renderScamChallenge()});
}
function renderChecklist(){
 let saved={};try{saved=JSON.parse(localStorage.getItem("ipoRealityChecklist")||"{}")}catch{}
 const host=$("#checklist-list");
 host.innerHTML=state.checklist.map(x=>`<div class="check-row"><div><b>${esc(x.title)}</b><small>${esc(x.rhp_section)} · ${esc(x.what_to_check)}</small></div><select data-check="${esc(x.id)}"><option value="review">Needs review</option><option value="verified">Verified</option><option value="missing">Missing</option></select></div>`).join("");
 host.querySelectorAll("select").forEach(s=>{s.value=saved[s.dataset.check]||"review";s.addEventListener("change",()=>{const all={};host.querySelectorAll("select").forEach(v=>all[v.dataset.check]=v.value);localStorage.setItem("ipoRealityChecklist",JSON.stringify(all));updateChecklistProgress()})});
 $("#checklist-reset").addEventListener("click",()=>{localStorage.removeItem("ipoRealityChecklist");host.querySelectorAll("select").forEach(x=>x.value="review");updateChecklistProgress()});
 updateChecklistProgress();
}
function updateChecklistProgress(){
 const vals=$$("#checklist-list select").map(x=>x.value),v=vals.filter(x=>x==="verified").length,m=vals.filter(x=>x==="missing").length;
 $("#checklist-progress").textContent=`${v} verified · ${m} missing · ${vals.length-v-m} needs review · ${vals.length} items`;
}
function renderGChecklist(){
 $("#g-checklist").innerHTML=state.checklist.map((x,i)=>`<article class="g-item"><span>${String(i+1).padStart(2,"0")}</span><div><b>${esc(x.title)}</b><small><strong>${esc(x.rhp_section)}:</strong> ${esc(x.what_to_check)}</small></div></article>`).join("");
}
function renderCompetitors(data){
 $("#competitor-matrix").innerHTML=data.matrix.map(c=>`<article class="competitor"><div><b>${esc(c.name)}</b></div><p><strong>${esc(c.overlap)}</strong><br>${esc(c.capabilities)}</p><p>${esc(c.implication)}<br><a href="${esc(c.url)}" target="_blank" rel="noopener">Public product/source page ↗</a></p></article>`).join("");
}
function renderPhases(){
 const phases=[
 ["PHASE 0 · FEASIBILITY","Research and legal checks","Competitor review, source terms, regulatory rule and data access gates.","INITIAL SNAPSHOT — RECHECKS OPEN"],
 ["PHASE 1 · MVP","Promise vs Proof","B1, B2, K1, K2; 10 IPOs; P0 lessons; D1 simulator.","DATA POPULATION PENDING"],
 ["PHASE 2","Seller and document diff","K3, K4; 25 IPOs; B3 Cash Reality Test.","PLANNED"],
 ["PHASE 3","Deeper learning","P1 Academy, D2, D3, D6 and case library.","PLANNED"],
 ["PHASE 4","Track and protect","P2 Academy, F, D4, D5, G, B4 and A tracker.","PLANNED"],
 ["PHASE 5","Audit and launch","Claude / ChatGPT / Gemini review, accessibility and final validation.","PLANNED"]
 ];
 $("#phase-grid").innerHTML=phases.map((p,i)=>`<article class="phase ${i===0?"current":""}"><span>${p[0]}</span><h3>${p[1]}</h3><p>${p[2]}</p><b>${p[3]}</b></article>`).join("");
}
function wireResearch(){
 const detail=$("#research-detail");
 const labels={
  money:["B1 / MONEY TRAIL","Follow the proceeds","The Money Trail separates fresh issue from OFS, then maps fresh-issue proceeds to the offer document's stated objects."],
  financial:["B3 / CASH REALITY TEST","Read the numbers, not a score","D3 is a hypothetical calculator. Issuer-specific B3 analysis requires the RHP's restated statements and peer-source validation."],
  sentiment:["B4 / SENTIMENT VS FUNDAMENTALS","Historical comparison only","This lens remains gated by the SEBI educational market-price data rule, source permissions and dated historical evidence."],
  ledger:["K1 / PROMISE VS PROOF","Keep the original allocation visible","Compare the offer-document baseline with the monitoring agency's reported cumulative utilisation. Each amount links to its source page."],
  clock:["K2 / PROCEEDS CLOCK","A schedule status needs a disclosed schedule","Compare disclosed deployment periods with actual utilisation. An interim report must not be labelled late merely because an annual target is not yet due."],
  seller:["K3 / SELLER'S LENS","Who received OFS proceeds?","Seller-level data is sourced from the prospectus. WACA basis and share quantity must remain visible."],
  diff:["K4 / DRAFT-TO-FINAL DIFF","What changed across the offer documents?","Compare DRHP, RHP and final prospectus with evidence on both sides. No reason for a change is inferred."]
 };
 const record=state.ipos.find(x=>x.id==="western-carriers-2024");
 const link=(docId)=>{const d=record?.documents?.find(x=>x.id===docId);return d?`<a target="_blank" rel="noopener" href="${esc(d.url)}">${esc(d.title)} ↗</a>`:""};
 function value(x){return "₹"+Number(x).toLocaleString("en-IN",{maximumFractionDigits:3})+" cr"}
 function moneyTable(){
  if(!record)return "";
  const m=record.money_flow;
  return `<div class="research-evidence"><h4>Source-reviewed example · Western Carriers (India) Limited</h4><div class="research-stats"><div><small>Total issue</small><b>${value(m.gross_proceeds_inr_crore)}</b></div><div><small>Fresh issue → company</small><b>${value(m.fresh_issue_inr_crore)}</b></div><div><small>OFS → promoter seller</small><b>${value(m.ofs_inr_crore)}</b></div><div><small>Net fresh-issue proceeds</small><b>${value(m.net_proceeds_inr_crore)}</b></div></div><p class="fine-print">Issue structure and offer price checked against the issuer-hosted prospectus, printed p. 1; net proceeds on printed p. 100. ${link("prospectus")}</p></div>`;
 }
 function ledgerTable(){
  if(!record)return "";
  const rows=record.objects_of_issue.map(o=>{
   const r=o.reports[0],u=r.utilisation;
   return `<tr><td>${esc(o.name)}</td><td>${value(o.baseline_allocation_inr ?? o.rhp_allocation_inr)}</td><td>${value(u.cumulative_used_inr)}</td><td>${value(u.unspent_inr)}</td><td>${esc(r.reporting_period_end)}</td></tr>`;
  }).join("");
  return `<div class="research-evidence"><h4>First report snapshot · 30 September 2024</h4><div class="table-wrap"><table><thead><tr><th>Use of proceeds</th><th>Offer-document allocation</th><th>Reported cumulative use</th><th>Reported unspent</th><th>As at</th></tr></thead><tbody>${rows}</tbody></table></div><p class="fine-print">Amounts converted from ₹ million to ₹ crore. Baseline figures are currently transcribed from the final prospectus (printed p. 100) and reproduced in the CRISIL monitoring report (printed p. 6); original RHP page-level cross-check is still pending. Utilisation references are from the report (printed p. 7). ${link("prospectus")} · ${link("monitor-q2-fy25")}</p><p class="fine-print"><b>Important caveat:</b> CRISIL states that it relied on information from issuer management and third parties and did not perform an audit or independent verification (report printed p. 12). A report's “no comments” is not an audit opinion.</p></div>`;
 }
 function clockTable(){
  if(!record)return "";
  const rows=record.objects_of_issue.map(o=>{
   const r=o.reports[0],u=r.utilisation;
   const periods=o.schedule.milestones.map(m=>`${esc(m.period)}: ${value(m.planned_cumulative_inr)}`).join("<br>");
   return `<tr><td>${esc(o.name)}</td><td>${periods}</td><td>${value(u.cumulative_used_inr)}</td><td>Interim snapshot — no ahead / on-time / behind label assigned</td></tr>`;
  }).join("");
  return `<div class="research-evidence"><h4>Disclosed annual schedule vs interim snapshot</h4><div class="table-wrap"><table><thead><tr><th>Object</th><th>Offer-document schedule</th><th>Reported use at 30 Sep 2024</th><th>Schedule interpretation</th></tr></thead><tbody>${rows}</tbody></table></div><p class="fine-print">The prospectus discloses fiscal-year deployment periods, while the monitoring report is an interim quarter snapshot. This build does not infer a delay from those differently timed observations. ${link("prospectus")} · ${link("monitor-q2-fy25")}</p></div>`;
 }
 function sellerTable(){
  if(!record)return "";
  const rows=record.sellers.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.type)}</td><td>${Number(x.shares_offered).toLocaleString("en-IN")}</td><td>₹${Number(x.waca).toFixed(2)}</td><td>${esc(x.waca_basis)}</td></tr>`).join("");
  return `<div class="research-evidence"><h4>Prospectus seller disclosure</h4><div class="table-wrap"><table><thead><tr><th>Seller</th><th>Type</th><th>Shares offered</th><th>WACA</th><th>Basis</th></tr></thead><tbody>${rows}</tbody></table></div><p class="fine-print">${link("prospectus")} — printed p. 1. K3 comparison across multiple IPOs remains Phase 2.</p></div>`;
 }
 $$("[data-open]").forEach(b=>b.addEventListener("click",()=>{
  const key=b.dataset.open,x=labels[key];
  let extra="";
  if(key==="money")extra=moneyTable();
  if(key==="ledger")extra=ledgerTable();
  if(key==="clock")extra=clockTable();
  if(key==="seller")extra=sellerTable();
  detail.hidden=false;
  detail.innerHTML=`<small class="eyebrow">${esc(x[0])}</small><h3>${esc(x[1])}</h3><p>${esc(x[2])}</p>${extra}<p class="fine-print"><b>Coverage status:</b> one initial evidence-backed issuer example has been entered. The 10-IPO MVP research target is not yet complete; the RHP page-level cross-check and additional issuer records remain outstanding.</p>`;
  detail.scrollIntoView({behavior:"smooth",block:"nearest"});
 }));
}
function wireToolTabs(){
 $$(".tool-tabs button").forEach(b=>b.addEventListener("click",()=>{$$(".tool-tabs button").forEach(x=>x.classList.toggle("active",x===b));$$(".tool-panel").forEach(x=>x.classList.toggle("active",x.id==="tool-"+b.dataset.tool))}));
}
function wireD1(){
 const t=$("#d1-total"),f=$("#d1-fresh");
 const draw=()=>{const total=+t.value,p=+f.value,fa=total*p/100,ofs=total-fa;$("#d1-total-label").textContent=money(total);$("#d1-fresh-label").textContent=p+"%";$("#d1-fresh-value").textContent=money(fa);$("#d1-ofs-value").textContent=money(ofs);$("#d1-fresh-bar").style.width=p+"%";$("#d1-ofs-bar").style.width=(100-p)+"%"};
 t.addEventListener("input",draw);f.addEventListener("input",draw);draw();
}
function wireD2(){
 const run=()=>{
  const offered=Math.max(1,+$("#d2-offer").value||1),floor=+$("#d2-floor").value,cap=+$("#d2-cap").value,out=$("#d2-output");
  if(!Number.isFinite(floor)||!Number.isFinite(cap)||cap<floor){out.textContent="Enter a valid price band: cap must be at least the floor.";return}
  const rows=[];let cumulative=0;
  for(let p=floor;p<=cap&&p-floor<50;p++){const demand=Math.round(offered*(.35+.25*(p-floor)/Math.max(1,cap-floor))*(1+(p-floor)/10));cumulative+=demand;rows.push({p,demand,cumulative})}
  const clearing=rows.find(x=>x.cumulative>=offered)||rows[rows.length-1];
  out.innerHTML=`<p><b>Simplified illustrative clearing level:</b> ₹${clearing.p} · Cumulative demand ${clearing.cumulative.toLocaleString("en-IN")} shares against ${offered.toLocaleString("en-IN")} offered.</p><table><thead><tr><th>Bid price</th><th>Demand</th><th>Cumulative demand</th></tr></thead><tbody>${rows.map(r=>`<tr><td>₹${r.p}</td><td>${r.demand.toLocaleString("en-IN")}</td><td>${r.cumulative.toLocaleString("en-IN")}</td></tr>`).join("")}</tbody></table><small>This is a simplified teaching model, not the actual exchange book-building or allotment algorithm.</small>`;
 };
 $("#d2-run").addEventListener("click",run);run();
}
function wireD3(){
 const fields=["revenue","ebitda","pat","ocf","debt","equity","interest","ebit","average","capital","capex","receivables","inventory","cogs","current-assets","current-liabilities","market-cap","cash","book-equity"];
 const read=id=>Number($("#f-"+id).value)||0;
 const pct=(a,b)=>b===0?null:a/b*100,format=x=>x===null?"N/A":x.toFixed(2)+"%";
 const draw=()=>{
  const rev=read("revenue"),ebitda=read("ebitda"),pat=read("pat"),ocf=read("ocf"),debt=read("debt"),equity=read("equity"),interest=read("interest"),ebit=read("ebit"),avg=read("average"),capital=read("capital"),capex=read("capex"),receivables=read("receivables"),inventory=read("inventory"),cogs=read("cogs"),ca=read("current-assets"),cl=read("current-liabilities"),mcap=read("market-cap"),cash=read("cash"),book=read("book-equity");
  const items=[
   ["EBITDA margin",format(pct(ebitda,rev)),"EBITDA ÷ revenue"],
   ["PAT margin",format(pct(pat,rev)),"PAT ÷ revenue"],
   ["CFO / PAT",pat===0?"N/A":(ocf/pat).toFixed(2)+"x","Operating cash flow ÷ PAT"],
   ["Debt / equity",equity===0?"N/A":(debt/equity).toFixed(2)+"x","Debt ÷ equity"],
   ["Interest coverage",interest===0?"N/A":(ebit/interest).toFixed(2)+"x","EBIT ÷ interest cost"],
   ["ROE",format(pct(pat,avg)),"PAT ÷ average equity"],
   ["ROCE (simplified)",format(pct(ebit,capital)),"EBIT ÷ capital employed"],
   ["Illustrative FCF","₹"+(ocf-capex).toFixed(2)+" cr","CFO − capital expenditure"],
   ["Receivable days",rev===0?"N/A":(receivables/rev*365).toFixed(1)+" days","Average receivables ÷ revenue × 365"],
   ["Inventory days",cogs===0?"N/A":(inventory/cogs*365).toFixed(1)+" days","Average inventory ÷ COGS × 365"],
   ["Working capital","₹"+(ca-cl).toFixed(2)+" cr","Current assets − current liabilities"],
   ["P/E",pat===0?"N/A":(mcap/pat).toFixed(2)+"x","Market capitalisation ÷ PAT"],
   ["P/B",book===0?"N/A":(mcap/book).toFixed(2)+"x","Market capitalisation ÷ book equity"],
   ["EV / EBITDA",ebitda===0?"N/A":((mcap+debt-cash)/ebitda).toFixed(2)+"x","(Market cap + debt − cash) ÷ EBITDA"]
  ];
  $("#finance-results").innerHTML=items.map(x=>`<div class="ratio"><small>${x[0]}</small><b>${x[1]}</b><em>${x[2]}</em></div>`).join("");
 };
 fields.forEach(x=>$("#f-"+x).addEventListener("input",draw));draw();
}
function wireQuiz(){
 $("#quiz-start").addEventListener("click",()=>{
  const level=$("#quiz-level").value,all=state.lessons.filter(x=>x.id.startsWith("C"));
  const subset=level==="beginner"?all.slice(0,8):level==="intermediate"?all.slice(8,16):all.slice(16,24);
  state.quiz=subset.map(l=>({...l.quiz[0],topic:l.title})).sort(()=>Math.random()-.5).slice(0,5);
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
 let dark=localStorage.getItem("ipoRealityDark")!=="0";document.body.classList.toggle("dark",dark);
 $("#theme").addEventListener("click",()=>{dark=!dark;document.body.classList.toggle("dark",dark);localStorage.setItem("ipoRealityDark",dark?"1":"0")});
}
boot().catch(e=>{console.error(e);document.body.insertAdjacentHTML("afterbegin",`<div style="padding:12px;background:#f6e9e7;color:#762">App data failed to load. Run through a local web server, not by opening index.html directly. ${esc(e.message)}</div>`)});
