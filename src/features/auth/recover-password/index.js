import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestResetPassword } from "./api";

const RecoverPasswordPage = () => {
    const [identifier, setIdentifier] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setIdentifier(e.target.value);
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!identifier.trim()) {
            setError("Por favor, ingresa tu correo electrónico o nombre de usuario.");
            return;
        }

        setLoading(true);
        try {
            const response = await requestResetPassword({
                usernameOrEmail: identifier
            });

            setSuccess(response.message || "Código enviado con éxito.");

            setTimeout(() => {
                navigate("/auth/reset-password", {
                    state: { emailOrUsername: identifier }
                });
            }, 1500);

        } catch (err) {
            console.error(err);
            setError("Ha ocurrido un error. Intenta más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const hideError = () => {
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">Recuperar contraseña</h2>
                <p className="text-sm text-slate-600 mb-6 text-center">
                    Ingresa tu correo electrónico o nombre de usuario y te enviaremos instrucciones para restablecer tu contraseña.
                </p>

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded mb-4 text-center">
                        {error}
                        <button onClick={hideError} className="ml-2 underline">Ocultar</button>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded mb-4 text-center">
                        {success}
                    </div>
                )}
                {success && (
                    <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-3 rounded mb-4 text-center">
                        Si no recibes el correo en unos minutos, revisa también tu bandeja de <span className="font-semibold">spam</span> o <span className="font-semibold">correo no deseado</span>.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 mb-1">
                            Correo electrónico o usuario
                        </label>
                        <input
                            type="text"
                            id="identifier"
                            name="identifier"
                            value={identifier}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoComplete="username"
                            disabled={loading}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50`}
                        disabled={loading || !identifier.trim()}
                    >
                        {loading ? "Enviando..." : "Enviar instrucciones"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RecoverPasswordPage;
