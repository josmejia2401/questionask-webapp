import React, { useEffect, useState, useCallback } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
// Debes implementar esta función para tu API
import { findStatsForm } from "./api";

export default function FormStatsChart({ formId }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError("");
        findStatsForm(formId)
            .then(json => {
                setStats(json.data);
                setLoading(false);
            })
            .catch(() => {
                setError("No se pudieron cargar las estadísticas del formulario.");
                setLoading(false);
            });
    }, [formId]);

    useEffect(() => {
        if (formId) fetchStats();
    }, [fetchStats, formId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <svg
                    className="animate-spin h-8 w-8 text-indigo-600"
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
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ArrowPathIcon
                        className="w-6 h-6 text-red-400 animate-spin"
                        aria-hidden="true"
                    />
                    <p className="text-sm text-red-700 font-medium">
                        {error}
                    </p>
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
    }

    if (!stats) return null;

    return (
        <div className="space-y-8">
            {/* Cards de resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <SummaryCard label="Respuestas totales" value={stats.totalResponses} />
                <SummaryCard label="Preguntas en formulario" value={stats.totalQuestions} />
                <SummaryCard
                    label="Tasa de abandono"
                    value={stats.abandonmentRate != null ? (stats.abandonmentRate * 100).toFixed(0) + "%" : "-"}
                />
            </div>

            {/* Gráfico de barras: Respuestas por día */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Respuestas recibidas por día
                    </h2>
                    <button
                        onClick={fetchStats}
                        className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors shadow focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        title="Refrescar gráfico"
                    >
                        <ArrowPathIcon className="w-4 h-4 mr-1" />
                        Refrescar
                    </button>
                </div>
                {stats.responsesPerDay.length > 0 ? (
                    <div className="w-full h-64">
                        <ResponsiveContainer>
                            <BarChart
                                data={stats.responsesPerDay.map(d => ({
                                    ...d,
                                    count: Number(d.count)
                                }))}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="text-gray-400 text-center py-10">
                        No hay respuestas para mostrar.
                    </div>
                )}
            </div>
        </div>
    );
}

function SummaryCard({ label, value }) {
    return (
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{value}</div>
            <div className="text-gray-600 text-sm text-center">{label}</div>
        </div>
    );
}