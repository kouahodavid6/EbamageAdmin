import axiosInstance from "../api/axiosInstance";

const readPourcentage = async () => {
    try {
        const response = await axiosInstance.get("/api/pourcentage");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

const updatePourcentage = async (newPourcentage) => {
    try {
        const response = await axiosInstance.post("/api/pourcentage/update", { 
            pourcentage: newPourcentage 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const pourcentageService = {
    readPourcentage,
    updatePourcentage
}