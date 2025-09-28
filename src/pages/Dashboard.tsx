import { useState } from "react";
import {
    MapPin,
    Trash2,
    Plus,
    User,
    Leaf,
    BarChart3,
    LineChart,
    PieChart,
    Menu,
    LogOut,
} from "lucide-react";
import SidebarComponent from "../widgets/sidebar/sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const DashboardParcels = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const parcels = [
        {
        id: 1,
        name: "Parcela Norte",
        location: "21.12, -101.68",
        crop: "Maíz",
        manager: "Juan Pérez",
        },
        {
        id: 2,
        name: "Parcela Sur",
        location: "21.13, -101.69",
        crop: "Trigo",
        manager: "Ana López",
        },
    ];
    const deletedParcels = [
        {
        id: 3,
        name: "Parcela Este",
        location: "21.14, -101.70",
        crop: "Sorgo",
        manager: "Carlos Ruiz",
        deletedAt: "2025-09-20",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex">
        <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 lg:ml-64">
            <header className="bg-white/80 backdrop-blur-lg border-b border-emerald-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                <button
                    className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg text-white lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                    title="Abrir menú"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg hidden lg:block">
                    <MapPin className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Gestión de Parcelas
                </h1>
                </div>
                <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                {user?.email}
                            </span>
                            <button 
                                onClick={handleLogout}
                                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Salir
                            </button>
                            <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center cursor-pointer">
                                <Plus className="w-5 h-5 mr-2" />
                                Nueva Parcela
                            </button>
                        </div>
            </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-1 space-y-8">
                <div className="bg-white rounded-xl shadow-lg border border-emerald-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Leaf className="w-6 h-6 text-emerald-600 mr-2" />
                    Parcelas Vigentes
                </h2>
                <ul className="divide-y divide-gray-100">
                    {parcels.map((parcel) => (
                    <li
                        key={parcel.id}
                        className="py-4 flex items-center justify-between">
                        <div>
                        <div className="font-semibold text-gray-800">
                            {parcel.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" /> {parcel.location}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                            <Leaf className="w-4 h-4 mr-1" /> {parcel.crop}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                            <User className="w-4 h-4 mr-1" /> {parcel.manager}
                        </div>
                        </div>
                        <button
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar">
                        <Trash2 className="w-5 h-5" />
                        </button>
                    </li>
                    ))}
                </ul>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Trash2 className="w-6 h-6 text-red-500 mr-2" />
                    Parcelas Eliminadas
                </h2>
                <ul className="divide-y divide-gray-100">
                    {deletedParcels.map((parcel) => (
                    <li key={parcel.id} className="py-4">
                        <div className="font-semibold text-gray-800">
                        {parcel.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> {parcel.location}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                        <Leaf className="w-4 h-4 mr-1" /> {parcel.crop}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                        <User className="w-4 h-4 mr-1" /> {parcel.manager}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                        Eliminada: {parcel.deletedAt}
                        </div>
                    </li>
                    ))}
                </ul>
                </div>
            </section>

            <section className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-xl shadow-lg border border-emerald-200 p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-6 h-6 text-emerald-600 mr-2" />
                    Sensores en Vivo
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                    <LineChart className="w-8 h-8 mx-auto text-red-500 mb-2" />
                    <div className="text-2xl font-bold text-red-600">25.2°C</div>
                    <div className="text-sm text-gray-600">Temperatura</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                    <BarChart3 className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                    <div className="text-2xl font-bold text-blue-600">68%</div>
                    <div className="text-sm text-gray-600">Humedad</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                    <PieChart className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
                    <div className="text-2xl font-bold text-indigo-600">
                        Cultivos
                    </div>
                    <div className="text-sm text-gray-600">Distribución</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl">
                    <MapPin className="w-8 h-8 mx-auto text-green-500 mb-2" />
                    <div className="text-2xl font-bold text-green-600">Mapa</div>
                    <div className="text-sm text-gray-600">Parcelas</div>
                    </div>
                </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <LineChart className="w-5 h-5 text-red-500 mr-2" />
                    Histórico Temperatura
                    </h3>
                    <div className="h-40 flex items-center justify-center text-gray-400">
                    {/* [Gráfica de Línea] */}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
                    Histórico Humedad
                    </h3>
                    <div className="h-40 flex items-center justify-center text-gray-400">
                    {/* [Gráfica de Barras] */}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <PieChart className="w-5 h-5 text-indigo-500 mr-2" />
                    Distribución de Cultivos
                    </h3>
                    <div className="h-40 flex items-center justify-center text-gray-400">
                    {/* [Gráfica de Pastel] */}
                    </div>
                </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-emerald-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-6 h-6 text-green-600 mr-2" />
                    Mapa de Parcelas Vigentes
                </h2>
                <div className="h-64 rounded-xl bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center text-gray-400">
                    [Mapa interactivo]
                </div>
                </div>
            </section>
            </main>
        </div>
        </div>
    );
};

export default DashboardParcels;