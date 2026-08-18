import { useMemo, useState } from "react";

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function Health() {
  const [who, setWho] = useState("family");
  const [age, setAge] = useState(32);
  const [kids, setKids] = useState(1);
  const [city, setCity] = useState("tier2");
  const [sum, setSum] = useState(1500000);
  const [existing, setExisting] = useState(0);
  const [ped, setPed] = useState("no");
  const [via, setVia] = useState("Niva Bupa");

  const adults = who === "self" ? 1 : 2;
  const kidN = who === "family" ? kids : 0;

  const rec = useMemo(() => {
    let r = city === "metro" ? 2500000 : city === "tier2" ? 1500000 : 1000000;
    if (adults + kidN >= 3) r += 500000;
    if (age >= 45) r += 500000;
    if (age >= 60) r += 500000;
    return Math.min(10000000, r);
  }, [city, adults, kidN, age]);

  const { low, high, month } = useMemo(() => {
    let ageF = 0.78;
    if (age >= 26) ageF = 1;
    if (age >= 36) ageF = 1.48;
    if (age >= 46) ageF = 2.25;
    if (age >= 56) ageF = 3.45;
    if (age >= 66) ageF = 5.1;
    let siF = 0.62;
    if (sum >= 1000000) siF = 1;
    if (sum >= 1500000) siF = 1.28;
    if (sum >= 2500000) siF = 1.72;
    if (sum >= 5000000) siF = 2.45;
    if (sum >= 10000000) siF = 3.35;
    const cityF = city === "metro" ? 1.18 : city === "tier2" ? 1.05 : 1;
    const memberF = 1 + Math.max(0, adults - 1) * 0.52 + kidN * 0.16;
    const viaF = { "Care Health": 0.98, "Niva Bupa": 1, "Tata AIG": 1.03, "ICICI Lombard": 1.05 }[via] || 1;
    const mid = 7200 * ageF * siF * cityF * memberF * viaF;
    const load = ped === "yes" ? 1.22 : 1;
    const l = mid * 0.84 * load;
    const h = mid * 1.26 * (ped === "yes" ? 1.38 : 1);
    return { low: l, high: h, month: (l + h) / 24 };
  }, [age, sum, city, adults, kidN, via, ped]);

  const wa = `https://wa.me/919490237465?text=${encodeURIComponent(
    `Hi Fortune U Group, health quote.\nInsurer: ${via}\nCover: ${who}, eldest ${age}, kids ${kidN}\nCity: ${city}, SI ${inr(sum)}, existing ${inr(existing)}, PED ${ped}\nIllustration: ${inr(low)}–${inr(high)} / year`
  )}`;

  const Chip = ({ on, children, ...p }) => (
    <button
      type="button"
      {...p}
      className={`rounded-full px-3 py-1.5 text-sm font-bold border ${on ? "bg-[#0A2540] text-white border-[#0A2540]" : "bg-white text-[#0A2540] border-gray-300"}`}
    >
      {children}
    </button>
  );

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#0A2540] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <div>
            <p className="text-[#D4AF37] tracking-widest text-xs font-bold uppercase">Health insurance · Tirupati</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-3 leading-tight">Hospital bills should not wipe your SIPs.</h1>
            <p className="mt-4 text-slate-300 text-lg">Indicative yearly premium in 20 seconds. Exact price after the insurer’s proposal.</p>
            <div className="flex flex-wrap gap-2 mt-6 text-xs font-bold">
              {["Care Health", "Niva Bupa", "Tata AIG", "ICICI Lombard", "Life · LIC", "Life · HDFC Life"].map((t) => (
                <span key={t} className="border border-white/20 rounded-xl px-3 py-2 bg-white/5">{t}</span>
              ))}
            </div>
            <p className="mt-4 text-slate-400 text-sm">Insurance is the subject matter of solicitation. This is an illustration, not a quote.</p>
          </div>

          <div className="bg-white text-[#0A1931] rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/40">
            <div className="bg-[#0A2540] text-white px-5 py-4 flex justify-between items-center">
              <div>
                <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase">Premium illustration</p>
                <p className="text-sm text-slate-300">Not a guaranteed premium</p>
              </div>
            </div>
            <div className="p-5">
              <p className="font-bold text-sm mb-2">Who should this cover?</p>
              <div className="flex flex-wrap gap-2">
                <Chip on={who === "self"} onClick={() => setWho("self")}>Self</Chip>
                <Chip on={who === "couple"} onClick={() => setWho("couple")}>Self + spouse</Chip>
                <Chip on={who === "family"} onClick={() => setWho("family")}>Family floater</Chip>
              </div>

              <label className="block font-bold text-sm mt-4">Age of eldest · {age} yrs</label>
              <input type="range" min="18" max="70" value={age} onChange={(e) => setAge(+e.target.value)} className="w-full" />

              {who === "family" && (
                <>
                  <label className="block font-bold text-sm mt-3">Children · {kids}</label>
                  <input type="range" min="0" max="4" value={kids} onChange={(e) => setKids(+e.target.value)} className="w-full" />
                </>
              )}

              <p className="font-bold text-sm mt-4 mb-2">City</p>
              <div className="flex flex-wrap gap-2">
                <Chip on={city === "metro"} onClick={() => setCity("metro")}>Metro</Chip>
                <Chip on={city === "tier2"} onClick={() => setCity("tier2")}>Tier-2 (Tirupati)</Chip>
                <Chip on={city === "other"} onClick={() => setCity("other")}>Other</Chip>
              </div>

              <p className="font-bold text-sm mt-4 mb-2">Sum insured</p>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 15, 25, 50, 100].map((l) => (
                  <Chip key={l} on={sum === l * 100000} onClick={() => setSum(l * 100000)}>₹{l}{l === 100 ? " Cr" : " L"}</Chip>
                ))}
              </div>

              <p className="font-bold text-sm mt-4 mb-2">Ask quote through</p>
              <div className="flex flex-wrap gap-2">
                {["Care Health", "Niva Bupa", "Tata AIG", "ICICI Lombard"].map((n) => (
                  <Chip key={n} on={via === n} onClick={() => setVia(n)}>{n}</Chip>
                ))}
              </div>

              <div className="mt-4 rounded-2xl p-4 text-white bg-gradient-to-br from-[#0A1931] to-[#0f3d4a]">
                <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase">Indicative annual premium</p>
                <p className="text-3xl font-extrabold text-[#D4AF37] mt-1">{inr(low)} – {inr(high)}</p>
                <p className="text-sm mt-2">About {inr(month)}/mo · Suggested cover {inr(rec)}</p>
                <p className="text-sm text-slate-300">Gap: {Math.max(0, rec - existing) ? inr(rec - existing) + " shortfall" : "Cover looks adequate"} · {via}</p>
                <a href={wa} target="_blank" rel="noopener" className="inline-block mt-4 bg-[#D4AF37] text-[#0A1931] font-bold rounded-full px-5 py-2">Get exact quote on WhatsApp</a>
              </div>
              <p className="mt-3 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3">
                Illustration only. The insurer issues the contract. Care Health · Niva Bupa · Tata AIG · ICICI Lombard. Insurance is the subject matter of solicitation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
