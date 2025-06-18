import * as React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';
import { signIn } from './api';
import { buildPayloadFromForm, resetFormValues, stopPropagation } from '../../../utils/utils';
import TextInputField from '../../../components/form-builder/fields/text-input-field';
import PasswordInputField from '../../../components/form-builder/fields/password-input-field';
import Button from '../../../components/button';
import { validateFieldFromProps } from '../../../utils/validators';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isValidForm: false,
            errorMessage: null,
            successMessage: null,
            data: {
                username: { value: '', error: '' },
                password: { value: '', error: '' }
            }
        };
    }

    updateState = (payload) => {
        this.setState(prevState => ({ ...prevState, ...payload }), this.propagateState);
    };

    propagateState = () => { };

    handleInputChange = (event) => {
        stopPropagation(event);
        const { name, value } = event.target;
        const error = validateFieldFromProps(value, event.target);
        const updatedField = { value, error };
        const updatedData = { ...this.state.data, [name]: updatedField };
        const isValidForm = Object.values(updatedData).every(f => f.error.length === 0 && f.value.length > 0);
        this.updateState({ data: updatedData, isValidForm });
    };

    handleSubmit = (event) => {
        stopPropagation(event);
        event.preventDefault();
        const { data } = this.state;
        const isValidForm = Object.values(data).every(f => f.error.length === 0 && f.value.length > 0);

        if (!isValidForm) {
            this.updateState({
                errorMessage: "Por favor, completa todos los campos correctamente.",
                successMessage: null
            });
            return;
        }
        this.updateState({ loading: true, errorMessage: null, successMessage: null });

        signIn(buildPayloadFromForm(data))
            .then(response => {
                this.updateState({
                    successMessage: response.message || "¡Inicio de sesión exitoso!",
                    errorMessage: null,
                    data: resetFormValues(data)
                });
            })
            .catch(err => {
                this.updateState({
                    errorMessage: err.message || "¡Lo sentimos! Ocurrió un error al procesar tu solicitud. Intenta nuevamente.",
                    successMessage: null
                });
            })
            .finally(() => {
                this.updateState({ loading: false });
            });
    };

    render() {
        const { data, loading, errorMessage, successMessage, isValidForm } = this.state;

        return (
            <div className="w-full max-w-md mt-10 p-8 rounded-2xl shadow-lg bg-white">
                <h2 className="text-left text-3xl font-bold mb-3 text-slate-800">Iniciar sesión</h2>
                <p className="text-left text-sm mb-6 text-slate-600">
                    ¿No tienes cuenta?{' '}
                    <Link to="/auth/register" className="text-indigo-600 hover:underline font-medium">
                        Regístrate rápido y sin complicaciones.
                    </Link>
                </p>

                {errorMessage && (
                    <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded mb-4 text-center animate-shake">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded mb-4 text-center animate-fade-in">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={this.handleSubmit} noValidate>
                    <TextInputField
                        label="Usuario"
                        id="username"
                        name="username"
                        value={data.username.value}
                        onChange={this.handleInputChange}
                        error={data.username.error}
                        autoComplete="username"
                        disabled={loading}
                        required
                    />

                    <PasswordInputField
                        label="Contraseña"
                        id="password"
                        name="password"
                        value={data.password.value}
                        error={data.password.error}
                        onChange={this.handleInputChange}
                        autoComplete="current-password"
                        disabled={loading}
                        required
                    />

                    {/* Enlace de recuperación de contraseña alineado a la derecha */}
                    <div className="flex justify-end mt-1 mb-4">
                        <Link
                            to="/auth/request-recover-password"
                            className="text-sm text-indigo-600 hover:underline font-medium"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <Button
                        variant="primary"
                        type="submit"
                        loading={loading}
                        disabled={!isValidForm || loading}
                        fullWidth
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
            </div>
        );
    }
}
export default Page;