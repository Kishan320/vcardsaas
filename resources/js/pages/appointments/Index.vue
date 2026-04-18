<template>
    <AppLayout>
        <Head title="Appointments" />
        <FlashMessage />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Appointments</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Manage appointment requests from your VCards</p>
                </div>
                <Link
                    :href="route('calendar.index')"
                    class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                    <CalendarDays :size="16" /> Calendar View
                </Link>
            </div>

            <!-- Filters -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4 flex flex-col sm:flex-row gap-3">
                <div class="relative flex-1">
                    <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        v-model="searchTerm"
                        type="text"
                        placeholder="Search appointments…"
                        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                        @keyup.enter="applySearch"
                    />
                </div>
                <select
                    v-model="statusFilter"
                    class="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    @change="applySearch"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <!-- Table -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Person</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="appt in appointments.data" :key="appt.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold flex-shrink-0">
                                            {{ initials(appt.name) }}
                                        </div>
                                        <div>
                                            <p class="font-medium text-gray-900">{{ appt.name }}</p>
                                            <p class="text-xs text-gray-500">{{ appt.email }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <p class="text-sm font-medium text-gray-900">{{ appt.date }}</p>
                                    <p class="text-xs text-gray-500">{{ appt.time }}</p>
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                                        :class="{
                                            'bg-amber-50 text-amber-700': appt.status === 'pending',
                                            'bg-green-50 text-green-700': appt.status === 'confirmed',
                                            'bg-red-50 text-red-700': appt.status === 'cancelled',
                                        }"
                                    >
                                        {{ appt.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{{ appt.message ?? '—' }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="openReplyModal(appt)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Reply">
                                            <Reply :size="15" />
                                        </button>
                                        <button @click="updateStatus(appt, 'confirmed')" v-if="appt.status === 'pending'" class="p-1.5 rounded-lg hover:bg-green-50 text-green-500 transition-colors" title="Confirm">
                                            <CheckCircle :size="15" />
                                        </button>
                                        <button @click="updateStatus(appt, 'cancelled')" v-if="appt.status !== 'cancelled'" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Cancel">
                                            <XCircle :size="15" />
                                        </button>
                                        <button @click="handleDeleteClick(appt)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!appointments.data.length">
                                <td colspan="5" class="px-4 py-12 text-center text-sm text-gray-400">No appointments yet</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="appointments.links" :from="appointments.from ?? 0" :to="appointments.to ?? 0" :total="appointments.total ?? 0" />
            </div>
        </div>

        <!-- Reply Modal -->
        <Modal :show="showReplyModal" max-width="md" :closeable="true" @close="showReplyModal = false">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">Reply to {{ selectedAppt?.name }}</h3>
                <p class="text-sm text-gray-500 mb-5">{{ selectedAppt?.email }}</p>
                <Form @submit="submitReply" class="space-y-4" v-slot="{ errors }">
                    <div>
                        <InputLabel value="Subject" required />
                        <Field name="subject" :rules="subjectSchema" v-model="replyForm.subject">
                            <TextInput v-model="replyForm.subject" type="text" :has-error="!!(errors.subject)" class="mt-1.5" placeholder="Re: Your appointment" />
                        </Field>
                        <ErrorMessage name="subject" class="mt-1 text-sm text-red-600" />
                    </div>
                    <div>
                        <InputLabel value="Message" required />
                        <Field name="message" :rules="messageSchema" v-model="replyForm.message">
                            <textarea
                                v-model="replyForm.message"
                                rows="4"
                                class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                :class="{ 'border-red-500': errors.message }"
                                placeholder="Your reply…"
                            />
                        </Field>
                        <ErrorMessage name="message" class="mt-1 text-sm text-red-600" />
                    </div>
                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="showReplyModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="replyForm.processing">
                            <Loader2 v-if="replyForm.processing" :size="14" class="mr-1 animate-spin" />
                            Send Reply
                        </PrimaryButton>
                    </div>
                </Form>
            </div>
        </Modal>

        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Appointment</h3>
                <p class="text-sm text-gray-600 mb-6">Are you sure you want to delete this appointment from <strong>{{ selectedAppt?.name }}</strong>?</p>
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button @click="confirmDelete" :disabled="deleteForm.processing" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Delete</button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { Search, CalendarDays, Reply, CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';
import type { PaginatedData, Appointment } from '@/types';

const props = defineProps<{
    appointments: PaginatedData<Appointment>;
    filters?: { search?: string; status?: string };
}>();

const searchTerm = ref(props.filters?.search ?? '');
const statusFilter = ref(props.filters?.status ?? '');
const showReplyModal = ref(false);
const showDeleteModal = ref(false);
const selectedAppt = ref<Appointment | null>(null);

const replyForm = useForm({ subject: '', message: '' });
const deleteForm = useForm({});

const subjectSchema = yup.string().required('Subject is required');
const messageSchema = yup.string().required('Message is required').min(10, 'At least 10 characters');

const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const applySearch = () => {
    router.get(route('appointments.index'), {
        search: searchTerm.value || undefined,
        status: statusFilter.value || undefined,
    }, { preserveState: true });
};

const updateStatus = (appt: Appointment, status: string) => {
    router.put(route('appointments.update', appt.id), { status });
};

const openReplyModal = (appt: Appointment) => {
    selectedAppt.value = appt;
    replyForm.reset();
    showReplyModal.value = true;
};

const submitReply = () => {
    if (!selectedAppt.value) return;
    replyForm.post(route('appointments.reply', selectedAppt.value.id), {
        onSuccess: () => { showReplyModal.value = false; },
    });
};

const handleDeleteClick = (appt: Appointment) => {
    selectedAppt.value = appt;
    showDeleteModal.value = true;
};

const confirmDelete = () => {
    if (!selectedAppt.value) return;
    deleteForm.delete(route('appointments.destroy', selectedAppt.value.id), {
        onSuccess: () => { showDeleteModal.value = false; },
    });
};
</script>
