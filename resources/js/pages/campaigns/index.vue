<template>
    <AppLayout>
        <Head title="Campaigns" />
        <FlashMessage />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Campaigns</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Manage advertising campaigns</p>
                </div>
                <button @click="openCreate" class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95">
                    <Plus :size="16" /> Create Campaign
                </button>
            </div>

            <!-- Filters -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4 flex flex-col sm:flex-row gap-3">
                <div class="relative flex-1">
                    <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="searchTerm" type="text" placeholder="Search campaigns…"
                        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                        @keyup.enter="applyFilters" />
                </div>
                <select v-model="statusFilter" @change="applyFilters"
                    class="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <!-- Table -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
                                <th v-if="isAdmin" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Days</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="campaign in campaigns.data" :key="campaign.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <p class="font-medium text-gray-900">{{ campaign.name }}</p>
                                    <p v-if="campaign.description" class="text-xs text-gray-500 truncate max-w-xs">{{ campaign.description }}</p>
                                </td>
                                <td v-if="isAdmin" class="px-4 py-3 text-sm text-gray-600">{{ campaign.user?.name }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ campaign.business?.name }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600">
                                    <p>{{ formatDate(campaign.start_date) }}</p>
                                    <p class="text-xs text-gray-400">→ {{ formatDate(campaign.end_date) }}</p>
                                </td>
                                <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ campaign.total_days }}d</td>
                                <td class="px-4 py-3 text-sm font-medium text-gray-900">${{ parseFloat(campaign.total_amount).toFixed(2) }}</td>
                                <td class="px-4 py-3">
                                    <span class="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                                        :class="{
                                            'bg-amber-50 text-amber-700': campaign.status === 'pending',
                                            'bg-green-50 text-green-700': campaign.status === 'active',
                                            'bg-blue-50 text-blue-700': campaign.status === 'completed',
                                            'bg-red-50 text-red-700': campaign.status === 'cancelled',
                                        }">
                                        {{ campaign.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <Link :href="route('campaigns.analytics', campaign.id)" class="p-1.5 rounded-lg hover:bg-green-50 text-green-500 transition-colors" title="Analytics">
                                            <BarChart3 :size="15" />
                                        </Link>
                                        <button v-if="isAdmin" @click="openEdit(campaign)" class="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors" title="Edit">
                                            <Pencil :size="15" />
                                        </button>
                                        <button v-if="isAdmin" @click="toggleStatus(campaign)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Toggle Status">
                                            <ToggleLeft v-if="campaign.is_active" :size="15" />
                                            <ToggleRight v-else :size="15" />
                                        </button>
                                        <button @click="handleDelete(campaign)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!campaigns.data?.length">
                                <td :colspan="isAdmin ? 8 : 7" class="px-4 py-12 text-center text-sm text-gray-400">No campaigns found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="campaigns.links" :from="campaigns.from ?? 0" :to="campaigns.to ?? 0" :total="campaigns.total ?? 0" />
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <Modal :show="showModal" max-width="lg" :closeable="true" @close="closeModal">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">{{ editing ? 'Edit Campaign' : 'Create Campaign' }}</h3>
                <Form @submit="submitForm" class="space-y-4" v-slot="{ errors }">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="sm:col-span-2">
                            <InputLabel value="Campaign Name" required />
                            <Field name="name" :rules="nameSchema" v-model="form.name">
                                <TextInput v-model="form.name" type="text" :has-error="!!(errors.name || form.errors.name)" class="mt-1.5" />
                            </Field>
                            <ErrorMessage name="name" class="mt-1 text-sm text-red-600" />
                            <InputError :message="form.errors.name" />
                        </div>
                        <div>
                            <InputLabel value="Start Date" required />
                            <TextInput v-model="form.start_date" type="date" class="mt-1.5" />
                            <InputError :message="form.errors.start_date" />
                        </div>
                        <div>
                            <InputLabel value="End Date" required />
                            <TextInput v-model="form.end_date" type="date" class="mt-1.5" />
                            <InputError :message="form.errors.end_date" />
                        </div>
                        <div v-if="isAdmin">
                            <InputLabel value="Status" />
                            <select v-model="form.status" class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200">
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="form.processing">
                            <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin" />
                            {{ editing ? 'Update' : 'Create' }}
                        </PrimaryButton>
                    </div>
                </Form>
            </div>
        </Modal>

        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Campaign</h3>
                <p class="text-sm text-gray-600 mb-6">Delete <strong>{{ selectedCampaign?.name }}</strong>?</p>
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
import { Plus, Search, BarChart3, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

interface Campaign { id: number; name: string; description?: string; status: string; is_active: boolean; start_date: string; end_date: string; total_days: number; total_amount: string; payment_method: string; user?: { name: string }; business?: { name: string } }

const props = defineProps<{
    campaigns: { data: Campaign[]; links: any[]; from?: number; to?: number; total?: number };
    isAdmin?: boolean;
    filters?: { search?: string; status?: string };
}>();

const searchTerm = ref(props.filters?.search ?? '');
const statusFilter = ref(props.filters?.status ?? '');
const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref<Campaign | null>(null);
const selectedCampaign = ref<Campaign | null>(null);

const form = useForm({ name: '', description: '', start_date: '', end_date: '', status: 'pending', is_active: true });
const deleteForm = useForm({});
const nameSchema = yup.string().required('Campaign name is required');

const formatDate = (d: string) => new Date(d).toLocaleDateString();
const applyFilters = () => router.get(route('campaigns.index'), { search: searchTerm.value || undefined, status: statusFilter.value || undefined }, { preserveState: true });

const openCreate = () => { editing.value = null; form.reset(); showModal.value = true; };
const openEdit = (c: Campaign) => {
    editing.value = c;
    form.name = c.name;
    form.description = c.description ?? '';
    form.start_date = c.start_date?.split('T')[0] ?? '';
    form.end_date = c.end_date?.split('T')[0] ?? '';
    form.status = c.status;
    form.is_active = c.is_active;
    showModal.value = true;
};
const closeModal = () => { showModal.value = false; form.reset(); editing.value = null; };

const submitForm = () => {
    if (editing.value) {
        form.put(route('campaigns.update', editing.value.id), { onSuccess: closeModal });
    } else {
        form.post(route('campaigns.store'), { onSuccess: closeModal });
    }
};

const toggleStatus = (c: Campaign) => router.put(route('campaigns.toggle-status', c.id), {});
const handleDelete = (c: Campaign) => { selectedCampaign.value = c; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedCampaign.value) return;
    deleteForm.delete(route('campaigns.destroy', selectedCampaign.value.id), { onSuccess: () => { showDeleteModal.value = false; } });
};
</script>
