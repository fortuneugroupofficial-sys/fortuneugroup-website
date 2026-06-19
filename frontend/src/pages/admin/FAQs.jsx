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

const empty = { question: "", answer: "", order: 0, published: true };

const FAQs = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState(empty);
  const [open, setOpen] = useState(false);
  const load = () => api.get("/admin/faqs").then(r => setItems(r.data));
  useEffect(() => { load(); }, []);
  const save = async () => {
    try {
      const payload = { ...f, order: Number(f.order) };
      if (editing) await api.put(`/admin/faqs/${editing.id}`, payload);
      else await api.post("/admin/faqs", payload);
      toast.success("Saved"); setOpen(false); setEditing(null); setF(empty); load();
    } catch { toast.error("Failed"); }
  };
  const del = async (id) => { await api.delete(`/admin/faqs/${id}`); toast.success("Deleted"); load(); };
  return (
    <div data-testid="admin-faqs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-brand-navy font-semibold">FAQs</h1>
          <p className="text-sm text-brand-mute mt-1">{items.length} items</p>
        </div>
        <Dialog open={open} onOpenChange={(v)=>{setOpen(v); if(!v){setEditing(null); setF(empty);}}}>
          <DialogTrigger asChild><Button className="bg-brand-navy hover:bg-brand-navy/90 rounded-full" data-testid="new-faq-btn"><Plus className="w-4 h-4 mr-1" /> New</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit FAQ" : "New FAQ"}</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <Row label="Question"><Input value={f.question} onChange={(e)=>setF({...f, question:e.target.value})} /></Row>
              <Row label="Answer"><Textarea rows={4} value={f.answer} onChange={(e)=>setF({...f, answer:e.target.value})} /></Row>
              <Row label="Order"><Input type="number" value={f.order} onChange={(e)=>setF({...f, order:e.target.value})} /></Row>
              <Button onClick={save} className="bg-brand-green hover:bg-brand-deepgreen">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-6 grid gap-3">
        {items.map(q => (
          <Card key={q.id} className="p-5 bg-white border-brand-line" data-testid={`faq-row-${q.id}`}>
            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <div className="font-display font-semibold text-brand-navy">{q.question}</div>
                <p className="text-sm text-brand-mute mt-1">{q.answer}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="icon" variant="ghost" onClick={()=>{setEditing(q); setF({...q}); setOpen(true);}}><Edit3 className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={()=>del(q.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
const Row = ({ label, children }) => (<div><Label className="text-xs font-semibold uppercase tracking-wider">{label}</Label>{children}</div>);
export default FAQs;
