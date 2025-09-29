import type { SensorData } from "../../types/sensorData";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const LineChartReal = ({ data }: { data: SensorData[] }) => (
    <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot />
        </LineChart>
    </ResponsiveContainer>
);

export default LineChartReal;