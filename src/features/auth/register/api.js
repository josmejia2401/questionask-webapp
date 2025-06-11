import { axiosInstance } from '../../../services/fetch';
import { AuthStore } from '../../../store/index';

export const register = async (payload) => {
    try {
        const res = await axiosInstance("https://questionask-users-ms.onrender.com").post(`/v1/api/users`, payload, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*'
            },
        });
        AuthStore.logout();
        return res.data;
    } catch (error) {
        throw error;
    }
}
