import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { findById } from "./api";
import { ArrowPathIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import QuestionStatsChart from "../stats/question-stats-chart";
import FormStatsChart from "../stats/forms-stats-chart";

const useQuery = () => new URLSearchParams(useLocation().search);

export default function FormResponses() {
  const [id] = useState(useQuery().get("id"));
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});
  const [questionChartExpanded, setQuestionChartExpanded] = useState({});
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

  const toggleQuestionChart = (questionId) => {
    setQuestionChartExpanded((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const toggleStats = () => setStatsExpanded(v => !v); // <---

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
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error al cargar respuestas: {error}
              <button
                onClick={fetchForm}
                className="ml-2 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Reintentar
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (responses.length === 0)
    return <p className="text-center mt-4 text-gray-600">No hay respuestas aún.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Respuestas del Formulario</h2>

      {/* Expand/collapse de estadísticas */}
      <div className="mb-4">
        <button
          onClick={toggleStats}
          className="flex items-center gap-2 font-medium text-indigo-700 hover:underline focus:outline-none"
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
            <div className="mt-4 mb-8">
              <FormStatsChart formId={id} />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={fetchForm}
          className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition"
        >
          <ArrowPathIcon className="w-5 h-5 mr-1" aria-hidden="true" />
          Recargar
        </button>
      </div>

      <div className="space-y-4">
        {responses.map((response, idx) => (
          <div key={response.id} className="bg-white shadow rounded border">
            <div
              onClick={() => toggleExpand(response.id)}
              className="cursor-pointer px-4 py-3 flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <p className="text-sm text-gray-500">Respuesta #{idx + 1}</p>
                <p className="text-xs text-gray-400">{new Date(response.submittedAt).toLocaleString()}</p>
              </div>
              {expanded[response.id] ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-600" />
              )}
            </div>

            {expanded[response.id] && (
              <div className="px-4 pb-4 space-y-3 transition-all duration-200">
                {response.answers.map((ans) => (
                  <div key={ans.id} className="bg-gray-100 p-3 rounded">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">
                        {ans.question?.questionText || "Pregunta desconocida"}
                      </p>
                      <button
                        onClick={() => toggleQuestionChart(ans.questionId)}
                        className="flex items-center text-indigo-600 text-xs hover:underline focus:outline-none ml-2"
                        type="button"
                      >
                        {questionChartExpanded[ans.questionId] ? (
                          <>
                            <ChevronUpIcon className="w-4 h-4" /> Ocultar gráfico
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon className="w-4 h-4" /> Ver gráfico
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-800 mt-1">{ans.answerText || "Sin respuesta"}</p>
                    {questionChartExpanded[ans.questionId] && ans.questionId && (
                      <div className="mt-4">
                        <QuestionStatsChart questionId={ans.questionId} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}