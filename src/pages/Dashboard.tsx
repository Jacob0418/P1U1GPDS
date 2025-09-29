import { useState, useEffect } from "react";
import {
    MapPin,
    Trash2,
    Leaf,
    BarChart3,
    LineChart as LucideLineChart,
    PieChart as LucidePieChart,
} from "lucide-react";
import SidebarComponent from "../widgets/sidebar/sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ParcelService } from "../service/parcelService";
import type { Parcel } from "../types/parcel";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ParcelList from "../components/dashboard/ParcelList";
import DeletedParcelList from "../components/dashboard/DeletedParcelList";
import LineChartReal from "../components/dashboard/LineChartReal";
import BarChartReal from "../components/dashboard/BarChartReal";
import PieChartReal from "../components/dashboard/PieChartReal";
import MapDemo from "../components/dashboard/MapDemo";
import type { PieChartData, SensorData } from "../types/sensorData";

const temperaturaData: SensorData[] = [
    { timestamp: "2025-09-29T01:00:00", value: 28.5 },
    { timestamp: "2025-09-29T02:00:00", value: 31.97 },
    { timestamp: "2025-09-29T03:00:00", value: 38.87 },
    { timestamp: "2025-09-29T04:00:00", value: 37.98 },
];

const humedadData: SensorData[] = [
    { timestamp: "2025-09-29T01:00:00", value: 55.2 },
    { timestamp: "2025-09-29T02:00:00", value: 77.69 },
    { timestamp: "2025-09-29T03:00:00", value: 25.44 },
    { timestamp: "2025-09-29T04:00:00", value: 62.17 },
];

const cultivosDistribucion: PieChartData[] = [
    { crop: "Maíz", value: 40 },
    { crop: "Trigo", value: 25 },
    { crop: "Sorgo", value: 20 },
    { crop: "Soja", value: 15 },
];

const DashboardParcels = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [parcels, setParcels] = useState<Parcel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    const handleDeleteParcel = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta parcela?')) return;
        const { error } = await ParcelService.deleteParcel(id);
        if (error) {
            setError('Error al eliminar la parcela');
            console.error(error);
        } else {
            setSuccess('Parcela eliminada exitosamente');
            loadParcels();
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

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

    useEffect(() => {
        loadParcels();
    }, []);

    const loadParcels = async () => {
        setLoading(true);
        const { data, error } = await ParcelService.getAllParcels();
        if (error) {
            setError('Error al cargar las parcelas');
            console.error(error);
        } else {
            setParcels((data || []).slice(0, 2));
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex">
            <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 lg:ml-64">
                <DashboardHeader
                    user={user}
                    onLogout={handleLogout}
                    onSidebarOpen={() => setSidebarOpen(true)}
                />

                <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <section className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-xl shadow-lg border border-emerald-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Leaf className="w-6 h-6 text-emerald-600 mr-2" />
                                Parcelas Vigentes
                            </h2>
                            <ParcelList parcels={parcels} onDelete={handleDeleteParcel} />
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Trash2 className="w-6 h-6 text-red-500 mr-2" />
                                Parcelas Eliminadas
                            </h2>
                            <DeletedParcelList deletedParcels={deletedParcels} />
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
                                    <LucideLineChart className="w-8 h-8 mx-auto text-red-500 mb-2" />
                                    <div className="text-2xl font-bold text-red-600">25.2°C</div>
                                    <div className="text-sm text-gray-600">Temperatura</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                                    <BarChart3 className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                                    <div className="text-2xl font-bold text-blue-600">68%</div>
                                    <div className="text-sm text-gray-600">Humedad</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                                    <LucidePieChart className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
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
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 min-h-[300px] flex flex-col justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                    <LucideLineChart className="w-5 h-5 text-red-500 mr-2" />
                                    Histórico Temperatura
                                </h3>
                                <div className="flex-1 flex items-center">
                                    <LineChartReal data={temperaturaData} />
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 min-h-[300px] flex flex-col justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                    <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
                                    Histórico Humedad
                                </h3>
                                <div className="flex-1 flex items-center">
                                    <BarChartReal data={humedadData} />
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 min-h-[300px] flex flex-col justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                    <LucidePieChart className="w-5 h-5 text-indigo-500 mr-2" />
                                    Distribución de Cultivos
                                </h3>
                                <div className="flex-1 flex items-center">
                                    <PieChartReal data={cultivosDistribucion} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-emerald-200 p-6 min-h-[400px] flex flex-col justify-between">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-6 h-6 text-green-600 mr-2" />
                                Mapa de Parcelas Vigentes
                            </h2>
                            <div className="h-[350px]">
                                <MapDemo />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default DashboardParcels;