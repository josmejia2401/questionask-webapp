import { axiosInstance } from '../../../services/fetch';


export const create = async (payload) => {
    try {
        const res = await axiosInstance("https://questionask-form-ms.onrender.com").post(`/v1/api/forms`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}