<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Reply to {{ contact?.name }}</DialogTitle>
      </DialogHeader>
      
      <form @submit="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <Label>To</Label>
            <Input :value="contact?.email || ''" disabled />
          </div>
          <div>
            <Label>Status</Label>
            <Select v-model="formData.status" @update:model-value="handleChange('status', $event)">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label>Subject</Label>
          <Input
            v-model="formData.subject"
            @input="handleChange('subject', $event.target.value)"
            placeholder="Enter email subject"
            required
          />
        </div>
        
        <div>
          <Label>Message</Label>
          <Textarea
            v-model="formData.message"
            @input="handleChange('message', $event.target.value)"
            placeholder="Enter your reply message"
            rows="6"
            required
          />
        </div>
        
        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" @click="handleClose">
            Cancel
          </Button>
          <Button type="submit">
            Send Reply
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContactReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  contact: any;
}

const props = defineProps<ContactReplyModalProps>();

const formData = reactive({
  subject: '',
  message: '',
  status: 'contacted'
});

// Update form data when contact changes or modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.contact) {
    Object.assign(formData, {
      subject: '',
      message: '',
      status: props.contact.status || 'contacted'
    });
  }
});

const handleSubmit = (event: Event) => {
  event.preventDefault();
  props.onSubmit(formData);
};

const handleClose = () => {
  Object.assign(formData, { subject: '', message: '', status: 'contacted' });
  props.onClose();
};

const handleChange = (field: string, value: string) => {
  (formData as any)[field] = value;
};
</script>

<style scoped>
.contact-reply-modal {
  /* Component styles are handled by Tailwind classes */
}
</style>
