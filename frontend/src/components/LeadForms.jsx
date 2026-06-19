import React, { useState } from "react";
import { submitLead } from "../lib/api";
import { trackEvent } from "./Analytics";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

const Field = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <Label className="text-xs uppercase tracking-wider font-semibold text-brand-navy">{label}</Label>
    <Input {...props} className="bg-brand-soft/40 border-brand-line focus-visible:ring-brand-green" />
  </div>
);

export const ConsultationForm = () => {
  const [f, setF] = useState({ name: "", mobile: "", email: "", city: "", financial_goal: "" });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await submitLead("consultation", f); trackEvent("generate_lead", { form_type: "consultation" });
      toast.success("Thanks! Our advisor will contact you shortly.");
      setF({ name: "", mobile: "", email: "", city: "", financial_goal: "" });
    } catch (err) { toast.error("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="grid gap-4" data-testid="consultation-form">
      <Field label="Full Name" required value={f.name} onChange={(e)=>setF({...f, name:e.target.value})} data-testid="consult-name" />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Mobile" required value={f.mobile} onChange={(e)=>setF({...f, mobile:e.target.value})} data-testid="consult-mobile" />
        <Field label="Email" type="email" required value={f.email} onChange={(e)=>setF({...f, email:e.target.value})} data-testid="consult-email" />
      </div>
      <Field label="City" required value={f.city} onChange={(e)=>setF({...f, city:e.target.value})} data-testid="consult-city" />
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider font-semibold text-brand-navy">Financial Goal</Label>
        <Select value={f.financial_goal} onValueChange={(v)=>setF({...f, financial_goal:v})}>
          <SelectTrigger data-testid="consult-goal" className="bg-brand-soft/40 border-brand-line"><SelectValue placeholder="Select your primary goal" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Retirement Planning">Retirement Planning</SelectItem>
            <SelectItem value="Child Education">Child Education</SelectItem>
            <SelectItem value="Home Purchase">Home Purchase</SelectItem>
            <SelectItem value="Wealth Creation">Wealth Creation</SelectItem>
            <SelectItem value="Tax Saving">Tax Saving</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading} data-testid="consult-submit" className="bg-brand-green hover:bg-brand-deepgreen text-white rounded-full h-11 text-sm font-semibold">
        {loading ? "Submitting…" : "Book Free Consultation"}
      </Button>
    </form>
  );
};

export const SIPRequestForm = () => {
  const [f, setF] = useState({ name: "", mobile: "", monthly_income: "", sip_budget: "", goal_type: "" });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await submitLead("sip", { ...f, monthly_income: Number(f.monthly_income), sip_budget: Number(f.sip_budget) }); trackEvent("generate_lead", { form_type: "sip" });
      toast.success("SIP plan request received!");
      setF({ name: "", mobile: "", monthly_income: "", sip_budget: "", goal_type: "" });
    } catch { toast.error("Could not submit. Try again."); }
    finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="grid gap-4" data-testid="sip-form">
      <Field label="Name" required value={f.name} onChange={(e)=>setF({...f, name:e.target.value})} data-testid="sip-name" />
      <Field label="Mobile" required value={f.mobile} onChange={(e)=>setF({...f, mobile:e.target.value})} data-testid="sip-mobile" />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Monthly Income (₹)" type="number" required value={f.monthly_income} onChange={(e)=>setF({...f, monthly_income:e.target.value})} data-testid="sip-income" />
        <Field label="Planned SIP Budget (₹)" type="number" required value={f.sip_budget} onChange={(e)=>setF({...f, sip_budget:e.target.value})} data-testid="sip-budget" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider font-semibold text-brand-navy">Goal Type</Label>
        <Select value={f.goal_type} onValueChange={(v)=>setF({...f, goal_type:v})}>
          <SelectTrigger data-testid="sip-goal" className="bg-brand-soft/40 border-brand-line"><SelectValue placeholder="Choose goal" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Wealth Creation">Wealth Creation</SelectItem>
            <SelectItem value="Retirement">Retirement</SelectItem>
            <SelectItem value="Child Future">Child Future</SelectItem>
            <SelectItem value="Tax Saving">Tax Saving</SelectItem>
            <SelectItem value="Home / Vehicle">Home / Vehicle</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading} data-testid="sip-submit" className="bg-brand-navy hover:bg-brand-navy/90 text-white rounded-full h-11 text-sm font-semibold">
        {loading ? "Submitting…" : "Get My SIP Plan"}
      </Button>
    </form>
  );
};

export const InsuranceForm = () => {
  const [f, setF] = useState({ name: "", mobile: "", age: "", family_members: "", coverage_requirement: "" });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await submitLead("insurance", { ...f, age: Number(f.age), family_members: Number(f.family_members) }); trackEvent("generate_lead", { form_type: "insurance" });
      toast.success("Request received! Our insurance advisor will call you.");
      setF({ name: "", mobile: "", age: "", family_members: "", coverage_requirement: "" });
    } catch { toast.error("Could not submit. Try again."); }
    finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="grid gap-4" data-testid="insurance-form">
      <Field label="Name" required value={f.name} onChange={(e)=>setF({...f, name:e.target.value})} data-testid="ins-name" />
      <Field label="Mobile" required value={f.mobile} onChange={(e)=>setF({...f, mobile:e.target.value})} data-testid="ins-mobile" />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Age" type="number" required value={f.age} onChange={(e)=>setF({...f, age:e.target.value})} data-testid="ins-age" />
        <Field label="Family Members" type="number" required value={f.family_members} onChange={(e)=>setF({...f, family_members:e.target.value})} data-testid="ins-members" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider font-semibold text-brand-navy">Coverage Requirement</Label>
        <Textarea required value={f.coverage_requirement} onChange={(e)=>setF({...f, coverage_requirement:e.target.value})} data-testid="ins-cov" className="bg-brand-soft/40 border-brand-line focus-visible:ring-brand-green" placeholder="e.g., ₹10L health cover for family of 4" />
      </div>
      <Button type="submit" disabled={loading} data-testid="ins-submit" className="bg-brand-green hover:bg-brand-deepgreen text-white rounded-full h-11 text-sm font-semibold">
        {loading ? "Submitting…" : "Request Insurance Guidance"}
      </Button>
    </form>
  );
};
