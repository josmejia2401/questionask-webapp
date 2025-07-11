import { axiosInstance } from '../../../services/fetch';


export const findStatsUser = async (id) => {
    try {
        const res = await axiosInstance("http://51.161.9.193:80").get(`/questionask/api/v1/stats/users/${id}/stats`);
        return res.data;
    } catch (error) {
        throw error;
    }
}