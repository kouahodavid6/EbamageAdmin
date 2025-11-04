import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { motion } from "framer-motion";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    CreditCard,
    // Wallet,
    PieChart,
    BarChart3,
    // Target,
    // PiggyBank,
    // Calendar,
    ArrowUpRight,
    ArrowDownLeft,
    Plus,
    Eye,
    Download,
    Users,
    Store,
    // Building,
    RefreshCw,
    Filter,
    Search
} from "lucide-react";

const Finances = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Données statistiques globales
    const financialStats = [
        {
            title: "Solde Plateforme",
            amount: "12,450,000",
            change: "+5.2%",
            trend: "up",
            icon: DollarSign,
            color: "text-green-500",
            bgColor: "bg-green-50",
            delay: 0.1
        },
        {
            title: "Revenus Admin",
            amount: "4,250,000",
            change: "+12.7%",
            trend: "up",
            icon: TrendingUp,
            color: "text-emerald-500",
            bgColor: "bg-emerald-50",
            delay: 0.2
        },
        {
            title: "Commissions Boutiques",
            amount: "8,150,000",
            change: "+8.3%",
            trend: "up",
            icon: Store,
            color: "text-blue-500",
            bgColor: "bg-blue-50",
            delay: 0.3
        },
        {
            title: "Dépenses Clients",
            amount: "28,450,000",
            change: "+15.1%",
            trend: "up",
            icon: Users,
            color: "text-purple-500",
            bgColor: "bg-purple-50",
            delay: 0.4
        }
    ];

    // Transactions récentes
    const recentTransactions = [
        {
            id: 1,
            description: "Commission - Boutique Fashion",
            amount: 125000,
            type: "income",
            category: "commission",
            date: "15 Nov 2024",
            from: "Boutique Fashion",
            status: "completed"
        },
        {
            id: 2,
            description: "Achat Client - Jean Dupont",
            amount: 45000,
            type: "expense",
            category: "client_purchase",
            date: "14 Nov 2024",
            from: "Client Jean D.",
            status: "completed"
        },
        {
            id: 3,
            description: "Frais de service",
            amount: 25000,
            type: "income",
            category: "service_fee",
            date: "14 Nov 2024",
            from: "Système",
            status: "completed"
        },
        {
            id: 4,
            description: "Remboursement - Marie Claire",
            amount: 35000,
            type: "expense",
            category: "refund",
            date: "13 Nov 2024",
            from: "Client Marie C.",
            status: "pending"
        }
    ];

    // Boutiques avec soldes
    const boutiquesFinances = [
        {
            id: 1,
            name: "Fashion Store",
            revenue: 2450000,
            commission: 245000,
            balance: 2205000,
            status: "active",
            transactions: 145
        },
        {
            id: 2,
            name: "Tech Galaxy",
            revenue: 1850000,
            commission: 185000,
            balance: 1665000,
            status: "active",
            transactions: 98
        },
        {
            id: 3,
            name: "Beauty Corner",
            revenue: 1200000,
            commission: 120000,
            balance: 1080000,
            status: "active",
            transactions: 76
        },
        {
            id: 4,
            name: "Home Decor",
            revenue: 890000,
            commission: 89000,
            balance: 801000,
            status: "pending",
            transactions: 45
        }
    ];

    // Clients avec dépenses
    const clientsFinances = [
        {
            id: 1,
            name: "Jean Dupont",
            totalSpent: 1250000,
            orders: 45,
            lastPurchase: "14 Nov 2024",
            status: "active"
        },
        {
            id: 2,
            name: "Marie Claire",
            totalSpent: 890000,
            orders: 32,
            lastPurchase: "13 Nov 2024",
            status: "active"
        },
        {
            id: 3,
            name: "Paul Martin",
            totalSpent: 650000,
            orders: 28,
            lastPurchase: "12 Nov 2024",
            status: "active"
        },
        {
            id: 4,
            name: "Sophie Bernard",
            totalSpent: 420000,
            orders: 19,
            lastPurchase: "10 Nov 2024",
            status: "inactive"
        }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(amount);
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
                    title="Gestion des finances"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                    {/* En-tête avec actions */}
                    <motion.div
                        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">
                                Tableau de bord financier
                            </h1>
                            <p className="text-emerald-600/80">
                                Gérez les finances de la plateforme, boutiques et clients
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Download className="w-4 h-4" />
                                Exporter
                            </motion.button>
                            <motion.button
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Actualiser
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Navigation par onglets */}
                    <motion.div
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="flex space-x-1">
                            {["overview", "boutiques", "clients", "transactions"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        activeTab === tab
                                            ? "bg-emerald-500 text-white shadow-lg"
                                            : "text-emerald-600 hover:bg-emerald-50"
                                    }`}
                                >
                                    {tab === "overview" && "Aperçu général"}
                                    {tab === "boutiques" && "Finances boutiques"}
                                    {tab === "clients" && "Dépenses clients"}
                                    {tab === "transactions" && "Transactions"}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Statistiques principales */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {financialStats.map((stat) => (
                            <motion.div
                                key={stat.title}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6 hover:shadow-xl transition-all duration-300"
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <span className={`text-sm font-medium flex items-center gap-1 ${
                                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-emerald-900 mb-1">
                                    {formatCurrency(parseInt(stat.amount))}
                                </h3>
                                <p className="text-emerald-600/70 text-sm">{stat.title}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Contenu des onglets */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Graphique des revenus */}
                            <motion.div
                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-emerald-600" />
                                        Revenus mensuels
                                    </h3>
                                    <select className="text-sm border border-emerald-200 rounded-lg px-3 py-1 bg-white">
                                        <option>30 derniers jours</option>
                                        <option>3 derniers mois</option>
                                        <option>Cette année</option>
                                    </select>
                                </div>
                                <div className="h-64 bg-gradient-to-b from-emerald-50 to-transparent rounded-lg flex items-end justify-center p-4">
                                    <div className="text-center text-emerald-600">
                                        <PieChart className="w-12 h-12 mx-auto mb-2 text-emerald-300" />
                                        <p className="text-sm">Graphique des revenus</p>
                                        <p className="text-xs text-emerald-400">(Intégration à venir)</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Transactions récentes */}
                            <motion.div
                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-emerald-600" />
                                        Transactions récentes
                                    </h3>
                                    <Eye className="w-5 h-5 text-emerald-400 cursor-pointer" />
                                </div>
                                <div className="space-y-4">
                                    {recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${
                                                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                    {transaction.type === 'income' ? 
                                                        <ArrowDownLeft className="w-4 h-4 text-green-600" /> : 
                                                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="font-medium text-emerald-900 text-sm">
                                                        {transaction.description}
                                                    </p>
                                                    <p className="text-xs text-emerald-600/70">{transaction.from} • {transaction.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-semibold ${
                                                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                                </p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    transaction.status === 'completed' ? 
                                                    'bg-green-100 text-green-700' : 
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {transaction.status === 'completed' ? 'Complété' : 'En attente'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {activeTab === "boutiques" && (
                        <motion.div
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-emerald-900 text-lg">Finances des boutiques</h3>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher une boutique..."
                                            className="pl-10 pr-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                        />
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-2 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
                                        <Filter className="w-4 h-4" />
                                        Filtres
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-emerald-100">
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Boutique</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Chiffre d'affaires</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Commission</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Solde</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Transactions</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Statut</th>
                                            <th className="text-left py-3 px-4 text-emerald-600 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boutiquesFinances.map((boutique) => (
                                            <tr key={boutique.id} className="border-b border-emerald-50 hover:bg-emerald-50/50">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-emerald-900">{boutique.name}</div>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-emerald-900">
                                                    {formatCurrency(boutique.revenue)}
                                                </td>
                                                <td className="py-3 px-4 text-blue-600 font-medium">
                                                    {formatCurrency(boutique.commission)}
                                                </td>
                                                <td className="py-3 px-4 font-bold text-green-600">
                                                    {formatCurrency(boutique.balance)}
                                                </td>
                                                <td className="py-3 px-4 text-emerald-600">
                                                    {boutique.transactions} trans.
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        boutique.status === 'active' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {boutique.status === 'active' ? 'Active' : 'En attente'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                                        Voir détails
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "clients" && (
                        <motion.div
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-emerald-900 text-lg">Dépenses des clients</h3>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher un client..."
                                            className="pl-10 pr-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {clientsFinances.map((client) => (
                                    <div key={client.id} className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 hover:bg-white transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-semibold">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-emerald-900">{client.name}</h4>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    client.status === 'active' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {client.status === 'active' ? 'Actif' : 'Inactif'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-emerald-600/70">Total dépensé:</span>
                                                <span className="font-semibold text-emerald-900">{formatCurrency(client.totalSpent)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-emerald-600/70">Commandes:</span>
                                                <span className="font-medium text-emerald-900">{client.orders} cmd</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-emerald-600/70">Dernier achat:</span>
                                                <span className="text-emerald-900">{client.lastPurchase}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "transactions" && (
                        <motion.div
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-emerald-900 text-lg">Toutes les transactions</h3>
                                <div className="flex gap-3">
                                    <select className="border border-emerald-200 rounded-lg px-3 py-2 bg-white text-sm">
                                        <option>Toutes les transactions</option>
                                        <option>Revenus seulement</option>
                                        <option>Dépenses seulement</option>
                                    </select>
                                    <button className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                        <Plus className="w-4 h-4" />
                                        Nouvelle transaction
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-emerald-100 hover:shadow-md transition-all duration-200">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${
                                                transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                                            }`}>
                                                {transaction.type === 'income' ? 
                                                    <ArrowDownLeft className="w-5 h-5 text-green-600" /> : 
                                                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                                                }
                                            </div>
                                            <div>
                                                <p className="font-semibold text-emerald-900">{transaction.description}</p>
                                                <p className="text-sm text-emerald-600/70">{transaction.from} • {transaction.date}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                                                    transaction.category === 'commission' ? 'bg-blue-100 text-blue-700' :
                                                    transaction.category === 'client_purchase' ? 'bg-purple-100 text-purple-700' :
                                                    transaction.category === 'service_fee' ? 'bg-cyan-100 text-cyan-700' :
                                                    'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {transaction.category === 'commission' ? 'Commission' :
                                                     transaction.category === 'client_purchase' ? 'Achat client' :
                                                     transaction.category === 'service_fee' ? 'Frais service' : 'Remboursement'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-bold ${
                                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                            </p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                transaction.status === 'completed' ? 
                                                'bg-green-100 text-green-700' : 
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {transaction.status === 'completed' ? 'Complété' : 'En attente'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Finances;