import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Card } from "../../components/ui/card";
import { Users, Mail, FileText, MessageSquare, TrendingUp, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const Stat = ({ label, value, icon: Icon, color }) => (
  <Card className="p-5 bg-white border-brand-line" data-testid={`stat-${label}`}>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs uppercase tracking-wider text-brand-mute font-semibold">{label}</div>
        <div className="mt-1 font-display text-3xl font-semibold text-brand-navy">{value}</div>
      </div>
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}><Icon className="w-5 h-5" /></div>
    </div>
  </Card>
);

const Dashboard = () => {
  const [a, setA] = useState(null);
  useEffect(() => { api.get("/admin/analytics").then(r => setA(r.data)); }, []);
  if (!a) return <div className="text-brand-mute">Loading analytics…</div>;
  return (
    <div data-testid="admin-dashboard">
      <h1 className="font-display text-2xl text-brand-navy font-semibold">Welcome back</h1>
      <p className="text-sm text-brand-mute mt-1">Here's what's happening with Fortune U Group today.</p>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total Leads" value={a.total_leads} icon={Users} color="bg-brand-green/10 text-brand-deepgreen" />
        <Stat label="New Leads" value={a.new_leads} icon={TrendingUp} color="bg-brand-navy/10 text-brand-navy" />
        <Stat label="Converted" value={a.converted_leads} icon={CheckCircle2} color="bg-brand-green/10 text-brand-deepgreen" />
        <Stat label="Contacts" value={a.contacts} icon={Mail} color="bg-brand-navy/10 text-brand-navy" />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Card className="p-6 bg-white border-brand-line lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-brand-mute font-semibold">Leads · last 7 days</div>
              <div className="font-display text-lg text-brand-navy font-semibold">Activity trend</div>
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{borderRadius:8, borderColor:'#E2E8F0', fontSize:12}} />
                <Bar dataKey="count" fill="#10B981" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6 bg-white border-brand-line">
          <div className="text-xs uppercase tracking-wider text-brand-mute font-semibold">By type</div>
          <div className="font-display text-lg text-brand-navy font-semibold">Lead distribution</div>
          <div className="mt-5 space-y-4">
            {Object.entries(a.by_type).map(([k, v]) => (
              <div key={k}>
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize text-brand-navy font-medium">{k}</span>
                  <span className="text-brand-mute">{v}</span>
                </div>
                <div className="mt-1 h-2 bg-brand-soft rounded-full overflow-hidden">
                  <div className="h-full bg-brand-green" style={{width: `${Math.min(100, (v / Math.max(1, a.total_leads)) * 100)}%`}} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;
