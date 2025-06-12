import React, { useState, useEffect } from 'react';

const InputTitle = ({
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
  maxLength,
  pattern,
  name,
  label,
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [currentLength, setCurrentLength] = useState((value || '').length);

  const validate = (val) => {
    const trimmed = val?.toString().trim() ?? '';

    if (required && trimmed === '') {
      return 'Este campo es requerido';
    }

    if (minLength && trimmed.length < minLength) {
      return `Debe tener al menos ${minLength} caracteres`;
    }

    if (maxLength && trimmed.length > maxLength) {
      return `Debe tener como máximo ${maxLength} caracteres`;
    }

    if (pattern) {
      const regex = new RegExp(
        pattern.startsWith('/') && pattern.endsWith('/')
          ? pattern.slice(1, -1)
          : pattern
      );
      if (!regex.test(trimmed)) {
        return 'Formato inválido';
      }
    }

    return '';
  };

  useEffect(() => {
    if (touched) {
      setError(validate(value));
    }
    setCurrentLength((value || '').length);
  }, [value]);

  const handleChange = (e) => {
    onChange(e);
    if (!touched) setTouched(true);
    const val = e.target.value;
    setCurrentLength(val.length);
    setError(validate(val));
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type="text"
        placeholder={placeholder}
        value={value || ''}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        name={name}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        className={`text-xl font-semibold text-gray-800 w-full border-b focus:outline-none focus:border-indigo-500 ${
          error ? 'border-red-500' : ''
        }`}
      />

      <div className="mt-1 flex justify-between text-xs">
        <span className="text-red-600">{error}</span>
        {maxLength !== undefined && (
          <span className="text-gray-500">
            {currentLength}/{maxLength} caracteres
          </span>
        )}
      </div>
    </div>
  );
};

export default InputTitle;
