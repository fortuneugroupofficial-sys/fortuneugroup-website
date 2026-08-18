(function () {
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  const C = window.FUG || {};
  const state = {
    who: "family",
    age: 32,
    kids: 1,
    city: "tier2",
    sum: 1500000,
    existing: 0,
    ped: "no",
    via: "Niva Bupa",
  };

  function members() {
    if (state.who === "self") return { adults: 1, kids: 0 };
    if (state.who === "couple") return { adults: 2, kids: 0 };
    return { adults: 2, kids: Number(state.kids) || 0 };
  }

  function recommend() {
    const { adults, kids } = members();
    let rec = 1000000;
    if (state.city === "metro") rec = 2500000;
    else if (state.city === "tier2") rec = 1500000;
    if (adults + kids >= 3) rec += 500000;
    if (state.age >= 45) rec += 500000;
    if (state.age >= 60) rec += 500000;
    return Math.min(10000000, rec);
  }

  /* Illustration only — not an insurer quote. Tuned to public 2026 retail bands. */
  function estimate() {
    const { adults, kids } = members();
    const age = state.age;
    let ageF = 0.78;
    if (age >= 26) ageF = 1;
    if (age >= 36) ageF = 1.48;
    if (age >= 46) ageF = 2.25;
    if (age >= 56) ageF = 3.45;
    if (age >= 66) ageF = 5.1;

    const si = state.sum;
    let siF = 0.62;
    if (si >= 1000000) siF = 1;
    if (si >= 1500000) siF = 1.28;
    if (si >= 2500000) siF = 1.72;
    if (si >= 5000000) siF = 2.45;
    if (si >= 10000000) siF = 3.35;

    const cityF = state.city === "metro" ? 1.18 : state.city === "tier2" ? 1.05 : 1;
    const extraAdults = Math.max(0, adults - 1);
    const memberF = 1 + extraAdults * 0.52 + kids * 0.16;
    const viaF = ({ "Care Health": 0.98, "Niva Bupa": 1, "Tata AIG": 1.03, "ICICI Lombard": 1.05 }[state.via]) || 1;
    const mid = 7200 * ageF * siF * cityF * memberF * viaF;
    const load = state.ped === "yes" ? 1.22 : 1;
    return { low: mid * 0.84 * load, high: mid * 1.26 * (state.ped === "yes" ? 1.38 : 1) };
  }

  function paint() {
    document.getElementById("ageVal").textContent = state.age + " yrs";
    const kv = document.getElementById("kidsVal");
    if (kv) kv.textContent = String(state.kids);
    const rec = recommend();
    const gap = Math.max(0, rec - state.existing);
    const { low, high } = estimate();
    const month = ((low + high) / 2) / 12;
    document.getElementById("outRange").textContent = inr(low) + " – " + inr(high);
    document.getElementById("outMonth").textContent = inr(month) + "/mo";
    document.getElementById("outRec").textContent = inr(rec);
    document.getElementById("outGap").textContent = gap ? inr(gap) + " shortfall" : "Cover looks adequate";
    document.getElementById("outSi").textContent = inr(state.sum);
    const pct = Math.min(100, Math.round((state.sum / Math.max(rec, 1)) * 100));
    document.getElementById("barFill").style.width = pct + "%";
    document.getElementById("viaLabel").textContent = state.via;

    const msg =
      `Hi Fortune U Group, health quote please.` +
      `\nIRDAI: ${C.irdaiLicence || ""}` +
      `\nInsurer: ${state.via}` +
      `\nCover: ${state.who}, eldest ${state.age}, kids ${members().kids}` +
      `\nCity: ${state.city}, SI ${inr(state.sum)}, existing ${inr(state.existing)}, PED ${state.ped}` +
      `\nIllustration shown: ${inr(low)}–${inr(high)} / year`;
    const wa = "https://wa.me/91" + C.phone + "?text=" + encodeURIComponent(msg);
    document.getElementById("waQuote").setAttribute("href", wa);
  }

  function bindChips(name, key, cast) {
    document.querySelectorAll(`[data-${name}]`).forEach((el) => {
      el.addEventListener("click", () => {
        document.querySelectorAll(`[data-${name}]`).forEach((x) => x.classList.remove("on"));
        el.classList.add("on");
        state[key] = cast ? cast(el.getAttribute("data-" + name)) : el.getAttribute("data-" + name);
        const kidsRow = document.getElementById("kidsRow");
        if (kidsRow) kidsRow.style.display = state.who === "family" ? "" : "none";
        paint();
      });
    });
  }

  bindChips("who", "who");
  bindChips("city", "city");
  bindChips("sum", "sum", Number);
  bindChips("exist", "existing", Number);
  bindChips("ped", "ped");
  bindChips("via", "via");

  const age = document.getElementById("age");
  const kids = document.getElementById("kids");
  if (age) age.addEventListener("input", () => { state.age = Number(age.value); paint(); });
  if (kids) kids.addEventListener("input", () => { state.kids = Number(kids.value); paint(); });
  paint();
})();
