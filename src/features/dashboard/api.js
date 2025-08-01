import { axiosInstance } from '../../services/fetch';

// Dashboard principal del usuario
export const findUserDashboard = async (userId) => {
    try {
        const res = await axiosInstance().get(`/api/v1/stats/users/${userId}/dashboard`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

// Estadísticas generales del usuario (perfil)
export const findStatsUser = async (userId) => {
    try {
        const res = await axiosInstance().get(`/api/v1/stats/users/${userId}/stats`);
        return res.data;
    } catch (error) {
        throw error;
    } 
}