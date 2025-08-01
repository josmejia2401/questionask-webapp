import React, { useEffect, useState } from "react";
import { findUserDashboard, findStatsUser } from "./api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { AuthStore } from "../../store";

// Iconos SVG profesionales, integrados aquí mismo
function DocumentTextIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25V6a2.25 2.25 0 00-2.25-2.25h-10.5A2.25 2.25 0 004.5 6v12a2.25 2.25 0 002.25 2.25h7.5M15.75 3.75v4.5c0 .621.504 1.125 1.125 1.125h4.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 9.75h6m-6 3h6m-6 3h3.75" />
        </svg>
    );
}
function CheckCircleIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="#10b981" />
            <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2.5 2.5 4.5-4.5" />
        </svg>
    );
}
function GlobeAltIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="#6366f1" />
            <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
        </svg>
    );
}
function LockClosedIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <rect x="6" y="11" width="12" height="8" rx="3" fill="#f59e42" stroke="#fff" strokeWidth="2" />
            <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 7a3 3 0 00-3 3v1h6v-1a3 3 0 00-3-3z" />
        </svg>
    );
}
function ChartBarIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <rect x="3" y="10" width="4" height="10" rx="1" fill="#14b8a6" />
            <rect x="9" y="6" width="4" height="14" rx="1" fill="#818cf8" />
            <rect x="15" y="3" width="4" height="17" rx="1" fill="#f472b6" />
        </svg>
    );
}
function TrophyIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path d="M8 16v2a4 4 0 108 0v-2" stroke="#fff" strokeWidth="2" />
            <rect x="6" y="8" width="12" height="8" rx="4" fill="#e11d48" stroke="#fff" strokeWidth="2" />
            <path d="M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2" stroke="#fff" strokeWidth="2" />
        </svg>
    );
}
function ClockIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="#64748b" strokeWidth="1.5" fill="#f3f4f6" />
            <path stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
        </svg>
    );
}

// Paleta para charts
const COLORS = [
    "#2563eb", "#10b981", "#6366f1", "#f59e42", "#ef4444", "#a21caf", "#e11d48", "#f472b6"
];
const USER_ID = AuthStore.getState().tokenInfo.keyid;

