import React, { useEffect, useState, useCallback } from "react";
import { findById, saveResponse } from "./api";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../../components/input";
import Textarea from "../../../components/textarea";
import CheckboxGroup from "../../../components/checkbox-group";
import RadioGroup from "../../../components/radio-group";
import StarRating from "../../../components/star-rating";
import DateField from "../../../components/form-builder/fields/date-field";
import TimeField from "../../../components/form-builder/fields/time-field";

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
                questions: (originalForm.questions || [])
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

            setSuccess("¡Gracias! El formulario fue enviado correctamente.");

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
                <svg
                    className="animate-spin h-10 w-10 text-blue-700"
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

    // Progreso en %
    const numRespondidas = Object.values(answers).filter(v => (Array.isArray(v) ? v.length > 0 : v)).length;
    const total = formData.questions?.length || 0;
    const progress = total ? Math.round((numRespondidas / total) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
            {/* Encabezado visual */}
            <div className="flex flex-col items-center mb-10">
                {/* Nuevo icono: documento profesional */}
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full shadow">
                    {/* Heroicons: DocumentText */}
                    <svg className="w-10 h-10 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M12 20h9M12 4h9M4 4h.01M4 20h.01M4 12h16" />
                    </svg>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight drop-shadow mt-4 text-center">
                    {formData.title}
                </h1>
                {/* Subtítulo */}
                <p className="text-lg text-gray-500 mt-2 text-center">
                    {formData.subtitle || "Por favor responde las siguientes preguntas para ayudarnos a mejorar."}
                </p>
                {/* Estado público/privado */}
                {formData.isPublic && (
                    <span className="mt-2 px-3 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700 shadow">
                        Formulario público
                    </span>
                )}
                <hr className="my-6 border-gray-200 w-full" />
            </div>

            {/* Nota de privacidad */}
            <div className="bg-blue-50 border-l-4 border-blue-300 p-3 rounded mb-6 text-sm text-blue-700 shadow-sm text-center">
                Tus respuestas son anónimas y confidenciales.
            </div>

            {/* Descripción del formulario, destacada y color cambiado */}
            {formData.description && (
                <div className="mb-8">
                    <div className="bg-white rounded shadow-md p-4 text-gray-600 text-center text-base border border-gray-100">
                        {formData.description}
                    </div>
                </div>
            )}

            {/* Progreso visual */}
            {total > 0 && (
                <div className="flex items-center justify-between mb-7">
                    <div className="w-full h-3 bg-gray-100 rounded-full mr-4">
                        <div
                            style={{ width: `${progress}%` }}
                            className={`h-3 bg-blue-700 rounded-full transition-all duration-500`}
                        ></div>
                    </div>
                    <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded shadow">
                        {numRespondidas} / {total} respondidas ({progress}%)
                    </span>
                </div>
            )}

            {/* Mensajes */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded shadow-sm text-red-800 font-medium animate-fade-in">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded shadow-md animate-fade-in text-center">
                    <p className="text-green-800 font-bold mb-3 text-lg">{success}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleResetForm}
                            className="px-5 py-2 bg-blue-700 text-white rounded font-semibold shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6" />
                            </svg>
                            Enviar nueva respuesta
                        </button>
                        <button
                            onClick={() => navigate("https://questionask.jac-box.com/index")}
                            className="px-5 py-2 bg-gray-500 text-white rounded font-semibold shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver al inicio
                        </button>
                    </div>
                </div>
            )}

            {!success && (
                <form
                    onSubmit={e => { e.preventDefault(); handleSubmit(); }}
                    className="space-y-8"
                    autoComplete="off"
                >
                    {formData.questions.map((q) => (
                        <div
                            key={q.id}
                            className="border p-5 rounded-xl shadow-md bg-white transition-transform transform hover:scale-[1.01] hover:shadow-lg"
                        >
                            {renderInput(q, answers[q.id], (val) => handleChange(q, val))}
                        </div>
                    ))}
                    <div className="mt-7 flex justify-end">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`px-6 py-3 rounded-lg text-white font-semibold transition flex items-center gap-2
                                ${isFormValid
                                    ? 'bg-blue-700 hover:bg-blue-800 shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                                    : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Enviar formulario
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

// Input renderer, con mejoras visuales y props
function renderInput(question, value, onChange) {
    switch (question.type) {
        case 'short':
            return (
                <Input
                    label={question.questionText}
                    type="text"
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    className="w-full border border-blue-200 px-4 py-2 rounded-xl bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
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
                    onChange={e => onChange(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-2 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 text-base resize-none"
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
        case 'radio':
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
                <DateField
                    label={question.questionText}
                    name={`date-${question.id}`}
                    type="date"
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    className="border border-blue-200 px-3 py-2 rounded-xl bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                    required={question.required}
                />
            );
        case 'time':
            return (
                <TimeField
                    label={question.questionText}
                    type="time"
                    name={`time-${question.id}`}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    className="border border-gray-200 px-3 py-2 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 text-base"
                    required={question.required}
                />
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