import { axiosInstance } from '../../../services/fetch';

export const findById = async (id) => {
    try {
        const res = await axiosInstance("http://51.161.9.193:80").get(`/questionask/api/v1/viewer/responses/${id}`);
        console.log("response", res.data);
        return res.data;
    } catch (error) {
        console.log("err", error);
        throw error;
    }
}