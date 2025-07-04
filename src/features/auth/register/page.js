import * as React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { register } from './api';
import { buildPayloadFromForm, resetFormValues, stopPropagation } from '../../../utils/utils';
import TextInputField from '../../../components/form-builder/fields/text-input-field';
import PasswordInputField from '../../../components/form-builder/fields/password-input-field';
import EmailInputField from '../../../components/form-builder/fields/email-input-field';
import Button from '../../../components/button';
import { validateFieldFromProps } from '../../../utils/validators';

function withNavigation(Component) {
    return function WrappedComponent(props) {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isValidForm: false,
            errorMessage: null,
            successMessage: null,
            termsAccepted: false,
            termsError: '',
            redirectMessage: null,
            redirectCountdown: 4,
            showRedirect: false,
            data: {
                firstName: { value: '', error: '' },
                lastName: { value: '', error: '' },
                email: { value: '', error: '' },
                phoneNumber: { value: '', error: '' },
                username: { value: '', error: '' },
                password: { value: '', error: '' }
            }
        };

        this.startRedirectCountdown = this.startRedirectCountdown.bind(this);
    }

    componentWillUnmount() {
        if (this.redirectInterval) clearInterval(this.redirectInterval);
    }

    propagateState = async () => { }

    updateState = (payload) => {
        this.setState(prevState => ({
            ...prevState,
            ...payload
        }), this.propagateState);
    }

    handleInputChange = (event) => {
        stopPropagation(event);
        const { name, value } = event.target;
        const input = event.target;
        const error = validateFieldFromProps(value, input);

        const updatedField = { value, error };
        const updatedData = {
            ...this.state.data,
            [name]: updatedField,
        };

        // Valid if all fields have no error AND have some value
        const isValidForm = Object.values(updatedData).every((f) => f.error.length === 0 && f.value.length > 0);

        this.updateState({ data: updatedData, isValidForm });
    };

    handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        this.setState({
            termsAccepted: isChecked,
            termsError: isChecked ? '' : 'Debes aceptar los Términos y Condiciones para registrarte.'
        });
    };

    handleSubmit = (event) => {
        stopPropagation(event);
        event.preventDefault();
        const { data, termsAccepted } = this.state;
        const isValidForm = Object.values(data).every((f) => f.error.length === 0 && f.value.length > 0);

        if (!termsAccepted) {
            this.setState({
                termsError: 'Debes aceptar los Términos y Condiciones para registrarte.',
                loading: false
            });
            return;
        }

        if (!isValidForm) {
            this.setState({
                errorMessage: "Por favor, completa todos los campos correctamente.",
                successMessage: null
            });
            return;
        }

        this.updateState({
            isValidForm,
            loading: true,
            successMessage: null,
            errorMessage: null
        });

        const payload = buildPayloadFromForm(data);
        payload.createdAt = new Date().toISOString();
        payload.statusId = "PENDING";

        register(payload)
            .then(response => {
                this.updateState({
                    successMessage: response.message || "¡Registro exitoso! Revisa tu correo para activar tu cuenta.",
                    errorMessage: null,
                    data: resetFormValues(data),
                    termsAccepted: false,
                    showRedirect: false,
                    redirectCountdown: 4,
                    redirectMessage: null
                });

                setTimeout(() => {
                    this.setState({ showRedirect: true });
                    this.startRedirectCountdown();
                }, 1000);
            })
            .catch(err => {
                this.updateState({
                    errorMessage: err.message || "¡Lo sentimos! Ocurrió un error al procesar tu registro. Intenta nuevamente.",
                    successMessage: null
                });
            })
            .finally(() => {
                this.updateState({ loading: false });
            });
    }

    startRedirectCountdown = () => {
        this.redirectInterval = setInterval(() => {
            if (this.state.redirectCountdown <= 1) {
                clearInterval(this.redirectInterval);
                // Redirige al login
                this.props.navigate("/auth/login");
            } else {
                this.setState(prev => ({
                    redirectCountdown: prev.redirectCountdown - 1,
                    redirectMessage: `Serás redirigido al inicio de sesión en ${prev.redirectCountdown - 1} segundos...`
                }));
            }
        }, 1000);
    };

    render() {
        const { data, loading, errorMessage, successMessage, isValidForm, termsAccepted, termsError, showRedirect, redirectMessage } = this.state;

        return (
            <div className="w-full max-w-md mt-10 p-8 rounded-2xl shadow-lg bg-white">
                <h2 className="text-left text-3xl font-bold mb-3 text-slate-800">Registro</h2>

                <p className="text-left text-sm mb-6 text-slate-600">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/auth/login" className="text-indigo-600 hover:underline font-medium">
                        Inicia sesión.
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

                {showRedirect && (
                    <div className="bg-blue-50 border border-blue-300 text-blue-700 p-2 rounded mb-4 text-center animate-fade-in">
                        {redirectMessage || `Serás redirigido al inicio de sesión en ${this.state.redirectCountdown} segundos...`}
                        <br />
                        <Link to="/auth/logon" className="text-indigo-600 underline">Ir al inicio de sesión ahora</Link>
                    </div>
                )}

                <form
                    onSubmit={this.handleSubmit}
                    noValidate
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2"
                >
                    <div className="sm:col-span-2">
                        <TextInputField
                            label="Nombres"
                            id="firstName"
                            name="firstName"
                            value={data.firstName.value}
                            onChange={this.handleInputChange}
                            error={data.firstName.error}
                            autoComplete="given-name"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <TextInputField
                            label="Apellidos"
                            id="lastName"
                            name="lastName"
                            value={data.lastName.value}
                            onChange={this.handleInputChange}
                            error={data.lastName.error}
                            autoComplete="family-name"
                            disabled={loading}
                            required
                        />
                    </div>

                    <EmailInputField
                        label="Correo"
                        id="email"
                        name="email"
                        value={data.email.value}
                        onChange={this.handleInputChange}
                        error={data.email.error}
                        autoComplete="email"
                        disabled={loading}
                        required
                    />

                    <TextInputField
                        label="Celular"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={data.phoneNumber.value}
                        onChange={this.handleInputChange}
                        error={data.phoneNumber.error}
                        autoComplete="tel"
                        disabled={loading}
                        required
                    />

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
                        onChange={this.handleInputChange}
                        error={data.password.error}
                        autoComplete="new-password"
                        disabled={loading}
                        required
                    />

                    {/* Checkbox de términos y privacidad */}
                    <div className="sm:col-span-2 mt-2">
                        <label className="flex items-start gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                className="mt-1"
                                checked={termsAccepted}
                                onChange={this.handleCheckboxChange}
                                disabled={loading}
                            />
                            <span>
                                Acepto los{' '}
                                <Link to="/terms" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                    Términos y Condiciones
                                </Link>{' '}y la{' '}
                                <Link to="/privacy" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                    Política de Privacidad
                                </Link>.
                            </span>
                        </label>
                        {termsError && (
                            <p className="text-red-500 text-sm mt-1">{termsError}</p>
                        )}
                    </div>


                    <div className="sm:col-span-2 mt-3">
                        <Button
                            variant="primary"
                            type="submit"
                            loading={loading}
                            disabled={!isValidForm || !termsAccepted || loading}
                            fullWidth
                        >
                            {loading ? "Registrando..." : "Crear"}
                        </Button>
                    </div>
                </form>
            </div>
        );
    }
}

export default withNavigation(Page);