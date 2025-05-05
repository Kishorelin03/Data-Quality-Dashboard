import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';

export default function DataSnapshot({ data }) {
  // If data is not an array, or empty, show message
  if (!Array.isArray(data) || data.length === 0) {
    return <Typography>No data to display or invalid format.</Typography>;
  }

  const headers = Object.keys(data[0]);

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}><strong>{header}</strong></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {headers.map((header) => {
                const value = row?.[header];
                return (
                  <TableCell key={header}>
                    {value !== null && value !== undefined && value !== "" ? value : <em style={{ color: "#999" }}>N/A</em>}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
