import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../checkbox';

class CheckboxGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };
    }

    handleChange = (event) => {
        const { name, checked } = event.target;
        const { onChange, options = [], selected = [] } = this.props;
        let updatedSelection = options.map(p => p.text);
        if (checked) {
            if (!selected.includes(name)) {
                selected.push(name);
                updatedSelection = selected;
            }
        } else {
            updatedSelection = selected.filter(v => v !== name);
        }
        const error = this.validar(updatedSelection);
        this.setState({ error });
        if (onChange) {
            onChange(updatedSelection);
        }
    };

    validar = (selectedList) => {
        const { required, label } = this.props;
        if (required && selectedList.length === 0) {
            return `${label} es obligatorio`;
        }
        return '';
    };

    render() {
        const { options, name, label, selected = [], required, disabled } = this.props;
        const { error } = this.state;

        return (
            <div className="mb-4">
                <label className="block font-semibold mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                <div className="space-y-1">
                    {options.map(opt => (
                        <Checkbox
                            key={opt.id}
                            id={`${name}-${opt.id}`}
                            name={opt.text}
                            label={opt.text}
                            value={opt.text}
                            checked={selected.includes(opt.text)}
                            onChange={this.handleChange}
                            disabled={disabled}
                        />
                    ))}
                </div>

                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
}

CheckboxGroup.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
        })
    ).isRequired,
    selected: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};

export default CheckboxGroup;
