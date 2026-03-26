import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const PURPLE = "#7c3aed";

export default function ExtensionPopup() {
  const [user, loading] = useAuthState(auth);
  
  const [form, setForm] = useState({
    name: "", platform: "", startDate: "", endDate: "", email: "", cost: ""
  });
  const [msg, setMsg] = useState("");

  // FR-23: Auto-detect Platform
  useEffect(() => {
    // Only runs if within an actual Chrome Extension environment
    if (window.chrome && window.chrome.tabs) {
      window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url) {
          try {
            const url = new URL(tabs[0].url);
            let domain = url.hostname.replace("www.", "").split(".")[0];
            const platformName = domain.charAt(0).toUpperCase() + domain.slice(1);
            setForm((prev) => ({ ...prev, name: `${platformName} Sub`, platform: platformName }));
          } catch (e) {
            console.error("Could not parse URL", e);
          }
        }
      });
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "subscriptions"), {
        ...form,
        userId: user.uid,
        createdAt: serverTimestamp(),
        reminderSent5: false, reminderSent3: false, reminderSent1: false,
      });
      setMsg("✅ Subscription Added!");
      setTimeout(() => window.close(), 2000); // Auto-close popup
    } catch (err) {
      setMsg("❌ Error adding subscription");
    }
  };

  // FR-24: Redirect to Dashboard link
  const openDashboard = () => {
    // Open full web app
    window.open("https://cutoff-app.vercel.app/dashboard", "_blank"); // Replace with your actual deployed URL if needed
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  // FR-25: Requires Login
  if (!user) {
    return (
      <div style={{ width: 320, padding: 20, fontFamily: "sans-serif", textAlign: "center" }}>
        <h2 style={{ color: PURPLE, margin: "0 0 10px 0" }}>Cutoff</h2>
        <p>You need to be logged in to add subscriptions.</p>
        <button 
          onClick={() => window.open("https://cutoff-app.vercel.app/login", "_blank")}
          style={{ background: PURPLE, color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", marginTop: 10 }}>
          Log in to Cutoff
        </button>
      </div>
    );
  }

  // FR-22: Quick-Add from Extension
  const inp = { width: "100%", padding: 8, marginBottom: 12, borderRadius: 6, border: "1px solid #ccc", boxSizing: "border-box" };

  return (
    <div style={{ width: 340, padding: "20px", fontFamily: "sans-serif", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: PURPLE, fontSize: 18 }}>Quick Add</h2>
        <button onClick={openDashboard} style={{ background: "none", border: "none", color: PURPLE, cursor: "pointer", textDecoration: "underline", fontSize: 12 }}>
          Dashboard ↗
        </button>
      </div>
      
      {msg && <div style={{ background: "#d1fae5", color: "#065f46", padding: 10, borderRadius: 6, marginBottom: 15, fontSize: 14 }}>{msg}</div>}

      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>Subscription Name *</label>
        <input style={inp} name="name" value={form.name} onChange={handleChange} required />

        <label style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>Platform</label>
        <input style={inp} name="platform" value={form.platform} onChange={handleChange} />

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>End Date *</label>
            <input type="date" style={inp} name="endDate" value={form.endDate} onChange={handleChange} required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>Cost</label>
            <input type="number" style={inp} name="cost" value={form.cost} onChange={handleChange} />
          </div>
        </div>

        <label style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>Reminder Email *</label>
        <input type="email" style={inp} name="email" value={form.email} onChange={handleChange} required />

        <button type="submit" style={{ width: "100%", background: PURPLE, color: "#fff", border: "none", padding: "10px", borderRadius: 6, fontWeight: "bold", cursor: "pointer", marginTop: 5 }}>
          Add Subscription
        </button>
      </form>
    </div>
  );
}