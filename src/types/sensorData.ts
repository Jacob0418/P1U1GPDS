export interface SensorData {
    timestamp: string;
    value: number;
    originalTime?: string; // Agregar esta línea para el timestamp original
}

export interface PieChartData {
    crop: string;
    value: number;
    [key: string]: string | number;
}