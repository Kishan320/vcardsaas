import { ref, onMounted } from 'vue';
import axios from 'axios';

interface PaymentMethodConfig {
  enabled: boolean;
  [key: string]: any;
}

interface PaymentMethods {
  manually?: PaymentMethodConfig;
  stripe?: PaymentMethodConfig;
  paypal?: PaymentMethodConfig;
  razorpay?: PaymentMethodConfig;
  mercadopago?: PaymentMethodConfig;
  bank?: PaymentMethodConfig;
  cashfree?: PaymentMethodConfig;
}

export function usePaymentMethods() {
  const paymentMethods = ref<PaymentMethods>({});
  const loading = ref(true);
  const error = ref<string | null>(null);

  const fetchPaymentMethods = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await axios.get((window as any).route('payment.enabled-methods'));
      paymentMethods.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch payment methods';
      console.error('Error fetching payment methods:', err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchPaymentMethods();
  });

  const getEnabledMethods = () => {
    return Object.entries(paymentMethods.value)
      .filter(([_, config]) => config.enabled)
      .map(([method, config]) => ({ method, config }));
  };

  const isMethodEnabled = (method: string) => {
    return paymentMethods.value[method as keyof PaymentMethods]?.enabled || false;
  };

  const getMethodConfig = (method: string) => {
    return paymentMethods.value[method as keyof PaymentMethods] || null;
  };

  return {
    paymentMethods,
    loading,
    error,
    refetch: fetchPaymentMethods,
    getEnabledMethods,
    isMethodEnabled,
    getMethodConfig
  };
}
