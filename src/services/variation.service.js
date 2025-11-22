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

const modifierVariation = async (hashid, data) => {
    try {
        console.log("Modification variation:", { hashid, data });
        const response = await axiosInstance.post(`/api/update/variation/${hashid}`, data);
        console.log("Réponse modification:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erreur modification:", {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
        });
        throw error.response?.data || error;
    }
};

const supprimerVariation = async (hashid) => {
    try {
        const response = await axiosInstance.post(`/api/variation/${hashid}/delete`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const VariationService = {
    ajouterVariation,
    listerVariations,
    modifierVariation,
    supprimerVariation
};

export default VariationService;