import axios from 'axios';
import { CustomError } from '../utils/custom-error';
import { AuthStore } from '../store/index';

const API_BASE_URL = "https://api.jac-box.com/questionask";

//const API_BASE_URL = "http://localhost:8080/questionask";

// Mejor manejo de error, con fallback seguro y detalles para debugging
const buildAndThrowNewError = (error) => {
    console.error("[API ERROR]", error);
    if (error && error.response) {
        if ([401, 403].includes(error.response.status)) {
            AuthStore.logout();
        }
        console.error("[API ERROR DATA]", error.response.data);
        console.error("[API ERROR STATUS]", error.response.status);
        console.error("[API ERROR HEADERS]", error.response.headers);
        return new CustomError(
            error.response.data?.message || "Error inesperado.",
            error.response.data?.code || error.response.status,
            error.response.status,
            error
        );
    } else if (error.code === 'ERR_NETWORK') {
        return new CustomError(
            "¡Lo sentimos! Error de red. Por favor, verifica tu conexión.",
            error.code,
            500,
            error
        );
    }
    return new CustomError(
        "¡Lo sentimos! Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.",
        error.code || "unknown",
        500,
        error
    );
};

// Controla cancelación de requests duplicados
const pendingRequests = new Map();

export const axiosInstance = (API_BASE = null) => {
    const baseURL = API_BASE || API_BASE_URL;
    const instance = axios.create({
        baseURL,
        timeout: 15000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    // Request Interceptor
    instance.interceptors.request.use(config => {
        // Identifier único por url+method+params+data
        const reqParams = JSON.stringify(config.params || {});
        const reqData = JSON.stringify(config.data || {});
        const requestIdentifier = `${config.url}_${config.method}_${reqParams}_${reqData}`;

        // Cancelar request previa igual
        if (pendingRequests.has(requestIdentifier)) {
            const cancelTokenSource = pendingRequests.get(requestIdentifier);
            cancelTokenSource.cancel('Cancelled due to new request');
        }

        // Token de autenticación
        const token = AuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Agregar cancel token
        const cancelTokenSource = axios.CancelToken.source();
        config.cancelToken = cancelTokenSource.token;
        pendingRequests.set(requestIdentifier, cancelTokenSource);

        return config;
    }, error => Promise.reject(buildAndThrowNewError(error)));

    // Response Interceptor
    instance.interceptors.response.use(response => {
        // Limpiar request completada
        const reqParams = JSON.stringify(response.config.params || {});
        const reqData = JSON.stringify(response.config.data || {});
        const requestIdentifier = `${response.config.url}_${response.config.method}_${reqParams}_${reqData}`;
        pendingRequests.delete(requestIdentifier);
        return response;
    }, error => {
        if (error.config) {
            const reqParams = JSON.stringify(error.config.params || {});
            const reqData = JSON.stringify(error.config.data || {});
            const requestIdentifier = `${error.config.url}_${error.config.method}_${reqParams}_${reqData}`;
            pendingRequests.delete(requestIdentifier);
        }
        return Promise.reject(buildAndThrowNewError(error));
    });

    return instance;
};