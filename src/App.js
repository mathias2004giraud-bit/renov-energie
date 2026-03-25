import { useState, useRef } from "react";
 
// ═══════════════════════════════════════════════════════════════
// IMAGES (base64) — conservées du code original
// ═══════════════════════════════════════════════════════════════
 
const LOGO_QUALIPAC = "data:image/jpeg;base64,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";
const LOGO_QUALIBAT = "data:image/jpeg;base64,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";
const LOGO_RGE = "data:image/jpeg;base64,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";
const LOGO_RGE_BIG = "data:image/jpeg;base64,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";
 
const ITE_IMG_AVANT_APRES_1 = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#2D6A4F" width="400" height="300"/><rect fill="#40916C" x="30" y="100" width="160" height="120" rx="8"/><rect fill="#52B788" x="210" y="100" width="160" height="120" rx="8"/><text x="110" y="170" fill="#FFF" font-size="14" text-anchor="middle" font-family="sans-serif">AVANT</text><text x="290" y="170" fill="#FFF" font-size="14" text-anchor="middle" font-family="sans-serif">APRÈS</text><text x="200" y="50" fill="#FFF" font-size="18" text-anchor="middle" font-family="sans-serif" font-weight="bold">Isolation ITE</text></svg>');
const ITE_IMG_AVANT_APRES_2 = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#1B3A4B" width="400" height="300"/><rect fill="#264653" x="50" y="80" width="300" height="140" rx="10"/><text x="200" y="160" fill="#FFF" font-size="16" text-anchor="middle" font-family="sans-serif" font-weight="bold">Rénovation façade</text></svg>');
const ITE_IMG_AVANT_APRES_3 = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#386641" width="400" height="300"/><polygon points="200,60 320,180 80,180" fill="#6A994E"/><rect fill="#A7C957" x="160" y="180" width="80" height="80"/><text x="200" y="280" fill="#FFF" font-size="14" text-anchor="middle" font-family="sans-serif">Maison isolée ITE</text></svg>');
const PV_IMG_MAISON_PV = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#003566" width="400" height="300"/><polygon points="200,40 340,160 60,160" fill="#0077B6"/><rect fill="#00B4D8" x="120" y="60" width="160" height="80" rx="4"/><text x="200" y="110" fill="#FFF" font-size="14" text-anchor="middle" font-family="sans-serif" font-weight="bold">Panneaux PV</text><rect fill="#0096C7" x="140" y="160" width="120" height="100"/><text x="200" y="280" fill="#FFF" font-size="13" text-anchor="middle" font-family="sans-serif">Maison solaire</text></svg>');
const PV_IMG_INSTALL_PV = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#001D3D" width="400" height="300"/><rect fill="#0077B6" x="40" y="40" width="150" height="100" rx="6"/><rect fill="#0077B6" x="210" y="40" width="150" height="100" rx="6"/><rect fill="#0077B6" x="40" y="160" width="150" height="100" rx="6"/><rect fill="#0077B6" x="210" y="160" width="150" height="100" rx="6"/><text x="200" y="290" fill="#FFF" font-size="13" text-anchor="middle" font-family="sans-serif">Installation PV</text></svg>');
const PV_IMG_SCHEMA_PV = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#023E8A" width="400" height="300"/><circle cx="80" cy="80" r="40" fill="#FFB703"/><line x1="120" y1="80" x2="200" y2="150" stroke="#FFF" stroke-width="2"/><rect fill="#0096C7" x="200" y="120" width="80" height="60" rx="6"/><line x1="280" y1="150" x2="350" y2="150" stroke="#FFF" stroke-width="2"/><rect fill="#48CAE4" x="310" y="120" width="60" height="60" rx="6"/><text x="200" y="280" fill="#FFF" font-size="13" text-anchor="middle" font-family="sans-serif">Schéma autoconsommation</text></svg>');
 
// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════
 
const USERS = {
  "mathias@renov.fr": { pwd: "renov2026", name: "Mathias" },
  "thomas@renov.fr": { pwd: "renov2026", name: "Thomas MORENO" },
  "sacha@renov.fr": { pwd: "renov2026", name: "Sacha MERLIN" },
  "admin@renov.fr": { pwd: "admin2026", name: "Admin" },
};
 
const PV_GRILLE = [
  { kw: 3.5, prix: 22390, sub: 6900, label: "3,5 kWc" },
  { kw: 4.5, prix: 25900, sub: 8900, label: "4,5 kWc" },
  { kw: 6, prix: 28900, sub: 9900, label: "6 kWc" },
  { kw: 9, prix: 31900, sub: 11900, label: "9 kWc" },
];
 
const CEE_PAR_M2 = 13;
const BONUS_NATIONAL = 3000;
 
const FONT = "'Marianne', 'Source Sans 3', 'Segoe UI', sans-serif";
const C = {
  bleu: "#000091", bleuLight: "#E3E3FD", bleuMid: "#6A6AF4",
  rouge: "#E1000F", bg: "#F6F6F6", white: "#FFFFFF", bgAlt: "#F0F0F0",
  border: "#DDDDDD", borderActive: "#000091", text: "#161616",
  muted: "#666666", light: "#929292",
  success: "#18753C", successBg: "#B8FEC9",
  warning: "#B34000", warningBg: "#FFE9E6",
  info: "#0063CB", infoBg: "#E8EDFF",
};
 
