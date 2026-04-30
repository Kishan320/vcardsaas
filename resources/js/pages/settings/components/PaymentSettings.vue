<template>
  <SettingsSection
    :title="t('Payment Settings')"
    :description="t('Configure payment gateway for subscription plans')"
  >
    <template #action>
      <Button type="submit" form="payment-settings-form" size="sm" :disabled="saving">
        <Loader2 v-if="saving" :size="14" class="mr-2" />
        {{ saving ? t('Saving...') : t('Save Changes') }}
      </Button>
    </template>
    <form id="payment-settings-form" @submit.prevent="saveSettings">
      <div class="space-y-6">
        <div class="rounded-lg border p-6">
          <h3 class="text-base font-medium mb-4">{{ t('Payment Methods') }}</h3>
          <p class="text-sm text-muted-foreground mb-6">{{ t('Configure available payment methods for subscription plans') }}</p>

          <div class="space-y-4">
            <!-- Manual Payment -->
            <PaymentMethodCard
              :title="t('Manual Payment')"
              :enabled="paymentSettings.is_manually_enabled"
              @toggle="paymentSettings.is_manually_enabled = $event"
            >
              <template #icon>
                <HandCoins :size="20" />
              </template>
              <div class="space-y-2">
                <p class="text-sm text-muted-foreground">
                  {{ t('Allow customers to pay manually and mark orders as paid after verification') }}
                </p>
                <Alert>
                  <AlertCircle :size="16" />
                  <AlertDescription>
                    {{ t('Manual payments require admin approval. Orders will be marked as pending until manually approved.') }}
                  </AlertDescription>
                </Alert>
              </div>
            </PaymentMethodCard>

            <!-- Bank Transfer -->
            <PaymentMethodCard
              :title="t('Bank Transfer')"
              :enabled="paymentSettings.is_bank_enabled"
              @toggle="paymentSettings.is_bank_enabled = $event"
            >
              <template #icon>
                <Banknote :size="20" />
              </template>
              <div class="space-y-2">
                <Label for="bank_detail">{{ t('Bank Details') }}</Label>
                <Textarea
                  id="bank_detail"
                  v-model="paymentSettings.bank_detail"
                  :placeholder="t('Bank: Your Bank Name\nAccount Number: 0000 0000\nRouting Number: 000000000')"
                  rows="6"
                />
                <p class="text-xs text-muted-foreground">
                  {{ t('Enter your bank details that customers will use for manual transfers') }}
                </p>
              </div>
            </PaymentMethodCard>

            <!-- Stripe -->
            <PaymentMethodCard
              :title="t('Stripe')"
              :enabled="paymentSettings.is_stripe_enabled"
              @toggle="paymentSettings.is_stripe_enabled = $event"
            >
              <template #icon>
                <CreditCard :size="20" />
              </template>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PaymentInputField
                  id="stripe_key"
                  :label="t('Publishable Key')"
                  v-model="paymentSettings.stripe_key"
                  placeholder="pk_test_..."
                />
                <PaymentInputField
                  id="stripe_secret"
                  :label="t('Secret Key')"
                  v-model="paymentSettings.stripe_secret"
                  placeholder="sk_test_..."
                  :is-secret="true"
                />
              </div>
            </PaymentMethodCard>

            <!-- PayPal -->
            <PaymentMethodCard
              :title="t('PayPal')"
              :enabled="paymentSettings.is_paypal_enabled"
              @toggle="paymentSettings.is_paypal_enabled = $event"
            >
              <template #icon>
                <CreditCard :size="20" />
              </template>
              <div class="space-y-4">
                <PaymentModeSelector
                  v-model="paymentSettings.paypal_mode"
                  name="paypal"
                />
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentInputField
                    id="paypal_client_id"
                    :label="t('Client ID')"
                    v-model="paymentSettings.paypal_client_id"
                    :placeholder="t('Client ID')"
                  />
                  <PaymentInputField
                    id="paypal_secret_key"
                    :label="t('Secret Key')"
                    v-model="paymentSettings.paypal_secret_key"
                    :placeholder="t('Secret Key')"
                    :is-secret="true"
                  />
                </div>
              </div>
            </PaymentMethodCard>

            <!-- Razorpay -->
            <PaymentMethodCard
              :title="t('Razorpay')"
              :enabled="paymentSettings.is_razorpay_enabled"
              @toggle="paymentSettings.is_razorpay_enabled = $event"
            >
              <template #icon>
                <IndianRupee :size="20" />
              </template>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PaymentInputField
                  id="razorpay_key"
                  :label="t('Key ID')"
                  v-model="paymentSettings.razorpay_key"
                  placeholder="rzp_test_..."
                />
                <PaymentInputField
                  id="razorpay_secret"
                  :label="t('Secret Key')"
                  v-model="paymentSettings.razorpay_secret"
                  placeholder="..."
                  :is-secret="true"
                />
              </div>
            </PaymentMethodCard>

            <!-- Mercado Pago -->
            <PaymentMethodCard
              :title="t('Mercado Pago')"
              :enabled="paymentSettings.is_mercadopago_enabled"
              @toggle="paymentSettings.is_mercadopago_enabled = $event"
            >
              <template #icon>
                <Wallet :size="20" />
              </template>
              <div class="space-y-4">
                <PaymentModeSelector
                  v-model="paymentSettings.mercadopago_mode"
                  name="mercadopago"
                />
                <PaymentInputField
                  id="mercadopago_access_token"
                  :label="t('Access Token')"
                  v-model="paymentSettings.mercadopago_access_token"
                  :placeholder="paymentSettings.mercadopago_mode === 'sandbox' ? 'TEST-' : 'APP_USR-'"
                  :is-secret="true"
                />
                <p class="text-xs text-muted-foreground">
                  {{ t('For server-side API integration, use your Private Access Token (NOT your public key).') }}
                </p>
                <Alert>
                  <AlertCircle :size="16" />
                  <AlertDescription>
                    {{ t('Important: Do not use your Public Key here. The Access Token is different and is required for server-side operations.') }}
                  </AlertDescription>
                </Alert>
              </div>
            </PaymentMethodCard>

            <!-- Paystack -->
            <PaymentMethodCard
              :title="t('Paystack')"
              :enabled="paymentSettings.is_paystack_enabled"
              @toggle="paymentSettings.is_paystack_enabled = $event"
            >
              <template #icon>
                <CreditCard :size="20" />
              </template>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PaymentInputField
                  id="paystack_public_key"
                  :label="t('Public Key')"
                  v-model="paymentSettings.paystack_public_key"
                  placeholder="pk_test_..."
                />
                <PaymentInputField
                  id="paystack_secret_key"
                  :label="t('Secret Key')"
                  v-model="paymentSettings.paystack_secret_key"
                  placeholder="sk_test_..."
                  :is-secret="true"
                />
              </div>
            </PaymentMethodCard>

            <!-- Flutterwave -->
            <PaymentMethodCard
              :title="t('Flutterwave')"
              :enabled="paymentSettings.is_flutterwave_enabled"
              @toggle="paymentSettings.is_flutterwave_enabled = $event"
            >
              <template #icon>
                <CreditCard :size="20" />
              </template>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PaymentInputField
                  id="flutterwave_public_key"
                  :label="t('Public Key')"
                  v-model="paymentSettings.flutterwave_public_key"
                  placeholder="FLWPUBK_TEST-..."
                />
                <PaymentInputField
                  id="flutterwave_secret_key"
                  :label="t('Secret Key')"
                  v-model="paymentSettings.flutterwave_secret_key"
                  placeholder="FLWSECK_TEST-..."
                  :is-secret="true"
                />
              </div>
            </PaymentMethodCard>
          </div>
        </div>
      </div>
    </form>
  </SettingsSection>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, AlertCircle, Banknote, IndianRupee, Wallet, HandCoins } from 'lucide-vue-next';
