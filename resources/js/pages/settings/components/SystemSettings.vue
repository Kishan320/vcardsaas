<template>
  <SettingsSection
    :title="t('System Settings')"
    :description="t('Configure system-wide settings for your application')"
  >
    <form id="system-settings-form" @submit.prevent="submitSystemSettings" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="defaultLanguage">{{ t('Default Language') }}</Label>
          <Select v-model="systemSettings.defaultLanguage">
            <SelectTrigger>
              <SelectValue :placeholder="t('Select language')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="lang in languageData" :key="lang.code" :value="lang.code">
                {{ lang.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="grid gap-2">
          <Label for="dateFormat">{{ t('Date Format') }}</Label>
          <Select v-model="systemSettings.dateFormat">
            <SelectTrigger>
              <SelectValue :placeholder="t('Select date format')" />
            </SelectTrigger>
            <SelectContent>
              <template v-if="Object.keys(dateFormats).length > 0">
                <SelectItem v-for="(example, format) in dateFormats" :key="format" :value="format">
                  <div class="flex items-center justify-between w-full">
                    <span>{{ format }}</span>
                    <span class="text-muted-foreground text-sm ml-4">({{ example }})</span>
                  </div>
                </SelectItem>
              </template>
              <template v-else>
                <SelectItem value="M j, Y">Jan 1, 2025</SelectItem>
                <SelectItem value="d-m-Y">01-01-2025</SelectItem>
                <SelectItem value="Y-m-d">2025-01-01</SelectItem>
                <SelectItem value="F j, Y">January 1, 2025</SelectItem>
              </template>
            </SelectContent>
          </Select>
        </div>

        <div class="grid gap-2">
          <Label for="timeFormat">{{ t('Time Format') }}</Label>
          <Select v-model="systemSettings.timeFormat">
            <SelectTrigger>
              <SelectValue :placeholder="t('Select time format')" />
            </SelectTrigger>
            <SelectContent>
              <template v-if="Object.keys(timeFormats).length > 0">
                <SelectItem v-for="(example, format) in timeFormats" :key="format" :value="format">
                  <div class="flex items-center justify-between w-full">
                    <span>{{ format }}</span>
                    <span class="text-muted-foreground text-sm ml-4">({{ example }})</span>
                  </div>
                </SelectItem>
              </template>
              <template v-else>
                <SelectItem value="g:i A">1:30 PM</SelectItem>
                <SelectItem value="H:i">13:30</SelectItem>
                <SelectItem value="g:i a">1:30 pm</SelectItem>
              </template>
            </SelectContent>
          </Select>
        </div>

        <div class="grid gap-2">
          <Label for="calendarStartDay">{{ t('Calendar Start Day') }}</Label>
          <Select v-model="systemSettings.calendarStartDay">
            <SelectTrigger>
              <SelectValue :placeholder="t('Select start day')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sunday">{{ t('Sunday') }}</SelectItem>
              <SelectItem value="monday">{{ t('Monday') }}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="grid gap-2 md:col-span-2">
          <Label for="defaultTimezone">{{ t('Default Timezone') }}</Label>
          <Select v-model="systemSettings.defaultTimezone">
            <SelectTrigger>
              <SelectValue :placeholder="t('Select timezone')" />
            </SelectTrigger>
            <SelectContent>
              <template v-if="Object.keys(timezones).length > 0">
                <SelectItem v-for="(description, timezone) in timezones" :key="timezone" :value="timezone">
                  {{ description }}
                </SelectItem>
              </template>
              <template v-else>
                <SelectItem value="UTC">{{ t('UTC') }}</SelectItem>
                <SelectItem value="America/New_York">{{ t('Eastern Time (ET)') }}</SelectItem>
                <SelectItem value="America/Chicago">{{ t('Central Time (CT)') }}</SelectItem>
                <SelectItem value="Europe/London">{{ t('London (GMT)') }}</SelectItem>
              </template>
            </SelectContent>
          </Select>
        </div>

        <template v-if="isSuperAdmin">
          <div class="grid gap-2 md:col-span-2">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label for="emailVerification">{{ t('Email Verification') }}</Label>
                <p class="text-sm text-muted-foreground">
                  {{ t('Require users to verify their email addresses') }}
                </p>
              </div>
              <Switch
                id="emailVerification"
                v-model:checked="systemSettings.emailVerification"
              />
            </div>
          </div>

          <div class="grid gap-2 md:col-span-2">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label for="landingPageEnabled">{{ t('Landing Page') }}</Label>
                <p class="text-sm text-muted-foreground">
                  {{ t('Enable or disable the public landing page') }}
                </p>
              </div>
              <Switch
                id="landingPageEnabled"
                v-model:checked="systemSettings.landingPageEnabled"
              />
            </div>
          </div>

          <div class="grid gap-2 md:col-span-2">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label for="registrationEnabled">{{ t('User Registration') }}</Label>
                <p class="text-sm text-muted-foreground">
                  {{ t('Allow new users to register accounts') }}
                </p>
              </div>
              <Switch
                id="registrationEnabled"
                v-model:checked="systemSettings.registrationEnabled"
              />
            </div>
          </div>

          <div class="grid gap-2 md:col-span-2">
            <Label for="termsConditionsUrl">{{ t('Terms and Conditions URL') }}</Label>
            <Input
              id="termsConditionsUrl"
              v-model="systemSettings.termsConditionsUrl"
              type="url"
              placeholder="https://example.com/terms"
            />
            <p class="text-sm text-muted-foreground">
              {{ t('URL for Terms and Conditions page used in registration form') }}
            </p>
          </div>
        </template>
      </div>

      <div class="flex justify-end pt-2">
        <Button type="submit" :disabled="saving">
          <Loader2 v-if="saving" :size="14" class="mr-1 animate-spin" />
          {{ t('Save Changes') }}
        </Button>
      </div>
    </form>
  </SettingsSection>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-vue-next';
import SettingsSection from '@/components/SettingsSection.vue';
// @ts-ignore
import languageData from '../../../../../resources/lang/language.json';

const props = defineProps<{
  settings?: Record<string, string>;
  timezones?: Record<string, string>;
  dateFormats?: Record<string, string>;
  timeFormats?: Record<string, string>;
}>();

const { t } = useI18n();
const page = usePage();
const saving = ref(false);

const { auth = {} } = page.props as any;
const isSuperAdmin = computed(() => auth.user?.type === 'superadmin');

const defaultSettings = {
  defaultLanguage: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  calendarStartDay: 'sunday',
  defaultTimezone: 'UTC',
  emailVerification: false,
  landingPageEnabled: true,
  registrationEnabled: true,
  termsConditionsUrl: ''
};

const settingsData = (props.settings as Record<string, any> || (page.props.settings as Record<string, any> || {}));

const systemSettings = reactive({
  defaultLanguage: settingsData.defaultLanguage || defaultSettings.defaultLanguage,
  dateFormat: settingsData.dateFormat || defaultSettings.dateFormat,
  timeFormat: settingsData.timeFormat || defaultSettings.timeFormat,
  calendarStartDay: settingsData.calendarStartDay || defaultSettings.calendarStartDay,
  defaultTimezone: settingsData.defaultTimezone || defaultSettings.defaultTimezone,
  emailVerification: settingsData.emailVerification === 'true' || settingsData.emailVerification === true || settingsData.emailVerification === '1' || defaultSettings.emailVerification,
  landingPageEnabled: settingsData.landingPageEnabled === 'true' || settingsData.landingPageEnabled === true || settingsData.landingPageEnabled === '1' || defaultSettings.landingPageEnabled,
  registrationEnabled: settingsData.registrationEnabled === 'true' || settingsData.registrationEnabled === true || settingsData.registrationEnabled === '1' || defaultSettings.registrationEnabled,
  termsConditionsUrl: settingsData.termsConditionsUrl || defaultSettings.termsConditionsUrl
});

const submitSystemSettings = () => {
  saving.value = true;
  const cleanSettings = {
    defaultLanguage: systemSettings.defaultLanguage,
    dateFormat: systemSettings.dateFormat,
    timeFormat: systemSettings.timeFormat,
    calendarStartDay: systemSettings.calendarStartDay,
    defaultTimezone: systemSettings.defaultTimezone,
    emailVerification: Boolean(systemSettings.emailVerification),
    landingPageEnabled: Boolean(systemSettings.landingPageEnabled),
    registrationEnabled: Boolean(systemSettings.registrationEnabled),
    termsConditionsUrl: systemSettings.termsConditionsUrl
  };
  router.post(route('settings.system.update'), cleanSettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};
</script>