const fmt = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtN = (n) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n);
 
const inputStyle = { width: "100%", padding: "12px 16px", background: C.bgAlt, border: `2px solid ${C.border}`, borderRadius: 4, color: C.text, fontSize: 15, fontFamily: FONT, outline: "none", boxSizing: "border-box" };
const labelStyle = { display: "block", color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 6, fontFamily: FONT };
const btnP = { padding: "14px 32px", background: C.bleu, border: "none", borderRadius: 4, color: C.white, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: FONT };
const btnS = { padding: "12px 24px", background: C.white, border: `2px solid ${C.bleu}`, borderRadius: 4, color: C.bleu, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT };
const card = { background: C.white, borderRadius: 8, padding: 24, border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" };
 
function Tri() { return <div style={{ display: "flex", height: 5 }}><div style={{ flex: 1, background: "#000091" }} /><div style={{ flex: 1, background: "#FFF" }} /><div style={{ flex: 1, background: "#E1000F" }} /></div>; }
 
// ═══════════════════════════════════════════════════════════════
// FIELD
// ═══════════════════════════════════════════════════════════════
 
function Field({ label, value, onChange, type = "text", placeholder = "", half = false, options = null }) {
  return (
    <div style={{ flex: half ? "1 1 45%" : "1 1 100%", minWidth: half ? 160 : "auto" }}>
      <label style={labelStyle}>{label}</label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, appearance: "auto" }}>
          <option value="">— Choisir —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} autoComplete="off" name={`f_${Math.random().toString(36).slice(2)}`} />
      )}
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════
 
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const submit = () => { if (USERS[email] && USERS[email].pwd === pwd) onLogin(email); else setErr("Identifiants incorrects"); };
 
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #e8f5e9 0%, #c8e6c9 25%, #a5d6a7 50%, #81c784 75%, #66bb6a 100%)" }}>
      <Tri />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 5px)", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 440, ...card, padding: 40, backdropFilter: "blur(10px)", background: "rgba(255,255,255,0.95)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Portail Technicien</div>
            <p style={{ color: C.muted, fontSize: 13, fontFamily: FONT }}>Simulation au Programme Gouvernemental 2026</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} placeholder="commercial@renov.fr" style={inputStyle} autoComplete="off" onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Mot de passe</label>
            <input type="password" value={pwd} onChange={e => { setPwd(e.target.value); setErr(""); }} placeholder="••••••••" style={inputStyle} autoComplete="new-password" onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          {err && <div style={{ color: C.rouge, fontSize: 13, fontFamily: FONT, marginBottom: 14, textAlign: "center", padding: 10, background: C.warningBg, borderRadius: 4 }}>{err}</div>}
          <button onClick={submit} style={{ ...btnP, width: "100%" }}>Se connecter</button>
        </div>
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// SIDEBAR & TOPBAR
// ═══════════════════════════════════════════════════════════════
 
function Sidebar({ active, setActive, onLogout, open, setOpen }) {
  const items = [
    { id: "accueil", label: "Accueil" },
    { id: "simu-ite", label: "Simulation ITE" },
    { id: "simu-pv", label: "Simulation PV" },
    { id: "dossiers", label: "Dossiers" },
    { id: "demo-ite", label: "Explicatif ITE" },
    { id: "demo-pv", label: "Explicatif PV" },
    { id: "fiche-ite", label: "Subventions ITE 2026" },
    { id: "fiche-pv", label: "Subventions PV 2026" },
  ];
  return (
    <>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 199 }} />}
      <aside style={{ position: "fixed", top: 0, left: open ? 0 : -300, width: 280, height: "100vh", background: C.white, borderRight: `1px solid ${C.border}`, zIndex: 200, transition: "left 0.3s", display: "flex", flexDirection: "column" }}>
        <Tri />
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 800, color: C.bleu }}>Vérisi</div>
          <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted }}>Transition Énergétique 2026</div>
        </div>
        <nav style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}>
          {items.map(s => (
            <button key={s.id} onClick={() => { setActive(s.id); setOpen(false); }} style={{ width: "100%", padding: "10px 14px", background: active === s.id ? C.bleuLight : "transparent", border: "none", borderRadius: 4, color: active === s.id ? C.bleu : C.text, fontSize: 13, fontFamily: FONT, fontWeight: active === s.id ? 700 : 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textAlign: "left", borderLeft: active === s.id ? `3px solid ${C.bleu}` : "3px solid transparent", marginBottom: 2 }}>
              {s.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: `1px solid ${C.border}` }}>
          <button onClick={onLogout} style={{ ...btnS, width: "100%", padding: 10, fontSize: 12, borderWidth: 1 }}>Déconnexion</button>
        </div>
      </aside>
    </>
  );
}
 
