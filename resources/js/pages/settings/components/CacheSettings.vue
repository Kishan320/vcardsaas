<template>
  <SettingsSection
    :title="t('Cache Settings')"
    :description="t('Manage application cache to improve performance')"
  >
    <div class="space-y-6">
      <div class="p-3 bg-muted/50 rounded-lg">
        <p class="text-sm text-muted-foreground">
          {{ t('This is a page meant for more advanced users, simply ignore it if you don\'t understand what cache is.') }}
        </p>
      </div>

      <div class="flex items-center justify-between p-4 border rounded-lg">
        <div class="flex items-center space-x-3">
          <HardDrive class="h-5 w-5 text-muted-foreground" />
          <div>
            <h4 class="font-medium">{{ t('Current Cache Size') }}</h4>
            <p class="text-sm text-muted-foreground">{{ cacheSize }} MB {{ t('of cached data') }}</p>
          </div>
        </div>
        <Button @click="clearCache" :disabled="clearing" variant="destructive" size="sm">
          <Loader2 v-if="clearing" :size="14" class="mr-2 animate-spin" />
          <Trash2 v-else :size="14" class="mr-2" />
          {{ clearing ? t('Clearing...') : t('Clear Cache') }}
        </Button>
      </div>

      <div class="text-sm text-muted-foreground">
        <p>{{ t('Clearing cache will remove') }}:</p>
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li>{{ t('Application cache') }}</li>
          <li>{{ t('Route cache') }}</li>
          <li>{{ t('View cache') }}</li>
          <li>{{ t('Configuration cache') }}</li>
        </ul>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import { Loader2, HardDrive, Trash2 } from 'lucide-vue-next';
import SettingsSection from '@/components/SettingsSection.vue';

const props = defineProps<{ cacheSize?: string }>();
const { t } = useI18n();
const clearing = ref(false);

const clearCache = () => {
  clearing.value = true;
  router.post(route('settings.cache.clear'), {}, {
    preserveScroll: true,
    onFinish: () => { clearing.value = false; }
  });
};
</script>
