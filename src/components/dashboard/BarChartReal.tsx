import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SensorData } from '../../types/sensorData';

interface BarChartRealProps {
  data: SensorData[];
  color?: string; // Nueva prop para color personalizado
}

const BarChartReal: React.FC<BarChartRealProps> = ({ data, color = "#8884d8" }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="timestamp" 
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        {/* <Legend /> */}
        <Bar 
          dataKey="value" 
          fill={color}
          stroke={color}
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartReal;