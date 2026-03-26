import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Source+Serif+4:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --teal: #0d9e7e;
    --teal-dark: #0a7d64;
    --teal-light: #e6f7f3;
    --bg: #f7f9fb;
    --white: #ffffff;
    --ink: #0f1923;
    --muted: #6b7280;
    --border: #e5e9ee;
    --serif-display: 'Playfair Display', Georgia, serif;
    --serif-body: 'Source Serif 4', Georgia, serif;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--serif-body);
    background: var(--bg);
    color: var(--ink);
    overflow-x: hidden;
  }

  input, textarea, select, button { font-family: var(--serif-body); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes floatA {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%       { transform: translateY(-14px) rotate(1deg); }
  }

  @keyframes floatB {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }

  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .fade-up {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-card  { animation: floatA 5s ease-in-out infinite; }
  .hero-card-2 { animation: floatB 6s ease-in-out infinite; animation-delay: 1s; }

  .cta-primary {
    background: var(--teal);
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 14px 32px;
    font-size: 15px;
    font-weight: 600;
    font-family: var(--serif-body);
    cursor: pointer;
    transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
  }
  .cta-primary:hover {
    background: var(--teal-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(13,158,126,0.28);
  }

  .cta-secondary {
    background: transparent;
    color: var(--teal);
    border: 2px solid var(--teal);
    border-radius: 12px;
    padding: 13px 32px;
    font-size: 15px;
    font-weight: 600;
    font-family: var(--serif-body);
    cursor: pointer;
    transition: background 0.18s, transform 0.15s;
  }
  .cta-secondary:hover {
    background: var(--teal-light);
    transform: translateY(-2px);
  }

  .feature-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px 28px;
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  }
  .feature-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.08);
    border-color: #b3e8d8;
  }

  .step-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px 24px;
    transition: transform 0.22s, box-shadow 0.22s;
  }
  .step-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.07);
  }

  .nav-link {
    font-size: 14px;
    font-weight: 600;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.15s;
    cursor: pointer;
    background: none;
    border: none;
    font-family: var(--serif-body);
  }
  .nav-link:hover { color: var(--teal); }

  .ticker-wrap {
    overflow: hidden;
    white-space: nowrap;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 14px 0;
    background: var(--white);
  }
  .ticker-inner {
    display: inline-flex;
    gap: 48px;
    animation: ticker 22s linear infinite;
  }
  .ticker-item {
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--serif-body);
  }

  .faq-item {
    border-bottom: 1px solid var(--border);
    padding: 20px 0;
    cursor: pointer;
  }
  .faq-item:last-child { border-bottom: none; }

  footer a {
    color: var(--muted);
    text-decoration: none;
    font-size: 13px;
    transition: color 0.15s;
    font-family: var(--serif-body);
  }
  footer a:hover { color: var(--teal); }
