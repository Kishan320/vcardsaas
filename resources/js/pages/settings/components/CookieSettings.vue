<template>
  <SettingsSection
    :title="t('Cookie Settings')"
    :description="t('Configure cookie consent and privacy settings for your application')"
  >
    <form id="cookie-settings-form" @submit.prevent="saveSettings" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Enable Logging Switch -->
        <div class="flex items-center justify-between space-x-2">
          <div class="space-y-0.5">
            <Label for="enableLogging">{{ t('Enable Logging') }}</Label>
            <p class="text-sm text-muted-foreground">
              {{ t('Enable cookie activity logging') }}
            </p>
          </div>
          <Switch
            id="enableLogging"
            v-model:checked="cookieSettings.enableLogging"
          />
        </div>

        <!-- Strictly Necessary Cookies Switch -->
        <div class="flex items-center justify-between space-x-2">
          <div class="space-y-0.5">
            <Label for="strictlyNecessaryCookies">{{ t('Strictly Necessary Cookies') }}</Label>
            <p class="text-sm text-muted-foreground">
              {{ t('Enable strictly necessary cookies') }}
            </p>
          </div>
          <Switch
            id="strictlyNecessaryCookies"
            v-model:checked="cookieSettings.strictlyNecessaryCookies"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Cookie Title -->
        <div class="grid gap-2">
          <Label for="cookieTitle">{{ t('Cookie Title') }}</Label>
          <Input
            id="cookieTitle"
            type="text"
            v-model="cookieSettings.cookieTitle"
            :placeholder="t('Enter the main cookie consent title')"
          />
        </div>

        <!-- Strictly Cookie Title -->
        <div class="grid gap-2">
          <Label for="strictlyCookieTitle">{{ t('Strictly Cookie Title') }}</Label>
          <Input
            id="strictlyCookieTitle"
            type="text"
            v-model="cookieSettings.strictlyCookieTitle"
            :placeholder="t('Enter the strictly necessary cookies title')"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Cookie Description -->
        <div class="grid gap-2">
          <Label for="cookieDescription">{{ t('Cookie Description') }}</Label>
          <Textarea
            id="cookieDescription"
            v-model="cookieSettings.cookieDescription"
            :placeholder="t('Enter the cookie consent description')"
            :rows="4"
          />
        </div>

        <!-- Strictly Cookie Description -->
        <div class="grid gap-2">
          <Label for="strictlyCookieDescription">{{ t('Strictly Cookie Description') }}</Label>
          <Textarea
            id="strictlyCookieDescription"
            v-model="cookieSettings.strictlyCookieDescription"
            :placeholder="t('Enter the strictly necessary cookies description')"
            :rows="4"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Contact Us Description -->
        <div class="grid gap-2">
          <Label for="contactUsDescription">{{ t('Contact Us Description') }}</Label>
          <Textarea
            id="contactUsDescription"
            v-model="cookieSettings.contactUsDescription"
            :placeholder="t('Enter the contact us description for cookie inquiries')"
            :rows="3"
          />
        </div>

        <!-- Contact Us URL -->
        <div class="grid gap-2">
          <Label for="contactUsUrl">{{ t('Contact Us URL') }}</Label>
          <Input
            id="contactUsUrl"
            type="url"
            v-model="cookieSettings.contactUsUrl"
            :placeholder="t('Enter the contact us URL for cookie inquiries')"
          />
        </div>
      </div>

      <!-- Download CSV Section -->
      <div v-if="cookieSettings.enableLogging" class="pt-4 border-t">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium">{{ t('Download Accepted Cookies') }}</h4>
            <p class="text-sm text-muted-foreground">
              {{ t('Download a CSV file of accepted cookie preferences') }}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" @click="downloadCookieCSV">
            <Download :size="14" class="mr-2" />
            {{ t('Download CSV') }}
          </Button>
        </div>
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
import { ref, reactive } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Download } from 'lucide-vue-next';
import SettingsSection from '@/components/SettingsSection.vue';

const { t } = useI18n();
const page = usePage();
const saving = ref(false);

const defaultSettings = {
  enableLogging: false,
  strictlyNecessaryCookies: true,
  cookieTitle: 'Cookie Consent',
  strictlyCookieTitle: 'Strictly Necessary Cookies',
  cookieDescription: 'We use cookies to enhance your browsing experience and provide personalized content.',
  strictlyCookieDescription: 'These cookies are essential for the website to function properly.',
  contactUsDescription: 'If you have any questions about our cookie policy, please contact us.',
  contactUsUrl: 'https://example.com/contact'
};

const settingsData = page.props.settings || {};

const cookieSettings = reactive({
  enableLogging: settingsData.enableLogging === '1' || settingsData.enableLogging === true || defaultSettings.enableLogging,
  strictlyNecessaryCookies: settingsData.strictlyNecessaryCookies === '1' || settingsData.strictlyNecessaryCookies === true || defaultSettings.strictlyNecessaryCookies,
  cookieTitle: settingsData.cookieTitle || defaultSettings.cookieTitle,
  strictlyCookieTitle: settingsData.strictlyCookieTitle || defaultSettings.strictlyCookieTitle,
  cookieDescription: settingsData.cookieDescription || defaultSettings.cookieDescription,
  strictlyCookieDescription: settingsData.strictlyCookieDescription || defaultSettings.strictlyCookieDescription,
  contactUsDescription: settingsData.contactUsDescription || defaultSettings.contactUsDescription,
  contactUsUrl: settingsData.contactUsUrl || defaultSettings.contactUsUrl
});

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.cookie.update'), cookieSettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};

const downloadCookieCSV = () => {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toISOString().split('T')[1].split('.')[0] + ' UTC';
  
  const csvData = [
    ['IP', 'Date', 'Time', 'Accepted-cookies', 'Device type', 'Browser language', 'Browser name', 'OS Name', 'Country', 'Region', 'RegionName', 'City', 'Zipcode', 'Lat', 'Lon'],
    ['49.36.83.154', date, time, 'necessary', 'desktop', 'en', 'Chrome', 'Linux', 'India', 'GJ', 'Gujarat', 'Surat', '395007', '21.1888', '72.8293']
  ];
  
  const csvContent = csvData.map(row => row.join('\t')).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'cookie_data.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
