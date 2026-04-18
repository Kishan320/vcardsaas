<template>
    <AppLayout>
        <Head title="Calendar" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Calendar</h1>
                    <p class="text-sm text-gray-500 mt-0.5">View and manage appointments</p>
                </div>
            </div>

            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                <FullCalendar :options="calendarOptions" />
            </div>
        </div>

        <!-- Appointment Detail Modal -->
        <Modal :show="showModal" max-width="sm" :closeable="true" @close="showModal = false">
            <div class="p-6" v-if="selectedEvent">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ selectedEvent.title }}</h3>
                <div class="space-y-3 text-sm">
                    <div class="flex items-center gap-2 text-gray-600">
                        <CalendarDays :size="14" class="text-gray-400" />
                        <span>{{ selectedEvent.start }}</span>
                    </div>
                    <div v-if="selectedEvent.extendedProps?.email" class="flex items-center gap-2 text-gray-600">
                        <Mail :size="14" class="text-gray-400" />
                        <span>{{ selectedEvent.extendedProps.email }}</span>
                    </div>
                    <div v-if="selectedEvent.extendedProps?.phone" class="flex items-center gap-2 text-gray-600">
                        <Phone :size="14" class="text-gray-400" />
                        <span>{{ selectedEvent.extendedProps.phone }}</span>
                    </div>
                    <div v-if="selectedEvent.extendedProps?.message" class="flex items-start gap-2 text-gray-600">
                        <MessageSquare :size="14" class="text-gray-400 mt-0.5" />
                        <span>{{ selectedEvent.extendedProps.message }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                            :class="{
                                'bg-amber-50 text-amber-700': selectedEvent.extendedProps?.status === 'pending',
                                'bg-green-50 text-green-700': selectedEvent.extendedProps?.status === 'confirmed',
                                'bg-red-50 text-red-700': selectedEvent.extendedProps?.status === 'cancelled',
                            }">
                            {{ selectedEvent.extendedProps?.status }}
                        </span>
                    </div>
                </div>
                <div class="flex gap-2 mt-5">
                    <button v-if="selectedEvent.extendedProps?.status === 'pending'" @click="updateStatus(selectedEvent.id, 'confirmed')"
                        class="flex-1 py-2 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Confirm
                    </button>
                    <button @click="showModal = false" class="flex-1 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarDays, Mail, Phone, MessageSquare } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';

interface Appointment { id: number; name: string; email: string; phone?: string; date: string; time?: string; status: string; message?: string }

const props = defineProps<{ appointments: Appointment[] }>();

const showModal = ref(false);
const selectedEvent = ref<any>(null);

const events = computed(() => props.appointments.map(a => ({
    id: String(a.id),
    title: a.name,
    start: a.time ? `${a.date}T${a.time}` : a.date,
    backgroundColor: a.status === 'confirmed' ? '#10b981' : a.status === 'cancelled' ? '#ef4444' : '#f59e0b',
    borderColor: 'transparent',
    extendedProps: { email: a.email, phone: a.phone, message: a.message, status: a.status },
})));

const calendarOptions = computed(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: events.value,
    eventClick: (info: any) => {
        selectedEvent.value = info.event;
        showModal.value = true;
    },
    height: 'auto',
}));

const updateStatus = (id: string, status: string) => {
    router.put(route('appointments.update', id), { status }, {
        onSuccess: () => { showModal.value = false; },
    });
};
</script>
