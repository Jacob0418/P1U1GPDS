import { useState, useEffect } from "react";
import {
    CloudRain,
    Sun,
    ArrowLeft,
    Database,
    ChevronLeft,
    ChevronRight,
    SkipBack,
    SkipForward,
    Thermometer,
    Droplets,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { readingsService, type SensorReading } from "../service/readingsService";
import type { SensorData } from "../types/sensorData";
import SidebarComponent from "../widgets/sidebar/sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import LineChartReal from "../components/dashboard/LineChartReal";
import BarChartReal from "../components/dashboard/BarChartReal";

const SensorHistorics = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Estados para datos históricos completos - TODOS los sensores
    const [historicalData, setHistoricalData] = useState<{
        temperature: SensorReading[];
        humidity: SensorReading[];
        rain: SensorReading[];
        radiation: SensorReading[];
    }>({
        temperature: [],
        humidity: [],
        rain: [],
        radiation: [],
    });

    // Estados para gráficas con paginación - TODOS los sensores
    const [chartData, setChartData] = useState<{
        temperature: SensorData[];
        humidity: SensorData[];
        rain: SensorData[];
        radiation: SensorData[];
    }>({
        temperature: [],
        humidity: [],
        rain: [],
        radiation: [],
    });

    // Estados para paginación - TODOS los sensores
    const [pagination, setPagination] = useState({
        temperature: { currentPage: 1, pageSize: 100, totalPages: 1 },
        humidity: { currentPage: 1, pageSize: 100, totalPages: 1 },
        rain: { currentPage: 1, pageSize: 100, totalPages: 1 },
        radiation: { currentPage: 1, pageSize: 100, totalPages: 1 }
    });

    const [dataLoadTime, setDataLoadTime] = useState<Date | null>(null);
    
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

    // Función para convertir SensorReading a SensorData para las gráficas
    const convertToChartData = (readings: SensorReading[], startIndex: number = 0): SensorData[] => {
        return readings.map((reading, index) => ({
            timestamp: `${startIndex + index + 1}`, // Usar índice global para el eje X
            value: reading.value,
            originalTime: reading.ts // Mantener el timestamp original para tooltip
        }));
    };

    // Función para formatear fecha de manera legible
    const formatTimestamp = (ts: string) => {
        const date = new Date(ts);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
            full: date.toLocaleString()
        };
    };

    // Función para actualizar datos de la gráfica basados en la paginación
    const updateChartData = (sensorType: 'temperature' | 'humidity' | 'rain' | 'radiation', page: number) => {
        const data = historicalData[sensorType];
        const pageSize = pagination[sensorType].pageSize;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        
        const pageData = data.slice(startIndex, endIndex);
        const chartPageData = convertToChartData(pageData, startIndex);
        
        setChartData(prev => ({
            ...prev,
            [sensorType]: chartPageData
        }));

        console.log(`📊 ${sensorType} - Página ${page}: mostrando registros ${startIndex + 1} a ${Math.min(endIndex, data.length)} de ${data.length}`);
    };

    // Funciones de navegación para paginación
    const goToPage = (sensorType: 'temperature' | 'humidity' | 'rain' | 'radiation', page: number) => {
        const maxPage = pagination[sensorType].totalPages;
        const newPage = Math.max(1, Math.min(page, maxPage));
        
        setPagination(prev => ({
            ...prev,
            [sensorType]: { ...prev[sensorType], currentPage: newPage }
        }));
        
        updateChartData(sensorType, newPage);
    };

    const nextPage = (sensorType: 'temperature' | 'humidity' | 'rain' | 'radiation') => {
        const currentPage = pagination[sensorType].currentPage;
        goToPage(sensorType, currentPage + 1);
    };

    const prevPage = (sensorType: 'temperature' | 'humidity' | 'rain' | 'radiation') => {
        const currentPage = pagination[sensorType].currentPage;
        goToPage(sensorType, currentPage - 1);
    };

    const firstPage = (sensorType: 'temperature' | 'humidity' | 'rain' | 'radiation') => {
        goToPage(sensorType, 1);
    };

    const lastPage = (sensorType: 'temperature' | 'humidity' | 'rain' | 'radiation') => {
        const totalPages = pagination[sensorType].totalPages;
        goToPage(sensorType, totalPages);
    };

    // Función para cargar TODOS los datos históricos (una sola vez)
    const loadAllHistoricalData = async () => {
        setLoading(true);
        try {
            console.log('🔄 Cargando TODOS los datos históricos de los 4 sensores...');
            
            const [temperatureHistorical, humidityHistorical, rainHistorical, radiationHistorical] = await Promise.all([
                readingsService.getTemperatureHistorical(),
                readingsService.getHumidityHistorical(),
                readingsService.getRainHistorical(),
                readingsService.getRadiationHistorical(),
            ]);

            console.log('📊 Datos históricos completos recibidos:', {
                temperature: temperatureHistorical.length,
                humidity: humidityHistorical.length,
                rain: rainHistorical.length,
                radiation: radiationHistorical.length,
            });

            // Ordenar datos por timestamp (más antiguos primero)
            const sortedTemperatureData = temperatureHistorical.sort((a, b) => 
                new Date(a.ts).getTime() - new Date(b.ts).getTime()
            );
            
            const sortedHumidityData = humidityHistorical.sort((a, b) => 
                new Date(a.ts).getTime() - new Date(b.ts).getTime()
            );
            
            const sortedRainData = rainHistorical.sort((a, b) => 
                new Date(a.ts).getTime() - new Date(b.ts).getTime()
            );
            
            const sortedRadiationData = radiationHistorical.sort((a, b) => 
                new Date(a.ts).getTime() - new Date(b.ts).getTime()
            );

            // Guardar TODOS los datos para estadísticas
            const newHistoricalData = {
                temperature: sortedTemperatureData,
                humidity: sortedHumidityData,
                rain: sortedRainData,
                radiation: sortedRadiationData,
            };

            setHistoricalData(newHistoricalData);

            // Calcular paginación para todos los sensores
            const pageSize = 100;
            const temperatureTotalPages = Math.ceil(sortedTemperatureData.length / pageSize);
            const humidityTotalPages = Math.ceil(sortedHumidityData.length / pageSize);
            const rainTotalPages = Math.ceil(sortedRainData.length / pageSize);
            const radiationTotalPages = Math.ceil(sortedRadiationData.length / pageSize);

            setPagination({
                temperature: { currentPage: 1, pageSize, totalPages: temperatureTotalPages },
                humidity: { currentPage: 1, pageSize, totalPages: humidityTotalPages },
                rain: { currentPage: 1, pageSize, totalPages: rainTotalPages },
                radiation: { currentPage: 1, pageSize, totalPages: radiationTotalPages }
            });

            // Cargar primera página de cada sensor
            const firstPageTemperature = sortedTemperatureData.slice(0, pageSize);
            const firstPageHumidity = sortedHumidityData.slice(0, pageSize);
            const firstPageRain = sortedRainData.slice(0, pageSize);
            const firstPageRadiation = sortedRadiationData.slice(0, pageSize);

            setChartData({
                temperature: convertToChartData(firstPageTemperature, 0),
                humidity: convertToChartData(firstPageHumidity, 0),
                rain: convertToChartData(firstPageRain, 0),
                radiation: convertToChartData(firstPageRadiation, 0)
            });

            setDataLoadTime(new Date());

            console.log('📊 Paginación configurada para todos los sensores:', {
                temperature: { total: sortedTemperatureData.length, pages: temperatureTotalPages, pageSize },
                humidity: { total: sortedHumidityData.length, pages: humidityTotalPages, pageSize },
                rain: { total: sortedRainData.length, pages: rainTotalPages, pageSize },
                radiation: { total: sortedRadiationData.length, pages: radiationTotalPages, pageSize }
            });

        } catch (error) {
            console.error('❌ Error loading all historical data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos una sola vez al montar el componente
    useEffect(() => {
        loadAllHistoricalData();
    }, []);

    // Calcular estadísticas para mostrar en la UI
    const getStatistics = (data: SensorReading[], unit: string) => {
        if (data.length === 0) return null;
        
        const values = data.map(d => d.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        
        return { min, max, avg, unit, total: values.length };
    };

    const temperatureStats = getStatistics(historicalData.temperature, '°C');
    const humidityStats = getStatistics(historicalData.humidity, '%');
    const rainStats = getStatistics(historicalData.rain, 'mm');
    const radiationStats = getStatistics(historicalData.radiation, 'W/m²');

    // Componente de controles de paginación
    const PaginationControls = ({ sensorType, sensorName }: { 
        sensorType: 'temperature' | 'humidity' | 'rain' | 'radiation', 
        sensorName: string 
    }) => {
        const currentPagination = pagination[sensorType];
        const { currentPage, totalPages } = currentPagination;
        
        return (
            <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => firstPage(sensorType)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        title="Primera página"
                    >
                        <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => prevPage(sensorType)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                        Página {currentPage} de {totalPages}
                    </span>
                    <span className="text-xs text-gray-500">
                        {sensorName}: {((currentPage - 1) * currentPagination.pageSize) + 1} - {Math.min(currentPage * currentPagination.pageSize, historicalData[sensorType].length)} de {historicalData[sensorType].length}
                    </span>
                </div>
                
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => nextPage(sensorType)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => lastPage(sensorType)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        title="Última página"
                    >
                        <SkipForward className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
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

                <main className="max-w-7xl mx-auto px-4 py-10">
                    {/* Header de la página */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 mr-1" />
                                    Volver al Dashboard
                                </button>
                            </div>
                            {dataLoadTime && (
                                <div className="text-sm text-gray-500 flex items-center">
                                    <Database className="w-4 h-4 mr-1" />
                                    Datos cargados: {dataLoadTime.toLocaleTimeString()}
                                </div>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mt-4">
                            Históricos completos de sensores
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Visualización paginada de todos los datos históricos de temperatura, humedad, lluvia y radiación solar
                        </p>
                    </div>

                    {/* Estadísticas generales - Grid de 4 columnas */}
                    {(temperatureStats || humidityStats || rainStats || radiationStats) && (
                        <div className="mb-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {temperatureStats && (
                                <div className="bg-white rounded-xl shadow-lg border border-red-200 p-4">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                        <Thermometer className="w-4 h-4 text-red-500 mr-2" />
                                        Temperatura
                                    </h3>
                                    <div className="space-y-1 text-xs">
                                        <div>
                                            <p className="text-gray-500">Total</p>
                                            <p className="font-bold text-red-600">{temperatureStats.total}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Promedio</p>
                                            <p className="font-bold text-red-600">{temperatureStats.avg.toFixed(1)} {temperatureStats.unit}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Rango</p>
                                            <p className="font-bold text-gray-600 text-xs">{temperatureStats.min.toFixed(1)} - {temperatureStats.max.toFixed(1)} {temperatureStats.unit}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {humidityStats && (
                                <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-4">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                        <Droplets className="w-4 h-4 text-blue-500 mr-2" />
                                        Humedad
                                    </h3>
                                    <div className="space-y-1 text-xs">
                                        <div>
                                            <p className="text-gray-500">Total</p>
                                            <p className="font-bold text-blue-600">{humidityStats.total}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Promedio</p>
                                            <p className="font-bold text-blue-600">{humidityStats.avg.toFixed(1)} {humidityStats.unit}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Rango</p>
                                            <p className="font-bold text-gray-600 text-xs">{humidityStats.min.toFixed(1)} - {humidityStats.max.toFixed(1)} {humidityStats.unit}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {rainStats && (
                                <div className="bg-white rounded-xl shadow-lg border border-indigo-200 p-4">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                        <CloudRain className="w-4 h-4 text-indigo-500 mr-2" />
                                        Lluvia
                                    </h3>
                                    <div className="space-y-1 text-xs">
                                        <div>
                                            <p className="text-gray-500">Total</p>
                                            <p className="font-bold text-indigo-600">{rainStats.total}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Promedio</p>
                                            <p className="font-bold text-indigo-600">{rainStats.avg.toFixed(1)} {rainStats.unit}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Rango</p>
                                            <p className="font-bold text-gray-600 text-xs">{rainStats.min.toFixed(1)} - {rainStats.max.toFixed(1)} {rainStats.unit}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {radiationStats && (
                                <div className="bg-white rounded-xl shadow-lg border border-yellow-200 p-4">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                        <Sun className="w-4 h-4 text-yellow-500 mr-2" />
                                        Radiación
                                    </h3>
                                    <div className="space-y-1 text-xs">
                                        <div>
                                            <p className="text-gray-500">Total</p>
                                            <p className="font-bold text-yellow-600">{radiationStats.total}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Promedio</p>
                                            <p className="font-bold text-yellow-600">{radiationStats.avg.toFixed(0)} {radiationStats.unit}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Rango</p>
                                            <p className="font-bold text-gray-600 text-xs">{radiationStats.min.toFixed(0)} - {radiationStats.max.toFixed(0)} {radiationStats.unit}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                            <p className="mt-4 text-gray-600">Cargando datos históricos completos...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* 1. Gráfica de Temperatura - Card compacto */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <Thermometer className="w-5 h-5 text-red-500 mr-2" />
                                        Histórico de Temperatura
                                    </h2>
                                    <div className="text-sm text-gray-500">
                                        Página {pagination.temperature.currentPage} de {pagination.temperature.totalPages}
                                    </div>
                                </div>
                                <div className="h-[150px] mb-3">
                                    <LineChartReal data={chartData.temperature} color="#ef4444" />
                                </div>
                                <PaginationControls sensorType="temperature" sensorName="Temperatura" />
                            </div>

                            {/* 2. Gráfica de Humedad - Ancho completo */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <Droplets className="w-6 h-6 text-blue-500 mr-3" />
                                        Histórico de Humedad
                                    </h2>
                                    <div className="text-sm text-gray-500">
                                        Página {pagination.humidity.currentPage} de {pagination.humidity.totalPages}
                                    </div>
                                </div>
                                <div className="h-[400px]">
                                    <BarChartReal data={chartData.humidity} color="#3b82f6" />
                                </div>
                                <PaginationControls sensorType="humidity" sensorName="Humedad" />
                            </div>

                            {/* 3. Gráfica de Lluvia - Card compacto con color morado/índigo */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <CloudRain className="w-5 h-5 text-indigo-500 mr-2" />
                                        Histórico de Lluvia
                                    </h2>
                                    <div className="text-sm text-gray-500">
                                        Página {pagination.rain.currentPage} de {pagination.rain.totalPages}
                                    </div>
                                </div>
                                <div className="h-[150px] mb-3">
                                    <LineChartReal data={chartData.rain} color="#6366f1" />
                                </div>
                                <PaginationControls sensorType="rain" sensorName="Lluvia" />
                            </div>

                            {/* 4. Gráfica de Radiación Solar - Ancho completo con color amarillo */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <Sun className="w-6 h-6 text-yellow-500 mr-3" />
                                        Histórico de Radiación Solar
                                    </h2>
                                    <div className="text-sm text-gray-500">
                                        Página {pagination.radiation.currentPage} de {pagination.radiation.totalPages}
                                    </div>
                                </div>
                                <div className="h-[400px]">
                                    <BarChartReal data={chartData.radiation} color="#eab308" />
                                </div>
                                <PaginationControls sensorType="radiation" sensorName="Radiación" />
                            </div>
                        </div>
                    )}

                    {/* Información técnica - Grid de 4 columnas */}
                    <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                <Thermometer className="w-4 h-4 text-red-500 mr-2" />
                                Temperatura
                            </h3>
                            <div className="space-y-1 text-xs text-gray-600">
                                <p><strong>Unidad:</strong> Grados Celsius (°C)</p>
                                <p><strong>Tipo:</strong> Temperatura ambiental</p>
                                <p><strong>Páginas:</strong> {pagination.temperature.totalPages}</p>
                                <p><strong>Registros:</strong> {historicalData.temperature.length}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                <Droplets className="w-4 h-4 text-blue-500 mr-2" />
                                Humedad
                            </h3>
                            <div className="space-y-1 text-xs text-gray-600">
                                <p><strong>Unidad:</strong> Porcentaje (%)</p>
                                <p><strong>Tipo:</strong> Humedad relativa</p>
                                <p><strong>Páginas:</strong> {pagination.humidity.totalPages}</p>
                                <p><strong>Registros:</strong> {historicalData.humidity.length}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                <CloudRain className="w-4 h-4 text-indigo-500 mr-2" />
                                Lluvia
                            </h3>
                            <div className="space-y-1 text-xs text-gray-600">
                                <p><strong>Unidad:</strong> Milímetros (mm)</p>
                                <p><strong>Tipo:</strong> Precipitación acumulada</p>
                                <p><strong>Páginas:</strong> {pagination.rain.totalPages}</p>
                                <p><strong>Registros:</strong> {historicalData.rain.length}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                                <Sun className="w-4 h-4 text-yellow-500 mr-2" />
                                Radiación
                            </h3>
                            <div className="space-y-1 text-xs text-gray-600">
                                <p><strong>Unidad:</strong> W/m²</p>
                                <p><strong>Tipo:</strong> Irradiancia solar</p>
                                <p><strong>Páginas:</strong> {pagination.radiation.totalPages}</p>
                                <p><strong>Registros:</strong> {historicalData.radiation.length}</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SensorHistorics;