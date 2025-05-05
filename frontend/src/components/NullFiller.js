// 📁 src/components/NullFiller.js
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button } from '@mui/material';

export default function NullFiller({ nullRates, hide }) {
  const [fillValues, setFillValues] = useState({});
  const [downloadLink, setDownloadLink] = useState(null);

  useEffect(() => {
    if (nullRates) {
      const initial = Object.keys(nullRates).reduce((acc, col) => {
        acc[col] = '';
        return acc;
      }, {});
      setFillValues(initial);
    }
  }, [nullRates]);

  const handleChange = (col, val) => {
    setFillValues(prev => ({ ...prev, [col]: val }));
  };

  const handleSubmit = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/fill-nulls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fill_values: fillValues })
    })
      .then(res => res.json())
      .then(data => {
        if (data.download) {
          setDownloadLink(`${process.env.REACT_APP_API_URL}${data.download}`);
        }
      });
  };

  if (hide) return null;

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>🧽 Fill Null Values</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Column</TableCell>
              <TableCell>Null %</TableCell>
              <TableCell>Replacement Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(nullRates).map(([col, rate], idx) => (
              <TableRow key={idx}>
                <TableCell>{col}</TableCell>
                <TableCell>{(rate * 100).toFixed(2)}%</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    variant="outlined"
                    value={fillValues[col] || ''}
                    onChange={(e) => handleChange(col, e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Apply & Download CSV
      </Button>

      {downloadLink && (
        <Typography sx={{ mt: 2 }}>
          ✅ File ready: <a href={downloadLink} target="_blank" rel="noreferrer">Download Cleaned CSV</a>
        </Typography>
      )}
    </Paper>
  );
}
