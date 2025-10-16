import { useState } from "react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";

const Profil = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed md:sticky top-0 z-40 transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0 w-64 h-screen bg-white shadow-md`}
            >
                <div className="md:hidden flex justify-end p-4">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-gray-500 hover:text-gray-800 transition"
                        aria-label="Fermer la sidebar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <DashboardSidebar />
            </div>

            {/* Main */}
            <div className="flex-1 min-w-0 flex flex-col">
                <DashboardHeader
                    title="Profil"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-50">
                    
                </main>
            </div>
        </div>
    );
};

export default Profil;