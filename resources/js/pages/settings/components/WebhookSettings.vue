<template>
  <SettingsSection
    :title="t('Webhook Settings')"
    :description="t('Manage webhooks for external integrations')"
  >
    <template #action>
      <Button size="sm" @click="handleCreate">
        <Plus :size="14" class="mr-2" />
        {{ t('Add Webhook') }}
      </Button>
    </template>

    <div class="space-y-4">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
            <th class="py-2.5 px-4 text-left font-semibold">{{ t('Module') }}</th>
            <th class="py-2.5 px-4 text-left font-semibold">{{ t('Method') }}</th>
            <th class="py-2.5 px-4 text-left font-semibold">{{ t('URL') }}</th>
            <th class="py-2.5 px-4 text-right font-semibold w-24">{{ t('Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="webhookList.length === 0">
            <td colspan="4" class="h-24 text-center text-muted-foreground">
              {{ t('No webhooks configured') }}
            </td>
          </tr>
          <tr
            v-for="webhook in webhookList"
            :key="webhook.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 dark:bg-gray-900"
          >
            <td class="py-2.5 px-4">
              <div class="flex items-center">
                <Link2 :size="16" class="mr-2 text-muted-foreground" />
                <span class="font-medium">{{ webhook.module }}</span>
              </div>
            </td>
            <td class="py-2.5 px-4">
              <span
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="webhook.method === 'GET'
                  ? 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-green-50 text-green-700 ring-green-700/10 dark:bg-green-900/30 dark:text-green-400'"
              >
                {{ webhook.method }}
              </span>
            </td>
            <td class="py-2.5 px-4">
              <div class="max-w-xs truncate text-sm font-mono text-muted-foreground">{{ webhook.url }}</div>
            </td>
            <td class="py-2.5 px-4 text-right">
              <div class="flex items-center justify-end space-x-2">
                <Button variant="ghost" size="icon" class="h-8 w-8 text-amber-500 hover:text-amber-700" @click="handleEdit(webhook)">
                  <Edit :size="16" />
                </Button>
                <Button variant="ghost" size="icon" class="h-8 w-8 text-red-500 hover:text-red-700" @click="handleDeleteClick(webhook)">
                  <Trash2 :size="16" />
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ editingWebhook ? t('Edit Webhook') : t('Add New Webhook') }}</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-2">
            <Label for="module">{{ t('Module') }}</Label>
            <Select v-model="formData.module">
              <SelectTrigger>
                <SelectValue :placeholder="t('Select module')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New User">{{ t('New User') }}</SelectItem>
                <SelectItem value="New Appointment">{{ t('New Appointment') }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-2">
            <Label for="method">{{ t('Method') }}</Label>
            <Select v-model="formData.method">
              <SelectTrigger>
                <SelectValue :placeholder="t('Select method')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-2">
            <Label for="url">{{ t('URL') }}</Label>
            <Input
              id="url"
              v-model="formData.url"
              type="url"
              placeholder="https://example.com/webhook"
              required
            />
          </div>

          <div class="flex justify-end gap-2">
            <Button type="button" variant="outline" @click="isDialogOpen = false">
              <X :size="14" class="mr-2" />
              {{ t('Cancel') }}
            </Button>
            <Button type="submit" :disabled="submitting">
              <Loader2 v-if="submitting" :size="14" class="mr-2 animate-spin" />
              <Save v-else :size="14" class="mr-2" />
              {{ editingWebhook ? t('Update') : t('Create') }}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="deleteModalOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ t('Delete Webhook') }}</DialogTitle>
        </DialogHeader>
        <p class="text-sm text-muted-foreground">
          {{ t('Are you sure you want to delete the webhook for') }} <strong>{{ webhookToDelete?.module }}</strong>?
        </p>
        <div class="flex justify-end gap-2 mt-4">
          <Button variant="outline" @click="deleteModalOpen = false">{{ t('Cancel') }}</Button>
          <Button variant="destructive" @click="handleDeleteConfirm" :disabled="deleting">
            <Loader2 v-if="deleting" :size="14" class="mr-2 animate-spin" />
            {{ t('Delete') }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </SettingsSection>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, Save, X, Link2 } from 'lucide-vue-next';
import SettingsSection from '@/components/SettingsSection.vue';

interface Webhook {
  id: number;
  module: string;
  method: string;
  url: string;
  created_at: string;
}

const props = defineProps<{ webhooks?: Webhook[] }>();
const { t } = useI18n();

const webhookList = ref<Webhook[]>(props.webhooks || []);
const isDialogOpen = ref(false);
const editingWebhook = ref<Webhook | null>(null);
const deleteModalOpen = ref(false);
const webhookToDelete = ref<Webhook | null>(null);
const submitting = ref(false);
const deleting = ref(false);

const formData = reactive({ module: '', method: '', url: '' });

const resetForm = () => {
  formData.module = '';
  formData.method = '';
  formData.url = '';
  editingWebhook.value = null;
};

const handleCreate = () => {
  resetForm();
  isDialogOpen.value = true;
};

const handleEdit = (webhook: Webhook) => {
  formData.module = webhook.module;
  formData.method = webhook.method;
  formData.url = webhook.url;
  editingWebhook.value = webhook;
  isDialogOpen.value = true;
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    if (editingWebhook.value) {
      const response = await axios.put(route('settings.webhooks.update', editingWebhook.value.id), formData);
      const idx = webhookList.value.findIndex(w => w.id === editingWebhook.value!.id);
      if (idx > -1) webhookList.value[idx] = response.data.webhook;
    } else {
      const response = await axios.post(route('settings.webhooks.store'), formData);
      webhookList.value.push(response.data.webhook);
    }
    isDialogOpen.value = false;
    resetForm();
  } catch (error: any) {
    console.error(error.response?.data?.message || t('An error occurred'));
  } finally {
    submitting.value = false;
  }
};

const handleDeleteClick = (webhook: Webhook) => {
  webhookToDelete.value = webhook;
  deleteModalOpen.value = true;
};

const handleDeleteConfirm = async () => {
  if (!webhookToDelete.value) return;
  deleting.value = true;
  try {
    await axios.delete(route('settings.webhooks.destroy', webhookToDelete.value.id));
    webhookList.value = webhookList.value.filter(w => w.id !== webhookToDelete.value!.id);
  } catch (error: any) {
    console.error(error.response?.data?.message || t('An error occurred'));
  } finally {
    deleting.value = false;
    deleteModalOpen.value = false;
    webhookToDelete.value = null;
  }
};
</script>
