<template>
    <AppLayout>
        <Head title="Custom Pages" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-900">Custom Pages</h1>
                <button @click="openCreate" class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all">
                    <Plus :size="16" /> Add Page
                </button>
            </div>
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="page in customPages?.data ?? []" :key="page.id" class="hover:bg-gray-50">
                                <td class="px-4 py-3 font-medium text-gray-900">{{ page.title }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ page.slug }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="handleDelete(page)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!customPages?.data?.length">
                                <td colspan="3" class="px-4 py-12 text-center text-sm text-gray-400">No custom pages yet</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <Modal :show="showModal" max-width="md" :closeable="true" @close="showModal = false">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">Add Custom Page</h3>
                <form @submit.prevent="submitForm" class="space-y-4">
                    <div>
                        <InputLabel value="Title" required />
                        <TextInput v-model="form.title" type="text" class="mt-1.5" placeholder="Page Title" />
                    </div>
                    <div>
                        <InputLabel value="Slug" required />
                        <TextInput v-model="form.slug" type="text" class="mt-1.5" placeholder="page-slug" />
                    </div>
                    <div>
                        <InputLabel value="Content" />
                        <textarea v-model="form.content" rows="6"
                            class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" />
                    </div>
                    <div class="flex gap-3 justify-end">
                        <button type="button" @click="showModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="saving">
                            <Loader2 v-if="saving" :size="14" class="mr-1 animate-spin" />
                            Create
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>

        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Page</h3>
                <p class="text-sm text-gray-600 mb-6">Delete <strong>{{ selectedPage?.title }}</strong>?</p>
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
import { Plus, Trash2, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

defineProps<{ customPages?: any }>();

const showModal = ref(false);
const showDeleteModal = ref(false);
const saving = ref(false);
const selectedPage = ref<any>(null);
const form = ref({ title: '', slug: '', content: '' });
const deleteForm = useForm({});

const openCreate = () => { form.value = { title: '', slug: '', content: '' }; showModal.value = true; };
const submitForm = () => {
    saving.value = true;
    router.post(route('landing-page.custom-pages.store'), form.value, {
        onSuccess: () => { showModal.value = false; saving.value = false; },
        onFinish: () => { saving.value = false; },
    });
};
const handleDelete = (p: any) => { selectedPage.value = p; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedPage.value) return;
    deleteForm.delete(route('landing-page.custom-pages.destroy', selectedPage.value.id), {
        onSuccess: () => { showDeleteModal.value = false; },
    });
};
</script>
