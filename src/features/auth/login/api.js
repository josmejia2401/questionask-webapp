import { axiosInstance } from '../../../services/fetch';
import { AuthStore } from '../../../store/index';

export const signIn = async (payload) => {
    try {
        const res = await axiosInstance("https://questionask-auth-ms.onrender.com").post(`/v1/api/auth/login`, payload, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
                "access-control-allow-methods": "*"
            },
        });
        AuthStore.setToken(res.data.data["accessToken"]);
        return res.data;
    } catch (error) {
        throw error;
    }
}
