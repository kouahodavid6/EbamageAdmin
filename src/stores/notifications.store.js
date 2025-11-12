import { create } from 'zustand';
import { notificationsService } from '../services/notifications.service';

const useNotificationStore = create((set) => ({
    // États pour l'envoi de notifications
    loading: false,
    error: null,
    success: false,
    users: [],
    boutiques: [],

    // États pour les activités/notifications reçues
    activities: [],
    unreadCount: 0,
    activitiesLoading: false,

    // ==================== FONCTIONS POUR L'ENVOI DE NOTIFICATIONS ====================

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

    // ==================== FONCTIONS POUR LES ACTIVITÉS/NOTIFICATIONS REÇUES ====================

    // Mettre à jour le compteur basé sur les commandes récentes
    updateUnreadCount: (commandes) => {
        if (!commandes || !Array.isArray(commandes)) {
            set({ unreadCount: 0 });
            return;
        }

        // Logique pour déterminer quelles commandes sont "nouvelles"
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        
        const newActivities = commandes.filter(cmd => {
            if (!cmd?.created_at) return false;
            try {
                const cmdDate = new Date(cmd.created_at);
                return cmdDate > twentyFourHoursAgo;
            } catch {
                return false;
            }
        }).length;

        set({ unreadCount: newActivities });
    },

    // Marquer toutes les activités comme lues
    markAllAsRead: () => {
        set({ unreadCount: 0 });
    },

    // Réinitialiser les états
    clearState: () => set({ error: null, success: false })
}));

export default useNotificationStore;