<script setup lang="ts">
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

defineProps<{
  title: string;
  enabled: boolean;
  helpUrl?: string;
  helpText?: string;
}>();

const emit = defineEmits<{
  toggle: [value: boolean];
}>();

const { t } = useI18n();
</script>

<template>
  <div class="border rounded-lg">
    <div class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center gap-3">
        <slot name="icon" />
        <span class="font-medium">{{ title }}</span>
      </div>
      <Switch :checked="enabled" @update:checked="emit('toggle', $event)" />
    </div>
    <div v-if="enabled" class="p-4 space-y-4">
      <Alert v-if="helpUrl && helpText">
        <AlertCircle :size="16" />
        <AlertDescription>
          {{ helpText }}
          <a
            :href="helpUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="underline"
          >
            {{ t('Dashboard') }}
          </a>
        </AlertDescription>
      </Alert>
      <slot />
    </div>
  </div>
</template>
