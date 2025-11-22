import axiosInstance from "../api/axiosInstance";

const getAdminInfo = async () => {
    try {
        const response = await axiosInstance.get("/api/info/admin");
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const updateAdminInfo = async (data) => {
    try {
        const response = await axiosInstance.post("/api/admin/update-infos", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const updateAdminPassword = async (data) => {
    try {
        const response = await axiosInstance.post("/api/admin/update-password", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const InfoAdmin = {
    getAdminInfo,
    updateAdminInfo,
    updateAdminPassword,
};
