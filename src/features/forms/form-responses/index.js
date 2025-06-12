import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { findById } from "./api";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const useQuery = () => new URLSearchParams(useLocation().search);

export default function FormResponses() {
  const [id] = useState(useQuery().get('id'));
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchForm = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const json = await findById(id);
      if (json.code !== 200) {
        throw new Error(json.message || 'Respuestas no encontrado');
      }
      setResponses(
        json.data
          .slice()
          .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
      );

    } catch (err) {
      setError(err.message || 'Error al cargar las respuestas');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
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
              Error al cargar formularios: {error}
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


  if (responses.length === 0) return <p className="text-center mt-4">No hay respuestas aún.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Respuestas del Formulario</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={fetchForm}
          className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition"
        >
          <ArrowPathIcon className="w-5 h-5" aria-hidden="true"></ArrowPathIcon>
        </button>
      </div>

      <div className="space-y-6">
        {responses.map((response, idx) => (
          <div key={response.id} className="bg-white shadow-md rounded-lg p-4 border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Respuesta #{idx + 1}</span>
              <span className="text-sm text-gray-600">
                {response.submittedAt}
              </span>
            </div>
            <div className="space-y-2">
              {response.answers.map((ans) => (
                <div
                  key={ans.id}
                  className="bg-gray-50 p-3 rounded border text-gray-800"
                >
                  <strong>Pregunta ID:</strong> {ans.questionId}<br />
                  <strong>Respuesta:</strong> {ans.answerText}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
