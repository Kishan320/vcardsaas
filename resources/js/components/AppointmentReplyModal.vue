<template>
  <Dialog :open="isOpen" @update:open="onClose">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Reply to Appointment</DialogTitle>
        <DialogDescription>
          Respond to the appointment request
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Appointment Details -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="flex items-center gap-2 mb-2">
            <Calendar class="w-4 h-4 text-gray-600" />
            <span class="text-sm font-medium">{{ formatDateTime(appointment?.appointment_date, appointment?.appointment_time) }}</span>
          </div>
          
          <div class="flex items-center gap-2 mb-2">
            <User class="w-4 h-4 text-gray-600" />
            <span class="text-sm">{{ appointment?.name }}</span>
          </div>
          
          <div class="flex items-center gap-2 mb-2">
            <Mail class="w-4 h-4 text-gray-600" />
            <span class="text-sm">{{ appointment?.email }}</span>
          </div>
          
          <div v-if="appointment?.phone" class="flex items-center gap-2 mb-2">
            <Phone class="w-4 h-4 text-gray-600" />
            <span class="text-sm">{{ appointment?.phone }}</span>
          </div>
          
          <div v-if="appointment?.message" class="flex items-start gap-2">
            <MessageSquare class="w-4 h-4 text-gray-600 mt-0.5" />
            <span class="text-sm">{{ appointment?.message }}</span>
          </div>
        </div>

        <form @submit="handleSubmit" class="space-y-4">
          <!-- Status -->
          <div>
            <Label for="status">Status</Label>
            <Select v-model="status" name="status">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Notes -->
          <div>
            <Label for="notes">Notes</Label>
            <Textarea
              id="notes"
              v-model="notes"
              placeholder="Add your response notes..."
              rows="4"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" @click="onClose">
              Cancel
            </Button>
            <Button type="submit">
              Send Response
            </Button>
          </DialogFooter>
        </form>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useTranslation } from 'vue-i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Mail, Phone, MessageSquare, User } from 'lucide-vue-next';

interface AppointmentReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { notes: string; status: string }) => void;
  appointment: any;
}

const props = defineProps<AppointmentReplyModalProps>();

const { t } = useTranslation();

const notes = ref('');
const status = ref('');

watch(() => props.appointment, (appointment) => {
  if (appointment) {
    notes.value = appointment.notes || '';
    status.value = appointment.status || 'scheduled';
  }
}, { immediate: true });

const handleSubmit = (event: Event) => {
  event.preventDefault();
  props.onSubmit({ notes: notes.value, status: status.value });
};

const formatDateTime = (date: string, time: string) => {
  if (!date) return 'N/A';
  try {
    // Handle both date formats (appointment_date from API and date from calendar)
    const dateVal = new Date(date).toISOString().split('T')[0];
    const timeVal = time || '00:00';
    const dateTimeString = `${dateVal} ${timeVal}:00`;
    return window.appSettings?.formatDateTime(dateTimeString, true) || 
      `${new Date(date).toLocaleDateString()} ${time || '00:00'}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};
</script>

<style scoped>
.appointment-reply-modal {
  /* Component styles are handled by Tailwind classes */
}
</style>
