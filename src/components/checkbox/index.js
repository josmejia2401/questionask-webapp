import React from 'react';
import PropTypes from 'prop-types';

function Checkbox({ id, name, label, checked, onChange, disabled }) {
    return (
        <div className="flex items-center mb-2">
            <input
                id={id}
                name={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
                {label}
            </label>
        </div>
    );
}

Checkbox.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

export default Checkbox;
