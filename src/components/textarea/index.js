import React from 'react';

class Textarea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            currentLength: (props.value || '').length
        };
    }

    limpiarRegex = (regexStr) => {
        return regexStr?.startsWith('/') && regexStr.endsWith('/')
            ? regexStr.slice(1, -1)
            : regexStr;
    };

    validarEntrada = (value) => {
        const {
            label,
            name,
            type,
            maxLength,
            minLength,
            max,
            min,
            pattern,
            required
        } = this.props;

        const errors = [];
        const trimmed = value?.toString().trim() ?? '';

        if (required && trimmed === '') {
            errors.push(`${label || name} es requerido`);
            return errors;
        }

        if (minLength !== undefined && trimmed.length < minLength) {
            errors.push(`${label || name} debe tener al menos ${minLength} caracteres`);
        }

        if (maxLength !== undefined && trimmed.length > maxLength) {
            errors.push(`${label || name} debe tener como máximo ${maxLength} caracteres`);
        }

        if (pattern) {
            const regex = new RegExp(this.limpiarRegex(pattern));
            if (!regex.test(trimmed)) {
                errors.push(`${label || name} no cumple con el formato requerido`);
            }
        }

        if (type === 'number') {
            const num = Number(trimmed);
            if (isNaN(num)) {
                errors.push(`${label || name} debe ser un número`);
            } else {
                if (min !== undefined && num < min) {
                    errors.push(`${label || name} debe ser mayor o igual a ${min}`);
                }
                if (max !== undefined && num > max) {
                    errors.push(`${label || name} debe ser menor o igual a ${max}`);
                }
            }
        }

        return errors;
    };

    onChange = (event) => {
        const value = event.target.value;
        const errors = this.validarEntrada(value);

        this.setState({
            errors,
            currentLength: value.length
        });

        if (this.props.onChange) {
            this.props.onChange(event, errors);
        }
    };

    render() {
        const {
            id,
            name,
            label,
            value,
            disabled,
            type = 'text',
            placeholder = '',
            maxLength,
            minLength,
            max,
            min,
            size,
            pattern,
            required,
            step,
            autoComplete
        } = this.props;

        const { errors, currentLength } = this.state;

        return (
            <div className="mb-4">
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    minLength={minLength}
                    max={max}
                    min={min}
                    size={size}
                    pattern={this.limpiarRegex(pattern)}
                    step={step}
                    required={required}
                    autoComplete={autoComplete}
                    onChange={this.onChange}
                    disabled={disabled}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.length > 0 ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {(maxLength !== undefined || errors.length > 0) && (
                    <div className="mt-1 flex justify-between text-xs">
                        {errors.length > 0 ? (
                            <span className="text-red-600">{errors[0]}</span>
                        ) : <span></span>}
                        {maxLength !== undefined && (
                            <span className="text-gray-500">{currentLength}/{maxLength} caracteres</span>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default Textarea;
