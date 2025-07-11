import { axiosInstance } from '../../../services/fetch';


export const create = async (payload) => {
    try {
        const res = await axiosInstance("http://51.161.9.193:80").post(`/questionask/api/v1/forms`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}