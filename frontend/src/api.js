import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export function fetchSnapshot() {
  return axios.get(`${API_URL}/api/snapshot`);
}

export function fetchSchema() {
  return axios.get(`${API_URL}/api/schema`);
}

export function fetchNullRates() {
  return axios.get(`${API_URL}/api/null-rates`);
}

export function fetchAnomalies() {
  return axios.get(`${API_URL}/api/anomalies`);
}

export function triggerChecks() {
  return axios.post(`${API_URL}/api/run-checks`);
}