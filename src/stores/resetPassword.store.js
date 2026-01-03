import { create } from "zustand";
import { authService } from "../services/auth.service";

const useResetPasswordStore = create((set) => ({
    step: 'email',
    email: '',
    loading: false,
    error: null,
    success: false,
    otpVerified: false,

    setEmail: (email) => set({ email }),
    
    setStep: (step) => set({ step }),

    // Demande de reinitialisation
    requestResetCode: async (email) => {
        set({ loading: true, error: null, success: false });
        
        try {
            const response = await authService.requestPasswordReset(email);
            
            if (response.data.success) {
                set({ 
                    email, 
                    step: 'otp', 
                    loading: false, 
                    error: null 
                });
            } else {
                throw new Error(response.data.message || "Erreur lors de l'envoi du code");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                "Erreur lors de l'envoi du code de réinitialisation";
            set({ error: errorMessage, loading: false });
            throw error;
        }
    },

    // Vérification OTP
    verifyOtp: async (email, otp) => {
        set({ loading: true, error: null });
        
        try {
            const response = await authService.verifyResetToken(email, otp);
            
            if (response.data.success) {
                set({ 
                    otpVerified: true, 
                    step: 'new-password', 
                    loading: false, 
                    error: null 
                });
            } else {
                throw new Error(response.data.message || "Code invalide");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                "Code de vérification invalide";
            set({ error: errorMessage, loading: false });
            throw error;
        }
    },

    // Reinitialisation du password
    submitNewPassword: async (email, password, password_confirmation) => {
        set({ loading: true, error: null });
        
        try {
            const response = await authService.resetPassword(email, password, password_confirmation);
            
            if (response.data.success) {
                set({ 
                    success: true, 
                    loading: false, 
                    error: null 
                });
            } else {
                throw new Error(response.data.message || "Erreur lors de la réinitialisation");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                "Erreur lors de la réinitialisation du mot de passe";
            set({ error: errorMessage, loading: false });
            throw error;
        }
    },

    clearState: () => set({
        step: 'email',
        email: '',
        loading: false,
        error: null,
        success: false,
        otpVerified: false
    })
}));

export default useResetPasswordStore;