<template>
  <div class="space-y-6">
    <div class="rounded-lg border p-6">
      <h3 class="text-lg font-medium mb-4">{{ t('Payment Settings') }}</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {{ t('Configure payment gateway for subscription plans') }}
      </p>

      <form @submit.prevent="saveSettings" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="stripe_key">{{ t('Stripe Public Key') }}</Label>
            <Input
              id="stripe_key"
              v-model="paymentSettings.stripe_key"
              type="text"
              placeholder="pk_..."
            />
          </div>

          <div class="grid gap-2">
            <Label for="stripe_secret">{{ t('Stripe Secret Key') }}</Label>
            <Input
              id="stripe_secret"
              v-model="paymentSettings.stripe_secret"
              type="password"
              placeholder="sk_..."
            />
          </div>

          <div class="grid gap-2">
            <Label for="paypal_client_id">{{ t('PayPal Client ID') }}</Label>
            <Input
              id="paypal_client_id"
              v-model="paymentSettings.paypal_client_id"
              type="text"
            />
          </div>

          <div class="grid gap-2">
            <Label for="paypal_secret">{{ t('PayPal Secret') }}</Label>
            <Input
              id="paypal_secret"
              v-model="paymentSettings.paypal_secret"
              type="password"
            />
          </div>
        </div>

        <div class="flex justify-end">
          <Button type="submit" :disabled="saving">
            <Loader2 v-if="saving" :size="14" class="mr-1 animate-spin" />
            {{ t('Save Changes') }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-vue-next';

const { t } = useI18n();
const page = usePage();
const saving = ref(false);

const paymentSettings = reactive({
  stripe_key: page.props.settings?.stripe_key || '',
  stripe_secret: '',
  paypal_client_id: page.props.settings?.paypal_client_id || '',
  paypal_secret: ''
});

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.payment.update'), paymentSettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};
</script>
