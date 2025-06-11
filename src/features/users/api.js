import { axiosInstance } from '../../services/fetch';
export const filterItems = async (payload) => {
    try {
        const urlParameters = payload && Object.keys(payload).length !== 0 ? `?${Object.entries(payload).map(e => e.join('=')).join('&')}` : '';
        const res = await axiosInstance("https://questionask-users-ms.onrender.com").get(`/v1/api/v1/users${urlParameters}`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*'
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const createItem = async (payload) => {
    try {
        const res = await axiosInstance("https://questionask-users-ms.onrender.com").post(`/v1/api/v1/users`, payload, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*'
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}


export const editItemById = async (id, payload) => {
    try {
        const res = await axiosInstance("https://questionask-users-ms.onrender.com").put(`/v1/api/v1/users/${id}`, payload, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*'
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const deleteItemById = async (id) => {
    try {
        const res = await axiosInstance("https://questionask-users-ms.onrender.com").delete(`/v1/api/v1/users/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*'
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
}