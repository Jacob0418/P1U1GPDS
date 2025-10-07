// src/service/readingsService.ts
export interface SensorReading {
  value: number;
  unit: string;
  ts: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

async function fetchReadings(endpoint: string, defaultUnit: string): Promise<SensorReading[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/${endpoint}`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ name: "Functions" }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.readings || [];
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    return [];
  }
}

export const readingsService = {
  // Servicios existentes
  async getTemperatureReadings() {
    return fetchReadings("servicio-temperatura", "°C");
  },
  async getHumidityReadings() {
    return fetchReadings("servicio-humidity", "%");
  },
  async getRainReadings() {
    return fetchReadings("servicio-lluvia", "mm");
  },
  async getRadiationReadings() {
    return fetchReadings("servicio-radiacion", "W/m²");
  },
  
  // Nuevos servicios para datos históricos
  async getTemperatureHistorical() {
    return fetchReadings("servicio-temperatura-historico", "°C");
  },
  async getHumidityHistorical() {
    return fetchReadings("servicio-humedad-historico", "%");
  },
};
