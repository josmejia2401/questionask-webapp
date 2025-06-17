import { axiosInstance } from '../../../services/fetch';


export const findStatsQuestion = async (id) => {
    try {
        const res = await axiosInstance("https://questionask-stats-ms.onrender.com").get(`/v1/api/stats/questions/${id}/stats`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const findStatsForm = async (id) => {
    try {
        const res = await axiosInstance("https://questionask-stats-ms.onrender.com").get(`/v1/api/stats/forms/${id}/stats`);
        return res.data;
    } catch (error) {
        throw error;
    }
}