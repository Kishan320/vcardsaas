<template>
  <SettingsSection
    :title="t('Email Settings')"
    :description="t('Configure email server settings for system notifications and communications')"
  >
    <template #action>
      <Button type="submit" form="email-settings-form" size="sm" :disabled="saving">
        <Loader2 v-if="saving" :size="14" class="mr-2" />
        {{ saving ? t('Saving...') : t('Save Changes') }}
      </Button>
    </template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Email Settings -->
      <div class="lg:col-span-2">
        <form id="email-settings-form" @submit.prevent="saveSettings">
          <div class="rounded-lg border p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <Mail :size="16" class="text-muted-foreground" />
                  <Label for="provider" class="font-medium">{{ t('Email Provider') }}</Label>
                </div>
                <Select v-model="emailSettings.provider" @update:model-value="handleProviderChange">
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

              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <Server :size="16" class="text-muted-foreground" />
                  <Label for="driver" class="font-medium">{{ t('Mail Driver') }}</Label>
                </div>
                <Input
                  id="driver"
                  v-model="emailSettings.driver"
                  placeholder="smtp"
                />
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <Server :size="16" class="text-muted-foreground" />
                  <Label for="host" class="font-medium">{{ t('SMTP Host') }}</Label>
                </div>
                <Input
                  id="host"
                  v-model="emailSettings.host"
                  placeholder="smtp.example.com"
                />
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <Server :size="16" class="text-muted-foreground" />
                  <Label for="port" class="font-medium">{{ t('SMTP Port') }}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <AlertCircle :size="16" class="text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{{ t('Common ports: 25, 465, 587, 2525') }}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="port"
                  v-model="emailSettings.port"
                  placeholder="587"
                />
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <User :size="16" class="text-muted-foreground" />
                  <Label for="username" class="font-medium">{{ t('SMTP Username') }}</Label>
                </div>
                <Input
                  id="username"
                  v-model="emailSettings.username"
                  placeholder="user@example.com"
                />
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <Lock :size="16" class="text-muted-foreground" />
                  <Label for="password" class="font-medium">{{ t('SMTP Password') }}</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  v-model="emailSettings.password"
                  placeholder="••••••••••••"
                />
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <Lock :size="16" class="text-muted-foreground" />
                  <Label for="encryption" class="font-medium">{{ t('Mail Encryption') }}</Label>
                </div>
                <Select v-model="emailSettings.encryption">
                  <SelectTrigger>
                    <SelectValue :placeholder="t('Select encryption')" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tls">{{ t('TLS') }}</SelectItem>
                    <SelectItem value="ssl">{{ t('SSL') }}</SelectItem>
                    <SelectItem value="none">{{ t('None') }}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <Mail :size="16" class="text-muted-foreground" />
                  <Label for="fromAddress" class="font-medium">{{ t('From Address') }}</Label>
                </div>
                <Input
                  id="fromAddress"
                  v-model="emailSettings.fromAddress"
                  placeholder="noreply@example.com"
                />
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                  <User :size="16" class="text-muted-foreground" />
                  <Label for="fromName" class="font-medium">{{ t('From Name') }}</Label>
                </div>
                <Input
                  id="fromName"
                  v-model="emailSettings.fromName"
                  placeholder="System"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Test Email Section -->
      <div class="lg:col-span-1">
        <div class="rounded-lg border p-6">
          <form @submit.prevent="sendTestEmail" class="space-y-4">
            <div class="flex items-center gap-2 mb-4">
              <Send :size="16" class="text-primary" />
              <h3 class="text-base font-medium">{{ t('Test Email Configuration') }}</h3>
            </div>
            
            <div class="space-y-1.5">
              <Label for="testEmail" class="font-medium">{{ t('Send Test To') }}</Label>
              <Input
                id="testEmail"
                type="email"
                v-model="testEmail"
                placeholder="test@example.com"
                required
              />
              <p class="text-xs text-muted-foreground">
                {{ t('Enter an email address to send a test message') }}
              </p>
            </div>

            <Alert v-if="testResult" :variant="testResult.success ? 'default' : 'destructive'" class="py-2">
              <AlertDescription>
                {{ testResult.message }}
              </AlertDescription>
            </Alert>

            <Button 
              type="submit" 
              class="w-full"
              :disabled="isSending || !testEmail"
            >
              <Loader2 v-if="isSending" :size="14" class="mr-2 animate-spin" />
              <Send v-else :size="14" class="mr-2" />
              {{ isSending ? t('Sending...') : t('Send Test Email') }}
            </Button>
          </form>
        </div>
      </div>
    </div>
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, Mail, Send, Server, Lock, User, AlertCircle } from 'lucide-vue-next';
import SettingsSection from '@/components/SettingsSection.vue';

const { t } = useI18n();
const page = usePage();
const saving = ref(false);
const fromNameDefault = (import.meta.env as any).VITE_APP_NAME || 'WorkDo System';

const settingsData = (page.props.settings as Record<string, any> || {});

const emailSettings = reactive({
  provider: settingsData.email_provider || 'smtp',
  driver: settingsData.email_driver || 'smtp',
  host: settingsData.email_host || 'smtp.example.com',
  port: settingsData.email_port || '587',
  username: settingsData.email_username || 'user@example.com',
  password: settingsData.email_password ? '••••••••••••' : '',
  encryption: settingsData.email_encryption || 'tls',
  fromAddress: settingsData.email_from_address || 'noreply@example.com',
  fromName: settingsData.email_from_name || fromNameDefault
});

const testEmail = ref('');
const isSending = ref(false);
const testResult = ref<{success: boolean, message: string} | null>(null);

const handleProviderChange = (value: string) => {
  if (value === 'smtp') {
    emailSettings.driver = 'smtp';
  } else if (value === 'mailgun') {
    emailSettings.driver = 'mailgun';
  } else if (value === 'ses') {
    emailSettings.driver = 'ses';
  }
};

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.email.update'), emailSettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};

const sendTestEmail = () => {
  if (!testEmail.value) return;
  
  isSending.value = true;
  testResult.value = null;
  
  router.post(route('settings.email.test'), { email: testEmail.value }, {
    preserveScroll: true,
    onSuccess: (page: any) => {
      isSending.value = false;
      const successMessage = page.props.flash?.success;
      const errorMessage = page.props.flash?.error;
      
      if (successMessage) {
        testResult.value = { success: true, message: successMessage };
      } else if (errorMessage) {
        testResult.value = { success: false, message: errorMessage };
      } else {
        testResult.value = { success: true, message: t('Test email sent successfully') };
      }
      
      setTimeout(() => {
        testResult.value = null;
      }, 5000);
    },
    onError: (errors: any) => {
      isSending.value = false;
      const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to send test email');
      testResult.value = { success: false, message: errorMessage };
      
      setTimeout(() => {
        testResult.value = null;
      }, 5000);
    }
  });
};
</script>
