import React from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Users, FileText, MessageSquare, HelpCircle, Mail, LogOut } from "lucide-react";

const items = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/leads", icon: Users, label: "Leads" },
  { to: "/admin/contacts", icon: Mail, label: "Contacts" },
  { to: "/admin/blogs", icon: FileText, label: "Blogs" },
  { to: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { to: "/admin/faqs", icon: HelpCircle, label: "FAQs" },
];

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-mute">Loading…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return (
    <div className="min-h-screen bg-brand-bg flex" data-testid="admin-layout">
      <aside className="w-64 bg-brand-navy text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="font-display text-lg font-semibold">Fortune U</div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-brand-green font-bold">Admin Panel</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end} data-testid={`admin-nav-${it.label.toLowerCase()}`}
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}`}>
              <it.icon className="w-4 h-4" /> {it.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={()=>{logout(); navigate("/admin/login");}} data-testid="admin-logout" className="m-4 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 border border-white/10">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-brand-line h-14 flex items-center justify-between px-5 lg:px-8">
          <div className="font-display font-semibold text-brand-navy">Dashboard</div>
          <div className="text-xs text-brand-mute">{user.email}</div>
        </header>
        <div className="p-5 lg:p-8"><Outlet /></div>
      </div>
    </div>
  );
};

export default AdminLayout;
