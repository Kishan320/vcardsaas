<template>
  <div class="space-y-6">
    <div class="rounded-lg border p-6">
      <h3 class="text-lg font-medium mb-4">{{ t('Webhook Settings') }}</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {{ t('Configure webhooks for external integrations') }}
      </p>

      <div class="space-y-4">
        <div v-for="webhook in webhooks" :key="webhook.id" class="p-4 border rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ webhook.name }}</p>
              <p class="text-sm text-muted-foreground">{{ webhook.url }}</p>
            </div>
            <Button variant="outline" size="sm">
              {{ t('Edit') }}
            </Button>
          </div>
        </div>

        <Button variant="outline" class="w-full">
          {{ t('Add Webhook') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';

const { t } = useI18n();

defineProps<{ webhooks?: any[] }>();
</script>
