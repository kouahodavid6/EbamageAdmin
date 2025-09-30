import { create } from "zustand";
import { authService } from "../services/auth.service";

// Récupérer l'admin depuis localStorage si existe
const getInitialAdmin = () => {
    try {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("admin_token");
        
        if (user && token) {
            return JSON.parse(user);
        }
        return null;
    } catch {
        return null;
    }
};

const useAuthStore = create((set) => ({
    admin: getInitialAdmin(),
    loading: false,
    error: null,
    showError: false,

    setError: (error) => set({ error, showError: true }),
    clearError: () => set({ error: null, showError: false }),

    login: async (credentials) => {
        set({ loading: true, error: null, showError: false });

        try {
            const response = await authService.loginAdmin(credentials);
            const { data, token } = response.data;
            const adminData = { ...data, token };

            // Stocker dans localStorage
            localStorage.setItem("user", JSON.stringify(adminData));
            
            set({ admin: adminData, loading: false, error: null });

            return response.data;
        }
        catch(error) {
            const errorMessage = error.response?.data?.message || "Erreur de connexion";
            set({ error: errorMessage, showError: true, loading: false });
            throw new Error(errorMessage);
        }
    },

    logout: () => {
        authService.logout();
        set({ admin: null, error: null, showError: false });
    },

    isAuthenticated: () => {
        return !!localStorage.getItem("admin_token");
    }
}));

export default useAuthStore;