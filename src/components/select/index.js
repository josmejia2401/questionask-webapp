import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente personalizado para un select con validación interna.
 */
class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };
    }

    validar = (value) => {
        const { required, label } = this.props;

        if (required && (!value || value === '')) {
            return `${label} es requerido`;
        }

        return '';
    };

    handleChange = (event) => {
        const { value } = event.target;
        const error = this.validar(value);
        this.setState({ error });

        if (this.props.onChange) {
            this.props.onChange(event, error);
        }
    };

    render() {
        const {
            id,
            name,
            label,
            value,
            options,
            disabled,
            required
        } = this.props;

        const { error } = this.state;

        return (
            <div className="mb-4">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={this.handleChange}
                    disabled={disabled}
                    className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    required={required}
                    autoComplete="off"
                >
                    <option value="">Seleccionar...</option>
                    {options && options.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                {(error || (options && options.length > 0)) && (
                    <div className="mt-1 flex justify-between text-sm">
                        <span className="text-red-600">{error}</span>
                        {options && options.length > 0 && (
                            <span className="text-gray-500">{options.length} opciones</span>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

Select.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool
};

export default Select;
