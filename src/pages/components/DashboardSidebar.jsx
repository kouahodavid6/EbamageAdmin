import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Store, FolderOpen, Settings, Users, ShoppingCart, MapPin, LogOut, BarChart3 } from 'lucide-react';
import useAuthStore from '../../stores/auth.store';
import { useNavigate } from 'react-router-dom';
import ConfirmLogoutModal from '../../components/ConfirmLogoutModal';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const DashboardSidebar = () => {
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleConfirmLogout = async () => {
        try {
            localStorage.removeItem('token');
            logout();
            navigate('/login');
            toast.success('Déconnexion effectuée avec succès !');
        } catch (error) {
            toast.error('Erreur lors de la déconnexion !');
            console.error('Erreur:', error);
        }
    };

    const isActive = (path) => location.pathname === path;

    const sidebarItems = [
        {
            path: '/dashboard',
            name: 'Tableau de bord',
            icon: <BarChart3 className="h-5 w-5" />,
        },
        {
            path: '/categories',
            name: 'Catégories',
            icon: <FolderOpen className="h-5 w-5" />,
        },
        {
            path: '/variations',
            name: 'Variations',
            icon: <Settings className="h-5 w-5" />,
        },
        {
            path: '/boutiques',
            name: 'Boutiques',
            icon: <Store className="h-5 w-5" />,
        },
        {
            path: '/clients',
            name: 'Clients',
            icon: <Users className="h-5 w-5" />,
        },
        {
            path: '/commandes',
            name: 'Commandes',
            icon: <ShoppingCart className="h-5 w-5" />,
        },
        {
            path: '/localisations',
            name: 'Localisations',
            icon: <MapPin className="h-5 w-5" />,
        },
    ];

    const itemVariants = {
        hover: {
            x: 5,
            transition: { duration: 0.2 }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.02,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.98,
            transition: { duration: 0.1 }
        }
    };

    return (
        <>
            <div className="h-screen w-64 bg-gradient-to-b from-white to-emerald-50/80 text-emerald-700 fixed left-0 top-0 z-30 border-r border-emerald-100/60 backdrop-blur-sm shadow-xl">
        {/* Logo en haut du menu */}
        <div className="px-6 py-4 border-b border-emerald-100">
            <Link
                to="/dashboard-boutique"
                className="flex items-center space-x-2"
            >
                <div>
                    <Store className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="font-bold text-xl text-emerald-800">Ebamage</div>
            </Link>
        </div>

                {/* Liens de navigation */}
                <div className="py-4 px-6">
                    <ul>
                        {sidebarItems.map((item, index) => (
                            <motion.li 
                                key={index}
                                className="mb-1"
                                variants={itemVariants}
                                whileHover="hover"
                            >
                                <Link
                                    to={item.path}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                        isActive(item.path)
                                        ? 'bg-gradient-to-r from-emerald-50 to-emerald-50/50 text-emerald-600 border-l-4 border-emerald-500 shadow-sm'
                                        : 'text-emerald-600 hover:bg-emerald-50/50 hover:text-emerald-700'
                                    }`}
                                >
                                    <div className={`${isActive(item.path) ? 'text-emerald-500' : 'text-emerald-400'}`}>
                                        {item.icon}
                                    </div>
                                    <span className="ml-2 font-medium">{item.name}</span>
                                </Link>
                            </motion.li>
                        ))}

                        {/* Bouton Déconnexion */}
                        <motion.li 
                            className="mt-6"
                            variants={itemVariants}
                            whileHover="hover"
                        >
                            <motion.button
                                onClick={() => setModalOpen(true)}
                                className="flex w-full items-center px-6 py-3 text-white bg-gradient-to-r from-emerald-500 to-emerald-500 hover:from-emerald-600 hover:to-emerald-600 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <LogOut className="h-5 w-5" />
                                <span className="ml-3 font-bold">Déconnexion</span>
                            </motion.button>
                        </motion.li>
                    </ul>
                </div>

                {/* Footer */}
                <motion.div 
                    className="absolute bottom-4 left-0 right-0 px-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="text-center">
                        <p className="text-xs text-emerald-400/80 font-medium">
                            Version 1.0 • Ebamage
                        </p>
                        <div className="flex justify-center gap-1 mt-1">
                            <div className="w-1 h-1 rounded-full bg-emerald-400/60"></div>
                            <div className="w-1 h-1 rounded-full bg-emerald-400/60"></div>
                            <div className="w-1 h-1 rounded-full bg-emerald-400/60"></div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Modal de confirmation déconnexion */}
            {isModalOpen &&
                createPortal(
                    <ConfirmLogoutModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        onConfirm={handleConfirmLogout}
                    />,
                    document.body
                )
            }
        </>
    );
};

export default DashboardSidebar;