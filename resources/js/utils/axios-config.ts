import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Add CSRF token if available
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axiosConfig.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export default axiosConfig;
