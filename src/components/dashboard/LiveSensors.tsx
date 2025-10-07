// src/components/dashboard/LiveSensors.tsx
import { MapPin, BarChart3, LineChart as LucideLineChart, PieChart as LucidePieChart } from "lucide-react";
import Card from "./card";

const LiveSensors = () => (
    <Card
        title="Sensores en Vivo"
        icon={<BarChart3 className="w-6 h-6 text-emerald-300" />}
    >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-50 ">
                <LucideLineChart className="w-8 h-8 mx-auto text-red-400 mb-2" />
                <div className="text-2xl font-bold text-red-400">25.2°C</div>
                <div className="text-sm text-gray-600">Temperatura</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-50 ">
                <BarChart3 className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                <div className="text-2xl font-bold text-blue-400">68%</div>
                <div className="text-sm text-gray-600">Humedad</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl">
                <LucidePieChart className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
                <div className="text-2xl font-bold text-indigo-600">Cultivos</div>
                <div className="text-sm text-gray-600">Distribución</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-50rounded-xl">
                <MapPin className="w-8 h-8 mx-auto text-green-500 mb-2" />
                <div className="text-2xl font-bold text-green-600">Mapa</div>
                <div className="text-sm text-gray-600">Parcelas</div>
            </div>
        </div>
    </Card>
);

export default LiveSensors;