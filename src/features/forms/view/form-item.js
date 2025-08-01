import React, { useState } from "react";
import QuestionView from './question-view';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";

const iconBase = "w-6 h-6 transition duration-150";
const iconColors = {
  delete: "text-red-600 group-hover:text-red-700",
  edit: "text-blue-600 group-hover:text-blue-700",
  responses: "text-indigo-600 group-hover:text-indigo-700",
  copy: "text-green-600 group-hover:text-green-700",
  default: "text-gray-400 group-hover:text-gray-600"
};

const FormCard = ({ form, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [questionsExpanded, setQuestionsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setShowDeleteDialog(false);
    setLoading(true);
    onDelete(form.id).finally(() => setLoading(false));
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const handleToggleQuestions = (e) => {
    e.stopPropagation();
    setQuestionsExpanded((v) => !v);
  };

  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/public/form?id=${form.id}`;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Botón estandarizado para acciones con icono
  const ActionButton = ({
    children,
    color = "default",
    onClick,
    ariaLabel,
    ...rest
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-${color}-200 transition duration-150 opacity-0 group-hover:opacity-100`}
      {...rest}
    >
      {children}
    </button>
  );

  // Botón para acciones en el modal
  const ModalButton = ({
    children,
    color = "gray",
    ...props
  }) => (
    <button
      {...props}
      className={`flex items-center gap-2 px-5 py-2 rounded-lg shadow font-medium transition
        ${color === "red"
          ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500"}
        focus:outline-none focus:ring-2 focus:ring-offset-2`}
    >
      {children}
    </button>
  );

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 mb-8 group bg-white">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start gap-x-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{form.title}</h2>
            {form.description && (
              <p className="mt-2 text-gray-600 text-base">{form.description}</p>
            )}
          </div>
          <div className="flex items-center gap-x-2">
            <ActionButton onClick={handleDelete} color="red" ariaLabel="Eliminar formulario">
              <TrashIcon className={`${iconBase} ${iconColors.delete}`} aria-hidden="true" />
            </ActionButton>
            <Link
              to={`/forms/edit?id=${form.id}`}
              aria-label="Editar formulario"
              className="group"
            >
              <ActionButton color="edit">
                <PencilSquareIcon className={`${iconBase} ${iconColors.edit}`} aria-hidden="true" />
              </ActionButton>
            </Link>
            <Link
              to={`/forms/responses?id=${form.id}`}
              aria-label="Respuestas"
              className="group"
            >
              <ActionButton color="responses">
                <ChatBubbleLeftEllipsisIcon className={`${iconBase} ${iconColors.responses}`} aria-hidden="true" />
              </ActionButton>
            </Link>
            {form.isPublic && (
              <>
                <ActionButton onClick={handleCopyLink} color="copy" ariaLabel="Copiar link público">
                  <svg className={`${iconBase} ${iconColors.copy}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17a4 4 0 01-4-4V7a4 4 0 014-4h8a4 4 0 014 4v6a4 4 0 01-4 4m-8 0a4 4 0 004 4m0-4a4 4 0 01-4-4" />
                  </svg>
                </ActionButton>
                {copied && (
                  <span className="ml-2 text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded animate-fade-in shadow transition">
                    ¡Enlace copiado!
                  </span>
                )}
              </>
            )}
            <span className={`px-3 py-1 text-xs font-semibold rounded shadow-sm ${form.isPublic
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
              }`}>
              {form.isPublic ? 'Público' : 'Privado'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-5">
        <button
          type="button"
          onClick={handleToggleQuestions}
          className="flex items-center gap-2 font-semibold text-gray-700 mb-4 focus:outline-none hover:underline focus:ring-2 focus:ring-indigo-300"
          aria-expanded={questionsExpanded}
          aria-controls={`questions-list-${form.id}`}
        >
          {questionsExpanded ? (
            <svg className="w-5 h-5 text-indigo-500 transition-transform duration-200 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-indigo-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          Preguntas <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-xs">{form.questions.length}</span>
        </button>
        <div
          id={`questions-list-${form.id}`}
          className={`space-y-3 transition-all duration-300 ${questionsExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
        >
          {form.questions
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((question) => (
              <div key={question.id} className="bg-white border rounded-md p-3 shadow-sm hover:shadow transition">
                <QuestionView question={question} />
              </div>
            ))}
        </div>
      </div>

      {/* Diálogo de confirmación */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-all duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Confirmar eliminación
              </h3>
              <ActionButton onClick={cancelDelete} color="default" ariaLabel="Cerrar diálogo">
                <svg className="h-6 w-6 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </ActionButton>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de eliminar el formulario <strong className="text-red-600">"{form.title}"</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <ModalButton onClick={cancelDelete}>
                Cancelar
              </ModalButton>
              <ModalButton color="red" onClick={confirmDelete} disabled={loading}>
                <TrashIcon className="w-5 h-5" aria-hidden="true"/>
                Eliminar
              </ModalButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormCard;