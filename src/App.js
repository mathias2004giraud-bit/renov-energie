import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// CONFIG & DATA
// ═══════════════════════════════════════════════════════════════

const USERS = {
  "commercial@renov.fr": "renov2026",
  "admin@renov.fr": "admin2026",
  "demo@renov.fr": "demo2026",
};

const PV_GRILLE = [
  { kw: 3, prix: 6900, label: "3 kWc" },
  { kw: 4.5, prix: 8900, label: "4,5 kWc" },
  { kw: 6, prix: 9900, label: "6 kWc" },
  { kw: 9, prix: 11900, label: "9 kWc" },
];

const CEE_PAR_M2 = 13;
const BONUS_NATIONAL = 3000;

const ITE_AVANTAGES = [
  { icon: "💰", text: "Réduction de la facture de 40 à 60%" },
  { icon: "🌡️", text: "Diminution des déperditions thermiques" },
  { icon: "🏠", text: "Amélioration esthétique du logement" },
  { icon: "📊", text: "Gain de 2 classes DPE" },
  { icon: "💎", text: "Valorisation immobilière de 15 à 20%" },
  { icon: "❤️", text: "Confort de vie et santé améliorés" },
];

const PV_AVANTAGES = [
  { icon: "⚡", text: "Réduction de la facture de 75 à 80%" },
  { icon: "🌿", text: "Énergie propre, renouvelable et gratuite" },
  { icon: "🏠", text: "Valorisation du logement 15 à 20%" },
  { icon: "📊", text: "Amélioration du DPE" },
  { icon: "🌍", text: "Zéro émission de CO₂" },
  { icon: "🌱", text: "Participation active à la transition énergétique" },
];

const ITE_COMPOSANTS = [
  { id: "isolant", nom: "Isolant PSE / Laine de roche", desc: "Panneaux rigides fixés sur le mur — supprime les ponts thermiques.", icon: "🧱", detail: "Épaisseur : 120 à 200mm. R ≥ 3.7 m².K/W." },
  { id: "fixation", nom: "Fixation mécanique + colle", desc: "Double système : colle-plot + chevilles à frapper.", icon: "🔩", detail: "Résistance au vent DTU 55.2." },
  { id: "armature", nom: "Sous-enduit + treillis", desc: "Fibre de verre noyée — protège l'isolant des chocs.", icon: "🛡️", detail: "Treillis 160g/m² résistant aux alcalis." },
  { id: "finition", nom: "Enduit de finition", desc: "Large choix de couleurs et textures.", icon: "🎨", detail: "Garantie décennale. 200+ teintes." },
];

const PV_COMPOSANTS = [
  { id: "panneau", nom: "Panneaux monocristallins", desc: "Rendement supérieur à 21%. Garantie 25 ans.", icon: "☀️", detail: "375 à 500Wc/panneau." },
  { id: "onduleur", nom: "Micro-onduleurs", desc: "Conversion DC/AC panneau par panneau.", icon: "⚡", detail: "Durée de vie 25 ans. Monitoring temps réel." },
  { id: "structure", nom: "Structure de montage alu", desc: "Étanchéité garantie sur tous types de toiture.", icon: "🏗️", detail: "Tenue au vent 180 km/h." },
  { id: "coffret", nom: "Coffret DC/AC", desc: "Protection électrique complète.", icon: "🔌", detail: "NF C 15-100. Raccordement Enedis inclus." },
];

const ITE_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=450&fit=crop",
];

const PV_IMAGES = [
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&h=450&fit=crop",
];

// ═══════════════════════════════════════════════════════════════
// DESIGN SYSTEM — ÉCOLOGIQUE + INSTITUTIONNEL
// ═══════════════════════════════════════════════════════════════

const FONT = "'Source Sans 3', 'Segoe UI', sans-serif";
const C = {
  green: "#1B8A4A", greenLight: "#E8F5E9", greenDark: "#0D5C2E",
  yellow: "#F5A623", yellowLight: "#FFF8E1", yellowDark: "#C77D00",
  bleu: "#000091", bleuLight: "#E3E3FD",
  rouge: "#E1000F",
  bg: "#F7FAF7", white: "#FFFFFF",
  border: "#D4E5D4", borderActive: "#1B8A4A",
  text: "#1A2E1A", muted: "#5A7A5A", light: "#8FA88F",
  card: "#FFFFFF",
  success: "#1B8A4A", successBg: "#E8F5E9",
  warning: "#F5A623", warningBg: "#FFF8E1",
  info: "#0063CB", infoBg: "#E8EDFF",
  danger: "#E1000F", dangerBg: "#FFE9E6",
};

const fmt = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtN = (n) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n);

