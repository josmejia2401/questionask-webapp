import React, { useState } from 'react';
import PropTypes from 'prop-types';

const StarRating = ({ name, label, value, onChange, required }) => {
    const [error, setError] = useState('');

    const handleClick = (rating) => {
        if (required && rating === 0) {
            setError(`${label} es obligatorio`);
        } else {
            setError('');
        }
        onChange(rating);
    };

    const validateOnBlur = () => {
        if (required && !value) {
            setError(`${label} es obligatorio`);
        }
    };

    return (
        <div className="mb-4">
            <label className="block font-semibold mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="flex space-x-1" onBlur={validateOnBlur}>
                {[1, 2, 3, 4, 5].map(n => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => handleClick(n)}
                        className={`text-xl focus:outline-none ${value >= n ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                        ★
                    </button>
                ))}
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

StarRating.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number,
    required: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};

export default StarRating;