function TopBar({ setOpen, title, userName }) {
  return (<><Tri /><header style={{ position: "sticky", top: 0, zIndex: 100, background: C.white, borderBottom: `1px solid ${C.border}`, padding: "8px 20px", display: "flex", alignItems: "center", gap: 12 }}>
    <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", color: C.bleu, fontSize: 20, cursor: "pointer" }}>☰</button>
    <div style={{ borderLeft: `3px solid ${C.bleu}`, paddingLeft: 10, marginLeft: 4 }}>
      <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 800, color: C.text }}>Vérisi</div>
      <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted }}>Transition Énergétique 2026</div>
    </div>
    <div style={{ marginLeft: 12 }}>
      <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: "#000" }}>Simulation au Programme Gouvernemental 2026</div>
      <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: C.muted }}>{title}</div>
    </div>
    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ textAlign: "right", marginRight: 8 }}>
        <div style={{ fontFamily: FONT, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>Portail Technicien — MAR</div>
        {userName && <div style={{ fontFamily: FONT, fontSize: 12, color: C.text, fontWeight: 600 }}>{userName}</div>}
      </div>
      <img src={LOGO_QUALIPAC} alt="RGE" style={{ height: 30, borderRadius: 3 }} />
      <img src={LOGO_QUALIBAT} alt="RGE" style={{ height: 30, borderRadius: 3 }} />
      <img src={LOGO_RGE} alt="RGE" style={{ height: 30, borderRadius: 3 }} />
    </div>
  </header></>);
}
 
// ═══════════════════════════════════════════════════════════════
// FOOTER GOV STYLE (inspiré du screenshot)
// ═══════════════════════════════════════════════════════════════
 
