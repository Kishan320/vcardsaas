<template>
  <div class="space-y-6">
    <div class="rounded-lg border p-6">
      <h3 class="text-lg font-medium mb-4">{{ t('Google Calendar Settings') }}</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {{ t('Configure Google Calendar integration for appointments') }}
      </p>

      <form @submit.prevent="saveSettings" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="clientId">{{ t('Client ID') }}</Label>
            <Input
              id="clientId"
              v-model="calendarSettings.clientId"
              type="text"
              placeholder="your-client-id.apps.googleusercontent.com"
            />
          </div>

          <div class="grid gap-2">
            <Label for="clientSecret">{{ t('Client Secret') }}</Label>
            <Input
              id="clientSecret"
              v-model="calendarSettings.clientSecret"
              type="password"
              placeholder="GOCSPX-..."
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

const calendarSettings = reactive({
  clientId: page.props.settings?.google_calendar_client_id || '',
  clientSecret: page.props.settings?.google_calendar_client_secret || ''
});

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.google-calendar.update'), calendarSettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};
</script>
