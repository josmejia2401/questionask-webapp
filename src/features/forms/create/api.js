import { axiosInstance } from '../../../services/fetch';


export const create = async (payload) => {
    try {
        const res = await axiosInstance("https://questionask-form-ms.onrender.com").post(`/v1/api/forms`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const updateById = async (id, payload) => {
    try {
        const res = await axiosInstance("https://questionask-form-ms.onrender.com").put(`/v1/api/forms/${id}`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}