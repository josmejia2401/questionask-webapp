import { axiosInstance } from '../../../services/fetch';


export const findById = async (id) => {
    try {
        const res = await axiosInstance("https://questionask-form-ms.onrender.com").get(`/v1/api/forms/${id}`);
        console.log("response", res.data);
        return res.data;
    } catch (error) {
        console.log("err", error);
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

export const publishById = async (id, payload) => {
    try {
        const res = await axiosInstance("https://questionask-form-ms.onrender.com").put(`/v1/api/forms/publish/${id}`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}
