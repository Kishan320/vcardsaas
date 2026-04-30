<script setup lang="ts">
import { computed } from 'vue';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  value: 'sandbox' | 'live';
  name: string;
  error?: string;
}>();

const emit = defineEmits<{
  'update:value': [value: 'sandbox' | 'live'];
}>();

const { t } = useI18n();

const localValue = computed({
  get: () => props.value,
  set: (val) => emit('update:value', val)
});
</script>

<template>
  <div class="space-y-2">
    <Label>{{ t('Mode') }}</Label>
    <RadioGroup v-model="localValue" class="flex gap-4">
      <div class="flex items-center space-x-2">
        <RadioGroupItem :id="`${name}_sandbox`" value="sandbox" />
        <Label :for="`${name}_sandbox`" class="font-normal">
          {{ t('Sandbox') }}
        </Label>
      </div>
      <div class="flex items-center space-x-2">
        <RadioGroupItem :id="`${name}_live`" value="live" />
        <Label :for="`${name}_live`" class="font-normal">
          {{ t('Live') }}
        </Label>
      </div>
    </RadioGroup>
    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
  </div>
</template>
