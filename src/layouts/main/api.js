import { axiosInstance } from '../../services/fetch';
import { AuthStore } from '../../store/index';

export const logout = async () => {
    try {
        const res = await axiosInstance("https://questionask-auth-ms.onrender.com").post(`/v1/api/auth/logout`);
        AuthStore.logout();
        return res.data;
    } catch (error) {
        AuthStore.logout();
    }
}

export const findById = async () => {
    try {
        const res = await axiosInstance("https://questionask-users-ms.onrender.com").get(`/v1/api/users/${AuthStore.getState().tokenInfo.keyid}`);
        AuthStore.setUserInfo(res.data.data);
        return res.data;
    } catch (error) {
        throw error;
    }
}
