<template>
  <div class="space-y-6">
    <div class="rounded-lg border p-6">
      <h3 class="text-lg font-medium mb-4">{{ t('Email Settings') }}</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {{ t('Configure email server settings for system notifications and communications') }}
      </p>

      <form @submit.prevent="saveSettings" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="provider">{{ t('Email Provider') }}</Label>
            <Select v-model="emailSettings.provider">
              <SelectTrigger>
                <SelectValue :placeholder="t('Select provider')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smtp">SMTP</SelectItem>
                <SelectItem value="mailgun">Mailgun</SelectItem>
                <SelectItem value="ses">Amazon SES</SelectItem>
                <SelectItem value="sendmail">Sendmail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-2">
            <Label for="host">{{ t('SMTP Host') }}</Label>
            <Input
              id="host"
              v-model="emailSettings.host"
              type="text"
              placeholder="smtp.example.com"
            />
          </div>

          <div class="grid gap-2">
            <Label for="port">{{ t('SMTP Port') }}</Label>
            <Input
              id="port"
              v-model="emailSettings.port"
              type="number"
              placeholder="587"
            />
          </div>

          <div class="grid gap-2">
            <Label for="username">{{ t('SMTP Username') }}</Label>
            <Input
              id="username"
              v-model="emailSettings.username"
              type="text"
              placeholder="user@example.com"
            />
          </div>

          <div class="grid gap-2">
            <Label for="password">{{ t('SMTP Password') }}</Label>
            <Input
              id="password"
              v-model="emailSettings.password"
              type="password"
              placeholder="••••••••••••"
            />
          </div>

          <div class="grid gap-2">
            <Label for="fromAddress">{{ t('From Address') }}</Label>
            <Input
              id="fromAddress"
              v-model="emailSettings.fromAddress"
              type="email"
              placeholder="noreply@example.com"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-vue-next';

const { t } = useI18n();
const page = usePage();
const saving = ref(false);

const emailSettings = reactive({
  provider: page.props.settings?.email_provider || 'smtp',
  host: page.props.settings?.email_host || 'smtp.example.com',
  port: page.props.settings?.email_port || '587',
  username: page.props.settings?.email_username || 'user@example.com',
  password: '',
  fromAddress: page.props.settings?.email_from_address || 'noreply@example.com'
});

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.email.update'), emailSettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};
</script>
