<template>
    <AppLayout>
        <Head title="Addons" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Addons</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Manage system addons and extensions</p>
                </div>
                <button @click="showUploadModal = true" class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95">
                    <Upload :size="16" /> Upload Addon
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="addon in addons" :key="addon.id" class="bg-white border border-gray-100 rounded-2xl shadow-card p-5">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                                <Package :size="18" class="text-primary-600" />
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">{{ addon.name }}</h3>
                                <p class="text-xs text-gray-500">v{{ addon.version ?? '1.0.0' }}</p>
                            </div>
                        </div>
                        <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                            :class="addon.is_enabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'">
                            {{ addon.is_enabled ? 'Enabled' : 'Disabled' }}
                        </span>
                    </div>
                    <p v-if="addon.description" class="text-sm text-gray-500 mb-4">{{ addon.description }}</p>
                    <div class="flex gap-2">
                        <button @click="toggleAddon(addon)" class="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <ToggleLeft v-if="addon.is_enabled" :size="12" />
                            <ToggleRight v-else :size="12" />
                            {{ addon.is_enabled ? 'Disable' : 'Enable' }}
                        </button>
                        <button @click="handleDelete(addon)" class="p-2 text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 :size="14" />
                        </button>
                    </div>
                </div>
                <div v-if="!addons?.length" class="col-span-full bg-white border border-gray-100 rounded-2xl shadow-card p-12 text-center">
                    <Package :size="40" class="text-gray-300 mx-auto mb-4" />
                    <p class="text-gray-500">No addons installed yet.</p>
                </div>
            </div>
        </div>

        <!-- Upload Modal -->
        <Modal :show="showUploadModal" max-width="sm" :closeable="true" @close="showUploadModal = false">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">Upload Addon</h3>
                <form @submit.prevent="submitUpload" class="space-y-4">
                    <div>
                        <InputLabel value="Addon ZIP File" required />
                        <input type="file" accept=".zip" @change="handleFile" class="mt-1.5 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:gradient-primary file:text-white hover:file:opacity-90" />
                        <InputError :message="uploadForm.errors.addon" />
                    </div>
                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="showUploadModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="uploadForm.processing">
                            <Loader2 v-if="uploadForm.processing" :size="14" class="mr-1 animate-spin" />
                            Upload
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>

        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Remove Addon</h3>
                <p class="text-sm text-gray-600 mb-6">Remove <strong>{{ selectedAddon?.name }}</strong>?</p>
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button @click="confirmDelete" :disabled="deleteForm.processing" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Remove</button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import { Upload, Package, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

interface Addon { id: number; name: string; description?: string; version?: string; is_enabled: boolean; package_name: string }

const props = defineProps<{ addons: Addon[] }>();

const showUploadModal = ref(false);
const showDeleteModal = ref(false);
const selectedAddon = ref<Addon | null>(null);

const uploadForm = useForm({ addon: null as File | null });
const deleteForm = useForm({});

const handleFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) uploadForm.addon = file;
};

const submitUpload = () => {
    uploadForm.post(route('addons.upload'), { onSuccess: () => { showUploadModal.value = false; } });
};

const toggleAddon = (a: Addon) => router.post(route('addons.toggle-status', a.id), {});
const handleDelete = (a: Addon) => { selectedAddon.value = a; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedAddon.value) return;
    deleteForm.delete(route('addons.remove', selectedAddon.value.id), { onSuccess: () => { showDeleteModal.value = false; } });
};
</script>
