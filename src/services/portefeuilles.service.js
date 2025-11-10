import axiosInstance from "../api/axiosInstance";

const getSoldeAdmin = async () => {
    try {
        const response = await axiosInstance.get('/api/solde/admin');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du solde admin');
    }
}

const getPortefeuilles = async () => {
    try {
        const response = await axiosInstance.get('/api/afficher/portefeuille');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des portefeuilles');
    }
}

const marquerPaye = async () => {
    try {
        const response = await axiosInstance.post('/api/marquer/paye/:hashid');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors du marquage comme payé')
    }
}

export const portefeuillesService = {
    getSoldeAdmin,
    getPortefeuilles,
    marquerPaye
}