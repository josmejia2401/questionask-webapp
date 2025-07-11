import { axiosInstance } from '../../../services/fetch';


export const findById = async (id) => {
    try {
        const res = await axiosInstance("http://51.161.9.193:80").get(`/questionask/api/v1/viewer/public/forms/${id}`);
        console.log("response", res.data);
        return res.data;
    } catch (error) {
        console.log("err", error);
        throw error; 
    }
}

export const saveResponse = async (payload) => {
    try {
        const res = await axiosInstance("http://51.161.9.193:80").post(`/questionask/api/v1/viewer/responses`, payload);
        console.log("response", res.data);
        return res.data;
    } catch (error) {
        console.log("err", error);
        throw error;
    }
}


