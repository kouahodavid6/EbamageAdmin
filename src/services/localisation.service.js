import axiosInstance from "../api/axiosInstance";

const ajouterVilles = async () => {
    try {
        const response = await axiosInstance.post("/api/ajout/ville");
        console.log("Réponse ajout villes:", response.data); // Debug
        return response.data;
    } catch (error) {
        console.error("Erreur ajout villes:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

const ajouterCommunes = async () => {
    try {
        const response = await axiosInstance.post("/api/ajout/commune");
        console.log("Réponse ajout communes:", response.data); // Debug
        return response.data;
    } catch (error) {
        console.error("Erreur ajout communes:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

const getVilles = async () => {
    try {
        const response = await axiosInstance.get("/api/villes");
        console.log("Réponse villes:", response.data); // Debug

        // Structure de réponse plus robuste
        if (response.data?.success) {
            return Array.isArray(response.data.data) ? response.data.data : [];
        }
        return [];
    } catch (error) {
        console.error("Erreur récupération villes:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};


const getCommunes = async () => {
    try {
        const response = await axiosInstance.get("/api/communes");
        console.log("Réponse communes:", response.data); // Debug

        if (response.data?.success) {
            return Array.isArray(response.data.data) 
            ? response.data.data.map(c => ({
                ...c,
                ville: c.ville || {}
                })) 
            : [];
        }
        return [];
    } catch (error) {
        console.error("Erreur récupération communes:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};


const getCommunesParVille = async (lib_ville) => {
    try {
        const response = await axiosInstance.get(`/api/commune/${lib_ville}/ville`);
        console.log(`Réponse communes pour ${lib_ville}:`, response.data); // Debug
        
        if (!response.data?.success) {
            throw new Error(response.data?.message || "Erreur lors de la récupération des communes");
        }

        return {
            ville: response.data.ville || {},
            hashid: response.data.hashid || "",
            communes: Array.isArray(response.data.data) ? response.data.data : []
        };
    } catch (error) {
        console.error(`Erreur communes pour ${lib_ville}:`, error.response?.data || error.message);
        throw error;
    }
};

const LocalisationService = {
    ajouterVilles,
    ajouterCommunes,
    getVilles,
    getCommunes,
    getCommunesParVille
};

export default LocalisationService;