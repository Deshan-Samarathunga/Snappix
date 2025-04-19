// client/src/utils/axiosInstance.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true, // allow sending cookies (refreshToken)
});

// Axios interceptor for handling expired access tokens
api.interceptors.response.use(
    (response) => {
        window.dispatchEvent(new Event("activity"));
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await axios.post("http://localhost:8080/api/auth/refresh", {}, { withCredentials: true });
                const newToken = res.data.accessToken;

                // Save new token
                localStorage.setItem("snappixSession", newToken);
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

                return api(originalRequest); // retry original request
            } catch (refreshErr) {
                console.error("Refresh token failed", refreshErr);
                localStorage.removeItem("snappixSession");
                localStorage.removeItem("snappixUser");
                window.location.href = "/";
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
