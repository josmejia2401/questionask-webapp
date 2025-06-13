import { axiosInstance } from '../../../services/fetch';


export const findById = async (id) => {
    try {
        const res = await axiosInstance("https://questionask-form-viewer.onrender.com").get(`/v1/api/public/forms/${id}`);
        console.log("response", res.data);
        return res.data;
    } catch (error) {
        console.log("err", error);
        throw error;
    }
}

export const saveResponse = async (payload) => {
    try {
        const res = await axiosInstance("https://questionask-form-viewer.onrender.com").post(`/v1/api/responses`, payload);
        console.log("response", res.data);
        return res.data;
    } catch (error) {
        console.log("err", error);
        throw error;
    }
}


