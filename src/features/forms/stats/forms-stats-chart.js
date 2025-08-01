import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell
} from "recharts";
import { findStatsForm } from "./api";

// Iconos SVG con estilos extra
function ArrowPathIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5A9 9 0 1020.5 7.5M4.5 19.5V15.75M4.5 19.5h3.75" />
    </svg>
  );
}
function ChartBarIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth={1.5}>
      <rect x="3" y="10" width="4" height="10" rx="1" fill="#6366f1" />
      <rect x="9" y="6" width="4" height="14" rx="1" fill="#818cf8" />
      <rect x="15" y="3" width="4" height="17" rx="1" fill="#ef4444" />
    </svg>
  );
}
function QuestionIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="#f59e42" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" fill="#fffbe6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01M12 13a2 2 0 10-2-2m2 2v2" />
    </svg>
  );
}
function WordCloudIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="#14b8a6" strokeWidth={1.5}>
      <ellipse cx="12" cy="12" rx="9" ry="6" fill="#e0fdfa" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12M12 6v12" />
    </svg>
  );
}
function NumericIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="#a78bfa" strokeWidth={1.5}>
      <rect x="7" y="7" width="10" height="10" rx="3" fill="#faf5ff" />
      <text x="12" y="15" textAnchor="middle" fontSize="8" fill="#a78bfa">123</text>
    </svg>
  );
}

// Paleta de colores
const COLORS = ["#6366f1", "#818cf8", "#14b8a6", "#f472b6", "#f59e42"];

// Animación de fade-in extra
const FADE_IN = "transition-all duration-700 ease-out animate-fade-in";