`;

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function FaqItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="faq-item" onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#0f1923", fontFamily: "var(--serif-body)" }}>{q}</span>
        <span style={{ fontSize: 22, color: "#0d9e7e", fontWeight: 700, flexShrink: 0, marginLeft: 16 }}>{open ? "−" : "+"}</span>
      </div>
      {open && <p style={{ marginTop: 12, fontSize: 14, color: "#6b7280", lineHeight: 1.8, fontFamily: "var(--serif-body)" }}>{a}</p>}
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  useScrollReveal();

  const tickerItems = [
    "🎬 Netflix", "🎵 Spotify", "☁️ iCloud", "🎮 PlayStation Plus",
    "📺 Disney+", "🏋️ Gym memberships", "📰 News subscriptions",
    "🛒 Amazon Prime", "🎓 Coursera", "💼 LinkedIn Premium",
    "🎬 Netflix", "🎵 Spotify", "☁️ iCloud", "🎮 PlayStation Plus",
    "📺 Disney+", "🏋️ Gym memberships", "📰 News subscriptions",
    "🛒 Amazon Prime", "🎓 Coursera", "💼 LinkedIn Premium",
  ];

  const features = [
    { icon: "⏰", title: "Smart reminders",     desc: "Get notified 5, 3, and 1 day before any subscription expires — straight to your email. Never get caught off guard." },
    { icon: "📋", title: "All in one place",     desc: "Track every subscription you own in a single clean dashboard. Search, filter, and manage with ease." },
    { icon: "🧩", title: "Browser extension",    desc: "Add subscriptions in one click while you're on Netflix, Spotify, or any platform. No tab switching needed." },
    { icon: "🔒", title: "Secure & private",     desc: "Your data is tied to your account only. No one else can see your subscriptions." },
    { icon: "📊", title: "Spending insights",    desc: "See your total active subscriptions and monthly spend at a glance on your dashboard." },
    { icon: "✉️", title: "Test anytime",         desc: "Hit the test email button to instantly verify your reminders are working correctly." },
  ];

  const steps = [
    { num: "01", title: "Create your account",       desc: "Sign up in seconds with just your email and a password." },
    { num: "02", title: "Add your subscriptions",    desc: "Enter the name, platform, dates, and cost. Takes under a minute." },
    { num: "03", title: "Relax — we remind you",     desc: "Cutoff emails you at 5, 3, and 1 day before expiry. Automatically." },
  ];

  const faqs = [
    { q: "Is Cutoff free to use?",                        a: "Yes, Cutoff is completely free. No credit card, no hidden charges." },
    { q: "How do the email reminders work?",               a: "Once you add a subscription with an end date and notification email, Cutoff automatically sends you a reminder 5 days, 3 days, and 1 day before it expires. Each reminder is sent only once." },
    { q: "Can I use Cutoff on mobile?",                    a: "The web dashboard is fully responsive and works great on mobile browsers. A dedicated mobile app is on the roadmap." },
    { q: "What browsers does the extension support?",      a: "The extension currently supports Chrome and all Chromium-based browsers like Edge and Brave." },
    { q: "Is my data safe?",                               a: "Yes. Your subscription data is stored securely in Firestore and is only accessible to your own account. We never share your data." },
  ];

  const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
  const body  = { fontFamily: "'Source Serif 4', Georgia, serif" };

  return (
    <>
      <style>{globalStyles}</style>

      {/* ── Navbar ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 200, background: "rgba(247,249,251,0.94)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e5e9ee", padding: "0 6%", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ ...serif, fontSize: 22, fontWeight: 800, color: "#0d9e7e" }}>Cutoff</span>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <button className="nav-link" onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}>Features</button>
          <button className="nav-link" onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}>How it works</button>
          <button className="nav-link" onClick={() => document.getElementById("faq").scrollIntoView({ behavior: "smooth" })}>FAQ</button>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="cta-secondary" style={{ padding: "9px 22px", fontSize: 14 }} onClick={() => navigate("/login")}>Log in</button>
          <button className="cta-primary"   style={{ padding: "9px 22px", fontSize: 14 }} onClick={() => navigate("/signup")}>Sign up free</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: "90px 6% 70px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#e6f7f3", border: "1px solid #b3e8d8", borderRadius: 20, padding: "6px 14px", marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, background: "#0d9e7e", borderRadius: "50%", display: "inline-block" }} />
            <span style={{ ...body, fontSize: 12, fontWeight: 700, color: "#0a7d64", letterSpacing: "0.05em" }}>FREE TO USE — NO CARD NEEDED</span>
          </div>

          <h1 style={{ ...serif, fontSize: 52, fontWeight: 800, lineHeight: 1.15, color: "#0f1923", marginBottom: 22, letterSpacing: "-0.5px" }}>
            Never lose money<br />
            to a <span style={{ color: "#0d9e7e" }}>forgotten</span> sub
          </h1>

          <p style={{ ...body, fontSize: 17, color: "#6b7280", lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
            Cutoff tracks all your subscriptions and automatically emails you 5, 3, and 1 day before they expire — so you can renew or cancel before you're charged.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
            <button className="cta-primary"    onClick={() => navigate("/signup")}>Get started — it's free</button>
            <button className="cta-secondary"  onClick={() => navigate("/login")}>I already have an account</button>
          </div>

          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {[["📧","Email reminders"], ["🧩","Browser extension"], ["🔒","Secure & private"]].map(([icon, label]) => (
              <div key={label} style={{ ...body, display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                <span>{icon}</span>{label}
              </div>
            ))}
          </div>
        </div>

        {/* Floating mock cards */}
        <div style={{ position: "relative", height: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", width: 320, height: 320, background: "radial-gradient(circle, #e6f7f3 0%, transparent 70%)", borderRadius: "50%", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />

          <div className="hero-card" style={{ position: "absolute", top: 20, left: 10, background: "#fff", borderRadius: 18, border: "1px solid #e5e9ee", padding: "20px 22px", width: 280, boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, background: "#e6f7f3", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎬</div>
                <div>
                  <div style={{ ...body, fontWeight: 700, fontSize: 14, color: "#0f1923" }}>Netflix Premium</div>
                  <div style={{ ...body, fontSize: 11, color: "#9ca3af" }}>Netflix</div>
                </div>
              </div>
              <span style={{ ...body, fontSize: 11, fontWeight: 700, color: "#b45309", background: "#fff8ec", padding: "3px 10px", borderRadius: 20, border: "1px solid #fde68a" }}>3 days left</span>
            </div>
            <div style={{ ...body, fontSize: 12, color: "#9ca3af", display: "flex", flexDirection: "column", gap: 4 }}>
              <div><span style={{ fontWeight: 600, color: "#555" }}>Period: </span>Mar 1 – Mar 25, 2026</div>
              <div><span style={{ fontWeight: 600, color: "#555" }}>Cost: </span>₹649/mo</div>
              <div><span style={{ fontWeight: 600, color: "#555" }}>Email: </span>you@email.com</div>
            </div>
          </div>

          <div className="hero-card-2" style={{ position: "absolute", bottom: 20, right: 0, background: "#fff", borderRadius: 18, border: "1px solid #e5e9ee", padding: "18px 20px", width: 250, boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, background: "#e6f7f3", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✉️</div>
              <div>
                <div style={{ ...body, fontWeight: 700, fontSize: 13, color: "#0f1923" }}>Reminder sent!</div>
                <div style={{ ...body, fontSize: 11, color: "#9ca3af" }}>3 days before expiry</div>
              </div>
            </div>
            <div style={{ background: "#e6f7f3", borderRadius: 10, padding: "10px 12px", ...body, fontSize: 12, color: "#0a7d64", fontWeight: 500, lineHeight: 1.6 }}>
              ⏰ Your <strong>Netflix Premium</strong> expires in 3 days. Renew or cancel before Mar 25.
            </div>
          </div>

          <div style={{ position: "absolute", top: 60, right: 10, background: "#fff", borderRadius: 14, border: "1px solid #e5e9ee", padding: "10px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <div style={{ ...body, fontSize: 18, fontWeight: 700, color: "#0f1923", lineHeight: 1 }}>6</div>
              <div style={{ ...body, fontSize: 11, color: "#9ca3af" }}>Active subs</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {tickerItems.map((item, i) => (
            <span key={i} className="ticker-item">
              {item}
              <span style={{ color: "#e5e9ee", fontSize: 16 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section id="features" style={{ padding: "90px 6%", maxWidth: 1200, margin: "0 auto" }}>
        <div className="fade-up" style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ ...body, fontSize: 12, fontWeight: 700, color: "#0d9e7e", letterSpacing: "0.1em", textTransform: "uppercase" }}>Everything you need</span>
          <h2 style={{ ...serif, fontSize: 38, fontWeight: 800, color: "#0f1923", marginTop: 10 }}>Built around your subscriptions</h2>
          <p style={{ ...body, fontSize: 16, color: "#6b7280", marginTop: 12, maxWidth: 520, margin: "12px auto 0" }}>Simple, focused tools that keep your subscriptions under control — without the clutter.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {features.map((f, i) => (
            <div key={f.title} className="feature-card fade-up" style={{ transitionDelay: `${i * 80}ms` }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ ...serif, fontSize: 18, fontWeight: 700, color: "#0f1923", marginBottom: 10 }}>{f.title}</h3>
              <p style={{ ...body, fontSize: 14, color: "#6b7280", lineHeight: 1.8 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ background: "#fff", padding: "90px 6%", borderTop: "1px solid #e5e9ee", borderBottom: "1px solid #e5e9ee" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="fade-up" style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ ...body, fontSize: 12, fontWeight: 700, color: "#0d9e7e", letterSpacing: "0.1em", textTransform: "uppercase" }}>Simple process</span>
            <h2 style={{ ...serif, fontSize: 38, fontWeight: 800, color: "#0f1923", marginTop: 10 }}>Up and running in 3 steps</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {steps.map((step, i) => (
              <div key={step.num} className="step-card fade-up" style={{ transitionDelay: `${i * 100}ms`, position: "relative", overflow: "hidden" }}>
                <div style={{ ...serif, fontSize: 56, fontWeight: 800, color: "#e6f7f3", lineHeight: 1, marginBottom: 16 }}>{step.num}</div>
                <h3 style={{ ...serif, fontSize: 18, fontWeight: 700, color: "#0f1923", marginBottom: 10 }}>{step.title}</h3>
                <p style={{ ...body, fontSize: 14, color: "#6b7280", lineHeight: 1.8 }}>{step.desc}</p>
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", top: "50%", right: -16, transform: "translateY(-50%)", fontSize: 22, color: "#0d9e7e", zIndex: 10 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="fade-up" style={{ margin: "90px auto", padding: "0 6%", maxWidth: 1200 }}>
        <div style={{ background: "#0d9e7e", borderRadius: 24, padding: "60px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <h2 style={{ ...serif, fontSize: 34, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Stop losing money to forgotten subs</h2>
            <p style={{ ...body, fontSize: 16, color: "rgba(255,255,255,0.8)", maxWidth: 440, lineHeight: 1.7 }}>Join Cutoff today — it's free, takes 30 seconds to set up, and could save you thousands.</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => navigate("/signup")}
              style={{ background: "#fff", color: "#0d9e7e", border: "none", borderRadius: 12, padding: "14px 32px", ...body, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "transform 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              Create free account
            </button>
            <button onClick={() => navigate("/login")}
              style={{ background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 12, padding: "13px 28px", ...body, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Log in
            </button>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "0 6% 90px", maxWidth: 800, margin: "0 auto" }}>
        <div className="fade-up" style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ ...body, fontSize: 12, fontWeight: 700, color: "#0d9e7e", letterSpacing: "0.1em", textTransform: "uppercase" }}>Got questions?</span>
          <h2 style={{ ...serif, fontSize: 38, fontWeight: 800, color: "#0f1923", marginTop: 10 }}>Frequently asked</h2>
        </div>
        <div className="fade-up" style={{ background: "#fff", borderRadius: 20, border: "1px solid #e5e9ee", padding: "8px 32px" }}>
          {faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#fff", borderTop: "1px solid #e5e9ee", padding: "32px 6%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <span style={{ ...serif, fontSize: 20, fontWeight: 800, color: "#0d9e7e" }}>Cutoff</span>
        <p style={{ ...body, fontSize: 13, color: "#9ca3af" }}>© 2026 Cutoff. All rights reserved.</p>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#faq">FAQ</a>
        </div>
      </footer>
    </>
  );
}