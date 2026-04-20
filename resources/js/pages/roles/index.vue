<template>
    <AppLayout>
        <Head title="Roles" />
        <FlashMessage />

        <div class="space-y-6">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Roles</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Manage user roles and their permissions</p>
                </div>
                <button @click="openCreate"
                    class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95">
                    <Plus :size="16" /> Add Role
                </button>
            </div>

            <!-- Table -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role Name</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Permissions</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Users</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="role in roles.data" :key="role.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                                            <Shield :size="16" class="text-primary-600" />
                                        </div>
                                        <div>
                                            <p class="font-medium text-gray-900">{{ role.label || role.name }}</p>
                                            <p class="text-xs text-gray-400">{{ role.name }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex flex-wrap gap-1 max-w-xs">
                                        <span v-for="perm in (role.permissions || []).slice(0, 3)" :key="perm.id"
                                            class="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                                            {{ perm.label || perm.name }}
                                        </span>
                                        <span v-if="(role.permissions || []).length > 3"
                                            class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                            +{{ role.permissions.length - 3 }} more
                                        </span>
                                        <span v-if="!(role.permissions || []).length" class="text-xs text-gray-400">—</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ role.users_count ?? 0 }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="openEdit(role)"
                                            class="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors" title="Edit">
                                            <Pencil :size="15" />
                                        </button>
                                        <button v-if="!role.is_system_role" @click="handleDelete(role)"
                                            class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!roles.data?.length">
                                <td colspan="4" class="px-4 py-12 text-center text-sm text-gray-400">No roles found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="roles.links" :from="roles.from ?? 0" :to="roles.to ?? 0" :total="roles.total ?? 0" />
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <Modal :show="showModal" max-width="4xl" :closeable="true" @close="closeModal">
            <div class="p-6 space-y-5">
                <h3 class="text-lg font-semibold text-gray-900">{{ editing ? 'Edit Role' : 'Create Role' }}</h3>

                <form @submit.prevent="submitForm" class="space-y-5">
                    <!-- Role Name -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Role Name" required />
                            <TextInput v-model="form.label" type="text" class="mt-1.5" placeholder="e.g. Manager"
                                :has-error="!!form.errors.label" />
                            <InputError :message="form.errors.label" />
                        </div>
                        <div>
                            <InputLabel value="Description" />
                            <TextInput v-model="form.description" type="text" class="mt-1.5" placeholder="Role description" />
                            <InputError :message="form.errors.description" />
                        </div>
                    </div>

                    <!-- Permissions -->
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <InputLabel value="Permissions" />
                            <span class="text-xs text-gray-400">{{ selectedCount }} of {{ totalPermissions }} selected</span>
                        </div>

                        <!-- Select All -->
                        <div class="border border-gray-200 rounded-xl overflow-hidden">
                            <div class="bg-gray-50 px-4 py-2.5 flex items-center justify-between border-b border-gray-200">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" :checked="isAllSelected" :indeterminate.prop="isSomeSelected"
                                        @change="toggleAll" class="rounded border-gray-300 text-primary-600" />
                                    <span class="text-sm font-medium text-gray-700">Select All Permissions</span>
                                </label>
                                <span class="text-xs text-gray-400">{{ selectedCount }} / {{ totalPermissions }}</span>
                            </div>

                            <!-- Grouped Permissions -->
                            <div class="max-h-96 overflow-y-auto scrollbar-thin divide-y divide-gray-100">
                                <div v-for="(group, moduleName) in groupedPermissions" :key="moduleName">
                                    <!-- Module Header -->
                                    <div class="bg-gray-50/60 px-4 py-2 flex items-center justify-between">
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox"
                                                :checked="isModuleSelected(moduleName)"
                                                :indeterminate.prop="isModuleIndeterminate(moduleName)"
                                                @change="(e) => toggleModule(moduleName, (e.target as HTMLInputElement).checked)"
                                                class="rounded border-gray-300 text-primary-600" />
                                            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider">{{ moduleName }}</span>
                                        </label>
                                        <span class="text-xs text-gray-400">
                                            {{ moduleSelectedCount(moduleName) }}/{{ group.length }}
                                        </span>
                                    </div>
                                    <!-- Permission Checkboxes -->
                                    <div class="px-4 py-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                        <label v-for="perm in group" :key="perm.id"
                                            class="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" :value="perm.name" v-model="form.permissions"
                                                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span class="text-xs text-gray-700 truncate">{{ perm.label || perm.name }}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <InputError :message="form.errors.permissions" />
                    </div>

                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="form.processing">
                            <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin" />
                            {{ editing ? 'Update Role' : 'Create Role' }}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>

        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Role</h3>
                <p class="text-sm text-gray-600 mb-6">Are you sure you want to delete
                    <strong>{{ selectedRole?.label || selectedRole?.name }}</strong>?
                </p>
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button @click="confirmDelete" :disabled="deleteForm.processing"
                        class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Delete</button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, useForm } from '@inertiajs/vue3';