function GovFooter() {
  // Marianne bonnet phrygien SVG inline
  const MarianneSVG = () => (
    <svg width="50" height="56" viewBox="0 0 50 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 2C18 2 12 6 9 12C6 18 5 26 7 32C9 38 14 42 18 46H32C36 42 41 38 43 32C45 26 44 18 41 12C38 6 32 2 25 2Z" fill="#000091"/>
      <path d="M25 8C20 8 16 11 14 15C12 19 11 24 13 28C15 32 18 35 21 38H29C32 35 35 32 37 28C39 24 38 19 36 15C34 11 30 8 25 8Z" fill="#FFF"/>
      <ellipse cx="25" cy="48" rx="10" ry="6" fill="#000091"/>
      <rect x="15" y="50" width="20" height="4" rx="2" fill="#E1000F"/>
    </svg>
  );
 
  return (
    <footer style={{ background: "#FFF", marginTop: 40, borderTop: "2px solid #000091" }}>
      <Tri />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 20px" }}>
        {/* Bloc logos + liens */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #DDD" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Logo RGE tout à gauche */}
            <img src={LOGO_RGE_BIG} alt="RGE Reconnu Garant Environnement" style={{ height: 60, borderRadius: 4 }} />
            <div style={{ width: 1, height: 50, background: "#DDD" }} />
            {/* Marianne */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <MarianneSVG />
              <div>
                <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 800, color: "#161616", lineHeight: 1.2 }}>RÉPUBLIQUE</div>
                <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 800, color: "#161616", lineHeight: 1.2 }}>FRANÇAISE</div>
                <div style={{ fontFamily: FONT, fontSize: 9, color: "#666", marginTop: 3, fontStyle: "italic" }}>Liberté · Égalité · Fraternité</div>
              </div>
            </div>
            <div style={{ width: 1, height: 50, background: "#DDD" }} />
            {/* ANAH */}
            <div>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#161616" }}>Agence nationale</div>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#161616" }}>de l'habitat <span style={{ fontSize: 10, color: "#666" }}>Anah</span></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {["info.gouv.fr", "service-public.gouv.fr", "legifrance.gouv.fr", "data.gouv.fr"].map(l => (
              <a key={l} href={`https://${l}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT, fontSize: 13, color: "#161616", textDecoration: "none", fontWeight: 500 }}>{l} ↗</a>
            ))}
          </div>
        </div>
 
        {/* Bannière Services Publics — propre */}
        <div style={{ border: "1px solid #DDD", marginBottom: 24, overflow: "hidden", background: "#FFF" }}>
          <div style={{ display: "flex", alignItems: "center", minHeight: 80 }}>
            <div style={{ width: 180, height: 80, background: "linear-gradient(135deg, #000091 0%, #000091 100%)", position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 10, left: 10, width: 160, height: 14, background: "#000091", transform: "rotate(-6deg)" }} />
            </div>
            <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 900, color: "#161616", letterSpacing: 1, padding: "0 20px", lineHeight: 1.1 }}>
              SERVICES<br/>PUBLICS
            </div>
            <div style={{ flex: 1, background: "#B3B3E6", padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "stretch" }}>
              <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 800, color: "#161616" }}>Retrouvez nos engagements et nos résultats !</div>
            </div>
          </div>
        </div>
 
        {/* Liens bas de page */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16, paddingTop: 16, borderTop: "1px solid #DDD" }}>
          {["Plan du site", "Accessibilité : partiellement conforme", "Mentions légales", "Données personnelles", "Gestion des cookies", "Paramètres d'affichage"].map(l => (
            <span key={l} style={{ fontFamily: FONT, fontSize: 12, color: "#666" }}>{l}</span>
          ))}
        </div>
        <div style={{ fontFamily: FONT, fontSize: 11, color: "#999", lineHeight: 1.8, paddingTop: 12, borderTop: "1px solid #EEE" }}>
          <div>Sauf mention contraire, tous les contenus de ce site sont sous licence etalab-2.0 — V 2.0</div>
          <div>* Les simulations sont indicatives et ne constituent pas un engagement contractuel.</div>
        </div>
      </div>
    </footer>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// ACCUEIL — REFONTE COMPLÈTE
// ═══════════════════════════════════════════════════════════════
 
function Accueil({ setActive, userName }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
      {/* HERO — Titre principal */}
      <div style={{ textAlign: "center", padding: "40px 0 28px" }}>
        <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 3, marginBottom: 10 }}>Programme d'accompagnement et d'orientation</div>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(24px,5vw,38px)", color: "#000", fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>Simulation au Programme Gouvernemental 2026</h1>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.muted, maxWidth: 550, margin: "0 auto" }}>Transition Énergétique{userName ? ` — Bienvenue ${userName}` : ""}</p>
      </div>
 
      {/* 2 blocs ITE / PV avec fonds images */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
        {/* BLOC ITE */}
        <div>
        <div style={{ borderRadius: 12, overflow: "hidden", minHeight: 320, background: "linear-gradient(135deg, #003566 0%, #001D3D 30%, #0077B6 65%, #00B4D8 100%)", padding: 28, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏠</div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 2 }}>Isolation Thermique Extérieure</div>
                <h2 style={{ fontFamily: FONT, fontSize: 26, color: "#FFF", fontWeight: 800, margin: 0 }}>Simulation ITE</h2>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
            {[
              { val: "40-60%", lab: "d'économies énergétiques" },
              { val: "15 ans", lab: "garantie d'État" },
              { val: "+80%", lab: "confort amélioré" },
              { val: "+2 lettres", lab: "DPE gagnées" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#FFF", fontFamily: FONT }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontFamily: FONT, marginTop: 2 }}>{s.lab}</div>
              </div>
            ))}
          </div>
          </div>
        </div>
        <button onClick={() => setActive("simu-ite")} style={{ ...btnS, width: "100%", padding: "16px 0", fontSize: 17, borderRadius: 6, marginTop: -1 }}>Lancer la simulation ITE</button>
 
        {/* BLOC PV */}
        <div>
        <div style={{ borderRadius: 12, overflow: "hidden", minHeight: 320, background: "linear-gradient(135deg, #003566 0%, #001D3D 30%, #0077B6 65%, #00B4D8 100%)", padding: 28, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>☀️</div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 11, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 2 }}>Panneaux Photovoltaïques</div>
                <h2 style={{ fontFamily: FONT, fontSize: 26, color: "#FFF", fontWeight: 800, margin: 0 }}>Simulation PV</h2>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
            {[
              { val: "70-80%", lab: "économie sur la facture" },
              { val: "15-20%", lab: "plus-value immobilière" },
              { val: "25 ans", lab: "garantie" },
              { val: "100%", lab: "autoconsommation" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "12px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#FFF", fontFamily: FONT }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontFamily: FONT, marginTop: 2 }}>{s.lab}</div>
              </div>
            ))}
          </div>
          </div>
          </div>
        <button onClick={() => setActive("simu-pv")} style={{ ...btnS, width: "100%", padding: "16px 0", fontSize: 17, borderRadius: 6, marginTop: -1 }}>Lancer la simulation PV</button>
        </div>
      </div>
 
      {/* Phrase d'accroche */}
      <div style={{ ...card, padding: 20, borderLeft: `4px solid ${C.bleu}`, marginBottom: 20, textAlign: "center" }}>
        <p style={{ color: C.bleu, fontSize: 16, fontFamily: FONT, fontWeight: 700, margin: 0 }}>
          Simulez l'intégralité de votre dossier en quelques CLICS !
        </p>
        <p style={{ color: C.muted, fontSize: 12, fontFamily: FONT, marginTop: 6 }}>
          Programme d'accompagnement et d'orientation au vue de la transition énergétique 2026
        </p>
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════════════════════════
 
function ProgressBar({ step, titles }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        {titles.map((t, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", margin: "0 auto 4px", background: i <= step ? C.bleu : C.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: i <= step ? C.white : C.light, fontFamily: FONT }}>{i + 1}</div>
            {i === step && <div style={{ fontSize: 10, color: C.bleu, fontFamily: FONT, fontWeight: 700 }}>{t}</div>}
          </div>
        ))}
      </div>
      <div style={{ height: 4, background: C.bgAlt, borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${((step + 1) / titles.length) * 100}%`, background: C.bleu, borderRadius: 2, transition: "width 0.4s" }} />
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// SIMULATION ITE (simplified — keeps same logic, shorter for file size)
// ═══════════════════════════════════════════════════════════════
 
const ITE_INIT = { nom:"",prenom:"",cp:"",ville:"",annee:"",chauffage:"",m2:"",occupants:"",enfants:"",facture_energie:"",facture_periode:"Annuelle",salaire:"",credit:"",observation:"",m2_ite:"",prix_ttc:"",duree_ite:"15" };
 
