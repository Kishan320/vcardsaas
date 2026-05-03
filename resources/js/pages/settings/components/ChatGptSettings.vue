<template>
  <SettingsSection
    :title="t('Chat GPT Settings')"
    :description="t('Configure Chat GPT integration settings for AI-powered features')"
  >
    <template #action>
      <Button type="submit" form="chatgpt-settings-form" size="sm" :disabled="saving">
        <Loader2 v-if="saving" :size="14" class="mr-2" />
        {{ saving ? t('Saving...') : t('Save Changes') }}
      </Button>
    </template>

    <form id="chatgpt-settings-form" @submit.prevent="saveSettings" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="grid gap-2 md:col-span-2">
          <Label for="chatgptKey">{{ t('Chat GPT Key') }}</Label>
          <Input
            id="chatgptKey"
            v-model="chatgptSettings.chatgptKey"
            type="password"
            :placeholder="t('Enter your OpenAI API key')"
          />
        </div>

        <div class="grid gap-2">
          <Label for="chatgptModel">{{ t('Chat GPT Model Name') }}</Label>
          <Select v-model="chatgptSettings.chatgptModel">
            <SelectTrigger>
              <SelectValue :placeholder="t('Select Chat GPT model')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="gpt-3.5-turbo-16k">GPT-3.5 Turbo 16K</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
            </SelectContent>
          </Select>
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
import { Loader2 } from 'lucide-vue-next';
import SettingsSection from '@/components/SettingsSection.vue';

const props = defineProps<{ settings?: Record<string, string> }>();

const { t } = useI18n();
const page = usePage();
const saving = ref(false);

const settingsData = props.settings || (page.props.systemSettings as Record<string, any> || {});

const chatgptSettings = reactive({
  chatgptKey: settingsData.chatgptKey || '',
  chatgptModel: settingsData.chatgptModel || 'gpt-3.5-turbo',
});

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.chatgpt.update'), chatgptSettings, {
    preserveScroll: true,
    onFinish: () => { saving.value = false; }
  });
};
</script>
