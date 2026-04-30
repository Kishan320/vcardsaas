<template>
  <div class="space-y-6">
    <div class="rounded-lg border p-6">
      <h3 class="text-lg font-medium mb-4">{{ t('Cache Settings') }}</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {{ t('Manage application cache and performance') }}
      </p>

      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p class="font-medium">{{ t('Cache Size') }}</p>
            <p class="text-sm text-muted-foreground">{{ cacheSize }} MB</p>
          </div>
          <Button @click="clearCache" :disabled="clearing">
            <Loader2 v-if="clearing" :size="14" class="mr-1 animate-spin" />
            {{ t('Clear Cache') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-vue-next';

const { t } = useI18n();
const clearing = ref(false);

defineProps<{ cacheSize?: string }>();

const clearCache = () => {
  clearing.value = true;
  router.post(route('settings.cache.clear'), {}, {
    onFinish: () => {
      clearing.value = false;
    }
  });
};
</script>
