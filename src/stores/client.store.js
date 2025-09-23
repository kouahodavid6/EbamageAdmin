import { create } from "zustand";
import { clientService } from "../services/client.service";

const useClientStore = create((set) => ({
    clients: [],
    loading: false,
    error: null,

    fetchClients: async () => {
        set({ loading: true, error: null });
        try {
            const response = await clientService.getClients();
            set({ clients: response.data, loading: false });
        }catch (error) {
            set({ error: error.message, loading: false });
        }
    },
}));

export default useClientStore;