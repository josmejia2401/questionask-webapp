import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente personalizado para un checkbox con validación interna.
 */
class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };
    }

    validar = (checked) => {
        const { required, label } = this.props;

        if (required && !checked) {
            return `${label} es obligatorio`;
        }

        return '';
    };

    handleChange = (event) => {
        const { checked } = event.target;
        const error = this.validar(checked);
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
            checked,
            disabled,
            required,
            className
        } = this.props;

        const { error } = this.state;

        return (
            <div className="mb-4">
                <div className="flex items-center">
                    <input
                        id={id}
                        name={name}
                        type="checkbox"
                        checked={checked}
                        onChange={this.handleChange}
                        disabled={disabled}
                        className={`${className} h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 ${error ? 'border-red-500' : ''
                            }`}
                        required={required}
                    />
                    <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                </div>

                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
}

Checkbox.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool
};

export default Checkbox;
