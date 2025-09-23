import { Link, useLocation,  } from 'react-router-dom';
//useNavigate
//import toast from 'react-hot-toast';
import { useState } from 'react';
import { Store, LayoutDashboard, FolderOpen, Settings, Users, ShoppingCart, MapPin, LogOut } from 'lucide-react';
// import useAuthStore from '../../../stores/auth.store';
// import ConfirmLogoutModal from '../../../components/ConfirmLogoutModal';
import { createPortal } from 'react-dom';

const DashboardSidebar = () => {
    const location = useLocation();
//   const logout = useAuthStore((state) => state.logout);
    const [isModalOpen, setModalOpen] = useState(false);
  //const navigate = useNavigate();

//   const handleConfirmLogout = async () => {
//     try {
//       localStorage.removeItem('token');
//       logout();
//       navigate('/connexion');
//       toast.success('Déconnexion effectuée avec succès !');
//     } catch (error) {
//       toast.error('Erreur lors de la déconnexion !');
//       console.error('Erreur:', error);
//     }
//   };

    const isActive = (path) => location.pathname === path;

    const sidebarItems = [
        {
            path: '/',
            name: 'Tableau de bord',
            icon: <LayoutDashboard className="h-5 w-5" />,
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

    return (
        <>
            <div className="h-screen w-64 bg-white text-gray-500 fixed left-0 top-0 z-30">
                {/* Logo */}
                <div className="px-6 py-4 shadow-lg">
                    <Link to="/dashboard-admin" className="flex items-center space-x-2">
                        <Store className="h-8 w-8 text-pink-400" />
                        <div className="font-bold text-xl text-gray-800">TDL Admin</div>
                    </Link>
                </div>

                {/* Liens de navigation */}
                <div className="py-4 px-6">
                    <ul>
                        {sidebarItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive(item.path)
                                        ? 'bg-pink-50 text-pink-600 border-l-4 border-pink-500'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.icon}
                                    <span className="ml-3">{item.name}</span>
                                </Link>
                            </li>
                        ))}

                        {/* Bouton Déconnexion */}
                        <li className="mt-6">
                            <button
                                onClick={() => setModalOpen(true)}
                                className="flex w-full items-center px-6 py-3 text-white bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                <span className="ml-3 font-bold">Déconnexion</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Modal de confirmation déconnexion */}
            {isModalOpen &&
                createPortal(
                    <ConfirmLogoutModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        //onConfirm={handleConfirmLogout}
                    />,
                    document.body
                )
            }
        </>
    );
};

export default DashboardSidebar;
