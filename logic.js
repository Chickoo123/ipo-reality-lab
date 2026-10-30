(function(root,factory){
 const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 else root.IPOLogic=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 const shuffleItems=(items,random=Math.random)=>{
  const out=[...items];
  for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
  return out;
 };
 const shuffleQuestion=(q,random=Math.random)=>{
  const entries=(q.options||[]).map((text,index)=>({text,correct:index===q.answer}));
  const shuffled=shuffleItems(entries,random);
  return {...q,options:shuffled.map(x=>x.text),answer:shuffled.findIndex(x=>x.correct)};
 };
 const questionsForLevel=(modules,level,count=5,random=Math.random)=>{
  const priorityByLevel={beginner:"Foundational",intermediate:"Essential",advanced:"Advanced"};
  const priority=priorityByLevel[level]||"Foundational";
  const eligible=modules.filter(m=>m.priority===priority);
  const all=eligible.flatMap(m=>(m.quiz||[]).map(q=>({...shuffleQuestion(q,random),topic:m.title})));
  return shuffleItems(all,random).slice(0,Math.min(count,all.length));
 };
 const buildDemandCurve=(offered,floor,cap)=>{
  if(!Number.isFinite(offered)||offered<=0||!Number.isInteger(offered))return {error:"Enter a whole-number quantity of shares greater than zero."};
  if(!Number.isFinite(floor)||!Number.isFinite(cap)||floor<=0||cap<=floor)return {error:"Enter a valid price band. The cap must be higher than the floor and both prices must be positive."};
  const width=cap-floor;
  const segments=Math.max(1,Math.min(50,Math.ceil(width*100)));
  const step=width/segments;
  const ascending=Array.from({length:segments+1},(_,i)=>{
   const price=Math.round((floor+step*i)*100)/100;
   const normalized=i/segments;
   const fraction=.08+.20*(1-normalized);
   return {price,bidsAtPrice:Math.max(0,Math.round(offered*fraction))};
  });
  let cumulative=0;
  const rows=ascending.reverse().map(r=>({...r,cumulative:(cumulative+=r.bidsAtPrice)}));
  const cut=rows.find(r=>r.cumulative>=offered)||null;
  return {rows,cutOff:cut?cut.price:null,undersubscribed:!cut,totalDemand:cumulative,step,segments};
 };
 const calculateFinancialMetrics=inputs=>{
  const n=id=>{const raw=inputs[id];if(raw===null||raw===undefined||String(raw).trim()==="")return null;const v=Number(raw);return Number.isFinite(v)?v:null;};
  const missing=values=>values.some(v=>v===null);
  const pct=(a,b)=>b===0?"Not meaningful":((a/b)*100).toFixed(2)+"%";
  const ratio=(a,b)=>b===0?"Not meaningful":(a/b).toFixed(2)+"x";
  const f=x=>x===null?"Missing input":x;
  const rev=n("revenue"),ebitda=n("ebitda"),pat=n("pat"),ocf=n("ocf"),debt=n("debt"),equity=n("equity"),interest=n("interest"),ebit=n("ebit"),avg=n("average"),capital=n("capital"),capex=n("capex"),receivables=n("receivables"),inventory=n("inventory"),cogs=n("cogs"),ca=n("current-assets"),cl=n("current-liabilities"),mcap=n("market-cap"),cash=n("cash"),book=n("book-equity");
  return [
   ["EBITDA margin",missing([ebitda,rev])?"Missing input":rev<=0?"Not meaningful":pct(ebitda,rev),"EBITDA ÷ revenue"],
   ["PAT margin",missing([pat,rev])?"Missing input":rev<=0?"Not meaningful":pct(pat,rev),"PAT ÷ revenue"],
   ["CFO / PAT",missing([ocf,pat])?"Missing input":pat<=0?"Not meaningful":ratio(ocf,pat),"Operating cash flow ÷ PAT"],
   ["Debt / equity",missing([debt,equity])?"Missing input":equity<=0?"Not meaningful":ratio(debt,equity),"Debt ÷ equity"],
   ["Interest coverage",missing([ebit,interest])?"Missing input":interest<=0?"Not meaningful":ratio(ebit,interest),"EBIT ÷ interest cost"],
   ["ROE",missing([pat,avg])?"Missing input":avg<=0?"Not meaningful":pct(pat,avg),"PAT ÷ average equity"],
   ["ROCE (simplified)",missing([ebit,capital])?"Missing input":capital<=0?"Not meaningful":pct(ebit,capital),"EBIT ÷ capital employed"],
   ["Illustrative FCF",missing([ocf,capex])?"Missing input":"₹"+(ocf-capex).toFixed(2)+" cr","Operating cash flow − capital expenditure"],
   ["Receivable days",missing([receivables,rev])?"Missing input":rev<=0?"Not meaningful":(receivables/rev*365).toFixed(1)+" days","Average receivables ÷ revenue × 365"],
   ["Inventory days",missing([inventory,cogs])?"Missing input":cogs<=0?"Not meaningful":(inventory/cogs*365).toFixed(1)+" days","Average inventory ÷ COGS × 365"],
   ["Working capital",missing([ca,cl])?"Missing input":"₹"+(ca-cl).toFixed(2)+" cr","Current assets − current liabilities"],
   ["P/E",missing([mcap,pat])?"Missing input":pat<0?"Not meaningful (loss)":pat===0?"Not meaningful (zero earnings)":ratio(mcap,pat),"Market capitalisation ÷ PAT"],
   ["P/B",missing([mcap,book])?"Missing input":book<=0?"Not meaningful":ratio(mcap,book),"Market capitalisation ÷ book equity"],
   ["EV / EBITDA",missing([mcap,debt,cash,ebitda])?"Missing input":ebitda<=0?"Not meaningful":ratio(mcap+debt-cash,ebitda),"(Market cap + debt − cash) ÷ EBITDA"]
  ];
 };
 return {shuffleItems,shuffleQuestion,questionsForLevel,buildDemandCurve,calculateFinancialMetrics};
});
