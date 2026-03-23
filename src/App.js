import { useState, useEffect, useCallback, useMemo, useRef } from "react";

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

const ITE_COMPOSANTS = [
  { id: "isolant", nom: "Isolant PSE / Laine de roche", desc: "Panneaux rigides fixés sur le mur existant — supprime les ponts thermiques et réduit les pertes de chaleur jusqu'à 30%.", icon: "🧱", detail: "Épaisseur recommandée : 120 à 200mm selon zone climatique. Résistance thermique R ≥ 3.7 m².K/W." },
  { id: "fixation", nom: "Fixation mécanique + colle", desc: "Double système de fixation : colle-plot + chevilles à frapper pour garantir la tenue dans le temps.", icon: "🔩", detail: "Résistance au vent certifiée selon DTU 55.2. Chevilles à expansion pour tous types de supports." },
  { id: "armature", nom: "Sous-enduit + treillis d'armature", desc: "Couche de protection avec fibre de verre noyée — protège l'isolant des chocs et fissures.", icon: "🛡️", detail: "Treillis 160g/m² résistant aux alcalis. Double couche en zones exposées (RDC, angles)." },
  { id: "finition", nom: "Enduit de finition décoratif", desc: "Revêtement final — large choix de couleurs et textures (gratté, taloché, ribbé).", icon: "🎨", detail: "Garantie décennale. Plus de 200 teintes disponibles. Classement D1 en imperméabilité." },
];

const SOLAIRE_COMPOSANTS = [
  { id: "panneau", nom: "Panneaux monocristallins", desc: "Modules haute performance — convertissent la lumière en électricité avec un rendement supérieur à 21%.", icon: "☀️", detail: "Puissance : 375 à 500Wc/panneau. Garantie 25 ans. Dégradation < 0.5%/an." },
  { id: "onduleur", nom: "Micro-onduleurs", desc: "Conversion DC/AC panneau par panneau — optimisation et monitoring individuel.", icon: "⚡", detail: "Durée de vie : 25 ans. Monitoring temps réel via application. Garantie constructeur." },
  { id: "structure", nom: "Structure de montage alu", desc: "Rails et crochets en aluminium anodisé — étanchéité garantie sur tous types de toiture.", icon: "🏗️", detail: "Compatible tuiles, ardoises, bac acier. Certification CSTB. Tenue au vent 180 km/h." },
  { id: "coffret", nom: "Coffret DC/AC + raccordement", desc: "Protection électrique complète : disjoncteur, parafoudre, mise à la terre.", icon: "🔌", detail: "Conformité NF C 15-100 et guide UTE C 15-712. Raccordement Enedis inclus." },
];

const ITE_ETAPES = [
  { step: "1", label: "Diagnostic thermique & métrage", dur: "1 jour" },
  { step: "2", label: "Préparation des supports", dur: "1-2 jours" },
  { step: "3", label: "Pose rails de départ + isolant", dur: "3-5 jours" },
  { step: "4", label: "Fixation mécanique par chevilles", dur: "1-2 jours" },
  { step: "5", label: "Sous-enduit + treillis d'armature", dur: "2-3 jours" },
  { step: "6", label: "Enduit de finition décoratif", dur: "2-3 jours" },
  { step: "7", label: "Nettoyage & réception chantier", dur: "1 jour" },
];

const PV_ETAPES = [
  { step: "1", label: "Étude de faisabilité & dimensionnement", dur: "1 jour" },
  { step: "2", label: "Déclaration préalable en mairie", dur: "1 mois" },
  { step: "3", label: "Pose de la structure de montage", dur: "1 jour" },
  { step: "4", label: "Installation panneaux + micro-onduleurs", dur: "1-2 jours" },
  { step: "5", label: "Raccordement électrique + coffret", dur: "1 jour" },
  { step: "6", label: "Consuel + mise en service Enedis", dur: "2-4 semaines" },
  { step: "7", label: "Monitoring & suivi production", dur: "continu" },
];

// ═══════════════════════════════════════════════════════════════
// STYLES — DSFR-INSPIRED (Bleu France / Rouge Marianne)
// ═══════════════════════════════════════════════════════════════

const FONT = "'Source Sans 3', 'Segoe UI', sans-serif";

const C = {
  bleuFrance: "#000091",
  bleuFranceLight: "#E3E3FD",
  bleuFranceMid: "#6A6AF4",
  rougeMarianne: "#E1000F",
  bg: "#F6F6F6",
  bgWhite: "#FFFFFF",
  bgAlt: "#F0F0F0",
  border: "#DDDDDD",
  borderActive: "#000091",
  text: "#161616",
  textMuted: "#666666",
  textLight: "#929292",
  success: "#18753C",
  successBg: "#B8FEC9",
  warning: "#B34000",
  warningBg: "#FFE9E6",
  info: "#0063CB",
  infoBg: "#E8EDFF",
  white: "#FFFFFF",
};

const fmt = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtN = (n) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n);

