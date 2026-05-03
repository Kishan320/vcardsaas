<template>
  <SettingsSection
    :title="t('System Settings')"
    :description="t('Configure system-wide settings for your application')"
  >
    <template #action>
      <Button type="submit" form="system-settings-form" size="sm" :disabled="saving">
        <Loader2 v-if="saving" :size="14" class="mr-2" />
        {{ saving ? t('Saving...') : t('Save Changes') }}
      </Button>
    </template>
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
          <div class="md:col-span-2 rounded-lg border p-4">
            <div class="flex items-center justify-between gap-4">
              <div class="flex-1 min-w-0">
                <Label for="emailVerification" class="text-sm font-medium">{{ t('Email Verification') }}</Label>
                <p class="text-sm text-muted-foreground mt-0.5">
                  {{ t('Require users to verify their email addresses') }}
                </p>
              </div>
              <Switch
                id="emailVerification"
                v-model:checked="systemSettings.emailVerification"
              />
            </div>
          </div>

          <div class="md:col-span-2 rounded-lg border p-4">
            <div class="flex items-center justify-between gap-4">
              <div class="flex-1 min-w-0">
                <Label for="landingPageEnabled" class="text-sm font-medium">{{ t('Landing Page') }}</Label>
                <p class="text-sm text-muted-foreground mt-0.5">
                  {{ t('Enable or disable the public landing page') }}
                </p>
              </div>
              <Switch
                id="landingPageEnabled"
                v-model:checked="systemSettings.landingPageEnabled"
              />
            </div>
          </div>

          <div class="md:col-span-2 rounded-lg border p-4">
            <div class="flex items-center justify-between gap-4">
              <div class="flex-1 min-w-0">
                <Label for="registrationEnabled" class="text-sm font-medium">{{ t('User Registration') }}</Label>
                <p class="text-sm text-muted-foreground mt-0.5">
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
    </form>
  </SettingsSection>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
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

const getSettingsData = () => {
  const s = props.settings as Record<string, any>;
  return (s && Object.keys(s).length > 0) ? s : ((page.props as any).settings || {});
};

const buildSettings = (data: Record<string, any>) => ({
  defaultLanguage: data.defaultLanguage || defaultSettings.defaultLanguage,
  dateFormat: data.dateFormat || defaultSettings.dateFormat,
  timeFormat: data.timeFormat || defaultSettings.timeFormat,
  calendarStartDay: data.calendarStartDay || defaultSettings.calendarStartDay,
  defaultTimezone: data.defaultTimezone || defaultSettings.defaultTimezone,
  emailVerification: data.emailVerification === 'true' || data.emailVerification === true || data.emailVerification === '1',
  landingPageEnabled: data.landingPageEnabled === 'true' || data.landingPageEnabled === true || data.landingPageEnabled === '1' || (data.landingPageEnabled === undefined ? defaultSettings.landingPageEnabled : false),
  registrationEnabled: data.registrationEnabled === 'true' || data.registrationEnabled === true || data.registrationEnabled === '1' || (data.registrationEnabled === undefined ? defaultSettings.registrationEnabled : false),
  termsConditionsUrl: data.termsConditionsUrl || defaultSettings.termsConditionsUrl
});

const systemSettings = reactive(buildSettings(getSettingsData()));

// Mirror React's useEffect - update when settings prop changes
watch(() => props.settings, (newSettings) => {
  if (newSettings && Object.keys(newSettings).length > 0) {
    const updated = buildSettings(newSettings as Record<string, any>);
    Object.assign(systemSettings, updated);
  }
}, { deep: true });

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
