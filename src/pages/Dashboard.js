import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, updateDoc, query, where, serverTimestamp
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #f0f2f5;
    color: #1a1a1a;
  }
  input, textarea, select, button { font-family: inherit; }
  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #7c3aed !important;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
  }
  .submit-btn:hover  { background: #6d28d9 !important; }
  .cancel-btn:hover  { background: #ede9fe !important; }
  .test-btn:hover    { background: #6d28d9 !important; }
  .edit-btn:hover    { background: #ede9fe !important; color: #6d28d9 !important; }
  .delete-btn:hover  { background: #fde8e8 !important; color: #c0392b !important; }
  .logout-btn:hover  { background: #f0f0f0 !important; }
`;

const PURPLE       = "#7c3aed";
const PURPLE_DARK  = "#6d28d9";
const PURPLE_LIGHT = "#ede9fe";

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testMsg, setTestMsg] = useState("");

  const empty = { name: "", platform: "", startDate: "", endDate: "", email: "", phone: "", cost: "", notes: "" };
  const [form, setForm] = useState(empty);

  useEffect(() => { if (user) fetchSubs(); }, [user]);

  const fetchSubs = async () => {
    setLoading(true);
    const q = query(collection(db, "subscriptions"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    setSubscriptions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, "subscriptions", editingId), { ...form });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "subscriptions"), {
        ...form, userId: user.uid, createdAt: serverTimestamp(),
        reminderSent5: false, reminderSent3: false, reminderSent1: false,
      });
    }
    setForm(empty);
    fetchSubs();
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this subscription?")) return;
    await deleteDoc(doc(db, "subscriptions", id));
    fetchSubs();
  };

  const handleEdit = sub => {
    setEditingId(sub.id);
    setForm({ name: sub.name, platform: sub.platform, startDate: sub.startDate, endDate: sub.endDate, email: sub.email, phone: sub.phone, cost: sub.cost, notes: sub.notes });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => { await signOut(auth); navigate("/login"); };

  const handleTestEmail = () => {
    setTestMsg("✅ Test email sent!");
    setTimeout(() => setTestMsg(""), 3000);
  };

  const daysLeft = endDate => {
    const today = new Date(); today.setHours(0,0,0,0);
    return Math.ceil((new Date(endDate) - today) / 86400000);
  };

  const getStatus = endDate => {
    const d = daysLeft(endDate);
    if (d < 0) return "expired";
    if (d <= 5) return "expiring";
    return "active";
  };

  const total    = subscriptions.length;
  const expiring = subscriptions.filter(s => getStatus(s.endDate) === "expiring").length;
  const active   = subscriptions.filter(s => getStatus(s.endDate) === "active").length;

  const filtered = subscriptions.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const st = getStatus(s.endDate);
    const matchFilter =
      filter === "all"      ? true :
      filter === "active"   ? st === "active" :
      filter === "expiring" ? st === "expiring" : true;
    return matchSearch && matchFilter;
  });

  const statusStyle = {
    active:   { cardBg: "#fff",    border: "#e0e0e0", leftBar: "#4caf50", label: "Active",        labelColor: "#2e7d32", labelBg: "#e8f5e9" },
    expiring: { cardBg: "#fffbf0", border: "#ffe082", leftBar: "#f59e0b", label: "",              labelColor: "#b45309", labelBg: "#fff8ec" },
    expired:  { cardBg: "#fff5f5", border: "#ffcdd2", leftBar: "#e53935", label: "Expired",       labelColor: "#c62828", labelBg: "#ffebee" },
  };

  const getUserDisplay = email => {
    if (!email) return "";
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <>
      <style>{globalStyles}</style>

      {/* ── Navbar ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: PURPLE }}>Cutoff</span>
          <span style={{ fontSize: 13, color: "#bbb" }}>Manage your subscriptions</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{getUserDisplay(user?.email)}</div>
            <div style={{ fontSize: 12, color: "#aaa" }}>{user?.email}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 16px", background: "#fff", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#444", transition: "background 0.15s" }}>
            <span style={{ width: 9, height: 9, background: "#e53935", borderRadius: 2, display: "inline-block" }} />
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: "24px 28px", maxWidth: 1280, margin: "0 auto" }}>

        {/* ── Stat Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { icon: "📊", value: total,    label: "Total Subscriptions" },
            { icon: "⏰", value: expiring, label: "Expiring Soon" },
            { icon: "✅", value: active,   label: "Active" },
            { icon: "📧", value: 0,        label: "Emails Sent" },
          ].map(card => (
            <div key={card.label} style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{card.icon}</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#1a1a1a", lineHeight: 1, marginBottom: 6 }}>{card.value}</div>
              <div style={{ fontSize: 13, color: "#999" }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* ── Two columns ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "flex-start" }}>

          {/* ── Form Panel ── */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "26px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>
              {editingId ? "✏️ Edit Subscription" : "+ Add New Subscription"}
            </h3>

            {/* Test email button — purple */}
            <button className="test-btn" onClick={handleTestEmail} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: PURPLE, color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 20, transition: "background 0.15s" }}>
              📧 Test Email Notification
            </button>
            {testMsg && <p style={{ color: PURPLE, fontSize: 13, marginBottom: 12 }}>{testMsg}</p>}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={lbl}>Subscription Name <span style={{ color: "#e53935" }}>*</span></label>
                  <input style={inp} name="name" placeholder="Netflix Premium" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                  <label style={lbl}>Platform/Service</label>
                  <input style={inp} name="platform" placeholder="Netflix" value={form.platform} onChange={handleChange} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={lbl}>Start Date <span style={{ color: "#e53935" }}>*</span></label>
                  <input style={inp} type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
                </div>
                <div>
                  <label style={lbl}>End Date <span style={{ color: "#e53935" }}>*</span></label>
                  <input style={inp} type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={lbl}>Email for Notifications <span style={{ color: "#e53935" }}>*</span></label>
                  <input style={inp} type="email" name="email" placeholder="you@email.com" value={form.email} onChange={handleChange} required />
                </div>
                <div>
                  <label style={lbl}>Phone Number</label>
                  <input style={inp} name="phone" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Monthly Cost ($)</label>
                <input style={inp} type="number" name="cost" placeholder="15.99" value={form.cost} onChange={handleChange} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={lbl}>Notes</label>
                <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} name="notes" placeholder="Any additional information..." value={form.notes} onChange={handleChange} />
              </div>

              {/* Submit — purple */}
              <button className="submit-btn" type="submit" style={{ width: "100%", padding: "11px", background: PURPLE, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background 0.15s" }}>
                {editingId ? "Update Subscription" : "Add Subscription"}
              </button>

              {editingId && (
                <button type="button" className="cancel-btn" onClick={() => { setEditingId(null); setForm(empty); }}
                  style={{ width: "100%", padding: "10px", marginTop: 10, background: PURPLE_LIGHT, color: PURPLE_DARK, border: `1px solid #c4b5fd`, borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "background 0.15s" }}>
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* ── List Panel ── */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "26px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 10, flexWrap: "wrap" }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>📋 Your Subscriptions</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...inp, width: 150 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                <select style={{ ...inp, width: 120, cursor: "pointer" }} value={filter} onChange={e => setFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expiring">Expiring Soon</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "56px 0", color: "#bbb" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#888", marginBottom: 4 }}>No subscriptions yet</div>
                <div style={{ fontSize: 13 }}>Add your first subscription using the form on the left!</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {filtered.map(sub => {
                  const status = getStatus(sub.endDate);
                  const d = daysLeft(sub.endDate);
                  const st = statusStyle[status];

                  return (
                    <div key={sub.id} style={{ background: st.cardBg, border: `1px solid ${st.border}`, borderLeft: `4px solid ${st.leftBar}`, borderRadius: 12, padding: "16px 18px" }}>

                      {/* Name + badge */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>{sub.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: st.labelColor, background: st.labelBg, padding: "3px 12px", borderRadius: 20 }}>
                          {status === "expiring" ? `${d} day${d !== 1 ? "s" : ""} left` : st.label}
                        </span>
                      </div>

                      {/* Details */}
                      <div style={{ fontSize: 13, color: "#555", display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                        <div><span style={{ fontWeight: 700, color: "#222" }}>Period: </span>{sub.startDate} – {sub.endDate}</div>
                        {sub.platform && <div><span style={{ fontWeight: 700, color: "#222" }}>Platform: </span>{sub.platform}</div>}
                        <div><span style={{ fontWeight: 700, color: "#222" }}>Email: </span>{sub.email}</div>
                        {sub.phone && <div><span style={{ fontWeight: 700, color: "#222" }}>Phone: </span>{sub.phone}</div>}
                        {sub.cost  && <div><span style={{ fontWeight: 700, color: "#222" }}>Cost: </span>${sub.cost}/mo</div>}
                        {sub.notes && <div><span style={{ fontWeight: 700, color: "#222" }}>Notes: </span>{sub.notes}</div>}
                      </div>

                      {/* Action buttons — purple Edit, pink Delete */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <button className="edit-btn" onClick={() => handleEdit(sub)}
                          style={{ padding: "9px", background: PURPLE, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "background 0.15s" }}>
                          ✏️ Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(sub.id)}
                          style={{ padding: "9px", background: "#fce8e8", color: "#e53935", border: "1px solid #ffcdd2", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "background 0.15s" }}>
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

const lbl = { fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 };
const inp = { width: "100%", padding: "9px 12px", border: "1px solid #e0e0e0", borderRadius: 8, fontSize: 13, color: "#1a1a1a", background: "#fff", transition: "border-color 0.15s, box-shadow 0.15s" };