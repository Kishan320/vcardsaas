<template>
  <SettingsSection
    :title="t('SEO Settings')"
    :description="t('Configure SEO settings to improve your website\'s search engine visibility')"
  >
    <template #action>
      <Button type="submit" form="seo-settings-form" size="sm" :disabled="saving">
        <Loader2 v-if="saving" :size="14" class="mr-2" />
        {{ saving ? t('Saving...') : t('Save Changes') }}
      </Button>
    </template>

    <form id="seo-settings-form" @submit.prevent="saveSettings" class="space-y-6">
      <div class="grid grid-cols-1 gap-6">
        <div class="grid gap-2">
          <Label for="metaKeywords">{{ t('Meta Keywords') }} <span class="text-red-500">*</span></Label>
          <Input
            id="metaKeywords"
            v-model="seoSettings.metaKeywords"
            type="text"
            :placeholder="t('Enter keywords separated by commas')"
            required
          />
        </div>

        <div class="grid gap-2">
          <Label for="metaDescription">{{ t('Meta Description') }} <span class="text-red-500">*</span></Label>
          <Textarea
            id="metaDescription"
            v-model="seoSettings.metaDescription"
            :placeholder="t('Enter a brief description for search engines (max 160 characters)')"
            :maxlength="160"
            :rows="3"
            required
          />
          <div class="text-sm text-muted-foreground text-right">
            {{ seoSettings.metaDescription.length }}/160
          </div>
        </div>

        <div class="grid gap-2">
          <Label for="metaImage">{{ t('Meta Image') }} <span class="text-red-500">*</span></Label>
          <div class="space-y-4">
            <!-- Image Preview -->
            <div v-if="seoSettings.metaImage || imagePreview" class="border rounded-md p-4 bg-muted/30">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium">{{ t('Current Image') }}</span>
                <Button type="button" variant="ghost" size="sm" class="h-6 w-6 p-0" @click="removeImage">
                  <X :size="16" />
                </Button>
              </div>
              <div class="flex items-center justify-center h-32 border rounded">
                <img
                  v-if="!imageError"
                  :src="imagePreview || seoSettings.metaImage"
                  alt="Meta Image Preview"
                  class="max-h-full max-w-full object-contain"
                  @error="imageError = true"
                />
                <div v-else class="text-muted-foreground text-sm">{{ t('Failed to load image') }}</div>
              </div>
            </div>

            <!-- File Upload -->
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <input
                  id="metaImageUpload"
                  type="file"
                  accept="image/*"
                  class="absolute inset-0 opacity-0 cursor-pointer"
                  @change="handleImageUpload"
                />
                <Button type="button" variant="outline" class="w-full justify-start pointer-events-none">
                  <Upload :size="16" class="mr-2" />
                  {{ seoSettings.metaImage ? t('Change Image') : t('Upload Image') }}
                </Button>
              </div>
            </div>
            <p class="text-xs text-muted-foreground">
              {{ t('Recommended size: 1200x630px for optimal social media sharing. Max file size: 5MB') }}
            </p>
          </div>
        </div>
      </div>
    </form>
  </SettingsSection>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X } from 'lucide-vue-next';
import SettingsSection from '@/components/SettingsSection.vue';
import { Textarea } from '@/components/ui/textarea';

const props = defineProps<{ settings?: Record<string, string> }>();

const { t } = useI18n();
const page = usePage();
const saving = ref(false);
const imagePreview = ref<string | null>(null);
const imageError = ref(false);

const settingsData = props.settings || (page.props.systemSettings as Record<string, any> || {});

const seoSettings = reactive({
  metaKeywords: settingsData.metaKeywords || '',
  metaDescription: settingsData.metaDescription || '',
  metaImage: settingsData.metaImage || '',
});

const handleImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) return;
  if (file.size > 5 * 1024 * 1024) return;
  const fileUrl = URL.createObjectURL(file);
  imageError.value = false;
  imagePreview.value = fileUrl;
  seoSettings.metaImage = fileUrl;
};

const removeImage = () => {
  imagePreview.value = null;
  imageError.value = false;
  seoSettings.metaImage = '';
};

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.seo.update'), seoSettings, {
    preserveScroll: true,
    onFinish: () => { saving.value = false; }
  });
};
</script>
