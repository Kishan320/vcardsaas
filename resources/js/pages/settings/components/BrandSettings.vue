<template>
  <div class="space-y-6">
    <div class="rounded-lg border p-6">
      <h3 class="text-lg font-medium mb-4">{{ t('Brand Settings') }}</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {{ t('Customize your application\'s branding and appearance') }}
      </p>

      <form @submit.prevent="saveSettings" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="titleText">{{ t('Title Text') }}</Label>
            <Input
              id="titleText"
              v-model="brandSettings.titleText"
              type="text"
              placeholder="WorkDo"
            />
          </div>

          <div class="grid gap-2">
            <Label for="footerText">{{ t('Footer Text') }}</Label>
            <Input
              id="footerText"
              v-model="brandSettings.footerText"
              type="text"
              placeholder="© 2025 WorkDo. All rights reserved."
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

const brandSettings = reactive({
  titleText: page.props.globalSettings?.titleText || 'WorkDo',
  footerText: page.props.globalSettings?.footerText || '© 2025 WorkDo. All rights reserved.'
});

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.brand.update'), brandSettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};
</script>
