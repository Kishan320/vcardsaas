<template>
  <div class="space-y-6">
    <div class="rounded-lg border p-6">
      <h3 class="text-lg font-medium mb-4">{{ t('Google Wallet Settings') }}</h3>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {{ t('Configure Google Wallet for digital business cards') }}
      </p>

      <form @submit.prevent="saveSettings" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="issuerId">{{ t('Issuer ID') }}</Label>
            <Input
              id="issuerId"
              v-model="walletSettings.issuerId"
              type="text"
              placeholder="338800000002..."
            />
          </div>

          <div class="grid gap-2">
            <Label for="classId">{{ t('Class ID') }}</Label>
            <Input
              id="classId"
              v-model="walletSettings.classId"
              type="text"
              placeholder="338800000002..."
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

const walletSettings = reactive({
  issuerId: page.props.settings?.google_wallet_issuer_id || '',
  classId: page.props.settings?.google_wallet_class_id || ''
});

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.google-wallet.update'), walletSettings, {
    onFinish: () => {
      saving.value = false;
    }
  });
};
</script>
