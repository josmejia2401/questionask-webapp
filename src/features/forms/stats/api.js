import { axiosInstance } from '../../../services/fetch';


export const findStatsQuestion = async (id) => {
    try {
        const res = await axiosInstance("https://api.jac-box.com").get(`/questionask/api/v1/stats/questions/${id}/stats`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const findStatsForm = async (id) => {
    try {
        const res = await axiosInstance("https://api.jac-box.com").get(`/questionask/api/v1/stats/forms/${id}/stats`);
        return res.data;
    } catch (error) {
        throw error;
    }
}