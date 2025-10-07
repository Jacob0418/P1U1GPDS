import type { PieChartData, SensorData } from "../types/sensorData";

export const temperaturaData: SensorData[] = [
    { timestamp: "2025-09-29T01:00:00", value: 28.5 },
    { timestamp: "2025-09-29T02:00:00", value: 31.97 },
    { timestamp: "2025-09-29T03:00:00", value: 38.87 },
    { timestamp: "2025-09-29T04:00:00", value: 37.98 },
];

export const humedadData: SensorData[] = [
    { timestamp: "2025-09-29T01:00:00", value: 55.2 },
    { timestamp: "2025-09-29T02:00:00", value: 77.69 },
    // ... más datos
];

export const cultivosDistribucion: PieChartData[] = [
    { crop: "Maíz", value: 40 },
    { crop: "Trigo", value: 25 },
    // ... más datos
];

export const deletedParcels = [
    {
        id: 3,
        name: "Parcela Este",
        location: "21.14, -101.70",
        crop: "Sorgo",
        manager: "Carlos Ruiz",
        deletedAt: "2025-09-20",
    },
];