import SettingsSection from '@/components/SettingsSection.vue';
import { PaymentMethodCard, PaymentInputField, PaymentModeSelector } from '@/components/payment';

const { t } = useI18n();
const page = usePage();
const saving = ref(false);

const settingsData = (page.props.settings as Record<string, any> || {});

const paymentSettings = reactive({
  currency: settingsData.currency || 'USD',
  currency_symbol: settingsData.currency_symbol || '$',
  is_manually_enabled: settingsData.is_manually_enabled === true || settingsData.is_manually_enabled === '1',
  is_bank_enabled: settingsData.is_bank_enabled === true || settingsData.is_bank_enabled === '1',
  bank_detail: settingsData.bank_detail || '',
  is_stripe_enabled: settingsData.is_stripe_enabled === true || settingsData.is_stripe_enabled === '1',
  stripe_key: settingsData.stripe_key || '',
  stripe_secret: settingsData.stripe_secret || '',
  is_paypal_enabled: settingsData.is_paypal_enabled === true || settingsData.is_paypal_enabled === '1',
  paypal_mode: settingsData.paypal_mode || 'sandbox',
  paypal_client_id: settingsData.paypal_client_id || '',
  paypal_secret_key: settingsData.paypal_secret_key || '',
  is_razorpay_enabled: settingsData.is_razorpay_enabled === true || settingsData.is_razorpay_enabled === '1',
  razorpay_key: settingsData.razorpay_key || '',
  razorpay_secret: settingsData.razorpay_secret || '',
  is_mercadopago_enabled: settingsData.is_mercadopago_enabled === true || settingsData.is_mercadopago_enabled === '1',
  mercadopago_mode: settingsData.mercadopago_mode || 'sandbox',
  mercadopago_access_token: settingsData.mercadopago_access_token || '',
  is_paystack_enabled: settingsData.is_paystack_enabled === true || settingsData.is_paystack_enabled === '1',
  paystack_public_key: settingsData.paystack_public_key || '',
  paystack_secret_key: settingsData.paystack_secret_key || '',
  is_flutterwave_enabled: settingsData.is_flutterwave_enabled === true || settingsData.is_flutterwave_enabled === '1',
  flutterwave_public_key: settingsData.flutterwave_public_key || '',
  flutterwave_secret_key: settingsData.flutterwave_secret_key || ''
});

const saveSettings = () => {
  saving.value = true;
  router.post(route('payment.settings'), paymentSettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};
</script>
