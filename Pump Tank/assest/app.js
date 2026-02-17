function $(sel){ return document.querySelector(sel); }

function fmtPrice(p){
  if(p === null || p === undefined || p === "") return "Price on request";
  return `R ${Number(p).toLocaleString("en-ZA")}`;
}

function renderProducts(list, mountSel){
  const mount = document.querySelector(mountSel);
  if(!mount) return;
  mount.innerHTML = "";
  list.forEach(item => {
    const el = document.createElement("div");
    el.className = "card";
    const badges = (item.use || []).slice(0,3).map(x=>`<span class="badge">${x}</span>`).join("");
    const spec = item.litres ? `${item.litres.toLocaleString("en-ZA")} L` :
                `${item.flow_lpm} L/min • ${item.head_m} m head • ${item.power_kw} kW`;
    el.innerHTML = `
      <h3>${item.name}</h3>
      <div class="badges">${badges || `<span class="badge">${item.category}</span>`}</div>
      <p class="small" style="margin-top:10px">${spec}</p>
      <p class="small">${item.note || ""}</p>
      <div class="price">${fmtPrice(item.price)}</div>
      <div class="ctas" style="margin-top:10px">
        <a class="btn" href="contact.html?product=${encodeURIComponent(item.name)}">Request quote</a>
        <a class="btn ghost" href="contact.html?product=${encodeURIComponent(item.name)}&type=whatsapp">WhatsApp</a>
      </div>
    `;
    mount.appendChild(el);
  });
}

function filterAndRender(type){
  const q = ($("#search")?.value || "").toLowerCase().trim();
  const cat = $("#category")?.value || "All";
  const src = type === "pumps" ? PRODUCTS.pumps : PRODUCTS.tanks;
  const out = src.filter(p => {
    const inText = (p.name + " " + (p.note||"") + " " + (p.category||"") + " " + (p.use||[]).join(" ")).toLowerCase();
    const okText = !q || inText.includes(q);
    const okCat = (cat === "All") || (p.category === cat);
    return okText && okCat;
  });
  renderProducts(out, "#productGrid");
  $("#count") && ($("#count").textContent = `${out.length} item(s)`);
}

function initCatalog(type){
  const src = type === "pumps" ? PRODUCTS.pumps : PRODUCTS.tanks;
  const cats = Array.from(new Set(src.map(x=>x.category))).sort();
  const catSel = $("#category");
  if(catSel){
    catSel.innerHTML = `<option>All</option>` + cats.map(c=>`<option>${c}</option>`).join("");
  }
  $("#search")?.addEventListener("input", ()=>filterAndRender(type));
  $("#category")?.addEventListener("change", ()=>filterAndRender(type));
  filterAndRender(type);
}

function calcPumpFinder(){
  const use = $("#pf_use").value;
  const flow = Number($("#pf_flow").value || 0);
  const head = Number($("#pf_head").value || 0);
  const source = $("#pf_source").value;

  const sorted = [...PRODUCTS.pumps].sort((a,b)=>(a.power_kw||0)-(b.power_kw||0));
  const match = sorted.find(p => (p.flow_lpm||0) >= flow && (p.head_m||0) >= head) || sorted[sorted.length-1];

  const guidance = [];
  if(source === "Borehole") guidance.push("Consider borehole diameter, depth, and water level.");
  if(use === "House pressure") guidance.push("Add a pressure controller and non-return valve.");
  if(use === "Irrigation") guidance.push("Confirm sprinkler/drip flow and pipe sizing (friction losses).");
  if(head > 60) guidance.push("Higher head: confirm staging or correct submersible curve.");

  $("#pf_result").innerHTML = `
    <b>Suggested pump</b>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0">
      <span class="badge">${match.category}</span>
      <span class="badge">${match.flow_lpm} L/min</span>
      <span class="badge">${match.head_m} m head</span>
      <span class="badge">${match.power_kw} kW</span>
    </div>
    <div><b>${match.name}</b></div>
    <div class="small" style="margin-top:6px">${match.note || ""}</div>
    <div class="small" style="margin-top:10px"><b>Notes:</b> ${guidance.join(" ") || "Confirm final sizing with your pipe length and fittings."}</div>
    <div class="ctas" style="margin-top:12px">
      <a class="btn primary" href="contact.html?product=${encodeURIComponent(match.name)}&details=${encodeURIComponent(`Use: ${use} | Source: ${source} | Flow: ${flow} L/min | Head: ${head} m`)}">Request quote for this setup</a>
    </div>
  `;
}

function calcTankSizing(){
  const people = Number($("#ts_people").value || 0);
  const days = Number($("#ts_days").value || 0);
  const litresPerPerson = Number($("#ts_lppd").value || 0);

  const total = Math.max(0, people * days * litresPerPerson);
  const sizes = [500, 1000, 2000, 2500, 5000, 10000];
  const rec = sizes.find(s => s >= total) || sizes[sizes.length-1];

  const options = PRODUCTS.tanks
    .slice()
    .sort((a,b)=>(a.litres||0)-(b.litres||0))
    .filter(t => (t.litres||0) >= total)
    .slice(0,3);

  const optHtml = options.length
    ? options.map(t=>`<div class="card" style="padding:12px"><b>${t.name}</b><div class="small">${t.litres.toLocaleString("en-ZA")} L • ${t.category}</div><div class="ctas" style="margin-top:8px"><a class="btn" href="contact.html?product=${encodeURIComponent(t.name)}&details=${encodeURIComponent(`Tank sizing: ${people} people, ${days} days, ${litresPerPerson} L/person/day (Total ${total}L)`) }">Request quote</a></div></div>`).join("")
    : `<div class="small">No matching tank in the demo list — add your catalog items in <code>assets/data.js</code>.</div>`;

  $("#ts_result").innerHTML = `
    <b>Result</b>
    <div class="small" style="margin-top:6px">Estimated storage needed: <b>${Math.round(total).toLocaleString("en-ZA")} L</b></div>
    <div class="small">Recommended minimum tank size: <b>${rec.toLocaleString("en-ZA")} L</b></div>
    <div class="notice">Tip: if you have rainwater harvesting, you may size larger to cover dry periods.</div>
    <div class="grid" style="margin-top:12px">${optHtml}</div>
  `;
}

function initContact(){
  const params = new URLSearchParams(location.search);
  const product = params.get("product") || "";
  const details = params.get("details") || "";
  if(product) $("#c_product").value = product;
  if(details) $("#c_details").value = details;

  const waNumber = $("#wa_number")?.dataset?.wa || "";
  const waBtn = $("#wa_btn");
  if(waBtn){
    const text = `Hi, I’d like a quote. Product: ${product || "(not specified)"} ${details ? " | " + details : ""}`.trim();
    waBtn.href = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`
                          : `https://wa.me/?text=${encodeURIComponent(text)}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if(page === "pumps") initCatalog("pumps");
  if(page === "tanks") initCatalog("tanks");
  if(page === "pump-finder"){
    $("#pf_calc").addEventListener("click", (e)=>{ e.preventDefault(); calcPumpFinder(); });
    calcPumpFinder();
  }
  if(page === "tank-sizing"){
    $("#ts_calc").addEventListener("click", (e)=>{ e.preventDefault(); calcTankSizing(); });
    calcTankSizing();
  }
  if(page === "contact") initContact();
});
