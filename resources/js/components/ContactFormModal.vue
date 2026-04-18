<template>
  <Dialog :open="isOpen" @update:open="onClose">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Contact {{ businessName }}</DialogTitle>
        <DialogDescription>
          Send a message to {{ businessName }}
        </DialogDescription>
      </DialogHeader>

      <form @submit="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Name *</Label>
          <div class="relative">
            <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="name"
              v-model="formData.name"
              placeholder="Your name"
              class="pl-9"
              required
            />
          </div>
          <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
        </div>

        <div class="space-y-2">
          <Label for="email">Email *</Label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              v-model="formData.email"
              placeholder="your@email.com"
              class="pl-9"
              required
            />
          </div>
          <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
        </div>

        <div class="space-y-2">
          <Label for="phone">Phone</Label>
          <div class="relative">
            <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="phone"
              v-model="formData.phone"
              placeholder="+1 (555) 123-4567"
              class="pl-9"
            />
          </div>
          <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>
        </div>

        <div class="space-y-2">
          <Label for="message">Message *</Label>
          <div class="relative">
            <MessageSquare class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Textarea
              id="message"
              v-model="formData.message"
              placeholder="Your message..."
              class="pl-9 min-h-[100px]"
              required
            />
          </div>
          <p v-if="errors.message" class="text-red-500 text-sm">{{ errors.message }}</p>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" @click="onClose" :disabled="processing">
            Cancel
          </Button>
          <Button type="submit" :disabled="processing">
            {{ processing ? 'Sending...' : 'Send Message' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, User, MessageSquare } from 'lucide-vue-next';
import axios from '@/utils/axios-config';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: number;
  businessName: string;
  themeColors?: any;
  themeFont?: string;
}

const props = defineProps<ContactFormModalProps>();

const formData = reactive({
  business_id: props.businessId,
  name: '',
  email: '',
  phone: '',
  message: '',
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);

watch(() => props.businessId, (newId) => {
  formData.business_id = newId;
});

const handleChange = (field: string, value: string) => {
  formData[field] = value;
  // Clear error for this field when user starts typing
  if (errors.value[field]) {
    errors.value[field] = '';
  }
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  processing.value = true;
  errors.value = {};
  
  try {
    // Handle preview mode (businessId is 0 or invalid)
    if (!props.businessId || props.businessId === 0) {
      Object.assign(formData, {
        business_id: props.businessId,
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      props.onClose();
      return;
    }

    const response = await axios.post('/api/contact-submissions', formData);
    
    if (response.data.success) {
      // Reset form
      Object.assign(formData, {
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      
      // Show success message
      // You might want to use a toast notification here
      alert('Message sent successfully!');
      
      props.onClose();
    } else {
      // Handle validation errors
      if (response.data.errors) {
        errors.value = response.data.errors;
      } else {
        alert('Failed to send message. Please try again.');
      }
    }
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    } else {
      alert('Failed to send message. Please try again.');
    }
  } finally {
    processing.value = false;
  }
};
</script>

<style scoped>
.contact-form-modal {
  max-width: 100%;
}
</style>
