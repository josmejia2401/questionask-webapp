import { axiosInstance } from '../../../services/fetch';
import { AuthStore } from '../../../store/index';

export const register = async (payload) => {
    try {
        const res = await axiosInstance("http://51.161.9.193:80").post(`/questionask/api/v1/users`, payload);
        AuthStore.logout();
        return res.data;
    } catch (error) {
        throw error;
    }
}
