import { axiosInstance } from '../../../services/fetch';

export const findById = async (id) => {
    try {
        const res = await axiosInstance().get(`/api/v1/viewer/responses/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}