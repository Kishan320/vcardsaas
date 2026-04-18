<template>
  <Dialog :open="isOpen" @update:open="onClose">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Book Appointment</DialogTitle>
        <DialogDescription>
          Schedule an appointment with {{ businessName }}
        </DialogDescription>
      </DialogHeader>

      <form @submit="handleSubmit" class="space-y-4">
        <div>
          <label class="text-sm font-medium">Name *</label>
          <div class="relative mt-1">
            <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              v-model="formData.name"
              name="name"
              placeholder="Your name"
              class="pl-9"
              :class="{ 'border-red-500': errors.name }"
              required
            />
          </div>
          <p v-if="errors.name" class="text-sm text-red-500 mt-1">{{ errors.name }}</p>
        </div>

        <div>
          <label class="text-sm font-medium">Email *</label>
          <div class="relative mt-1">
            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              v-model="formData.email"
              name="email"
              type="email"
              placeholder="your@email.com"
              class="pl-9"
              :class="{ 'border-red-500': errors.email }"
              required
            />
          </div>
          <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="text-sm font-medium">Phone</label>
          <div class="relative mt-1">
            <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              v-model="formData.phone"
              name="phone"
              placeholder="+1 (555) 000-0000"
              class="pl-9"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium">Date *</label>
            <div class="relative mt-1">
              <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                v-model="formData.appointment_date"
                name="appointment_date"
                type="date"
                class="pl-9"
                :class="{ 'border-red-500': errors.appointment_date }"
                required
              />
            </div>
            <p v-if="errors.appointment_date" class="text-sm text-red-500 mt-1">{{ errors.appointment_date }}</p>
          </div>

          <div>
            <label class="text-sm font-medium">Time *</label>
            <div class="relative mt-1">
              <Clock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                v-model="formData.appointment_time"
                name="appointment_time"
                type="time"
                class="pl-9"
                :class="{ 'border-red-500': errors.appointment_time }"
                required
              />
            </div>
            <p v-if="errors.appointment_time" class="text-sm text-red-500 mt-1">{{ errors.appointment_time }}</p>
          </div>
        </div>

        <div>
          <label class="text-sm font-medium">Message</label>
          <div class="relative mt-1">
            <MessageSquare class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Textarea
              v-model="formData.message"
              name="message"
              placeholder="Any additional details..."
              class="pl-9 min-h-[80px]"
              rows="3"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" @click="onClose" :disabled="processing">
            Cancel
          </Button>
          <Button type="submit" :disabled="processing">
            <div v-if="processing" class="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            {{ processing ? 'Booking...' : 'Book Appointment' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useTranslation } from 'vue-i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, User, MessageSquare, Calendar, Clock } from 'lucide-vue-next';
import { showToast } from '@/components/ui/toast-notification';
import axios from '@/utils/axios-config';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: number;
  businessName: string;
  themeColors?: any;
  themeFont?: string;
}

const props = defineProps<AppointmentFormModalProps>();

const { t } = useTranslation();

const formData = reactive({
  business_id: props.businessId,
  name: '',
  email: '',
  phone: '',
  appointment_date: '',
  appointment_time: '',
  message: '',
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  const { name, value } = target;
  (formData as any)[name] = value;
  
  // Clear error when user starts typing
  if (errors.value[name]) {
    errors.value[name] = '';
  }
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  processing.value = true;
  errors.value = {};

  try {
    const response = await axios.post(route('public.appointment.store'), formData);
    
    // Reset form
    Object.assign(formData, {
      business_id: props.businessId,
      name: '',
      email: '',
      phone: '',
      appointment_date: '',
      appointment_time: '',
      message: '',
    });

    showToast('Appointment booked successfully!', 'success');
    props.onClose();
  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    } else {
      showToast('Failed to book appointment. Please try again.', 'error');
    }
  } finally {
    processing.value = false;
  }
};

watch(() => props.businessId, (newBusinessId) => {
  formData.business_id = newBusinessId;
});
</script>

<style scoped>
.appointment-form-modal {
  /* Component styles are handled by Tailwind classes */
}
</style>
