<template>
    <AppLayout>
        <Head title="Contact Queries" />
        <FlashMessage />
        
        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Contact Queries</h1>
                <p class="text-sm text-gray-500 mt-0.5">Manage landing page contact submissions</p>
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
                                placeholder="Search by name, email, or message..."
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
                            <tr v-for="contact in contacts?.data ?? []" :key="contact.id" class="border-b hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="font-medium text-gray-900">{{ contact.name }}</div>
                                    <div class="text-sm text-gray-500">{{ contact.email }}</div>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="max-w-xs truncate text-sm text-gray-600" :title="contact.message">
                                        {{ contact.message }}
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="text-sm text-gray-500">
                                        {{ new Date(contact.created_at).toLocaleDateString() }}
                                        <div class="text-xs text-gray-400">
                                            {{ new Date(contact.created_at).toLocaleTimeString() }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button
                                            @click="handleAction('view', contact)"
                                            class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye :size="16" />
                                        </button>
                                        <button
                                            @click="handleAction('delete', contact)"
                                            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 :size="16" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            
                            <tr v-if="!contacts?.data?.length">
                                <td :colspan="columns.length + 1" class="px-4 py-12 text-center text-sm text-gray-400">
                                    No contact queries found
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination Section -->
                <div v-if="contacts?.links" class="px-4 py-3 border-t border-gray-100">
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-500">
                            Showing {{ contacts.from || 0 }} to {{ contacts.to || 0 }} of {{ contacts.total || 0 }} results
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                v-for="link in contacts.links"
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

        <!-- View Modal -->
        <div v-if="selectedContact" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
            <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
                <div class="p-6 border-b border-gray-100">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900">Contact Query Details</h3>
                        <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <X :size="18" class="text-gray-500" />
                        </button>
                    </div>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="text-sm font-medium text-gray-500">Name</label>
                        <p class="mt-1 text-gray-900">{{ selectedContact.name }}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-500">Email</label>
                        <p class="mt-1 text-gray-900">{{ selectedContact.email }}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-500">Message</label>
                        <p class="mt-1 text-gray-900 whitespace-pre-wrap">{{ selectedContact.message }}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-500">Submitted</label>
                        <p class="mt-1 text-gray-900">
                            {{ new Date(selectedContact.created_at).toLocaleString() }}
                        </p>
                    </div>
                </div>
                <div class="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button @click="closeModal" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Close
                    </button>
                    <button @click="handleDelete(selectedContact)" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, router, usePage } from '@inertiajs/vue3';
import { Search, Eye, Trash2, X } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';

interface Contact {
    id: number;
    name: string;
    email: string;
    message: string;
    created_at: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface ContactsData {
    data: Contact[];
    from: number;
    to: number;
    total: number;
    links: PaginationLinks[];
}

interface PageProps {
    contacts: ContactsData;
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
const sortField = ref(props.filters?.sort_field || 'created_at');
const sortDirection = ref(props.filters?.sort_direction || 'desc');
const selectedContact = ref<Contact | null>(null);

const columns = computed(() => [
    {
        key: 'name',
        label: 'Contact Info',
        sortable: true
    },
    {
        key: 'message',
        label: 'Message',
        sortable: false
    },
    {
        key: 'created_at',
        label: 'Date',
        sortable: true
    }
]);

const handleAction = (action: string, item: Contact) => {
    if (action === 'view') {
        selectedContact.value = item;
    } else if (action === 'delete') {
        handleDelete(item);
    }
};

const handleDelete = (contact: Contact) => {
    if (confirm('Are you sure you want to delete this contact query?')) {
        router.delete(route('landing-page.contacts.destroy', contact.id), {
            onSuccess: () => {
                selectedContact.value = null;
            }
        });
    }
};

const closeModal = () => {
    selectedContact.value = null;
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
    
    router.get(route('landing-page.contacts.index'), params, { preserveState: true, preserveScroll: true });
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
