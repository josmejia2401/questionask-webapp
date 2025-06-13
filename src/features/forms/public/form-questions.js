import React, { useEffect, useState, useCallback } from "react";
import { findById, saveResponse } from "./api";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../../components/input";
import Textarea from "../../../components/textarea";
import CheckboxGroup from "../../../components/checkbox-group";
import RadioGroup from "../../../components/radio-group";
import StarRating from "../../../components/star-rating";

const useQuery = () => new URLSearchParams(useLocation().search);

export default function FormQuestions() {
    const query = useQuery();
    const id = query.get("id");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    const [answers, setAnswers] = useState({});
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);

    const fetchForm = useCallback(async () => {
        try {
            setError(null);
            setSuccess(null);
            setLoading(true);
            const json = await findById(id);
            if (json.code !== 200) {
                throw new Error(json.message || 'Formulario no encontrado');
            }
            const originalForm = json.data;
            const sortedForm = {
                ...originalForm,
                questions: originalForm.questions
                    .slice()
                    .sort((a, b) => a.order - b.order)
            };
            setFormData(sortedForm);

            // Inicializar respuestas vacías
            const initialAnswers = {};
            sortedForm.questions.forEach(q => {
                if (q.type === 'checkbox') {
                    initialAnswers[q.id] = [];
                } else {
                    initialAnswers[q.id] = '';
                }
            });
            setAnswers(initialAnswers);
        } catch (err) {
            setError(err.message || 'Error al cargar el formulario');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchForm();
    }, [fetchForm]);

    const handleResetForm = () => {
        const reset = {};
        Object.keys(answers).forEach(k => {
            reset[k] = Array.isArray(answers[k]) ? [] : '';
        });
        setAnswers(reset);
        setSuccess(null);
        setError(null);
    };

    const transformAnswersForApi = () => {
        return Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answerText: Array.isArray(answer) ? answer.join(', ') : String(answer)
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!validateForm()) return;

            setError(null);
            setSuccess(null);
            setLoading(true);

            const payload = {
                formId: formData.id,
                answers: transformAnswersForApi()
            };

            const res = await saveResponse(payload);
            if (res.code !== 201) throw new Error(res.data.message);

            setSuccess("Formulario guardado correctamente.");

            const reset = {};
            Object.keys(answers).forEach(k => {
                reset[k] = Array.isArray(answers[k]) ? [] : '';
            });
            setAnswers(reset);
        } catch (err) {
            setError(err.message || "Error al guardar el borrador.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (question, value) => {
        setAnswers(prev => ({
            ...prev,
            [question.id]: value
        }));
    };

    // Valida automáticamente los campos requeridos
    useEffect(() => {
        if (!formData?.questions?.length) return;

        const isValid = formData.questions.every(q => {
            const val = answers[q.id];
            return !q.required || (
                typeof val === 'string' ? val.trim() !== '' :
                    Array.isArray(val) ? val.length > 0 :
                        val !== null && val !== undefined
            );
        });

        setIsFormValid(isValid);
    }, [answers, formData.questions]);

    const validateForm = () => {
        const missing = formData.questions.filter(q => {
            const val = answers[q.id];
            return q.required && (
                val === '' || val === null || val === undefined ||
                (Array.isArray(val) && val.length === 0)
            );
        });
        if (missing.length > 0) {
            setError("Por favor completa todos los campos requeridos.");
            return false;
        }
        return true;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-indigo-600 animate-spin h-10 w-10 border-4 border-current border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-4">
                <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h1a4 4 0 014 4v2m-5-10a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-indigo-800">{formData.title}</h2>
            </div>

            {formData.description && (
                <p className="text-gray-600 mb-6 text-md">{formData.description}</p>
            )}

            <div className="text-sm text-gray-500 mb-4 text-right">
                {Object.values(answers).filter(v => (Array.isArray(v) ? v.length > 0 : v)).length} / {formData.questions.length} preguntas respondidas
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
                    <p className="text-green-800 font-medium mb-2">{success}</p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleResetForm}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                        >
                            Enviar nueva respuesta
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
            )}


            <div className="space-y-6">
                {formData.questions.map((q) => (
                    <div key={q.id} className="border p-4 rounded-md shadow-sm bg-white transition transform hover:scale-[1.01]">
                        {renderInput(q, answers[q.id], (val) => handleChange(q, val))}
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className={`px-4 py-2 rounded text-white transition ${isFormValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    Enviar formulario
                </button>
            </div>
        </div>
    );
}

function renderInput(question, value, onChange) {
    switch (question.type) {
        case 'short':
            return (
                <Input
                    label={question.questionText}
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    maxLength={255}
                    required={question.required}
                />
            );
        case 'long':
            return (
                <Textarea
                    label={question.questionText}
                    required={question.required}
                    rows="4"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    maxLength={2000}
                />
            );
        case 'checkbox':
            return (
                <CheckboxGroup
                    options={question.options}
                    name={`checkbox-${question.id}`}
                    label={question.questionText}
                    selected={value || []}
                    required={question.required}
                    onChange={onChange}
                />
            );
        case 'multiple':
            return (
                <RadioGroup
                    options={question.options}
                    name={`radio-${question.id}`}
                    label={question.questionText}
                    value={value}
                    required={question.required}
                    onChange={onChange}
                />
            );
        case 'date':
            return (
                <div className="mb-4">
                    <label className="block font-semibold mb-2">
                        {question.questionText} {question.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="date"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="border px-3 py-2 rounded"
                    />
                </div>
            );
        case 'time':
            return (
                <div className="mb-4">
                    <label className="block font-semibold mb-2">
                        {question.questionText} {question.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="time"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="border px-3 py-2 rounded"
                    />
                </div>
            );
        case 'rating':
            return (
                <StarRating
                    name={`rating-${question.id}`}
                    label={question.questionText}
                    value={value}
                    required={question.required}
                    onChange={onChange}
                />
            );
        default:
            return <p className="text-gray-500">Tipo desconocido: {question.type}</p>;
    }
}
