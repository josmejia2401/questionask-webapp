import { axiosInstance } from '../../../services/fetch';


export const findStatsForm = async (formId) => {
    try {
        const res = await axiosInstance().get(`/api/v1/stats/forms/${formId}/stats`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

// Estadísticas de pregunta
export const findStatsQuestion = async (questionId) => {
    try {
        const res = await axiosInstance().get(`/api/v1/stats/questions/${questionId}/stats`);
        return res.data;
    } catch (error) {
        throw error;
    }
}