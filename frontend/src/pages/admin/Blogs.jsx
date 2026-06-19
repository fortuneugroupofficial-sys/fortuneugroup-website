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

const empty = { title: "", excerpt: "", content: "", category: "Mutual Funds", cover_image: "", author: "Fortune U Team", published: true };

const Blogs = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState(empty);
  const [open, setOpen] = useState(false);
  const load = () => api.get("/admin/blogs").then(r => setItems(r.data));
  useEffect(() => { load(); }, []);
  const save = async () => {
    try {
      if (editing) await api.put(`/admin/blogs/${editing.id}`, f);
      else await api.post("/admin/blogs", f);
      toast.success("Saved"); setOpen(false); setEditing(null); setF(empty); load();
    } catch (e) { toast.error("Save failed"); }
  };
  const del = async (id) => { await api.delete(`/admin/blogs/${id}`); toast.success("Deleted"); load(); };
  const edit = (b) => { setEditing(b); setF({ title:b.title, excerpt:b.excerpt, content:b.content, category:b.category, cover_image:b.cover_image||"", author:b.author, published:b.published }); setOpen(true); };
  return (
    <div data-testid="admin-blogs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-brand-navy font-semibold">Blog Posts</h1>
          <p className="text-sm text-brand-mute mt-1">{items.length} posts</p>
        </div>
        <Dialog open={open} onOpenChange={(v)=>{setOpen(v); if(!v){setEditing(null); setF(empty);}}}>
          <DialogTrigger asChild>
            <Button className="bg-brand-navy hover:bg-brand-navy/90 rounded-full" data-testid="new-blog-btn"><Plus className="w-4 h-4 mr-1" /> New Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <Field label="Title" value={f.title} onChange={(v)=>setF({...f, title:v})} />
              <Field label="Category" value={f.category} onChange={(v)=>setF({...f, category:v})} />
              <Field label="Cover Image URL" value={f.cover_image} onChange={(v)=>setF({...f, cover_image:v})} />
              <Field label="Author" value={f.author} onChange={(v)=>setF({...f, author:v})} />
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Excerpt</Label>
                <Textarea rows={2} value={f.excerpt} onChange={(e)=>setF({...f, excerpt:e.target.value})} />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Content</Label>
                <Textarea rows={10} value={f.content} onChange={(e)=>setF({...f, content:e.target.value})} />
              </div>
              <Button onClick={save} data-testid="save-blog-btn" className="bg-brand-green hover:bg-brand-deepgreen">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {items.map(b => (
          <Card key={b.id} className="p-5 bg-white border-brand-line" data-testid={`blog-row-${b.id}`}>
            <div className="flex items-start gap-4">
              {b.cover_image && <img src={b.cover_image} alt="" className="w-20 h-20 object-cover rounded-md" />}
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider font-bold text-brand-green">{b.category}</div>
                <div className="font-display font-semibold text-brand-navy mt-1 line-clamp-2">{b.title}</div>
                <div className="text-xs text-brand-mute mt-1 line-clamp-2">{b.excerpt}</div>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="icon" variant="ghost" onClick={()=>edit(b)} data-testid={`edit-${b.id}`}><Edit3 className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={()=>del(b.id)} data-testid={`delete-${b.id}`}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange }) => (
  <div>
    <Label className="text-xs font-semibold uppercase tracking-wider">{label}</Label>
    <Input value={value} onChange={(e)=>onChange(e.target.value)} />
  </div>
);

export default Blogs;
