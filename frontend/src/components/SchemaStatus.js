import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography, TableContainer } from '@mui/material';

const SchemaStatus = ({ stats }) => {
  if (!Array.isArray(stats) || stats.length === 0) {
    return <Typography>No schema results available.</Typography>;
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>Column</strong></TableCell>
            <TableCell><strong>Exists</strong></TableCell>
            <TableCell><strong>Type Valid</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.column}</TableCell>
              <TableCell>{row.exists ? "✅" : "❌"}</TableCell>
              <TableCell>{row.type_ok ? "✅" : "❌"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SchemaStatus;
