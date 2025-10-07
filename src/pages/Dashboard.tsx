import { useState, useEffect } from "react";
import {
    MapPin,
    Trash2,
    Leaf,
    BarChart3,
    LineChart as LucideLineChart,
    PieChart as LucidePieChart,
    Thermometer,
    Droplets,
    CloudRain,
    Sun,
} from "lucide-react";
import SidebarComponent from "../widgets/sidebar/sidebar";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ParcelService } from "../service/parcelService";
import { readingsService, type SensorReading } from "../service/readingsService";
import type { Parcel } from "../types/parcel";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ParcelList from "../components/dashboard/ParcelList";
import DeletedParcelList from "../components/dashboard/DeletedParcelList";
import LineChartReal from "../components/dashboard/LineChartReal";
import BarChartReal from "../components/dashboard/BarChartReal";
import PieChartReal from "../components/dashboard/PieChartReal";
import MapDemo from "../components/dashboard/MapDemo";
import type { PieChartData, SensorData } from "../types/sensorData";

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
    
    // Estados para sensores en tiempo real
    const [sensorData, setSensorData] = useState<{
        temperature: SensorReading | null;
        humidity: SensorReading | null;
        rain: SensorReading | null;
        radiation: SensorReading | null;
    }>({
        temperature: null,
        humidity: null,
        rain: null,
        radiation: null,
    });
    
    // Nuevos estados para almacenar todos los datos y el índice actual
    const [allSensorData, setAllSensorData] = useState<{
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

    // Estados para datos históricos de las gráficas
    const [historicalData, setHistoricalData] = useState<{
        temperature: SensorReading[];
        humidity: SensorReading[];
    }>({
        temperature: [],
        humidity: [],
    });

    // Estados para gráficas dinámicas
    const [chartData, setChartData] = useState<{
        temperature: SensorData[];
        humidity: SensorData[];
    }>({
        temperature: [],
        humidity: [],
    });

    const [chartIndex, setChartIndex] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sensorLoading, setSensorLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    
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

    // Función para generar un índice aleatorio
    const getRandomIndex = (maxLength: number) => {
        return Math.floor(Math.random() * maxLength);
    };

    // Función para convertir SensorReading a SensorData para las gráficas
    const convertToChartData = (readings: SensorReading[]): SensorData[] => {
        return readings.map(reading => ({
            timestamp: reading.ts,
            value: reading.value
        }));
    };

    // Función para rotar los datos cada 5 segundos de manera aleatoria
    const rotateData = () => {
        if (allSensorData.temperature.length > 0) {
            const maxLength = Math.max(
                allSensorData.temperature.length,
                allSensorData.humidity.length,
                allSensorData.rain.length,
                allSensorData.radiation.length
            );
            
            // Generar índice aleatorio
            const randomIndex = getRandomIndex(maxLength);
            
            // Actualizar los datos con el índice aleatorio
            const newSensorData = {
                temperature: allSensorData.temperature.length > randomIndex ? allSensorData.temperature[randomIndex] : null,
                humidity: allSensorData.humidity.length > randomIndex ? allSensorData.humidity[randomIndex] : null,
                rain: allSensorData.rain.length > randomIndex ? allSensorData.rain[randomIndex] : null,
                radiation: allSensorData.radiation.length > randomIndex ? allSensorData.radiation[randomIndex] : null,
            };

            console.log(`🎲 Mostrando datos aleatorios - índice ${randomIndex}:`, newSensorData);
            setCurrentIndex(randomIndex);
            setSensorData(newSensorData);
            setLastUpdate(new Date());
        }
    };

    // Función para actualizar las gráficas dinámicamente con ventana deslizante aleatoria
    const updateChartData = () => {
        if (historicalData.temperature.length > 0 && historicalData.humidity.length > 0) {
            // Definir cuántos puntos mostrar en la gráfica
            const windowSize = 8;
            
            // Generar índices aleatorios para crear una ventana deslizante dinámica
            const tempIndices: number[] = [];
            const humidityIndices: number[] = [];
            
            // Crear arrays de índices aleatorios para temperatura
            for (let i = 0; i < windowSize; i++) {
                tempIndices.push(getRandomIndex(historicalData.temperature.length));
            }
            
            // Crear arrays de índices aleatorios para humedad
            for (let i = 0; i < windowSize; i++) {
                humidityIndices.push(getRandomIndex(historicalData.humidity.length));
            }
            
            // Obtener los datos basados en los índices aleatorios
            const tempSelectedData = tempIndices.map((index, i) => ({
                ...historicalData.temperature[index],
                // Agregar un identificador secuencial para el eje X
                displayIndex: i + 1
            }));
            
            const humiditySelectedData = humidityIndices.map((index, i) => ({
                ...historicalData.humidity[index],
                // Agregar un identificador secuencial para el eje X
                displayIndex: i + 1
            }));
            
            // Convertir a formato de gráfica con índices secuenciales
            const newTempData = tempSelectedData.map((reading, index) => ({
                timestamp: `T${index + 1}`, // Usar identificador simple para el eje X
                value: reading.value,
                originalTime: reading.ts // Mantener el timestamp original para tooltip
            }));
            
            const newHumidityData = humiditySelectedData.map((reading, index) => ({
                timestamp: `H${index + 1}`, // Usar identificador simple para el eje X
                value: reading.value,
                originalTime: reading.ts // Mantener el timestamp original para tooltip
            }));
            
            setChartData({
                temperature: newTempData,
                humidity: newHumidityData
            });
            
            console.log(`📊 Gráficas actualizadas - Temperatura: [${tempSelectedData.map(d => d.value.toFixed(1)).join(', ')}]`);
            console.log(`📊 Gráficas actualizadas - Humedad: [${humiditySelectedData.map(d => d.value.toFixed(1)).join(', ')}]`);
        }
    };

    // Función para actualizar los datos actuales basados en el índice (ahora también puede ser aleatorio)
    const updateCurrentSensorData = (allData: typeof allSensorData, index: number | null = null) => {
        let targetIndex = index;
        
        // Si no se proporciona un índice, usar uno aleatorio
        if (targetIndex === null && allData.temperature.length > 0) {
            const maxLength = Math.max(
                allData.temperature.length,
                allData.humidity.length,
                allData.rain.length,
                allData.radiation.length
            );
            targetIndex = getRandomIndex(maxLength);
        }
        
        if (targetIndex !== null) {
            const newSensorData = {
                temperature: allData.temperature.length > targetIndex ? allData.temperature[targetIndex] : null,
                humidity: allData.humidity.length > targetIndex ? allData.humidity[targetIndex] : null,
                rain: allData.rain.length > targetIndex ? allData.rain[targetIndex] : null,
                radiation: allData.radiation.length > targetIndex ? allData.radiation[targetIndex] : null,
            };

            console.log(`🔄 Actualizando a índice ${targetIndex}:`, newSensorData);
            setCurrentIndex(targetIndex);
            setSensorData(newSensorData);
            setLastUpdate(new Date());
        }
    };

    // Función para cargar todos los datos de sensores (solo una vez)
    const loadAllSensorData = async () => {
        setSensorLoading(true);
        try {
            console.log('🔄 Cargando TODOS los datos de sensores...');
            
            const [temperatureData, humidityData, rainData, radiationData, tempHistorical, humidityHistorical] = await Promise.all([
                readingsService.getTemperatureReadings(),
                readingsService.getHumidityReadings(),
                readingsService.getRainReadings(),
                readingsService.getRadiationReadings(),
                readingsService.getTemperatureHistorical(),
                readingsService.getHumidityHistorical(),
            ]);

            console.log('📊 Todos los datos recibidos:', {
                temperature: temperatureData.length,
                humidity: humidityData.length,
                rain: rainData.length,
                radiation: radiationData.length,
                tempHistorical: tempHistorical.length,
                humidityHistorical: humidityHistorical.length,
            });

            // Guardar todos los datos
            const newAllSensorData = {
                temperature: temperatureData,
                humidity: humidityData,
                rain: rainData,
                radiation: radiationData,
            };

            const newHistoricalData = {
                temperature: tempHistorical,
                humidity: humidityHistorical,
            };

            setAllSensorData(newAllSensorData);
            setHistoricalData(newHistoricalData);
            
            // Inicializar gráficas con los primeros 5 puntos
            setChartData({
                temperature: convertToChartData(tempHistorical.slice(0, 5)),
                humidity: convertToChartData(humidityHistorical.slice(0, 5))
            });
            
            // Mostrar un elemento aleatorio inicialmente
            updateCurrentSensorData(newAllSensorData);

        } catch (error) {
            console.error('❌ Error loading all sensor data:', error);
        } finally {
            setSensorLoading(false);
        }
    };

    useEffect(() => {
        loadParcels();
        loadAllSensorData(); // Cargar todos los datos una sola vez
    }, []);

    // useEffect separado para el intervalo que se ejecuta después de cargar los datos
    useEffect(() => {
        let rotateInterval: NodeJS.Timeout;
        let chartInterval: NodeJS.Timeout;
        
        if (allSensorData.temperature.length > 0) {
            console.log('🚀 Iniciando rotación aleatoria cada 5 segundos');
            rotateInterval = setInterval(() => {
                console.log('⏰ Ejecutando rotación aleatoria...');
                rotateData();
            }, 3000);
        }

        if (historicalData.temperature.length > 0) {
            console.log('📊 Iniciando actualización de gráficas cada 2 segundos');
            chartInterval = setInterval(() => {
                console.log('📈 Actualizando gráficas con datos aleatorios...');
                updateChartData();
            }, 2000); // Cambié a 2 segundos para ver la animación más fluida
        }

        return () => {
            if (rotateInterval) {
                console.log('🛑 Limpiando intervalo de rotación');
                clearInterval(rotateInterval);
            }
            if (chartInterval) {
                console.log('🛑 Limpiando intervalo de gráficas');
                clearInterval(chartInterval);
            }
        };
    }, [allSensorData.temperature.length, allSensorData.humidity.length, allSensorData.rain.length, allSensorData.radiation.length, historicalData.temperature.length, historicalData.humidity.length]);

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
                        <div className="bg-white rounded-xl shadow-lg border border-emerald-200 p-6 min-h-[550px]">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Leaf className="w-6 h-6 text-emerald-600 mr-2" />
                                Parcelas Vigentes
                            </h2>
                            <ParcelList parcels={parcels} onDelete={handleDeleteParcel} />
                        </div>
                    </section>

                    <section className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-xl shadow-lg border border-emerald-200 p-6 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <BarChart3 className="w-6 h-6 text-emerald-600 mr-2" />
                                    Sensores en Vivo
                                    {sensorLoading && (
                                        <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                                    )}
                                </h2>
                                <div className="text-right">
                                    {lastUpdate && (
                                        <div className="text-xs text-gray-500">
                                            Última actualización: {lastUpdate.toLocaleTimeString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                                    <Thermometer className="w-8 h-8 mx-auto text-red-500 mb-2" />
                                    
                                    <div className="text-2xl font-bold text-red-600">
                                        {sensorData.temperature && typeof sensorData.temperature.value === 'number' ? 
                                            `${sensorData.temperature.value.toFixed(1)}${sensorData.temperature.unit}` : 
                                            '--'
                                        }
                                    </div>
                                    <div className="text-sm text-gray-600">Temperatura</div>
                                </div>
                                
                                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                                    <Droplets className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                                    
                                    <div className="text-2xl font-bold text-blue-600">
                                        {sensorData.humidity && typeof sensorData.humidity.value === 'number' ? 
                                            `${sensorData.humidity.value.toFixed(1)}${sensorData.humidity.unit}` : 
                                            '--'
                                        }
                                    </div>
                                    <div className="text-sm text-gray-600">Humedad</div>
                                </div>
                                
                                <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl">
                                    <CloudRain className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
                                    
                                    <div className="text-2xl font-bold text-indigo-600">
                                        {sensorData.rain && typeof sensorData.rain.value === 'number' ? 
                                            `${sensorData.rain.value.toFixed(1)}${sensorData.rain.unit}` : 
                                            '--'
                                        }
                                    </div>
                                    <div className="text-sm text-gray-600">Lluvia</div>
                                </div>
                                
                                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                                    <Sun className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                                    
                                    <div className="text-xl font-bold text-yellow-600">
                                        {sensorData.radiation && typeof sensorData.radiation.value === 'number' ? 
                                            `${sensorData.radiation.value.toFixed(0)}${sensorData.radiation.unit}` : 
                                            '--'
                                        }
                                    </div>
                                    <div className="text-sm text-gray-600">Radiación Solar</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 min-h-[300px] flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <LucideLineChart className="w-5 h-5 text-red-500 mr-2" />
                                        Temperatura
                                    </h3>
                                    <div className="text-xs text-gray-400">
                                        {chartData.temperature.length} datos en tiempo real
                                    </div>
                                </div>
                                <div className="flex-1 flex items-center">
                                    <LineChartReal data={chartData.temperature} />
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 min-h-[300px] flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
                                        Humedad
                                    </h3>
                                    <div className="text-xs text-gray-400">
                                        {chartData.humidity.length} datos en tiempo real
                                    </div>
                                </div>
                                <div className="flex-1 flex items-center">
                                    <BarChartReal data={chartData.humidity} />
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