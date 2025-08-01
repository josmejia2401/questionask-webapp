import { axiosInstance } from '../../../services/fetch';

export const findAll = async () => {
    try {
        const res = await axiosInstance().get(`/api/v1/forms`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const deleteById = async (id) => {
    try {
        const res = await axiosInstance().delete(`/api/v1/forms/${id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const updateById = async (id, payload) => {
    try {
        const res = await axiosInstance().put(`/api/v1/forms/${id}`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}
