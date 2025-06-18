import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { resetPassword } from "./api";

const ResetPasswordPage = () => {
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!token.trim() || !password.trim() || !repeatPassword.trim()) {
            setError("Todos los campos son obligatorios.");
            return;
        }
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        if (password !== repeatPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        try {
            const response = await resetPassword({
                token: token,
                newPassword: repeatPassword
            });

            setSuccess(response.message || "Código enviado con éxito.");
            setToken("");
            setPassword("");
            setRepeatPassword("");

            setTimeout(() => {
                navigate('/auth/login');
            }, 3000);
        } catch (err) {
            console.error(err);
            setError("Ocurrió un error inesperado. Intenta más tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">Restablecer contraseña</h2>
                <p className="text-sm text-slate-600 mb-6 text-center">
                    Ingresa el código que recibiste y tu nueva contraseña.
                </p>

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded mb-4 text-center">{error}</div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded mb-4 text-center">{success}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="token" className="block text-sm font-medium text-slate-700 mb-1">
                            Código / Token
                        </label>
                        <input
                            type="text"
                            id="token"
                            name="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                            Nueva contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="repeatPassword" className="block text-sm font-medium text-slate-700 mb-1">
                            Repetir nueva contraseña
                        </label>
                        <input
                            type="password"
                            id="repeatPassword"
                            name="repeatPassword"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={loading}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Restableciendo..." : "Restablecer contraseña"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;