function SimuITE({ onSave }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState(ITE_INIT);
  const [result, setResult] = useState(null);
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));
 
  const computeITE = () => {
    const m2 = parseFloat(f.m2_ite) || 0;
    const ttc = parseFloat(f.prix_ttc) || 0;
    const cee = m2 * CEE_PAR_M2;
    const enfants = parseInt(f.enfants) || 0;
    const bonus = enfants >= 2 ? BONUS_NATIONAL : 0;
    const totalAides = cee + bonus;
    const avecAides = Math.max(0, ttc - totalAides);
    const dur = parseFloat(f.duree_ite) || 15;
    const mensSansAides = Math.round(ttc / (dur * 12));
    const mensAvecAides = Math.max(0, Math.round(avecAides / (dur * 12)));
    return { m2, ttc, cee, bonus, totalAides, avecAides, mensSansAides, mensAvecAides, dur };
  };
 
  const finalize = () => {
    const calc = computeITE();
    const score = 60 + Math.floor(Math.random() * 21);
    setResult({ calc, score });
    setStep(3);
  };
 
  const titles = ["Faisabilité technique", "Aides et subventions", "Finalisation"];
 
  if (step === 3 && result) {
    return <ResultPage type="ITE" result={result} form={f} onNew={() => { setF(ITE_INIT); setStep(0); setResult(null); }} onSave={onSave} />;
  }
 
  return (
    <div style={{ padding: "24px 20px", maxWidth: 780, margin: "0 auto" }}>
      <ProgressBar step={step} titles={titles} />
      <h2 style={{ fontFamily: FONT, fontSize: 20, color: C.bleu, fontWeight: 800, marginBottom: 20 }}>{titles[step]}</h2>
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {step === 0 && (<>
            <Field label="Nom" value={f.nom} onChange={v=>u("nom",v)} half />
            <Field label="Prénom" value={f.prenom} onChange={v=>u("prenom",v)} half />
            <Field label="Code postal" value={f.cp} onChange={v=>u("cp",v)} half />
            <Field label="Ville" value={f.ville} onChange={v=>u("ville",v)} half />
            <Field label="Année construction" value={f.annee} onChange={v=>u("annee",v)} half />
            <Field label="Chauffage" value={f.chauffage} onChange={v=>u("chauffage",v)} half options={["Gaz","Électrique","Fioul","Bois","PAC"]} />
            <Field label="Surface (m²)" value={f.m2} onChange={v=>u("m2",v)} half type="number" />
            <Field label="Occupants" value={f.occupants} onChange={v=>u("occupants",v)} half type="number" />
            <Field label="Enfants à charge" value={f.enfants} onChange={v=>u("enfants",v)} half type="number" />
            <Field label="Facture énergie (€)" value={f.facture_energie} onChange={v=>u("facture_energie",v)} half type="number" />
            <Field label="Salaire net/mois (€)" value={f.salaire} onChange={v=>u("salaire",v)} half type="number" />
            <Field label="Crédits en cours (€/mois)" value={f.credit} onChange={v=>u("credit",v)} half type="number" />
          </>)}
          {step === 1 && (<>
            <Field label="m² à isoler" value={f.m2_ite} onChange={v=>u("m2_ite",v)} half type="number" />
            <Field label="Prix TTC total (€)" value={f.prix_ttc} onChange={v=>u("prix_ttc",v)} half type="number" />
            <Field label="Durée financement (ans)" value={f.duree_ite} onChange={v=>u("duree_ite",v)} half type="number" />
            {(parseFloat(f.m2_ite) > 0 && parseFloat(f.prix_ttc) > 0) && (() => {
              const c = computeITE();
              return (
                <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ textAlign: "center", padding: 12, background: C.successBg, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: C.success, fontWeight: 700 }}>CEE ({CEE_PAR_M2}€/m²)</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.success }}>{fmt(c.cee)}</div>
                  </div>
                  <div style={{ textAlign: "center", padding: 12, background: c.bonus > 0 ? C.infoBg : C.bgAlt, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: c.bonus > 0 ? C.info : C.light, fontWeight: 700 }}>Bonus national</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: c.bonus > 0 ? C.info : C.light }}>{c.bonus > 0 ? fmt(c.bonus) : "Non éligible"}</div>
                  </div>
                  <div style={{ textAlign: "center", padding: 12, background: C.bgAlt, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>Sans aides</div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{fmt(c.mensSansAides)}/mois</div>
                  </div>
                  <div style={{ textAlign: "center", padding: 12, background: C.successBg, borderRadius: 8, border: `1px solid ${C.success}30` }}>
                    <div style={{ fontSize: 10, color: C.success, fontWeight: 700 }}>Avec aides</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.success }}>{fmt(c.mensAvecAides)}/mois</div>
                  </div>
                </div>
              );
            })()}
          </>)}
          {step === 2 && (<>
            <Field label="Observation du technicien" value={f.observation} onChange={v=>u("observation",v)} />
          </>)}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        {step > 0 ? <button onClick={() => setStep(s => s - 1)} style={btnS}>← Précédent</button> : <div />}
        {step < 2 ? <button onClick={() => setStep(s => s + 1)} style={btnP}>Suivant →</button> : <button onClick={finalize} style={{ ...btnP, background: C.success }}>Voir le résultat</button>}
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// SIMULATION PV
// ═══════════════════════════════════════════════════════════════
 
const PV_INIT = { nom:"",prenom:"",cp:"",ville:"",annee:"",chauffage:"",m2:"",occupants:"",enfants:"",facture_energie:"",salaire:"",credit:"",observation:"",puissance:"6",facture_elec:"",conso_kw:"" };
 
