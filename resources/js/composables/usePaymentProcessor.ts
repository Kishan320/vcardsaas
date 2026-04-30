import { ref } from 'vue';
import { router } from '@inertiajs/vue3';

interface PaymentData {
  planId: number;
  billingCycle: string;
  couponCode?: string;
  paymentMethod: string;
  [key: string]: any;
}

interface UsePaymentProcessorOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function usePaymentProcessor(options: UsePaymentProcessorOptions = {}) {
  const processing = ref(false);

  const processPayment = async (paymentMethod: string, data: PaymentData) => {
    processing.value = true;

    const routes = {
      stripe: 'stripe.payment',
      paypal: 'paypal.payment',
      bank: 'bank.payment',
      razorpay: 'razorpay.payment',
      mercadopago: 'mercadopago.payment',
      paystack: 'paystack.payment',
      flutterwave: 'flutterwave.payment',
    };

    const routeName = routes[paymentMethod as keyof typeof routes];
    
    if (!routeName) {
      console.error('Invalid payment method');
      processing.value = false;
      return;
    }

    const formattedData = formatPaymentData(paymentMethod, data);
    
    router.post((window as any).route(routeName), formattedData, {
      onSuccess: (page: any) => {
        if (page.props?.flash?.success) {
          console.log(page.props.flash.success);
        } else {
          console.log('Payment successful');
        }
        options.onSuccess?.();
      },
      onError: (errors: any) => {
        const errorMessage = errors?.message || errors?.error || 'Payment failed';
        console.error(errorMessage);
        options.onError?.(errorMessage);
      },
      onFinish: () => {
        processing.value = false;
      }
    });
  };

  const validatePaymentData = (paymentMethod: string, data: PaymentData): boolean => {
    const requiredFields = {
      stripe: ['payment_method_id', 'cardholder_name'],
      paypal: ['order_id', 'payment_id'],
      bank: ['amount'],
      razorpay: ['payment_id', 'order_id', 'signature'],
      mercadopago: ['payment_id', 'status'],
      paystack: ['payment_id'],
      flutterwave: ['payment_id'],
    };

    const required = requiredFields[paymentMethod as keyof typeof requiredFields] || [];
    
    for (const field of required) {
      if (!data[field]) {
        console.error(`${field} is required`);
        return false;
      }
    }

    return true;
  };

  const formatPaymentData = (paymentMethod: string, data: PaymentData) => {
    return {
      plan_id: data.planId,
      billing_cycle: data.billingCycle,
      coupon_code: data.couponCode || '',
      ...data,
    };
  };

  return {
    processing,
    processPayment,
    validatePaymentData,
    formatPaymentData,
  };
}
