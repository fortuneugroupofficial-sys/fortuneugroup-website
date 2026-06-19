import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const load = () => api.get("/admin/leads").then(r => setLeads(r.data));
  useEffect(() => { load(); }, []);
  const updateStatus = async (id, status) => {
    await api.patch(`/admin/leads/${id}`, { status });
    toast.success("Lead updated"); load();
  };
  const del = async (id) => {
    await api.delete(`/admin/leads/${id}`);
    toast.success("Lead deleted"); load();
  };
  return (
    <div data-testid="admin-leads">
      <h1 className="font-display text-2xl text-brand-navy font-semibold">All Leads</h1>
      <p className="text-sm text-brand-mute mt-1">{leads.length} total submissions</p>
      <Card className="mt-6 bg-white border-brand-line overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left bg-brand-soft/60">
            <tr className="text-xs uppercase tracking-wider text-brand-navy">
              <th className="p-4">Name</th><th className="p-4">Type</th><th className="p-4">Contact</th><th className="p-4">Details</th><th className="p-4">Status</th><th className="p-4">Date</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map(l => (
              <tr key={l.id} className="border-t border-brand-line" data-testid={`lead-row-${l.id}`}>
                <td className="p-4 font-medium text-brand-navy">{l.name}</td>
                <td className="p-4 capitalize text-brand-mute">{l.type}</td>
                <td className="p-4 text-brand-mute">{l.mobile}<br/><span className="text-xs">{l.email || ""}</span></td>
                <td className="p-4 text-brand-mute text-xs max-w-xs">
                  {l.type === "consultation" && <>{l.city} · {l.financial_goal}</>}
                  {l.type === "sip" && <>Income: ₹{l.monthly_income} · SIP: ₹{l.sip_budget} · {l.goal_type}</>}
                  {l.type === "insurance" && <>Age {l.age} · {l.family_members} members · {l.coverage_requirement}</>}
                </td>
                <td className="p-4">
                  <Select value={l.status} onValueChange={(v)=>updateStatus(l.id, v)}>
                    <SelectTrigger className="h-8 w-32 text-xs" data-testid={`status-${l.id}`}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-4 text-brand-mute text-xs">{new Date(l.created_at).toLocaleDateString()}</td>
                <td className="p-4"><Button size="icon" variant="ghost" onClick={()=>del(l.id)} data-testid={`del-lead-${l.id}`}><Trash2 className="w-4 h-4 text-red-500" /></Button></td>
              </tr>
            ))}
            {leads.length === 0 && <tr><td colSpan="7" className="p-10 text-center text-brand-mute">No leads yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
export default Leads;
