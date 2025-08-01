import React from 'react';
import './styles.css';

/**
 * Botón reutilizable con icono dinámico, loading spinner y variantes.
 *
 * Props:
 * - type: 'button' | 'submit' | 'reset'
 * - variant: 'primary' | 'secondary' | 'tertiary'
 * - disabled: boolean
 * - loading: boolean
 * - size: 'sm' | 'md' | 'lg'
 * - fullWidth: boolean
 * - icon: string (clase de icono) | ReactNode (elemento)
 * - iconClassName: string (clases extra para el icono)
 * - text: string (label del botón, alternativo a children)
 * - textLoading: string (texto durante loading)
 * - showText: boolean (mostrar texto durante loading)
 * - className: string (clases extra)
 * - children: contenido extra
 */
function Button({
    children,
    text = '',
    type = 'button',
    variant = 'primary',
    disabled = false,
    loading = false,
    size = 'md',
    className = '',
    fullWidth = false,
    icon,                // NUEVO: clase del icono (ej: "bx bx-plus") o componente React
    iconClassName = '',  // NUEVO: clases extra para el <i>
    textLoading = 'Procesando...',
    showText = false,
    ...props
}) {
    const isDisabled = disabled || loading;

    const baseStyle =
        'inline-flex items-center justify-center font-medium rounded focus:outline-none transition gap-2';

    const variantStyles = {
        primary: 'bg-indigo-700 text-white hover:bg-indigo-800',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        tertiary: 'bg-transparent text-blue-600 hover:underline',
    };

    const sizeStyles = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-5 py-3 text-lg',
    };

    const widthStyle = fullWidth ? 'w-full' : 'w-auto';
    const disabledStyle = 'opacity-50 cursor-not-allowed';

    const combinedStyles = [
        baseStyle,
        variantStyles[variant],
        sizeStyles[size],
        widthStyle,
        isDisabled ? disabledStyle : '',
        className,
    ].join(' ');

    return (
        <button
            type={type}
            className={combinedStyles}
            disabled={isDisabled}
            {...props}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        />
                    </svg>
                    {showText && (
                        <span role="status">{textLoading}</span>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    {icon &&
                        (typeof icon === 'string' ? (
                            <i className={`${icon} ${iconClassName}`} aria-hidden="true"></i>
                        ) : (
                            icon
                        ))
                    }
                    <span>
                        {children || text}
                    </span>
                </div>
            )}
        </button>
    );
}

export default Button;