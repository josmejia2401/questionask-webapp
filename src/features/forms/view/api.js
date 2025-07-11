import { axiosInstance } from '../../../services/fetch';

export const findAll = async () => {
    try {
        const res = await axiosInstance("http://51.161.9.193:80").get(`/questionask/api/v1/forms`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const deleteById = async (id) => {
    try {
        const res = await axiosInstance("http://51.161.9.193:80").delete(`/questionask/api/v1/forms/${id}`);
        console.log("response", res.data);
        return res.data;
    } catch (error) {
        console.log("err", error);
        throw error;
    }
}

export const updateById = async (id, payload) => {
    try {
        const res = await axiosInstance("http://51.161.9.193:80").put(`/questionask/api/v1/forms/${id}`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}