export default function Dashboard() {
    const [dashboardStats, setDashboardStats] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const [dashboardRes, userRes] = await Promise.all([
                    findUserDashboard(USER_ID),
                    findStatsUser(USER_ID),
                ]);
                setDashboardStats(dashboardRes.data || dashboardRes);
                setUserStats(userRes.data || userRes);
            } catch (error) {
                setErr("No se pudieron cargar las estadísticas.");
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-200 via-violet-200 to-pink-100">
                <span className="text-2xl text-blue-700 animate-bounce font-extrabold">
                    Cargando dashboard...
                </span>
            </div>
        );

    if (err)
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-200 via-violet-200 to-pink-100">
                <span className="text-red-600 font-semibold text-xl">{err}</span>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-pink-50 to-emerald-50 relative overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-500 via-indigo-400 to-fuchsia-400 blur-2xl opacity-30 pointer-events-none z-0" />
            <div className="max-w-7xl mx-auto py-12 px-4 z-10 relative">
                <HeaderSection />
                {/* Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 mt-8">
                    <StatCard
                        label="Formularios"
                        value={dashboardStats.totalForms}
                        icon={<DocumentTextIcon className="h-12 w-12" />}
                        accent="from-blue-500 to-blue-400"
                    />
                    <StatCard
                        label="Respuestas"
                        value={dashboardStats.totalResponses}
                        icon={<CheckCircleIcon className="h-12 w-12" />}
                        accent="from-pink-400 to-fuchsia-400"
                    />
                    <StatCard
                        label="Formularios Públicos"
                        value={dashboardStats.formVisibility?.public}
                        icon={<GlobeAltIcon className="h-12 w-12" />}
                        accent="from-emerald-400 to-emerald-300"
                    />
                    <StatCard
                        label="Formularios Privados"
                        value={dashboardStats.formVisibility?.private}
                        icon={<LockClosedIcon className="h-12 w-12" />}
                        accent="from-orange-400 to-amber-300"
                    />
                </div>
                {/* Métricas del usuario */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        label="Promedio respuestas por formulario"
                        value={userStats.avgResponsesPerForm?.toFixed(2)}
                        icon={<ChartBarIcon className="h-12 w-12" />}
                        accent="from-teal-400 to-cyan-300"
                    />
                    <StatCard
                        label="Formulario más popular"
                        value={
                            userStats.topForm
                                ? `${userStats.topForm.title || `ID: ${userStats.topForm.formId}`}`
                                : "N/A"
                        }
                        icon={<TrophyIcon className="h-12 w-12" />}
                        accent="from-fuchsia-400 to-pink-300"
                    />
                    <StatCard
                        label="Última respuesta"
                        value={
                            userStats.lastResponseDate
                                ? new Date(userStats.lastResponseDate).toLocaleDateString()
                                : "N/A"
                        }
                        icon={<ClockIcon className="h-12 w-12" />}
                        accent="from-gray-400 to-gray-300"
                    />
                </div>

                {/* Charts/Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-fade-in">
                    <SectionCard title="Formularios más populares">
                        <PopularFormsList forms={dashboardStats.popularForms} />
                    </SectionCard>
                    <SectionCard title="Tipos de campo más usados">
                        <FieldTypePieChart fieldTypes={dashboardStats.fieldTypeStats} />
                    </SectionCard>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-fade-in">
                    <SectionCard title="Respuestas por día">
                        <ResponsesPerDayLineChart responsesPerDay={userStats.responsesPerDay} />
                    </SectionCard>
                    <SectionCard title="Distribución de visibilidad">
                        <FormVisibilityPieChart visibility={dashboardStats.formVisibility} />
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}

function HeaderSection() {
    return (
        <header className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
                <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight mb-2 drop-shadow">
                    Bienvenido al Dashboard <span className="animate-wiggle inline-block">📊</span>
                </h1>
                <p className="text-lg text-blue-700 font-medium">
                    Visualiza tus estadísticas y el impacto de tus formularios
                </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
                <span className="inline-block bg-gradient-to-r from-blue-100 via-indigo-100 to-pink-100 text-blue-700 px-4 py-2 rounded-full font-semibold shadow-lg border border-blue-300">
                    Usuario Activo
                </span>
            </div>
        </header>
    );
}

// Card con glassmorphism y hover
function StatCard({ label, value, icon, accent = "from-blue-500 to-blue-400" }) {
    return (
        <div
            className={`rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center bg-gradient-to-br ${accent} hover:scale-105 transition-transform duration-300 border border-white/40 backdrop-blur-xl relative group`}
        >
            <div className="mb-2">{icon}</div>
            <span className="text-3xl font-extrabold text-white drop-shadow">{value ?? 0}</span>
            <span className="text-white mt-2 text-base font-semibold text-center group-hover:text-blue-100 transition-colors duration-200">
                {label}
            </span>
            <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:bg-white/10 transition duration-200" />
        </div>
    );
}

function SectionCard({ title, children }) {
    return (
        <section className="bg-white/60 rounded-2xl shadow-xl p-6 h-full flex flex-col backdrop-blur-lg border border-blue-100 hover:shadow-2xl transition-shadow duration-200">
            <h2 className="text-xl font-bold mb-3 text-blue-800 drop-shadow">{title}</h2>
            <div className="flex-1">{children}</div>
        </section>
    );
}

function PopularFormsList({ forms }) {
    if (!forms || forms.length === 0)
        return <p className="text-gray-500">No hay datos suficientes.</p>;

    return (
        <ul className="divide-y divide-blue-100">
            {forms.map((form, idx) => (
                <li
                    key={form.form_id || form.id}
                    className="py-3 flex items-center justify-between px-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 hover:scale-105 transition-all duration-200 shadow-sm"
                >
                    <span className="font-semibold text-blue-900">{form.title || `Formulario ${idx + 1}`}</span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold shadow">
                        {form.responseCount || 0} respuestas
                    </span>
                </li>
            ))}
        </ul>
    );
}

// Pie chart para tipos de campo
function FieldTypePieChart({ fieldTypes }) {
    if (!fieldTypes || fieldTypes.length === 0)
        return <div className="text-gray-500">No hay datos suficientes.</div>;
    const data = fieldTypes.map((ft) => ({
        name: ft.type_id,
        value: parseInt(ft.count),
    }));
    return (
        <ResponsiveContainer width="100%" height={220}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                >
                    {data.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        background: "#fff",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        color: "#1e293b",
                        fontWeight: "bold",
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

// Pie chart para visibilidad de formularios
function FormVisibilityPieChart({ visibility }) {
    if (!visibility) return <div className="text-gray-500">No hay datos suficientes.</div>;
    const data = [
        { name: "Públicos", value: visibility.public },
        { name: "Privados", value: visibility.private },
    ];
    return (
        <ResponsiveContainer width="100%" height={220}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                >
                    {data.map((entry, idx) => (
                        <Cell key={`cell-vis-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        background: "#fff",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        color: "#1e293b",
                        fontWeight: "bold",
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

// Gráfico de líneas para respuestas por día
function ResponsesPerDayLineChart({ responsesPerDay }) {
    if (!responsesPerDay || responsesPerDay.length === 0)
        return <div className="text-gray-500">No hay datos suficientes.</div>;
    const data = responsesPerDay.map((d) => ({
        fecha: d.date,
        respuestas: typeof d.count === "string" ? parseInt(d.count) : d.count,
    }));
    return (
        <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis allowDecimals={false} />
                <Tooltip
                    contentStyle={{
                        background: "#fff",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        color: "#1e293b",
                        fontWeight: "bold",
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="respuestas"
                    stroke="#f472b6"
                    strokeWidth={4}
                    dot={{ r: 6 }}
                    activeDot={{ r: 10 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}