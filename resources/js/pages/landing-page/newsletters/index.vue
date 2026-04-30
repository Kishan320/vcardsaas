<template>
    <AppLayout>
        <Head title="Newsletter Subscribers" />
        <FlashMessage />
        
        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
                <p class="text-sm text-gray-500 mt-0.5">Manage landing page newsletter subscriptions</p>
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
                                placeholder="Search by email..."
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

            <!-- Stats Section -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Users :size="18" class="text-blue-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Total Subscribers</p>
                            <p class="text-xl font-semibold text-gray-900">{{ newsletters?.total || 0 }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <TrendingUp :size="18" class="text-green-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">New This Month</p>
                            <p class="text-xl font-semibold text-gray-900">{{ newThisMonth }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Calendar :size="18" class="text-purple-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Last 7 Days</p>
                            <p class="text-xl font-semibold text-gray-900">{{ last7Days }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Activity :size="18" class="text-orange-600" />
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Avg. Daily</p>
                            <p class="text-xl font-semibold text-gray-900">{{ avgDaily }}</p>
                        </div>
                    </div>
                </div>
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
                            <tr v-for="subscriber in newsletters?.data ?? []" :key="subscriber.id" class="border-b hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="font-medium text-gray-900">{{ subscriber.email }}</div>
                                    <div class="text-sm text-gray-500">ID: #{{ subscriber.id }}</div>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="text-sm text-gray-500">
                                        {{ new Date(subscriber.created_at).toLocaleDateString() }}
                                        <div class="text-xs text-gray-400">
                                            {{ new Date(subscriber.created_at).toLocaleTimeString() }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button
                                            @click="handleAction('delete', subscriber)"
                                            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Subscriber"
                                        >
                                            <Trash2 :size="16" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            
                            <tr v-if="!newsletters?.data?.length">
                                <td :colspan="columns.length + 1" class="px-4 py-12 text-center text-sm text-gray-400">
                                    No newsletter subscribers found
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination Section -->
                <div v-if="newsletters?.links" class="px-4 py-3 border-t border-gray-100">
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-500">
                            Showing {{ newsletters.from || 0 }} to {{ newsletters.to || 0 }} of {{ newsletters.total || 0 }} results
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                v-for="link in newsletters.links"
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
import { Head, router, usePage } from '@inertiajs/vue3';
import { Search, Trash2, Users, TrendingUp, Calendar, Activity } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';

interface NewsletterSubscriber {
    id: number;
    email: string;
    created_at: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface NewslettersData {
    data: NewsletterSubscriber[];
    from: number;
    to: number;
    total: number;
    links: PaginationLinks[];
}

interface PageProps {
    newsletters: NewslettersData;
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

// Calculate stats
const newThisMonth = computed(() => {
    if (!props.newsletters?.data) return 0;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return props.newsletters.data.filter(sub => new Date(sub.created_at) >= oneMonthAgo).length;
});

const last7Days = computed(() => {
    if (!props.newsletters?.data) return 0;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return props.newsletters.data.filter(sub => new Date(sub.created_at) >= sevenDaysAgo).length;
});

const avgDaily = computed(() => {
    if (!props.newsletters?.total) return 0;
    // Assuming we have data for the last 30 days
    return Math.round(props.newsletters.total / 30);
});

const columns = computed(() => [
    {
        key: 'email',
        label: 'Email',
        sortable: true
    },
    {
        key: 'created_at',
        label: 'Subscribed',
        sortable: true
    }
]);

const handleAction = (action: string, item: NewsletterSubscriber) => {
    if (action === 'delete') {
        handleDelete(item);
    }
};

const handleDelete = (subscriber: NewsletterSubscriber) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
        router.delete(route('landing-page.newsletters.destroy', subscriber.id));
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
    
    router.get(route('landing-page.newsletters.index'), params, { preserveState: true, preserveScroll: true });
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
