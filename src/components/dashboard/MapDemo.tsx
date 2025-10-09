import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Thermometer, Droplets, CloudRain, Sun, Loader, Eye, EyeOff, ChevronDown } from "lucide-react";

interface SensorReading {
    type: string;
    value: number;
    unit: string;
    ts: string;
    location: {
        lat: number;
        lon: number;
    };
}

interface SensorResponse {
    readings: SensorReading[];
}

interface SensorData {
    temperature: SensorReading[];
    humidity: SensorReading[];
    rain: SensorReading[];
    radiation: SensorReading[];
}

interface SensorVisibility {
    temperature: boolean;
    humidity: boolean;
    rain: boolean;
    radiation: boolean;
}

interface SensorPagination {
    temperature: number;
    humidity: number;
    rain: number;
    radiation: number;
}

// Opciones de paginación disponibles
const PAGINATION_OPTIONS = [
    { label: "500", value: 500 },
    { label: "1,000", value: 1000 },
    { label: "2,000", value: 2000 },
    { label: "5,000", value: 5000 },
    { label: "Todos", value: 10000 }
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;

const MapDemo = () => {
    // Estados para datos completos (10,000 registros cada uno)
    const [fullSensorData, setFullSensorData] = useState<SensorData>({
        temperature: [],
        humidity: [],
        rain: [],
        radiation: []
    });
    
    // Estados para datos mostrados actualmente (basado en paginación)
    const [displayedSensorData, setDisplayedSensorData] = useState<SensorData>({
        temperature: [],
        humidity: [],
        rain: [],
        radiation: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [loadingProgress, setLoadingProgress] = useState<string>('');
    
    // Estado para controlar la visibilidad de cada tipo de sensor
    const [sensorVisibility, setSensorVisibility] = useState<SensorVisibility>({
        temperature: true,
        humidity: true,
        rain: true,
        radiation: true
    });

    // Estado para controlar la paginación de cada tipo de sensor
    const [sensorPagination, setSensorPagination] = useState<SensorPagination>({
        temperature: 500,
        humidity: 500,
        rain: 500,
        radiation: 500
    });

    // Estado para controlar la visibilidad de los dropdowns
    const [dropdownOpen, setDropdownOpen] = useState<{[key: string]: boolean}>({
        temperature: false,
        humidity: false,
        rain: false,
        radiation: false
    });

    // Función para obtener datos completos de todos los sensores (10,000 cada uno)
    const fetchAllSensorData = async () => {
        try {
            setLoading(true);
            setError('');
            
            const endpoints = [
                { 
                    key: 'temperature' as keyof SensorData, 
                    url: `${SUPABASE_URL}/functions/v1/servicio-temperatura-historico`,
                    name: 'Temperatura'
                },
                { 
                    key: 'humidity' as keyof SensorData, 
                    url: `${SUPABASE_URL}/functions/v1/servicio-humedad-historico`,
                    name: 'Humedad'
                },
                { 
                    key: 'rain' as keyof SensorData, 
                    url: `${SUPABASE_URL}/functions/v1/servicio-lluvia-historico`,
                    name: 'Lluvia'
                },
                { 
                    key: 'radiation' as keyof SensorData, 
                    url: `${SUPABASE_URL}/functions/v1/servicio-radiacion-historico`,
                    name: 'Radiación Solar'
                }
            ];

            const newFullSensorData: SensorData = {
                temperature: [],
                humidity: [],
                rain: [],
                radiation: []
            };

            // Cargar datos completos de todos los endpoints
            for (let i = 0; i < endpoints.length; i++) {
                const endpoint = endpoints[i];
                setLoadingProgress(`Cargando ${endpoint.name} completo... (${i + 1}/4)`);
                
                try {
                    const response = await fetch(endpoint.url);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data: SensorResponse = await response.json();
                    
                    if (data.readings && Array.isArray(data.readings)) {
                        // Guardar TODOS los datos (hasta 10,000)
                        newFullSensorData[endpoint.key] = data.readings;
                        console.log(`📊 ${endpoint.name}: ${data.readings.length} sensores cargados`);
                    }
                } catch (endpointError) {
                    console.warn(`⚠️ Error cargando ${endpoint.name}:`, endpointError);
                    // Continuar con otros endpoints aunque uno falle
                }
            }

            setFullSensorData(newFullSensorData);
            
            // Aplicar paginación inicial (500 de cada tipo)
            updateDisplayedData(newFullSensorData, sensorPagination);
            
            const totalSensors = Object.values(newFullSensorData).reduce((sum, sensors) => sum + sensors.length, 0);
            console.log(`📍 Total de sensores cargados: ${totalSensors}`);
            
        } catch (error) {
            console.error('❌ Error al obtener datos de sensores:', error);
            setError('Error al cargar datos de sensores');
        } finally {
            setLoading(false);
            setLoadingProgress('');
        }
    };

    // Función para actualizar los datos mostrados basado en la paginación
    const updateDisplayedData = (fullData: SensorData, pagination: SensorPagination) => {
        const newDisplayedData: SensorData = {
            temperature: fullData.temperature.slice(0, pagination.temperature),
            humidity: fullData.humidity.slice(0, pagination.humidity),
            rain: fullData.rain.slice(0, pagination.rain),
            radiation: fullData.radiation.slice(0, pagination.radiation)
        };
        
        setDisplayedSensorData(newDisplayedData);
        
        console.log('📊 Datos mostrados actualizados:', {
            temperature: newDisplayedData.temperature.length,
            humidity: newDisplayedData.humidity.length,
            rain: newDisplayedData.rain.length,
            radiation: newDisplayedData.radiation.length
        });
    };

    // Función para cambiar la paginación de un tipo específico de sensor
    const handlePaginationChange = (sensorType: keyof SensorPagination, newLimit: number) => {
        const newPagination = {
            ...sensorPagination,
            [sensorType]: newLimit
        };
        
        setSensorPagination(newPagination);
        updateDisplayedData(fullSensorData, newPagination);
        
        // Cerrar dropdown
        setDropdownOpen(prev => ({
            ...prev,
            [sensorType]: false
        }));
        
        console.log(`📈 ${sensorType}: Mostrando ${newLimit} de ${fullSensorData[sensorType].length} sensores`);
    };

    // Función para alternar dropdown
    const toggleDropdown = (sensorType: string) => {
        setDropdownOpen(prev => ({
            ...prev,
            [sensorType]: !prev[sensorType]
        }));
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchAllSensorData();
    }, []);

    // Función para formatear la fecha
    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Funciones para determinar colores basados en el tipo y valor del sensor
    const getTemperatureColor = (temperature: number): string => {
        if (temperature < 15) return '#3b82f6'; // Azul - frío
        if (temperature < 20) return '#06b6d4'; // Cian - fresco
        if (temperature < 25) return '#10b981'; // Verde - templado
        if (temperature < 30) return '#f59e0b'; // Ámbar - cálido
        if (temperature < 35) return '#f97316'; // Naranja - caliente
        return '#ef4444'; // Rojo - muy caliente
    };

    const getHumidityColor = (humidity: number): string => {
        if (humidity < 30) return '#ef4444'; // Rojo - muy seco
        if (humidity < 50) return '#f97316'; // Naranja - seco
        if (humidity < 70) return '#10b981'; // Verde - ideal
        if (humidity < 85) return '#06b6d4'; // Cian - húmedo
        return '#3b82f6'; // Azul - muy húmedo
    };

    const getRainColor = (rain: number): string => {
        if (rain < 5) return '#e5e7eb'; // Gris - sin lluvia
        if (rain < 10) return '#06b6d4'; // Cian - lluvia ligera
        if (rain < 20) return '#3b82f6'; // Azul - lluvia moderada
        if (rain < 50) return '#6366f1'; // Índigo - lluvia fuerte
        return '#4c1d95'; // Púrpura - lluvia intensa
    };

    const getRadiationColor = (radiation: number): string => {
        if (radiation < 200) return '#fbbf24'; // Amarillo suave - baja
        if (radiation < 400) return '#f59e0b'; // Ámbar - moderada
        if (radiation < 600) return '#f97316'; // Naranja - alta
        if (radiation < 800) return '#ea580c'; // Naranja oscuro - muy alta
        return '#dc2626'; // Rojo - extrema
    };

    // Función para obtener el color según el tipo de sensor
    const getSensorColor = (reading: SensorReading): string => {
        switch (reading.type) {
            case 'temperature':
                return getTemperatureColor(reading.value);
            case 'humidity':
                return getHumidityColor(reading.value);
            case 'rain':
                return getRainColor(reading.value);
            case 'solar_radiation':
                return getRadiationColor(reading.value);
            default:
                return '#6b7280';
        }
    };

    // Función para obtener el icono según el tipo de sensor
    const getSensorIcon = (type: string) => {
        switch (type) {
            case 'temperature':
                return <Thermometer className="w-5 h-5 text-red-500" />;
            case 'humidity':
                return <Droplets className="w-5 h-5 text-blue-500" />;
            case 'rain':
                return <CloudRain className="w-5 h-5 text-indigo-500" />;
            case 'solar_radiation':
                return <Sun className="w-5 h-5 text-yellow-500" />;
            default:
                return <div className="w-5 h-5 bg-gray-400 rounded-full" />;
        }
    };

    // Función para obtener el nombre del sensor
    const getSensorName = (type: string): string => {
        switch (type) {
            case 'temperature':
                return 'Temperatura';
            case 'humidity':
                return 'Humedad';
            case 'rain':
                return 'Lluvia';
            case 'solar_radiation':
                return 'Radiación Solar';
            default:
                return 'Sensor';
        }
    };

    // Calcular el centro del mapa basado en todas las coordenadas mostradas
    const getMapCenter = (): [number, number] => {
        const allSensors = [
            ...displayedSensorData.temperature,
            ...displayedSensorData.humidity,
            ...displayedSensorData.rain,
            ...displayedSensorData.radiation
        ];

        if (allSensors.length === 0) {
            return [18.0, -92.95]; // Centro por defecto
        }

        const avgLat = allSensors.reduce((sum, sensor) => sum + sensor.location.lat, 0) / allSensors.length;
        const avgLon = allSensors.reduce((sum, sensor) => sum + sensor.location.lon, 0) / allSensors.length;
        
        return [avgLat, avgLon];
    };

    // Función para alternar la visibilidad de un tipo de sensor
    const toggleSensorVisibility = (sensorType: keyof SensorVisibility) => {
        setSensorVisibility(prev => ({
            ...prev,
            [sensorType]: !prev[sensorType]
        }));
    };

    // Obtener todos los sensores visibles (basado en displayedSensorData)
    const getVisibleSensors = (): SensorReading[] => {
        const visibleSensors: SensorReading[] = [];
        
        if (sensorVisibility.temperature) visibleSensors.push(...displayedSensorData.temperature);
        if (sensorVisibility.humidity) visibleSensors.push(...displayedSensorData.humidity);
        if (sensorVisibility.rain) visibleSensors.push(...displayedSensorData.rain);
        if (sensorVisibility.radiation) visibleSensors.push(...displayedSensorData.radiation);
        
        return visibleSensors;
    };

    // Componente para el dropdown de paginación
    const PaginationDropdown = ({ 
        sensorType, 
        currentValue, 
        totalAvailable 
    }: { 
        sensorType: keyof SensorPagination, 
        currentValue: number,
        totalAvailable: number 
    }) => (
        <div className="relative">
            <button
                onClick={() => toggleDropdown(sensorType)}
                className="flex items-center space-x-1 text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
                <span>{currentValue === 10000 ? 'Todos' : currentValue.toLocaleString()}</span>
                <ChevronDown className="w-3 h-3" />
            </button>
            
            {dropdownOpen[sensorType] && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-[1001] min-w-[80px]">
                    {PAGINATION_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handlePaginationChange(sensorType, Math.min(option.value, totalAvailable))}
                            className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors ${
                                currentValue === option.value ? 'bg-blue-50 text-blue-700 font-medium' : ''
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    // Mostrar loading
    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-600">Cargando sensores...</p>
                    {loadingProgress && (
                        <p className="text-sm text-gray-500 mt-1">{loadingProgress}</p>
                    )}
                </div>
            </div>
        );
    }

    // Mostrar error
    if (error) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-red-50">
                <div className="text-center">
                    <div className="text-red-500 mb-2">⚠️</div>
                    <p className="text-red-700">{error}</p>
                    <button 
                        onClick={fetchAllSensorData}
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const visibleSensors = getVisibleSensors();
    const totalLoadedSensors = Object.values(fullSensorData).reduce((sum, sensors) => sum + sensors.length, 0);
    const totalDisplayedSensors = Object.values(displayedSensorData).reduce((sum, sensors) => sum + sensors.length, 0);

    return (
        <div className="h-full w-full relative">
            {/* Panel de información superior */}
            <div className="absolute top-2 left-2 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border max-w-xs">
                <div className="flex items-center space-x-2 text-sm mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">{totalLoadedSensors.toLocaleString()} Sensores Cargados</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                        <span>🌡️ Temperatura:</span>
                        <span>{displayedSensorData.temperature.length}/{fullSensorData.temperature.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>💧 Humedad:</span>
                        <span>{displayedSensorData.humidity.length}/{fullSensorData.humidity.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>🌧️ Lluvia:</span>
                        <span>{displayedSensorData.rain.length}/{fullSensorData.rain.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>☀️ Radiación:</span>
                        <span>{displayedSensorData.radiation.length}/{fullSensorData.radiation.length}</span>
                    </div>
                    <div className="pt-1 border-t">
                        <strong>Mostrando: {visibleSensors.length.toLocaleString()}</strong>
                    </div>
                </div>
            </div>

            {/* Controles de visibilidad y paginación */}
            <div className="absolute top-2 right-2 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border max-w-sm">
                <div className="text-xs font-medium mb-2">Controles de Sensores</div>
                <div className="space-y-2">
                    {/* Temperatura */}
                    <div className="flex items-center justify-between space-x-2">
                        <button
                            onClick={() => toggleSensorVisibility('temperature')}
                            className={`flex items-center space-x-2 text-xs px-2 py-1 rounded transition-colors ${
                                sensorVisibility.temperature ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                            {sensorVisibility.temperature ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <Thermometer className="w-3 h-3" />
                            <span>Temp</span>
                        </button>
                        <PaginationDropdown 
                            sensorType="temperature" 
                            currentValue={sensorPagination.temperature}
                            totalAvailable={fullSensorData.temperature.length}
                        />
                    </div>

                    {/* Humedad */}
                    <div className="flex items-center justify-between space-x-2">
                        <button
                            onClick={() => toggleSensorVisibility('humidity')}
                            className={`flex items-center space-x-2 text-xs px-2 py-1 rounded transition-colors ${
                                sensorVisibility.humidity ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                            {sensorVisibility.humidity ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <Droplets className="w-3 h-3" />
                            <span>Hum</span>
                        </button>
                        <PaginationDropdown 
                            sensorType="humidity" 
                            currentValue={sensorPagination.humidity}
                            totalAvailable={fullSensorData.humidity.length}
                        />
                    </div>

                    {/* Lluvia */}
                    <div className="flex items-center justify-between space-x-2">
                        <button
                            onClick={() => toggleSensorVisibility('rain')}
                            className={`flex items-center space-x-2 text-xs px-2 py-1 rounded transition-colors ${
                                sensorVisibility.rain ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                            {sensorVisibility.rain ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <CloudRain className="w-3 h-3" />
                            <span>Lluvia</span>
                        </button>
                        <PaginationDropdown 
                            sensorType="rain" 
                            currentValue={sensorPagination.rain}
                            totalAvailable={fullSensorData.rain.length}
                        />
                    </div>

                    {/* Radiación */}
                    <div className="flex items-center justify-between space-x-2">
                        <button
                            onClick={() => toggleSensorVisibility('radiation')}
                            className={`flex items-center space-x-2 text-xs px-2 py-1 rounded transition-colors ${
                                sensorVisibility.radiation ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                            {sensorVisibility.radiation ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <Sun className="w-3 h-3" />
                            <span>Rad</span>
                        </button>
                        <PaginationDropdown 
                            sensorType="radiation" 
                            currentValue={sensorPagination.radiation}
                            totalAvailable={fullSensorData.radiation.length}
                        />
                    </div>
                </div>
            </div>

            <MapContainer
                center={getMapCenter()}
                zoom={10}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {visibleSensors.map((reading, idx) => (
                    <Marker 
                        key={`${reading.type}-${idx}`} 
                        position={[reading.location.lat, reading.location.lon]}
                    >
                        <Popup>
                            <div className="p-3 min-w-[200px]">
                                <div className="flex items-center space-x-2 mb-3">
                                    {getSensorIcon(reading.type)}
                                    <strong className="text-lg">Sensor de {getSensorName(reading.type)}</strong>
                                </div>
                                
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Valor:</span>
                                        <span 
                                            className="font-bold text-lg"
                                            style={{ color: getSensorColor(reading) }}
                                        >
                                            {reading.value} {reading.unit}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tipo:</span>
                                        <span className="font-medium capitalize">
                                            {getSensorName(reading.type)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Coordenadas:</span>
                                        <span className="font-mono text-xs">
                                            {reading.location.lat.toFixed(6)}, {reading.location.lon.toFixed(6)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Última lectura:</span>
                                        <span className="text-xs">
                                            {formatDate(reading.ts)}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Indicador visual */}
                                <div className="mt-3 flex items-center space-x-2">
                                    <div 
                                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                        style={{ backgroundColor: getSensorColor(reading) }}
                                    ></div>
                                    <span className="text-xs text-gray-500">
                                        {getSensorName(reading.type)}
                                    </span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapDemo;