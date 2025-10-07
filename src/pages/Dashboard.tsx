import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import {
    MapPin,
    Trash2,
    Leaf,
    BarChart3,
    TrendingUp,
    PieChart,
    AlertCircle,
} from "lucide-react";

// Servicios y Hooks  
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ParcelService } from "../service/parcelService";

// Componentes
import SidebarComponent from "../widgets/sidebar/sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ParcelList from "../components/dashboard/ParcelList";
import DeletedParcelList from "../components/dashboard/DeletedParcelList";
import LineChartReal from "../components/dashboard/LineChartReal";
import BarChartReal from "../components/dashboard/BarChartReal";
import PieChartReal from "../components/dashboard/PieChartReal";
import MapDemo from "../components/dashboard/MapDemo";
import Card from "../components/dashboard/card";
import LiveSensors from "../components/dashboard/LiveSensors";

import type { Parcel } from "../types/parcel";
import { temperaturaData, humedadData, cultivosDistribucion } from "../types/mockData";

const DashboardParcels = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [parcels, setParcels] = useState<Parcel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

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
        setError(null);
        try {
            const { data, error: fetchError } = await ParcelService.getAllParcels();
            if (fetchError) {
                setError('Error al cargar las parcelas');
                console.error(fetchError);
                toast.error('No se pudieron cargar las parcelas');
            } else {
                setParcels((data || []).slice(0, 2));
            }
        } catch (err) {
            setError('Error inesperado al cargar las parcelas');
            console.error(err);
            toast.error('Error inesperado');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteParcel = async (id: string) => {
        const promise = ParcelService.deleteParcel(id);

        toast.promise(promise, {
            loading: 'Eliminando parcela...',
            success: () => {
                loadParcels();
                return 'Parcela eliminada exitosamente';
            },
            error: 'Error al eliminar la parcela',
        });
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            toast.error('Error al cerrar sesión');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-emerald-50 flex">
            <Toaster 
                position="top-right" 
                toastOptions={{
                    duration: 4000,
                    style: { 
                        background: '#1f2937', 
                        color: '#fff',
                        borderRadius: '0.75rem',
                        padding: '1rem'
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }} 
            />
            
            <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 lg:ml-64">
                <DashboardHeader
                    user={user}
                    onLogout={handleLogout}
                    onSidebarOpen={() => setSidebarOpen(true)}
                />

                <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Error State */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-red-900">Error al cargar datos</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Sensores en Tiempo Real - Full Width */}
                    <section className="mb-8">
                        <LiveSensors />
                    </section>

                    {/* Grid Principal */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        {/* Columna Izquierda - Parcelas */}
                        <aside className="xl:col-span-4 space-y-6">
                            <Card 
                                title="Parcelas Vigentes" 
                                icon={<Leaf className="w-5 h-5 text-emerald-600" />}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
                                    </div>
                                ) : (
                                    <ParcelList parcels={parcels} onDelete={handleDeleteParcel} />
                                )}
                            </Card>

                            <Card 
                                title="Parcelas Eliminadas" 
                                icon={<Trash2 className="w-5 h-5 text-red-500" />}
                            >
                                <DeletedParcelList deletedParcels={deletedParcels} />
                            </Card>
                        </aside>

                        {/* Columna Derecha - Gráficas y Mapa */}
                        <section className="xl:col-span-8 space-y-6">
                            {/* Grid de Gráficas */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card
                                    title="Temperatura"
                                    icon={<TrendingUp className="w-5 h-5 text-red-500" />}
                                    className="h-[320px]"
                                >
                                    <div className="h-[240px] flex items-center justify-center">
                                        <LineChartReal data={temperaturaData} />
                                    </div>
                                </Card>

                                <Card
                                    title="Humedad"
                                    icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
                                    className="h-[320px]"
                                >
                                    <div className="h-[240px] flex items-center justify-center">
                                        <BarChartReal data={humedadData} />
                                    </div>
                                </Card>

                                <Card
                                    title="Cultivos"
                                    icon={<PieChart className="w-5 h-5 text-purple-500" />}
                                    className="h-[320px]"
                                >
                                    <div className="h-[240px] flex items-center justify-center">
                                        <PieChartReal data={cultivosDistribucion} />
                                    </div>
                                </Card>
                            </div>

                            {/* Mapa - Full Width */}
                            <Card
                                title="Ubicación de Parcelas"
                                icon={<MapPin className="w-5 h-5 text-emerald-600" />}
                                className="h-[500px]"
                            >
                                <div className="h-[420px] rounded-lg overflow-hidden">
                                    <MapDemo />
                                </div>
                            </Card>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardParcels;