<template>
    <AppLayout>
        <Head title="Directory Custom Pages" />
        <FlashMessage />
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Directory Custom Pages</h1>
                    <p class="text-sm text-gray-500 mt-1">Manage custom pages for the business directory</p>
                </div>
                <button @click="openCreate" class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all">
                    <Plus :size="16" /> Add Page
                </button>
            </div>

            <!-- Search -->
            <div class="flex gap-3">
                <div class="relative flex-1 max-w-sm">
                    <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search pages..."
                        class="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2"
                        @input="handleSearch"
                    />
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="page in pages?.data ?? []" :key="page.id" class="hover:bg-gray-50">
                                <td class="px-4 py-3 font-medium text-gray-900">{{ page.title }}</td>
                                <td class="px-4 py-3 text-gray-500">
                                    <a :href="route('directory.custom-page.show', page.slug)" target="_blank" class="hover:text-primary flex items-center gap-1">
                                        /directory/page/{{ page.slug }} <ExternalLink :size="12" />
                                    </a>
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        :class="page.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
                                    >
                                        {{ page.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-gray-500">{{ page.sort_order }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="openEdit(page)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Edit">
                                            <Pencil :size="15" />
                                        </button>
                                        <button @click="handleDelete(page)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!pages?.data?.length">
                                <td colspan="5" class="px-4 py-12 text-center text-sm text-gray-400">No custom pages yet. Click "Add Page" to create one.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="pages?.last_page > 1" class="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
                    <span>Showing {{ pages.from }}–{{ pages.to }} of {{ pages.total }}</span>
                    <div class="flex gap-1">
                        <button
                            v-for="link in pages.links" :key="link.label"
                            :disabled="!link.url"
                            @click="link.url && router.visit(link.url)"
                            class="px-3 py-1 rounded border text-xs disabled:opacity-40"
                            :class="link.active ? 'bg-primary text-white border-primary' : 'hover:bg-gray-50'"
                            v-html="link.label"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Create / Edit Modal -->
        <Modal :show="showModal" max-width="2xl" :closeable="true" @close="closeModal">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">{{ editingPage ? 'Edit Page' : 'Create Custom Page' }}</h3>
                <form @submit.prevent="submitForm" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Title" required />
                            <TextInput v-model="form.title" type="text" class="mt-1.5 w-full" placeholder="Page Title" @input="autoSlug" />
                            <p v-if="errors.title" class="text-xs text-red-500 mt-1">{{ errors.title }}</p>
                        </div>
                        <div>
                            <InputLabel value="Slug" required />
                            <div class="flex gap-2 mt-1.5">
                                <TextInput v-model="form.slug" type="text" class="flex-1" placeholder="page-slug" />
                                <button type="button" @click="generateSlug" class="px-3 py-2 text-xs border rounded-lg hover:bg-gray-50 whitespace-nowrap">Auto Generate</button>
                            </div>
                            <p v-if="errors.slug" class="text-xs text-red-500 mt-1">{{ errors.slug }}</p>
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Content" required />
                        <textarea
                            v-model="form.content"
                            rows="10"
                            class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-y font-mono"
                            placeholder="Enter HTML content..."
                        />
                        <p class="text-xs text-gray-400 mt-1">HTML is supported</p>
                        <p v-if="errors.content" class="text-xs text-red-500 mt-1">{{ errors.content }}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Meta Title" />
                            <TextInput v-model="form.meta_title" type="text" class="mt-1.5 w-full" placeholder="SEO title" />
                        </div>
                        <div>
                            <InputLabel value="Sort Order" />
                            <TextInput v-model="form.sort_order" type="number" class="mt-1.5 w-full" placeholder="0" />
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Meta Description" />
                        <textarea
                            v-model="form.meta_description"
                            rows="2"
                            class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none"
                            placeholder="SEO description"
                        />
                    </div>

                    <div class="flex items-center gap-3">
                        <div
                            class="relative w-10 h-6 rounded-full transition-colors cursor-pointer"
                            :class="form.is_active ? 'bg-primary' : 'bg-gray-300'"
                            @click="form.is_active = !form.is_active"
                        >
                            <div class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" :class="form.is_active ? 'translate-x-5' : 'translate-x-1'" />
                        </div>
                        <span class="text-sm font-medium">Active</span>
                    </div>

                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="saving">
                            <Loader2 v-if="saving" :size="14" class="mr-1 animate-spin" />
                            {{ editingPage ? 'Update' : 'Create' }}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>

        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Page</h3>
                <p class="text-sm text-gray-600 mb-6">Are you sure you want to delete <strong>{{ selectedPage?.title }}</strong>? This cannot be undone.</p>
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button @click="confirmDelete" :disabled="deleteProcessing" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                        <Loader2 v-if="deleteProcessing" :size="14" class="inline mr-1 animate-spin" />
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import { Plus, Trash2, Pencil, Search, ExternalLink, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

const props = defineProps<{ pages?: any; filters?: any }>();

const showModal = ref(false);
const showDeleteModal = ref(false);
const saving = ref(false);
const deleteProcessing = ref(false);
const editingPage = ref<any>(null);
const selectedPage = ref<any>(null);
const searchQuery = ref(props.filters?.search || '');
const errors = ref<Record<string, string>>({});

const defaultForm = () => ({ title: '', slug: '', content: '', meta_title: '', meta_description: '', is_active: true, sort_order: 0 });
const form = ref(defaultForm());

function autoSlug() {
    if (!editingPage.value) {
        form.value.slug = form.value.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
    }
}

function generateSlug() {
    router.post(route('directory.custom-pages.generate-slug'), { title: form.value.title }, {
        preserveScroll: true,
        onSuccess: (page: any) => {
            const flash = page.props?.flash;
            if (flash?.slug) form.value.slug = flash.slug;
        },
    });
    // fallback: just auto-generate client-side
    autoSlug();
}

function openCreate() {
    editingPage.value = null;
    form.value = defaultForm();
    errors.value = {};
    showModal.value = true;
}

function openEdit(page: any) {
    editingPage.value = page;
    form.value = {
        title: page.title,
        slug: page.slug,
        content: page.content,
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        is_active: page.is_active,
        sort_order: page.sort_order ?? 0,
    };
    errors.value = {};
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    editingPage.value = null;
}

function submitForm() {
    errors.value = {};
    saving.value = true;
    const routeName = editingPage.value
        ? route('directory.custom-pages.update', editingPage.value.id)
        : route('directory.custom-pages.store');
    const method = editingPage.value ? 'put' : 'post';

    router[method](routeName, form.value, {
        preserveScroll: true,
        onSuccess: () => { closeModal(); saving.value = false; },
        onError: (e: any) => { errors.value = e; saving.value = false; },
        onFinish: () => { saving.value = false; },
    });
}

function handleDelete(page: any) {
    selectedPage.value = page;
    showDeleteModal.value = true;
}

function confirmDelete() {
    if (!selectedPage.value) return;
    deleteProcessing.value = true;
    router.delete(route('directory.custom-pages.destroy', selectedPage.value.id), {
        preserveScroll: true,
        onSuccess: () => { showDeleteModal.value = false; deleteProcessing.value = false; },
        onFinish: () => { deleteProcessing.value = false; },
    });
}

let searchTimer: ReturnType<typeof setTimeout>;
function handleSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        router.get(route('directory.custom-pages.index'), { search: searchQuery.value || undefined }, { preserveState: true, replace: true });
    }, 400);
}
</script>
