import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { 
    Bell, 
    Users, 
    Store, 
    Globe, 
    Send,
    User,
    Building,
    RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import useNotificationStore from "../../stores/notifications.store";
import toast from "react-hot-toast";

const Notifications = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('client');
    
    // États pour le formulaire client
    const [clientForm, setClientForm] = useState({
        device_token: "",
        title: "",
        message: "",
        type: ""
    });

    // États pour les autres formulaires
    const [boutiqueForm, setBoutiqueForm] = useState({
        device_token: "",
        title: "",
        message: "",
        type: ""
    });

    const [allBoutiquesForm, setAllBoutiquesForm] = useState({
        title: "",
        message: "",
        type: ""
    });

    const [allClientsForm, setAllClientsForm] = useState({
        title: "",
        message: "",
        type: ""
    });

    const [everyoneForm, setEveryoneForm] = useState({
        title: "",
        message: "",
        type: ""
    });

    const { 
        loading, 
        error, 
        success, 
        clearState,
        users,
        boutiques,
        fetchUsers,
        sendToClient,
        sendToBoutique,
        sendToAllBoutiques,
        sendToAllClients,
        sendToEveryone
    } = useNotificationStore();

    // Charger les utilisateurs au montage du composant
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Gérer les succès et erreurs avec les toasts
    useEffect(() => {
        if (success) {
            toast.success('Notification envoyée avec succès !');
            clearState();
        }
        if (error) {
            toast.error(error);
            clearState();
        }
    }, [success, error, clearState]);

    // Gérer les changements de formulaire client
    const handleClientChange = (e) => {
        const { name, value } = e.target;
        setClientForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Gérer les changements des autres formulaires
    const handleGenericChange = (form, setForm) => (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Fonctions pour récupérer les noms des utilisateurs/boutiques
    const getClientName = (deviceToken) => {
        const client = users.find(user => user.device_token === deviceToken);
        return client ? client.nom_clt : 'le client';
    };

    const getBoutiqueName = (deviceToken) => {
        const boutique = boutiques.find(boutique => boutique.device_token === deviceToken);
        return boutique ? boutique.nom_btq : 'la boutique';
    };

    // Soumettre les formulaires
    const handleSubmit = async (e, type, formData) => {
        e.preventDefault();
        
        try {
            let response;
            switch (type) {
                case 'client':
                    response = await sendToClient(formData);
                    setClientForm({
                        device_token: "",
                        title: "",
                        message: "",
                        type: ""
                    });
                    toast.success(`Notification envoyée à ${getClientName(formData.device_token)}`);
                    break;
                case 'boutique':
                    response = await sendToBoutique(formData);
                    setBoutiqueForm({ 
                        device_token: "",
                        title: "", 
                        message: "", 
                        type: "" 
                    });
                    toast.success(`Notification envoyée à ${getBoutiqueName(formData.device_token)}`);
                    break;
                case 'allBoutiques':
                    response = await sendToAllBoutiques(formData);
                    setAllBoutiquesForm({ title: "", message: "", type: "" });
                    toast.success(`Notification envoyée à toutes les boutiques (${boutiques.length})`);
                    break;
                case 'allClients':
                    response = await sendToAllClients(formData);
                    setAllClientsForm({ title: "", message: "", type: "" });
                    toast.success(`Notification envoyée à tous les clients (${users.length})`);
                    break;
                case 'everyone':
                    response = await sendToEveryone(formData);
                    setEveryoneForm({ title: "", message: "", type: "" });
                    toast.success(`Notification envoyée à tout le monde (${users.length + boutiques.length} utilisateurs)`);
                    break;
                default:
                    break;
            }
            return response;
        } catch (error) {
            console.error('Erreur envoi notification:', error);
            // L'erreur est déjà gérée par le store et affichée via le useEffect
        }
    };

    // Filtrer les utilisateurs avec device_token
    const clientsWithToken = users.filter(user => user.device_token);
    const boutiquesWithToken = boutiques.filter(boutique => boutique.device_token);

    const tabs = [
        { id: 'client', label: 'Client spécifique', icon: User, description: 'Envoyer à un client particulier' },
        { id: 'boutique', label: 'Boutique spécifique', icon: Building, description: 'Envoyer à une boutique spécifique' },
        { id: 'allBoutiques', label: 'Toutes les boutiques', icon: Store, description: 'Envoyer à toutes les boutiques' },
        { id: 'allClients', label: 'Tous les clients', icon: Users, description: 'Envoyer à tous les clients' },
        { id: 'everyone', label: 'Tout le monde', icon: Globe, description: 'Envoyer à tous les utilisateurs' }
    ];

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95, transition: { duration: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/20 flex flex-col md:flex-row">

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed md:sticky top-0 z-50 transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 w-64 h-screen`}
            >
                {/* Croix mobile */}
                <div className="md:hidden flex justify-end p-4 absolute top-0 right-0 z-50">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-emerald-600 hover:text-emerald-800 transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg"
                        aria-label="Fermer la sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <DashboardSidebar/>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 min-w-0 flex flex-col">

                <DashboardHeader
                    title="Notifications"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                    {/* En-tête avec bouton retour */}
                    <motion.div 
                        className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-6 sm:p-8 text-white shadow-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                                        Gestion des Notifications
                                    </h1>
                                    <p className="opacity-90 text-emerald-100">
                                        Envoyez des notifications ciblées à vos clients et boutiques
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <motion.button
                                    onClick={() => {
                                        fetchUsers();
                                        toast.success('Liste des utilisateurs actualisée');
                                    }}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Actualiser la liste"
                                >
                                    <RefreshCw className="w-5 h-5 text-emerald-200" />
                                </motion.button>
                                <motion.div
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ 
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    className="hidden sm:block"
                                >
                                    <Bell className="w-12 h-12 text-emerald-200" />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Suppression des anciens messages d'état puisque nous avons les toasts */}

                    {/* Navigation par onglets */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6">
                        <h2 className="text-lg font-semibold text-emerald-900 mb-4">
                            Type de notification
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {tabs.map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                                        activeTab === tab.id
                                            ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                                            : 'border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-md'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-2 rounded-lg ${
                                            activeTab === tab.id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                            <tab.icon className="w-4 h-4" />
                                        </div>
                                        <span className={`font-medium ${
                                            activeTab === tab.id ? 'text-emerald-900' : 'text-emerald-700'
                                        }`}>
                                            {tab.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-emerald-600/70">
                                        {tab.description}
                                    </p>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Formulaire selon l'onglet actif */}
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {activeTab === 'client' && (
                            <form onSubmit={(e) => handleSubmit(e, 'client', clientForm)} className="space-y-6">
                                <h3 className="text-lg font-semibold text-emerald-900 mb-4">
                                    📱 Notification à un client spécifique
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Sélectionner un client *
                                        </label>
                                        <select
                                            name="device_token"
                                            value={clientForm.device_token}
                                            onChange={handleClientChange}
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
                                            required
                                        >
                                            <option value="">Choisir un client...</option>
                                            {clientsWithToken.map((client) => (
                                                <option key={client.hashid} value={client.device_token}>
                                                    {client.nom_clt} ({client.email_clt}) - {client.device_token ? '📱' : '❌'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Titre *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={clientForm.title}
                                            onChange={handleClientChange}
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
                                            required
                                            placeholder="Ex: Votre commande est prête"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Type
                                        </label>
                                        <input
                                            type="text"
                                            name="type"
                                            value={clientForm.type}
                                            onChange={handleClientChange}
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
                                            placeholder="Ex: commande, info, etc."
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={clientForm.message}
                                            onChange={handleClientChange}
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300 resize-none"
                                            required
                                            rows="4"
                                            placeholder="Ex: Votre commande #12345 est prête à être récupérée..."
                                        />
                                    </div>
                                </div>

                                <motion.button 
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg transition-all duration-300 disabled:cursor-not-allowed"
                                    variants={buttonVariants}
                                    whileHover={!loading ? "hover" : {}}
                                    whileTap={!loading ? "tap" : {}}
                                    disabled={loading || clientsWithToken.length === 0}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Envoyer au client
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        )}

                        {activeTab === 'boutique' && (
                            <form onSubmit={(e) => handleSubmit(e, 'boutique', boutiqueForm)} className="space-y-6">
                                <h3 className="text-lg font-semibold text-emerald-900 mb-4">
                                    🏪 Notification à une boutique spécifique
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Sélectionner une boutique *
                                        </label>
                                        <select
                                            name="device_token"
                                            value={boutiqueForm.device_token}
                                            onChange={handleGenericChange(boutiqueForm, setBoutiqueForm)}
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
                                            required
                                        >
                                            <option value="">Choisir une boutique...</option>
                                            {boutiquesWithToken.map((boutique) => (
                                                <option key={boutique.hashid} value={boutique.device_token}>
                                                    {boutique.nom_btq} ({boutique.email_btq}) - {boutique.device_token ? '📱' : '❌'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Titre *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={boutiqueForm.title}
                                            onChange={handleGenericChange(boutiqueForm, setBoutiqueForm)}
                                            placeholder="Ex: Nouvelle commande"
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Type
                                        </label>
                                        <input
                                            type="text"
                                            name="type"
                                            value={boutiqueForm.type}
                                            onChange={handleGenericChange(boutiqueForm, setBoutiqueForm)}
                                            placeholder="Ex: commande, info, etc."
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={boutiqueForm.message}
                                            onChange={handleGenericChange(boutiqueForm, setBoutiqueForm)}
                                            placeholder="Ex: Vous avez reçu une nouvelle commande à traiter"
                                            rows="4"
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300 resize-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <motion.button 
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg transition-all duration-300 disabled:cursor-not-allowed"
                                    variants={buttonVariants}
                                    whileHover={!loading ? "hover" : {}}
                                    whileTap={!loading ? "tap" : {}}
                                    disabled={loading || boutiquesWithToken.length === 0}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Envoyer à la boutique
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        )}

                        {/* Les autres formulaires restent similaires */}
                        {activeTab === 'allBoutiques' && (
                            <form onSubmit={(e) => handleSubmit(e, 'allBoutiques', allBoutiquesForm)} className="space-y-6">
                                <h3 className="text-lg font-semibold text-emerald-900 mb-4">
                                    🏪🏪 Notification à toutes les boutiques ({boutiques.length} boutiques)
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Titre *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={allBoutiquesForm.title}
                                            onChange={handleGenericChange(allBoutiquesForm, setAllBoutiquesForm)}
                                            placeholder="Ex: Maintenance programmée"
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={allBoutiquesForm.message}
                                            onChange={handleGenericChange(allBoutiquesForm, setAllBoutiquesForm)}
                                            placeholder="Ex: Le système sera en maintenance demain..."
                                            rows="4"
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300 resize-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Type
                                        </label>
                                        <input
                                            type="text"
                                            name="type"
                                            value={allBoutiquesForm.type}
                                            onChange={handleGenericChange(allBoutiquesForm, setAllBoutiquesForm)}
                                            placeholder="Ex: info, warning, etc."
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <motion.button 
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg transition-all duration-300 disabled:cursor-not-allowed"
                                    variants={buttonVariants}
                                    whileHover={!loading ? "hover" : {}}
                                    whileTap={!loading ? "tap" : {}}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Envoyer à toutes les boutiques
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        )}

                        {activeTab === 'allClients' && (
                            <form onSubmit={(e) => handleSubmit(e, 'allClients', allClientsForm)} className="space-y-6">
                                <h3 className="text-lg font-semibold text-emerald-900 mb-4">
                                    👥👥 Notification à tous les clients ({users.length} clients)
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Titre *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={allClientsForm.title}
                                            onChange={handleGenericChange(allClientsForm, setAllClientsForm)}
                                            placeholder="Ex: Nouvelle fonctionnalité"
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={allClientsForm.message}
                                            onChange={handleGenericChange(allClientsForm, setAllClientsForm)}
                                            placeholder="Ex: Découvrez notre nouvelle fonctionnalité..."
                                            rows="4"
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300 resize-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Type
                                        </label>
                                        <input
                                            type="text"
                                            name="type"
                                            value={allClientsForm.type}
                                            onChange={handleGenericChange(allClientsForm, setAllClientsForm)}
                                            placeholder="Ex: info, promotion, etc."
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <motion.button 
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg transition-all duration-300 disabled:cursor-not-allowed"
                                    variants={buttonVariants}
                                    whileHover={!loading ? "hover" : {}}
                                    whileTap={!loading ? "tap" : {}}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Envoyer à tous les clients
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        )}

                        {activeTab === 'everyone' && (
                            <form onSubmit={(e) => handleSubmit(e, 'everyone', everyoneForm)} className="space-y-6">
                                <h3 className="text-lg font-semibold text-emerald-900 mb-4">
                                    🌍 Notification à tout le monde ({users.length + boutiques.length} utilisateurs)
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Titre *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={everyoneForm.title}
                                            onChange={handleGenericChange(everyoneForm, setEveryoneForm)}
                                            placeholder="Ex: Message important"
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={everyoneForm.message}
                                            onChange={handleGenericChange(everyoneForm, setEveryoneForm)}
                                            placeholder="Ex: Message important pour tous les utilisateurs..."
                                            rows="4"
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300 resize-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                                            Type
                                        </label>
                                        <input
                                            type="text"
                                            name="type"
                                            value={everyoneForm.type}
                                            onChange={handleGenericChange(everyoneForm, setEveryoneForm)}
                                            placeholder="Ex: urgent, info, etc."
                                            className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <motion.button 
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg transition-all duration-300 disabled:cursor-not-allowed"
                                    variants={buttonVariants}
                                    whileHover={!loading ? "hover" : {}}
                                    whileTap={!loading ? "tap" : {}}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Envoyer à tout le monde
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default Notifications;