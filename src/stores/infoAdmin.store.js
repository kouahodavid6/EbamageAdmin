import { create } from "zustand";
import toast from "react-hot-toast";
import { InfoAdmin } from "../services/infoAdmin.service";

const useAdminInfoStore = create((set) => ({
    admin: null,
    loading: false,

    fetchAdminInfo: async () => {
        set({ loading: true });
        try {
            const data = await InfoAdmin.getAdminInfo();
            set({ admin: data });
        } catch (error) {
            console.error("Erreur fetchAdminInfo:", error);
            toast.error(error.message || "Erreur lors du chargement des informations");
        } finally {
            set({ loading: false });
        }
    },

    updateAdminInfo: async (data) => {
        set({ loading: true });
        try {
            const res = await InfoAdmin.updateAdminInfo(data);
            toast.success(res.message || "Informations mises à jour !");
            set({ admin: res.data || data });
            return res;
        } catch (error) {
            toast.error(error.message || "Erreur lors de la mise à jour");
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    updateAdminPassword: async (data) => {
        set({ loading: true });
        try {
            const res = await InfoAdmin.updateAdminPassword(data);
            toast.success(res.message || "Mot de passe mis à jour !");
            return res;
        } catch (error) {
            toast.error(error.message || "Erreur lors de la mise à jour du mot de passe");
            throw error;
        } finally {
            set({ loading: false });
        }
    },
}));

export default useAdminInfoStore;