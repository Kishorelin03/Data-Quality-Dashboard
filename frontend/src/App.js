// 📁 src/App.js
import React, { useEffect, useState, useRef } from 'react';
import {
  Container, Typography, Button, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Stack, IconButton
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import Papa from 'papaparse';

import {
  fetchSnapshot,
  fetchAnomalies,
  fetchNullRates,
  triggerChecks
} from './api';

import DataSnapshot from './components/DataSnapshot';
import NullRateChart from './components/NullRateChart';
import AnomalyTable from './components/AnomalyTable';
import DetectedSchema from './components/DetectedSchema';
import SchemaEditor from './components/SchemaEditor';
import NullFiller from './components/NullFiller';


function App() {
  const [snapshot, setSnapshot] = useState([]);
  const [nullRates, setNullRates] = useState({});
  const [anomalies, setAnomalies] = useState([]);
  const [detectedSchema, setDetectedSchema] = useState({});
  const [customValidation, setCustomValidation] = useState([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [hasRunChecks, setHasRunChecks] = useState(false);
  const dropRef = useRef(null);

  const handleRunChecks = () => {
    triggerChecks().then(() => {
      fetchSnapshot().then(res => setSnapshot(res.data));
      fetchNullRates().then(res => setNullRates(res.data));
      fetchAnomalies().then(res => setAnomalies(res.data));
      fetch(`${process.env.REACT_APP_API_URL}/api/detect-schema`)
        .then(res => res.json())
        .then(data => setDetectedSchema(data));
      setHasRunChecks(true);
    });
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', file);
    fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        setSnapshot([]);
        setNullRates({});
        setAnomalies([]);
        setDetectedSchema({});
        setHasRunChecks(false);
        alert('✅ File uploaded. Now click "Run All Checks" to validate.');
      });
  };

  const handleResetUpload = () => {
    setFile(null);
    setFileName(null);
    setCsvPreview([]);
    setSnapshot([]);
    setNullRates({});
    setAnomalies([]);
    setDetectedSchema({});
    setHasRunChecks(false);
    alert('Upload reset. Please upload a new CSV file to begin.');
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      parseCSVFile(droppedFile);
    }
  };

  const parseCSVFile = (fileObj) => {
    setFile(fileObj);
    setFileName(fileObj.name);
    Papa.parse(fileObj, {
      header: true,
      complete: (results) => {
        setCsvPreview(results.data.slice(0, 5));
      }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          📊 Data Quality Dashboard
        </Typography>
        <Button variant="contained" onClick={handleRunChecks}>
          🔄 Run All Checks
        </Button>
      </Box>

      <Box
        ref={dropRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 3,
          mb: 3,
          textAlign: 'center',
          bgcolor: '#fafafa'
        }}
      >
        <Typography variant="body1" mb={1}>📥 Drag and drop your CSV file here</Typography>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            Choose CSV File
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => {
                const fileObj = e.target.files[0];
                if (fileObj) parseCSVFile(fileObj);
              }}
            />
          </Button>

          {fileName && (
            <Typography variant="body2" color="text.secondary">
              {fileName}
              <IconButton size="small" onClick={handleResetUpload}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Typography>
          )}

          <Button
            variant="outlined"
            onClick={handleUpload}
            disabled={!file}
          >
            📤 Upload CSV
          </Button>
        </Stack>
      </Box>

      {!hasRunChecks && csvPreview.length > 0 && (
  <Paper elevation={2} sx={{ mb: 4, p: 2 }}>
    <Typography variant="h6" gutterBottom>🔍 CSV Preview (First 5 Rows)</Typography>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {Object.keys(csvPreview[0]).map((col, i) => (
              <TableCell key={i}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {csvPreview.map((row, idx) => (
            <TableRow key={idx}>
              {Object.values(row).map((val, i) => (
                <TableCell key={i}>{val}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
)}


      {hasRunChecks && file && (
        <>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>📁 Data Snapshot</Typography>
            <DataSnapshot data={snapshot} />
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>📌 Auto-Detected Schema</Typography>
            <DetectedSchema schema={detectedSchema} />
          </Paper>

          <SchemaEditor
            detectedSchema={detectedSchema}
            onValidate={(result) => {
              setCustomValidation(result);
              setHasValidated(true);
            }}
          />

          {hasValidated && customValidation.length > 0 && (
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
              <Typography variant="h6" gutterBottom>✅ Custom Schema Validation Result</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Column</strong></TableCell>
                      <TableCell><strong>Exists</strong></TableCell>
                      <TableCell><strong>Type Valid</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customValidation.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.column}</TableCell>
                        <TableCell sx={{ color: row.exists ? 'success.main' : 'error.main' }}>
                          <Tooltip title={row.exists ? '' : 'Column not found in file'}>
                            <span>{row.exists ? '✅' : '❌'}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ color: row.type_ok ? 'success.main' : 'error.main' }}>
                          <Tooltip title={row.type_ok ? '' : 'Data type mismatch'}>
                            <span>{row.type_ok ? '✅' : '❌'}</span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {hasValidated && customValidation.length === 0 && (
            <Typography variant="body2" color="text.secondary" mt={2}>
              ⚠️ No schema checks matched. Please define expected types and try again.
            </Typography>
          )}

          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>📉 Null-Rate Chart</Typography>
            <NullRateChart data={nullRates} />
          </Paper>

          {Object.keys(nullRates).length > 0 && (
            <NullFiller nullRates={nullRates} />
          )}

          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>🚨 Anomalies</Typography>
            <AnomalyTable rows={anomalies} />
          </Paper>
        </>
      )}
    </Container>
  );
}

export default App;
