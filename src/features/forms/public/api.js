import { axiosInstance } from '../../../services/fetch';


export const findById = async (id) => {
    try {
        const res = await axiosInstance().get(`/api/v1/viewer/public/forms/${id}`);
        return res.data;
    } catch (error) {
        throw error; 
    }
}

export const saveResponse = async (payload) => {
    try {
        const res = await axiosInstance().post(`/api/v1/viewer/responses`, payload);
        return res.data;
    } catch (error) {
        throw error;
    }
}


