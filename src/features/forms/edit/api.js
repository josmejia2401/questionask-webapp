import { axiosInstance } from '../../../services/fetch';


export const findById = async (id) => {
    try {
        const res = await axiosInstance("https://questionask-forms-ms.onrender.com").get(`/v1/api/forms/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
                "access-control-allow-methods": "*"
            },
        });
        console.log("response", res.data);
        return res.data;
    } catch (error) {
        console.log("err", error);
        throw error;
    }
}

export const updateById = async (id, payload) => {
    try {
        const res = await axiosInstance("https://questionask-forms-ms.onrender.com").put(`/v1/api/forms/${id}`, payload, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
                "access-control-allow-methods": "*"
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}


export const uploadFile = async (id, formData) => {
    try {
        const res = await axiosInstance("https://questionask-forms-ms.onrender.com").post(`/v1/api/files/forms/${id}/upload`, formData, {
            headers: {},
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const downloadFile = async (formId, filename) => {
    try {
        const res = await axiosInstance("https://questionask-forms-ms.onrender.com").get(`/v1/api/files/forms/${formId}/images/${filename}`, {
            responseType: 'blob',
            headers: {},
        });
        return URL.createObjectURL(res.data);
    } catch (error) {
        return null;
    }
}