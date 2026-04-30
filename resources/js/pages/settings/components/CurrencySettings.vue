<template>
  <SettingsSection
    :title="t('Currency Settings')"
    :description="t('Configure how currency values are displayed throughout the application')"
  >
    <template #action>
      <Button type="submit" form="currency-settings-form" size="sm" :disabled="saving">
        <Loader2 v-if="saving" :size="14" class="mr-2" />
        {{ saving ? t('Saving...') : t('Save Changes') }}
      </Button>
    </template>
    <form id="currency-settings-form" @submit.prevent="saveSettings">
      <div class="grid grid-cols-1 gap-6">
        <div>
          <div class="rounded-lg border p-6">
            <div class="flex items-center space-x-2 mb-4">
              <DollarSign :size="20" class="text-primary" />
              <h3 class="text-base font-medium">{{ t('Format Options') }}</h3>
            </div>

            <div class="grid grid-cols-1 gap-6">
              <div class="p-4 bg-muted/30 rounded-md border flex flex-col md:flex-row items-center justify-between">
                <div class="flex flex-col items-center md:items-start mb-3 md:mb-0">
                  <div class="text-2xl font-semibold mb-1">
                    {{ formattedPreview() }}
                  </div>
                  <div class="text-xs text-muted-foreground">
                    {{ currencySettings.currencyName }} ({{ currencySettings.defaultCurrency }})
                  </div>
                </div>
                <div class="w-full md:w-auto md:max-w-[200px]">
                  <div class="flex items-center gap-2">
                    <Input
                      type="number"
                      class="text-right h-8 text-sm"
                      v-model="previewAmount"
                      placeholder="Test amount"
                    />
                    <Button
                      variant="outline"
                      @click="previewAmount = 1234.56"
                      type="button"
                      size="sm"
                      class="h-8 text-xs"
                    >
                      {{ t('Reset') }}
                    </Button>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <Label for="defaultCurrency" class="font-medium">{{ t('Default Currency') }}</Label>
                    <Badge variant="outline" class="font-mono">
                      {{ currencySettings.defaultCurrency }}
                    </Badge>
                  </div>
                  <Select
                    v-model="currencySettings.defaultCurrency"
                    @update:model-value="handleCurrencyChange"
                  >
                    <SelectTrigger>
                      <SelectValue :placeholder="t('Select currency')" />
                    </SelectTrigger>
                    <SelectContent>
                      <div class="max-h-[300px] overflow-y-auto">
                        <template v-if="currencies && currencies.length > 0">
                          <SelectItem v-for="currency in currencies" :key="currency.id" :value="currency.code">
                            <div class="flex items-center">
                              <span class="w-8 text-center">{{ currency.symbol }}</span>
                              <span>{{ currency.code }} - {{ currency.name }}</span>
                              <span v-if="currency.is_default" class="ml-2 text-xs text-primary">(Default)</span>
                            </div>
                          </SelectItem>
                        </template>
                        <div v-else class="p-2 text-center text-muted-foreground">
                          {{ t('No currencies found') }}
                        </div>
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <Label for="decimalFormat" class="font-medium">{{ t('Decimal Places') }}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger as-child>
                          <Info :size="16" class="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{{ t('Number of digits after decimal point') }}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    v-model="currencySettings.decimalFormat"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select decimal format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 (e.g., 1234)</SelectItem>
                      <SelectItem value="1">1 (e.g., 1234.5)</SelectItem>
                      <SelectItem value="2">2 (e.g., 1234.56)</SelectItem>
                      <SelectItem value="3">3 (e.g., 1234.567)</SelectItem>
                      <SelectItem value="4">4 (e.g., 1234.5678)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <Label for="currencySymbolPosition" class="font-medium">{{ t('Symbol Position') }}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger as-child>
                          <Info :size="16" class="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{{ t('Where to place the currency symbol') }}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      :variant="currencySettings.currencySymbolPosition === 'before' ? 'default' : 'outline'"
                      class="justify-center"
                      @click="currencySettings.currencySymbolPosition = 'before'"
                    >
                      <span class="mr-2">{{ getCurrencySymbol() }}</span>100
                      <Check v-if="currencySettings.currencySymbolPosition === 'before'" :size="14" class="ml-2" />
                    </Button>
                    <Button
                      type="button"
                      :variant="currencySettings.currencySymbolPosition === 'after' ? 'default' : 'outline'"
                      class="justify-center"
                      @click="currencySettings.currencySymbolPosition = 'after'"
                    >
                      100<span class="ml-2">{{ getCurrencySymbol() }}</span>
                      <Check v-if="currencySettings.currencySymbolPosition === 'after'" :size="14" class="ml-2" />
                    </Button>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <Label for="decimalSeparator" class="font-medium">{{ t('Decimal Separator') }}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger as-child>
                          <Info :size="16" class="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{{ t('Character used to separate decimal places') }}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      :variant="currencySettings.decimalSeparator === '.' ? 'default' : 'outline'"
                      class="justify-center"
                      @click="currencySettings.decimalSeparator = '.'"
                    >
                      {{ t('Dot') }} (123.45)
                      <Check v-if="currencySettings.decimalSeparator === '.'" :size="14" class="ml-2" />
                    </Button>
                    <Button
                      type="button"
                      :variant="currencySettings.decimalSeparator === ',' ? 'default' : 'outline'"
                      class="justify-center"
                      @click="currencySettings.decimalSeparator = ','"
                    >
                      {{ t('Comma') }} (123,45)
                      <Check v-if="currencySettings.decimalSeparator === ','" :size="14" class="ml-2" />
                    </Button>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <Label for="thousandsSeparator" class="font-medium">{{ t('Thousands Separator') }}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger as-child>
                          <Info :size="16" class="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                      <p>{{ t('Character used to group thousands') }}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    v-model="currencySettings.thousandsSeparator"
                  >
                    <SelectTrigger>
                      <SelectValue :placeholder="t('Select thousands separator')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=",">Comma (1,234.56)</SelectItem>
                      <SelectItem value=".">Dot (1.234,56)</SelectItem>
                      <SelectItem value=" ">Space (1 234.56)</SelectItem>
                      <SelectItem value="none">None (123456.78)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-3 border rounded-md p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <Label for="floatNumber" class="font-medium">{{ t('Show Decimals') }}</Label>
                      <p class="text-xs text-muted-foreground mt-1">{{ t('Display decimal places in amounts') }}</p>
                    </div>
                    <Switch
                      id="floatNumber"
                      v-model:checked="currencySettings.floatNumber"
                    />
                  </div>
                </div>

                <div class="space-y-3 border rounded-md p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <Label for="currencySymbolSpace" class="font-medium">{{ t('Add Space') }}</Label>
                      <p class="text-xs text-muted-foreground mt-1">{{ t('Space between amount and symbol') }}</p>
                    </div>
                    <Switch
                      id="currencySymbolSpace"
                      v-model:checked="currencySettings.currencySymbolSpace"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </SettingsSection>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, DollarSign, Check, Info } from 'lucide-vue-next';
