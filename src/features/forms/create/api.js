import { axiosInstance } from '../../../services/fetch';


export const create = async (payload) => {
    try {
        const res = await axiosInstance().post(`/api/v1/forms`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}