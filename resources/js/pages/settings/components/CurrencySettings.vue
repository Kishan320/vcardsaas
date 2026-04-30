<template>
  <div class="space-y-6">
    <div class="rounded-lg border p-6">
      <h3 class="text-lg font-medium mb-4">{{ t('Currency Settings') }}</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {{ t('Configure how currency values are displayed throughout the application') }}
      </p>

      <form @submit.prevent="saveSettings" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="defaultCurrency">{{ t('Default Currency') }}</Label>
            <Select v-model="currencySettings.defaultCurrency">
              <SelectTrigger>
                <SelectValue :placeholder="t('Select currency')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="INR">INR - Indian Rupee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-2">
            <Label for="decimalFormat">{{ t('Decimal Places') }}</Label>
            <Select v-model="currencySettings.decimalFormat">
              <SelectTrigger>
                <SelectValue :placeholder="t('Select decimal format')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 (e.g., 1234)</SelectItem>
                <SelectItem value="2">2 (e.g., 1234.56)</SelectItem>
                <SelectItem value="3">3 (e.g., 1234.567)</SelectItem>
              </SelectContent>
            </Select>
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-vue-next';

const { t } = useI18n();
const page = usePage();
const saving = ref(false);

const currencySettings = reactive({
  defaultCurrency: page.props.systemSettings?.defaultCurrency || 'USD',
  decimalFormat: page.props.systemSettings?.decimalFormat || '2'
});

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.currency.update'), currencySettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};
</script>
