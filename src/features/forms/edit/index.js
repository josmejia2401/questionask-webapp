import { useState, useEffect, useCallback, useRef } from 'react';
import { updateById, findById, publishById } from "./api";
import QuestionItem from '../components/question-item';
import {
    CloudArrowUpIcon,
    PlusCircleIcon,
    PaperAirplaneIcon,
    ArrowPathIcon
} from '@heroicons/react/24/solid';

import ButtonComponent from '../../../components/button';
import { useLocation } from 'react-router-dom';
import InputTitle from '../../../components/input-title';
import TextareaTitle from '../../../components/input-title';

const useQuery = () => new URLSearchParams(useLocation().search);

const EditFormPage = () => {
    const endQuestionsRef = useRef(null);
    const [id] = useState(useQuery().get('id'));
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showShareUrl, setShowShareUrl] = useState(false);
    const [publicUrl, setPublicUrl] = useState(null);
    const [copied, setCopied] = useState(false);

    const trackError = (error, context) => {
        console.error(context, error);
    };

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
            const publicUrl = `${window.location.origin}/public/form?id=${sortedForm.id}`;
            setPublicUrl(publicUrl);
        } catch (err) {
            setError(err.message || 'Error al cargar el formulario');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchForm();
    }, [fetchForm]);





    const handleSave = async () => {
        try {
            // Reset estados
            setError(null);
            setSuccess(null);
            setLoading(true);

            // Validación básica de formData
            if (!formData || !formData.questions) {
                throw new Error('Datos del formulario incompletos');
            }

            // Procesamiento de imágenes y preparación de datos
            const { updatedQuestions, filesToUpload } = processFormQuestions(formData.questions);

            // Estructura final para enviar al backend
            const payload = {
                ...formData,
                questions: updatedQuestions,
                createdAt: new Date().toISOString() // Metadata útil
            };

            // Debug (solo en desarrollo)
            if (process.env.NODE_ENV === 'development') {
                console.debug('Payload a enviar:', payload);
            }

            // Llamada a la API
            const response = await updateById(id, payload);

            if (response.code !== 200) {
                throw new Error(response.message || 'Error en la respuesta del servidor');
            }

            // Actualización del estado con respuesta
            setFormData(prev => ({
                ...prev,
                id: response.data.id,
            }));

            setSuccess(response.message || 'Formulario guardado exitosamente');

            if (filesToUpload.length > 0) {
                await uploadFiles(filesToUpload, response.data.id);
            }
        } catch (error) {
            handleSaveError(error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Procesa las preguntas y extrae archivos para subir.
     */
    const processFormQuestions = (questions) => {
        const filesToUpload = [];
        const updatedQuestions = questions.map(question => ({
            ...question,
            options: question.options?.map(option => ({
                ...option,
                files: option.files?.map(image => {
                    if (image instanceof File) {
                        filesToUpload.push({
                            file: image,
                            questionId: question.id,
                            optionId: option.id
                        });
                        return { imagePath: `${image.name}` };
                    }
                    return image;
                })
            }))
        }));

        return { updatedQuestions, filesToUpload };
    };

    /**
     * Manejo centralizado de errores.
     */
    const handleSaveError = (error) => {
        const errorMessage = error.response?.data?.message
            || error.message
            || 'Error al guardar el formulario';

        console.error('Error en handleSave:', error);
        setError(errorMessage);

        // Opcional: Notificación a servicios de monitoreo (Sentry, etc.)
        if (process.env.NODE_ENV === 'production') {
            trackError(error);
        }
    };

    /**
     * Ejemplo de subida de archivos (implementación separada).
     */
    const uploadFiles = async (files, formId) => {
        /*try {
            await Promise.all(
                files.map(file =>
                    uploadFile(file.file, {
                        formId,
                        questionId: file.questionId,
                        optionId: file.optionId
                    })
                )
            );
        } catch (uploadError) {
            console.warn('Error al subir archivos:', uploadError);
            // Opcional: Reintentos o manejo específico
        }*/
    };

    const onPublish = async () => {
        try {
            // Reset estados
            setError(null);
            setSuccess(null);
            setLoading(true);

            // Validación básica de formData
            if (!formData || !formData.questions) {
                throw new Error('Datos del formulario incompletos');
            }

            // Procesamiento de imágenes y preparación de datos
            const { updatedQuestions, filesToUpload } = processFormQuestions(formData.questions);

            // Estructura final para enviar al backend
            const payload = {
                ...formData,
                questions: updatedQuestions,
                isPublic: true,
            };

            // Debug (solo en desarrollo)
            if (process.env.NODE_ENV === 'development') {
                console.debug('Payload a enviar:', payload);
            }

            // Llamada a la API
            const response = await publishById(id, payload);

            if (response.code !== 200) {
                throw new Error(response.message || 'Error en la respuesta del servidor');
            }

            // Actualización del estado con respuesta
            setFormData(prev => ({
                ...prev,
                id: response.data.id,
                isPublic: true,
            }));

            setSuccess(response.message || 'Formulario guardado exitosamente');

            if (filesToUpload.length > 0) {
                await uploadFiles(filesToUpload, response.data.id);
            }
        } catch (error) {
            handleSaveError(error);
        } finally {
            setLoading(false);
        }
    };

    const addQuestion = () => {
        const newQuestions = [
            ...formData.questions || [],
            {
                questionText: '',
                type: 'short',
                options: [],
                required: false,
                createdAt: new Date().toISOString()
            },
        ];
        setFormData({ ...formData, questions: newQuestions });

        setTimeout(() => {
            if (endQuestionsRef.current) {
                endQuestionsRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const updateQuestion = (index, updatedQuestion) => {
        const newQuestions = [...formData.questions];
        newQuestions[index] = updatedQuestion;
        const form = { ...formData, questions: newQuestions }
        setFormData(form);
    };

    const removeQuestion = (index) => {
        const newQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: newQuestions });
    };

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
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ArrowPathIcon
                        className="w-6 h-6 text-red-400 animate-spin"
                        aria-hidden="true"
                    />
                    <p className="text-sm text-red-700 font-medium">
                        Error al cargar el formulario: <span className="font-normal">{error}</span>
                    </p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                        onClick={fetchForm}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        <ArrowPathIcon className="w-5 h-5 mr-1" />
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Crear Formulario: {formData.title}
            </h1>

            <div className="sticky top-0 z-30 bg-white py-3 flex flex-wrap gap-3 mb-4 shadow border-b">
                <ButtonComponent
                    onClick={addQuestion}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    disabled={loading}
                    icon={<PlusCircleIcon className="w-5 h-5" />}
                    text="Añadir pregunta">
                </ButtonComponent>
                <ButtonComponent
                    onClick={() => handleSave(false)}
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    disabled={loading}
                    text={`Guardar`}
                    icon={<CloudArrowUpIcon className="w-5 h-5" />}>
                </ButtonComponent>
                {formData.isPublic && (
                    <ButtonComponent
                        onClick={() => setShowShareUrl(!showShareUrl)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        icon={<ArrowPathIcon className="w-5 h-5" />}
                        text={showShareUrl ? "Ocultar enlace" : "Compartir"}
                    />
                )}
                {!formData.isPublic && <ButtonComponent
                    onClick={onPublish}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    icon={<PaperAirplaneIcon className="w-5 h-5" />}
                    text="Publicar"
                    disabled={!formData.id || loading}>
                </ButtonComponent>}
            </div>


            {showShareUrl && (
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-sm text-blue-800">
                        Comparte este enlace con las personas que responderán el formulario:
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                        <input
                            type="text"
                            readOnly
                            value={publicUrl}
                            className="w-full px-3 py-2 border border-blue-300 rounded bg-white text-sm text-gray-800"
                        />
                        <button
                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            onClick={() => {
                                navigator.clipboard.writeText(publicUrl);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 3000);
                            }}
                        >
                            Copiar
                        </button>
                    </div>
                    {copied && (
                        <p className="text-xs text-green-700 mt-2">
                            ¡Enlace copiado al portapapeles!
                        </p>
                    )}
                </div>
            )}




            {success && <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p className="text-sm text-green-700">
                    {success}
                    <button onClick={fetchForm} className="ml-2 underline">
                        Refrescar
                    </button>
                </p>
            </div>}

            <div className="bg-white p-4 border rounded shadow">
                <div className="flex justify-between items-start">
                    <div className="w-full">
                        <InputTitle
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Título del formulario"
                            maxLength={80}
                            required={true}
                            value={formData.title || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            className="text-xl font-semibold text-gray-800 w-full border-b focus:outline-none focus:border-indigo-500"
                        />
                        <TextareaTitle
                            type="text"
                            name="description"
                            id="description"
                            placeholder="Descripción del formulario"
                            value={formData.description || ''}
                            maxLength={255}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="mt-2 text-gray-600 w-full border-b focus:outline-none focus:border-indigo-500 resize-none"
                        />
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${formData.isPublic
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {formData.isPublic ? 'Público' : 'Privado'}
                    </span>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                {formData.questions && formData.questions.map((question, index) => (
                    <QuestionItem
                        key={index}
                        index={index}
                        question={question}
                        updateQuestion={updateQuestion}
                        removeQuestion={removeQuestion}
                        addQuestion={addQuestion}
                    />
                ))}
                {/* Ref para scroll automático */}
                <div ref={endQuestionsRef} />
            </div>
        </div>
    );
};

export default EditFormPage;
