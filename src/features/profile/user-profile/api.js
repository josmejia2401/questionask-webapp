import { axiosInstance } from '../../../services/fetch';
export const findById = async (id) => {
    try {
        const res = await axiosInstance("https://questionask-users-ms.onrender.com").get(`/v1/api/users/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}


export const updateById = async (id, payload) => {
    try {
        const res = await axiosInstance("https://questionask-users-ms.onrender.com").put(`/v1/api/users/${id}`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}