import SettingsSection from '@/components/SettingsSection.vue';

const { t } = useI18n();
const page = usePage();
const saving = ref(false);

const { currencies = [], systemSettings = {} } = page.props as any;

const currencySettings = reactive({
  decimalFormat: systemSettings.decimalFormat || '2',
  defaultCurrency: systemSettings.defaultCurrency || 'USD',
  decimalSeparator: systemSettings.decimalSeparator || '.',
  thousandsSeparator: systemSettings.thousandsSeparator || ',',
  floatNumber: systemSettings.floatNumber === '0' ? false : true,
  currencySymbolSpace: systemSettings.currencySymbolSpace === '1',
  currencySymbolPosition: systemSettings.currencySymbolPosition || 'before',
  currencyName: ''
});

const previewAmount = ref(1234.56);

const getCurrencySymbol = () => {
  const selectedCurrency = currencies.find((c: any) => c.code === currencySettings.defaultCurrency);
  return selectedCurrency?.symbol || '$';
};

const handleCurrencyChange = (value: string) => {
  const selectedCurrency = currencies.find((c: any) => c.code === value);
  currencySettings.defaultCurrency = value;
  currencySettings.currencyName = selectedCurrency?.name || value;
};

watch(() => currencySettings.defaultCurrency, (newValue) => {
  const selectedCurrency = currencies.find((c: any) => c.code === newValue);
  if (selectedCurrency) {
    currencySettings.currencyName = selectedCurrency.name;
  }
});

const formattedPreview = () => {
  try {
    let amount = Number(previewAmount.value) || 0;
    const decimalPlaces = parseInt(currencySettings.decimalFormat) || 2;

    if (!currencySettings.floatNumber) {
      amount = Math.floor(amount);
    }

    const parts = Number(amount).toFixed(decimalPlaces).split('.');

    if (currencySettings.thousandsSeparator !== 'none') {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, currencySettings.thousandsSeparator);
    }

    let formattedNumber = parts.join(currencySettings.decimalSeparator);

    const symbol = getCurrencySymbol();
    const space = currencySettings.currencySymbolSpace ? ' ' : '';

    if (currencySettings.currencySymbolPosition === 'before') {
      return `${symbol}${space}${formattedNumber}`;
    } else {
      return `${formattedNumber}${space}${symbol}`;
    }
  } catch (error) {
    return 'Invalid format';
  }
};

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.currency.update'), currencySettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};
</script>
