<template>
  <div class="space-y-6">
    <div class="rounded-lg border p-6">
      <h3 class="text-lg font-medium mb-4">{{ t('SEO Settings') }}</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {{ t('Configure SEO settings to improve your website\'s search engine visibility') }}
      </p>

      <form @submit.prevent="saveSettings" class="space-y-6">
        <div class="grid grid-cols-1 gap-4">
          <div class="grid gap-2">
            <Label for="metaKeywords">{{ t('Meta Keywords') }}</Label>
            <Input
              id="metaKeywords"
              v-model="seoSettings.metaKeywords"
              type="text"
              :placeholder="t('Enter keywords separated by commas')"
            />
          </div>

          <div class="grid gap-2">
            <Label for="metaDescription">{{ t('Meta Description') }}</Label>
            <textarea
              id="metaDescription"
              v-model="seoSettings.metaDescription"
              rows="3"
              class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
              :placeholder="t('Enter a brief description for search engines')"
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

const seoSettings = reactive({
  metaKeywords: page.props.settings?.metaKeywords || '',
  metaDescription: page.props.settings?.metaDescription || ''
});

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.seo.update'), seoSettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};
</script>
