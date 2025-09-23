import { Menu, Bell, User } from 'lucide-react';

const DashboardHeader = ({ title, toggleSidebar }) => {

    return (
        <header className="bg-white shadow-sm h-16 flex items-center px-4 sticky top-0 z-20">
            {/* Bouton pour afficher/cacher la sidebar (visible seulement en mobile) */}
            <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 md:hidden"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Titre de la page */}
            <h1 className="text-xl font-bold text-gray-800 ml-2 md:ml-0">{title}</h1>

            {/* Zone à droite : notifications + profil */}
            <div className="ml-auto flex items-center space-x-4 border-l pl-4 border-gray-200">
                {/* Bouton cloche de notifications */}
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
                    <Bell className="h-7 w-7" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader;
