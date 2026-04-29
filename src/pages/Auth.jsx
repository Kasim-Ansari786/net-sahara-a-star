import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast({ title: "Account created", description: "Ask an existing admin to grant you access." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/admin", { replace: true });
      }
    } catch (err) {
      toast({ title: "Authentication error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-hero-gradient flex items-center justify-center p-4 text-ivory">
      <div className="absolute inset-0 bg-radial-gold opacity-30 pointer-events-none" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 mb-8 justify-center">
          <div className="h-10 w-10 rounded-md bg-gold-gradient flex items-center justify-center shadow-gold">
            <span className="font-display text-navy-deep text-xl font-bold">A</span>
          </div>
          <div className="leading-tight text-left">
            <div className="font-display text-lg">A-Star Academy</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold/80">Admin Portal</div>
          </div>
        </Link>

        <div className="bg-card text-foreground rounded-2xl shadow-luxury border border-gold/30 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold mb-3">
              <Lock className="h-3.5 w-3.5" />
              {mode === "signin" ? "Sign In" : "Create Account"}
            </div>
            <h1 className="font-display text-2xl text-navy mb-6">
              {mode === "signin" ? "Welcome back" : "Request admin access"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="mt-5 text-sm text-muted-foreground hover:text-navy w-full text-center"
            >
              {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
            </button>
          </div>
        </div>

        <p className="text-xs text-ivory/60 text-center mt-6">
          New accounts have no admin access by default. An existing admin must grant the <code className="text-gold">admin</code> role.
        </p>
      </div>
    </main>
  );
};

export default Auth;
