import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const Contacts = () => {
  const [items, setItems] = useState([]);
  const load = () => api.get("/admin/contacts").then(r => setItems(r.data));
  useEffect(() => { load(); }, []);
  const del = async (id) => { await api.delete(`/admin/contacts/${id}`); toast.success("Deleted"); load(); };
  return (
    <div data-testid="admin-contacts">
      <h1 className="font-display text-2xl text-brand-navy font-semibold">Contact Messages</h1>
      <p className="text-sm text-brand-mute mt-1">{items.length} messages</p>
      <div className="mt-6 grid gap-4">
        {items.map(c => (
          <Card key={c.id} className="p-5 bg-white border-brand-line" data-testid={`contact-${c.id}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display font-semibold text-brand-navy">{c.name}</div>
                <div className="text-xs text-brand-mute">{c.mobile} · {c.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-brand-mute">{new Date(c.created_at).toLocaleString()}</span>
                <Button size="icon" variant="ghost" onClick={()=>del(c.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </div>
            <p className="mt-3 text-sm text-brand-ink whitespace-pre-line">{c.message}</p>
          </Card>
        ))}
        {items.length === 0 && <div className="text-center py-10 text-brand-mute">No messages yet.</div>}
      </div>
    </div>
  );
};
export default Contacts;
