import { useState } from 'react';
import { create, updateById } from "./api";
import QuestionItem from '../components/question-item';
import {
    CloudArrowUpIcon,
    PlusCircleIcon,
    PaperAirplaneIcon,
    ArrowPathIcon
} from '@heroicons/react/24/solid';
import ButtonComponent from '../../../components/button-secondary';

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
                throw new Error('Datos del formulario incompletos');
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
                throw new Error(response.message || 'Error en la respuesta del servidor');
            }

            // Actualización del estado con respuesta
            setFormData(prev => ({
                ...prev,
                id: response.data.id,
                isPublic: false,
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
                images: option.images?.map(image => {
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
            const response = await updateById(payload.id, payload);

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
                <ArrowPathIcon className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">
                    Error al cargar el formulario: {error}
                    <button onClick={hideError} className="ml-2 underline">
                        Ocultar
                    </button>
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
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

                {!formData.isPublic && <ButtonComponent
                    onClick={onPublish}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    icon={<PaperAirplaneIcon className="w-5 h-5" />}
                    text="Publicar"
                    disabled={!formData.id || loading}>
                </ButtonComponent>}
            </div>


            {success && <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p className="text-sm text-green-700">
                    {success}
                    <button onClick={() => window.location.reload()} className="ml-2 underline">
                        Refrescar
                    </button>
                </p>
            </div>}

            <div className="bg-white p-4 border rounded shadow">
                <div className="flex justify-between items-start">
                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="Título del formulario"
                            value={formData.title || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            className="text-xl font-semibold text-gray-800 w-full border-b focus:outline-none focus:border-indigo-500"
                        />
                        <textarea
                            placeholder="Descripción del formulario"
                            value={formData.description || ''}
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
        </div>
    );
};

export default EditFormPage;
