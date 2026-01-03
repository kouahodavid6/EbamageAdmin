import axiosInstance from "../api/axiosInstance";

const loginAdmin = async (credentials) => {
    const response = await axiosInstance.post("/api/admin/login", credentials);

    if (response.data.token) {
        localStorage.setItem("admin_token", response.data.token);
    }

    return response;
}

// Nouvelle méthode pour la demande de réinitialisation
const requestPasswordReset = async (email) => {
    const response = await axiosInstance.post("/api/demande/reinitialisation/password", {
        email
    });
    return response;
}

// Nouvelle méthode pour vérifier l'OTP
const verifyResetToken = async (email, otp) => {
    const response = await axiosInstance.post("/api/verification/token/password", {
        email,
        otp
    });
    return response;
}

// Nouvelle méthode pour réinitialiser le mot de passe
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