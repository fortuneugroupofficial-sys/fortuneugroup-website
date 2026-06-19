import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Lock } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  if (user) return <Navigate to="/admin" replace />;
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await login(email, password); navigate("/admin"); }
    catch (err) {
      const msg = err.response?.data?.detail || "Invalid credentials";
      toast.error(typeof msg === "string" ? msg : "Login failed");
    }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-5" data-testid="admin-login-page">
      <div className="w-full max-w-md bg-white rounded-2xl border border-brand-line p-8 shadow-soft">
        <div className="w-12 h-12 rounded-xl bg-brand-soft text-brand-navy flex items-center justify-center"><Lock className="w-6 h-6" /></div>
        <h1 className="mt-5 font-display text-2xl text-brand-navy font-semibold">Admin Login</h1>
        <p className="mt-1 text-sm text-brand-mute">Fortune U Group · Internal dashboard</p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wider font-semibold text-brand-navy">Email</Label>
            <Input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 bg-brand-soft/40 border-brand-line" data-testid="login-email" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-semibold text-brand-navy">Password</Label>
            <Input required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 bg-brand-soft/40 border-brand-line" data-testid="login-password" />
          </div>
          <Button type="submit" disabled={loading} data-testid="login-submit" className="bg-brand-navy hover:bg-brand-navy/90 text-white rounded-full h-11 font-semibold">{loading ? "Logging in…" : "Login"}</Button>
        </form>
      </div>
    </div>
  );
};
export default Login;
