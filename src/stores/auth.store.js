import { create } from "zustand";
import { authService } from "../services/auth.service";

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
    isAuthenticated: !!localStorage.getItem("admin_token"),

    setError: (error) => set({ error, showError: true }),
    clearError: () => set({ error: null, showError: false }),

    login: async (credentials) => {
        set({ loading: true, error: null, showError: false });

        try {
            const response = await authService.loginAdmin(credentials);
            const { data, token } = response.data;
            const adminData = { ...data, token };

            localStorage.setItem("user", JSON.stringify(adminData));
            if (!localStorage.getItem("admin_token")) {
                localStorage.setItem("admin_token", token);
            }
            
            set({ 
                admin: adminData, 
                loading: false, 
                error: null,
                isAuthenticated: true
            });

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
        set({ 
            admin: null, 
            error: null, 
            showError: false,
            isAuthenticated: false
        });
    },

    checkAuth: () => {
        const token = localStorage.getItem("admin_token");
        const isAuth = !!token;
        set({ isAuthenticated: isAuth });
        return isAuth;
    }
}));

export default useAuthStore;