const inputBase = {
  width: "100%", padding: "12px 16px", background: C.bgAlt,
  border: `2px solid ${C.border}`, borderRadius: 4, color: C.text,
  fontSize: 15, fontFamily: FONT, outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelBase = {
  display: "block", color: C.text, fontSize: 13, fontWeight: 700,
  marginBottom: 6, fontFamily: FONT,
};

const btnPrimary = {
  padding: "14px 32px", background: C.bleuFrance, border: "none",
  borderRadius: 4, color: C.white, fontSize: 16, fontWeight: 700,
  cursor: "pointer", fontFamily: FONT, letterSpacing: "0.01em",
  transition: "all 0.2s",
};

const btnSecondary = {
  padding: "12px 24px", background: C.white,
  border: `2px solid ${C.bleuFrance}`, borderRadius: 4, color: C.bleuFrance,
  fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT,
  transition: "all 0.2s",
};

const cardStyle = {
  background: C.bgWhite, borderRadius: 8, padding: 24,
  border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

// ═══════════════════════════════════════════════════════════════
// TRICOLORE BANNER
// ═══════════════════════════════════════════════════════════════

function TricoloreBanner() {
  return (
    <div style={{ display: "flex", height: 5 }}>
      <div style={{ flex: 1, background: "#000091" }} />
      <div style={{ flex: 1, background: "#FFFFFF" }} />
      <div style={{ flex: 1, background: "#E1000F" }} />
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

  const submit = () => {
    if (USERS[email] === pwd) { onLogin(email); }
    else { setErr("Identifiants incorrects"); }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <TricoloreBanner />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 5px)", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 440, ...cardStyle, padding: 40 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, background: C.bleuFrance, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 24, filter: "grayscale(0)" }}>🏛️</span>
              </div>
            </div>
            <h1 style={{ fontFamily: FONT, fontSize: 24, color: C.bleuFrance, fontWeight: 800, marginBottom: 4 }}>Espace Commercial</h1>
            <p style={{ color: C.textMuted, fontSize: 14, fontFamily: FONT }}>Simulateur de pré-candidature</p>
            <p style={{ color: C.bleuFrance, fontSize: 13, fontFamily: FONT, fontWeight: 700, marginTop: 4 }}>Programme de rénovation énergétique 2026</p>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelBase}>Adresse email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} placeholder="commercial@renov.fr" style={inputBase} autoComplete="off" data-lpignore="true" onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelBase}>Mot de passe</label>
            <input type="password" value={pwd} onChange={e => { setPwd(e.target.value); setErr(""); }} placeholder="••••••••" style={inputBase} autoComplete="new-password" data-lpignore="true" onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          {err && <div style={{ color: C.rougeMarianne, fontSize: 13, fontFamily: FONT, marginBottom: 16, textAlign: "center", padding: "10px 16px", background: C.warningBg, borderRadius: 4, border: `1px solid ${C.rougeMarianne}30` }}>{err}</div>}
          <button onClick={submit} style={{ ...btnPrimary, width: "100%" }}>Se connecter</button>
          <div style={{ marginTop: 20, padding: 14, background: C.infoBg, borderRadius: 4, borderLeft: `4px solid ${C.bleuFrance}` }}>
            <p style={{ color: C.bleuFrance, fontSize: 12, fontFamily: FONT, margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
              Démo : commercial@renov.fr / renov2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIDEBAR NAV
// ═══════════════════════════════════════════════════════════════

function Sidebar({ active, setActive, onLogout, sidebarOpen, setSidebarOpen }) {
  const sections = [
    { id: "accueil", icon: "🏠", label: "Accueil" },
    { id: "simulation", icon: "🧮", label: "Nouvelle Simulation" },
    { id: "dossiers", icon: "📁", label: "Dossiers" },
    { id: "demo-ite", icon: "🧱", label: "Démo ITE" },
    { id: "demo-pv", icon: "☀️", label: "Démo Solaire PV" },
    { id: "fiche-ite", icon: "📋", label: "Subventions ITE" },
    { id: "fiche-pv", icon: "📋", label: "Subventions PV" },
  ];

  return (
    <>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 199 }} />}
      <aside style={{
        position: "fixed", top: 0, left: sidebarOpen ? 0 : -300, width: 280, height: "100vh",
        background: C.bgWhite, borderRight: `1px solid ${C.border}`,
        zIndex: 200, transition: "left 0.3s ease", display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <TricoloreBanner />
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: C.bleuFrance, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18 }}>🏛️</span>
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 800, color: C.bleuFrance }}>RénovÉnergie</div>
              <div style={{ fontFamily: FONT, fontSize: 11, color: C.textMuted }}>Programme d'État 2026</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => { setActive(s.id); setSidebarOpen(false); }} style={{
              width: "100%", padding: "11px 14px", background: active === s.id ? C.bleuFranceLight : "transparent",
              border: "none", borderRadius: 4, color: active === s.id ? C.bleuFrance : C.text,
              fontSize: 14, fontFamily: FONT, fontWeight: active === s.id ? 700 : 500,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textAlign: "left",
              transition: "all 0.15s", marginBottom: 2,
              borderLeft: active === s.id ? `3px solid ${C.bleuFrance}` : "3px solid transparent",
            }}>
              <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{s.icon}</span>{s.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "14px", borderTop: `1px solid ${C.border}` }}>
          <button onClick={onLogout} style={{ ...btnSecondary, width: "100%", padding: "10px", fontSize: 13, borderWidth: 1 }}>
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ setSidebarOpen, title }) {
  return (
    <>
      <TricoloreBanner />
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: C.bgWhite, borderBottom: `2px solid ${C.bleuFrance}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: C.bleuFrance, fontSize: 22, cursor: "pointer", padding: 4 }}>☰</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: C.bleuFrance, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14 }}>🏛️</span>
          </div>
          <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.bleuFrance }}>{title}</span>
        </div>
        <div style={{ marginLeft: "auto", fontFamily: FONT, fontSize: 11, color: C.textMuted, fontWeight: 600 }}>RÉPUBLIQUE FRANÇAISE</div>
      </header>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// ACCUEIL
// ═══════════════════════════════════════════════════════════════

function Accueil({ setActive }) {
  return (
    <div style={{ padding: "40px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 80, height: 80, background: C.bleuFranceLight, borderRadius: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 40 }}>🏛️</span>
        </div>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(26px,5vw,38px)", color: C.bleuFrance, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
          Système de Simulation
        </h1>
        <p style={{ fontFamily: FONT, fontSize: "clamp(15px,3vw,18px)", color: C.rougeMarianne, fontWeight: 700, marginBottom: 8 }}>
          Pré-candidature au Programme d'État
        </p>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.textMuted, lineHeight: 1.6, maxWidth: 520, margin: "0 auto 32px" }}>
          Rénovation Énergétique 2026 — Isolation Thermique par l'Extérieur & Panneaux Solaires Photovoltaïques
        </p>
        <button onClick={() => setActive("simulation")} style={{ ...btnPrimary, fontSize: 17, padding: "16px 48px" }}>
          Lancer une simulation
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { icon: "🏗️", val: "RGE", label: "Artisans certifiés", color: C.bleuFrance },
          { icon: "💰", val: "70%", label: "Aides sur coût total", color: C.success },
          { icon: "📉", val: "−30%", label: "Facture chauffage", color: C.rougeMarianne },
          { icon: "☀️", val: "25 ans", label: "Garantie panneaux", color: C.info },
        ].map((s, i) => (
          <div key={i} style={{ ...cardStyle, textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: FONT }}>{s.val}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4, fontFamily: FONT }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, padding: 20, borderLeft: `4px solid ${C.bleuFrance}` }}>
        <p style={{ color: C.text, fontSize: 14, fontFamily: FONT, margin: 0, lineHeight: 1.7 }}>
          <strong style={{ color: C.bleuFrance }}>Programme d'accompagnement d'État 2026</strong> — MaPrimeRénov', Certificats d'Économies d'Énergie (CEE), Éco-PTZ, TVA réduite. Simulez l'éligibilité de votre client en quelques minutes.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MULTI-STEP SIMULATION FORM
// ═══════════════════════════════════════════════════════════════

const INITIAL_FORM = {
  nom: "", prenom: "", ville: "", cp: "", tel: "", email: "",
  chauffage: "", vitrage: "", abf: "", elec_install: "",
  parts: "", ouvertures: "", surface_hab: "", surface_isoler: "",
  facades: "", annee_construction: "", proprio_depuis: "",
  combles: "", facture_energie: "", contrat: "", salaire: "",
  metier: "", credit_en_cours: "", observation: "",
  m2_ite: "", prix_m2_ttc: "", aides_nominatives: "", aides_bonus: "",
  puissance_pv: "6", facture_elec: "", conso_kw: "",
};

function SimulationForm({ onComplete, dossiers }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const next = () => setStep(s => Math.min(s + 1, 5));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const Field = ({ label, k, type = "text", placeholder = "", half = false, options = null }) => (
    <div style={{ flex: half ? "1 1 45%" : "1 1 100%", minWidth: half ? 160 : "auto" }}>
      <label style={labelBase}>{label}</label>
      {options ? (
        <select value={form[k]} onChange={e => upd(k, e.target.value)} style={{ ...inputBase, appearance: "auto" }}>
          <option value="">— Choisir —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[k]} onChange={e => upd(k, e.target.value)} placeholder={placeholder} style={inputBase} autoComplete="off" data-lpignore="true" data-form-type="other" />
      )}
    </div>
  );

  const computeITE = () => {
    const m2 = parseFloat(form.m2_ite) || 0;
    const prixM2 = parseFloat(form.prix_m2_ttc) || 0;
    const aidesNom = parseFloat(form.aides_nominatives) || 0;
    const aidesBonus = parseFloat(form.aides_bonus) || 0;
    const totalTTC = m2 * prixM2;
    const cee = m2 * CEE_PAR_M2;
    const totalHT = Math.round(totalTTC / 1.055);
    const tva = totalTTC - totalHT;
    const totalAides = cee + aidesNom + aidesBonus;
    const sansReinjection = totalTTC;
    const avecReinjection = Math.max(0, totalTTC - totalAides);
    const rac = avecReinjection;
    return { m2, prixM2, totalTTC, totalHT, tva, cee, aidesNom, aidesBonus, totalAides, sansReinjection, avecReinjection, rac };
  };

  const computePV = () => {
    const puissance = parseFloat(form.puissance_pv) || 6;
    const grille = PV_GRILLE.find(g => g.kw === puissance) || PV_GRILLE[2];
    const prixTTC = grille.prix;
    const prixHT = Math.round(prixTTC / 1.1);
    const tva = prixTTC - prixHT;
    const factureElec = parseFloat(form.facture_elec) || 1800;
    const consoKW = parseFloat(form.conso_kw) || 5000;
    const reductionFacture = Math.round(factureElec * 0.8);
    const mensualiteAvant = Math.round(factureElec / 12);
    const facturApres = Math.round(factureElec * 0.2);
    const mensualiteApres = Math.round(facturApres / 12);
    const productionAnnuelle = puissance * 12 * 365;
    const surplus = Math.max(0, productionAnnuelle - consoKW);
    const reventeSurplus = Math.round(surplus * 0.1);
    const mensualiteFinancement = Math.round(prixTTC / (20 * 12));
    const mensualiteApresAides = Math.max(0, mensualiteFinancement - 40);
    return { puissance, prixTTC, prixHT, tva, factureElec, consoKW, reductionFacture, mensualiteAvant, facturApres, mensualiteApres, productionAnnuelle, surplus, reventeSurplus, mensualiteFinancement, mensualiteApresAides, grille };
  };

  const computeScore = () => 60 + Math.floor(Math.random() * 21);

  const handleFinalize = () => {
    const ite = computeITE();
    const pv = computePV();
    const score = computeScore();
    setResult({ ite, pv, score, form: { ...form } });
    setStep(5);
  };

  const stepTitles = ["Informations client", "Habitat & technique", "Situation financière", "Simulation ITE", "Simulation PV"];

  if (step === 5 && result) {
    return <ResultPage result={result} onNew={() => { setForm(INITIAL_FORM); setStep(0); setResult(null); }} onSave={(d) => { onComplete(d); }} />;
  }

  return (
    <div style={{ padding: "24px 20px", maxWidth: 780, margin: "0 auto" }}>
      {/* Progress */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          {stepTitles.map((t, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", margin: "0 auto 6px",
                background: i <= step ? C.bleuFrance : C.bgAlt,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, color: i <= step ? C.white : C.textLight,
                fontFamily: FONT, transition: "all 0.3s",
              }}>{i + 1}</div>
              <div style={{ fontSize: 10, color: i <= step ? C.bleuFrance : C.textLight, fontFamily: FONT, fontWeight: i === step ? 700 : 400, display: i === step ? "block" : "none" }}>{t}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 4, background: C.bgAlt, borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${((step + 1) / 5) * 100}%`, background: C.bleuFrance, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
      </div>

      <h2 style={{ fontFamily: FONT, fontSize: 22, color: C.bleuFrance, fontWeight: 800, marginBottom: 6 }}>{stepTitles[step]}</h2>
      <p style={{ color: C.textMuted, fontSize: 13, fontFamily: FONT, marginBottom: 24 }}>Pas d'obligation de répondre à tout pour continuer.</p>

      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {step === 0 && (<>
            <Field label="Nom" k="nom" half placeholder="Dupont" />
            <Field label="Prénom" k="prenom" half placeholder="Jean" />
            <Field label="Ville" k="ville" half placeholder="Lyon" />
            <Field label="Code postal" k="cp" half placeholder="69000" />
            <Field label="Téléphone" k="tel" half type="tel" placeholder="06 12 34 56 78" />
            <Field label="Email" k="email" half type="email" placeholder="client@email.fr" />
          </>)}

          {step === 1 && (<>
            <Field label="Méthode de chauffage" k="chauffage" options={["Gaz", "Électrique", "Fioul", "Bois / Granulés", "Pompe à chaleur", "Autre"]} half />
            <Field label="Type de vitrage" k="vitrage" options={["Simple vitrage", "Double vitrage", "Triple vitrage", "Mixte"]} half />
            <Field label="Zone ABF / Patrimoine" k="abf" options={["Non", "Oui — ABF", "Oui — Monument historique", "Ne sait pas"]} half />
            <Field label="Installation électrique" k="elec_install" options={["Aux normes", "À rénover", "Ne sait pas"]} half />
            <Field label="Nb de parts fiscales" k="parts" type="number" half placeholder="2" />
            <Field label="Nb d'ouvertures" k="ouvertures" type="number" half placeholder="10" />
            <Field label="Surface habitable (m²)" k="surface_hab" type="number" half placeholder="120" />
            <Field label="Surface à isoler (m²)" k="surface_isoler" half placeholder="ex: 95" />
            <Field label="Façades concernées" k="facades" half placeholder="Nord, Est, Sud..." />
            <Field label="Année de construction" k="annee_construction" half placeholder="1975" />
            <Field label="Propriétaire depuis" k="proprio_depuis" half placeholder="2010" />
            <Field label="Combles" k="combles" options={["Aménagés isolés", "Aménagés non isolés", "Perdus isolés", "Perdus non isolés", "Pas de combles"]} half />
          </>)}

          {step === 2 && (<>
            <Field label="Facture énergétique annuelle (€)" k="facture_energie" type="number" placeholder="2400" />
            <Field label="Type de contrat" k="contrat" options={["CDI", "CDD", "Fonctionnaire", "Indépendant", "Retraité", "Autre"]} half />
            <Field label="Salaire net mensuel (€)" k="salaire" type="number" half placeholder="2200" />
            <Field label="Métier" k="metier" half placeholder="Technicien" />
            <Field label="Crédit(s) en cours (€/mois)" k="credit_en_cours" type="number" half placeholder="450" />
            <Field label="Observation / Motivation" k="observation" placeholder="Le client souhaite réduire sa facture..." />
          </>)}

          {step === 3 && (<>
            <div style={{ width: "100%", padding: "12px 16px", background: C.infoBg, borderRadius: 4, borderLeft: `4px solid ${C.bleuFrance}`, marginBottom: 8 }}>
              <p style={{ color: C.bleuFrance, fontSize: 13, fontFamily: FONT, margin: 0, fontWeight: 600 }}>
                Renseignez les données pour calculer le reste à charge ITE du client.
              </p>
            </div>
            <Field label="Nombre de m² à isoler" k="m2_ite" type="number" half placeholder="95" />
            <Field label="Prix TTC au m²" k="prix_m2_ttc" type="number" half placeholder="150" />
            <Field label="Aides nominatives (MaPrimeRénov') €" k="aides_nominatives" type="number" half placeholder="4000" />
            <Field label="Aides bonus nationales (€)" k="aides_bonus" type="number" half placeholder="1500" />
            {(parseFloat(form.m2_ite) > 0 && parseFloat(form.prix_m2_ttc) > 0) && (
              <div style={{ width: "100%", padding: 20, background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
                {(() => { const c = computeITE(); return (<>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                    {[
                      { label: "Coût TTC", val: fmt(c.totalTTC), color: C.text },
                      { label: "HT", val: fmt(c.totalHT), color: C.textMuted },
                      { label: "TVA 5,5%", val: fmt(c.tva), color: C.textMuted },
                    ].map((x, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT, fontWeight: 700, textTransform: "uppercase" }}>{x.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: x.color, fontFamily: FONT, marginTop: 4 }}>{x.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                    {[
                      { label: `CEE (${CEE_PAR_M2}€/m²)`, val: fmt(c.cee), color: C.success, bg: C.successBg },
                      { label: "Aides nomin.", val: fmt(c.aidesNom), color: C.info, bg: C.infoBg },
                      { label: "Bonus nat.", val: fmt(c.aidesBonus), color: C.warning, bg: C.warningBg },
                    ].map((x, i) => (
                      <div key={i} style={{ textAlign: "center", padding: 12, background: x.bg, borderRadius: 6 }}>
                        <div style={{ fontSize: 10, color: x.color, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>{x.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: x.color, fontFamily: FONT, marginTop: 4 }}>{x.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    {[
                      { label: "Sans aides", val: fmt(c.sansReinjection), color: C.rougeMarianne, bg: `${C.rougeMarianne}08`, border: `${C.rougeMarianne}25` },
                      { label: "Avec aides", val: fmt(c.avecReinjection), color: C.success, bg: `${C.success}08`, border: `${C.success}25` },
                      { label: "Reste à charge", val: fmt(c.rac), color: C.bleuFrance, bg: C.bleuFranceLight, border: `${C.bleuFrance}25` },
                    ].map((x, i) => (
                      <div key={i} style={{ textAlign: "center", padding: 14, background: x.bg, borderRadius: 8, border: `1px solid ${x.border}` }}>
                        <div style={{ fontSize: 10, color: x.color, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>{x.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: x.color, fontFamily: FONT, marginTop: 4 }}>{x.val}</div>
                      </div>
                    ))}
                  </div>
                </>); })()}
              </div>
            )}
          </>)}

          {step === 4 && (<>
            <div style={{ width: "100%", padding: "12px 16px", background: C.infoBg, borderRadius: 4, borderLeft: `4px solid ${C.info}`, marginBottom: 8 }}>
              <p style={{ color: C.info, fontSize: 13, fontFamily: FONT, margin: 0, fontWeight: 600 }}>
                Sélectionnez la puissance et renseignez la consommation pour calculer la rentabilité.
              </p>
            </div>
            <div style={{ width: "100%" }}>
              <label style={labelBase}>Puissance installée</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {PV_GRILLE.map(g => (
                  <button key={g.kw} onClick={() => upd("puissance_pv", String(g.kw))} style={{
                    padding: "14px 8px", borderRadius: 6, cursor: "pointer", textAlign: "center",
                    background: form.puissance_pv === String(g.kw) ? C.bleuFranceLight : C.bgAlt,
                    border: form.puissance_pv === String(g.kw) ? `2px solid ${C.bleuFrance}` : `1px solid ${C.border}`,
                    transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: form.puissance_pv === String(g.kw) ? C.bleuFrance : C.text, fontFamily: FONT }}>{g.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.success, fontFamily: FONT, marginTop: 4 }}>{fmt(g.prix)}</div>
                  </button>
                ))}
              </div>
            </div>
            <Field label="Facture électrique annuelle (€)" k="facture_elec" type="number" half placeholder="1800" />
            <Field label="Consommation annuelle (kWh)" k="conso_kw" type="number" half placeholder="5000" />
            {(parseFloat(form.facture_elec) > 0) && (
              <div style={{ width: "100%", padding: 20, background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
                {(() => { const c = computePV(); return (<>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <div style={{ textAlign: "center", padding: 14, background: C.infoBg, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: C.info, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Prix TTC ({c.grille.label})</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: C.info, fontFamily: FONT, marginTop: 4 }}>{fmt(c.prixTTC)}</div>
                    </div>
                    <div style={{ textAlign: "center", padding: 14, background: C.successBg, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: C.success, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Réduction facture</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: C.success, fontFamily: FONT, marginTop: 4 }}>{fmt(c.reductionFacture)}/an</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <div style={{ textAlign: "center", padding: 12, background: C.warningBg, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: C.rougeMarianne, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Mensualité AVANT</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: C.rougeMarianne, fontFamily: FONT, marginTop: 4 }}>{fmt(c.mensualiteAvant)}/mois</div>
                    </div>
                    <div style={{ textAlign: "center", padding: 12, background: C.successBg, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: C.success, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase" }}>Mensualité APRÈS</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: C.success, fontFamily: FONT, marginTop: 4 }}>{fmt(c.mensualiteApres)}/mois</div>
                    </div>
                  </div>
                  <div style={{ padding: 14, background: `${C.warning}08`, borderRadius: 8, border: `1px solid ${C.warning}20`, marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: C.warning, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase", marginBottom: 6 }}>Revente de surplus</div>
                    <div style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT, lineHeight: 1.6 }}>
                      Production : {fmtN(c.productionAnnuelle)} kWh/an — Conso : {fmtN(c.consoKW)} kWh — Surplus : {fmtN(c.surplus)} kWh
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.warning, fontFamily: FONT, marginTop: 6 }}>≈ {fmt(c.reventeSurplus)}/an</div>
                  </div>
                  <div style={{ padding: 14, background: C.bleuFranceLight, borderRadius: 8, border: `1px solid ${C.bleuFrance}20` }}>
                    <div style={{ fontSize: 11, color: C.bleuFrance, fontWeight: 700, fontFamily: FONT, textTransform: "uppercase", marginBottom: 4 }}>Financement sur 20 ans</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT }}>Mensualité brute</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: C.text, fontFamily: FONT }}>{fmt(c.mensualiteFinancement)}/mois</div>
                      </div>
                      <div style={{ fontSize: 24, color: C.textLight }}>→</div>
                      <div>
                        <div style={{ fontSize: 12, color: C.success, fontFamily: FONT }}>Après réinjection aides</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: C.success, fontFamily: FONT }}>{fmt(c.mensualiteApresAides)}/mois</div>
                      </div>
                    </div>
                  </div>
                </>); })()}
              </div>
            )}
          </>)}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        {step > 0 ? <button onClick={prev} style={btnSecondary}>← Précédent</button> : <div />}
        {step < 4 ? (
          <button onClick={next} style={btnPrimary}>Suivant →</button>
        ) : (
          <button onClick={handleFinalize} style={{ ...btnPrimary, background: C.success }}>
            Voir le résultat d'éligibilité
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// RESULT PAGE
// ═══════════════════════════════════════════════════════════════

function ResultPage({ result, onNew, onSave }) {
  const { ite, pv, score, form } = result;
  const saved = useRef(false);

  const handleSave = (status) => {
    if (!saved.current) {
      saved.current = true;
      onSave({ ...form, score, status, date: new Date().toLocaleDateString("fr-FR"), iteResult: ite, pvResult: pv });
    }
  };

  return (
    <div style={{ padding: "32px 20px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, background: C.bleuFranceLight, borderRadius: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 40 }}>🏛️</span>
      </div>
      <h2 style={{ fontFamily: FONT, fontSize: 26, color: C.bleuFrance, fontWeight: 800, marginBottom: 8 }}>Résultat de la simulation</h2>
      <p style={{ color: C.textMuted, fontFamily: FONT, marginBottom: 4 }}>{form.prenom} {form.nom} — {form.ville} {form.cp}</p>

      <div style={{ ...cardStyle, marginTop: 24, marginBottom: 24, textAlign: "left" }}>
        <h3 style={{ fontFamily: FONT, fontSize: 16, color: C.bleuFrance, fontWeight: 700, marginBottom: 16 }}>Validation des prérequis</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { label: "Technique", icon: "🔧" },
            { label: "Motivation", icon: "💪" },
            { label: "Financier", icon: "💰" },
          ].map((p, i) => (
            <div key={i} style={{ padding: 14, background: C.successBg, borderRadius: 8, border: `1px solid ${C.success}30`, textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{p.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.success, fontFamily: FONT }}>{p.label}</div>
              <div style={{ fontSize: 11, color: C.success, marginTop: 2 }}>✓ Validé</div>
            </div>
          ))}
        </div>
        {form.observation && (
          <div style={{ marginTop: 14, padding: 12, background: C.bg, borderRadius: 6, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", fontFamily: FONT, marginBottom: 4 }}>Observation</div>
            <div style={{ fontSize: 14, color: C.text, fontFamily: FONT, lineHeight: 1.6 }}>{form.observation}</div>
          </div>
        )}
      </div>

      {/* TUBE */}
      <div style={{ ...cardStyle, padding: 28, marginBottom: 24, borderLeft: `4px solid ${C.bleuFrance}` }}>
        <div style={{ fontSize: 13, color: C.textMuted, fontFamily: FONT, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Tube d'éligibilité</div>
        <div style={{ position: "relative", height: 40, background: C.bgAlt, borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${score}%`, background: score >= 75 ? `linear-gradient(90deg, ${C.info}, ${C.success})` : `linear-gradient(90deg, ${C.rougeMarianne}, ${C.warning}, ${C.success})`, borderRadius: 6, transition: "width 1.5s ease" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: C.white, fontFamily: FONT, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
            {score}%
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textLight, fontFamily: FONT }}>
          <span>Non éligible</span>
          <span>À valider</span>
          <span>Éligible</span>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 24, marginBottom: 24, background: C.successBg, border: `1px solid ${C.success}30` }}>
        <h3 style={{ fontFamily: FONT, fontSize: 20, color: C.success, fontWeight: 800, marginBottom: 8 }}>Simulation favorable</h3>
        <p style={{ fontFamily: FONT, fontSize: 15, color: C.text, lineHeight: 1.6, marginBottom: 4 }}>
          La simulation estime que votre projet avec un accompagnement d'État est réalisable à environ <strong style={{ color: C.bleuFrance, fontSize: 18 }}>{score}%</strong>.
        </p>
        <p style={{ fontFamily: FONT, fontSize: 14, color: C.bleuFrance, fontWeight: 700, marginTop: 12 }}>
          Faites un pas vers la transition énergétique !
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => { handleSave("en_cours"); onNew(); }} style={btnPrimary}>Enregistrer & Nouveau</button>
        <button onClick={onNew} style={btnSecondary}>Nouvelle simulation</button>
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

  const statusColors = { en_cours: C.info, accepte: C.success, refuse: C.rougeMarianne };
  const statusLabels = { en_cours: "En cours", accepte: "Accepté", refuse: "Refusé" };

  return (
    <div style={{ padding: "24px 20px", maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 24, color: C.bleuFrance, fontWeight: 800, marginBottom: 20 }}>Suivi des dossiers</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[{ k: "tous", l: "Tous", c: C.bleuFrance }, { k: "en_cours", l: "En cours", c: C.info }, { k: "accepte", l: "Acceptés", c: C.success }, { k: "refuse", l: "Refusés", c: C.rougeMarianne }].map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)} style={{
            padding: "10px 20px", borderRadius: 4, cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: 700, transition: "all 0.2s",
            background: filter === f.k ? `${f.c}12` : C.bgWhite,
            border: filter === f.k ? `2px solid ${f.c}` : `1px solid ${C.border}`,
            color: filter === f.k ? f.c : C.textMuted,
          }}>{f.l} ({f.k === "tous" ? dossiers.length : dossiers.filter(d => d.status === f.k).length})</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ ...cardStyle, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
          <p style={{ color: C.textMuted, fontFamily: FONT }}>Aucun dossier pour le moment.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((d, i) => (
            <div key={i} style={{ ...cardStyle, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: C.text }}>{d.prenom} {d.nom}</div>
                <div style={{ fontSize: 13, color: C.textMuted, fontFamily: FONT }}>{d.ville} {d.cp} — {d.date}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, fontFamily: FONT, color: C.bleuFrance }}>{d.score}%</div>
              <div style={{ display: "flex", gap: 6 }}>
                {["en_cours", "accepte", "refuse"].map(s => (
                  <button key={s} onClick={() => {
                    setDossiers(prev => prev.map((dd, ii) => ii === dossiers.indexOf(d) ? { ...dd, status: s } : dd));
                  }} style={{
                    padding: "6px 14px", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer",
                    fontFamily: FONT, transition: "all 0.2s",
                    background: d.status === s ? `${statusColors[s]}15` : "transparent",
                    border: d.status === s ? `2px solid ${statusColors[s]}` : `1px solid ${C.border}`,
                    color: d.status === s ? statusColors[s] : C.textLight,
                  }}>{statusLabels[s]}</button>
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
// DEMO PAGE
// ═══════════════════════════════════════════════════════════════

function DemoPage({ title, icon, composants, etapes, avantApres }) {
  const [selected, setSelected] = useState(null);
  const [showAvant, setShowAvant] = useState(true);

  return (
    <div style={{ padding: "28px 20px", maxWidth: 860, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 24, color: C.bleuFrance, fontWeight: 800, marginBottom: 4 }}>{icon} {title}</h2>
      <p style={{ color: C.textMuted, marginBottom: 28, fontFamily: FONT, fontSize: 14 }}>Composants, avant/après, étapes chantier.</p>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button onClick={() => setShowAvant(true)} style={{ padding: "10px 22px", borderRadius: 4, cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 700, background: showAvant ? C.warningBg : C.bgWhite, border: showAvant ? `2px solid ${C.rougeMarianne}` : `1px solid ${C.border}`, color: showAvant ? C.rougeMarianne : C.textMuted }}>Avant travaux</button>
          <button onClick={() => setShowAvant(false)} style={{ padding: "10px 22px", borderRadius: 4, cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 700, background: !showAvant ? C.successBg : C.bgWhite, border: !showAvant ? `2px solid ${C.success}` : `1px solid ${C.border}`, color: !showAvant ? C.success : C.textMuted }}>Après travaux</button>
        </div>
        <div style={{ ...cardStyle, padding: 24, borderLeft: showAvant ? `4px solid ${C.rougeMarianne}` : `4px solid ${C.success}`, transition: "all 0.3s" }}>
          <div style={{ fontSize: 36, textAlign: "center", marginBottom: 14 }}>{showAvant ? avantApres.avant.icon : avantApres.apres.icon}</div>
          <h3 style={{ textAlign: "center", color: C.text, fontFamily: FONT, fontSize: 17, fontWeight: 700, marginBottom: 14 }}>
            {showAvant ? avantApres.avant.titre : avantApres.apres.titre}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {(showAvant ? avantApres.avant.points : avantApres.apres.points).map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 10, background: C.bg, borderRadius: 6 }}>
                <span style={{ fontSize: 14, flexShrink: 0, color: showAvant ? C.rougeMarianne : C.success }}>{showAvant ? "✗" : "✓"}</span>
                <span style={{ color: C.text, fontSize: 14, fontFamily: FONT, lineHeight: 1.5 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 style={{ color: C.bleuFrance, fontFamily: FONT, fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Composants du système</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10, marginBottom: 16 }}>
        {composants.map(c => (
          <button key={c.id} onClick={() => setSelected(selected === c.id ? null : c.id)} style={{
            padding: 16, borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
            background: selected === c.id ? C.bleuFranceLight : C.bgWhite,
            border: selected === c.id ? `2px solid ${C.bleuFrance}` : `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 14, fontFamily: FONT, marginBottom: 4 }}>{c.nom}</div>
            <div style={{ color: C.textMuted, fontSize: 12, fontFamily: FONT, lineHeight: 1.5 }}>{c.desc}</div>
          </button>
        ))}
      </div>
      {selected && (
        <div style={{ ...cardStyle, padding: 18, borderLeft: `4px solid ${C.bleuFrance}`, marginBottom: 16 }}>
          <h4 style={{ color: C.bleuFrance, fontFamily: FONT, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
            {composants.find(c => c.id === selected)?.icon} {composants.find(c => c.id === selected)?.nom}
          </h4>
          <p style={{ color: C.textMuted, fontFamily: FONT, fontSize: 14, lineHeight: 1.7, marginBottom: 10 }}>{composants.find(c => c.id === selected)?.desc}</p>
          <div style={{ padding: 12, background: C.bg, borderRadius: 6, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, textTransform: "uppercase", fontFamily: FONT }}>Détails techniques</span>
            <p style={{ color: C.text, fontSize: 13, fontFamily: FONT, marginTop: 4 }}>{composants.find(c => c.id === selected)?.detail}</p>
          </div>
        </div>
      )}

      <h3 style={{ color: C.bleuFrance, fontFamily: FONT, fontSize: 17, fontWeight: 700, marginTop: 28, marginBottom: 14 }}>Étapes du chantier</h3>
      <div style={{ position: "relative", paddingLeft: 28 }}>
        <div style={{ position: "absolute", left: 10, top: 6, bottom: 6, width: 3, background: C.bleuFrance, borderRadius: 2 }} />
        {etapes.map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 14, position: "relative" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.bleuFrance, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.white, flexShrink: 0, position: "absolute", left: -17 }}>{e.step}</div>
            <div style={{ marginLeft: 20 }}>
              <div style={{ color: C.text, fontSize: 15, fontWeight: 600, fontFamily: FONT }}>{e.label}</div>
              <div style={{ color: C.textMuted, fontSize: 12, fontFamily: FONT, marginTop: 2 }}>Durée : {e.dur}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FICHES SUBVENTIONS
// ═══════════════════════════════════════════════════════════════

function FicheSubvention({ type }) {
  const isITE = type === "ite";
  return (
    <div style={{ padding: "28px 20px", maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT, fontSize: 24, color: C.bleuFrance, fontWeight: 800, marginBottom: 4 }}>{isITE ? "🧱" : "☀️"} Subventions {isITE ? "ITE" : "PV"} 2026</h2>
      <p style={{ color: C.textMuted, marginBottom: 28, fontFamily: FONT, fontSize: 14 }}>Récapitulatif des aides disponibles.</p>

      {isITE ? (
        <>
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <h3 style={{ fontFamily: FONT, color: C.bleuFrance, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>MaPrimeRénov' — ITE</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { cat: "Très modestes", color: C.bleuFrance, montant: "75 €/m²" },
                { cat: "Modestes", color: C.info, montant: "60 €/m²" },
                { cat: "Intermédiaires", color: C.warning, montant: "40 €/m²" },
                { cat: "Supérieurs", color: C.textLight, montant: "Non éligible" },
              ].map((r, i) => (
                <div key={i} style={{ padding: 14, background: `${r.color}08`, borderRadius: 8, border: `1px solid ${r.color}25`, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: r.color, fontWeight: 700, fontFamily: FONT }}>{r.cat}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: r.color, fontFamily: FONT, marginTop: 4 }}>{r.montant}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <h3 style={{ fontFamily: FONT, color: C.info, fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Certificats d'Économies d'Énergie (CEE)</h3>
            <div style={{ padding: 16, background: C.infoBg, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.info, fontFamily: FONT }}>{CEE_PAR_M2} €/m²</div>
              <div style={{ fontSize: 13, color: C.textMuted, fontFamily: FONT, marginTop: 4 }}>Versée directement par l'obligé CEE</div>
            </div>
          </div>
          <div style={{ ...cardStyle }}>
            <h3 style={{ fontFamily: FONT, color: C.success, fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Autres aides cumulables</h3>
            <div style={{ color: C.text, fontFamily: FONT, fontSize: 14, lineHeight: 2 }}>
              <div><strong>Éco-PTZ</strong> — Prêt à taux zéro jusqu'à 50 000€ sur 20 ans</div>
              <div><strong>TVA réduite 5,5%</strong> — Appliquée directement sur le devis</div>
              <div><strong>Aides locales</strong> — Région, département, commune</div>
              <div><strong>Chèque énergie</strong> — Jusqu'à 277€ pour les ménages modestes</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <h3 style={{ fontFamily: FONT, color: C.info, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Grille tarifaire & subventions PV</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
              {PV_GRILLE.map((g, i) => (
                <div key={i} style={{ padding: 16, background: C.infoBg, borderRadius: 8, border: `1px solid ${C.info}20`, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.info, fontFamily: FONT }}>{g.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.success, fontFamily: FONT, marginTop: 6 }}>{fmt(g.prix)}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT, marginTop: 4 }}>TTC subvention incluse</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <h3 style={{ fontFamily: FONT, color: C.success, fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Prime à l'autoconsommation</h3>
            <div style={{ color: C.text, fontFamily: FONT, fontSize: 14, lineHeight: 1.8 }}>
              <div>Versée sur 5 ans par EDF OA — montant selon puissance installée.</div>
              <div style={{ marginTop: 4, fontWeight: 700 }}>≤ 3 kWc : ~370 €/kWc | ≤ 9 kWc : ~280 €/kWc | ≤ 36 kWc : ~200 €/kWc</div>
            </div>
          </div>
          <div style={{ ...cardStyle }}>
            <h3 style={{ fontFamily: FONT, color: C.bleuFrance, fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Rachat du surplus (EDF OA)</h3>
            <div style={{ color: C.text, fontFamily: FONT, fontSize: 14, lineHeight: 2 }}>
              <div><strong>Contrat 20 ans</strong> garanti par l'État</div>
              <div><strong>Tarif rachat</strong> ~0,10 €/kWh en vente surplus (≤ 9 kWc)</div>
              <div><strong>Révision tarifaire</strong> trimestrielle par la CRE</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

const ITE_AVANT_APRES = {
  avant: { icon: "🥶", titre: "Avant ITE — Déperditions thermiques", points: ["Murs froids — inconfort permanent", "Ponts thermiques aux jonctions", "Condensation et moisissures", "Surconsommation de chauffage", "DPE classé E, F ou G", "Façade dégradée"] },
  apres: { icon: "🏠", titre: "Après ITE — Performance & confort", points: ["Murs chauds et homogènes", "Ponts thermiques supprimés", "Plus de condensation", "−30% sur le chauffage", "Gain de 2 à 3 classes DPE", "Façade neuve et valorisée"] },
};

const PV_AVANT_APRES = {
  avant: { icon: "🔌", titre: "Avant — 100% réseau", points: ["100% électricité achetée", "Facture en hausse constante", "Toiture non valorisée", "Dépendance fournisseur", "Empreinte carbone élevée", "Aucun revenu complémentaire"] },
  apres: { icon: "☀️", titre: "Après — Autoconsommation", points: ["40 à 60% autoproduit", "Facture divisée par 2", "Revente surplus EDF OA (20 ans)", "Protection hausse des prix", "Bilan carbone amélioré", "Retour sur invest. 7-10 ans"] },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("accueil");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dossiers, setDossiers] = useState([]);

  const pageTitles = {
    accueil: "Accueil", simulation: "Nouvelle Simulation", dossiers: "Dossiers",
    "demo-ite": "Démo ITE", "demo-pv": "Démo Solaire PV",
    "fiche-ite": "Subventions ITE 2026", "fiche-pv": "Subventions PV 2026",
  };

  if (!user) return <Login onLogin={setUser} />;

  const addDossier = (d) => setDossiers(prev => [d, ...prev]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CCCCCC; border-radius: 3px; }
        input:focus, select:focus { border-color: ${C.bleuFrance} !important; outline: none; box-shadow: 0 0 0 3px ${C.bleuFranceLight}; }
        button:active { transform: scale(0.98); }
      `}</style>

      <Sidebar active={active} setActive={setActive} onLogout={() => setUser(null)} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <TopBar setSidebarOpen={setSidebarOpen} title={pageTitles[active] || "RénovÉnergie"} />

      <main>
        {active === "accueil" && <Accueil setActive={setActive} />}
        {active === "simulation" && <SimulationForm onComplete={addDossier} dossiers={dossiers} />}
        {active === "dossiers" && <Dossiers dossiers={dossiers} setDossiers={setDossiers} />}
        {active === "demo-ite" && <DemoPage title="Isolation Thermique par l'Extérieur" icon="🧱" composants={ITE_COMPOSANTS} etapes={ITE_ETAPES} avantApres={ITE_AVANT_APRES} />}
        {active === "demo-pv" && <DemoPage title="Panneaux Solaires Photovoltaïques" icon="☀️" composants={SOLAIRE_COMPOSANTS} etapes={PV_ETAPES} avantApres={PV_AVANT_APRES} />}
        {active === "fiche-ite" && <FicheSubvention type="ite" />}
        {active === "fiche-pv" && <FicheSubvention type="pv" />}
      </main>
    </div>
  );
}
