import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { SectionHeader } from "../components/SectionHeader";
import SEO from "../components/SEO";
import { useLang } from "../context/LangContext";

 const seriesData = [
  { year: "Y1", wealth: 12 },
  { year: "Y2", wealth: 25 },
  { year: "Y3", wealth: 40 },
  { year: "Y4", wealth: 58 },
  { year: "Y5", wealth: 80 },
  ];
  const fmt = (n) => {
  if (!isFinite(n)) return "—";
  if (n >= 1e7) return `₹${(n/1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n/1e5).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const InputRow = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  testid,
}) => (
  <div className="space-y-3">

    <div className="flex items-center justify-between">

      <Label className="text-xs font-bold uppercase tracking-wider text-[#0A2540]">
        {label}
      </Label>

      <div className="flex items-center gap-2">

        <Input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-28 h-11 rounded-xl border border-[#D1D5DB] text-center font-semibold shadow-sm focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
        />

        {suffix && (
          <span className="text-sm font-medium text-gray-500">
            {suffix}
          </span>
        )}

      </div>

    </div>

    <Slider
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(v) => onChange(v[0])}
      data-testid={testid}
      className="slider py-2"
    />

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
      <Card className="p-8 lg:col-span-2 bg-white border border-[#E5E7EB] rounded-[20px] shadow-xl">
        <div className="space-y-6">
          <InputRow label="Monthly SIP (₹)" value={m} onChange={setM} min={500} max={200000} step={500} testid="sip-monthly" />
          <InputRow label="Years" value={y} onChange={setY} min={1} max={40} step={1} suffix="yrs" testid="sip-years" />
          <InputRow label="Expected Return (% p.a.)" value={r} onChange={setR} min={1} max={25} step={0.5} suffix="%" testid="sip-rate" />
        </div>
      </Card>
      <Card className="p-8 lg:col-span-3 bg-white border border-[#E5E7EB] rounded-[20px] shadow-xl">
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

const ELSSCalc = () => {
  const [m, setM] = useState(10000);
  const [y, setY] = useState(5);
  const [r, setR] = useState(13);
  const [slab, setSlab] = useState(30);
  const { invested, wealth, taxSavedYr, totalTaxSaved, data } = useMemo(() => {
    const monthlyRate = r / 100 / 12;
    const n = y * 12;
    const fv = m * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
    const inv = m * n;
    const yearlyInvest = Math.min(m * 12, 150000);
    const taxSavedY = (yearlyInvest * slab) / 100;
    const series = [];
    for (let yr = 1; yr <= y; yr++) {
      const nn = yr * 12;
      const fvY = m * ((Math.pow(1 + monthlyRate, nn) - 1) / monthlyRate) * (1 + monthlyRate);
      series.push({ year: `Y${yr}`, invested: Math.round((m*nn)/100000), wealth: Math.round(fvY/100000) });
    }
    return { invested: inv, wealth: fv, taxSavedYr: taxSavedY, totalTaxSaved: taxSavedY * y, data: series };
  }, [m, y, r, slab]);
  return (
    <div className="grid lg:grid-cols-5 gap-6" data-testid="elss-calc">
      <Card className="p-6 lg:col-span-2 bg-white border-brand-line">
        <div className="space-y-6">
          <InputRow label="Monthly Investment (₹)" value={m} onChange={setM} min={500} max={50000} step={500} testid="elss-monthly" />
          <InputRow label="Years" value={y} onChange={setY} min={3} max={30} step={1} suffix="yrs" testid="elss-years" />
          <InputRow label="Expected Return (% p.a.)" value={r} onChange={setR} min={6} max={20} step={0.5} suffix="%" testid="elss-rate" />
          <InputRow label="Tax Slab (%)" value={slab} onChange={setSlab} min={5} max={30} step={5} suffix="%" testid="elss-slab" />
          <div className="text-xs text-brand-mute bg-brand-soft/60 rounded-lg p-3 border border-brand-line">ELSS has a 3-year lock-in. Section 80C deduction is capped at ₹1.5L/yr.</div>
        </div>
      </Card>
      <Card className="p-6 lg:col-span-3 bg-white border-brand-line">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat label="Invested" value={fmt(invested)} />
          <Stat label="Est. Wealth" value={fmt(wealth)} accent />
          <Stat label="Tax Saved / Yr" value={fmt(taxSavedYr)} />
          <Stat label={`Total Tax Saved (${y}y)`} value={fmt(totalTaxSaved)} />
        </div>
        <ChartBlock data={data} />
      </Card>
    </div>
  );
};

const EMICalc = () => {
  const [P, setP] = useState(3000000);
  const [r, setR] = useState(8.5);
  const [y, setY] = useState(20);
  const { emi, totalInt, totalPay, data } = useMemo(() => {
    const monthly = r / 100 / 12;
    const n = y * 12;
    const e = monthly === 0 ? P / n : (P * monthly * Math.pow(1 + monthly, n)) / (Math.pow(1 + monthly, n) - 1);
    const series = [];
    let bal = P;
    for (let yr = 1; yr <= y; yr++) {
      let intPaid = 0; let prinPaid = 0;
      for (let m = 0; m < 12; m++) { const i = bal * monthly; const p = e - i; intPaid += i; prinPaid += p; bal -= p; }
      series.push({ year: `Y${yr}`, invested: Math.round((P - Math.max(bal,0))/100000), wealth: Math.round((P + (intPaid*y))/100000/y) });
    }
    return { emi: e, totalInt: e * n - P, totalPay: e * n, data: series };
  }, [P, r, y]);
  return (
    <div className="grid lg:grid-cols-5 gap-6" data-testid="emi-calc">
      <Card className="p-6 lg:col-span-2 bg-white border-brand-line">
        <div className="space-y-6">
          <InputRow label="Loan Amount (₹)" value={P} onChange={setP} min={100000} max={50000000} step={50000} testid="emi-amt" />
          <InputRow label="Interest Rate (% p.a.)" value={r} onChange={setR} min={5} max={20} step={0.1} suffix="%" testid="emi-rate" />
          <InputRow label="Tenure (years)" value={y} onChange={setY} min={1} max={30} step={1} testid="emi-years" />
        </div>
      </Card>
      <Card className="p-6 lg:col-span-3 bg-white border-brand-line">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Monthly EMI" value={fmt(emi)} accent />
          <Stat label="Total Interest" value={fmt(totalInt)} />
          <Stat label="Total Payment" value={fmt(totalPay)} />
        </div>
        <ChartBlock data={data} />
      </Card>
    </div>
  );
};

const Stat = ({ label, value, accent }) => (
  <div
    className={`rounded-3xl p-7 border shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ${
      accent
        ? "bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] border-[#10B981]"
        : "bg-gradient-to-br from-white to-[#F8FAFC] border-[#E5E7EB]"
    }`}
  >
    <div className="text-xs uppercase tracking-wider font-semibold text-gray-500">
      {label}
    </div>

    <div
      className={`mt-3 text-3xl font-bold ${
        accent ? "text-[#10B981]" : "text-[#0A2540]"
      }`}
    >
      {value}
    </div>
  </div>
);

const Tools = () => {
  const { t } = useLang();

  // 👇 ఇక్కడ paste చేయండి
  const [age, setAge] = useState(30);
  const [income, setIncome] = useState(50000);
  const [savings, setSavings] = useState(10000);
  const [investment, setInvestment] = useState(500000);
  const [score, setScore] = useState(82);

  const calculateScore = () => {
    let s = 0;

    if (savings >= income * 0.2) s += 30;
    else if (savings >= income * 0.1) s += 20;
    else s += 10;

    if (investment >= income * 12) s += 30;
    else if (investment >= income * 6) s += 20;
    else s += 10;

    if (age < 35) s += 20;
    else if (age < 50) s += 15;
    else s += 10;

    s += 20;

    setScore(Math.min(s, 100));
  };
  const scoreText = () => {

const downloadPDF = () => {
  const link = document.createElement("a");
  link.href = "/financial-report.pdf";
  link.download = "Fortune-U-Group-Financial-Report.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  return "Needs Improvement";
};
const starText = () => {
  if (score >= 90) return "★★★★★";
  if (score >= 70) return "★★★★☆";
  if (score >= 50) return "★★★☆☆";
  return "★★☆☆☆";
};
const savingsStars = () => {
  if (savings >= income * 0.2) return "★★★★★";
  if (savings >= income * 0.1) return "★★★★☆";
  return "★★★☆☆";
};

const investmentStars = () => {
  if (investment >= income * 12) return "★★★★★";
  if (investment >= income * 6) return "★★★★☆";
  return "★★★☆☆";
};

const emergencyStars = () => {
  if (savings >= income * 0.3) return "★★★★★";
  if (savings >= income * 0.2) return "★★★★☆";
  return "★★★☆☆";
};

const insuranceStars = () => {
  if (score >= 90) return "★★★★★";
  if (score >= 70) return "★★★★☆";
  return "★★★☆☆";
};
const downloadPDF = () => {
  const link = document.createElement("a");
  link.href = "/Fortune_U_Group_Financial_Guide.pdf";
  link.download = "Fortune_U_Group_Financial_Guide.pdf";
  link.click();
};
  return (

  <div data-testid="tools-page" className="bg-brand-bg">
    <SEO
  title="Free SIP Calculator, Retirement Calculator & Financial Tools | Fortune U Group"
  description="Use free financial planning tools including SIP Calculator, Retirement Calculator, Goal Planning Calculator and investment calculators from Fortune U Group."
  path="/tools"
  />
    {/* ================= TOOLS HERO ================= */}

<section className="relative overflow-hidden bg-white pt-6 pb-20 lg:pt-8 lg:pb-20">
<div className="max-w-7xl mx-auto px-5 lg:px-8 -mt-6">
    <div className="grid lg:grid-cols-2 gap-14 items-center">

      {/* LEFT */}
      <div>

        {/* Badge */}
        <div className="inline-flex items-center rounded-full bg-blue-50 border border-blue-100 px-4 py-2 text-sm font-semibold text-[#0A2540]">
          Smart Financial Calculators
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-5xl lg:text-6xl font-bold leading-tight text-[#0A2540]">
          Plan Today.
          <br />
          <span className="text-[#D4AF37]">
            Prosper Tomorrow.
          </span>
        </h1>

        {/* Description */}

        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl">
          Free SIP Calculator, Retirement Planner,
          Goal Planning, ELSS Tax Saving and EMI
          Calculator to help you make smarter
          financial decisions.
        </p>

        {/* Buttons */}

        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#calculator">
           <button className="px-8 py-4 rounded-full bg-[#0A2540] text-white font-semibold hover:bg-[#123B68] transition">
           Start Calculating →
           </button>
            </a>

          <Link to="/contact">
            <button
            className="px-8 py-4 rounded-full
            bg-[#D4AF37] text-[#0A2540] font-semibold shadow-lg hover:bg-[#B68D22] hover:text-white
            hover:shadow-2xl hover:scale-105 transition-all duration-300" >
            Talk to Advisor
           </button>
          </Link
          
          >

        </div>

      </div>

      {/* RIGHT */}

      <div>

        <div className="relative rounded-3xl bg-white border border-gray-200 shadow-2xl p-8">

          {/* CAGR Badge */}

          <div className="absolute top-6 right-6 bg-green-100 text-green-700 font-bold rounded-full px-4 py-2 text-sm">
            +12% CAGR
          </div>

          <p className="uppercase tracking-widest text-xs text-gray-500">
            Projected Wealth
          </p>

          <h2 className="mt-3 text-5xl font-bold text-[#0A2540]">
            ₹1,18,24,202
          </h2>

          {/* Gold Line */}

          <div className="mt-6 h-1 w-28 rounded-full bg-[#D4AF37]"></div>

          {/* Details */}

          <div className="mt-8 space-y-5">

            <div className="flex justify-between">
              <span className="text-gray-500">Monthly SIP</span>
              <span className="font-semibold text-[#0A2540]">₹10,000</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Investment Period</span>
              <span className="font-semibold text-[#0A2540]">20 Years</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Expected Return</span>
              <span className="font-semibold text-[#0A2540]">12% p.a.</span>
            </div>

          </div>

          {/* Graph Placeholder */}

          <div className="mt-10 h-44">
         <ResponsiveContainer width="100%" height="100%">
         <AreaChart data={seriesData}>
         <Area
        type="monotone"
        dataKey="wealth"
        stroke="#D4AF37"
        fill="#FDE68A"
        />
       </AreaChart>
      </ResponsiveContainer>
      </div>

        </div>

      </div>

    </div>
  </div>
</section>

    <section
    id="calculator"
     className="py-16 bg-gradient-to-b from-white to-blue-50">
    
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Tabs defaultValue="sip" className="w-full" data-testid="tools-tabs">

          <TabsList className="mx-auto inline-flex items-center justify-center rounded-full border 
          border-gray-200 bg-white p-1 shadow-lg">

            <TabsTrigger value="sip"className="rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 
            data-[state=active]:bg-[#0A2540] data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100"> SIP</TabsTrigger>

            <TabsTrigger value="ret" className="rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 
            data-[state=active]:bg-[#0A2540] data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100"> Retirement</TabsTrigger>

            <TabsTrigger value="goal" className="rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 
            data-[state=active]:bg-[#0A2540] data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100">Goal Planning</TabsTrigger>

            <TabsTrigger value="elss" className="rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 
            data-[state=active]:bg-[#0A2540] data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100"> ELSS</TabsTrigger>

            <TabsTrigger value="emi" className="rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 
            data-[state=active]:bg-[#0A2540] data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100"> EMI</TabsTrigger>
            </TabsList>
          <TabsContent value="sip" className="mt-8"><SIPCalc /></TabsContent>
          <TabsContent value="ret" className="mt-8"><RetirementCalc /></TabsContent>
          <TabsContent value="goal" className="mt-8"><GoalCalc /></TabsContent>
          <TabsContent value="elss" className="mt-8"><ELSSCalc /></TabsContent>
          <TabsContent value="emi" className="mt-8"><EMICalc /></TabsContent>
        </Tabs>
        <section className="mt-20 rounded-3xl bg-gradient-to-r from-blue-700 to-blue-900 text-white p-10 text-center">

  <h2 className="text-4xl font-bold">
    Need Personal Financial Guidance?
  </h2>

  <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
    Our financial experts can help you choose the right Mutual Funds,
    Insurance and Loan solutions based on your goals.
  </p>

  <div className="mt-8 flex flex-wrap justify-center gap-4">

    <a
      href="/contact"
      className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-300"
    >
      Book Free Consultation
    </a>

    <a
      href="https://wa.me/919490237465"
      className="border border-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-700"
    >
      WhatsApp Us
    </a>

  </div>

</section>

  {/* Financial Health Score */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-5">

    <div className="text-center mb-12">
      <p className="text-[#D4AF37] font-semibold uppercase tracking-wider">
        Financial Health Score
      </p>
      
      <h2 className="text-4xl font-bold text-[#0A2540] mt-2">
        Know Your Financial Health
      </h2>

      <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
        Get an instant financial score based on your savings,
        investments and monthly income.
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-10">

      {/* Left */}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8">

        <div className="mb-6">
          <label className="font-semibold text-[#0A2540]">
            Age
          </label>

          <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="mt-2 w-full rounded-xl border p-3"
          />
        
        </div>

        <div className="mb-6">
          <label className="font-semibold text-[#0A2540]">
            Monthly Income
          </label>

          <input
        type="number"
        value={income}
        onChange={(e) => setIncome(Number(e.target.value))}
        className="mt-2 w-full rounded-xl border p-3"
        />
        </div>

        <div className="mb-6">
          <label className="font-semibold text-[#0A2540]">
            Monthly Savings
          </label>

          <input
            type="number"
            value={savings}
            onChange={(e) => setSavings(Number(e.target.value))}
            className="mt-2 w-full rounded-xl border p-3"
          />
        </div>

        <div className="mb-8">
          <label className="font-semibold text-[#0A2540]">
            Current Investments
          </label>

         <input
          type="number"
           value={investment}
           onChange={(e) => setInvestment(Number(e.target.value))}
           className="mt-2 w-full rounded-xl border p-3"
          />
        </div>

        <button
       onClick={calculateScore}
        className="w-full py-4 rounded-xl bg-[#0A2540] text-white hover:bg-[#163B65]"
       >
       Calculate Score
     </button>

      </div>

      {/* Right */}

      <div className="rounded-3xl bg-gradient-to-br from-[#0A2540] to-[#163B65] text-white p-10 shadow-xl">

        <div className="text-center">

          <div className="text-7xl font-bold text-[#D4AF37]">
           {score}
           </div>

          <div className="text-xl mt-3">
            Financial Score
          </div>

          <div className="inline-block mt-6 bg-green-500 text-white px-5 py-2 rounded-full font-semibold">
        {scoreText()}
        
          </div>

        </div>

        <div className="mt-10 space-y-4">

          <div className="flex items-center justify-between">
            <span>Savings Habit</span>
            <span className="text-yellow-400 text-xl">
            {savingsStars()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Investment Discipline</span>
            <span className="text-yellow-400 text-xl">
              {investmentStars()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Emergency Fund</span>
            <span className="text-yellow-400 text-xl">
              {emergencyStars()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Insurance Protection</span>
            <span className="text-yellow-400 text-xl">
              {insuranceStars()}
            </span>
          </div>

        </div>

      </div>

    </div>

  </div>
</section>

   {/* Investment Comparison */}
<section className="py-20 bg-[#F8FAFC]">
  <div className="max-w-7xl mx-auto px-5">

    <div className="text-center mb-12">
      <p className="text-[#D4AF37] font-semibold uppercase tracking-widest">
        Investment Comparison
      </p>

      <h2 className="text-4xl font-bold text-[#0A2540] mt-2">
        Compare Investment Options
      </h2>

      <p className="text-gray-600 mt-4">
        Understand which investment option can help you achieve your financial goals.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <h3 className="text-xl font-bold text-[#0A2540]">SIP</h3>
        <p className="mt-3 text-gray-600">
          Long-term wealth creation through disciplined monthly investing.
        </p>
        <div className="mt-6 text-3xl font-bold text-[#16A34A]">
          ★★★★★
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <h3 className="text-xl font-bold text-[#0A2540]">Fixed Deposit</h3>
        <p className="mt-3 text-gray-600">
          Stable returns with lower risk but limited growth potential.
        </p>
        <div className="mt-6 text-3xl font-bold text-yellow-500">
          ★★★☆☆
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <h3 className="text-xl font-bold text-[#0A2540]">Gold</h3>
        <p className="mt-3 text-gray-600">
          Good for diversification and long-term value preservation.
        </p>
        <div className="mt-6 text-3xl font-bold text-yellow-500">
          ★★★★☆
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <h3 className="text-xl font-bold text-[#0A2540]">PPF</h3>
        <p className="mt-3 text-gray-600">
          Safe tax-saving investment backed by the Government of India.
        </p>
        <div className="mt-6 text-3xl font-bold text-green-600">
          ★★★★☆
        </div>
      </div>

    </div>

  </div>
</section>

     {/* Premium Features */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-5">

    <div className="text-center mb-14">
      <span className="text-[#D4AF37] font-semibold uppercase tracking-[0.2em]">
        Why Choose Our Tools
      </span>

      <h2 className="mt-3 text-4xl font-bold text-[#0A2540]">
        Smart Financial Planning Made Easy
      </h2>

      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        Powerful calculators designed to help you make better investment decisions.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

      <div className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">
          ⚡
        </div>

        <h3 className="mt-6 text-xl font-bold text-[#0A2540]">
          Instant Results
        </h3>

        <p className="mt-3 text-gray-600">
          Calculate SIP, EMI and retirement planning instantly.
        </p>
      </div>

      <div className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">
          📈
        </div>

        <h3 className="mt-6 text-xl font-bold text-[#0A2540]">
          Growth Charts
        </h3>

        <p className="mt-3 text-gray-600">
          Interactive charts visualize your future wealth.
        </p>
      </div>

      <div className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">
          🔒
        </div>

        <h3 className="mt-6 text-xl font-bold text-[#0A2540]">
          Safe & Secure
        </h3>

        <p className="mt-3 text-gray-600">
          Your financial information stays completely private.
        </p>
      </div>

      <div className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-lg 
      hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8E1] flex items-center justify-center text-3xl">
          👨‍💼
        </div>

        <h3 className="mt-6 text-xl font-bold text-[#0A2540]">
          Expert Guidance
        </h3>

        <p className="mt-3 text-gray-600">
          Connect with our advisor for personalized financial planning.
        </p>
      </div>

    </div>

  </div>
</section>

    {/* Download Report Section */}
<section className="py-20 bg-[#F8FAFC]">
  <div className="max-w-6xl mx-auto px-5">

    <div className="rounded-3xl bg-gradient-to-r from-[#0A2540] via-[#163B65] to-[#0A2540] p-10 lg:p-14 shadow-2xl">

      <div className="grid lg:grid-cols-2 gap-10 items-center">

        {/* Left */}

        <div>

          <span className="inline-block px-4 py-2 rounded-full bg-[#D4AF37] text-[#0A2540] font-semibold text-sm">
            FREE REPORT
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white">
            Download Your Financial Report
          </h2>

          <p className="mt-4 text-blue-100 leading-8">
            Get a personalized investment summary including SIP growth,
            retirement corpus, goal planning and expert recommendations.
          </p>

          <ul className="mt-8 space-y-3 text-white">

            <li>✅ SIP Projection Report</li>

            <li>✅ Retirement Planning Summary</li>

            <li>✅ Goal Based Investment Plan</li>

            <li>✅ Tax Saving Suggestions</li>

            <li>✅ Expert Financial Tips</li>

          </ul>

        </div>

        {/* Right */}

        <div className="bg-white rounded-3xl p-8 shadow-xl">

          <h3 className="text-2xl font-bold text-[#0A2540]">
            Get Your Free PDF
          </h3>

          <input
            type="text"
            placeholder="Full Name"
            className="mt-6 w-full border rounded-xl p-4"
          />

          <input
            type="tel"
            placeholder="Mobile Number"
            className="mt-4 w-full border rounded-xl p-4"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="mt-4 w-full border rounded-xl p-4"
          />

         <button
          onClick={downloadPDF}
          className="mt-6 w-full bg-[#D4AF37] hover:bg-[#C89B2A] text-[#0A2540] font-bold py-4 rounded-xl transition-all"
    >
         📄 Download Free PDF
</button> 

          <button
         onClick={() =>
         window.open(
         "https://wa.me/919490237465?text=Hi%20Fortune%20U%20Group,%20I%20want%20to%20book%20a%20free%20consultation.",
         "_blank"
       )
       }
       className="mt-4 w-full bg-[#0A2540] hover:bg-[#163B65] text-white font-bold py-4 rounded-xl transition-all"
      >
      📅 Book Free Consultation
       </button>

        </div>

      </div>

    </div>

  </div>
</section>

     {/* GOAL PLANNER */}

<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-5">

    <div className="text-center mb-14">

      <span className="text-[#D4AF37] font-semibold uppercase tracking-widest">
        Goal Planner
      </span>

      <h2 className="mt-3 text-4xl font-bold text-[#0A2540]">
        Plan Your Financial Goals
      </h2>

      <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
        Select your financial goal and calculate the monthly SIP required to achieve it.
      </p>

    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      <div className="rounded-3xl bg-white border border-gray-200 shadow-xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        <div className="text-5xl">🏠</div>
        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">
          Home Purchase
        </h3>
        <p className="mt-3 text-gray-600">
          Plan your dream home with systematic monthly investments.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-gray-200 shadow-xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        <div className="text-5xl">🎓</div>
        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">
          Child Education
        </h3>
        <p className="mt-3 text-gray-600">
          Secure your child's higher education with disciplined investing.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-gray-200 shadow-xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        <div className="text-5xl">💍</div>
        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">
          Marriage Planning
        </h3>
        <p className="mt-3 text-gray-600">
          Build a dedicated corpus for future family milestones.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-gray-200 shadow-xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        <div className="text-5xl">🚗</div>
        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">
          Car Purchase
        </h3>
        <p className="mt-3 text-gray-600">
          Plan your next vehicle purchase without financial stress.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-gray-200 shadow-xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        <div className="text-5xl">🏖️</div>
        <h3 className="mt-6 text-2xl font-bold text-[#0A2540]">
          Retirement
        </h3>
        <p className="mt-3 text-gray-600">
          Create long-term wealth for a comfortable retirement.
        </p>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-[#0A2540] to-[#163B65] text-white p-8 shadow-2xl">

        <h3 className="text-2xl font-bold">
          Need Personal Guidance?
        </h3>

        <p className="mt-4 text-blue-100">
          Speak with our financial advisor and receive a customized investment plan.
        </p>

        <button
        onClick={() =>
       window.open(
      "https://wa.me/919490237465?text=Hi%20Fortune%20U%20Group,%20I%20want%20to%20book%20a%20free%20consultation.",
      "_blank"
    )
  }
  className="mt-8 w-full bg-[#D4AF37] hover:bg-[#C89B2A] text-[#0A2540] font-bold py-4 rounded-xl"
>
  Book Free Consultation
</button>

      </div>

    </div>

  </div>
</section>
      </div>
    </section>
  </div>
  );
};

export default Tools;
