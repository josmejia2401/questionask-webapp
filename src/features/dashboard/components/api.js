import { axiosInstance } from '../../../services/fetch';


export const findStatsUser = async (id) => {
    try {
        const res = await axiosInstance("https://questionask-stats-ms.onrender.com").get(`/v1/api/stats/users/${id}/stats`);
        return res.data;
    } catch (error) {
        throw error;
    }
}