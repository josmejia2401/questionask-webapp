import { axiosInstance } from '../../../services/fetch';

export const findById = async (id) => {
    try {
        const res = await axiosInstance("http://localhost:3000").get(`/v1/api/responses/${id}`);
        console.log("response", res.data);
        return res.data;
    } catch (error) {
        console.log("err", error);
        throw error;
    }
}