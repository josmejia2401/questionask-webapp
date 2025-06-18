import { axiosInstance } from '../../../services/fetch';


export const requestResetPassword = async (payload) => {
    try {
        const res = await axiosInstance("https://questionask-auth-ms.onrender.com").post(`/v1/api/auth/request-password-reset`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}


export const resetPassword = async (payload) => {
    try {
        const res = await axiosInstance("https://questionask-auth-ms.onrender.com").post(`/v1/api/auth/reset-password`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}