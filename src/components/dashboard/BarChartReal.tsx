import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { SensorData } from "../../types/sensorData";

interface BarChartRealProps {
    data: SensorData[];
}

const BarChartReal = ({ data }: BarChartRealProps) => {
    // Formatear datos para la gráfica
    const chartData = data.map((item) => ({
        name: item.timestamp,
        value: item.value,
        originalTime: item.originalTime,
    }));

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        fontSize={12}
                    />
                    <YAxis
                        fontSize={12}
                        domain={[0, 100]} // Dominio fijo para humedad (0-100%)
                    />
                    <Tooltip
                        formatter={(value: number) => [
                            `${value.toFixed(1)}%`,
                            "Humedad",
                        ]}
                        labelFormatter={(label, payload) => {
                            if (payload && payload[0] && payload[0].payload.originalTime) {
                                const date = new Date(payload[0].payload.originalTime);
                                return `Tiempo: ${date.toLocaleTimeString()}`;
                            }
                            return `Punto: ${label}`;
                        }}
                    />
                    <Bar
                        dataKey="value"
                        fill="#3B82F6"
                        radius={[2, 2, 0, 0]}
                        // Añadir animación suave
                        animationDuration={1000}
                        animationEasing="ease-in-out"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartReal;