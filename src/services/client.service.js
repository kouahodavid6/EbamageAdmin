import axiosInstance from "../api/axiosInstance";

const getClients = async () => {
    try {
        const response = await axiosInstance.get("/api/clients");
        return response.data;
    }catch (error) {
        throw error.response?.data || error;
    }
}

const deleteClients = async (hashid) => {
    try {
        const response = await axiosInstance.post(`/api/client/delete/${hashid}`);
        return response.data;
    }catch(error){
        throw error.response?.data || error;
    }
}

export const clientService = {
    getClients,
    deleteClients
};