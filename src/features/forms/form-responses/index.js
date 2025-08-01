import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { findById } from "./api";
import { ArrowPathIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import FormStatsChart from "../stats/forms-stats-chart";

const useQuery = () => new URLSearchParams(useLocation().search);

export default function FormResponses() {
  const [id] = useState(useQuery().get("id"));
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});
  const [statsExpanded, setStatsExpanded] = useState(false);

  const fetchForm = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const json = await findById(id);
      if (json.code !== 200) {
        throw new Error(json.message || "Respuestas no encontradas");
      }
      setResponses(
        json.data
          .slice()
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      );
    } catch (err) {
      setError(err.message || "Error al cargar las respuestas");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStats = () => setStatsExpanded(v => !v);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-10 w-10 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6 rounded shadow-sm max-w-2xl mx-auto">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-base text-red-700 font-semibold">
              Error al cargar respuestas:
            </p>
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchForm}
              className="mt-2 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 shadow-sm transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (responses.length === 0)
    return <p className="text-center mt-8 text-gray-500 text-lg">No hay respuestas aún.</p>;

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-6 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700 drop-shadow-sm">Respuestas del Formulario</h2>

      {/* Stats Section */}
      <div className="mb-6">
        <button
          onClick={toggleStats}
          className="flex items-center gap-2 font-semibold text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded transition"
          aria-expanded={statsExpanded}
        >
          {statsExpanded
            ? <ChevronUpIcon className="w-5 h-5" />
            : <ChevronDownIcon className="w-5 h-5" />}
          {statsExpanded ? "Ocultar estadísticas" : "Ver estadísticas"}
        </button>
        <div
          className={`transition-all duration-300 ${statsExpanded ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
        >
          {statsExpanded && (
            <div className="mt-4 mb-8 bg-white shadow-lg rounded p-4 border w-full max-w-6xl mx-auto">
              <FormStatsChart formId={id} />
            </div>
          )}
        </div>
      </div>

      {/* Recargar */}
      <div className="flex items-center justify-end mb-6 w-full">
        <button
          onClick={fetchForm}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-base font-semibold rounded shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" aria-hidden="true" />
          Recargar
        </button>
      </div>

      {/* Respuestas */}
      <div className="flex flex-col gap-8">
        {responses.map((response, idx) => (
          <div key={response.id} className="bg-white shadow-lg rounded-lg border border-gray-100 transition hover:shadow-xl w-full">
            <button
              onClick={() => toggleExpand(response.id)}
              className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              aria-expanded={expanded[response.id]}
            >
              <div>
                <span className="inline-block text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded uppercase font-bold tracking-wider mb-1">
                  Respuesta #{idx + 1}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(response.submittedAt).toLocaleString('es-ES', {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
              {expanded[response.id] ? (
                <ChevronUpIcon className="w-6 h-6 text-indigo-600" />
              ) : (
                <ChevronDownIcon className="w-6 h-6 text-indigo-600" />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${expanded[response.id] ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              {expanded[response.id] && (
                <div className="px-8 pb-6 space-y-4 bg-gray-50 rounded-b-lg">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {response.answers.map((ans) => (
                      <div key={ans.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition w-full">
                        <div className="flex items-center justify-between">
                          <p className="text-base font-semibold text-gray-700">
                            {ans.question?.questionText || (
                              <span className="italic text-gray-400">Pregunta desconocida</span>
                            )}
                          </p>
                        </div>
                        <p className="text-sm text-gray-800 mt-2">{ans.answerText || <span className="italic text-gray-400">Sin respuesta</span>}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}