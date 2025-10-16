import axiosInstance from "../api/axiosInstance";

const ajouterVariation = async (data) => {
    try {
        console.log("Données envoyées:", data);
        const response = await axiosInstance.post("/api/variation/ajout", data);
        console.log("Réponse reçue:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erreur complète:", {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
        });
        throw error.response?.data || error;
    }
};

const listerVariations = async () => {
    try {
        const response = await axiosInstance.get("/api/variations");
        return response.data.data || [];
    } catch (error) {
        throw error.response?.data || error;
    }
};

const VariationService = {
    ajouterVariation,
    listerVariations,
};

export default VariationService;