import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const STORAGE_KEY = "hogar_santi_lizeth_v2";

const CATEGORIES = [
  { id: "arriendo", label: "Arriendo", emoji: "🏠", color: "#FF6B6B" },
  { id: "mercado", label: "Mercado", emoji: "🛒", color: "#00C9A7" },
  { id: "servicios", label: "Servicios", emoji: "💡", color: "#FFD166" },
  { id: "internet", label: "Internet", emoji: "📶", color: "#74B9FF" },
  { id: "otros", label: "Otros", emoji: "📦", color: "#A29BFE" },
];

const MEMBERS = [
  { id: "santiago", label: "Santiago", aporte: 2500000, color: "#00C9A7", avatar: "🧔" },
  { id: "lizeth", label: "Lizeth", aporte: 1200000, color: "#FFD166", avatar: "👩" },
];

const TOTAL_APORTE = 3700000;

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const getMonthKey = (date) => date.slice(0, 7);
const currentMonth = () => new Date().toISOString().slice(0, 7);

const MOTIVATIONAL = [
  "💪 ¡Juntos controlan mejor sus finanzas!",
  "🌟 Cada peso ahorrado es un paso adelante",
  "❤️ Un hogar que planea junto, crece junto",
  "🎯 ¡Van por buen camino este mes!",
  "✨ La disciplina financiera es amor en acción",
];

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d1117;
    --surface: #161b22;
    --surface2: #21262d;
    --border: rgba(255,255,255,0.08);
    --mint: #00C9A7;
    --gold: #FFD166;
    --red: #FF6B6B;
    --blue: #74B9FF;
    --purple: #A29BFE;
    --text: #e6edf3;
    --muted: #8b949e;
    --font-display: 'Playfair Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  .light-mode {
    --bg: #f0f4f8;
    --surface: #ffffff;
    --surface2: #e8edf2;
    --border: rgba(0,0,0,0.08);
    --text: #1a202c;
    --muted: #64748b;
  }

  body { font-family: var(--font-body); background: var(--bg); color: var(--text); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .fade-up { animation: fadeUp 0.5s ease forwards; }
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    animation: fadeUp 0.4s ease forwards;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
  .glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .btn {
    font-family: var(--font-body);
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
  }
  .btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
  .btn:active { transform: translateY(0); }
  .btn-primary {
    background: linear-gradient(135deg, var(--mint), #00a88e);
    color: #0d1117;
    padding: 12px 24px;
  }
  .btn-danger {
    background: rgba(255,107,107,0.15);
    color: var(--red);
    padding: 6px 12px;
    font-size: 12px;
  }
  .btn-ghost {
    background: var(--surface2);
    color: var(--text);
    padding: 8px 16px;
  }
  input, select, textarea {
    font-family: var(--font-body);
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    padding: 10px 14px;
    font-size: 14px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus, select:focus, textarea:focus {
    border-color: var(--mint);
    box-shadow: 0 0 0 3px rgba(0,201,167,0.1);
  }
  select option { background: var(--surface); }
  .progress-bar {
    background: var(--surface2);
    border-radius: 100px;
    height: 10px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 100px;
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .tab {
    padding: 8px 18px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
    border: none;
    font-family: var(--font-body);
    background: transparent;
    color: var(--muted);
  }
  .tab.active {
    background: var(--surface2);
    color: var(--text);
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 500;
  }
  .alert-warning {
    background: rgba(255,209,102,0.12);
    border: 1px solid rgba(255,209,102,0.3);
    border-radius: 12px;
    padding: 14px 18px;
    color: var(--gold);
    font-size: 14px;
    animation: pulse 2s infinite;
  }
  .alert-danger {
    background: rgba(255,107,107,0.12);
    border: 1px solid rgba(255,107,107,0.3);
    border-radius: 12px;
    padding: 14px 18px;
    color: var(--red);
    font-size: 14px;
    animation: pulse 2s infinite;
  }
  .expense-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 12px;
    background: var(--surface2);
    margin-bottom: 8px;
    animation: slideIn 0.3s ease forwards;
    transition: background 0.2s;
  }
  .expense-item:hover { background: var(--surface); }
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: fadeUp 0.2s ease;
  }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    width: 100%;
    max-width: 420px;
    max-height: 90vh;
    overflow-y: auto;
  }
  label { font-size: 13px; color: var(--muted); font-weight: 500; display: block; margin-bottom: 6px; }
  .field { margin-bottom: 16px; }
  .chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 100px;
    font-size: 13px; cursor: pointer; border: 2px solid transparent;
    transition: all 0.2s; font-family: var(--font-body); font-weight: 500;
    background: var(--surface2); color: var(--muted);
  }
  .chip.selected { border-color: var(--mint); color: var(--mint); background: rgba(0,201,167,0.1); }
  .chip-gold.selected { border-color: var(--gold); color: var(--gold); background: rgba(255,209,102,0.1); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
`;

export default function App() {
  const [data, setData] = useState(loadData);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());
  const [tab, setTab] = useState("dashboard");
  const [showAdd, setShowAdd] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [form, setForm] = useState({ amount: "", category: "mercado", desc: "", who: "santiago", date: new Date().toISOString().slice(0, 10) });
  const [editMeta, setEditMeta] = useState(false);
  const [photoModal, setPhotoModal] = useState(null);
  const fileRef = useRef();
  const motivational = MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)];

  useEffect(() => { saveData(data); }, [data]);

  const monthData = data[selectedMonth] || { expenses: [], meta: "", savingsGoal: 0, notes: {} };

  const expenses = monthData.expenses || [];
  const totalGastado = expenses.reduce((s, e) => s + e.amount, 0);
  const saldo = TOTAL_APORTE - totalGastado;
  const pct = Math.min((totalGastado / TOTAL_APORTE) * 100, 100);

  const gastoSantiago = expenses.filter(e => e.who === "santiago").reduce((s, e) => s + e.amount, 0);
  const gastoLizeth = expenses.filter(e => e.who === "lizeth").reduce((s, e) => s + e.amount, 0);

  const pctSantiAporte = MEMBERS[0].aporte / TOTAL_APORTE;
  const pctLizAporte = MEMBERS[1].aporte / TOTAL_APORTE;
  const idealSanti = totalGastado * pctSantiAporte;
  const idealLiz = totalGastado * pctLizAporte;
  const balanceSanti = gastoSantiago - idealSanti;
  const balance = Math.abs(balanceSanti);
  const balanceMsg = balanceSanti > 0
    ? `Lizeth le debe a Santiago ${fmt(balance)}`
    : balanceSanti < 0
    ? `Santiago le debe a Lizeth ${fmt(balance)}`
    : "¡Están equilibrados! 🎉";

  const catData = CATEGORIES.map(c => ({
    ...c,
    total: expenses.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.total > 0);

  const savingsGoal = monthData.savingsGoal || 0;
  const currentSavings = Math.max(0, saldo);
  const savingsPct = savingsGoal > 0 ? Math.min((currentSavings / savingsGoal) * 100, 100) : 0;

  const months = [...new Set(Object.keys(data).concat(currentMonth()))].sort().reverse();

  function updateMonth(updater) {
    setData(prev => {
      const m = prev[selectedMonth] || { expenses: [], meta: "", savingsGoal: 0, notes: {} };
      return { ...prev, [selectedMonth]: updater(m) };
    });
  }

  function addExpense() {
    if (!form.amount || isNaN(Number(form.amount))) return;
    updateMonth(m => ({
      ...m,
      expenses: [...(m.expenses || []), {
        id: Date.now(),
        amount: Number(form.amount),
        category: form.category,
        desc: form.desc,
        who: form.who,
        date: form.date,
        photo: form.photo || null,
      }]
    }));
    setForm({ amount: "", category: "mercado", desc: "", who: "santiago", date: new Date().toISOString().slice(0, 10) });
    setShowAdd(false);
  }

  function deleteExpense(id) {
    updateMonth(m => ({ ...m, expenses: m.expenses.filter(e => e.id !== id) }));
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  }

  const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[4];
  const getMember = (id) => MEMBERS.find(m => m.id === id) || MEMBERS[0];

  const monthLabel = (m) => {
    const [y, mo] = m.split("-");
    return new Date(Number(y), Number(mo) - 1).toLocaleString("es-CO", { month: "long", year: "numeric" });
  };

  return (
    <>
      <style>{styles}</style>
      <div className={darkMode ? "" : "light-mode"} style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 32 }}>
        {/* Header */}
        <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "16px 20px", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, background: "linear-gradient(135deg, var(--mint), var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                🏡 Nuestro Hogar
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Santiago & Lizeth</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ width: "auto", fontSize: 13, padding: "6px 10px" }}>
                {months.map(m => <option key={m} value={m}>{monthLabel(m)}</option>)}
              </select>
              <button className="btn btn-ghost" style={{ padding: "8px 12px", fontSize: 16 }} onClick={() => setDarkMode(d => !d)}>
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>
          {/* Motivational */}
          <div style={{ textAlign: "center", fontSize: 13, color: "var(--muted)", marginBottom: 20, fontStyle: "italic" }}>
            {motivational}
          </div>

          {/* Alert */}
          {pct >= 100 && (
            <div className="alert-danger" style={{ marginBottom: 16 }}>
              🚨 ¡Superaron el presupuesto del mes! Gastaron {fmt(totalGastado - TOTAL_APORTE)} de más.
            </div>
          )}
          {pct >= 80 && pct < 100 && (
            <div className="alert-warning" style={{ marginBottom: 16 }}>
              ⚠️ Cuidado — han usado el {pct.toFixed(0)}% del presupuesto mensual
            </div>
          )}

          {/* Budget Card */}
          <div className="card" style={{ marginBottom: 16, background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)", border: "1px solid rgba(0,201,167,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>PRESUPUESTO MENSUAL</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--text)" }}>{fmt(TOTAL_APORTE)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>SALDO RESTANTE</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: saldo >= 0 ? "var(--mint)" : "var(--red)" }}>{fmt(saldo)}</div>
              </div>
            </div>
            <div className="progress-bar" style={{ marginBottom: 8 }}>
              <div className="progress-fill" style={{
                width: `${pct}%`,
                background: pct >= 100 ? "var(--red)" : pct >= 80 ? "var(--gold)" : "linear-gradient(90deg, var(--mint), #00a88e)"
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)" }}>
              <span>Gastado: {fmt(totalGastado)}</span>
              <span>{pct.toFixed(1)}%</span>
            </div>
          </div>

          {/* Members */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {MEMBERS.map(m => {
              const gasto = m.id === "santiago" ? gastoSantiago : gastoLizeth;
              const mp = Math.min((gasto / m.aporte) * 100, 100);
              return (
                <div key={m.id} className="card" style={{ animationDelay: "0.1s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>{m.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>Aporta {fmt(m.aporte)}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: m.color, marginBottom: 8 }}>{fmt(gasto)}</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${mp}%`, background: m.color }} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{mp.toFixed(0)}% de su aporte</div>
                </div>
              );
            })}
          </div>

          {/* Balance Card */}
          <div className="card" style={{ marginBottom: 16, background: Math.abs(balanceSanti) < 1000 ? "rgba(0,201,167,0.05)" : "var(--surface)", border: `1px solid ${Math.abs(balanceSanti) < 1000 ? "rgba(0,201,167,0.3)" : "var(--border)"}` }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, fontWeight: 600, letterSpacing: 1 }}>⚖️ BALANCE JUSTO</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{balanceMsg}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              {MEMBERS.map(m => {
                const gasto = m.id === "santiago" ? gastoSantiago : gastoLizeth;
                const ideal = m.id === "santiago" ? idealSanti : idealLiz;
                const diff = gasto - ideal;
                return (
                  <div key={m.id} style={{ flex: 1, background: "var(--surface2)", borderRadius: 10, padding: 10 }}>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{m.avatar} {m.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4, color: diff > 500 ? "var(--red)" : diff < -500 ? "var(--mint)" : "var(--text)" }}>
                      {diff > 500 ? `+${fmt(diff)} de más` : diff < -500 ? `${fmt(Math.abs(diff))} de menos` : "✅ Equilibrado"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--surface)", padding: 4, borderRadius: 12, border: "1px solid var(--border)" }}>
            {[
              { id: "dashboard", label: "📊 Resumen" },
              { id: "expenses", label: "📋 Gastos" },
              { id: "savings", label: "🎯 Metas" },
              { id: "notes", label: "💌 Notas" },
            ].map(t => (
              <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} style={{ flex: 1, fontSize: 12 }} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {tab === "dashboard" && (
            <div>
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Gastos por categoría</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{monthLabel(selectedMonth)}</span>
                </div>
                {catData.length === 0 ? (
                  <div style={{ textAlign: "center", color: "var(--muted)", padding: 24, fontSize: 14 }}>
                    Sin gastos registrados aún 🌱
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={catData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                        <XAxis dataKey="emoji" tick={{ fill: "var(--muted)", fontSize: 18 }} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip
                          formatter={(v) => [fmt(v), "Total"]}
                          contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, fontFamily: "var(--font-body)", fontSize: 13 }}
                          labelFormatter={(l) => { const c = catData.find(c => c.emoji === l); return c ? c.label : l; }}
                        />
                        <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                          {catData.map((c, i) => <Cell key={i} fill={c.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                      {catData.sort((a, b) => b.total - a.total).map(c => (
                        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span>{c.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ fontSize: 13 }}>{c.label}</span>
                              <span style={{ fontSize: 13, fontWeight: 600, color: c.color }}>{fmt(c.total)}</span>
                            </div>
                            <div className="progress-bar" style={{ height: 6 }}>
                              <div className="progress-fill" style={{ width: `${(c.total / totalGastado) * 100}%`, background: c.color }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Monthly Summary */}
              <div className="card" style={{ background: "linear-gradient(135deg, rgba(0,201,167,0.05), rgba(255,209,102,0.05))" }}>
                <div style={{ fontWeight: 600, marginBottom: 16 }}>📅 Resumen del mes</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Total ingresos", value: fmt(TOTAL_APORTE), color: "var(--mint)" },
                    { label: "Total gastado", value: fmt(totalGastado), color: "var(--red)" },
                    { label: "Ahorro logrado", value: fmt(Math.max(0, saldo)), color: "var(--gold)" },
                    { label: "Gastos registrados", value: `${expenses.length} items`, color: "var(--blue)" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "var(--surface2)", borderRadius: 12, padding: 14 }}>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>{s.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Expenses Tab */}
          {tab === "expenses" && (
            <div>
              {/* Recurring */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>📌 Gastos fijos del mes</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { label: "Arriendo", cat: "arriendo", amount: 0 },
                    { label: "Internet", cat: "internet", amount: 0 },
                  ].map(r => {
                    const exists = expenses.some(e => e.category === r.cat && e.desc?.toLowerCase().includes("fijo"));
                    return (
                      <button key={r.cat} className="btn btn-ghost" style={{ fontSize: 12, opacity: exists ? 0.5 : 1 }}
                        onClick={() => {
                          if (exists) return;
                          setForm(f => ({ ...f, category: r.cat, desc: `${r.label} (fijo)` }));
                          setShowAdd(true);
                        }}>
                        {exists ? "✅" : "+"} {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 600 }}>Historial ({expenses.length})</div>
                <button className="btn btn-primary" onClick={() => setShowAdd(true)} style={{ padding: "8px 18px", fontSize: 13 }}>
                  + Agregar
                </button>
              </div>

              {expenses.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  <div>No hay gastos este mes</div>
                </div>
              ) : (
                [...expenses].sort((a, b) => b.date?.localeCompare(a.date)).map(e => {
                  const cat = getCat(e.category);
                  const who = getMember(e.who);
                  return (
                    <div key={e.id} className="expense-item">
                      <div style={{ fontSize: 24 }}>{cat.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{fmt(e.amount)}</span>
                          <span style={{ fontSize: 11, color: "var(--muted)" }}>{e.date}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, display: "flex", gap: 6, alignItems: "center" }}>
                          <span className="badge" style={{ background: `${cat.color}20`, color: cat.color }}>{cat.label}</span>
                          <span>{who.avatar} {who.label}</span>
                          {e.desc && <span>· {e.desc}</span>}
                          {e.photo && <button className="btn btn-ghost" style={{ padding: "2px 6px", fontSize: 11 }} onClick={() => setPhotoModal(e.photo)}>📸</button>}
                        </div>
                      </div>
                      <button className="btn btn-danger" onClick={() => deleteExpense(e.id)}>✕</button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Savings/Goals Tab */}
          {tab === "savings" && (
            <div>
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 16 }}>🎯 Meta de ahorro del mes</div>
                <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  <input
                    type="number"
                    placeholder="Meta en pesos (ej: 500000)"
                    value={monthData.savingsGoal || ""}
                    onChange={e => updateMonth(m => ({ ...m, savingsGoal: Number(e.target.value) }))}
                  />
                </div>
                {savingsGoal > 0 && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                      <span>Ahorro actual: <strong style={{ color: "var(--mint)" }}>{fmt(currentSavings)}</strong></span>
                      <span>Meta: <strong style={{ color: "var(--gold)" }}>{fmt(savingsGoal)}</strong></span>
                    </div>
                    <div className="progress-bar" style={{ height: 14, marginBottom: 8 }}>
                      <div className="progress-fill" style={{
                        width: `${savingsPct}%`,
                        background: savingsPct >= 100 ? "var(--mint)" : "linear-gradient(90deg, var(--gold), var(--mint))"
                      }} />
                    </div>
                    <div style={{ textAlign: "center", fontSize: 14, color: savingsPct >= 100 ? "var(--mint)" : "var(--muted)" }}>
                      {savingsPct >= 100 ? "🎉 ¡Meta alcanzada! ¡Felicitaciones!" : `${savingsPct.toFixed(0)}% — te faltan ${fmt(savingsGoal - currentSavings)}`}
                    </div>
                  </>
                )}
              </div>

              <div className="card">
                <div style={{ fontWeight: 600, marginBottom: 16 }}>💡 Meta compartida del mes</div>
                {editMeta ? (
                  <div>
                    <textarea
                      rows={3}
                      placeholder="Ej: Ahorrar para el viaje a Cartagena en diciembre 🏖️"
                      value={monthData.meta || ""}
                      onChange={e => updateMonth(m => ({ ...m, meta: e.target.value }))}
                      style={{ marginBottom: 10, resize: "none" }}
                    />
                    <button className="btn btn-primary" onClick={() => setEditMeta(false)}>Guardar</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 15, color: monthData.meta ? "var(--text)" : "var(--muted)", fontStyle: monthData.meta ? "normal" : "italic", marginBottom: 12, lineHeight: 1.6 }}>
                      {monthData.meta || "Aún no han definido una meta para este mes..."}
                    </div>
                    <button className="btn btn-ghost" onClick={() => setEditMeta(true)}>✏️ Editar meta</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {tab === "notes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 13, color: "var(--muted)", textAlign: "center" }}>
                💌 Espacio para reflexiones y notas del mes
              </div>
              {MEMBERS.map(m => (
                <div key={m.id} className="card" style={{ border: `1px solid ${m.color}30` }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{m.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: m.color }}>{m.label} dice...</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>Nota privada del mes</div>
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    placeholder={`Escribe algo, ${m.label}... ¿Cómo te fue este mes financieramente?`}
                    value={(monthData.notes || {})[m.id] || ""}
                    onChange={e => updateMonth(md => ({ ...md, notes: { ...(md.notes || {}), [m.id]: e.target.value } }))}
                    style={{ resize: "none" }}
                  />
                </div>
              ))}
              <div className="card" style={{ background: "linear-gradient(135deg, rgba(0,201,167,0.05), rgba(255,209,102,0.05))" }}>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>🌟 Reflexión del hogar</div>
                <textarea
                  rows={3}
                  placeholder="¿Qué aprendieron juntos este mes? ¿Qué mejorarán el próximo?"
                  value={(monthData.notes || {}).hogar || ""}
                  onChange={e => updateMonth(md => ({ ...md, notes: { ...(md.notes || {}), hogar: e.target.value } }))}
                  style={{ resize: "none" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* FAB */}
        <button
          className="btn btn-primary"
          onClick={() => setShowAdd(true)}
          style={{
            position: "fixed", bottom: 24, right: 24,
            width: 56, height: 56, borderRadius: "50%",
            fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 24px rgba(0,201,167,0.4)",
            padding: 0, zIndex: 40,
          }}
        >
          +
        </button>

        {/* Add Expense Modal */}
        {showAdd && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
            <div className="modal">
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
                Registrar gasto
              </div>

              <div className="field">
                <label>💰 Monto</label>
                <input type="number" placeholder="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} autoFocus />
              </div>

              <div className="field">
                <label>📂 Categoría</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {CATEGORIES.map(c => (
                    <button key={c.id} className={`chip ${form.category === c.id ? "selected" : ""}`} onClick={() => setForm(f => ({ ...f, category: c.id }))}>
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>👤 ¿Quién pagó?</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {MEMBERS.map(m => (
                    <button key={m.id} className={`chip ${form.who === m.id ? "chip-gold selected" : ""}`} onClick={() => setForm(f => ({ ...f, who: m.id }))} style={{ flex: 1, justifyContent: "center" }}>
                      {m.avatar} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>📝 Descripción (opcional)</label>
                <input placeholder="Ej: Supermercado Éxito..." value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
              </div>

              <div className="field">
                <label>📅 Fecha</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>

              <div className="field">
                <label>📸 Foto del recibo (opcional)</label>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ fontSize: 13, padding: 8 }} />
                {form.photo && (
                  <div style={{ marginTop: 8, borderRadius: 10, overflow: "hidden", maxHeight: 120 }}>
                    <img src={form.photo} alt="recibo" style={{ width: "100%", objectFit: "cover" }} />
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Cancelar</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={addExpense}>Guardar gasto</button>
              </div>
            </div>
          </div>
        )}

        {/* Photo Modal */}
        {photoModal && (
          <div className="modal-overlay" onClick={() => setPhotoModal(null)}>
            <div style={{ maxWidth: 360, width: "100%", borderRadius: 16, overflow: "hidden" }}>
              <img src={photoModal} alt="recibo" style={{ width: "100%" }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
