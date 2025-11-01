import axiosInstance from "../api/axiosInstance";

// Récupérer tous les utilisateurs et boutiques
const getUsers = async () => {
    try {
        const response = await axiosInstance.get('/api/users');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des utilisateurs');
    }
}

// Notification à un client spécifique
const sendToClient = async (notificationData) => {
    try {
        const response = await axiosInstance.post('/api/notification/client', notificationData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi de la notification au client');
    }
}

// Notification à une boutique spécifique
const sendToBoutique = async (notificationData) => {
    try {
        const response = await axiosInstance.post('/api/notification/boutique', notificationData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi de la notification à la boutique');
    }
}

// Notification à toutes les boutiques
const sendToAllBoutiques = async (notificationData) => {
    try {
        const response = await axiosInstance.post('/api/notification/boutiques/all', notificationData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi de la notification à toutes les boutiques');
    }
}

// Notification à tous les clients
const sendToAllClients = async (notificationData) => {
    try {
        const response = await axiosInstance.post('/api/notification/clients/all', notificationData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi de la notification à tous les clients');
    }
}

// Notification à tout le monde (clients + boutiques)
const sendToEveryone = async (notificationData) => {
    try {
        const response = await axiosInstance.post('/api/notification/all', notificationData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de l\'envoi de la notification générale');
    }
}

export const notificationsService = {
    getUsers,
    sendToClient,
    sendToBoutique,
    sendToAllBoutiques,
    sendToAllClients,
    sendToEveryone
}