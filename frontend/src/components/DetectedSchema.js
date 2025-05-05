// src/components/DetectedSchema.js
import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

export default function DetectedSchema({ schema }) {
  const entries = Object.entries(schema || {});

  if (entries.length === 0) {
    return <Typography>No schema detected or no file uploaded yet.</Typography>;
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        🔍 Auto-Detected Schema
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Column</strong></TableCell>
              <TableCell><strong>Detected Type</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map(([col, typ]) => (
              <TableRow key={col}>
                <TableCell>{col}</TableCell>
                <TableCell>{typ}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
