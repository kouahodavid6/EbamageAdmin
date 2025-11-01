import { create } from 'zustand';
import { notificationsService } from '../services/notifications.service';

const useNotificationStore = create((set) => ({
    loading: false,
    error: null,
    success: false,
    users: [],
    boutiques: [],

    // Récupérer tous les utilisateurs et boutiques
    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const response = await notificationsService.getUsers();
            set({ 
                loading: false, 
                users: response.data?.users || [],
                boutiques: response.data?.boutiques || []
            });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // Envoyer une notification à un client
    sendToClient: async (notificationData) => {
        set({ loading: true, error: null, success: false });
        try {
            const response = await notificationsService.sendToClient(notificationData);
            set({ loading: false, success: true });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false, success: false });
            throw error;
        }
    },

    // Envoyer une notification à une boutique
    sendToBoutique: async (notificationData) => {
        set({ loading: true, error: null, success: false });
        try {
            const response = await notificationsService.sendToBoutique(notificationData);
            set({ loading: false, success: true });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false, success: false });
            throw error;
        }
    },

    // Envoyer une notification à toutes les boutiques
    sendToAllBoutiques: async (notificationData) => {
        set({ loading: true, error: null, success: false });
        try {
            const response = await notificationsService.sendToAllBoutiques(notificationData);
            set({ loading: false, success: true });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false, success: false });
            throw error;
        }
    },

    // Envoyer une notification à tous les clients
    sendToAllClients: async (notificationData) => {
        set({ loading: true, error: null, success: false });
        try {
            const response = await notificationsService.sendToAllClients(notificationData);
            set({ loading: false, success: true });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false, success: false });
            throw error;
        }
    },

    // Envoyer une notification à tout le monde
    sendToEveryone: async (notificationData) => {
        set({ loading: true, error: null, success: false });
        try {
            const response = await notificationsService.sendToEveryone(notificationData);
            set({ loading: false, success: true });
            return response;
        } catch (error) {
            set({ error: error.message, loading: false, success: false });
            throw error;
        }
    },

    // Réinitialiser les états
    clearState: () => set({ error: null, success: false })
}));

export default useNotificationStore;