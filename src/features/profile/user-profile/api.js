import { axiosInstance } from '../../../services/fetch';
export const findById = async (id) => {
    try {
        const res = await axiosInstance("http://51.161.9.193:80").get(`/questionask/api/v1/users/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}


export const updateById = async (id, payload) => {
    try {
        const res = await axiosInstance("http://51.161.9.193:80").put(`/questionask/api/v1/users/${id}`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}