function SimuPV({ onSave }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState(PV_INIT);
  const [result, setResult] = useState(null);
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));
 
  const computePV = () => {
    const pw = parseFloat(f.puissance) || 6;
    const grille = PV_GRILLE.find(g => g.kw === pw) || PV_GRILLE[2];
    const prixTTC = grille.prix;
    const aides = grille.sub;
    const factureElec = parseFloat(f.facture_elec) || 1800;
    const prixAvecAides = Math.max(0, prixTTC - aides);
    const mensSansAides = Math.round(prixTTC / (20 * 12));
    const mensAvecAides = 40;
    const tauxReduction = 80 + Math.round(Math.random() * 10);
    const reduction = Math.round(factureElec * (tauxReduction / 100));
    return { pw, grille, prixTTC, aides, prixAvecAides, mensSansAides, mensAvecAides, reduction, factureElec, tauxReduction };
  };
 
  const finalize = () => {
    const calc = computePV();
    const score = 60 + Math.floor(Math.random() * 21);
    setResult({ calc, score });
    setStep(3);
  };
 
  const titles = ["Faisabilité technique", "Calcul rentabilité", "Finalisation"];
 
  if (step === 3 && result) {
    return <ResultPage type="PV" result={result} form={f} onNew={() => { setF(PV_INIT); setStep(0); setResult(null); }} onSave={onSave} />;
  }
 
  return (
    <div style={{ padding: "24px 20px", maxWidth: 780, margin: "0 auto" }}>
      <ProgressBar step={step} titles={titles} />
      <h2 style={{ fontFamily: FONT, fontSize: 20, color: C.success, fontWeight: 800, marginBottom: 20 }}>{titles[step]}</h2>
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {step === 0 && (<>
            <Field label="Nom" value={f.nom} onChange={v=>u("nom",v)} half />
            <Field label="Prénom" value={f.prenom} onChange={v=>u("prenom",v)} half />
            <Field label="Code postal" value={f.cp} onChange={v=>u("cp",v)} half />
            <Field label="Ville" value={f.ville} onChange={v=>u("ville",v)} half />
            <Field label="Année construction" value={f.annee} onChange={v=>u("annee",v)} half />
            <Field label="Chauffage" value={f.chauffage} onChange={v=>u("chauffage",v)} half options={["Gaz","Électrique","Fioul","Bois","PAC"]} />
            <Field label="Surface (m²)" value={f.m2} onChange={v=>u("m2",v)} half type="number" />
            <Field label="Occupants" value={f.occupants} onChange={v=>u("occupants",v)} half type="number" />
            <Field label="Salaire net/mois (€)" value={f.salaire} onChange={v=>u("salaire",v)} half type="number" />
            <Field label="Crédits en cours (€/mois)" value={f.credit} onChange={v=>u("credit",v)} half type="number" />
          </>)}
          {step === 1 && (<>
            <div style={{ width: "100%" }}>
              <label style={labelStyle}>Puissance installée</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {PV_GRILLE.map(g => (
                  <button key={g.kw} onClick={() => u("puissance", String(g.kw))} style={{ padding: "14px 8px", borderRadius: 6, cursor: "pointer", textAlign: "center", background: f.puissance === String(g.kw) ? C.bleuLight : C.bgAlt, border: f.puissance === String(g.kw) ? `2px solid ${C.bleu}` : `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: f.puissance === String(g.kw) ? C.bleu : C.text, fontFamily: FONT }}>{g.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.success, fontFamily: FONT, marginTop: 4 }}>{fmt(g.prix)}</div>
                    <div style={{ fontSize: 10, color: C.info, fontFamily: FONT }}>Aide : {fmt(g.sub)}</div>
                  </button>
                ))}
              </div>
            </div>
            <Field label="Facture élec. annuelle (€)" value={f.facture_elec} onChange={v=>u("facture_elec",v)} half type="number" />
            <Field label="Conso annuelle (kWh)" value={f.conso_kw} onChange={v=>u("conso_kw",v)} half type="number" />
            {(parseFloat(f.facture_elec) > 0) && (() => {
              const c = computePV();
              return (
                <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ textAlign: "center", padding: 12, background: C.infoBg, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: C.info, fontWeight: 700 }}>Aides / Subventions</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.info }}>{fmt(c.aides)}</div>
                  </div>
                  <div style={{ textAlign: "center", padding: 12, background: C.successBg, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: C.success, fontWeight: 700 }}>Prix après aides</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.success }}>{fmt(c.prixAvecAides)}</div>
                  </div>
                  <div style={{ textAlign: "center", padding: 12, background: C.bgAlt, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>Sans aides</div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{fmt(c.mensSansAides)}/mois</div>
                  </div>
                  <div style={{ textAlign: "center", padding: 12, background: C.successBg, borderRadius: 8, border: `1px solid ${C.success}30` }}>
                    <div style={{ fontSize: 10, color: C.success, fontWeight: 700 }}>Avec aides</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.success }}>{fmt(c.mensAvecAides)}/mois</div>
                  </div>
                </div>
              );
            })()}
          </>)}
          {step === 2 && (<>
            <Field label="Observation du technicien" value={f.observation} onChange={v=>u("observation",v)} />
          </>)}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        {step > 0 ? <button onClick={() => setStep(s => s - 1)} style={btnS}>← Précédent</button> : <div />}
        {step < 2 ? <button onClick={() => setStep(s => s + 1)} style={btnP}>Suivant →</button> : <button onClick={finalize} style={{ ...btnP, background: C.success }}>Voir le résultat</button>}
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// RESULT PAGE
// ═══════════════════════════════════════════════════════════════
 
function ResultPage({ type, result, form, onNew, onSave }) {
  const { score } = result;
  const saved = useRef(false);
  const handleSave = (status) => { if (!saved.current) { saved.current = true; onSave({ ...form, score, status, type, date: new Date().toLocaleDateString("fr-FR") }); } };
 
  return (
    <div style={{ padding: "32px 20px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 24, color: C.bleu, fontWeight: 800, marginBottom: 6 }}>Résultat — Simulation {type}</h2>
      <p style={{ color: C.muted, fontFamily: FONT, marginBottom: 20 }}>{form.prenom} {form.nom} — {form.ville} {form.cp}</p>
      <div style={{ ...card, padding: 24, marginBottom: 20, borderLeft: `4px solid ${C.bleu}` }}>
        <div style={{ fontSize: 12, color: C.muted, fontFamily: FONT, fontWeight: 700, textTransform: "uppercase", marginBottom: 14 }}>Tube d'éligibilité</div>
        <div style={{ position: "relative", height: 40, background: C.bgAlt, borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${score}%`, background: `linear-gradient(90deg, ${C.info}, ${C.success})`, borderRadius: 6, transition: "width 1.5s" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: C.white, fontFamily: FONT, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>{score}%</div>
        </div>
      </div>
      <div style={{ ...card, padding: 20, marginBottom: 20, background: C.successBg, border: `1px solid ${C.success}30` }}>
        <h3 style={{ fontFamily: FONT, fontSize: 20, color: C.success, fontWeight: 800, marginBottom: 6 }}>Félicitations !</h3>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.text }}>Votre projet est réalisable à environ <strong style={{ color: C.bleu, fontSize: 18 }}>{score}%</strong>.</p>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => { handleSave("en_cours"); onNew(); }} style={btnP}>Enregistrer & Nouveau</button>
        <button onClick={onNew} style={btnS}>Nouvelle simulation</button>
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// DOSSIERS
// ═══════════════════════════════════════════════════════════════
 
function Dossiers({ dossiers, setDossiers }) {
  const [filter, setFilter] = useState("tous");
  const filtered = filter === "tous" ? dossiers : dossiers.filter(d => d.status === filter);
  const colors = { en_cours: C.info, attente_fi: "#B34000", signe: C.success, pose: C.bleuMid, refuse: C.rouge };
  const labels = { en_cours: "En cours", attente_fi: "Attente FI", signe: "Signé", pose: "Posé", refuse: "Refusé" };
 
  return (
    <div style={{ padding: "24px 20px", maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 22, color: C.bleu, fontWeight: 800, marginBottom: 16 }}>Suivi des dossiers</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[{ k: "tous", l: "Tous", c: C.bleu }, { k: "en_cours", l: "En cours", c: C.info }, { k: "signe", l: "Signés", c: C.success }, { k: "refuse", l: "Refusés", c: C.rouge }].map(x => (
          <button key={x.k} onClick={() => setFilter(x.k)} style={{ padding: "8px 18px", borderRadius: 4, cursor: "pointer", fontFamily: FONT, fontSize: 12, fontWeight: 700, background: filter === x.k ? `${x.c}12` : C.white, border: filter === x.k ? `2px solid ${x.c}` : `1px solid ${C.border}`, color: filter === x.k ? x.c : C.muted }}>{x.l}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ ...card, padding: 40, textAlign: "center" }}><p style={{ color: C.muted, fontFamily: FONT }}>Aucun dossier.</p></div>
      ) : filtered.map((d, i) => (
        <div key={i} style={{ ...card, padding: 14, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 150 }}>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.text }}>{d.prenom} {d.nom} <span style={{ fontSize: 11, color: C.muted }}>({d.type})</span></div>
            <div style={{ fontSize: 12, color: C.muted, fontFamily: FONT }}>{d.ville} {d.cp} — {d.date}</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, fontFamily: FONT, color: C.bleu }}>{d.score}%</div>
          <div style={{ display: "flex", gap: 4 }}>
            {["en_cours", "signe", "refuse"].map(s => (
              <button key={s} onClick={() => setDossiers(prev => prev.map((dd, ii) => ii === dossiers.indexOf(d) ? { ...dd, status: s } : dd))} style={{ padding: "5px 12px", borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: FONT, background: d.status === s ? `${colors[s]}15` : "transparent", border: d.status === s ? `2px solid ${colors[s]}` : `1px solid ${C.border}`, color: d.status === s ? colors[s] : C.light }}>{labels[s]}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// EXPLICATIFS
// ═══════════════════════════════════════════════════════════════
 
const ITE_AVANTAGES = [
  "Réduction de la facture de 40 à 60%",
  "Réduction des déperditions thermiques",
  "Esthétique de la maison améliorée",
  "Gain de 2 lettres dans le DPE",
  "Plus-value immobilière de 15 à 20%",
  "Confort de vie et santé améliorés",
];
 
const PV_AVANTAGES = [
  "Réduction de la facture de 75 à 80%",
  "Énergie propre, renouvelable et gratuite",
  "Valorisation du logement 15 à 20%",
  "Gain dans le DPE de la maison",
  "Plus-value immobilière 15 à 20%",
  "Électricité sans émissions de gaz à effet de serre",
  "Un pas vers la transition énergétique",
];
 
function ExplicatifPage({ title, avantages, color, images }) {
  return (
    <div style={{ padding: "28px 20px", maxWidth: 860, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 22, color: C.bleu, fontWeight: 800, marginBottom: 20 }}>{title}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Bulles animées */}
        <div>
          <h3 style={{ fontFamily: FONT, fontSize: 16, color: color, fontWeight: 700, marginBottom: 12 }}>Avantages</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {avantages.map((a, i) => (
              <div key={i} style={{ ...card, padding: 14, display: "flex", alignItems: "center", gap: 10, animation: `fadeIn 0.5s ease ${i * 0.1}s both` }}>
                <div style={{ width: 36, height: 36, background: `${color}12`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: color, flexShrink: 0 }}>✓</div>
                <div style={{ fontFamily: FONT, fontSize: 13, color: C.text, fontWeight: 600 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Images côte à côte */}
        <div>
          <h3 style={{ fontFamily: FONT, fontSize: 16, color: color, fontWeight: 700, marginBottom: 12 }}>Illustrations</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {images.map((img, i) => (
              <div key={i} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "4/3" }}>
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
// FICHES SUBVENTIONS
// ═══════════════════════════════════════════════════════════════
 
function FicheITE() {
  return (
    <div style={{ padding: "28px 20px", maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 22, color: C.bleu, fontWeight: 800, marginBottom: 16 }}>Subventions ITE 2026</h2>
      <div style={{ ...card, marginBottom: 14 }}>
        <h3 style={{ fontFamily: FONT, color: C.info, fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Formule de calcul</h3>
        <div style={{ padding: 16, background: C.infoBg, borderRadius: 8, fontFamily: FONT, fontSize: 14, color: C.text, lineHeight: 1.8 }}>
          <strong>Reste à charge = </strong> (nb m² × prix TTC) − (13 × nb m²) − Aides nominatives − Bonus national
        </div>
      </div>
      <div style={{ ...card }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ padding: 14, background: C.infoBg, borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.info, fontFamily: FONT }}>{CEE_PAR_M2} €/m²</div>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT }}>CEE</div>
          </div>
          <div style={{ padding: 14, background: C.warningBg, borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.warning, fontFamily: FONT }}>{fmt(BONUS_NATIONAL)}</div>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT }}>Aide bonus nationale</div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
function FichePV() {
  return (
    <div style={{ padding: "28px 20px", maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 22, color: C.success, fontWeight: 800, marginBottom: 16 }}>Subventions PV 2026</h2>
      <div style={{ ...card }}>
        <h3 style={{ fontFamily: FONT, color: C.info, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Grille des aides / subventions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
          {PV_GRILLE.map((g, i) => (
            <div key={i} style={{ padding: 14, background: C.infoBg, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.info, fontFamily: FONT }}>{g.label}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.success, fontFamily: FONT, marginTop: 4 }}>Aide : {fmt(g.sub)}</div>
              <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT, marginTop: 2 }}>Prix : {fmt(g.prix)}</div>
            </div>
          ))}
        </div>
      </div>
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
 
  const userName = user && USERS[user] ? USERS[user].name : "";
  const titles = { accueil: "Accueil", "simu-ite": "Simulation ITE", "simu-pv": "Simulation PV", dossiers: "Dossiers", "demo-ite": "Explicatif ITE", "demo-pv": "Explicatif PV", "fiche-ite": "Subventions ITE", "fiche-pv": "Subventions PV" };
 
  if (!user) return <Login onLogin={setUser} />;
  const addDossier = (d) => setDossiers(prev => [{ ...d, commercial: userName }, ...prev]);
 
  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        input:focus, select:focus { border-color: ${C.bleu} !important; outline: none; box-shadow: 0 0 0 3px ${C.bleuLight}; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
 
      <Sidebar active={active} setActive={setActive} onLogout={() => { setUser(null); setDossiers([]); }} open={sidebarOpen} setOpen={setSidebarOpen} />
      <TopBar setOpen={setSidebarOpen} title={titles[active] || "Vérisi"} userName={userName} />
 
      <main>
        {active === "accueil" && <Accueil setActive={setActive} userName={userName} />}
        {active === "simu-ite" && <SimuITE onSave={addDossier} />}
        {active === "simu-pv" && <SimuPV onSave={addDossier} />}
        {active === "dossiers" && <Dossiers dossiers={dossiers} setDossiers={setDossiers} />}
        {active === "demo-ite" && <ExplicatifPage title="Isolation Thermique par l'Extérieur" avantages={ITE_AVANTAGES} color={C.bleu} images={[ITE_IMG_AVANT_APRES_1, ITE_IMG_AVANT_APRES_2, ITE_IMG_AVANT_APRES_3]} />}
        {active === "demo-pv" && <ExplicatifPage title="Panneaux Solaires Photovoltaïques" avantages={PV_AVANTAGES} color={C.success} images={[PV_IMG_MAISON_PV, PV_IMG_INSTALL_PV, PV_IMG_SCHEMA_PV]} />}
        {active === "fiche-ite" && <FicheITE />}
        {active === "fiche-pv" && <FichePV />}
      </main>
 
      <GovFooter />
    </div>
  );
}
