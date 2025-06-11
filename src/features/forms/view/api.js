import { axiosInstance } from '../../../services/fetch';

export const findAll = async () => {
    try {
        const res = await axiosInstance("https://questionask-forms-ms.onrender.com").get(`/v1/api/forms`, {
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

export const deleteById = async (id) => {
    try {
        const res = await axiosInstance("https://questionask-forms-ms.onrender.com").delete(`/v1/api/forms/${id}`, {
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
