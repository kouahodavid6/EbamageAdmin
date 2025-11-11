import axiosInstance from "../api/axiosInstance";

const getSoldes = async () => {
    try {
        const response = await axiosInstance.get('/api/soldes');
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des soldes');
    }
}

const getReclamations = async () => {
    try {
        const response = await axiosInstance.get('/api/afficher/portefeuille');
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des réclamations');
    }
}

const marquerPaye = async (hashid) => {
    try {
        const response = await axiosInstance.post(`/api/marquer/paye/${hashid}`);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors du marquage comme payé')
    }
}

export const portefeuillesService = {
    getSoldes,
    getReclamations,
    marquerPaye
}