import axiosInstance from "../api/axiosInstance";

// Récupérer toutes les villes
const getVilles = async () => {
    try {
        const response = await axiosInstance.get("/api/villes");
        console.log("Réponse GET villes:", response.data);

        if (response.data?.success) {
            return Array.isArray(response.data.data) ? response.data.data : [];
        }
        return [];
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Ajouter une ville
const ajouterVille = async (lib_ville) => {
    try {
        const data = { lib_ville };
        const response = await axiosInstance.post("/api/ajout/ville", data);
        console.log("Réponse POST ville:", response.data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Modifier une ville
const modifierVille = async (hashid, lib_ville) => {
    try {
        const data = { lib_ville };
        const response = await axiosInstance.post(`/api/villes/modifier/${hashid}`, data);
        console.log("Réponse modification ville:", response.data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Supprimer une ville
const supprimerVille = async (hashid) => {
    try {
        const response = await axiosInstance.post(`/api/villes/supprimer/${hashid}`);
        console.log("Réponse suppression ville:", response.data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Ajouter une commune
const ajouterCommune = async (lib_commune, id_ville_hash) => {
    try {
        const data = { lib_commune, id_ville_hash };
        const response = await axiosInstance.post("/api/ajout/commune", data);
        console.log("Réponse POST commune:", response.data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Modifier une commune
const modifierCommune = async (hashid, lib_commune, id_ville_hash) => {
    try {
        const data = { lib_commune, id_ville_hash };
        const response = await axiosInstance.post(`/api/communes/modifier/${hashid}`, data);
        console.log("Réponse modification commune:", response.data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Supprimer une commune
const supprimerCommune = async (hashid) => {
    try {
        const response = await axiosInstance.post(`/api/communes/supprimer/${hashid}`);
        console.log("Réponse suppression commune:", response.data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Récupérer toutes les communes
const getCommunes = async () => {
    try {
        const response = await axiosInstance.get("/api/communes");
        console.log("Réponse GET communes:", response.data);

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
        throw error.response?.data || error.message;
    }
};

// Récupérer les communes par ville (filtrage côté client)
const getCommunesParVille = async (villeHashId) => {
    try {
        // Charger toutes les communes et filtrer côté client
        const toutesCommunes = await getCommunes();
        const communesFiltrees = toutesCommunes.filter(commune => 
            commune.ville?.hashid === villeHashId
        );
        
        return {
            ville: communesFiltrees[0]?.ville || {},
            hashid: villeHashId,
            communes: communesFiltrees
        };
        
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const LocalisationService = {
    getVilles,
    ajouterVille,
    modifierVille,
    supprimerVille,
    ajouterCommune,
    modifierCommune,
    supprimerCommune,
    getCommunes,
    getCommunesParVille
};

export default LocalisationService;