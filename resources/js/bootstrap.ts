import axios from 'axios';

(window as any).axios = axios;
(window as any).axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token from meta tag (same as React project)
const token = document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
if (token) {
    (window as any).axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}
