import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RadioGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };
    }

    handleChange = (event) => {
        const { onChange } = this.props;
        const selectedValue = event.target.value;
        const error = this.validar(selectedValue);
        this.setState({ error });

        if (onChange) {
            onChange(selectedValue);
        }
    };

    validar = (value) => {
        const { required, label } = this.props;
        if (required && !value) {
            return `${label} es obligatorio`;
        }
        return '';
    };

    render() {
        const { options, name, label, value, required, disabled } = this.props;
        const { error } = this.state;

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
                                value={opt.id}
                                checked={value === opt.id}
                                onChange={this.handleChange}
                                disabled={disabled}
                                className={`h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500`}
                            />
                            <span>{opt.text}</span>
                        </label>
                    ))}
                </div>

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
