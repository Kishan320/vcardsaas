<template>
  <SettingsSection
    :title="t('ReCaptcha Settings')"
    :description="t('Configure Google ReCaptcha settings for form protection')"
  >
    <template #action>
      <Button type="submit" form="recaptcha-settings-form" size="sm" :disabled="saving">
        <Loader2 v-if="saving" :size="14" class="mr-2" />
        {{ saving ? t('Saving...') : t('Save Changes') }}
      </Button>
    </template>

    <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200">
      <strong>{{ t('Note') }}:</strong>
      <a href="https://phppot.com/php/how-to-get-google-recaptcha-site-and-secret-key/" target="_blank" rel="noopener noreferrer" class="underline hover:no-underline ml-1">
        {{ t('How to Get Google reCaptcha Site and Secret key') }}
      </a>
    </div>

    <form id="recaptcha-settings-form" @submit.prevent="saveSettings" class="space-y-6">
      <div class="grid gap-2 md:col-span-2">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label for="recaptchaEnabled">{{ t('Enable ReCaptcha') }}</Label>
            <p class="text-sm text-muted-foreground">{{ t('Show ReCaptcha on authentication pages') }}</p>
          </div>
          <Switch id="recaptchaEnabled" v-model:checked="recaptchaSettings.recaptchaEnabled" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="recaptchaVersion">{{ t('Google Recaptcha Version') }}</Label>
          <Select v-model="recaptchaSettings.recaptchaVersion">
            <SelectTrigger>
              <SelectValue :placeholder="t('Select version')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v2">v2</SelectItem>
              <SelectItem value="v3">v3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="grid gap-2">
          <Label for="recaptchaSiteKey">{{ t('Site Key') }}</Label>
          <Input
            id="recaptchaSiteKey"
            v-model="recaptchaSettings.recaptchaSiteKey"
            type="text"
            :placeholder="t('Enter your Google ReCaptcha site key')"
          />
        </div>

        <div class="grid gap-2 md:col-span-2">
          <Label for="recaptchaSecretKey">{{ t('Secret Key') }}</Label>
          <Input
            id="recaptchaSecretKey"
            v-model="recaptchaSettings.recaptchaSecretKey"
            type="password"
            :placeholder="t('Enter your Google ReCaptcha secret key')"
          />
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-vue-next';
import SettingsSection from '@/components/SettingsSection.vue';

const props = defineProps<{ settings?: Record<string, string> }>();

const { t } = useI18n();
const page = usePage();
const saving = ref(false);

const settingsData = props.settings || (page.props.systemSettings as Record<string, any> || {});

const recaptchaSettings = reactive({
  recaptchaEnabled: settingsData.recaptchaEnabled === 'true' || settingsData.recaptchaEnabled === true || settingsData.recaptchaEnabled === '1',
  recaptchaVersion: settingsData.recaptchaVersion || 'v2',
  recaptchaSiteKey: settingsData.recaptchaSiteKey || '',
  recaptchaSecretKey: settingsData.recaptchaSecretKey || '',
});

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.recaptcha.update'), recaptchaSettings, {
    preserveScroll: true,
    onFinish: () => { saving.value = false; }
  });
};
</script>
