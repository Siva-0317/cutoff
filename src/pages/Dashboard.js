import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, updateDoc, query, where, serverTimestamp
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "", platform: "", startDate: "", endDate: "",
    email: "", phone: "", cost: "", notes: ""
  });

  // Load subscriptions from Firestore
  useEffect(() => {
    if (!user) return;
    fetchSubscriptions();
  }, [user]);

  const fetchSubscriptions = async () => {
    const q = query(collection(db, "subscriptions"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSubscriptions(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, "subscriptions", editingId), { ...form });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "subscriptions"), {
        ...form,
        userId: user.uid,
        createdAt: serverTimestamp(),
        reminderSent5: false,
        reminderSent3: false,
        reminderSent1: false,
      });
    }
    setForm({ name: "", platform: "", startDate: "", endDate: "", email: "", phone: "", cost: "", notes: "" });
    fetchSubscriptions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subscription?")) return;
    await deleteDoc(doc(db, "subscriptions", id));
    fetchSubscriptions();
  };

  const handleEdit = (sub) => {
    setEditingId(sub.id);
    setForm({
      name: sub.name, platform: sub.platform, startDate: sub.startDate,
      endDate: sub.endDate, email: sub.email, phone: sub.phone,
      cost: sub.cost, notes: sub.notes
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // Helper: days left from today
  const daysLeft = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  };

  const getStatus = (endDate) => {
    const d = daysLeft(endDate);
    if (d < 0) return "expired";
    if (d <= 5) return "expiring";
    return "active";
  };

  // Stats
  const total = subscriptions.length;
  const active = subscriptions.filter(s => getStatus(s.endDate) === "active").length;
  const expiring = subscriptions.filter(s => getStatus(s.endDate) === "expiring").length;

  // Filtered list
  const filtered = subscriptions.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const status = getStatus(s.endDate);
    const matchFilter =
      filter === "all" ? true :
      filter === "active" ? status === "active" :
      filter === "expiring" ? status === "expiring" : true;
    return matchSearch && matchFilter;
  });

  const statusColor = { active: "#1a7f6e", expiring: "#d97706", expired: "#e53e3e" };
  const statusBg   = { active: "#e8f5f2", expiring: "#fef3c7", expired: "#fff0f0" };

  return (
    <div style={s.page}>
      {/* Navbar */}
      <div style={s.navbar}>
        <span style={s.logo}>Cutoff</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={s.userText}>{user?.email}</span>
          <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={s.body}>
        {/* Stat Cards */}
        <div style={s.statsRow}>
          {[
            { label: "Total Subscriptions", value: total },
            { label: "Active", value: active },
            { label: "Expiring Soon", value: expiring },
          ].map((stat) => (
            <div key={stat.label} style={s.statCard}>
              <div style={s.statNum}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={s.mainRow}>
          {/* Form */}
          <div style={s.formCard}>
            <h3 style={s.cardTitle}>
              {editingId ? "✏️ Edit Subscription" : "+ Add New Subscription"}
            </h3>
            <form onSubmit={handleSubmit} style={s.form}>
              {[
                { label: "Subscription Name *", name: "name", placeholder: "Netflix Premium", required: true },
                { label: "Platform / Service", name: "platform", placeholder: "Netflix" },
                { label: "Start Date *", name: "startDate", type: "date", required: true },
                { label: "End Date *", name: "endDate", type: "date", required: true },
                { label: "Email for Notifications *", name: "email", type: "email", placeholder: "you@email.com", required: true },
                { label: "Phone Number", name: "phone", placeholder: "+91 9876543210" },
                { label: "Monthly Cost (₹)", name: "cost", type: "number", placeholder: "299" },
              ].map(({ label, name, type = "text", placeholder, required }) => (
                <div key={name} style={s.fieldGroup}>
                  <label style={s.label}>{label}</label>
                  <input
                    style={s.input}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={handleChange}
                    required={required}
                  />
                </div>
              ))}
              <div style={s.fieldGroup}>
                <label style={s.label}>Notes</label>
                <textarea
                  style={{ ...s.input, minHeight: 80, resize: "vertical" }}
                  name="notes"
                  placeholder="Any additional info..."
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" style={s.submitBtn}>
                {editingId ? "Update Subscription" : "Add Subscription"}
              </button>
              {editingId && (
                <button type="button" style={s.cancelBtn}
                  onClick={() => { setEditingId(null); setForm({ name: "", platform: "", startDate: "", endDate: "", email: "", phone: "", cost: "", notes: "" }); }}>
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Subscriptions List */}
          <div style={s.listCard}>
            <div style={s.listHeader}>
              <h3 style={s.cardTitle}>Your Subscriptions</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  style={{ ...s.input, width: 160, margin: 0 }}
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <select style={{ ...s.input, margin: 0 }} value={filter} onChange={e => setFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="expiring">Expiring Soon</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={s.empty}>
                <p style={{ fontSize: 40 }}>📋</p>
                <p>No subscriptions yet</p>
                <p style={{ fontSize: 13, color: "#aaa" }}>Add your first one using the form</p>
              </div>
            ) : (
              filtered.map(sub => {
                const status = getStatus(sub.endDate);
                const d = daysLeft(sub.endDate);
                return (
                  <div key={sub.id} style={s.subCard}>
                    <div style={s.subTop}>
                      <div>
                        <span style={s.subName}>{sub.name}</span>
                        {sub.platform && <span style={s.subPlatform}> · {sub.platform}</span>}
                      </div>
                      <span style={{ ...s.badge, background: statusBg[status], color: statusColor[status] }}>
                        {status === "active" ? "Active" : status === "expiring" ? `${d}d left` : "Expired"}
                      </span>
                    </div>
                    <div style={s.subMeta}>
                      <span>📅 Ends {sub.endDate}</span>
                      {sub.cost && <span>₹{sub.cost}/mo</span>}
                      <span>✉️ {sub.email}</span>
                    </div>
                    {sub.notes && <p style={s.subNotes}>{sub.notes}</p>}
                    <div style={s.subActions}>
                      <button onClick={() => handleEdit(sub)} style={s.editBtn}>Edit</button>
                      <button onClick={() => handleDelete(sub.id)} style={s.deleteBtn}>Delete</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", backgroundColor: "#f0f4f8", fontFamily: "Arial, sans-serif" },
  navbar: { background: "#fff", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  logo: { fontSize: 22, fontWeight: 700, color: "#1a7f6e" },
  userText: { fontSize: 13, color: "#666" },
  logoutBtn: { padding: "6px 14px", background: "#f0f4f8", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer", fontSize: 13 },
  body: { padding: "28px 32px" },
  statsRow: { display: "flex", gap: 16, marginBottom: 24 },
  statCard: { flex: 1, background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  statNum: { fontSize: 32, fontWeight: 700, color: "#1a1a1a" },
  statLabel: { fontSize: 13, color: "#888", marginTop: 4 },
  mainRow: { display: "flex", gap: 20, alignItems: "flex-start" },
  formCard: { background: "#fff", borderRadius: 12, padding: 24, width: 360, flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  listCard: { flex: 1, background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  cardTitle: { margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#1a1a1a" },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 12, fontWeight: 600, color: "#555" },
  input: { padding: "8px 12px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" },
  submitBtn: { marginTop: 6, padding: "10px", background: "#1a7f6e", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14 },
  cancelBtn: { padding: "10px", background: "#f0f4f8", color: "#444", border: "1px solid #ddd", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14 },
  listHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 },
  empty: { textAlign: "center", padding: "48px 0", color: "#999" },
  subCard: { border: "1px solid #eee", borderRadius: 10, padding: "14px 16px", marginBottom: 12 },
  subTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  subName: { fontWeight: 700, fontSize: 15, color: "#1a1a1a" },
  subPlatform: { fontSize: 13, color: "#888" },
  badge: { fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 },
  subMeta: { display: "flex", gap: 16, fontSize: 12, color: "#888", marginBottom: 6, flexWrap: "wrap" },
  subNotes: { fontSize: 12, color: "#aaa", margin: "4px 0 8px", fontStyle: "italic" },
  subActions: { display: "flex", gap: 8 },
  editBtn: { padding: "5px 14px", fontSize: 12, background: "#f0f4f8", border: "1px solid #ddd", borderRadius: 6, cursor: "pointer" },
  deleteBtn: { padding: "5px 14px", fontSize: 12, background: "#fff0f0", color: "#e53e3e", border: "1px solid #fca5a5", borderRadius: 6, cursor: "pointer" },
};

export default Dashboard;