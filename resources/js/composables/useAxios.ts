import axios, { AxiosInstance } from 'axios';
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

export function useAxios(): AxiosInstance {
  const page = usePage();
  const props = computed(() => page.props);
  
  const instance = axios.create();
  
  // Set default headers
  instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  
  // Add request interceptor to include fresh CSRF token
  instance.interceptors.request.use((config) => {
    const csrfToken = (props.value as any).csrf_token;
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    return config;
  });
  
  return instance;
}
