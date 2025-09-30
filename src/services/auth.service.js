import axiosInstance from "../api/axiosInstance";

const loginAdmin = async (credentials) => {
    const response = await axiosInstance.post("/api/admin/login", credentials);

    if (response.data.token) {
        localStorage.setItem("admin_token", response.data.token);
    }

    return response;
}

const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("user");
}

export const authService = {
    loginAdmin,
    logout
}