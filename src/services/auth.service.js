import axiosInstance from "../api/axiosInstance";

const loginAdmin = async (credentials) => {
    const response = await axiosInstance.post("/api/admin/login", credentials);

    if (response.data.token) {
        localStorage.setItem("admin_token", response.data.token);
        if (response.data.data) {
            localStorage.setItem("user", JSON.stringify(response.data.data));
        }
    }

    return response;
}

const requestPasswordReset = async (email) => {
    const response = await axiosInstance.post("/api/demande/reinitialisation/password", {
        email
    });
    return response;
}

const verifyResetToken = async (email, otp) => {
    const response = await axiosInstance.post("/api/verification/token/password", {
        email,
        otp
    });
    return response;
}

const resetPassword = async (email, password, password_confirmation) => {
    const response = await axiosInstance.post("/api/reinitialisation/password", {
        email,
        password,
        password_confirmation
    });
    return response;
}

const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("user");
}

export const authService = {
    loginAdmin,
    requestPasswordReset,
    verifyResetToken,
    resetPassword,
    logout
}