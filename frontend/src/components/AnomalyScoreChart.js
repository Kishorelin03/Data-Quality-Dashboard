import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function AnomalyScoreChart() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/anomaly-scores`)
      .then(res => res.json())
      .then(data => setScores(data));
  }, []);

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>📈 Anomaly Scores (Lower = More Suspicious)</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={scores}>
          <XAxis dataKey="index" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
