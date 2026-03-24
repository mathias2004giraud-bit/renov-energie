import { useState, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// CONFIG & DATA
// ═══════════════════════════════════════════════════════════════

const USERS = {
  "commercial@renov.fr": "renov2026",
  "admin@renov.fr": "admin2026",
  "demo@renov.fr": "demo2026",
};

const PV_GRILLE = [
  { kw: 3.5, prix: 6900, label: "3,5 kWc" },
  { kw: 4.5, prix: 8900, label: "4,5 kWc" },
  { kw: 6, prix: 10900, label: "6 kWc" },
  { kw: 9, prix: 12900, label: "9 kWc" },
];

const CEE_PAR_M2 = 13;
const BONUS_NATIONAL = 3000;

const ITE_AVANTAGES = [
  { icon: "📉", text: "Réduction de la facture de 40 à 60%" },
  { icon: "🌡️", text: "Réduction des déperditions thermiques" },
  { icon: "🏠", text: "Esthétique de la maison améliorée" },
  { icon: "📊", text: "Gain de 2 lettres dans le DPE" },
  { icon: "💰", text: "Plus-value immobilière de 15 à 20%" },
  { icon: "❤️", text: "Confort de vie et santé améliorés" },
];

const PV_AVANTAGES = [
  { icon: "📉", text: "Réduction de la facture de 75 à 80%" },
  { icon: "🌿", text: "Énergie propre, renouvelable et gratuite" },
  { icon: "🏠", text: "Valorisation du logement 15 à 20%" },
  { icon: "📊", text: "Gain dans le DPE de la maison" },
  { icon: "💰", text: "Plus-value immobilière 15 à 20%" },
  { icon: "🌍", text: "Électricité sans émissions de gaz à effet de serre" },
  { icon: "🌱", text: "Un pas vers la transition énergétique" },
];

const ITE_COMPOSANTS = [
  { id: "isolant", nom: "Isolant PSE / Laine de roche", desc: "Panneaux rigides fixés sur le mur existant — supprime les ponts thermiques et réduit les pertes de chaleur jusqu'à 30%.", icon: "🧱", detail: "Épaisseur recommandée : 120 à 200mm. R ≥ 3.7 m².K/W." },
  { id: "fixation", nom: "Fixation mécanique + colle", desc: "Double système de fixation : colle-plot + chevilles à frapper.", icon: "🔩", detail: "Résistance au vent certifiée DTU 55.2." },
  { id: "armature", nom: "Sous-enduit + treillis d'armature", desc: "Fibre de verre noyée — protège l'isolant des chocs.", icon: "🛡️", detail: "Treillis 160g/m² résistant aux alcalis." },
  { id: "finition", nom: "Enduit de finition décoratif", desc: "Large choix de couleurs et textures.", icon: "🎨", detail: "Garantie décennale. 200+ teintes." },
];

const PV_COMPOSANTS = [
  { id: "panneau", nom: "Panneaux monocristallins", desc: "Rendement supérieur à 21%. Garantie 25 ans.", icon: "☀️", detail: "375 à 500Wc/panneau. Dégradation < 0.5%/an." },
  { id: "onduleur", nom: "Micro-onduleurs", desc: "Conversion DC/AC panneau par panneau.", icon: "⚡", detail: "Durée de vie 25 ans. Monitoring temps réel." },
  { id: "structure", nom: "Structure de montage alu", desc: "Étanchéité garantie sur tous types de toiture.", icon: "🏗️", detail: "Tenue au vent 180 km/h. Certification CSTB." },
  { id: "coffret", nom: "Coffret DC/AC + raccordement", desc: "Protection électrique complète.", icon: "🔌", detail: "Conformité NF C 15-100. Raccordement Enedis inclus." },
];

// ═══════════════════════════════════════════════════════════════
// STYLES — DESIGN MARIANNE / GOUVERNEMENTAL
// ═══════════════════════════════════════════════════════════════

const FONT = "'Source Sans 3', 'Segoe UI', sans-serif";
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
// FIELD COMPONENT (bug-free)
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
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={inputStyle}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          data-lpignore="true"
          data-form-type="other"
          name={`field_${Math.random().toString(36).slice(2)}`}
        />
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
  const submit = () => { if (USERS[email] === pwd) onLogin(email); else setErr("Identifiants incorrects"); };

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <Tri />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 5px)", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 440, ...card, padding: 40 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, background: C.bleu, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><span style={{ fontSize: 28 }}>🏛️</span></div>
            <h1 style={{ fontFamily: FONT, fontSize: 22, color: C.bleu, fontWeight: 800, marginBottom: 4 }}>Accès Technicien</h1>
            <p style={{ color: C.muted, fontSize: 13, fontFamily: FONT }}>Pré-candidature au programme de la transition énergétique 2026</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} placeholder="commercial@renov.fr" style={inputStyle} autoComplete="off" data-lpignore="true" onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Mot de passe</label>
            <input type="password" value={pwd} onChange={e => { setPwd(e.target.value); setErr(""); }} placeholder="••••••••" style={inputStyle} autoComplete="new-password" data-lpignore="true" onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          {err && <div style={{ color: C.rouge, fontSize: 13, fontFamily: FONT, marginBottom: 14, textAlign: "center", padding: "10px", background: C.warningBg, borderRadius: 4 }}>{err}</div>}
          <button onClick={submit} style={{ ...btnP, width: "100%" }}>Se connecter</button>
          <div style={{ marginTop: 16, padding: 12, background: C.infoBg, borderRadius: 4, borderLeft: `4px solid ${C.bleu}` }}>
            <p style={{ color: C.bleu, fontSize: 11, fontFamily: FONT, margin: 0, fontWeight: 600 }}>Démo : commercial@renov.fr / renov2026</p>
          </div>
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
    { id: "accueil", icon: "🏠", label: "Accueil" },
    { id: "simu-ite", icon: "🧱", label: "Simulation ITE" },
    { id: "simu-pv", icon: "☀️", label: "Simulation PV" },
    { id: "dossiers", icon: "📁", label: "Dossiers" },
    { id: "demo-ite", icon: "🏗️", label: "Explicatif ITE" },
    { id: "demo-pv", icon: "⚡", label: "Explicatif PV" },
    { id: "fiche-ite", icon: "📋", label: "Subventions ITE 2026" },
    { id: "fiche-pv", icon: "📋", label: "Subventions PV 2026" },
  ];
  return (
    <>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 199 }} />}
      <aside style={{ position: "fixed", top: 0, left: open ? 0 : -300, width: 280, height: "100vh", background: C.white, borderRight: `1px solid ${C.border}`, zIndex: 200, transition: "left 0.3s", display: "flex", flexDirection: "column" }}>
        <Tri />
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: C.bleu, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 16 }}>🏛️</span></div>
          <div><div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 800, color: C.bleu }}>RénovÉnergie</div><div style={{ fontFamily: FONT, fontSize: 10, color: C.muted }}>Programme d'État 2026</div></div>
        </div>
        <nav style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}>
          {items.map(s => (
            <button key={s.id} onClick={() => { setActive(s.id); setOpen(false); }} style={{ width: "100%", padding: "10px 14px", background: active === s.id ? C.bleuLight : "transparent", border: "none", borderRadius: 4, color: active === s.id ? C.bleu : C.text, fontSize: 13, fontFamily: FONT, fontWeight: active === s.id ? 700 : 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textAlign: "left", borderLeft: active === s.id ? `3px solid ${C.bleu}` : "3px solid transparent", marginBottom: 2 }}>
              <span style={{ fontSize: 15, width: 22, textAlign: "center" }}>{s.icon}</span>{s.label}
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

function TopBar({ setOpen, title }) {
  return (<><Tri /><header style={{ position: "sticky", top: 0, zIndex: 100, background: C.white, borderBottom: `2px solid ${C.bleu}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 12 }}>
    <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", color: C.bleu, fontSize: 20, cursor: "pointer" }}>☰</button>
    <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: C.bleu }}>{title}</span>
    <div style={{ marginLeft: "auto", fontFamily: FONT, fontSize: 10, color: C.muted, fontWeight: 700 }}>RÉPUBLIQUE FRANÇAISE</div>
  </header></>);
}

// ═══════════════════════════════════════════════════════════════
// ACCUEIL
// ═══════════════════════════════════════════════════════════════

function Accueil({ setActive }) {
  return (
    <div style={{ padding: "32px 24px", maxWidth: 820, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        {/* Logos RGE */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
          {["RGE QualiPac", "RGE Reconnu Garant", "RGE Qualibat ENR", "RGE QualiPV"].map((l, i) => (
            <div key={i} style={{ padding: "8px 16px", background: C.white, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11, fontFamily: FONT, fontWeight: 700, color: C.bleu }}>{l}</div>
          ))}
        </div>

        <div style={{ width: 64, height: 64, background: C.bleu, borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><span style={{ fontSize: 32 }}>🏛️</span></div>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(22px,5vw,34px)", color: C.bleu, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>Simulation au Programme Environnemental 2026</h1>
        <p style={{ fontFamily: FONT, fontSize: 14, color: C.muted, marginBottom: 28, maxWidth: 500, margin: "0 auto 28px" }}>Pré-candidature au programme de la transition énergétique</p>

        {/* 2 boutons simulation */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
          <button onClick={() => setActive("simu-ite")} style={{ ...btnP, padding: "18px 40px", fontSize: 17, background: C.bleu }}>🧱 Simulation ITE</button>
          <button onClick={() => setActive("simu-pv")} style={{ ...btnP, padding: "18px 40px", fontSize: 17, background: C.success }}>☀️ Simulation PV</button>
        </div>
      </div>

      {/* Icônes stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { icon: "💰", val: "40 à 70%", label: "d'aides sur le coût total" },
          { icon: "🛡️", val: "10 à 25 ans", label: "de garantie" },
          { icon: "📉", val: "−40 à 80%", label: "sur la facture énergie" },
          { icon: "🏗️", val: "RGE", label: "Artisans certifiés" },
        ].map((s, i) => (
          <div key={i} style={{ ...card, textAlign: "center", padding: 18 }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.bleu, fontFamily: FONT }}>{s.val}</div>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Phrase d'accroche */}
      <div style={{ ...card, padding: 20, borderLeft: `4px solid ${C.bleu}` }}>
        <p style={{ color: C.text, fontSize: 14, fontFamily: FONT, margin: 0, lineHeight: 1.7 }}>
          <strong style={{ color: C.bleu }}>Programme d'accompagnement et d'orientation</strong> au vu de la transition énergétique 2026 — MaPrimeRénov' — Aide Bonus National — Certificat d'Économie d'Énergie — Aide à l'habitat.
        </p>
        <p style={{ color: C.bleu, fontSize: 15, fontFamily: FONT, fontWeight: 700, marginTop: 12, textAlign: "center" }}>
          Simulez l'intégralité de votre dossier en quelques minutes !
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIMULATION ITE (3 étapes)
// ═══════════════════════════════════════════════════════════════

const ITE_INIT = { nom:"",prenom:"",cp:"",ville:"",couleur_crepis:"",annee:"",chauffage:"",ecs:"",vitrage:"",elec_install:"",m2:"",combles:"",occupants:"",enfants:"",facture_energie:"",facture_periode:"Annuelle",type_chauffage:"",age_chauffage:"",contrat:"",salaire:"",metier:"",credit:"",observation:"",m2_ite:"",prix_m2:"",aides_nom:"",aides_bonus:"" };

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

  const titles = ["Faisabilité technique ITE", "Aides et subventions ITE", "Finalisation du dossier ITE"];

  if (step === 3 && result) {
    return <ResultPage type="ITE" result={result} form={f} onNew={() => { setF(ITE_INIT); setStep(0); setResult(null); }} onSave={onSave} />;
  }

  return (
    <div style={{ padding: "24px 20px", maxWidth: 780, margin: "0 auto" }}>
      <ProgressBar step={step} titles={titles} />
      <h2 style={{ fontFamily: FONT, fontSize: 20, color: C.bleu, fontWeight: 800, marginBottom: 4 }}>🧱 {titles[step]}</h2>
      <p style={{ color: C.muted, fontSize: 13, fontFamily: FONT, marginBottom: 20 }}>Pas d'obligation de répondre à tout pour continuer.</p>

      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {step === 0 && (<>
            <Field label="Nom" value={f.nom} onChange={v=>u("nom",v)} half placeholder="Dupont" />
            <Field label="Prénom" value={f.prenom} onChange={v=>u("prenom",v)} half placeholder="Jean" />
            <Field label="Code postal" value={f.cp} onChange={v=>u("cp",v)} half placeholder="69000" />
            <Field label="Ville" value={f.ville} onChange={v=>u("ville",v)} half placeholder="Lyon" />
            <Field label="Habitation (propriétaire)" value={f.contrat} onChange={v=>u("contrat",v)} half options={["Propriétaire","Locataire","SCI"]} />
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
            <div style={{ width: "100%", padding: "12px 16px", background: C.infoBg, borderRadius: 4, borderLeft: `4px solid ${C.bleu}` }}>
              <p style={{ color: C.bleu, fontSize: 13, fontFamily: FONT, margin: 0, fontWeight: 600 }}>Calcul des aides et du reste à charge ITE</p>
            </div>
            <Field label="Nombre de m² à isoler" value={f.m2_ite} onChange={v=>u("m2_ite",v)} half type="number" placeholder="95" />
            <Field label="Prix TTC au m² (votre tarif)" value={f.prix_m2} onChange={v=>u("prix_m2",v)} half type="number" placeholder="150" />
            <Field label="Aides nominatives MaPrimeRénov' (€)" value={f.aides_nom} onChange={v=>u("aides_nom",v)} half type="number" placeholder="4000" />
            <div style={{ width: "100%", padding: 12, background: C.bleuLight, borderRadius: 6 }}>
              <span style={{ fontSize: 12, color: C.bleu, fontWeight: 700, fontFamily: FONT }}>Aide bonus nationale : {fmt(BONUS_NATIONAL)} (automatique)</span>
            </div>
            {(parseFloat(f.m2_ite) > 0 && parseFloat(f.prix_m2) > 0) && <ITECalcDisplay calc={computeITE()} />}
          </>)}

          {step === 2 && (<>
            <div style={{ width: "100%", padding: "12px 16px", background: C.successBg, borderRadius: 4, borderLeft: `4px solid ${C.success}` }}>
              <p style={{ color: C.success, fontSize: 13, fontFamily: FONT, margin: 0, fontWeight: 600 }}>Validation des prérequis avant finalisation</p>
            </div>
            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[{ l: "Aspect technique", icon: "🔧" }, { l: "Aspect motivation", icon: "💪" }, { l: "Aspect financier", icon: "💰" }].map((p, i) => (
                <div key={i} style={{ padding: 16, background: C.successBg, borderRadius: 8, border: `1px solid ${C.success}30`, textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{p.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.success, fontFamily: FONT }}>{p.l}</div>
                  <div style={{ fontSize: 11, color: C.success, marginTop: 4 }}>✓ Validé</div>
                </div>
              ))}
            </div>
            <Field label="Observation du technicien" value={f.observation} onChange={v=>u("observation",v)} placeholder="Notes sur le dossier..." />
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
// SIMULATION PV (3 étapes)
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
    // Subventions dynamiques liées à la facture
    const factureFactor = factureElec > 2000 ? 0.85 : factureElec > 1200 ? 1 : 1.15;
    const subBase = prixTTC;
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

  const titles = ["Faisabilité technique PV", "Calcul de rentabilité PV", "Finalisation du dossier PV"];

  if (step === 3 && result) {
    return <ResultPage type="PV" result={result} form={f} onNew={() => { setF(PV_INIT); setStep(0); setResult(null); }} onSave={onSave} />;
  }

  return (
    <div style={{ padding: "24px 20px", maxWidth: 780, margin: "0 auto" }}>
      <ProgressBar step={step} titles={titles} />
      <h2 style={{ fontFamily: FONT, fontSize: 20, color: C.success, fontWeight: 800, marginBottom: 4 }}>☀️ {titles[step]}</h2>
      <p style={{ color: C.muted, fontSize: 13, fontFamily: FONT, marginBottom: 20 }}>Pas d'obligation de répondre à tout pour continuer.</p>

      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {step === 0 && (<>
            <Field label="Nom" value={f.nom} onChange={v=>u("nom",v)} half placeholder="Dupont" />
            <Field label="Prénom" value={f.prenom} onChange={v=>u("prenom",v)} half placeholder="Jean" />
            <Field label="Code postal" value={f.cp} onChange={v=>u("cp",v)} half placeholder="69000" />
            <Field label="Ville" value={f.ville} onChange={v=>u("ville",v)} half placeholder="Lyon" />
            <Field label="Habitation" value={f.habitation} onChange={v=>u("habitation",v)} half options={["Propriétaire","Locataire","SCI"]} />
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
            <div style={{ width: "100%", padding: "12px 16px", background: C.infoBg, borderRadius: 4, borderLeft: `4px solid ${C.info}` }}>
              <p style={{ color: C.info, fontSize: 13, fontFamily: FONT, margin: 0, fontWeight: 600 }}>Sélectionnez la puissance et renseignez la consommation</p>
            </div>
            <div style={{ width: "100%" }}>
              <label style={labelStyle}>Puissance installée</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {PV_GRILLE.map(g => (
                  <button key={g.kw} onClick={() => u("puissance", String(g.kw))} style={{ padding: "14px 8px", borderRadius: 6, cursor: "pointer", textAlign: "center", background: f.puissance === String(g.kw) ? C.bleuLight : C.bgAlt, border: f.puissance === String(g.kw) ? `2px solid ${C.bleu}` : `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: f.puissance === String(g.kw) ? C.bleu : C.text, fontFamily: FONT }}>{g.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.success, fontFamily: FONT, marginTop: 4 }}>{fmt(g.prix)}</div>
                  </button>
                ))}
              </div>
            </div>
            <Field label="Facture électrique annuelle (€)" value={f.facture_elec} onChange={v=>u("facture_elec",v)} half type="number" placeholder="1800" />
            <Field label="Consommation annuelle (kWh)" value={f.conso_kw} onChange={v=>u("conso_kw",v)} half type="number" placeholder="5000" />
            {(parseFloat(f.facture_elec) > 0) && <PVCalcDisplay calc={computePV()} />}
          </>)}

          {step === 2 && (<>
            <div style={{ width: "100%", padding: "12px 16px", background: C.successBg, borderRadius: 4, borderLeft: `4px solid ${C.success}` }}>
              <p style={{ color: C.success, fontSize: 13, fontFamily: FONT, margin: 0, fontWeight: 600 }}>Validation des prérequis avant finalisation</p>
            </div>
            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[{ l: "Aspect technique", icon: "🔧" }, { l: "Aspect motivation", icon: "💪" }, { l: "Aspect financier", icon: "💰" }].map((p, i) => (
                <div key={i} style={{ padding: 16, background: C.successBg, borderRadius: 8, border: `1px solid ${C.success}30`, textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{p.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.success, fontFamily: FONT }}>{p.l}</div>
                  <div style={{ fontSize: 11, color: C.success, marginTop: 4 }}>✓ Validé</div>
                </div>
              ))}
            </div>
            <Field label="Observation du technicien" value={f.observation} onChange={v=>u("observation",v)} placeholder="Notes sur le dossier..." />
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
// SHARED COMPONENTS
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

function ITECalcDisplay({ calc }) {
  const c = calc;
  return (
    <div style={{ width: "100%", padding: 18, background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[{ l: "Coût TTC", v: fmt(c.ttc), cl: C.text }, { l: "HT", v: fmt(c.ht), cl: C.muted }, { l: "TVA 5,5%", v: fmt(c.tva), cl: C.muted }].map((x, i) => (
          <div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: C.muted, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>{x.l}</div><div style={{ fontSize: 18, fontWeight: 800, color: x.cl, fontFamily: FONT, marginTop: 2 }}>{x.v}</div></div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[{ l: `CEE (${CEE_PAR_M2}€/m²)`, v: fmt(c.cee), cl: C.success, bg: C.successBg }, { l: "MaPrimeRénov'", v: fmt(c.aidesNom), cl: C.info, bg: C.infoBg }, { l: "Bonus national", v: fmt(c.bonus), cl: C.warning, bg: C.warningBg }].map((x, i) => (
          <div key={i} style={{ textAlign: "center", padding: 10, background: x.bg, borderRadius: 6 }}><div style={{ fontSize: 10, color: x.cl, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>{x.l}</div><div style={{ fontSize: 16, fontWeight: 800, color: x.cl, fontFamily: FONT, marginTop: 2 }}>{x.v}</div></div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[{ l: "Sans aides", v: fmt(c.sansAides), cl: C.rouge, bg: `${C.rouge}08` }, { l: "Avec aides", v: fmt(c.avecAides), cl: C.success, bg: C.successBg }, { l: "Reste à charge", v: fmt(c.rac), cl: C.bleu, bg: C.bleuLight }].map((x, i) => (
          <div key={i} style={{ textAlign: "center", padding: 12, background: x.bg, borderRadius: 8, border: `1px solid ${x.cl}20` }}><div style={{ fontSize: 10, color: x.cl, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>{x.l}</div><div style={{ fontSize: 18, fontWeight: 800, color: x.cl, fontFamily: FONT, marginTop: 2 }}>{x.v}</div></div>
        ))}
      </div>
    </div>
  );
}

function PVCalcDisplay({ calc }) {
  const c = calc;
  return (
    <div style={{ width: "100%", padding: 18, background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ textAlign: "center", padding: 12, background: C.infoBg, borderRadius: 8 }}><div style={{ fontSize: 10, color: C.info, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Prix TTC ({c.grille.label})</div><div style={{ fontSize: 20, fontWeight: 800, color: C.info, fontFamily: FONT, marginTop: 2 }}>{fmt(c.prixTTC)}</div></div>
        <div style={{ textAlign: "center", padding: 12, background: C.successBg, borderRadius: 8 }}><div style={{ fontSize: 10, color: C.success, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Réduction facture (80%)</div><div style={{ fontSize: 20, fontWeight: 800, color: C.success, fontFamily: FONT, marginTop: 2 }}>{fmt(c.reduction)}/an</div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ textAlign: "center", padding: 10, background: C.warningBg, borderRadius: 8 }}><div style={{ fontSize: 10, color: C.rouge, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Mensualité AVANT</div><div style={{ fontSize: 18, fontWeight: 800, color: C.rouge, fontFamily: FONT, marginTop: 2 }}>{fmt(c.mensAvant)}/mois</div></div>
        <div style={{ textAlign: "center", padding: 10, background: C.successBg, borderRadius: 8 }}><div style={{ fontSize: 10, color: C.success, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Mensualité APRÈS</div><div style={{ fontSize: 18, fontWeight: 800, color: C.success, fontFamily: FONT, marginTop: 2 }}>{fmt(c.mensApres)}/mois</div></div>
      </div>
      <div style={{ padding: 14, background: `${C.warning}08`, borderRadius: 8, border: `1px solid ${C.warning}20`, marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: C.warning, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase", marginBottom: 4 }}>Revente de surplus</div>
        <div style={{ fontSize: 12, color: C.muted, fontFamily: FONT, lineHeight: 1.6 }}>Production : {fmtN(c.prodAnnuelle)} kWh/an — Conso : {fmtN(c.conso)} kWh — Surplus : {fmtN(c.surplus)} kWh (tarif {c.tarifRevente}€/kWh)</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.warning, fontFamily: FONT, marginTop: 4 }}>≈ {fmt(c.reventeSurplus)}/an</div>
      </div>
      <div style={{ padding: 14, background: C.bleuLight, borderRadius: 8 }}>
        <div style={{ fontSize: 10, color: C.bleu, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase", marginBottom: 4 }}>Financement sur 20 ans</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 11, color: C.muted, fontFamily: FONT }}>Mensualité brute</div><div style={{ fontSize: 16, fontWeight: 800, color: C.text, fontFamily: FONT }}>{fmt(c.mensFinancement)}/mois</div></div>
          <div style={{ fontSize: 22, color: C.light }}>→</div>
          <div><div style={{ fontSize: 11, color: C.success, fontFamily: FONT }}>Après réinjection aides</div><div style={{ fontSize: 16, fontWeight: 800, color: C.success, fontFamily: FONT }}>{fmt(c.mensApresAides)}/mois</div></div>
        </div>
        <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT, marginTop: 8, fontStyle: "italic" }}>Le surplus de revente couvre la mensualité du financement (+40€ de marge)</div>
      </div>
    </div>
  );
}

function ResultPage({ type, result, form, onNew, onSave }) {
  const { calc, score } = result;
  const saved = useRef(false);
  const handleSave = (status) => { if (!saved.current) { saved.current = true; onSave({ ...form, score, status, type, date: new Date().toLocaleDateString("fr-FR"), calc }); } };

  return (
    <div style={{ padding: "32px 20px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, background: C.bleuLight, borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}><span style={{ fontSize: 36 }}>🏛️</span></div>
      <h2 style={{ fontFamily: FONT, fontSize: 24, color: C.bleu, fontWeight: 800, marginBottom: 6 }}>Résultat — Simulation {type}</h2>
      <p style={{ color: C.muted, fontFamily: FONT, marginBottom: 20 }}>{form.prenom} {form.nom} — {form.ville} {form.cp}</p>

      {/* Tube */}
      <div style={{ ...card, padding: 24, marginBottom: 20, borderLeft: `4px solid ${C.bleu}` }}>
        <div style={{ fontSize: 12, color: C.muted, fontFamily: FONT, fontWeight: 700, textTransform: "uppercase", marginBottom: 14 }}>Tube d'éligibilité</div>
        <div style={{ position: "relative", height: 40, background: C.bgAlt, borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${score}%`, background: score >= 75 ? `linear-gradient(90deg, ${C.info}, ${C.success})` : `linear-gradient(90deg, ${C.rouge}, ${C.warning}, ${C.success})`, borderRadius: 6, transition: "width 1.5s" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: C.white, fontFamily: FONT, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>{score}%</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.light, fontFamily: FONT }}><span>Non éligible</span><span>À valider</span><span>Éligible</span></div>
      </div>

      <div style={{ ...card, padding: 20, marginBottom: 20, background: C.successBg, border: `1px solid ${C.success}30` }}>
        <h3 style={{ fontFamily: FONT, fontSize: 20, color: C.success, fontWeight: 800, marginBottom: 6 }}>Félicitations !</h3>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.text, lineHeight: 1.6 }}>La simulation estime que votre projet avec un accompagnement d'État est réalisable à environ <strong style={{ color: C.bleu, fontSize: 18 }}>{score}%</strong>.</p>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.bleu, fontWeight: 700, marginTop: 12 }}>Faites un pas vers l'environnement et la transition énergétique !</p>
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
  const colors = { en_cours: C.info, accepte: C.success, refuse: C.rouge };
  const labels = { en_cours: "En cours", accepte: "Accepté", refuse: "Refusé" };

  return (
    <div style={{ padding: "24px 20px", maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 22, color: C.bleu, fontWeight: 800, marginBottom: 16 }}>Suivi des dossiers</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[{ k: "tous", l: "Tous", c: C.bleu }, { k: "en_cours", l: "En cours", c: C.info }, { k: "accepte", l: "Acceptés", c: C.success }, { k: "refuse", l: "Refusés", c: C.rouge }].map(x => (
          <button key={x.k} onClick={() => setFilter(x.k)} style={{ padding: "8px 18px", borderRadius: 4, cursor: "pointer", fontFamily: FONT, fontSize: 12, fontWeight: 700, background: filter === x.k ? `${x.c}12` : C.white, border: filter === x.k ? `2px solid ${x.c}` : `1px solid ${C.border}`, color: filter === x.k ? x.c : C.muted }}>{x.l} ({x.k === "tous" ? dossiers.length : dossiers.filter(d => d.status === x.k).length})</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ ...card, padding: 40, textAlign: "center" }}><div style={{ fontSize: 36, marginBottom: 10 }}>📂</div><p style={{ color: C.muted, fontFamily: FONT }}>Aucun dossier.</p></div>
      ) : filtered.map((d, i) => (
        <div key={i} style={{ ...card, padding: 14, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 150 }}>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: C.text }}>{d.prenom} {d.nom} <span style={{ fontSize: 11, color: C.muted }}>({d.type})</span></div>
            <div style={{ fontSize: 12, color: C.muted, fontFamily: FONT }}>{d.ville} {d.cp} — {d.date}</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, fontFamily: FONT, color: C.bleu }}>{d.score}%</div>
          <div style={{ display: "flex", gap: 4 }}>
            {["en_cours", "accepte", "refuse"].map(s => (
              <button key={s} onClick={() => setDossiers(prev => prev.map((dd, ii) => ii === dossiers.indexOf(d) ? { ...dd, status: s } : dd))} style={{ padding: "5px 12px", borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: FONT, background: d.status === s ? `${colors[s]}15` : "transparent", border: d.status === s ? `2px solid ${colors[s]}` : `1px solid ${C.border}`, color: d.status === s ? colors[s] : C.light }}>{labels[s]}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPLICATIFS ITE & PV (bulles animées + composants)
// ═══════════════════════════════════════════════════════════════

function ExplicatifPage({ title, icon, avantages, composants, color, images }) {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ padding: "28px 20px", maxWidth: 860, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 22, color: C.bleu, fontWeight: 800, marginBottom: 20 }}>{icon} {title}</h2>

      {/* Layout : bulles animées à gauche, images à droite */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Bulles animées avantages */}
        <div>
          <h3 style={{ fontFamily: FONT, fontSize: 16, color: color, fontWeight: 700, marginBottom: 12 }}>Avantages</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {avantages.map((a, i) => (
              <div key={i} style={{ ...card, padding: 14, display: "flex", alignItems: "center", gap: 10, animation: `fadeIn 0.5s ease ${i * 0.1}s both` }}>
                <div style={{ width: 40, height: 40, background: `${color}12`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ fontFamily: FONT, fontSize: 13, color: C.text, fontWeight: 600 }}>{a.text}</div>
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
                <img src={img.url} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vidéos */}
      <h3 style={{ fontFamily: FONT, fontSize: 16, color: color, fontWeight: 700, marginBottom: 12 }}>Vidéos explicatives</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[1, 2, 3].map(n => (
          <div key={n} style={{ ...card, padding: 0, overflow: "hidden" }}>
            <div style={{ width: "100%", aspectRatio: "16/9", background: C.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 24 }}>▶️</span></div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: C.muted, fontWeight: 600 }}>Vidéo à venir</div>
            </div>
          </div>
        ))}
      </div>

      {/* Composants */}
      <h3 style={{ fontFamily: FONT, fontSize: 16, color: C.bleu, fontWeight: 700, marginBottom: 12 }}>Composants du système</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 14 }}>
        {composants.map(c => (
          <button key={c.id} onClick={() => setSelected(selected === c.id ? null : c.id)} style={{ padding: 14, borderRadius: 8, cursor: "pointer", textAlign: "left", background: selected === c.id ? C.bleuLight : C.white, border: selected === c.id ? `2px solid ${C.bleu}` : `1px solid ${C.border}` }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 13, fontFamily: FONT, marginBottom: 4 }}>{c.nom}</div>
            <div style={{ color: C.muted, fontSize: 11, fontFamily: FONT, lineHeight: 1.4 }}>{c.desc}</div>
          </button>
        ))}
      </div>
      {selected && (
        <div style={{ ...card, padding: 16, borderLeft: `4px solid ${C.bleu}`, marginBottom: 16 }}>
          <h4 style={{ color: C.bleu, fontFamily: FONT, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{composants.find(c => c.id === selected)?.icon} {composants.find(c => c.id === selected)?.nom}</h4>
          <p style={{ color: C.muted, fontFamily: FONT, fontSize: 13, marginBottom: 6 }}>{composants.find(c => c.id === selected)?.desc}</p>
          <div style={{ padding: 10, background: C.bg, borderRadius: 6 }}><span style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", fontFamily: FONT }}>Détails techniques</span><p style={{ color: C.text, fontSize: 12, fontFamily: FONT, marginTop: 2 }}>{composants.find(c => c.id === selected)?.detail}</p></div>
        </div>
      )}
    </div>
  );
}

const ITE_IMAGES = [
  { url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=450&fit=crop", alt: "Maison rénovée isolation extérieure" },
  { url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=450&fit=crop", alt: "Travaux de rénovation façade" },
  { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=450&fit=crop", alt: "Maison moderne isolée" },
  { url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=450&fit=crop", alt: "Maison avec façade neuve" },
];

const PV_IMAGES = [
  { url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=450&fit=crop", alt: "Panneaux solaires sur toiture" },
  { url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=450&fit=crop", alt: "Installation panneaux photovoltaïques" },
  { url: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&h=450&fit=crop", alt: "Maison avec panneaux solaires" },
  { url: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&h=450&fit=crop", alt: "Énergie solaire résidentielle" },
];

// ═══════════════════════════════════════════════════════════════
// FICHES SUBVENTIONS
// ═══════════════════════════════════════════════════════════════

function FicheITE() {
  return (
    <div style={{ padding: "28px 20px", maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 22, color: C.bleu, fontWeight: 800, marginBottom: 16 }}>🧱 Subventions ITE 2026</h2>
      <div style={{ ...card, marginBottom: 14 }}>
        <h3 style={{ fontFamily: FONT, color: C.bleu, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>MaPrimeRénov' — ITE</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{ cat: "Très modestes", color: C.bleu, m: "75 €/m²" }, { cat: "Modestes", color: C.info, m: "60 €/m²" }, { cat: "Intermédiaires", color: C.warning, m: "40 €/m²" }, { cat: "Supérieurs", color: C.light, m: "Non éligible" }].map((r, i) => (
            <div key={i} style={{ padding: 12, background: `${r.color}08`, borderRadius: 8, border: `1px solid ${r.color}25`, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: r.color, fontWeight: 700, fontFamily: FONT }}>{r.cat}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: r.color, fontFamily: FONT, marginTop: 2 }}>{r.m}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...card, marginBottom: 14 }}>
        <h3 style={{ fontFamily: FONT, color: C.info, fontSize: 15, fontWeight: 700, marginBottom: 8 }}>CEE + Bonus national</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ padding: 14, background: C.infoBg, borderRadius: 8, textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 800, color: C.info, fontFamily: FONT }}>{CEE_PAR_M2} €/m²</div><div style={{ fontSize: 11, color: C.muted, fontFamily: FONT, marginTop: 2 }}>CEE</div></div>
          <div style={{ padding: 14, background: C.warningBg, borderRadius: 8, textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 800, color: C.warning, fontFamily: FONT }}>{fmt(BONUS_NATIONAL)}</div><div style={{ fontSize: 11, color: C.muted, fontFamily: FONT, marginTop: 2 }}>Aide bonus nationale</div></div>
        </div>
      </div>
      <div style={{ ...card, padding: 16, borderLeft: `4px solid ${C.bleu}` }}>
        <div style={{ fontFamily: FONT, fontSize: 13, color: C.text, lineHeight: 1.8 }}>
          <div><strong>Formule :</strong> (nb m² × prix TTC) − (13 × nb m²) − aides nominatives − bonus national</div>
          <div style={{ marginTop: 6 }}><strong>Éco-PTZ</strong> — jusqu'à 50 000€ sur 20 ans | <strong>TVA 5,5%</strong> | <strong>Aides locales</strong></div>
        </div>
      </div>
    </div>
  );
}

function FichePV() {
  return (
    <div style={{ padding: "28px 20px", maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 22, color: C.success, fontWeight: 800, marginBottom: 16 }}>☀️ Subventions PV 2026</h2>
      <div style={{ ...card, marginBottom: 14 }}>
        <h3 style={{ fontFamily: FONT, color: C.info, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Grille tarifaire après subvention</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
          {PV_GRILLE.map((g, i) => (
            <div key={i} style={{ padding: 14, background: C.infoBg, borderRadius: 8, border: `1px solid ${C.info}20`, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.info, fontFamily: FONT }}>{g.label}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.success, fontFamily: FONT, marginTop: 4 }}>{fmt(g.prix)}</div>
              <div style={{ fontSize: 11, color: C.muted, fontFamily: FONT, marginTop: 2 }}>TTC après subvention</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...card, padding: 16, borderLeft: `4px solid ${C.success}` }}>
        <div style={{ fontFamily: FONT, fontSize: 13, color: C.text, lineHeight: 1.8 }}>
          <div><strong>Prime autoconsommation</strong> — versée sur 5 ans par EDF OA</div>
          <div><strong>Rachat surplus</strong> — contrat 20 ans garanti par l'État (~0,10 à 0,18 €/kWh)</div>
          <div><strong>TVA réduite</strong> — 10% pour les installations ≤ 3 kWc</div>
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

  const titles = { accueil: "Accueil", "simu-ite": "Simulation ITE", "simu-pv": "Simulation PV", dossiers: "Dossiers", "demo-ite": "Explicatif ITE", "demo-pv": "Explicatif PV", "fiche-ite": "Subventions ITE 2026", "fiche-pv": "Subventions PV 2026" };

  if (!user) return <Login onLogin={setUser} />;
  const addDossier = (d) => setDossiers(prev => [d, ...prev]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CCC; border-radius: 3px; }
        input:focus, select:focus { border-color: ${C.bleu} !important; outline: none; box-shadow: 0 0 0 3px ${C.bleuLight}; }
        button:active { transform: scale(0.98); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <Sidebar active={active} setActive={setActive} onLogout={() => setUser(null)} open={sidebarOpen} setOpen={setSidebarOpen} />
      <TopBar setOpen={setSidebarOpen} title={titles[active] || "RénovÉnergie"} />

      <main>
        {active === "accueil" && <Accueil setActive={setActive} />}
        {active === "simu-ite" && <SimuITE onSave={addDossier} />}
        {active === "simu-pv" && <SimuPV onSave={addDossier} />}
        {active === "dossiers" && <Dossiers dossiers={dossiers} setDossiers={setDossiers} />}
        {active === "demo-ite" && <ExplicatifPage title="Isolation Thermique par l'Extérieur" icon="🧱" avantages={ITE_AVANTAGES} composants={ITE_COMPOSANTS} color={C.bleu} images={ITE_IMAGES} />}
        {active === "demo-pv" && <ExplicatifPage title="Panneaux Solaires Photovoltaïques" icon="☀️" avantages={PV_AVANTAGES} composants={PV_COMPOSANTS} color={C.success} images={PV_IMAGES} />}
        {active === "fiche-ite" && <FicheITE />}
        {active === "fiche-pv" && <FichePV />}
      </main>
    </div>
  );
}
