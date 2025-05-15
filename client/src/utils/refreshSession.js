// client/src/utils/refreshSession.js
import axios from './axiosInstance';

export const refreshSession = async () => {
    try {
        const res = await axios.post('http://localhost:8080/api/auth/refresh', null, {
            withCredentials: true,
        });
        const { accessToken } = res.data;

        // Reuse existing user info from localStorage
        const user = JSON.parse(localStorage.getItem("snappixUser"));

        localStorage.setItem("snappixSession", accessToken);
        localStorage.setItem("snappixUser", JSON.stringify(user));
        return true;
    } catch {
        return false;
    }
};
