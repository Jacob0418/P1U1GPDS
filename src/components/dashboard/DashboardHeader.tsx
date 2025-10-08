import { MapPin, Menu, Plus, LogOut } from "lucide-react";

const DashboardHeader = ({ user, onLogout, onSidebarOpen }) => (
    <header className="bg-white/80 backdrop-blur-lg border-b border-emerald-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <button
                    className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg text-white lg:hidden"
                    onClick={onSidebarOpen}
                    title="Abrir menú"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg hidden lg:block">
                    <MapPin className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Gestión de parcelas
                </h1>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                    {user?.email}
                </span>
                <button
                    onClick={onLogout}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center cursor-pointer"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                </button>
                {/* <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center cursor-pointer">
                    <Plus className="w-5 h-5 mr-2" />
                    Nueva Parcela
                </button> */}
            </div>
        </div>
    </header>
);

export default DashboardHeader;