import { Plus, Shield, Pencil, Trash2, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

interface Permission { id: number; name: string; label?: string; module?: string }
interface Role {
    id: number;
    name: string;
    label?: string;
    description?: string;
    is_system_role?: boolean;
    permissions?: Permission[];
    users_count?: number;
}

const props = defineProps<{
    roles: { data: Role[]; links: any[]; from?: number; to?: number; total?: number };
    permissions: Record<string, Permission[]>; // grouped by module from controller
}>();

const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref<Role | null>(null);
const selectedRole = ref<Role | null>(null);

const form = useForm({
    label: '',
    description: '',
    permissions: [] as string[], // permission names
});
const deleteForm = useForm({});

// permissions is already grouped by module from PermissionService::getPermissionsByModule()
const groupedPermissions = computed(() => props.permissions ?? {});

const allPermissionNames = computed(() =>
    Object.values(groupedPermissions.value).flat().map(p => p.name)
);

const totalPermissions = computed(() => allPermissionNames.value.length);
const selectedCount = computed(() => form.permissions.length);

const isAllSelected = computed(() =>
    totalPermissions.value > 0 && selectedCount.value === totalPermissions.value
);
const isSomeSelected = computed(() =>
    selectedCount.value > 0 && selectedCount.value < totalPermissions.value
);

const modulePermNames = (moduleName: string) =>
    (groupedPermissions.value[moduleName] ?? []).map(p => p.name);

const isModuleSelected = (moduleName: string) => {
    const names = modulePermNames(moduleName);
    return names.length > 0 && names.every(n => form.permissions.includes(n));
};
const isModuleIndeterminate = (moduleName: string) => {
    const names = modulePermNames(moduleName);
    const count = names.filter(n => form.permissions.includes(n)).length;
    return count > 0 && count < names.length;
};
const moduleSelectedCount = (moduleName: string) =>
    modulePermNames(moduleName).filter(n => form.permissions.includes(n)).length;

const toggleAll = () => {
    form.permissions = isAllSelected.value ? [] : [...allPermissionNames.value];
};

const toggleModule = (moduleName: string, checked: boolean) => {
    const names = modulePermNames(moduleName);
    if (checked) {
        const toAdd = names.filter(n => !form.permissions.includes(n));
        form.permissions = [...form.permissions, ...toAdd];
    } else {
        form.permissions = form.permissions.filter(n => !names.includes(n));
    }
};

const openCreate = () => {
    editing.value = null;
    form.reset();
    showModal.value = true;
};

const openEdit = (role: Role) => {
    editing.value = role;
    form.label = role.label || role.name;
    form.description = role.description ?? '';
    form.permissions = (role.permissions ?? []).map(p => p.name);
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    form.reset();
    editing.value = null;
};

const submitForm = () => {
    if (editing.value) {
        form.put(route('roles.update', editing.value.id), { onSuccess: closeModal });
    } else {
        form.post(route('roles.store'), { onSuccess: closeModal });
    }
};

const handleDelete = (role: Role) => { selectedRole.value = role; showDeleteModal.value = true; };

const confirmDelete = () => {
    if (!selectedRole.value) return;
    deleteForm.delete(route('roles.destroy', selectedRole.value.id), {
        onSuccess: () => { showDeleteModal.value = false; },
    });
};
</script>
