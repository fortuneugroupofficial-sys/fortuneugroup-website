import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { toast } from "sonner";

const empty = { name: "", role: "", content: "", rating: 5, avatar: "", published: true };

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState(empty);
  const [open, setOpen] = useState(false);
  const load = () => api.get("/admin/testimonials").then(r => setItems(r.data));
  useEffect(() => { load(); }, []);
  const save = async () => {
    try {
      const payload = { ...f, rating: Number(f.rating) };
      if (editing) await api.put(`/admin/testimonials/${editing.id}`, payload);
      else await api.post("/admin/testimonials", payload);
      toast.success("Saved"); setOpen(false); setEditing(null); setF(empty); load();
    } catch { toast.error("Save failed"); }
  };
  const del = async (id) => { await api.delete(`/admin/testimonials/${id}`); toast.success("Deleted"); load(); };
  return (
    <div data-testid="admin-testimonials">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-brand-navy font-semibold">Testimonials</h1>
          <p className="text-sm text-brand-mute mt-1">{items.length} entries</p>
        </div>
        <Dialog open={open} onOpenChange={(v)=>{setOpen(v); if(!v){setEditing(null); setF(empty);}}}>
          <DialogTrigger asChild><Button className="bg-brand-navy hover:bg-brand-navy/90 rounded-full" data-testid="new-test-btn"><Plus className="w-4 h-4 mr-1" /> New</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit" : "New Testimonial"}</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <Row label="Name"><Input value={f.name} onChange={(e)=>setF({...f, name:e.target.value})} /></Row>
              <Row label="Role"><Input value={f.role} onChange={(e)=>setF({...f, role:e.target.value})} /></Row>
              <Row label="Rating (1-5)"><Input type="number" min={1} max={5} value={f.rating} onChange={(e)=>setF({...f, rating:e.target.value})} /></Row>
              <Row label="Content"><Textarea rows={4} value={f.content} onChange={(e)=>setF({...f, content:e.target.value})} /></Row>
              <Button onClick={save} className="bg-brand-green hover:bg-brand-deepgreen">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {items.map(t => (
          <Card key={t.id} className="p-5 bg-white border-brand-line" data-testid={`test-row-${t.id}`}>
            <div className="flex justify-between">
              <div>
                <div className="font-display font-semibold text-brand-navy">{t.name}</div>
                <div className="text-xs text-brand-mute">{t.role}</div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={()=>{setEditing(t); setF({...t}); setOpen(true);}}><Edit3 className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={()=>del(t.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </div>
            <p className="mt-3 text-sm text-brand-mute line-clamp-3">"{t.content}"</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
const Row = ({ label, children }) => (<div><Label className="text-xs font-semibold uppercase tracking-wider">{label}</Label>{children}</div>);
export default Testimonials;
