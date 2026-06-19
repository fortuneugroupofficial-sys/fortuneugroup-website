import React, { useMemo, useState } from "react";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { SectionHeader } from "../components/SectionHeader";

const fmt = (n) => {
  if (!isFinite(n)) return "—";
  if (n >= 1e7) return `₹${(n/1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n/1e5).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const InputRow = ({ label, value, onChange, min, max, step, suffix, testid }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <Label className="text-xs uppercase tracking-wider font-semibold text-brand-navy">{label}</Label>
      <div className="flex items-center gap-2">
        <Input type="number" value={value} min={min} max={max} step={step} onChange={(e)=>onChange(Number(e.target.value))} className="h-8 w-28 text-right bg-brand-soft/40 border-brand-line focus-visible:ring-brand-green" data-testid={`${testid}-input`} />
        {suffix && <span className="text-xs text-brand-mute">{suffix}</span>}
      </div>
    </div>
    <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v)=>onChange(v[0])} data-testid={`${testid}-slider`} />
  </div>
);

const ChartBlock = ({ data }) => (
  <div className="h-72 mt-4">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="gw1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gw2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A2540" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#0A2540" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="year" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v)=>`${v}L`} />
        <Tooltip formatter={(v)=>`₹${v}L`} contentStyle={{borderRadius:8, borderColor:'#E2E8F0', fontSize:12}} />
        <Area type="monotone" dataKey="invested" stroke="#0A2540" strokeWidth={2} fill="url(#gw2)" name="Invested" />
        <Area type="monotone" dataKey="wealth" stroke="#10B981" strokeWidth={2.5} fill="url(#gw1)" name="Wealth" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const SIPCalc = () => {
  const [m, setM] = useState(10000);
  const [y, setY] = useState(15);
  const [r, setR] = useState(12);
  const { invested, wealth, gains, data } = useMemo(() => {
    const monthlyRate = r / 100 / 12;
    const n = y * 12;
    const fv = m * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
    const inv = m * n;
    const series = [];
    for (let yr = 1; yr <= y; yr++) {
      const nn = yr * 12;
      const fvY = m * ((Math.pow(1 + monthlyRate, nn) - 1) / monthlyRate) * (1 + monthlyRate);
      series.push({ year: `Y${yr}`, invested: Math.round((m*nn)/100000), wealth: Math.round(fvY/100000) });
    }
    return { invested: inv, wealth: fv, gains: fv - inv, data: series };
  }, [m, y, r]);
  return (
    <div className="grid lg:grid-cols-5 gap-6" data-testid="sip-calc">
      <Card className="p-6 lg:col-span-2 bg-white border-brand-line">
        <div className="space-y-6">
          <InputRow label="Monthly SIP (₹)" value={m} onChange={setM} min={500} max={200000} step={500} testid="sip-monthly" />
          <InputRow label="Years" value={y} onChange={setY} min={1} max={40} step={1} suffix="yrs" testid="sip-years" />
          <InputRow label="Expected Return (% p.a.)" value={r} onChange={setR} min={1} max={25} step={0.5} suffix="%" testid="sip-rate" />
        </div>
      </Card>
      <Card className="p-6 lg:col-span-3 bg-white border-brand-line">
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Invested" value={fmt(invested)} />
          <Stat label="Est. Wealth" value={fmt(wealth)} accent />
          <Stat label="Total Gains" value={fmt(gains)} />
        </div>
        <ChartBlock data={data} />
      </Card>
    </div>
  );
};

const RetirementCalc = () => {
  const [age, setAge] = useState(30);
  const [retire, setRetire] = useState(60);
  const [save, setSave] = useState(15000);
  const [rate, setRate] = useState(12);
  const { corpus, invested, data } = useMemo(() => {
    const years = Math.max(0, retire - age);
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    const fv = save * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
    const inv = save * n;
    const series = [];
    for (let yr = 1; yr <= years; yr++) {
      const nn = yr * 12;
      const fvY = save * ((Math.pow(1 + monthlyRate, nn) - 1) / monthlyRate) * (1 + monthlyRate);
      series.push({ year: `Age ${age+yr}`, invested: Math.round((save*nn)/100000), wealth: Math.round(fvY/100000) });
    }
    return { corpus: fv, invested: inv, data: series };
  }, [age, retire, save, rate]);
  return (
    <div className="grid lg:grid-cols-5 gap-6" data-testid="ret-calc">
      <Card className="p-6 lg:col-span-2 bg-white border-brand-line">
        <div className="space-y-6">
          <InputRow label="Current Age" value={age} onChange={setAge} min={18} max={55} step={1} testid="ret-age" />
          <InputRow label="Retirement Age" value={retire} onChange={setRetire} min={Math.max(age+1,40)} max={75} step={1} testid="ret-retire" />
          <InputRow label="Monthly Savings (₹)" value={save} onChange={setSave} min={1000} max={200000} step={1000} testid="ret-save" />
          <InputRow label="Expected Return (% p.a.)" value={rate} onChange={setRate} min={1} max={20} step={0.5} suffix="%" testid="ret-rate" />
        </div>
      </Card>
      <Card className="p-6 lg:col-span-3 bg-white border-brand-line">
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Retirement Corpus" value={fmt(corpus)} accent />
          <Stat label="Total Invested" value={fmt(invested)} />
        </div>
        <ChartBlock data={data} />
      </Card>
    </div>
  );
};

const GoalCalc = () => {
  const [goal, setGoal] = useState(2500000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const { sip, data } = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    const sipReq = goal / (((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate));
    const series = [];
    for (let yr = 1; yr <= years; yr++) {
      const nn = yr * 12;
      const fvY = sipReq * ((Math.pow(1 + monthlyRate, nn) - 1) / monthlyRate) * (1 + monthlyRate);
      series.push({ year: `Y${yr}`, invested: Math.round((sipReq*nn)/100000), wealth: Math.round(fvY/100000) });
    }
    return { sip: sipReq, data: series };
  }, [goal, years, rate]);
  return (
    <div className="grid lg:grid-cols-5 gap-6" data-testid="goal-calc">
      <Card className="p-6 lg:col-span-2 bg-white border-brand-line">
        <div className="space-y-6">
          <InputRow label="Goal Amount (₹)" value={goal} onChange={setGoal} min={100000} max={50000000} step={50000} testid="goal-amt" />
          <InputRow label="Time Horizon (years)" value={years} onChange={setYears} min={1} max={40} step={1} testid="goal-years" />
          <InputRow label="Expected Return (% p.a.)" value={rate} onChange={setRate} min={1} max={20} step={0.5} suffix="%" testid="goal-rate" />
        </div>
      </Card>
      <Card className="p-6 lg:col-span-3 bg-white border-brand-line">
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Required Monthly SIP" value={fmt(sip)} accent />
          <Stat label="Target Amount" value={fmt(goal)} />
        </div>
        <ChartBlock data={data} />
      </Card>
    </div>
  );
};

const Stat = ({ label, value, accent }) => (
  <div className={`rounded-xl p-5 border ${accent ? "bg-brand-green/10 border-brand-green/30" : "bg-brand-soft/40 border-brand-line"}`}>
    <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-mute">{label}</div>
    <div className={`mt-1 font-display text-2xl font-semibold ${accent ? "text-brand-deepgreen" : "text-brand-navy"}`}>{value}</div>
  </div>
);

const Tools = () => (
  <div data-testid="tools-page" className="bg-brand-bg">
    <section className="bg-white border-b border-brand-line">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-24">
        <div className="text-xs tracking-[0.2em] uppercase font-bold text-brand-green mb-3">Free Calculators</div>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight text-brand-navy font-semibold leading-tight max-w-3xl">Plan your future in numbers. Then turn it into a plan.</h1>
        <p className="mt-5 text-brand-mute max-w-2xl leading-relaxed">Use our interactive SIP, Retirement and Goal calculators to see exactly how much you need to invest — and what your money can become.</p>
      </div>
    </section>

    <section className="py-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Tabs defaultValue="sip" className="w-full" data-testid="tools-tabs">
          <TabsList className="bg-white border border-brand-line p-1 rounded-full mx-auto flex w-fit">
            <TabsTrigger value="sip" className="rounded-full data-[state=active]:bg-brand-navy data-[state=active]:text-white px-6" data-testid="tab-sip">SIP Calculator</TabsTrigger>
            <TabsTrigger value="ret" className="rounded-full data-[state=active]:bg-brand-navy data-[state=active]:text-white px-6" data-testid="tab-ret">Retirement</TabsTrigger>
            <TabsTrigger value="goal" className="rounded-full data-[state=active]:bg-brand-navy data-[state=active]:text-white px-6" data-testid="tab-goal">Goal</TabsTrigger>
          </TabsList>
          <TabsContent value="sip" className="mt-8"><SIPCalc /></TabsContent>
          <TabsContent value="ret" className="mt-8"><RetirementCalc /></TabsContent>
          <TabsContent value="goal" className="mt-8"><GoalCalc /></TabsContent>
        </Tabs>
      </div>
    </section>
  </div>
);

export default Tools;