// Card decorativa para preguntas
function QuestionCard({ data }) {
  return (
    <div className={`rounded-xl bg-gradient-to-br from-orange-50 to-white shadow-lg p-5 mb-8 border border-orange-200 hover:scale-[1.01] transition-all`}>
      <div className="flex items-center gap-2 mb-2">
        <QuestionIcon className="w-6 h-6" />
        <span className="font-bold text-lg text-orange-800">{data.questionText || "Pregunta"}</span>
        <span className="ml-auto px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">{data.questionType}</span>
      </div>
      <div className="text-gray-700 mb-2">
        <span className="font-semibold">Respuestas:</span>
        <span className="font-bold ml-2 bg-orange-50 px-2 py-0.5 rounded">{data.responses}</span>
      </div>

      {data.optionStats && data.optionStats.length > 0 && (
        <div className="mb-2">
          <div className="font-semibold text-indigo-600 mb-1">Opciones y cantidad:</div>
          <ul className="ml-3 grid gap-1 grid-cols-2 sm:grid-cols-3">
            {data.optionStats.map(opt => (
              <li key={opt.optionId} className="bg-indigo-50 rounded px-2 py-1 flex justify-between items-center text-sm font-medium">
                <span className="text-indigo-700">{opt.text}</span>
                <span className="font-bold text-indigo-900">{opt.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top y bottom opciones */}
      {data.topOptions && data.topOptions.length > 0 && (
        <div className="mb-1">
          <div className="flex items-center gap-1 font-semibold text-green-700">
            <ChartBarIcon className="w-5 h-5" /> Top opciones:
          </div>
          <ul className="ml-3 flex gap-2 flex-wrap">
            {data.topOptions.map(opt => (
              <li key={opt.optionId} className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-bold">
                {opt.text}: {opt.count}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.bottomOptions && data.bottomOptions.length > 0 && (
        <div className="mb-1">
          <div className="flex items-center gap-1 font-semibold text-red-700">
            <ChartBarIcon className="w-5 h-5" /> Menos seleccionadas:
          </div>
          <ul className="ml-3 flex gap-2 flex-wrap">
            {data.bottomOptions.map(opt => (
              <li key={opt.optionId} className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-bold">
                {opt.text}: {opt.count}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Wordcloud */}
      {data.wordCloud && data.wordCloud.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center gap-1 font-semibold text-teal-700">
            <WordCloudIcon className="w-5 h-5" /> Palabras más mencionadas:
          </div>
          <ul className="mt-1 ml-3 flex flex-wrap gap-2">
            {data.wordCloud.map(wc =>
              <li key={wc.word} className="bg-teal-100 text-teal-800 rounded px-2 py-1 text-sm font-medium">
                {wc.word} <span className="font-bold">{wc.count}</span>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Numeric stats */}
      {data.numericStats && (
        <div className="mb-2">
          <div className="flex items-center gap-1 font-semibold text-purple-700">
            <NumericIcon className="w-5 h-5" /> Estadísticas numéricas:
          </div>
          <ul className="mt-1 ml-3 grid grid-cols-2 gap-1 text-sm">
            <li>Promedio: <span className="font-bold">{data.numericStats.avg}</span></li>
            <li>Mediana: <span className="font-bold">{data.numericStats.median}</span></li>
            <li>Mínimo: <span className="font-bold">{data.numericStats.min}</span></li>
            <li>Máximo: <span className="font-bold">{data.numericStats.max}</span></li>
          </ul>
        </div>
      )}

      {/* Muestra ejemplos de respuestas abiertas */}
      {data.sampleAnswers && data.sampleAnswers.length > 0 && (
        <div className="mb-2">
          <div className="font-semibold text-orange-700 mb-1">Ejemplos de respuestas:</div>
          <ul className="ml-3 flex flex-wrap gap-2">
            {data.sampleAnswers.map((ans, idx) =>
              <li key={idx} className="bg-orange-100 text-orange-800 rounded px-2 py-1 text-xs font-medium">
                {ans}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function FormStatsChart({ formId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const json = await findStatsForm(formId);
      setStats(json.data || json);
    } catch {
      setError("No se pudieron cargar las estadísticas del formulario.");
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    if (formId) fetchStats();
  }, [fetchStats, formId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-48">
        <svg
          className="animate-spin h-10 w-10 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow flex items-center justify-between mb-4 animate-fade-in">
        <div className="flex items-center gap-2">
          <ArrowPathIcon className="w-6 h-6 text-red-400 animate-spin" aria-hidden="true" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-red-400 ml-4"
        >
          <ArrowPathIcon className="w-5 h-5 mr-1" />
          Reintentar
        </button>
      </div>
    );

  if (!stats) return null;

  // Calcular promedio de respuestas por día
  const avgResponsesPerDay = stats.responsesPerDay && stats.responsesPerDay.length > 0
    ? stats.responsesPerDay.reduce((acc, d) => acc + Number(d.count), 0) / stats.responsesPerDay.length
    : null;

  return (
    <div className={`space-y-8 ${FADE_IN}`}>
      {/* Cards de resumen con iconos */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <SummaryCard
          label="Respuestas totales"
          value={stats.totalResponses}
          accent="from-indigo-500 to-indigo-400"
          icon={<ChartBarIcon className="w-7 h-7" />}
        />
        <SummaryCard
          label="Preguntas en formulario"
          value={stats.totalQuestions}
          accent="from-blue-400 to-blue-300"
          icon={<QuestionIcon className="w-7 h-7" />}
        />
        <SummaryCard
          label="Tasa de abandono"
          value={stats.abandonmentRate != null ? stats.abandonmentRate.toFixed(1) + "%" : "-"}
          accent="from-pink-400 to-fuchsia-400"
          icon={<ArrowPathIcon className="w-7 h-7" />}
        />
        <SummaryCard
          label="Promedio de respuestas por día"
          value={avgResponsesPerDay != null ? avgResponsesPerDay.toFixed(2) : "-"}
          accent="from-emerald-400 to-emerald-300"
          icon={<ChartBarIcon className="w-7 h-7" />}
        />
      </div>

      {/* Gráfico de barras: Respuestas por día */}
      <SectionCard title="Respuestas recibidas por día" icon={<ChartBarIcon className="w-7 h-7" />}>
        {stats.responsesPerDay && stats.responsesPerDay.length > 0 ? (
          <div className="w-full h-64">
            <ResponsiveContainer>
              <BarChart
                data={stats.responsesPerDay.map((d, i) => ({
                  ...d,
                  count: Number(d.count),
                  fill: COLORS[i % COLORS.length],
                }))}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
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
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.responsesPerDay.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-gray-400 text-center py-10">
            No hay respuestas para mostrar.
          </div>
        )}
      </SectionCard>

      {/* Estadísticas por pregunta */}
      <SectionCard title="Resumen por pregunta" icon={<QuestionIcon className="w-7 h-7" />}>
        <div>
          {(stats.questionStats || []).map((q, idx) => (
            <QuestionCard key={idx} data={q} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// Card resumen con iconos y gradiente
function SummaryCard({ label, value, accent = "from-indigo-500 to-indigo-400", icon }) {
  return (
    <div className={`rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center bg-gradient-to-br ${accent} border border-white/40 backdrop-blur-xl relative`}>
      {icon && <div className="absolute top-4 right-4 opacity-60">{icon}</div>}
      <span className="text-3xl font-extrabold text-white drop-shadow">{value ?? "-"}</span>
      <span className="text-white mt-2 text-base font-semibold text-center">{label}</span>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <section className="bg-white/60 rounded-2xl shadow-xl p-6 h-full flex flex-col backdrop-blur-lg border border-indigo-100 mb-2">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-xl font-bold text-indigo-800 drop-shadow">{title}</h2>
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
}