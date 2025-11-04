import axiosInstance from "../api/axiosInstance";

const sendToClients = async (formData) => {
    try {
        const response = await axiosInstance.post("/api/publicite/ajout/clients", formData,
            { 
                timeout: 30000,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.data;
    } catch (error) {
        const msg =
            error.response?.data?.errors?.image?.[0] ||
            error.response?.data?.errors?.images?.[0] ||
            error.response?.data?.message ||
            "Erreur inconnue lors de l'envoi de la publicité.";

        throw new Error(msg);
    }
}

export const publicitesService = {
    sendToClients
}