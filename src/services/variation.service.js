import axiosInstance from "../api/axiosInstance";

const ajouterVariation = async (data) => {
    try {
        const response = await axiosInstance.post("/api/variation/ajout", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const listerVariations = async () => {
    try {
        const response = await axiosInstance.get("/api/variations");
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const obtenirVariation = async (hashid) => {
    try {
        const response = await axiosInstance.get(`/api/variation/${hashid}`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// const modifierVariation = async (hashid, data) => {
//     try {
//         const response = await axiosInstance.post(`/variation/${hashid}/update`, data);
//         return response.data.data;
//     } catch (error) {
//         throw error.response?.data || error;
//     }
// };

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
    obtenirVariation,
    //modifierVariation,
    supprimerVariation
};

export default VariationService;