// ═══════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700;800;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: ${FONT}; background: ${C.bg}; color: ${C.text}; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
    input:focus, select:focus, textarea:focus {
      border-color: ${C.green} !important;
      outline: none;
      box-shadow: 0 0 0 3px ${C.greenLight};
    }
    button { transition: all 0.2s ease; }
    button:hover { transform: translateY(-1px); }
    button:active { transform: scale(0.98) translateY(0); }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes countUp {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes gaugeGrow {
      from { width: 0%; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .hover-lift:hover { box-shadow: 0 8px 25px rgba(27,138,74,0.15); transform: translateY(-3px); }
    .hover-glow:hover { box-shadow: 0 0 20px rgba(27,138,74,0.3); }
  `}</style>
);

// ═══════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════════

const card = {
  background: C.white,
  borderRadius: 12,
  padding: 24,
  border: `1px solid ${C.border}`,
  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
};

function Field({ label, value, onChange, type = "text", placeholder = "", half = false, options = null, rows = null }) {
  const base = {
    width: "100%", padding: "12px 16px", background: "#F0F7F0", border: `2px solid ${C.border}`,
    borderRadius: 8, color: C.text, fontSize: 15, fontFamily: FONT, outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  return (
    <div style={{ flex: half ? "1 1 45%" : "1 1 100%", minWidth: half ? 160 : "auto" }}>
      <label style={{ display: "block", color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 6, fontFamily: FONT }}>{label}</label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={{ ...base, appearance: "auto" }}>
          <option value="">— Choisir —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : rows ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...base, resize: "vertical" }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base}
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
          data-lpignore="true" data-form-type="other" name={`f_${Math.random().toString(36).slice(2)}`}
        />
      )}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style: s = {}, icon = null }) {
  const styles = {
    primary: { padding: "14px 32px", background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, border: "none", borderRadius: 10, color: C.white, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 4px 15px rgba(27,138,74,0.3)" },
    secondary: { padding: "12px 24px", background: C.white, border: `2px solid ${C.green}`, borderRadius: 10, color: C.green, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT },
    yellow: { padding: "14px 32px", background: `linear-gradient(135deg, ${C.yellow}, ${C.yellowDark})`, border: "none", borderRadius: 10, color: C.white, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: FONT, boxShadow: "0 4px 15px rgba(245,166,35,0.3)" },
    danger: { padding: "10px 20px", background: C.dangerBg, border: `1px solid ${C.danger}30`, borderRadius: 8, color: C.danger, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT },
  };
  return <button onClick={onClick} className="hover-lift" style={{ ...styles[variant], ...s }}>{icon && <span style={{ marginRight: 8 }}>{icon}</span>}{children}</button>;
}

function TricoloreBar() {
  return <div style={{ display: "flex", height: 4 }}><div style={{ flex: 1, background: "#000091" }} /><div style={{ flex: 1, background: "#FFF" }} /><div style={{ flex: 1, background: "#E1000F" }} /></div>;
}

// ═══════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  const submit = () => {
    if (USERS[email] === pwd) onLogin(email);
    else setErr("Identifiants incorrects");
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(145deg, #0D2818 0%, #1B4332 40%, #2D6A4F 100%)`, position: "relative", overflow: "hidden" }}>
      <TricoloreBar />
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(27,138,74,0.1)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: -50, left: -50, width: 300, height: 300, borderRadius: "50%", background: "rgba(245,166,35,0.08)", filter: "blur(40px)" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 4px)", padding: 24, position: "relative", zIndex: 1 }}>
        <div style={{
          width: "100%", maxWidth: 440, background: "rgba(255,255,255,0.97)", borderRadius: 20, padding: 44,
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)", backdropFilter: "blur(20px)",
          opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s cubic-bezier(0.23,1,0.32,1)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 64, height: 64, background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`,
              borderRadius: 16, display: "inline-flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16, boxShadow: "0 8px 24px rgba(27,138,74,0.3)",
            }}>
              <span style={{ fontSize: 32, filter: "brightness(0) invert(1)" }}>🏛️</span>
            </div>
            <h1 style={{ fontFamily: FONT, fontSize: 24, color: C.text, fontWeight: 900, marginBottom: 6 }}>Accès Technicien</h1>
            <p style={{ color: C.muted, fontSize: 13, fontFamily: FONT, lineHeight: 1.5 }}>
              Programme Gouvernemental de la<br />Transition Énergétique 2026
            </p>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 6, fontFamily: FONT }}>Email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} placeholder="commercial@renov.fr"
              style={{ width: "100%", padding: "14px 16px", background: "#F0F7F0", border: `2px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 15, fontFamily: FONT, outline: "none", boxSizing: "border-box" }}
              autoComplete="off" data-lpignore="true" onKeyDown={e => e.key === "Enter" && submit()}
            />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 6, fontFamily: FONT }}>Mot de passe</label>
            <input type="password" value={pwd} onChange={e => { setPwd(e.target.value); setErr(""); }} placeholder="••••••••"
              style={{ width: "100%", padding: "14px 16px", background: "#F0F7F0", border: `2px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 15, fontFamily: FONT, outline: "none", boxSizing: "border-box" }}
              autoComplete="new-password" data-lpignore="true" onKeyDown={e => e.key === "Enter" && submit()}
            />
          </div>

          {err && <div style={{ color: C.danger, fontSize: 13, fontFamily: FONT, marginBottom: 16, textAlign: "center", padding: 12, background: C.dangerBg, borderRadius: 8, border: `1px solid ${C.danger}20` }}>{err}</div>}

          <Btn onClick={submit} style={{ width: "100%", padding: 16, fontSize: 17, borderRadius: 12 }}>Se connecter</Btn>

          <div style={{ marginTop: 18, padding: 12, background: C.greenLight, borderRadius: 10, borderLeft: `4px solid ${C.green}` }}>
            <p style={{ color: C.green, fontSize: 11, fontFamily: FONT, margin: 0, fontWeight: 600 }}>Démo : commercial@renov.fr / renov2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════

function Sidebar({ active, setActive, onLogout, open, setOpen }) {
  const items = [
    { id: "accueil", icon: "🏠", label: "Accueil" },
    { id: "simu-ite", icon: "🧱", label: "Simulation ITE" },
    { id: "simu-pv", icon: "☀️", label: "Simulation PV" },
    { id: "dossiers", icon: "📁", label: "Mes dossiers" },
    { id: "demo-ite", icon: "🏗️", label: "Explicatif ITE" },
    { id: "demo-pv", icon: "⚡", label: "Explicatif PV" },
    { id: "fiche-sub", icon: "💶", label: "Subventions 2026" },
  ];
  return (
    <>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 199, backdropFilter: "blur(4px)" }} />}
      <aside style={{
        position: "fixed", top: 0, left: open ? 0 : -320, width: 300, height: "100vh",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F0F7F0 100%)",
        borderRight: `1px solid ${C.border}`, zIndex: 200,
        transition: "left 0.35s cubic-bezier(0.23,1,0.32,1)",
        display: "flex", flexDirection: "column", boxShadow: open ? "8px 0 30px rgba(0,0,0,0.1)" : "none",
      }}>
        <TricoloreBar />
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 20, filter: "brightness(0) invert(1)" }}>🏛️</span>
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 900, color: C.green }}>ÉcoRénov</div>
            <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Programme d'État 2026</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px 14px", overflowY: "auto" }}>
          {items.map(s => (
            <button key={s.id} onClick={() => { setActive(s.id); setOpen(false); }} style={{
              width: "100%", padding: "12px 16px",
              background: active === s.id ? C.greenLight : "transparent",
              border: "none", borderRadius: 10,
              color: active === s.id ? C.green : C.text,
              fontSize: 14, fontFamily: FONT, fontWeight: active === s.id ? 700 : 500,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left",
              borderLeft: active === s.id ? `3px solid ${C.green}` : "3px solid transparent",
              marginBottom: 4, transition: "all 0.2s",
            }}>
              <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{s.icon}</span>{s.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: 16, borderTop: `1px solid ${C.border}` }}>
          <button onClick={onLogout} style={{
            width: "100%", padding: 12, background: C.white, border: `1px solid ${C.border}`,
            borderRadius: 10, color: C.muted, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT,
          }}>Déconnexion</button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ setOpen, title }) {
  return (
    <>
      <TricoloreBar />
      <header style={{
        position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)", borderBottom: `2px solid ${C.green}`,
        padding: "12px 20px", display: "flex", alignItems: "center", gap: 14,
      }}>
        <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", color: C.green, fontSize: 22, cursor: "pointer", padding: 4 }}>☰</button>
        <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 800, color: C.green }}>{title}</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: FONT, fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>République Française</span>
        </div>
      </header>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// ACCUEIL — HERO SPLIT 50/50 + AVANTAGES
// ═══════════════════════════════════════════════════════════════

function Accueil({ setActive }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  return (
    <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.5s" }}>
      {/* Badges RGE */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", padding: "20px 20px 0" }}>
        {["RGE QualiPac", "RGE Qualibat ENR", "RGE QualiPV", "Reconnu Garant"].map((l, i) => (
          <div key={i} style={{
            padding: "6px 14px", background: C.white, borderRadius: 20,
            border: `1px solid ${C.green}30`, fontSize: 11, fontFamily: FONT, fontWeight: 700, color: C.green,
            animation: `fadeInUp 0.4s ease ${i * 0.1}s both`,
          }}>{l}</div>
        ))}
      </div>

      {/* Titre */}
      <div style={{ textAlign: "center", padding: "24px 20px 0" }}>
        <div style={{
          width: 72, height: 72, background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`,
          borderRadius: 18, display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16, boxShadow: "0 10px 30px rgba(27,138,74,0.25)", animation: "fadeInUp 0.5s ease both",
        }}>
          <span style={{ fontSize: 38, filter: "brightness(0) invert(1)" }}>🏛️</span>
        </div>
        <h1 style={{
          fontFamily: FONT, fontSize: "clamp(22px,5vw,32px)", color: C.text, fontWeight: 900,
          lineHeight: 1.2, marginBottom: 10, animation: "fadeInUp 0.5s ease 0.1s both",
        }}>
          Simulation au Programme Gouvernemental<br />
          <span style={{ color: C.green }}>de la Transition Énergétique 2026</span>
        </h1>
        <p style={{
          fontFamily: FONT, fontSize: 15, color: C.muted, maxWidth: 520, margin: "0 auto 28px",
          animation: "fadeInUp 0.5s ease 0.2s both",
        }}>
          Accédez à une estimation complète de vos aides et de la rentabilité de votre projet en quelques clics.
        </p>
      </div>

      {/* HERO SPLIT 50/50 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, maxWidth: 900, margin: "0 auto 32px", borderRadius: 16, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.1)", animation: "fadeInUp 0.6s ease 0.3s both" }}>
        {/* ITE */}
        <div style={{
          position: "relative", minHeight: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30,
          background: `linear-gradient(145deg, rgba(27,138,74,0.85), rgba(13,92,46,0.9)), url(https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop) center/cover`,
          cursor: "pointer",
        }} onClick={() => setActive("simu-ite")}>
          <div style={{ fontSize: 40, marginBottom: 12, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}>🧱</div>
          <h2 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 900, color: "#FFF", marginBottom: 8, textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Isolation Thermique</h2>
          <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.85)", textAlign: "center", marginBottom: 16, lineHeight: 1.5 }}>Réduisez vos pertes énergétiques<br />jusqu'à 60 %</p>
          <div className="hover-glow" style={{ padding: "12px 28px", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.6)", borderRadius: 10, color: "#FFF", fontFamily: FONT, fontWeight: 700, fontSize: 14, backdropFilter: "blur(8px)" }}>
            Simulation ITE →
          </div>
        </div>
        {/* PV */}
        <div style={{
          position: "relative", minHeight: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30,
          background: `linear-gradient(145deg, rgba(245,166,35,0.85), rgba(199,125,0,0.9)), url(https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop) center/cover`,
          cursor: "pointer",
        }} onClick={() => setActive("simu-pv")}>
          <div style={{ fontSize: 40, marginBottom: 12, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}>☀️</div>
          <h2 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 900, color: "#FFF", marginBottom: 8, textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Panneaux Solaires</h2>
          <p style={{ fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.85)", textAlign: "center", marginBottom: 16, lineHeight: 1.5 }}>Produisez votre propre énergie<br />et réduisez vos factures</p>
          <div className="hover-glow" style={{ padding: "12px 28px", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.6)", borderRadius: 10, color: "#FFF", fontFamily: FONT, fontWeight: 700, fontSize: 14, backdropFilter: "blur(8px)" }}>
            Simulation PV →
          </div>
        </div>
      </div>

      {/* AVANTAGES SECTION */}
      <div style={{ maxWidth: 900, margin: "0 auto 32px", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* ITE avantages */}
          <div>
            <h3 style={{ fontFamily: FONT, fontSize: 14, fontWeight: 800, color: C.green, marginBottom: 12, textTransform: "uppercase", letterSpacing: "1px" }}>Avantages ITE</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { icon: "💰", val: "40 à 60%", text: "d'économies d'énergie" },
                { icon: "🛡️", val: "15 ans", text: "de garantie d'État" },
                { icon: "🏡", val: "+80%", text: "confort thermique" },
                { icon: "📊", val: "+2", text: "classes DPE" },
              ].map((a, i) => (
                <div key={i} className="hover-lift" style={{
                  ...card, padding: 16, display: "flex", alignItems: "center", gap: 14,
                  borderLeft: `4px solid ${C.green}`, animation: `slideInLeft 0.4s ease ${i * 0.1}s both`,
                }}>
                  <span style={{ fontSize: 24 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 900, color: C.green }}>{a.val}</div>
                    <div style={{ fontFamily: FONT, fontSize: 12, color: C.muted }}>{a.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* PV avantages */}
          <div>
            <h3 style={{ fontFamily: FONT, fontSize: 14, fontWeight: 800, color: C.yellow, marginBottom: 12, textTransform: "uppercase", letterSpacing: "1px" }}>Avantages PV</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { icon: "⚡", val: "70 à 80%", text: "d'économies sur facture" },
                { icon: "📈", val: "+15 à 20%", text: "valorisation immobilière" },
                { icon: "🛡️", val: "25 ans", text: "de garantie" },
                { icon: "🔋", val: "100%", text: "autoconsommation" },
              ].map((a, i) => (
                <div key={i} className="hover-lift" style={{
                  ...card, padding: 16, display: "flex", alignItems: "center", gap: 14,
                  borderLeft: `4px solid ${C.yellow}`, animation: `slideInLeft 0.4s ease ${(i + 4) * 0.1}s both`,
                }}>
                  <span style={{ fontSize: 24 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 900, color: C.yellowDark }}>{a.val}</div>
                    <div style={{ fontFamily: FONT, fontSize: 12, color: C.muted }}>{a.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER CTA — DRAPEAU FRANCE */}
      <div style={{ maxWidth: 900, margin: "0 auto 40px", padding: "0 20px" }}>
        <div style={{
          ...card, padding: 0, textAlign: "center", overflow: "hidden", position: "relative",
          border: "none", borderRadius: 16,
        }}>
          {/* Drapeau français en fond */}
          <div style={{ display: "flex", height: "100%", position: "absolute", inset: 0, opacity: 0.12 }}>
            <div style={{ flex: 1, background: "#002395" }} />
            <div style={{ flex: 1, background: "#FFFFFF" }} />
            <div style={{ flex: 1, background: "#ED2939" }} />
          </div>
          {/* Bande tricolore nette en haut */}
          <div style={{ display: "flex", height: 6 }}>
            <div style={{ flex: 1, background: "#002395" }} />
            <div style={{ flex: 1, background: "#FFFFFF" }} />
            <div style={{ flex: 1, background: "#ED2939" }} />
          </div>
          <div style={{ padding: "28px 24px", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🇫🇷</div>
            <p style={{ fontFamily: FONT, fontSize: 15, color: C.text, lineHeight: 1.7, marginBottom: 8 }}>
              <strong style={{ color: "#002395" }}>Programme d'accompagnement et d'orientation</strong> dans le cadre de la transition énergétique 2026.
            </p>
            <p style={{ fontFamily: FONT, fontSize: 17, color: "#002395", fontWeight: 800 }}>
              Simulez votre dossier en quelques clics !
            </p>
          </div>
          {/* Bande tricolore nette en bas */}
          <div style={{ display: "flex", height: 6 }}>
            <div style={{ flex: 1, background: "#002395" }} />
            <div style={{ flex: 1, background: "#FFFFFF" }} />
            <div style={{ flex: 1, background: "#ED2939" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════════════════════════

function ProgressBar({ step, total, titles, color = C.green }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        {titles.map((t, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", margin: "0 auto 6px",
              background: i <= step ? `linear-gradient(135deg, ${color}, ${color}CC)` : "#E8E8E8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: i <= step ? "#FFF" : C.light, fontFamily: FONT,
              transition: "all 0.4s", boxShadow: i <= step ? `0 4px 12px ${color}40` : "none",
            }}>{i + 1}</div>
            <div style={{ fontSize: 10, color: i === step ? color : C.light, fontFamily: FONT, fontWeight: 700, transition: "color 0.3s" }}>{t}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 6, background: "#E8E8E8", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${((step + 1) / total) * 100}%`,
          background: `linear-gradient(90deg, ${color}, ${color}CC)`,
          borderRadius: 3, transition: "width 0.5s cubic-bezier(0.23,1,0.32,1)",
        }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ITE CALC DISPLAY
// ═══════════════════════════════════════════════════════════════

function ITECalcDisplay({ calc: c }) {
  return (
    <div style={{ width: "100%", padding: 20, background: C.bg, borderRadius: 12, border: `1px solid ${C.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[{ l: "Coût TTC", v: fmt(c.ttc), cl: C.text }, { l: "HT", v: fmt(c.ht), cl: C.muted }, { l: "TVA 5,5%", v: fmt(c.tva), cl: C.muted }].map((x, i) => (
          <div key={i} style={{ textAlign: "center", padding: 10, background: C.white, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>{x.l}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: x.cl, fontFamily: FONT, marginTop: 2 }}>{x.v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { l: `CEE (${CEE_PAR_M2}€/m²)`, v: fmt(c.cee), cl: C.green, bg: C.greenLight },
          { l: "MaPrimeRénov'", v: fmt(c.aidesNom), cl: C.info, bg: C.infoBg },
          { l: "Bonus national", v: fmt(c.bonus), cl: C.yellow, bg: C.yellowLight },
        ].map((x, i) => (
          <div key={i} style={{ textAlign: "center", padding: 12, background: x.bg, borderRadius: 10 }}>
            <div style={{ fontSize: 10, color: x.cl, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>{x.l}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: x.cl, fontFamily: FONT, marginTop: 2 }}>{x.v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { l: "Sans aides", v: fmt(c.sansAides), cl: C.danger, bg: C.dangerBg },
          { l: "Avec aides", v: fmt(c.avecAides), cl: C.green, bg: C.greenLight },
          { l: "Reste à charge", v: fmt(c.rac), cl: C.bleu, bg: C.bleuLight },
        ].map((x, i) => (
          <div key={i} style={{ textAlign: "center", padding: 14, background: x.bg, borderRadius: 10, border: `1px solid ${x.cl}20` }}>
            <div style={{ fontSize: 10, color: x.cl, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>{x.l}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: x.cl, fontFamily: FONT, marginTop: 2 }}>{x.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PV CALC DISPLAY + SURPLUS MODULE
// ═══════════════════════════════════════════════════════════════

function PVCalcDisplay({ calc: c }) {
  return (
    <div style={{ width: "100%", padding: 20, background: C.bg, borderRadius: 12, border: `1px solid ${C.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ textAlign: "center", padding: 14, background: C.infoBg, borderRadius: 10 }}>
          <div style={{ fontSize: 10, color: C.info, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Prix TTC ({c.grille.label})</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.info, fontFamily: FONT, marginTop: 2 }}>{fmt(c.prixTTC)}</div>
        </div>
        <div style={{ textAlign: "center", padding: 14, background: C.greenLight, borderRadius: 10 }}>
          <div style={{ fontSize: 10, color: C.green, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Réduction facture (80%)</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.green, fontFamily: FONT, marginTop: 2 }}>{fmt(c.reduction)}/an</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ textAlign: "center", padding: 12, background: C.dangerBg, borderRadius: 10 }}>
          <div style={{ fontSize: 10, color: C.danger, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Mensualité AVANT</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: C.danger, fontFamily: FONT, marginTop: 2 }}>{fmt(c.mensAvant)}/mois</div>
        </div>
        <div style={{ textAlign: "center", padding: 12, background: C.greenLight, borderRadius: 10 }}>
          <div style={{ fontSize: 10, color: C.green, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Mensualité APRÈS</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: C.green, fontFamily: FONT, marginTop: 2 }}>{fmt(c.mensApres)}/mois</div>
        </div>
      </div>

      {/* MODULE SURPLUS — ULTRA IMPORTANT */}
      <div style={{
        padding: 18, borderRadius: 12, marginBottom: 14,
        background: `linear-gradient(135deg, ${C.greenLight}, ${C.yellowLight})`,
        border: `2px solid ${C.green}40`,
      }}>
        <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 900, color: C.green, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          🔋 Revente de Surplus Énergétique
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div style={{ textAlign: "center", padding: 10, background: "rgba(255,255,255,0.7)", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Production</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.green, fontFamily: FONT }}>{fmtN(c.prodAnnuelle)} kWh</div>
          </div>
          <div style={{ textAlign: "center", padding: 10, background: "rgba(255,255,255,0.7)", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Consommation</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.info, fontFamily: FONT }}>{fmtN(c.conso)} kWh</div>
          </div>
          <div style={{ textAlign: "center", padding: 10, background: "rgba(255,255,255,0.7)", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Surplus</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: C.yellow, fontFamily: FONT }}>{fmtN(c.surplus)} kWh</div>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: 14, background: C.white, borderRadius: 10, border: `2px solid ${C.green}` }}>
          <div style={{ fontSize: 10, color: C.green, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Revente annuelle estimée ({c.tarifRevente}€/kWh)</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.green, fontFamily: FONT, marginTop: 4, animation: "countUp 0.8s ease both" }}>{fmt(c.reventeSurplus)}/an</div>
        </div>
      </div>

      {/* Financement */}
      <div style={{ padding: 16, background: C.bleuLight, borderRadius: 10 }}>
        <div style={{ fontSize: 10, color: C.bleu, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase", marginBottom: 8 }}>Financement sur 20 ans</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 11, color: C.muted, fontFamily: FONT }}>Mensualité brute</div><div style={{ fontSize: 18, fontWeight: 900, color: C.text, fontFamily: FONT }}>{fmt(c.mensFinancement)}/mois</div></div>
          <div style={{ fontSize: 24, color: C.green }}>→</div>
          <div><div style={{ fontSize: 11, color: C.green, fontFamily: FONT, fontWeight: 600 }}>Après aides</div><div style={{ fontSize: 18, fontWeight: 900, color: C.green, fontFamily: FONT }}>≈ 40 €/mois</div></div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIMULATION ITE
// ═══════════════════════════════════════════════════════════════

const ITE_INIT = { nom:"",prenom:"",cp:"",ville:"",couleur_crepis:"",annee:"",chauffage:"",ecs:"",vitrage:"",elec_install:"",m2:"",combles:"",occupants:"",enfants:"",facture_energie:"",facture_periode:"Annuelle",type_chauffage:"",age_chauffage:"",contrat:"",salaire:"",metier:"",credit:"",observation:"",m2_ite:"",prix_m2:"",aides_nom:"" };

function SimuITE({ onSave }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState(ITE_INIT);
  const [result, setResult] = useState(null);
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));

  const computeITE = () => {
    const m2 = parseFloat(f.m2_ite) || 0;
    const prix = parseFloat(f.prix_m2) || 0;
    const aidesNom = parseFloat(f.aides_nom) || 0;
    const ttc = m2 * prix;
    const cee = m2 * CEE_PAR_M2;
    const ht = Math.round(ttc / 1.055);
    const tva = ttc - ht;
    const totalAides = cee + aidesNom + BONUS_NATIONAL;
    const avecAides = Math.max(0, ttc - totalAides);
    return { m2, ttc, ht, tva, cee, aidesNom, bonus: BONUS_NATIONAL, totalAides, sansAides: ttc, avecAides, rac: avecAides };
  };

  const finalize = () => {
    const calc = computeITE();
    const score = 60 + Math.floor(Math.random() * 21);
    setResult({ calc, score });
    setStep(3);
  };

  const titles = ["Faisabilité", "Aides", "Validation"];

  if (step === 3 && result) {
    return <ResultPage type="ITE" result={result} form={f} onNew={() => { setF(ITE_INIT); setStep(0); setResult(null); }} onSave={onSave} />;
  }

  return (
    <div style={{ padding: "24px 20px", maxWidth: 800, margin: "0 auto" }}>
      <ProgressBar step={step} total={3} titles={titles} color={C.green} />
      <h2 style={{ fontFamily: FONT, fontSize: 22, color: C.green, fontWeight: 900, marginBottom: 4 }}>🧱 {["Faisabilité technique ITE", "Aides et subventions ITE", "Finalisation du dossier ITE"][step]}</h2>
      <p style={{ color: C.muted, fontSize: 13, fontFamily: FONT, marginBottom: 20 }}>Pas d'obligation de répondre à tout pour continuer.</p>

      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {step === 0 && (<>
            <Field label="Nom" value={f.nom} onChange={v=>u("nom",v)} half placeholder="Dupont" />
            <Field label="Prénom" value={f.prenom} onChange={v=>u("prenom",v)} half placeholder="Jean" />
            <Field label="Code postal" value={f.cp} onChange={v=>u("cp",v)} half placeholder="69000" />
            <Field label="Ville" value={f.ville} onChange={v=>u("ville",v)} half placeholder="Lyon" />
            <Field label="Statut" value={f.contrat} onChange={v=>u("contrat",v)} half options={["Propriétaire","Locataire","SCI"]} />
            <Field label="Couleur crépis souhaitée" value={f.couleur_crepis} onChange={v=>u("couleur_crepis",v)} half placeholder="Blanc cassé" />
            <Field label="Année de construction" value={f.annee} onChange={v=>u("annee",v)} half placeholder="1975" />
            <Field label="Mode de chauffage" value={f.chauffage} onChange={v=>u("chauffage",v)} half options={["Gaz","Électrique","Fioul","Bois / Granulés","Pompe à chaleur"]} />
            <Field label="ECS (Eau chaude)" value={f.ecs} onChange={v=>u("ecs",v)} half options={["Ballon électrique","Chaudière","Thermodynamique","Solaire","Ne sait pas"]} />
            <Field label="Vitrage" value={f.vitrage} onChange={v=>u("vitrage",v)} half options={["Simple vitrage","Double vitrage","Triple vitrage"]} />
            <Field label="Type de chauffage" value={f.type_chauffage} onChange={v=>u("type_chauffage",v)} half options={["Bois","Gaz","Fioul","Électrique"]} />
            <Field label="Âge du système de chauffage" value={f.age_chauffage} onChange={v=>u("age_chauffage",v)} half placeholder="12 ans" />
            <Field label="Surface habitable (m²)" value={f.m2} onChange={v=>u("m2",v)} half type="number" placeholder="120" />
            <Field label="Combles" value={f.combles} onChange={v=>u("combles",v)} half options={["Perdus isolés","Perdus non isolés","Aménagés isolés","Aménagés non isolés"]} />
            <Field label="Nb occupants" value={f.occupants} onChange={v=>u("occupants",v)} half type="number" placeholder="3" />
            <Field label="Enfants à charge" value={f.enfants} onChange={v=>u("enfants",v)} half type="number" placeholder="2" />
            <Field label="Facture énergétique (€)" value={f.facture_energie} onChange={v=>u("facture_energie",v)} half type="number" placeholder="2400" />
            <Field label="Période" value={f.facture_periode} onChange={v=>u("facture_periode",v)} half options={["Annuelle","Mensuelle"]} />
            <Field label="Installation électrique" value={f.elec_install} onChange={v=>u("elec_install",v)} half options={["Aux normes","À rénover","Ne sait pas"]} />
            <Field label="Activité professionnelle" value={f.metier} onChange={v=>u("metier",v)} half placeholder="Technicien" />
            <Field label="Salaire net mensuel (€)" value={f.salaire} onChange={v=>u("salaire",v)} half type="number" placeholder="2200" />
            <Field label="Crédit(s) en cours (€/mois)" value={f.credit} onChange={v=>u("credit",v)} half type="number" placeholder="450" />
          </>)}
          {step === 1 && (<>
            <div style={{ width: "100%", padding: 14, background: C.greenLight, borderRadius: 10, borderLeft: `4px solid ${C.green}` }}>
              <p style={{ color: C.green, fontSize: 13, fontFamily: FONT, margin: 0, fontWeight: 700 }}>Calcul des aides et du reste à charge ITE</p>
            </div>
            <Field label="Nombre de m² à isoler" value={f.m2_ite} onChange={v=>u("m2_ite",v)} half type="number" placeholder="95" />
            <Field label="Prix TTC au m² (votre tarif)" value={f.prix_m2} onChange={v=>u("prix_m2",v)} half type="number" placeholder="150" />
            <Field label="Aides nominatives MaPrimeRénov' (€)" value={f.aides_nom} onChange={v=>u("aides_nom",v)} half type="number" placeholder="4000" />
            <div style={{ width: "100%", padding: 12, background: C.yellowLight, borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🏅</span>
              <span style={{ fontSize: 13, color: C.yellowDark, fontWeight: 700, fontFamily: FONT }}>Aide bonus nationale : {fmt(BONUS_NATIONAL)} (automatique)</span>
            </div>
            {(parseFloat(f.m2_ite) > 0 && parseFloat(f.prix_m2) > 0) && <ITECalcDisplay calc={computeITE()} />}
          </>)}
          {step === 2 && (<>
            <div style={{ width: "100%", padding: 14, background: C.greenLight, borderRadius: 10, borderLeft: `4px solid ${C.green}` }}>
              <p style={{ color: C.green, fontSize: 13, fontFamily: FONT, margin: 0, fontWeight: 700 }}>Validation des prérequis avant finalisation</p>
            </div>
            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[{ l: "Aspect technique", icon: "🔧" }, { l: "Motivation", icon: "💪" }, { l: "Capacité financière", icon: "💰" }].map((p, i) => (
                <div key={i} style={{ padding: 18, background: C.greenLight, borderRadius: 12, border: `1px solid ${C.green}30`, textAlign: "center" }}>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{p.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.green, fontFamily: FONT }}>{p.l}</div>
                  <div style={{ fontSize: 11, color: C.green, marginTop: 6, fontWeight: 600 }}>✓ Validé</div>
                </div>
              ))}
            </div>
            <Field label="Observation du technicien" value={f.observation} onChange={v=>u("observation",v)} placeholder="Notes sur le dossier..." rows={3} />
          </>)}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        {step > 0 ? <Btn onClick={() => setStep(s => s - 1)} variant="secondary">← Précédent</Btn> : <div />}
        {step < 2 ? <Btn onClick={() => setStep(s => s + 1)}>Suivant →</Btn> : <Btn onClick={finalize}>Voir le résultat</Btn>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIMULATION PV
// ═══════════════════════════════════════════════════════════════

const PV_INIT = { nom:"",prenom:"",cp:"",ville:"",habitation:"",annee:"",elec_install:"",chauffage:"",ecs:"",vitrage:"",type_chauffage:"",age_chauffage:"",m2:"",combles:"",occupants:"",enfants:"",facture_energie:"",facture_periode:"Annuelle",metier:"",salaire:"",credit:"",observation:"",puissance:"6",facture_elec:"",conso_kw:"" };

function SimuPV({ onSave }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState(PV_INIT);
  const [result, setResult] = useState(null);
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));

  const computePV = () => {
    const pw = parseFloat(f.puissance) || 6;
    const grille = PV_GRILLE.find(g => g.kw === pw) || PV_GRILLE[2];
    const prixTTC = grille.prix;
    const ht = Math.round(prixTTC / 1.1);
    const tva = prixTTC - ht;
    const factureElec = parseFloat(f.facture_elec) || 1800;
    const conso = parseFloat(f.conso_kw) || 5000;
    const reduction = Math.round(factureElec * 0.8);
    const mensAvant = Math.round(factureElec / 12);
    const factApres = Math.round(factureElec * 0.2);
    const mensApres = Math.round(factApres / 12);
    const prodAnnuelle = pw * 12 * 365;
    const surplus = Math.max(0, prodAnnuelle - conso);
    const tarifRevente = factureElec > 1500 ? 0.14 : 0.18;
    const reventeSurplus = Math.round(surplus * tarifRevente);
    const mensFinancement = Math.round(prixTTC / (20 * 12));
    const mensApresAides = Math.max(0, mensFinancement - 40);
    const autoconsoTotal = Math.min(prodAnnuelle, conso);
    return { pw, grille, prixTTC, ht, tva, factureElec, conso, reduction, mensAvant, factApres, mensApres, prodAnnuelle, surplus, reventeSurplus, mensFinancement, mensApresAides, autoconsoTotal, tarifRevente };
  };

  const finalize = () => {
    const calc = computePV();
    const score = 60 + Math.floor(Math.random() * 21);
    setResult({ calc, score });
    setStep(3);
  };

  const titles = ["Faisabilité", "Rentabilité", "Validation"];

  if (step === 3 && result) {
    return <ResultPage type="PV" result={result} form={f} onNew={() => { setF(PV_INIT); setStep(0); setResult(null); }} onSave={onSave} />;
  }

  return (
    <div style={{ padding: "24px 20px", maxWidth: 800, margin: "0 auto" }}>
      <ProgressBar step={step} total={3} titles={titles} color={C.yellow} />
      <h2 style={{ fontFamily: FONT, fontSize: 22, color: C.yellowDark, fontWeight: 900, marginBottom: 4 }}>☀️ {["Faisabilité technique PV", "Calcul de rentabilité PV", "Finalisation du dossier PV"][step]}</h2>
      <p style={{ color: C.muted, fontSize: 13, fontFamily: FONT, marginBottom: 20 }}>Pas d'obligation de répondre à tout pour continuer.</p>

      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {step === 0 && (<>
            <Field label="Nom" value={f.nom} onChange={v=>u("nom",v)} half placeholder="Dupont" />
            <Field label="Prénom" value={f.prenom} onChange={v=>u("prenom",v)} half placeholder="Jean" />
            <Field label="Code postal" value={f.cp} onChange={v=>u("cp",v)} half placeholder="69000" />
            <Field label="Ville" value={f.ville} onChange={v=>u("ville",v)} half placeholder="Lyon" />
            <Field label="Statut" value={f.habitation} onChange={v=>u("habitation",v)} half options={["Propriétaire","Locataire","SCI"]} />
            <Field label="Année de construction" value={f.annee} onChange={v=>u("annee",v)} half placeholder="1985" />
            <Field label="Installation électrique" value={f.elec_install} onChange={v=>u("elec_install",v)} half options={["Monophasé","Triphasé","Ne sait pas"]} />
            <Field label="Mode de chauffage" value={f.chauffage} onChange={v=>u("chauffage",v)} half options={["Gaz","Électrique","Fioul","Bois / Granulés","Pompe à chaleur"]} />
            <Field label="ECS (Eau chaude)" value={f.ecs} onChange={v=>u("ecs",v)} half options={["Ballon électrique","Chaudière","Thermodynamique","Solaire","Ne sait pas"]} />
            <Field label="Vitrage" value={f.vitrage} onChange={v=>u("vitrage",v)} half options={["Simple","Double","Triple"]} />
            <Field label="Type de chauffage" value={f.type_chauffage} onChange={v=>u("type_chauffage",v)} half options={["Bois","Gaz","Fioul","Électrique"]} />
            <Field label="Âge du système" value={f.age_chauffage} onChange={v=>u("age_chauffage",v)} half placeholder="10 ans" />
            <Field label="Surface habitable (m²)" value={f.m2} onChange={v=>u("m2",v)} half type="number" placeholder="120" />
            <Field label="Combles" value={f.combles} onChange={v=>u("combles",v)} half options={["Perdus","Aménagés"]} />
            <Field label="Nb occupants" value={f.occupants} onChange={v=>u("occupants",v)} half type="number" placeholder="3" />
            <Field label="Enfants à charge" value={f.enfants} onChange={v=>u("enfants",v)} half type="number" placeholder="2" />
            <Field label="Facture énergétique (€)" value={f.facture_energie} onChange={v=>u("facture_energie",v)} half type="number" placeholder="2400" />
            <Field label="Période" value={f.facture_periode} onChange={v=>u("facture_periode",v)} half options={["Annuelle","Mensuelle"]} />
            <Field label="Activité professionnelle" value={f.metier} onChange={v=>u("metier",v)} half placeholder="Technicien" />
            <Field label="Salaire net mensuel (€)" value={f.salaire} onChange={v=>u("salaire",v)} half type="number" placeholder="2200" />
            <Field label="Crédit(s) en cours (€/mois)" value={f.credit} onChange={v=>u("credit",v)} half type="number" placeholder="0" />
          </>)}
          {step === 1 && (<>
            <div style={{ width: "100%", padding: 14, background: C.yellowLight, borderRadius: 10, borderLeft: `4px solid ${C.yellow}` }}>
              <p style={{ color: C.yellowDark, fontSize: 13, fontFamily: FONT, margin: 0, fontWeight: 700 }}>Sélectionnez la puissance et renseignez la consommation</p>
            </div>
            <div style={{ width: "100%" }}>
              <label style={{ display: "block", color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 8, fontFamily: FONT }}>Puissance installée</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {PV_GRILLE.map(g => (
                  <button key={g.kw} onClick={() => u("puissance", String(g.kw))} className="hover-lift" style={{
                    padding: "16px 8px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                    background: f.puissance === String(g.kw) ? `linear-gradient(135deg, ${C.yellow}20, ${C.yellowLight})` : C.white,
                    border: f.puissance === String(g.kw) ? `2px solid ${C.yellow}` : `1px solid ${C.border}`,
                    boxShadow: f.puissance === String(g.kw) ? `0 4px 15px ${C.yellow}30` : "none",
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: f.puissance === String(g.kw) ? C.yellowDark : C.text, fontFamily: FONT }}>{g.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.green, fontFamily: FONT, marginTop: 4 }}>{fmt(g.prix)}</div>
                  </button>
                ))}
              </div>
            </div>
            <Field label="Facture électrique annuelle (€)" value={f.facture_elec} onChange={v=>u("facture_elec",v)} half type="number" placeholder="1800" />
            <Field label="Consommation annuelle (kWh)" value={f.conso_kw} onChange={v=>u("conso_kw",v)} half type="number" placeholder="5000" />
            {(parseFloat(f.facture_elec) > 0) && <PVCalcDisplay calc={computePV()} />}
          </>)}
          {step === 2 && (<>
            <div style={{ width: "100%", padding: 14, background: C.greenLight, borderRadius: 10, borderLeft: `4px solid ${C.green}` }}>
              <p style={{ color: C.green, fontSize: 13, fontFamily: FONT, margin: 0, fontWeight: 700 }}>Validation des prérequis avant finalisation</p>
            </div>
            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[{ l: "Aspect technique", icon: "🔧" }, { l: "Motivation", icon: "💪" }, { l: "Capacité financière", icon: "💰" }].map((p, i) => (
                <div key={i} style={{ padding: 18, background: C.greenLight, borderRadius: 12, border: `1px solid ${C.green}30`, textAlign: "center" }}>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{p.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.green, fontFamily: FONT }}>{p.l}</div>
                  <div style={{ fontSize: 11, color: C.green, marginTop: 6, fontWeight: 600 }}>✓ Validé</div>
                </div>
              ))}
            </div>
            <Field label="Observation du technicien" value={f.observation} onChange={v=>u("observation",v)} placeholder="Notes sur le dossier..." rows={3} />
          </>)}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        {step > 0 ? <Btn onClick={() => setStep(s => s - 1)} variant="secondary">← Précédent</Btn> : <div />}
        {step < 2 ? <Btn onClick={() => setStep(s => s + 1)} variant="yellow">Suivant →</Btn> : <Btn onClick={finalize} variant="yellow">Voir le résultat</Btn>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// RESULT PAGE — JAUGE ÉLIGIBILITÉ
// ═══════════════════════════════════════════════════════════════

function ResultPage({ type, result, form, onNew, onSave }) {
  const { calc, score } = result;
  const saved = useRef(false);
  const [animScore, setAnimScore] = useState(0);
  const isITE = type === "ITE";
  const color = isITE ? C.green : C.yellow;

  useEffect(() => {
    const timer = setTimeout(() => setAnimScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const handleSave = (status) => {
    if (!saved.current) {
      saved.current = true;
      onSave({ ...form, score, status, type, date: new Date().toLocaleDateString("fr-FR"), calc });
    }
  };

  return (
    <div style={{ padding: "32px 20px", maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
      <div style={{
        width: 72, height: 72, background: `linear-gradient(135deg, ${color}, ${color}CC)`,
        borderRadius: 18, display: "inline-flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16, boxShadow: `0 10px 30px ${color}40`, animation: "countUp 0.6s ease both",
      }}>
        <span style={{ fontSize: 38, filter: "brightness(0) invert(1)" }}>🏛️</span>
      </div>
      <h2 style={{ fontFamily: FONT, fontSize: 26, color: C.text, fontWeight: 900, marginBottom: 6 }}>Résultat — Simulation {type}</h2>
      <p style={{ color: C.muted, fontFamily: FONT, marginBottom: 28 }}>{form.prenom} {form.nom} — {form.ville} {form.cp}</p>

      {/* JAUGE ÉLIGIBILITÉ */}
      <div style={{ ...card, padding: 28, marginBottom: 24, borderLeft: `4px solid ${color}` }}>
        <div style={{ fontSize: 12, color: C.muted, fontFamily: FONT, fontWeight: 700, textTransform: "uppercase", marginBottom: 16, letterSpacing: "1px" }}>Score d'éligibilité</div>
        <div style={{ position: "relative", height: 48, background: "#E8E8E8", borderRadius: 24, overflow: "hidden", marginBottom: 12 }}>
          <div style={{
            position: "absolute", top: 0, left: 0, height: "100%",
            width: `${animScore}%`,
            background: `linear-gradient(90deg, ${C.danger}, ${C.yellow}, ${C.green})`,
            borderRadius: 24, transition: "width 1.5s cubic-bezier(0.23,1,0.32,1)",
          }} />
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 900, color: "#FFF", fontFamily: FONT,
            textShadow: "0 2px 6px rgba(0,0,0,0.4)",
          }}>{score}%</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.light, fontFamily: FONT, fontWeight: 600 }}>
          <span>🔴 Non éligible</span><span>🟡 À valider</span><span>🟢 Éligible</span>
        </div>
      </div>

      {/* MESSAGE FÉLICITATIONS */}
      <div style={{
        ...card, padding: 28, marginBottom: 24,
        background: `linear-gradient(135deg, ${C.greenLight}, #F0FFF4)`,
        border: `2px solid ${C.green}40`,
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <h3 style={{ fontFamily: FONT, fontSize: 24, color: C.green, fontWeight: 900, marginBottom: 10 }}>Félicitations !</h3>
        <p style={{ fontFamily: FONT, fontSize: 16, color: C.text, lineHeight: 1.7 }}>
          Votre projet est estimé réalisable avec un accompagnement de l'État à hauteur de :
        </p>
        <div style={{
          fontSize: 42, fontWeight: 900, color: C.green, fontFamily: FONT, margin: "16px 0",
          animation: "countUp 0.8s ease 0.5s both",
        }}>≈ {score}%</div>
        <p style={{ fontFamily: FONT, fontSize: 16, color: C.green, fontWeight: 700, marginTop: 8 }}>
          🌍 Faites un pas vers l'environnement et la transition énergétique !
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Btn onClick={() => { handleSave("en_cours"); onNew(); }}>Enregistrer & Nouveau</Btn>
        <Btn onClick={onNew} variant="secondary">Nouvelle simulation</Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DOSSIERS — DASHBOARD TECHNICIEN
// ═══════════════════════════════════════════════════════════════

function Dossiers({ dossiers, setDossiers }) {
  const [filter, setFilter] = useState("tous");
  const filtered = filter === "tous" ? dossiers : dossiers.filter(d => d.status === filter);
  const colors = { en_cours: C.yellow, accepte: C.green, refuse: C.danger };
  const labels = { en_cours: "En cours", accepte: "Accepté", refuse: "Refusé" };

  return (
    <div style={{ padding: "24px 20px", maxWidth: 860, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 24, color: C.green, fontWeight: 900, marginBottom: 20 }}>📁 Gestion des dossiers</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { k: "tous", l: "Tous", c: C.green },
          { k: "en_cours", l: "En cours", c: C.yellow },
          { k: "accepte", l: "Acceptés", c: C.green },
          { k: "refuse", l: "Refusés", c: C.danger },
        ].map(x => (
          <button key={x.k} onClick={() => setFilter(x.k)} className="hover-lift" style={{
            padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: 700,
            background: filter === x.k ? `${x.c}15` : C.white,
            border: filter === x.k ? `2px solid ${x.c}` : `1px solid ${C.border}`,
            color: filter === x.k ? x.c : C.muted,
          }}>{x.l} ({x.k === "tous" ? dossiers.length : dossiers.filter(d => d.status === x.k).length})</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ ...card, padding: 50, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
          <p style={{ color: C.muted, fontFamily: FONT, fontSize: 15 }}>Aucun dossier enregistré.</p>
          <p style={{ color: C.light, fontFamily: FONT, fontSize: 13, marginTop: 6 }}>Lancez une simulation pour créer un dossier.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.5fr 1.5fr", gap: 10, padding: "8px 16px" }}>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Client</div>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Ville</div>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", textAlign: "center" }}>Score</div>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", textAlign: "center" }}>Statut</div>
          </div>
          {filtered.map((d, i) => (
            <div key={i} style={{
              ...card, padding: 14, display: "grid",
              gridTemplateColumns: "2fr 1fr 0.5fr 1.5fr", gap: 10, alignItems: "center",
              borderLeft: `4px solid ${colors[d.status]}`,
              animation: `fadeInUp 0.3s ease ${i * 0.05}s both`,
            }}>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.text }}>{d.prenom} {d.nom} <span style={{ fontSize: 11, padding: "2px 8px", background: d.type === "ITE" ? C.greenLight : C.yellowLight, borderRadius: 6, color: d.type === "ITE" ? C.green : C.yellowDark, fontWeight: 700 }}>{d.type}</span></div>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT, marginTop: 2 }}>{d.date}</div>
              </div>
              <div style={{ fontSize: 13, color: C.muted, fontFamily: FONT }}>{d.ville} {d.cp}</div>
              <div style={{ fontSize: 16, fontWeight: 900, fontFamily: FONT, color: C.green, textAlign: "center" }}>{d.score}%</div>
              <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                {["en_cours", "accepte", "refuse"].map(s => (
                  <button key={s} onClick={() => setDossiers(prev => prev.map((dd, ii) => ii === dossiers.indexOf(d) ? { ...dd, status: s } : dd))} style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: FONT,
                    background: d.status === s ? `${colors[s]}15` : "transparent",
                    border: d.status === s ? `2px solid ${colors[s]}` : `1px solid ${C.border}`,
                    color: d.status === s ? colors[s] : C.light,
                  }}>{labels[s]}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPLICATIF PAGE (BULLES ANIMÉES + IMAGES)
// ═══════════════════════════════════════════════════════════════

function ExplicatifPage({ title, icon, avantages, composants, color, images }) {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ padding: "28px 20px", maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 24, color: C.green, fontWeight: 900, marginBottom: 24 }}>{icon} {title}</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Bulles animées */}
        <div>
          <h3 style={{ fontFamily: FONT, fontSize: 15, color: color, fontWeight: 800, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>Avantages</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {avantages.map((a, i) => (
              <div key={i} className="hover-lift" style={{
                ...card, padding: 16, display: "flex", alignItems: "center", gap: 12,
                borderLeft: `4px solid ${color}`,
                animation: `slideInLeft 0.5s ease ${i * 0.12}s both`,
              }}>
                <div style={{
                  width: 44, height: 44, background: `${color}15`, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
                  animation: `float 3s ease-in-out ${i * 0.3}s infinite`,
                }}>{a.icon}</div>
                <div style={{ fontFamily: FONT, fontSize: 14, color: C.text, fontWeight: 600, lineHeight: 1.4 }}>{a.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Images grille */}
        <div>
          <h3 style={{ fontFamily: FONT, fontSize: 15, color: color, fontWeight: 800, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>Illustrations</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {images.map((url, i) => (
              <div key={i} style={{
                borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "4/3",
                animation: `fadeInUp 0.5s ease ${i * 0.15}s both`,
              }}>
                <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Composants du système */}
      <h3 style={{ fontFamily: FONT, fontSize: 15, color: C.green, fontWeight: 800, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>Composants du système</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
        {composants.map(c => (
          <button key={c.id} onClick={() => setSelected(selected === c.id ? null : c.id)} className="hover-lift" style={{
            padding: 16, borderRadius: 12, cursor: "pointer", textAlign: "left",
            background: selected === c.id ? C.greenLight : C.white,
            border: selected === c.id ? `2px solid ${C.green}` : `1px solid ${C.border}`,
            boxShadow: selected === c.id ? `0 4px 15px ${C.green}20` : "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 13, fontFamily: FONT, marginBottom: 4 }}>{c.nom}</div>
            <div style={{ color: C.muted, fontSize: 11, fontFamily: FONT, lineHeight: 1.4 }}>{c.desc}</div>
          </button>
        ))}
      </div>
      {selected && (
        <div style={{ ...card, padding: 18, borderLeft: `4px solid ${C.green}`, animation: "fadeInUp 0.3s ease both" }}>
          <h4 style={{ color: C.green, fontFamily: FONT, fontWeight: 800, fontSize: 14, marginBottom: 8 }}>
            {composants.find(c => c.id === selected)?.icon} {composants.find(c => c.id === selected)?.nom}
          </h4>
          <p style={{ color: C.muted, fontFamily: FONT, fontSize: 13, marginBottom: 8 }}>{composants.find(c => c.id === selected)?.desc}</p>
          <div style={{ padding: 12, background: C.bg, borderRadius: 8 }}>
            <span style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", fontFamily: FONT }}>Détails techniques</span>
            <p style={{ color: C.text, fontSize: 13, fontFamily: FONT, marginTop: 4 }}>{composants.find(c => c.id === selected)?.detail}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FICHE SUBVENTIONS COMBINÉE
// ═══════════════════════════════════════════════════════════════

function FicheSubventions() {
  const [tab, setTab] = useState("ite");
  return (
    <div style={{ padding: "28px 20px", maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 24, color: C.green, fontWeight: 900, marginBottom: 20 }}>💶 Subventions 2026</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <button onClick={() => setTab("ite")} className="hover-lift" style={{
          flex: 1, padding: 16, borderRadius: 12, cursor: "pointer", textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 15,
          background: tab === "ite" ? C.greenLight : C.white, border: tab === "ite" ? `2px solid ${C.green}` : `1px solid ${C.border}`, color: tab === "ite" ? C.green : C.muted,
        }}>🧱 ITE</button>
        <button onClick={() => setTab("pv")} className="hover-lift" style={{
          flex: 1, padding: 16, borderRadius: 12, cursor: "pointer", textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 15,
          background: tab === "pv" ? C.yellowLight : C.white, border: tab === "pv" ? `2px solid ${C.yellow}` : `1px solid ${C.border}`, color: tab === "pv" ? C.yellowDark : C.muted,
        }}>☀️ PV</button>
      </div>

      {tab === "ite" && (
        <div style={{ animation: "fadeInUp 0.4s ease both" }}>
          <div style={{ ...card, marginBottom: 16 }}>
            <h3 style={{ fontFamily: FONT, color: C.green, fontSize: 16, fontWeight: 800, marginBottom: 14 }}>MaPrimeRénov' — ITE</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { cat: "Très modestes", color: C.green, m: "75 €/m²" },
                { cat: "Modestes", color: C.info, m: "60 €/m²" },
                { cat: "Intermédiaires", color: C.yellow, m: "40 €/m²" },
                { cat: "Supérieurs", color: C.light, m: "Non éligible" },
              ].map((r, i) => (
                <div key={i} style={{ padding: 14, background: `${r.color}08`, borderRadius: 10, border: `1px solid ${r.color}25`, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: r.color, fontWeight: 700, fontFamily: FONT }}>{r.cat}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: r.color, fontFamily: FONT, marginTop: 4 }}>{r.m}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...card, marginBottom: 16 }}>
            <h3 style={{ fontFamily: FONT, color: C.info, fontSize: 15, fontWeight: 800, marginBottom: 10 }}>CEE + Bonus national</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: 16, background: C.infoBg, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.info, fontFamily: FONT }}>{CEE_PAR_M2} €/m²</div>
                <div style={{ fontSize: 12, color: C.muted, fontFamily: FONT, marginTop: 4 }}>CEE</div>
              </div>
              <div style={{ padding: 16, background: C.yellowLight, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.yellowDark, fontFamily: FONT }}>{fmt(BONUS_NATIONAL)}</div>
                <div style={{ fontSize: 12, color: C.muted, fontFamily: FONT, marginTop: 4 }}>Aide bonus nationale</div>
              </div>
            </div>
          </div>
          <div style={{ ...card, padding: 18, borderLeft: `4px solid ${C.green}` }}>
            <div style={{ fontFamily: FONT, fontSize: 13, color: C.text, lineHeight: 1.9 }}>
              <strong>Formule :</strong> (surface m² × prix TTC) − (13 × surface m²)<br />
              <strong>Éco-PTZ</strong> — jusqu'à 50 000€ sur 20 ans | <strong>TVA 5,5%</strong> | <strong>Aides locales</strong>
            </div>
          </div>
        </div>
      )}

      {tab === "pv" && (
        <div style={{ animation: "fadeInUp 0.4s ease both" }}>
          <div style={{ ...card, marginBottom: 16 }}>
            <h3 style={{ fontFamily: FONT, color: C.yellowDark, fontSize: 16, fontWeight: 800, marginBottom: 14 }}>Grille tarifaire après subvention</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
              {PV_GRILLE.map((g, i) => (
                <div key={i} style={{ padding: 16, background: C.yellowLight, borderRadius: 10, border: `1px solid ${C.yellow}30`, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: C.yellowDark, fontFamily: FONT }}>{g.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: C.green, fontFamily: FONT, marginTop: 6 }}>{fmt(g.prix)}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT, marginTop: 4 }}>TTC après subvention</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...card, padding: 18, borderLeft: `4px solid ${C.yellow}` }}>
            <div style={{ fontFamily: FONT, fontSize: 13, color: C.text, lineHeight: 1.9 }}>
              <strong>Prime autoconsommation</strong> — versée sur 5 ans par EDF OA<br />
              <strong>Rachat surplus</strong> — contrat 20 ans garanti par l'État (~0,10 à 0,18 €/kWh)<br />
              <strong>TVA réduite</strong> — 10% pour installations ≤ 3 kWc
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("accueil");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dossiers, setDossiers] = useState([]);

  const titles = {
    accueil: "Accueil",
    "simu-ite": "Simulation ITE",
    "simu-pv": "Simulation PV",
    dossiers: "Mes dossiers",
    "demo-ite": "Explicatif ITE",
    "demo-pv": "Explicatif PV",
    "fiche-sub": "Subventions 2026",
  };

  if (!user) return <><GlobalStyles /><Login onLogin={setUser} /></>;

  const addDossier = (d) => setDossiers(prev => [d, ...prev]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <GlobalStyles />
      <Sidebar active={active} setActive={setActive} onLogout={() => setUser(null)} open={sidebarOpen} setOpen={setSidebarOpen} />
      <TopBar setOpen={setSidebarOpen} title={titles[active] || "ÉcoRénov"} />

      <main style={{ animation: "fadeInUp 0.3s ease both" }} key={active}>
        {active === "accueil" && <Accueil setActive={setActive} />}
        {active === "simu-ite" && <SimuITE onSave={addDossier} />}
        {active === "simu-pv" && <SimuPV onSave={addDossier} />}
        {active === "dossiers" && <Dossiers dossiers={dossiers} setDossiers={setDossiers} />}
        {active === "demo-ite" && <ExplicatifPage title="Isolation Thermique par l'Extérieur" icon="🧱" avantages={ITE_AVANTAGES} composants={ITE_COMPOSANTS} color={C.green} images={ITE_IMAGES} />}
        {active === "demo-pv" && <ExplicatifPage title="Panneaux Solaires Photovoltaïques" icon="☀️" avantages={PV_AVANTAGES} composants={PV_COMPOSANTS} color={C.yellow} images={PV_IMAGES} />}
        {active === "fiche-sub" && <FicheSubventions />}
      </main>
    </div>
  );
}
