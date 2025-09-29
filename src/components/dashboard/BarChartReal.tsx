import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import type { SensorData } from "../../types/sensorData";

const BarChartReal = ({ data }: { data: SensorData[] }) => (
    <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
    </ResponsiveContainer>
);

export default BarChartReal;