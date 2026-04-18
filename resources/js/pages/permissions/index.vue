<template>
    <AppLayout>
        <Head title="Permissions" />
        <FlashMessage />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Permissions</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Manage system permissions</p>
                </div>
                <button @click="openCreate" class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95">
                    <Plus :size="16" /> Add Permission
                </button>
            </div>

            <!-- Search -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4">
                <div class="relative max-w-sm">
                    <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="search" type="text" placeholder="Search permissions…"
                        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                        @keyup.enter="applySearch" />
                </div>
            </div>

            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Permission</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Guard</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="perm in permissions.data" :key="perm.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                            <Key :size="14" class="text-amber-600" />
                                        </div>
                                        <span class="font-medium text-gray-900">{{ perm.name }}</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{{ perm.guard_name }}</span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="openEdit(perm)" class="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors" title="Edit">
                                            <Pencil :size="15" />
                                        </button>
                                        <button @click="handleDelete(perm)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!permissions.data?.length">
                                <td colspan="3" class="px-4 py-12 text-center text-sm text-gray-400">No permissions found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="permissions.links" :from="permissions.from ?? 0" :to="permissions.to ?? 0" :total="permissions.total ?? 0" />
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <Modal :show="showModal" max-width="sm" :closeable="true" @close="closeModal">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">{{ editing ? 'Edit Permission' : 'Create Permission' }}</h3>
                <Form @submit="submitForm" class="space-y-4" v-slot="{ errors }">
                    <div>
                        <InputLabel value="Permission Name" required />
                        <Field name="name" :rules="nameSchema" v-model="form.name">
                            <TextInput v-model="form.name" type="text" :has-error="!!(errors.name || form.errors.name)" class="mt-1.5" placeholder="e.g. manage-users" />
                        </Field>
                        <ErrorMessage name="name" class="mt-1 text-sm text-red-600" />
                        <InputError :message="form.errors.name" />
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
                <h3 class="font-semibold text-gray-900 mb-2">Delete Permission</h3>
                <p class="text-sm text-gray-600 mb-6">Delete <strong>{{ selectedPerm?.name }}</strong>?</p>
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
import { Plus, Search, Key, Pencil, Trash2, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

interface Permission { id: number; name: string; guard_name: string }

const props = defineProps<{
    permissions: { data: Permission[]; links: any[]; from?: number; to?: number; total?: number };
    filters?: { search?: string };
}>();

const search = ref(props.filters?.search ?? '');
const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref<Permission | null>(null);
const selectedPerm = ref<Permission | null>(null);

const form = useForm({ name: '' });
const deleteForm = useForm({});
const nameSchema = yup.string().required('Permission name is required').min(2);

const applySearch = () => router.get(route('permissions.index'), { search: search.value || undefined }, { preserveState: true });

const openCreate = () => { editing.value = null; form.reset(); showModal.value = true; };
const openEdit = (p: Permission) => { editing.value = p; form.name = p.name; showModal.value = true; };
const closeModal = () => { showModal.value = false; form.reset(); editing.value = null; };

const submitForm = () => {
    if (editing.value) {
        form.put(route('permissions.update', editing.value.id), { onSuccess: closeModal });
    } else {
        form.post(route('permissions.store'), { onSuccess: closeModal });
    }
};

const handleDelete = (p: Permission) => { selectedPerm.value = p; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedPerm.value) return;
    deleteForm.delete(route('permissions.destroy', selectedPerm.value.id), {
        onSuccess: () => { showDeleteModal.value = false; },
    });
};
</script>
