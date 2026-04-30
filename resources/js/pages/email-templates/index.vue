<template>
    <AppLayout>
        <Head title="Email Templates" />
        <FlashMessage />
        
        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Email Templates</h1>
                <p class="text-sm text-gray-500 mt-0.5">Manage system email templates</p>
            </div>

            <!-- Search and Filter Section -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4">
                <form @submit.prevent="handleSearch" class="flex flex-col sm:flex-row gap-4">
                    <div class="flex-1">
                        <div class="relative">
                            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="18" />
                            <input
                                v-model="searchTerm"
                                type="text"
                                placeholder="Search templates..."
                                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <select
                            v-model="perPage"
                            @change="applyFilters"
                            class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>
                        <button
                            type="submit"
                            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>

            <!-- Table Section -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th 
                                    v-for="column in columns" 
                                    :key="column.key"
                                    class="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors"
                                    @click="column.sortable && handleSort(column.key)"
                                >
                                    <div class="flex items-center">
                                        {{ column.label }}
                                        <span v-if="column.sortable" class="ml-1">
                                            {{ sortField === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
                                        </span>
                                    </div>
                                </th>
                                <th class="px-4 py-3 text-right font-medium text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="template in emailTemplates?.data ?? []" :key="template.id" class="border-b hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="font-medium text-gray-900">{{ template.name }}</div>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button
                                            @click="handleAction('view', template)"
                                            class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Template"
                                        >
                                            <Eye :size="16" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            
                            <tr v-if="!emailTemplates?.data?.length">
                                <td :colspan="columns.length + 1" class="px-4 py-12 text-center text-sm text-gray-400">
                                    No email templates found
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination Section -->
                <div v-if="emailTemplates?.links" class="px-4 py-3 border-t border-gray-100">
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-500">
                            Showing {{ emailTemplates.from || 0 }} to {{ emailTemplates.to || 0 }} of {{ emailTemplates.total || 0 }} results
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                v-for="link in emailTemplates.links"
                                :key="link.label"
                                :disabled="!link.url"
                                @click="link.url && navigateToLink(link.url)"
                                class="px-3 py-1 text-sm rounded-md transition-colors"
                                :class="{
                                    'bg-primary-600 text-white': link.active,
                                    'bg-gray-100 text-gray-700 hover:bg-gray-200': link.url && !link.active,
                                    'text-gray-400 cursor-not-allowed': !link.url
                                }"
                                v-html="link.label"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { Search, Eye } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';

interface EmailTemplate {
    id: number;
    name: string;
    slug: string;
    subject?: string;
    type?: string;
    created_at: string;
    email_template_langs?: Array<{
        id: number;
        lang: string;
        subject: string;
    }>;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface EmailTemplatesData {
    data: EmailTemplate[];
    from: number;
    to: number;
    total: number;
    links: PaginationLinks[];
}

interface PageProps {
    emailTemplates: EmailTemplatesData;
    filters: {
        search?: string;
        sort_field?: string;
        sort_direction?: string;
        per_page?: number;
    };
}

const page = usePage<PageProps>();
const props = page.props;

const searchTerm = ref(props.filters?.search || '');
const perPage = ref(props.filters?.per_page?.toString() || '10');
const sortField = ref(props.filters?.sort_field || 'name');
const sortDirection = ref(props.filters?.sort_direction || 'asc');

const columns = computed(() => [
    {
        key: 'name',
        label: 'Name',
        sortable: true
    }
]);

const handleAction = (action: string, item: EmailTemplate) => {
    if (action === 'view') {
        router.get(route('email-templates.show', item.id));
    }
};

const handleSearch = (e: Event) => {
    e.preventDefault();
    applyFilters();
};

const applyFilters = () => {
    const params: any = { page: 1 };
    
    if (searchTerm.value) {
        params.search = searchTerm.value;
    }
    
    if (perPage.value) {
        params.per_page = parseInt(perPage.value);
    }
    
    if (sortField.value) {
        params.sort_field = sortField.value;
        params.sort_direction = sortDirection.value;
    }
    
    router.get(route('email-templates.index'), params, { preserveState: true, preserveScroll: true });
};

const handleSort = (field: string) => {
    const direction = sortField.value === field && sortDirection.value === 'asc' ? 'desc' : 'asc';
    sortField.value = field;
    sortDirection.value = direction;
    applyFilters();
};

const navigateToLink = (url: string) => {
    router.get(url, {}, { preserveState: true, preserveScroll: true });
};
</script>
