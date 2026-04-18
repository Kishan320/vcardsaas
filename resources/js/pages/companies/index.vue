<template>
    <AppLayout>
        <Head title="Companies" />
        <FlashMessage />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Companies</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Manage all company accounts</p>
                </div>
                <button @click="openCreate" class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95">
                    <Plus :size="16" /> Add Company
                </button>
            </div>

            <!-- Filters -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4 flex flex-col sm:flex-row gap-3">
                <div class="relative flex-1">
                    <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="searchTerm" type="text" placeholder="Search companies…"
                        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                        @keyup.enter="applyFilters" />
                </div>
                <select v-model="statusFilter" @change="applyFilters"
                    class="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <div class="flex items-center gap-2">
                    <button @click="activeView = 'list'" class="p-2 rounded-lg transition-colors" :class="activeView === 'list' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100 text-gray-500'">
                        <List :size="16" />
                    </button>
                    <button @click="activeView = 'grid'" class="p-2 rounded-lg transition-colors" :class="activeView === 'grid' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100 text-gray-500'">
                        <LayoutGrid :size="16" />
                    </button>
                </div>
            </div>

            <!-- List View -->
            <div v-if="activeView === 'list'" class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Businesses</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="company in companies.data" :key="company.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                            {{ initials(company.name) }}
                                        </div>
                                        <div>
                                            <p class="font-medium text-gray-900">{{ company.name }}</p>
                                            <p class="text-xs text-gray-500">{{ company.email }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium capitalize">
                                        {{ company.plan_name ?? 'No Plan' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                                        :class="company.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                                        <span class="w-1.5 h-1.5 rounded-full" :class="company.status === 'active' ? 'bg-green-500' : 'bg-red-500'" />
                                        {{ company.status === 'active' ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ company.business_count ?? 0 }}</td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(company.created_at) }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="loginAs(company)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Login as Company">
                                            <ArrowUpRight :size="15" />
                                        </button>
                                        <button @click="openUpgradePlan(company)" class="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors" title="Upgrade Plan">
                                            <CreditCard :size="15" />
                                        </button>
                                        <button @click="openResetPassword(company)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Reset Password">
                                            <KeyRound :size="15" />
                                        </button>
                                        <button @click="toggleStatus(company)" class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" :title="company.status === 'active' ? 'Disable' : 'Enable'">
                                            <Lock v-if="company.status === 'active'" :size="15" />
                                            <Unlock v-else :size="15" />
                                        </button>
                                        <button @click="openEdit(company)" class="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors" title="Edit">
                                            <Pencil :size="15" />
                                        </button>
                                        <button @click="handleDelete(company)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!companies.data?.length">
                                <td colspan="6" class="px-4 py-12 text-center text-sm text-gray-400">No companies found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="companies.links" :from="companies.from ?? 0" :to="companies.to ?? 0" :total="companies.total ?? 0" />
            </div>

            <!-- Grid View -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div v-for="company in companies.data" :key="company.id"
                    class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden card-hover">
                    <div class="p-5">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                                    {{ initials(company.name) }}
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">{{ company.name }}</h3>
                                    <p class="text-xs text-gray-500">{{ company.email }}</p>
                                </div>
                            </div>
                            <span class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                                :class="company.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                                {{ company.status === 'active' ? 'Active' : 'Inactive' }}
                            </span>
                        </div>
                        <div class="border border-gray-100 rounded-xl p-3 mb-4 text-center">
                            <p class="text-xs text-gray-500">Plan</p>
                            <p class="font-semibold text-gray-900 capitalize">{{ company.plan_name ?? 'No Plan' }}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            <div class="text-center p-3 border border-gray-100 rounded-xl">
                                <p class="text-xl font-bold text-gray-900">{{ company.business_count ?? 0 }}</p>
                                <p class="text-xs text-gray-500">Businesses</p>
                            </div>
                            <div class="text-center p-3 border border-gray-100 rounded-xl">
                                <p class="text-xl font-bold text-gray-900">{{ company.appointments_count ?? 0 }}</p>
                                <p class="text-xs text-gray-500">Appointments</p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button @click="openEdit(company)" class="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <Pencil :size="12" /> Edit
                            </button>
                            <button @click="loginAs(company)" class="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                                <ArrowUpRight :size="12" /> Login As
                            </button>
                            <button @click="handleDelete(company)" class="p-2 text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
                                <Trash2 :size="14" />
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="!companies.data?.length" class="col-span-full bg-white border border-gray-100 rounded-2xl shadow-card p-12 text-center text-sm text-gray-400">
                    No companies found
                </div>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <Modal :show="showModal" max-width="md" :closeable="true" @close="closeModal">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">{{ editing ? 'Edit Company' : 'Add Company' }}</h3>
                <Form @submit="submitForm" class="space-y-4" v-slot="{ errors }">
                    <div>
                        <InputLabel value="Company Name" required />
                        <Field name="name" :rules="nameSchema" v-model="form.name">
                            <TextInput v-model="form.name" type="text" :has-error="!!(errors.name || form.errors.name)" class="mt-1.5" />
                        </Field>
                        <ErrorMessage name="name" class="mt-1 text-sm text-red-600" />
                        <InputError :message="form.errors.name" />
                    </div>
                    <div>
                        <InputLabel value="Email" required />
                        <Field name="email" :rules="emailSchema" v-model="form.email">
                            <TextInput v-model="form.email" type="email" :has-error="!!(errors.email || form.errors.email)" class="mt-1.5" />
                        </Field>
                        <ErrorMessage name="email" class="mt-1 text-sm text-red-600" />
                        <InputError :message="form.errors.email" />
                    </div>
                    <div v-if="!editing">
                        <InputLabel value="Password" required />
                        <Field name="password" :rules="passwordSchema" v-model="form.password">
                            <TextInput v-model="form.password" type="password" :has-error="!!(errors.password || form.errors.password)" class="mt-1.5" />
                        </Field>
                        <ErrorMessage name="password" class="mt-1 text-sm text-red-600" />
                        <InputError :message="form.errors.password" />
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

        <!-- Reset Password Modal -->
        <Modal :show="showResetModal" max-width="sm" :closeable="true" @close="showResetModal = false">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">Reset Password — {{ selectedCompany?.name }}</h3>
                <Form @submit="submitReset" class="space-y-4" v-slot="{ errors }">
                    <div>
                        <InputLabel value="New Password" required />
                        <Field name="password" :rules="passwordSchema" v-model="resetForm.password">
                            <TextInput v-model="resetForm.password" type="password" :has-error="!!(errors.password)" class="mt-1.5" />
                        </Field>
                        <ErrorMessage name="password" class="mt-1 text-sm text-red-600" />
                    </div>
                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="showResetModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="resetForm.processing">Reset</PrimaryButton>
                    </div>
                </Form>
            </div>
        </Modal>

        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Company</h3>
                <p class="text-sm text-gray-600 mb-6">Delete <strong>{{ selectedCompany?.name }}</strong>?</p>
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
import { Head, router, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { Plus, Search, List, LayoutGrid, ArrowUpRight, CreditCard, KeyRound, Lock, Unlock, Pencil, Trash2, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

interface Company { id: number; name: string; email: string; status: string; plan_name?: string; business_count?: number; appointments_count?: number; created_at: string; plan_id?: number }

const props = defineProps<{
    companies: { data: Company[]; links: any[]; from?: number; to?: number; total?: number };
    plans?: any[];
    filters?: { search?: string; status?: string };
}>();

const searchTerm = ref(props.filters?.search ?? '');
const statusFilter = ref(props.filters?.status ?? '');
const activeView = ref('list');
const showModal = ref(false);
const showDeleteModal = ref(false);
const showResetModal = ref(false);
const editing = ref<Company | null>(null);
const selectedCompany = ref<Company | null>(null);

const form = useForm({ name: '', email: '', password: '' });
const resetForm = useForm({ password: '' });
const deleteForm = useForm({});

const nameSchema = yup.string().required('Name is required').min(2);
const emailSchema = yup.string().required('Email is required').email('Invalid email');
const passwordSchema = yup.string().required('Password is required').min(8, 'At least 8 characters');

const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
const formatDate = (d: string) => new Date(d).toLocaleDateString();

const applyFilters = () => router.get(route('companies.index'), { search: searchTerm.value || undefined, status: statusFilter.value || undefined }, { preserveState: true });

const openCreate = () => { editing.value = null; form.reset(); showModal.value = true; };
const openEdit = (c: Company) => { editing.value = c; form.name = c.name; form.email = c.email; showModal.value = true; };
const closeModal = () => { showModal.value = false; form.reset(); editing.value = null; };

const submitForm = () => {
    if (editing.value) {
        form.put(route('companies.update', editing.value.id), { onSuccess: closeModal });
    } else {
        form.post(route('companies.store'), { onSuccess: closeModal });
    }
};

const loginAs = (c: Company) => router.get(route('impersonate.start', c.id));
const toggleStatus = (c: Company) => router.put(route('companies.toggle-status', c.id), {});
const openUpgradePlan = (c: Company) => { selectedCompany.value = c; };
const openResetPassword = (c: Company) => { selectedCompany.value = c; resetForm.reset(); showResetModal.value = true; };
const submitReset = () => {
    if (!selectedCompany.value) return;
    resetForm.put(route('companies.reset-password', selectedCompany.value.id), { onSuccess: () => { showResetModal.value = false; } });
};
const handleDelete = (c: Company) => { selectedCompany.value = c; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedCompany.value) return;
    deleteForm.delete(route('companies.destroy', selectedCompany.value.id), { onSuccess: () => { showDeleteModal.value = false; } });
};
</script>
