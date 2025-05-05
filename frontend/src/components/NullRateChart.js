// 📁 src/components/NullRateChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';

export default function NullRateChart({ data }) {
  const chartData = Object.entries(data).map(([column, rate]) => ({
    column,
    rate: +(rate * 100).toFixed(2), // Convert to percentage
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 40, left: 40, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
        <YAxis type="category" dataKey="column" />
        <Tooltip formatter={(v) => `${v}%`} />
        <Bar dataKey="rate" fill="#8884d8">
          <LabelList dataKey="rate" position="right" formatter={(v) => `${v}%`} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
