<template>
    <AppLayout>
        <Head title="Users" />
        <FlashMessage />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Users</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Manage all registered users</p>
                </div>
                <button
                    @click="openCreateModal"
                    class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95"
                >
                    <Plus :size="16" /> Add User
                </button>
            </div>

            <!-- Search -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4">
                <div class="relative max-w-sm">
                    <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        v-model="searchTerm"
                        type="text"
                        placeholder="Search users…"
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
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="user in users.data" :key="user.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                            {{ initials(user.name) }}
                                        </div>
                                        <div>
                                            <p class="font-medium text-gray-900">{{ user.name }}</p>
                                            <p class="text-xs text-gray-500">{{ user.email }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium capitalize">
                                        {{ user.role ?? 'user' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                                        :class="user.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
                                    >
                                        <span class="w-1.5 h-1.5 rounded-full" :class="user.is_active ? 'bg-green-500' : 'bg-red-500'" />
                                        {{ user.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(user.created_at) }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="openEditModal(user)" class="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors" title="Edit">
                                            <Pencil :size="15" />
                                        </button>
                                        <button @click="toggleStatus(user)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" :title="user.is_active ? 'Deactivate' : 'Activate'">
                                            <ToggleLeft v-if="user.is_active" :size="15" />
                                            <ToggleRight v-else :size="15" />
                                        </button>
                                        <button @click="handleDeleteClick(user)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!users.data.length">
                                <td colspan="5" class="px-4 py-12 text-center text-sm text-gray-400">No users found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="users.links" :from="users.from ?? 0" :to="users.to ?? 0" :total="users.total ?? 0" />
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <Modal :show="showFormModal" max-width="md" :closeable="true" @close="closeModal">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">{{ editingUser ? 'Edit User' : 'Add User' }}</h3>
                <Form @submit="submitForm" class="space-y-4" v-slot="{ errors }">
                    <div>
                        <InputLabel value="Full Name" required />
                        <div class="relative mt-1.5">
                            <Field name="name" :rules="nameSchema" v-model="form.name">
                                <TextInput v-model="form.name" type="text" :has-error="!!(errors.name || form.errors.name)" placeholder="Jane Smith" />
                            </Field>
                        </div>
                        <ErrorMessage name="name" class="mt-1 text-sm text-red-600" />
                        <InputError :message="form.errors.name" />
                    </div>
                    <div>
                        <InputLabel value="Email" required />
                        <div class="relative mt-1.5">
                            <Field name="email" :rules="emailSchema" v-model="form.email">
                                <TextInput v-model="form.email" type="email" :has-error="!!(errors.email || form.errors.email)" placeholder="user@example.com" />
                            </Field>
                        </div>
                        <ErrorMessage name="email" class="mt-1 text-sm text-red-600" />
                        <InputError :message="form.errors.email" />
                    </div>
                    <div v-if="!editingUser">
                        <InputLabel value="Password" required />
                        <div class="relative mt-1.5">
                            <Field name="password" :rules="passwordSchema" v-model="form.password">
                                <TextInput v-model="form.password" type="password" :has-error="!!(errors.password || form.errors.password)" placeholder="••••••••" />
                            </Field>
                        </div>
                        <ErrorMessage name="password" class="mt-1 text-sm text-red-600" />
                        <InputError :message="form.errors.password" />
                    </div>
                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <PrimaryButton :disabled="form.processing">
                            <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin" />
                            {{ editingUser ? 'Update' : 'Create' }}
                        </PrimaryButton>
                    </div>
                </Form>
            </div>
        </Modal>

        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete User</h3>
                <p class="text-sm text-gray-600 mb-6">Are you sure you want to delete <strong>{{ selectedUser?.name }}</strong>?</p>
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button @click="confirmDelete" :disabled="deleteForm.processing" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                        <Loader2 v-if="deleteForm.processing" :size="14" class="mr-1 animate-spin inline" />
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
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';
import type { PaginatedData } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    is_active: boolean;
    created_at: string;
}

const props = defineProps<{
    users: PaginatedData<User>;
    filters?: { search?: string };
}>();

const searchTerm = ref(props.filters?.search ?? '');
const showFormModal = ref(false);
const showDeleteModal = ref(false);
const editingUser = ref<User | null>(null);
const selectedUser = ref<User | null>(null);

const form = useForm({ name: '', email: '', password: '', role: 'user' });
const deleteForm = useForm({});

const nameSchema = yup.string().required('Name is required').min(2, 'At least 2 characters');
const emailSchema = yup.string().required('Email is required').email('Enter a valid email');
const passwordSchema = yup.string().required('Password is required').min(8, 'At least 8 characters');

const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
const formatDate = (date: string) => new Date(date).toLocaleDateString();

const applySearch = () => router.get(route('users.index'), { search: searchTerm.value || undefined }, { preserveState: true });

const openCreateModal = () => {
    editingUser.value = null;
    form.reset();
    showFormModal.value = true;
};

const openEditModal = (user: User) => {
    editingUser.value = user;
    form.name = user.name;
    form.email = user.email;
    form.password = '';
    showFormModal.value = true;
};

const closeModal = () => { showFormModal.value = false; form.reset(); };

const submitForm = () => {
    if (editingUser.value) {
        form.put(route('users.update', editingUser.value.id), { onSuccess: closeModal });
    } else {
        form.post(route('users.store'), { onSuccess: closeModal });
    }
};

const toggleStatus = (user: User) => {
    router.put(route('users.toggle-status', user.id), {});
};

const handleDeleteClick = (user: User) => {
    selectedUser.value = user;
    showDeleteModal.value = true;
};

const confirmDelete = () => {
    if (!selectedUser.value) return;
    deleteForm.delete(route('users.destroy', selectedUser.value.id), {
        onSuccess: () => { showDeleteModal.value = false; },
    });
};
</script>
