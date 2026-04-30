import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, LogOut, Search, ShieldAlert, RefreshCw, CheckCircle2, Circle, Users, Plus, Trash2 } from "lucide-react";

const UNASSIGNED = "__unassigned__";
const ALL_ASSIGNEES = "__all__";

const csvEscape = (v) => {
  const s = v === null || v === undefined ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [counsellorFilter, setCounsellorFilter] = useState(ALL_ASSIGNEES);
  const [query, setQuery] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [newC, setNewC] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/auth", { replace: true });
        return;
      }
      setUserEmail(sessionData.session.user.email ?? null);

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sessionData.session.user.id);

      if (cancelled) return;
      const admin = (roles ?? []).some((r) => r.role === "admin");
      setIsAdmin(admin);
      setChecking(false);
      if (admin) {
        loadRegistrations();
        loadCounsellors();
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/auth", { replace: true });
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRegistrations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    setLoading(false);
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
      return;
    }
    setRows(data);
  };

  const loadCounsellors = async () => {
    const { data, error } = await supabase
      .from("counsellors")
      .select("*")
      .order("name", { ascending: true });
    if (error) {
      toast({ title: "Failed to load counsellors", description: error.message, variant: "destructive" });
      return;
    }
    setCounsellors(data);
  };

  const counsellorMap = useMemo(() => {
    const m = new Map();
    counsellors.forEach((c) => m.set(c.id, c));
    return m;
  }, [counsellors]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "paid" && r.payment_status !== "paid") return false;
      if (filter === "unpaid" && r.payment_status === "paid") return false;
      if (counsellorFilter === UNASSIGNED && r.assigned_counsellor_id) return false;
      if (counsellorFilter !== ALL_ASSIGNEES && counsellorFilter !== UNASSIGNED && r.assigned_counsellor_id !== counsellorFilter) return false;
      if (!q) return true;
      return (
        r.student_name.toLowerCase().includes(q) ||
        r.parent_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.mobile.includes(q) ||
        r.city.toLowerCase().includes(q)
      );
    });
  }, [rows, filter, counsellorFilter, query]);

  const stats = useMemo(() => {
    const paid = rows.filter((r) => r.payment_status === "paid").length;
    const revenue = rows
      .filter((r) => r.payment_status === "paid")
      .reduce((sum, r) => sum + (r.payment_amount ?? 0), 0);
    const unassigned = rows.filter((r) => !r.assigned_counsellor_id).length;
    return { total: rows.length, paid, unpaid: rows.length - paid, revenue, unassigned };
  }, [rows]);

  const exportCsv = () => {
    if (filtered.length === 0) {
      toast({ title: "Nothing to export", description: "No registrations match the current filter." });
      return;
    }
    const headers = [
      "Created", "Student Name", "Parent Name", "Mobile", "WhatsApp", "Email",
      "City", "12th Status", "Stream", "Career Interest", "Priority",
      "Payment Status", "Amount (₹)", "Payment ID", "Exam ID", "Assigned Counsellor",
    ];
    const lines = [
      headers.join(","),
      ...filtered.map((r) =>
        [
          new Date(r.created_at).toISOString(),
          r.student_name, r.parent_name, r.mobile, r.whatsapp, r.email,
          r.city, r.twelfth_status, r.stream, r.career_interest, r.matters_most,
          r.payment_status, r.payment_amount, r.payment_id, r.exam_id,
          r.assigned_counsellor_id ? counsellorMap.get(r.assigned_counsellor_id)?.name ?? "" : "",
        ].map(csvEscape).join(","),
      ),
    ];
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `astar-registrations-${filter}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Export complete", description: `${filtered.length} rows downloaded.` });
  };

  const togglePayment = async (row) => {
    const next = row.payment_status === "paid" ? "unpaid" : "paid";
    const { error } = await supabase
      .from("registrations")
      .update({ payment_status: next })
      .eq("id", row.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, payment_status: next } : r)));
  };

  const assignCounsellor = async (row, value) => {
    const next = value === UNASSIGNED ? null : value;
    const { error } = await supabase
      .from("registrations")
      .update({ assigned_counsellor_id: next })
      .eq("id", row.id);
    if (error) {
      toast({ title: "Assignment failed", description: error.message, variant: "destructive" });
      return;
    }
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, assigned_counsellor_id: next } : r)));
    toast({
      title: "Lead assigned",
      description: next ? `Assigned to ${counsellorMap.get(next)?.name ?? "counsellor"}.` : "Unassigned.",
    });
  };

  const addCounsellor = async () => {
    const name = newC.name.trim();
    if (name.length < 2) {
      toast({ title: "Name required", description: "Counsellor name must be at least 2 characters.", variant: "destructive" });
      return;
    }
    const { data, error } = await supabase
      .from("counsellors")
      .insert({ name, email: newC.email.trim() || null, phone: newC.phone.trim() || null })
      .select()
      .single();
    if (error) {
      toast({ title: "Failed to add", description: error.message, variant: "destructive" });
      return;
    }
    setCounsellors((cs) => [...cs, data].sort((a, b) => a.name.localeCompare(b.name)));
    setNewC({ name: "", email: "", phone: "" });
    toast({ title: "Counsellor added", description: name });
  };

  const removeCounsellor = async (id) => {
    const { error } = await supabase.from("counsellors").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setCounsellors((cs) => cs.filter((c) => c.id !== id));
    setRows((rs) => rs.map((r) => (r.assigned_counsellor_id === id ? { ...r, assigned_counsellor_id: null } : r)));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  if (checking) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-section-gradient flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-card border border-border rounded-2xl p-10 shadow-elegant">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-5">
            <ShieldAlert className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="font-display text-2xl text-navy mb-3">Access Restricted</h1>
          <p className="text-muted-foreground mb-6">
            You're signed in as <span className="text-navy font-medium">{userEmail}</span>, but this account doesn't have admin access yet.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            An existing admin must grant your account the <code className="text-navy">admin</code> role from the backend.
          </p>
          <Button variant="navy" onClick={signOut} className="w-full">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-section-gradient">
      {/* Header */}
      <header className="bg-navy text-ivory border-b border-gold/30">
        <div className="container py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-gold-gradient flex items-center justify-center shadow-gold">
              <span className="font-display text-navy-deep text-xl font-bold">A</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg">Admin Dashboard</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold/80">A-Star Academy</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-ivory/70 hidden sm:inline">{userEmail}</span>
            <Button variant="outline-ivory" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 sm:py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Leads", value: stats.total, accent: false },
            { label: "Paid", value: stats.paid, accent: true },
            { label: "Unpaid", value: stats.unpaid, accent: false },
            { label: "Unassigned", value: stats.unassigned, accent: false },
            { label: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, accent: true },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-xl p-5 border ${s.accent ? "bg-dark-card text-ivory border-gold/30 shadow-gold" : "bg-card border-border shadow-card-soft"}`}
            >
              <div className={`text-xs uppercase tracking-[0.2em] mb-2 ${s.accent ? "text-gold" : "text-muted-foreground"}`}>
                {s.label}
              </div>
              <div className={`font-display text-3xl ${s.accent ? "text-ivory" : "text-navy"}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-card border border-border rounded-xl p-4 mb-5 shadow-card-soft">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, mobile, city..."
                className="pl-9"
              />
            </div>
            <Select value={filter} onValueChange={(v) => setFilter(v)}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({rows.length})</SelectItem>
                <SelectItem value="paid">Paid ({stats.paid})</SelectItem>
                <SelectItem value="unpaid">Unpaid ({stats.unpaid})</SelectItem>
              </SelectContent>
            </Select>
            <Select value={counsellorFilter} onValueChange={setCounsellorFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Counsellor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_ASSIGNEES}>All counsellors</SelectItem>
                <SelectItem value={UNASSIGNED}>Unassigned ({stats.unassigned})</SelectItem>
                {counsellors.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={manageOpen} onOpenChange={setManageOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Counsellors</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display text-navy">Manage Counsellors</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add new counsellor</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input placeholder="Name" value={newC.name} onChange={(e) => setNewC({ ...newC, name: e.target.value })} />
                      <Input placeholder="Email" value={newC.email} onChange={(e) => setNewC({ ...newC, email: e.target.value })} />
                      <Input placeholder="Phone" value={newC.phone} onChange={(e) => setNewC({ ...newC, phone: e.target.value })} />
                    </div>
                    <Button variant="navy" size="sm" onClick={addCounsellor} className="w-full sm:w-auto">
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="text-sm text-muted-foreground mb-2">{counsellors.length} counsellor(s)</div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {counsellors.length === 0 && (
                        <div className="text-sm text-muted-foreground text-center py-4">No counsellors yet.</div>
                      )}
                      {counsellors.map((c) => (
                        <div key={c.id} className="flex items-center justify-between gap-3 p-2 rounded-md bg-muted/40">
                          <div className="min-w-0">
                            <div className="font-medium text-navy text-sm truncate">{c.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {c.email || "—"} · {c.phone || "—"}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeCounsellor(c.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setManageOpen(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => { loadRegistrations(); loadCounsellors(); }} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="gold" onClick={exportCsv}>
              <Download className="h-4 w-4" />
              Export CSV ({filtered.length})
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card-soft">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className="w-[200px]">Counsellor</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead className="text-right">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      {loading ? "Loading..." : "No registrations match the current filter."}
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell>
                      <button onClick={() => togglePayment(r)} className="inline-flex items-center gap-1.5">
                        {r.payment_status === "paid" ? (
                          <Badge className="bg-gold-gradient text-navy-deep border-0 hover:opacity-90">
                            <CheckCircle2 className="h-3 w-3" /> Paid
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground hover:bg-muted">
                            <Circle className="h-3 w-3" /> Unpaid
                          </Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-navy">{r.student_name}</div>
                      <div className="text-xs text-muted-foreground">{r.stream} · {r.twelfth_status}</div>
                    </TableCell>
                    <TableCell className="text-sm">{r.parent_name}</TableCell>
                    <TableCell className="text-sm">
                      <div>{r.mobile}</div>
                      <div className="text-xs text-muted-foreground">{r.email}</div>
                    </TableCell>
                    <TableCell className="text-sm">{r.city}</TableCell>
                    <TableCell>
                      <Select
                        value={r.assigned_counsellor_id ?? UNASSIGNED}
                        onValueChange={(v) => assignCounsellor(r, v)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Unassigned" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                          {counsellors.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm capitalize">{r.career_interest}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Click any payment badge to toggle status. Use the Counsellors button to add or remove counsellors.
        </p>
      </div>
    </main>
  );
};

export default Admin;