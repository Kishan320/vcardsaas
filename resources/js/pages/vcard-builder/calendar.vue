<template>
    <AppLayout>
        <Head title="VCard Calendar" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex items-center gap-3">
                <Link :href="route('vcard-builder.index')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft :size="18" class="text-gray-500" />
                </Link>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Calendar</h1>
                    <p class="text-sm text-gray-500 mt-0.5">{{ business?.name }}</p>
                </div>
            </div>

            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                <FullCalendar :options="calendarOptions" />
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ArrowLeft } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';

const props = defineProps<{
    business?: any;
    appointments: { id: number; title: string; date: string; time?: string; status: string }[];
}>();

const events = computed(() => props.appointments.map(a => ({
    id: String(a.id),
    title: a.title,
    start: a.time ? `${a.date}T${a.time}` : a.date,
    backgroundColor: a.status === 'confirmed' ? '#10b981' : a.status === 'cancelled' ? '#ef4444' : '#f59e0b',
    borderColor: 'transparent',
})));

const calendarOptions = computed(() => ({
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
    events: events.value,
    height: 'auto',
}));
</script>
