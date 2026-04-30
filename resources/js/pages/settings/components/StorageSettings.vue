<template>
  <div class="space-y-6">
    <div class="rounded-lg border p-6">
      <h3 class="text-lg font-medium mb-4">{{ t('Storage Settings') }}</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {{ t('Configure file storage settings for your application') }}
      </p>

      <form @submit.prevent="saveSettings" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="storageType">{{ t('Storage Type') }}</Label>
            <Select v-model="storageSettings.storageType">
              <SelectTrigger>
                <SelectValue :placeholder="t('Select storage type')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">{{ t('Local Storage') }}</SelectItem>
                <SelectItem value="aws_s3">AWS S3</SelectItem>
                <SelectItem value="wasabi">Wasabi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-2">
            <Label for="maxUploadSize">{{ t('Max Upload Size (KB)') }}</Label>
            <Input
              id="maxUploadSize"
              v-model="storageSettings.maxUploadSize"
              type="number"
              placeholder="2048"
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

const storageSettings = reactive({
  storageType: page.props.settings?.storage_type || 'local',
  maxUploadSize: page.props.settings?.storage_max_upload_size || '2048'
});

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.storage.update'), storageSettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};
</script>
