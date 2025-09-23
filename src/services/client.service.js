import axiosInstance from "../api/axiosInstance";

const getClients = async () => {
    try {
        const response = await axiosInstance.get("/api/clients");
        return response.data;
    }catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
        throw error.response?.data || error;
    }
}

export const clientService = {
    getClients
};