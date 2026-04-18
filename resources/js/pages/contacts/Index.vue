<template>
    <AppLayout>
        <Head title="Contacts" />
        <FlashMessage />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Contacts</h1>
                    <p class="text-sm text-gray-500 mt-0.5">People who contacted you via your VCards</p>
                </div>
            </div>

            <!-- Search -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4">
                <div class="relative max-w-sm">
                    <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        v-model="searchTerm"
                        type="text"
                        placeholder="Search contacts…"
                        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                        @keyup.enter="applySearch"
                    />
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="contact in contacts.data" :key="contact.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold flex-shrink-0">
                                            {{ initials(contact.name) }}
                                        </div>
                                        <div>
                                            <p class="font-medium text-gray-900">{{ contact.name }}</p>
                                            <p class="text-xs text-gray-500">{{ contact.email }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ contact.phone ?? '—' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{{ contact.message ?? '—' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(contact.created_at) }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="openReplyModal(contact)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Reply">
                                            <Reply :size="15" />
                                        </button>
                                        <button @click="handleDeleteClick(contact)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!contacts.data.length">
                                <td colspan="5" class="px-4 py-12 text-center text-sm text-gray-400">No contacts yet</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="contacts.links" :from="contacts.from ?? 0" :to="contacts.to ?? 0" :total="contacts.total ?? 0" />
            </div>
        </div>

        <!-- Reply Modal -->
        <Modal :show="showReplyModal" max-width="md" :closeable="true" @close="showReplyModal = false">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">Reply to {{ selectedContact?.name }}</h3>
                <p class="text-sm text-gray-500 mb-5">{{ selectedContact?.email }}</p>
                <Form @submit="submitReply" class="space-y-4" v-slot="{ errors }">
                    <div>
                        <InputLabel value="Subject" required />
                        <Field name="subject" :rules="subjectSchema" v-model="replyForm.subject">
                            <TextInput v-model="replyForm.subject" type="text" :has-error="!!(errors.subject)" class="mt-1.5" placeholder="Re: Your inquiry" />
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
                <h3 class="font-semibold text-gray-900 mb-2">Delete Contact</h3>
                <p class="text-sm text-gray-600 mb-6">Are you sure you want to delete <strong>{{ selectedContact?.name }}</strong>?</p>
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button @click="confirmDelete" :disabled="deleteForm.processing" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { Search, Reply, Trash2, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';
import type { PaginatedData, Contact } from '@/types';

const props = defineProps<{
    contacts: PaginatedData<Contact>;
    filters?: { search?: string };
}>();

const searchTerm = ref(props.filters?.search ?? '');
const showReplyModal = ref(false);
const showDeleteModal = ref(false);
const selectedContact = ref<Contact | null>(null);

const replyForm = useForm({ subject: '', message: '' });
const deleteForm = useForm({});

const subjectSchema = yup.string().required('Subject is required').min(3, 'At least 3 characters');
const messageSchema = yup.string().required('Message is required').min(10, 'At least 10 characters');

const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
const formatDate = (date: string) => new Date(date).toLocaleDateString();

const applySearch = () => router.get(route('contacts.index'), { search: searchTerm.value || undefined }, { preserveState: true });

const openReplyModal = (contact: Contact) => {
    selectedContact.value = contact;
    replyForm.reset();
    showReplyModal.value = true;
};

const submitReply = () => {
    if (!selectedContact.value) return;
    replyForm.post(route('contacts.reply', selectedContact.value.id), {
        onSuccess: () => { showReplyModal.value = false; },
    });
};

const handleDeleteClick = (contact: Contact) => {
    selectedContact.value = contact;
    showDeleteModal.value = true;
};

const confirmDelete = () => {
    if (!selectedContact.value) return;
    deleteForm.delete(route('contacts.destroy', selectedContact.value.id), {
        onSuccess: () => { showDeleteModal.value = false; },
    });
};
</script>
