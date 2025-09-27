import {
    MapPin,
    List,
    Trash2,
    BarChart3,
    PieChart,
    LineChart,
    X,
    Sprout
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const SidebarComponent = ({ open, onClose }: SidebarProps) => {
    return (
        <>
            <aside
                className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-xl z-50 transition-transform duration-300 ${
                    open ? "translate-x-0" : "-translate-x-full"
                } lg:hidden`}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-100">
                    <div className="flex items-center space-x-2">
                        <Sprout className="w-8 h-8 text-emerald-400" />
                        <span className="font-bold text-gray-900">Sistema Integral Agrícola</span>
                    </div>
                    <button
                        className="text-gray-500 hover:text-emerald-600"
                        onClick={onClose}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="mt-6 flex flex-col space-y-2 px-6">
                    <NavLink to="/dashboard/crud" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <List className="w-5 h-5 mr-2" /> CRUD de Parcelas
                    </NavLink>
                    <NavLink to="/dashboard/eliminadas" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <Trash2 className="w-5 h-5 mr-2" /> Parcelas Eliminadas
                    </NavLink>
                    <NavLink to="/dashboard/sensores" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <BarChart3 className="w-5 h-5 mr-2" /> Dashboard en Vivo
                    </NavLink>
                    <NavLink to="/dashboard/historico" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <LineChart className="w-5 h-5 mr-2" /> Histórico Temperatura
                    </NavLink>
                    <NavLink to="/dashboard/humedad" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <BarChart3 className="w-5 h-5 mr-2" /> Histórico Humedad
                    </NavLink>
                    <NavLink to="/dashboard/cultivos" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <PieChart className="w-5 h-5 mr-2" /> Distribución de Cultivos
                    </NavLink>
                    <NavLink to="/dashboard/mapa" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <MapPin className="w-5 h-5 mr-2" /> Mapa de Parcelas
                    </NavLink>
                </nav>
            </aside>
            <aside className="fixed top-0 left-0 z-50 hidden lg:flex flex-col h-screen w-64 bg-white border-r border-emerald-100 shadow-none">
                <div className="flex items-center space-x-2 px-6 py-4 border-b border-emerald-100 p-[1.75rem]">
                    <Sprout className="w-8 h-8 text-emerald-400" />
                    <span className="font-bold text-gray-900">Sistema Integral Agrícola</span>
                </div>
                <nav className="mt-6 flex flex-col space-y-2 px-6">
                    <NavLink to="/dashboard" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <BarChart3 className="w-5 h-5 mr-2" /> Dashboard
                    </NavLink>
                    <NavLink to="/dashboard/crud" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <List className="w-5 h-5 mr-2" /> CRUD de Parcelas
                    </NavLink>
                    <NavLink to="/dashboard/eliminadas" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <Trash2 className="w-5 h-5 mr-2" /> Parcelas Eliminadas
                    </NavLink>
                    {/* <NavLink to="/dashboard/sensores" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <BarChart3 className="w-5 h-5 mr-2" /> Dashboard en Vivo
                    </NavLink> */}
                    <NavLink to="/dashboard/historico" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <LineChart className="w-5 h-5 mr-2" /> Histórico Temperatura
                    </NavLink>
                    <NavLink to="/dashboard/humedad" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <BarChart3 className="w-5 h-5 mr-2" /> Histórico Humedad
                    </NavLink>
                    <NavLink to="/dashboard/cultivos" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <PieChart className="w-5 h-5 mr-2" /> Distribución de Cultivos
                    </NavLink>
                    <NavLink to="/dashboard/mapa" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <MapPin className="w-5 h-5 mr-2" /> Mapa de Parcelas
                    </NavLink>
                </nav>
            </aside>
        </>
    );
};

export default SidebarComponent;