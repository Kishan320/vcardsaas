<template>
  <div class="space-y-6">
    <div class="rounded-lg border p-6">
      <h3 class="text-lg font-medium mb-4">{{ t('Chat GPT Settings') }}</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {{ t('Configure OpenAI ChatGPT API for AI features') }}
      </p>

      <form @submit.prevent="saveSettings" class="space-y-6">
        <div class="grid grid-cols-1 gap-4">
          <div class="grid gap-2">
            <Label for="apiKey">{{ t('API Key') }}</Label>
            <Input
              id="apiKey"
              v-model="chatgptSettings.apiKey"
              type="password"
              placeholder="sk-..."
            />
          </div>

          <div class="grid gap-2">
            <Label for="model">{{ t('Model') }}</Label>
            <Select v-model="chatgptSettings.model">
              <SelectTrigger>
                <SelectValue :placeholder="t('Select model')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
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

const chatgptSettings = reactive({
  apiKey: page.props.settings?.chatgpt_api_key || '',
  model: page.props.settings?.chatgpt_model || 'gpt-3.5-turbo'
});

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.chatgpt.update'), chatgptSettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};
</script>
