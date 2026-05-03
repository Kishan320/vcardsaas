<template>
    <AppLayout>
        <Head title="Custom Pages" />
        <FlashMessage />
        
        <!-- Top Bar -->
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Custom Pages</h1>
                <p class="text-sm text-gray-500 mt-1">Create and manage custom pages for your landing site</p>
            </div>
            <button @click="openCreate" class="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-xl transition-all shadow-sm" :style="{ backgroundColor: primaryColor, '--tw-bg-opacity': '1' }">
                <Plus :size="16" /> Add Page
            </button>
        </div>

        <!-- Search and Filter Bar -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6 p-4">
            <form @submit.prevent="handleSearch" class="flex items-center gap-4">
                <div class="flex-1 relative">
                    <Search :size="16" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                        v-model="searchTerm" 
                        type="text" 
                        placeholder="Search pages by title, content, or slug..."
                        class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 text-sm"
                        :style="{ '--tw-ring-color': primaryColor + '33' }"
                    />
                </div>
                <button type="submit" class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                    Search
                </button>
                <select 
                    v-model="perPage" 
                    @change="handlePerPageChange"
                    class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2"
                    :style="{ '--tw-ring-color': primaryColor + '33' }"
                >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                </select>
            </form>
        </div>

        <!-- Table -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b bg-gray-50">
                            <th class="px-6 py-4 text-left">
                                <button @click="handleSort('title')" class="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">
                                    Title
                                    <ArrowUpDown :size="12" />
                                </button>
                            </th>
                            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</th>
                            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-4 text-left">
                                <button @click="handleSort('created_at')" class="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700">
                                    Created
                                    <ArrowUpDown :size="12" />
                                </button>
                            </th>
                            <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="page in pagesData" :key="page.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4">
                                <div class="font-medium text-gray-900">{{ page.title }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="font-mono text-sm" :style="{ color: primaryColor }">/page/{{ page.slug }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="max-w-xs truncate text-gray-600" :title="stripHtml(page.content)">
                                    {{ stripHtml(page.content).substring(0, 80) }}{{ stripHtml(page.content).length > 80 ? '...' : '' }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <Eye v-if="page.is_active" :size="16" :style="{ color: primaryColor }" />
                                    <EyeOff v-else :size="16" class="text-gray-400" />
                                    <span class="text-sm font-medium" :style="{ color: page.is_active ? primaryColor : '#9ca3af' }">
                                        {{ page.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600">
                                {{ formatDate(page.created_at) }}
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="handleEdit(page)" class="p-2 rounded-lg transition-colors" :style="{ color: primaryColor, backgroundColor: primaryColor + '15' }" title="Edit">
                                        <Edit :size="16" />
                                    </button>
                                    <button @click="handleDelete(page)" class="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                        <Trash2 :size="16" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!pagesData?.length">
                            <td colspan="6" class="px-6 py-12 text-center text-sm text-gray-400">
                                <div class="flex flex-col items-center gap-2">
                                    <FileText :size="32" class="text-gray-300" />
                                    <p>No custom pages found</p>
                                    <button @click="openCreate" class="font-medium hover:opacity-80" :style="{ color: primaryColor }">
                                        Create your first page
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="pages?.links" class="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600">
                        Showing {{ pages.from }} to {{ pages.to }} of {{ pages.total }} results
                    </div>
                    <div class="flex items-center gap-2">
                        <template v-for="(link, index) in pages.links" :key="index">
                            <button 
                                v-if="link.url" 
                                @click="router.get(link.url)"
                                class="px-3 py-2 text-sm rounded-lg transition-colors"
                                :class="link.active ? 'text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'"
                                :style="link.active ? { backgroundColor: primaryColor } : {}"
                                v-html="link.label"
                            />
                            <span 
                                v-else 
                                :class="[
                                    'px-3 py-2 text-sm rounded-lg',
                                    'bg-gray-100 text-gray-400 cursor-not-allowed'
                                ]"
                                v-html="link.label"
                            />
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <Modal :show="showModal" max-width="2xl" :closeable="true" @close="resetForm">
            <div class="p-6 max-h-[90vh] overflow-y-auto">
                <h3 class="text-xl font-semibold text-gray-900 mb-6">
                    {{ editingPage ? 'Edit Page' : 'Create Custom Page' }}
                </h3>
                
                <form @submit.prevent="submitForm" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel value="Page Title" required />
                            <TextInput 
                                v-model="form.title" 
                                type="text" 
                                class="mt-2" 
                                placeholder="About Us" 
                                :class="{ 'border-red-500': errors.title }"
                                @input="autoGenerateSlug"
                            />
                            <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
                        </div>

                        <div>
                            <InputLabel value="Page Slug (URL)" />
                            <div class="flex gap-2 mt-2">
                                <TextInput 
                                    v-model="form.slug" 
                                    type="text" 
                                    class="flex-1" 
                                    placeholder="about-us (leave empty to auto-generate)"
                                    :class="{
                                        'border-red-500': slugValidation.available === false || errors.slug,
                                        'border-green-500': slugValidation.available === true
                                    }"
                                    @input="handleSlugChange"
                                />
                                <button 
                                    type="button" 
                                    @click="generateSlug" 
                                    :disabled="!form.title"
                                    class="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Generate
                                </button>
                            </div>
                            <div class="mt-1 space-y-1">
                                <p class="text-sm text-gray-500">
                                    URL: {{ typeof window !== 'undefined' ? window.location.origin : '' }}/page/{{ form.slug || 'auto-generated-from-title' }}
                                </p>
                                <p v-if="slugValidation.loading" class="text-sm" :style="{ color: primaryColor }">Checking availability...</p>
                                <p v-if="slugValidation.available === true" class="text-sm text-green-600">✓ Slug is available</p>
                                <p v-if="slugValidation.available === false" class="text-sm text-red-600">✗ Slug is already taken</p>
                            </div>
                            <p v-if="errors.slug" class="text-red-600 text-sm mt-1">{{ errors.slug }}</p>
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Content" required />
                        <div class="mt-2">
                            <QuillEditor 
                                v-model:content="form.content" 
                                content-type="html"
                                :options="editorOptions"
                                class="min-h-[300px]"
                            />
                        </div>
                        <p v-if="errors.content" class="text-red-600 text-sm mt-1">{{ errors.content }}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel value="Meta Title (SEO)" />
                            <TextInput 
                                v-model="form.meta_title" 
                                type="text" 
                                class="mt-2" 
                                placeholder="SEO title" 
                            />
                        </div>

                        <div>
                            <InputLabel value="Sort Order" />
                            <TextInput 
                                v-model="form.sort_order" 
                                type="number" 
                                class="mt-2" 
                                placeholder="0" 
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Meta Description (SEO)" />
                        <textarea 
                            v-model="form.meta_description" 
                            rows="3" 
                            class="mt-2 w-full rounded-xl border border-gray-200 focus:ring-2 text-sm p-3" 
                            :style="{ '--tw-ring-color': primaryColor + '33', '--tw-border-opacity': '1' }"
                            placeholder="SEO description"
                        />
                    </div>

                    <div class="flex items-center gap-3">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="form.is_active" class="sr-only peer">
                            <div 
                                class="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all cursor-pointer"
                                :style="{ backgroundColor: form.is_active ? primaryColor : '#e5e7eb' }"
                                @click="form.is_active = !form.is_active"
                            ></div>
                        </label>
                        <InputLabel value="Active" class="cursor-pointer" />
                    </div>

                    <div class="flex gap-3 justify-end pt-4 border-t border-gray-100">
                        <button type="button" @click="resetForm" class="px-6 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            :disabled="saving || slugValidation.available === false"
                            class="px-6 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            :style="{ backgroundColor: primaryColor, '--tw-bg-opacity': '1' }"
                        >
                            <Loader2 v-if="saving" :size="16" class="animate-spin" />
                            {{ saving ? 'Saving...' : (editingPage ? 'Update Page' : 'Create Page') }}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>

        <!-- Delete Confirmation Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <Trash2 :size="20" class="text-red-600" />
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Delete Page</h3>
                        <p class="text-sm text-gray-600">This action cannot be undone.</p>
                    </div>
                </div>
                
                <p class="text-sm text-gray-700 mb-6">
                    Are you sure you want to delete <strong>{{ selectedPage?.title }}</strong>?
                </p>
                
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button 
                        @click="confirmDelete" 
                        :disabled="deleteForm.processing" 
                        class="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Loader2 v-if="deleteForm.processing" :size="14" class="animate-spin" />
                        Delete Page
                    </button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import { Plus, Trash2, Loader2, Search, Edit, Eye, EyeOff, ArrowUpDown, FileText } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import TextInput from '@/components/ui/TextInput.vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import axios from 'axios';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/composables/useAppearance';

interface CustomPage {
    id: number;
    title: string;
    slug: string;
    content: string;
    meta_title?: string;
    meta_description?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
}

interface PageProps {
    pages?: {
        data: CustomPage[];
        links: any[];
        from: number;
        to: number;
        total: number;
    } | CustomPage[];
    filters?: {
        search?: string;
        sort_field?: string;
        sort_direction?: string;
        per_page?: string;
    };
}

const props = defineProps<PageProps>();

const { themeColor, customColor } = useBrand();

const primaryColor = computed(() => {
    const color = themeColor.value;
    return color === 'custom' ? customColor.value : (THEME_COLORS[color as keyof typeof THEME_COLORS] || THEME_COLORS.green);
});

const showModal = ref(false);
const showDeleteModal = ref(false);
const saving = ref(false);
const editingPage = ref<CustomPage | null>(null);
const selectedPage = ref<CustomPage | null>(null);
const searchTerm = ref(props.filters?.search || '');
const perPage = ref(props.filters?.per_page || '10');
const slugValidation = ref<{loading: boolean, available: boolean | null, message: string}>({ 
    loading: false, 
    available: null, 
    message: '' 
});
const slugCheckTimeout = ref<NodeJS.Timeout | null>(null);

const form = ref({
    title: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    is_active: true,
    sort_order: 0
});

const errors = ref<Record<string, string>>({});
const deleteForm = useForm({});

const editorOptions = {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image']
        ]
    }
};

const pages = computed(() => {
    if (Array.isArray(props.pages)) {
        return { data: props.pages, links: [], from: 1, to: props.pages.length, total: props.pages.length };
    }
    return props.pages;
});

const pagesData = computed(() => {
    return pages.value?.data || [];
});

const openCreate = () => {
    form.value = {
        title: '',
        slug: '',
        content: '',
        meta_title: '',
        meta_description: '',
        is_active: true,
        sort_order: 0
    };
    editingPage.value = null;
    errors.value = {};
    slugValidation.value = { loading: false, available: null, message: '' };
    showModal.value = true;
};

const handleEdit = (page: CustomPage) => {
    form.value = {
        title: page.title,
        slug: page.slug,
        content: page.content,
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        is_active: page.is_active,
        sort_order: page.sort_order || 0
    };
    editingPage.value = page;
    errors.value = {};
    slugValidation.value = { loading: false, available: null, message: '' };
    showModal.value = true;
};

const submitForm = async () => {
    if (slugValidation.value.available === false) {
        return;
    }
    
    saving.value = true;
    errors.value = {};
    
    try {
        const routeName = editingPage.value 
            ? 'landing-page.custom-pages.update'
            : 'landing-page.custom-pages.store';
        const routeParams = editingPage.value ? [editingPage.value.id] : [];
        const method = editingPage.value ? 'put' : 'post';
        
        router[method](route(routeName, ...routeParams), form.value, {
            onSuccess: () => {
                resetForm();
            },
            onError: (pageErrors) => {
                errors.value = pageErrors;
                saving.value = false;
            },
            onFinish: () => {
                saving.value = false;
            }
        });
    } catch (error) {
        console.error('Submit error:', error);
        saving.value = false;
    }
};

const handleDelete = (page: CustomPage) => {
    selectedPage.value = page;
    showDeleteModal.value = true;
};

const confirmDelete = () => {
    if (!selectedPage.value) return;
    
    deleteForm.delete(route('landing-page.custom-pages.destroy', selectedPage.value.id), {
        onSuccess: () => {
            showDeleteModal.value = false;
            selectedPage.value = null;
        },
        onError: (error) => {
            console.error('Delete error:', error);
        }
    });
};

const resetForm = () => {
    showModal.value = false;
    editingPage.value = null;
    errors.value = {};
    slugValidation.value = { loading: false, available: null, message: '' };
    saving.value = false;
    if (slugCheckTimeout.value) {
        clearTimeout(slugCheckTimeout.value);
    }
};

const handleSearch = () => {
    const params: any = { page: 1 };
    if (searchTerm.value) {
        params.search = searchTerm.value;
    }
    if (perPage.value !== '10') {
        params.per_page = perPage.value;
    }
    router.get(route('landing-page.custom-pages.index'), params, { 
        preserveState: true, 
        preserveScroll: true 
    });
};

const handlePerPageChange = () => {
    const params: any = { page: 1, per_page: perPage.value };
    if (searchTerm.value) {
        params.search = searchTerm.value;
    }
    router.get(route('landing-page.custom-pages.index'), params, { 
        preserveState: true, 
        preserveScroll: true 
    });
};

const handleSort = (field: string) => {
    const currentField = props.filters?.sort_field;
    const currentDirection = props.filters?.sort_direction;
    const direction = currentField === field && currentDirection === 'asc' ? 'desc' : 'asc';
    
    const params: any = { 
        sort_field: field, 
        sort_direction: direction, 
        page: 1 
    };
    
    if (searchTerm.value) {
        params.search = searchTerm.value;
    }
    if (perPage.value !== '10') {
        params.per_page = perPage.value;
    }
    
    router.get(route('landing-page.custom-pages.index'), params, { 
        preserveState: true, 
        preserveScroll: true 
    });
};

const checkSlugAvailability = async (slug: string, excludeId?: number) => {
    if (!slug.trim()) {
        slugValidation.value = { loading: false, available: null, message: '' };
        return;
    }
    
    if (slugCheckTimeout.value) {
        clearTimeout(slugCheckTimeout.value);
    }
    
    slugValidation.value = { loading: true, available: null, message: '' };
    
    const timeout = setTimeout(async () => {
        try {
            const response = await axios.post(route('api.custom-pages.check-slug'), {
                slug: slug.trim(),
                exclude_id: excludeId
            });
            
            slugValidation.value = {
                loading: false,
                available: response.data.available,
                message: response.data.available ? 'Slug is available' : 'Slug is already taken'
            };
        } catch (error) {
            console.error('Slug check error:', error);
            slugValidation.value = { loading: false, available: null, message: 'Error checking slug' };
        }
    }, 500);
    
    slugCheckTimeout.value = timeout;
};

const generateSlug = async () => {
    if (!form.value.title.trim()) return;
    
    try {
        const response = await axios.post(route('api.custom-pages.generate-slug'), {
            title: form.value.title.trim(),
            exclude_id: editingPage.value?.id
        });
        
        form.value.slug = response.data.slug;
        slugValidation.value = { loading: false, available: true, message: 'Generated unique slug' };
    } catch (error) {
        console.error('Error generating slug:', error);
        // Fallback to client-side generation
        form.value.slug = form.value.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
    }
};

const handleSlugChange = () => {
    if (form.value.slug && form.value.slug !== editingPage.value?.slug) {
        checkSlugAvailability(form.value.slug, editingPage.value?.id);
    } else {
        slugValidation.value = { loading: false, available: null, message: '' };
    }
};

const autoGenerateSlug = () => {
    if (!editingPage.value && form.value.title) {
        form.value.slug = form.value.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
        handleSlugChange();
    }
};

const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
};

// Cleanup timeout on unmount
onUnmounted(() => {
    if (slugCheckTimeout.value) {
        clearTimeout(slugCheckTimeout.value);
    }
});
</script>
