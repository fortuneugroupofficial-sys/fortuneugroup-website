import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Image as ImageIcon, Link as LinkIcon, Quote, Undo, Redo } from "lucide-react";
import api, { API } from "../lib/api";
import { toast } from "sonner";

const BtnGroup = ({ children }) => <div className="flex items-center gap-0.5 px-1 border-r border-brand-line last:border-r-0">{children}</div>;
const Btn = ({ active, onClick, children, title }) => (
  <button type="button" onClick={onClick} title={title}
    className={`p-1.5 rounded text-sm transition ${active ? "bg-brand-navy text-white" : "text-brand-mute hover:bg-brand-soft hover:text-brand-navy"}`}>
    {children}
  </button>
);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const TipTapEditor = ({ value, onChange }) => {
  const fileRef = useRef(null);
  const editor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: false }), Link.configure({ openOnClick: false })],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value === "", editor]);

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    const fd = new FormData(); fd.append("file", file);
    try {
      const { data } = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = `${BACKEND_URL}${data.url}`;
      editor?.chain().focus().setImage({ src: url, alt: file.name }).run();
      toast.success("Image inserted");
    } catch { toast.error("Upload failed"); }
    e.target.value = "";
  };

  const addLink = () => {
    const url = window.prompt("URL");
    if (!url) return;
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!editor) return null;
  return (
    <div className="border border-brand-line rounded-lg overflow-hidden bg-white" data-testid="tiptap-editor">
      <div className="flex flex-wrap items-center gap-0 border-b border-brand-line bg-brand-soft/40 px-2 py-1.5">
        <BtnGroup>
          <Btn active={editor.isActive("bold")} onClick={()=>editor.chain().focus().toggleBold().run()} title="Bold"><Bold className="w-4 h-4" /></Btn>
          <Btn active={editor.isActive("italic")} onClick={()=>editor.chain().focus().toggleItalic().run()} title="Italic"><Italic className="w-4 h-4" /></Btn>
        </BtnGroup>
        <BtnGroup>
          <Btn active={editor.isActive("heading", { level: 2 })} onClick={()=>editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2"><Heading2 className="w-4 h-4" /></Btn>
          <Btn active={editor.isActive("heading", { level: 3 })} onClick={()=>editor.chain().focus().toggleHeading({ level: 3 }).run()} title="H3"><Heading3 className="w-4 h-4" /></Btn>
        </BtnGroup>
        <BtnGroup>
          <Btn active={editor.isActive("bulletList")} onClick={()=>editor.chain().focus().toggleBulletList().run()} title="Bullets"><List className="w-4 h-4" /></Btn>
          <Btn active={editor.isActive("orderedList")} onClick={()=>editor.chain().focus().toggleOrderedList().run()} title="Numbered"><ListOrdered className="w-4 h-4" /></Btn>
          <Btn active={editor.isActive("blockquote")} onClick={()=>editor.chain().focus().toggleBlockquote().run()} title="Quote"><Quote className="w-4 h-4" /></Btn>
        </BtnGroup>
        <BtnGroup>
          <Btn onClick={addLink} active={editor.isActive("link")} title="Link"><LinkIcon className="w-4 h-4" /></Btn>
          <Btn onClick={()=>fileRef.current?.click()} title="Insert image"><ImageIcon className="w-4 h-4" /></Btn>
          <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} className="hidden" data-testid="tiptap-image-input" />
        </BtnGroup>
        <BtnGroup>
          <Btn onClick={()=>editor.chain().focus().undo().run()} title="Undo"><Undo className="w-4 h-4" /></Btn>
          <Btn onClick={()=>editor.chain().focus().redo().run()} title="Redo"><Redo className="w-4 h-4" /></Btn>
        </BtnGroup>
      </div>
      <EditorContent editor={editor} className="prose prose-sm max-w-none p-4 min-h-[280px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[260px] [&_img]:rounded-lg [&_img]:my-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-brand-navy [&_h2]:font-semibold [&_h3]:font-display [&_h3]:text-lg [&_blockquote]:border-l-4 [&_blockquote]:border-brand-green [&_blockquote]:pl-3 [&_blockquote]:italic [&_a]:text-brand-deepgreen [&_a]:underline" data-testid="tiptap-content" />
    </div>
  );
};

export default TipTapEditor;
