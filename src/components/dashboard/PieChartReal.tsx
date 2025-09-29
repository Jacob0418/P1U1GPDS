import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import type { PieChartData } from "../../types/sensorData";

const COLORS = ["#34d399", "#fbbf24", "#6366f1", "#f87171"];

const PieChartReal = ({ data }: { data: PieChartData[] }) => (
    <ResponsiveContainer width="100%" height={120}>
        <PieChart>
            <Pie
                data={data}
                dataKey="value"
                nameKey="crop"
                cx="50%"
                cy="50%"
                outerRadius={40}
                label
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    </ResponsiveContainer>
);

export default PieChartReal;