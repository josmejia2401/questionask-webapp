import React from 'react';
import './styles.css';

class Component extends React.Component {
  render() {
    const {
      className = '',
      type = 'button',
      disabled = false,
      loading = false,
      textLoading = 'Procesando...',
      showText = false,
      text = '',
      ...props
    } = this.props;

    return (
      <button
        className={`btn btn-primary ${className}`}
        type={type}
        disabled={disabled || loading} // Deshabilitar el botón si está cargando
        {...props}
      >
        {loading ? (
          <div>
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
            <span
              className={`${showText ? 'visually-hidden' : ''}`}
              role="status"
              style={{ marginLeft: '5px' }}
            >
              {textLoading}
            </span>
          </div>
        ) : (
          <div>
            <i className="bx bx-check d-block d-sm-none"></i>
            <span className="d-sm-block">{text}</span>
          </div>
        )}
      </button>
    );
  }
}

export default Component;
