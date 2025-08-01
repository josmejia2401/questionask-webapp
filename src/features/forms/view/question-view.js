import React, { useState } from 'react';

const QuestionView = ({ question }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Base card styles
  const baseStyles =
    "p-5 rounded-xl shadow group border-l-8 mb-4 cursor-pointer transition-all duration-300 hover:shadow-lg";

  // Colors by type: pastel, border, hover
  const typeStyles = {
    multiple: "bg-blue-50 border-blue-400 hover:bg-blue-100",
    long: "bg-green-50 border-green-400 hover:bg-green-100",
    short: "bg-purple-50 border-purple-400 hover:bg-purple-100",
    single: "bg-yellow-50 border-yellow-400 hover:bg-yellow-100",
    checkbox: "bg-pink-50 border-pink-400 hover:bg-pink-100",
    rating: "bg-orange-50 border-orange-400 hover:bg-orange-100",
    date: "bg-indigo-50 border-indigo-400 hover:bg-indigo-100",
    time: "bg-teal-50 border-teal-400 hover:bg-teal-100",
    default: "bg-gray-50 border-gray-400 hover:bg-gray-100"
  };

  // Icons by type, more visible and consistent size
  const typeIcons = {
    multiple: (
      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    long: (
      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    ),
    short: (
      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9M12 4h9M4 4h.01M4 20h.01M4 12h16" />
      </svg>
    ),
    single: (
      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    checkbox: (
      <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3L22 4M5 13l4 4L22 4" />
      </svg>
    ),
    rating: (
      <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.192 3.674a1 1 0 00.95.69h3.862c.969 0 1.371 1.24.588 1.81l-3.124 2.27a1 1 0 00-.364 1.118l1.192 3.674c.3.921-.755 1.688-1.54 1.118l-3.124-2.27a1 1 0 00-1.175 0l-3.124 2.27c-.785.57-1.84-.197-1.54-1.118l1.192-3.674a1 1 0 00-.364-1.118L2.405 9.1c-.783-.57-.38-1.81.588-1.81h3.862a1 1 0 00.95-.69l1.192-3.674z" />
      </svg>
    ),
    date: (
      <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    time: (
      <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
    ),
    default: (
      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <div
      className={`${baseStyles} ${typeStyles[question.type] || typeStyles.default}`}
      onClick={() => setIsCollapsed(!isCollapsed)}
      tabIndex={0}
      role="button"
      aria-expanded={!isCollapsed}
      aria-label={`Pregunta: ${question.questionText}`}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">
          {typeIcons[question.type] || typeIcons.default}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900 text-lg leading-snug">
              {question.questionText}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-full shadow">
                Orden: {question.order}
              </span>
              {question.required && (
                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-semibold border border-red-200 shadow">
                  Requerido
                </span>
              )}
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              isCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
            }`}
          >
            {!isCollapsed && (
              <div className="mt-4 animate-fadeIn">
                {question.type === 'short' && (
                  <input
                    type="text"
                    className="w-full border border-purple-200 bg-purple-50 rounded px-3 py-2 text-sm focus:outline-none"
                    placeholder="Respuesta corta..."
                    disabled
                  />
                )}
                {question.type === 'long' && (
                  <textarea
                    className="w-full h-20 border border-green-200 bg-green-50 rounded px-3 py-2 text-sm resize-none focus:outline-none"
                    placeholder="Respuesta larga..."
                    disabled
                  />
                )}
                {(question.type === 'radio' || question.type === 'checkbox') && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Opciones:</h4>
                    <ul className="space-y-2">
                      {question.options.map((option) => (
                        <li key={option.id} className="flex items-start">
                          <span className="bg-white p-2 rounded-md shadow border border-gray-100 flex-1 text-gray-800">
                            {option.text}
                            {option.images?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {option.images.map((image) => (
                                  <img
                                    key={image.id}
                                    src={image.imagePath}
                                    alt="Opción"
                                    className="h-16 w-16 object-cover rounded border border-gray-200"
                                  />
                                ))}
                              </div>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {question.type === 'rating' && (
                  <div className="bg-white p-3 rounded-md shadow border border-yellow-200 flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-7 h-7 fill-current text-yellow-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.192 3.674a1 1 0 00.95.69h3.862c.969 0 1.371 1.24.588 1.81l-3.124 2.27a1 1 0 00-.364 1.118l1.192 3.674c.3.921-.755 1.688-1.54 1.118l-3.124-2.27a1 1 0 00-1.175 0l-3.124 2.27c-.785.57-1.84-.197-1.54-1.118l1.192-3.674a1 1 0 00-.364-1.118L2.405 9.1c-.783-.57-.38-1.81.588-1.81h3.862a1 1 0 00.95-.69l1.192-3.674z" />
                      </svg>
                    ))}
                  </div>
                )}
                {question.type === 'date' && (
                  <input
                    type="date"
                    className="w-full border border-indigo-200 bg-indigo-50 rounded px-3 py-2 text-sm focus:outline-none"
                    placeholder="Fecha"
                    disabled
                  />
                )}
                {question.type === 'time' && (
                  <input
                    type="time"
                    className="w-full border border-teal-200 bg-teal-50 rounded px-3 py-2 text-sm focus:outline-none"
                    placeholder="Hora"
                    disabled
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-2">
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionView;