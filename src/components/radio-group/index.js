import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RadioGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            customInput: '', // para el campo libre
            selectedValue: props.value || '',
        };
    }

    handleChange = (event) => {
        const selectedValue = event.target.value;
        const error = this.validar(selectedValue);

        this.setState({ selectedValue, error }, () => {
            const isOther = this.esOpcionOtra(selectedValue);
            if (!isOther) {
                this.setState({ customInput: '' }); // limpiar si no es "otro"
                this.props.onChange?.(selectedValue);
            }
        });
    };

    handleCustomInputChange = (event) => {
        const customInput = event.target.value;
        this.setState({ customInput });
        this.props.onChange?.(customInput);
    };

    validar = (value) => {
        const { required, label } = this.props;
        if (required && !value) {
            return `${label} es obligatorio`;
        }
        return '';
    };

    esOpcionOtra = (text) => {
        return ['otro', 'otra', 'otro/a', 'otra opción'].includes(text.trim().toLowerCase());
    };

    render() {
        const { options, name, label, required, disabled } = this.props;
        const { error, customInput, selectedValue } = this.state;

        const mostrarInputLibre = this.esOpcionOtra(selectedValue);

        return (
            <div className="mb-4">
                <label className="block font-semibold mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                <div className="space-y-2">
                    {options.map(opt => (
                        <label key={opt.id} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name={name}
                                value={opt.text}
                                checked={selectedValue === opt.text}
                                onChange={this.handleChange}
                                disabled={disabled}
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            />
                            <span>{opt.text}</span>
                        </label>
                    ))}
                </div>

                {mostrarInputLibre && (
                    <input
                        type="text"
                        value={customInput}
                        onChange={this.handleCustomInputChange}
                        placeholder="Escribe tu respuesta"
                        className="mt-3 w-full border rounded px-3 py-2"
                    />
                )}

                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
}

RadioGroup.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
        })
    ).isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};

export default RadioGroup;
