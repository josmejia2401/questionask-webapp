import { axiosInstance } from '../../../services/fetch';


export const findStatsQuestion = async (id) => {
    try {
        const res = await axiosInstance("http://51.161.9.193:80").get(`/questionask/api/v1/stats/questions/${id}/stats`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const findStatsForm = async (id) => {
    try {
        const res = await axiosInstance("http://51.161.9.193:80").get(`/questionask/api/v1/stats/forms/${id}/stats`);
        return res.data;
    } catch (error) {
        throw error;
    }
}