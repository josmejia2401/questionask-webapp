import { useState } from 'react';
import { create } from "./api";
import QuestionItem from '../components/question-item';
import {
    CloudArrowUpIcon,
    PlusCircleIcon,
    ArrowRightCircleIcon
} from '@heroicons/react/24/solid';
import ButtonComponent from '../../../components/button-secondary';
import InputTitle from '../../../components/input-title';
import TextareaTitle from '../../../components/input-title';
import { Link } from 'react-router-dom';

const EditFormPage = () => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const trackError = (error, context) => {
        console.error(context, error);
    };

    const hideError = (e) => {
        setError(null);
        setSuccess(null);
    }

    const handleSave = async () => {
        try {
            // Reset estados
            setError(null);
            setSuccess(null);
            setLoading(true);

            // Validación básica de formData
            if (!formData || !formData.questions) {
                throw new Error('No pudimos procesar el formulario porque falta información. Valida que todos los campos obligatorios y las preguntas estén correctamente ingresados.');
            }

            // Procesamiento de imágenes y preparación de datos
            const { updatedQuestions, filesToUpload } = processFormQuestions(formData.questions);

            // Estructura final para enviar al backend
            const payload = {
                ...formData,
                questions: updatedQuestions,
                isPublic: false,
                createdAt: new Date().toISOString() // Metadata útil
            };

            // Debug (solo en desarrollo)
            if (process.env.NODE_ENV === 'development') {
                console.debug('Payload a enviar:', payload);
            }

            // Llamada a la API
            const response = await create(payload);

            if (response.code !== 201) {
                throw new Error(response.message || 'No fue posible obtener una respuesta del servidor. Por favor, revisa tu conexión o intenta más tarde.');
            }

            // Actualización del estado con respuesta
            setFormData(prev => ({
                ...prev,
                id: response.data.id,
                isPublic: false,
            }));

            setSuccess(response.message || 'Tu formulario fue guardado exitosamente. Ahora puedes continuar editando o compartirlo.');

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
            || 'No fue posible obtener una respuesta del servidor. Por favor, revisa tu conexión o intenta más tarde.';

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
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">
                    {error}
                    <button onClick={hideError} className="ml-2 underline">
                        Ocultar
                    </button>
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            {success && <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded group shadow">
                <div className="flex items-center gap-3">
                    <ArrowRightCircleIcon className="h-7 w-7 text-green-500 animate-bounce" aria-hidden="true" />
                    <p className="flex-1 text-green-700 text-sm">{success}</p>
                    <Link
                        to={`/forms/edit?id=${formData.id}`}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-green-400"
                        aria-label="Continuar para publicar o editar el formulario"
                    >
                        Continuar
                        <ArrowRightCircleIcon className="h-5 w-5 ml-1 text-white animate-pulse" aria-hidden="true" />
                    </Link>
                </div>
                <p className="text-xs text-green-600 mt-1 ml-10">
                    Haz clic en “Continuar” para publicar o editar tu formulario.
                </p>
            </div>}

            {!success &&
                <>
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">
                        Crear Formulario: {formData.title}
                    </h1>

                    <div className="flex flex-wrap gap-3 mb-4">
                        <ButtonComponent
                            onClick={addQuestion}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                            disabled={formData.id || loading}
                            icon={<PlusCircleIcon className="w-5 h-5" />}
                            text="Añadir pregunta">
                        </ButtonComponent>

                        <ButtonComponent
                            onClick={() => handleSave(false)}
                            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                            disabled={formData.id || loading}
                            text={`Guardar`}
                            icon={<CloudArrowUpIcon className="w-5 h-5" />}>
                        </ButtonComponent>
                    </div>

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
                    </div>
                </>}
        </div>
    );
};

export default EditFormPage;
