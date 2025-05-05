// 📁 src/components/SchemaEditor.js
import React, { useEffect, useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, TextField, Button, Tooltip, Stack, Box
} from '@mui/material';

const types = ["int", "float", "str", "bool"];

export default function SchemaEditor({ detectedSchema, onValidate }) {
  const [userSchema, setUserSchema] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [fileName, setFileName] = useState(null);

  useEffect(() => {
    if (Object.keys(detectedSchema).length > 0) {
      setUserSchema(detectedSchema);
      setInputValue(JSON.stringify(detectedSchema, null, 2));
    }
  }, [detectedSchema]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    try {
      const parsed = JSON.parse(inputValue);
      setUserSchema(parsed);
    } catch (e) {
      alert("❌ Invalid JSON format. Please enter a valid object like: { \"col1\": \"int\" }");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setUserSchema(parsed);
        setInputValue(JSON.stringify(parsed, null, 2));
      } catch (error) {
        alert("❌ Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleResetUpload = () => {
    setFileName(null);
    setUserSchema({});
    setInputValue("{}");
  };

  const handleReset = () => {
    setUserSchema(detectedSchema);
    setInputValue(JSON.stringify(detectedSchema, null, 2));
  };

  const handleSubmit = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/schema-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_schema: userSchema })
    })
      .then(res => res.json())
      .then(data => onValidate(data));
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(userSchema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'expected_schema.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const entries = Object.entries(userSchema || {});

  const getMismatchHint = (col, expected) => {
    const detected = detectedSchema[col];
    if (!detected) return 'Column not found in uploaded file';
    if (detected !== expected) return `Expected ${expected} but detected ${detected}`;
    return null;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>🛠 Define Expected Schema</Typography>

      <TextField
        fullWidth
        multiline
        minRows={4}
        label="Expected Schema (JSON format)"
        value={inputValue}
        onChange={handleInputChange}
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <Button variant="outlined" onClick={handleInputSubmit}>
          📥 Load Schema from Text
        </Button>
        <Button variant="outlined" onClick={handleDownload}>
          📤 Download Schema as JSON
        </Button>
        <Box>
          <Button variant="outlined" component="label">
            📂 Upload Schema JSON File
            <input type="file" accept=".json" hidden onChange={handleFileUpload} />
          </Button>
          {fileName && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
              {fileName} <Button size="small" onClick={handleResetUpload}>❌ Clear</Button>
            </Typography>
          )}
        </Box>
        <Button variant="outlined" onClick={handleReset}>
          🔄 Reset to Auto-Detected
        </Button>
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Column</strong></TableCell>
              <TableCell><strong>Expected Type</strong></TableCell>
              <TableCell><strong>Detected Type</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map(([col, expectedType]) => {
              const mismatchHint = getMismatchHint(col, expectedType);
              const detectedType = detectedSchema[col] || "—";
              return (
                <TableRow key={col}>
                  <TableCell>{col}</TableCell>
                  <TableCell>{expectedType}</TableCell>
                  <TableCell sx={{ color: mismatchHint ? 'error.main' : 'success.main' }}>
                    <Tooltip title={mismatchHint || ''}>
                      <span>{detectedType}</span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        ✅ Validate Against This Schema
      </Button>
    </Paper>
  );
}
