import React, { useState } from 'react';
import {
  Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button
} from '@mui/material';

export default function AnomalyTable({ rows }) {
  const [visibleRows, setVisibleRows] = useState(50);
  const LOAD_COUNT = 50;

  if (!rows || rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        ✅ No anomalies found in your dataset.
      </Typography>
    );
  }

  const columns = Object.keys(rows[0]);

  const handleLoadMore = () => {
    setVisibleRows(prev => prev + LOAD_COUNT);
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>🚨 Anomalies</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col, i) => (
                <TableCell key={i}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(0, visibleRows).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex}>
                    {String(row[col])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {visibleRows < rows.length && (
        <Button variant="outlined" onClick={handleLoadMore} sx={{ mt: 2 }}>
          👇 Load More
        </Button>
      )}
    </Paper>
  );
}
