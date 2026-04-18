<template>
    <AppLayout>
        <Head title="Campaigns" />
        <FlashMessage />

        <div class="space-y-6">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Campaigns</h1>
                    <p class="text-sm text-gray-500 mt-0.5">{{ isAdmin ? 'Manage advertising campaigns' : 'Your campaigns' }}</p>
                </div>
                <button @click="openCreate" class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95">
                    <Plus :size="16" /> Create Campaign
                </button>
            </div>

            <!-- Search & Filters -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4 space-y-3">
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                        <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="searchTerm" type="text" placeholder="Search campaigns…"
                            class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                            @keyup.enter="applyFilters" />
                    </div>
                    <button @click="applyFilters" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all">
                        <Search :size="14" /> Search
                    </button>
                    <button @click="showFilters = !showFilters" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all relative">
                        <Filter :size="14" /> Filters
                        <span v-if="activeFilterCount > 0" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">{{ activeFilterCount }}</span>
                    </button>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <span>Per Page:</span>
                        <select v-model="perPage" @change="applyFilters" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>

                <!-- Expanded Filters -->
                <div v-if="showFilters" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
                    <div v-if="isAdmin">
                        <label class="text-xs font-medium text-gray-500 mb-1 block">User</label>
                        <select v-model="userFilter" @change="applyFilters" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="">All Users</option>
                            <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500 mb-1 block">Business</label>
                        <select v-model="businessFilter" @change="applyFilters" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="">All Businesses</option>
                            <option v-for="b in businesses" :key="b.id" :value="b.id">{{ b.name }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                        <select v-model="statusFilter" @change="applyFilters" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500 mb-1 block">Start Date</label>
                        <input v-model="startDateFilter" type="date" @change="applyFilters" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200" />
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500 mb-1 block">End Date</label>
                        <input v-model="endDateFilter" type="date" @change="applyFilters" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200" />
                    </div>
                    <div class="flex items-end">
                        <button @click="resetFilters" class="text-sm text-red-500 hover:text-red-700 font-medium">Reset Filters</button>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none" @click="handleSort('name')">
                                    <span class="flex items-center gap-1">Name <SortIcon field="name" /></span>
                                </th>
                                <th v-if="isAdmin" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none" @click="handleSort('user.name')">
                                    <span class="flex items-center gap-1">User Name <SortIcon field="user.name" /></span>
                                </th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Name</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none" @click="handleSort('start_date')">
                                    <span class="flex items-center gap-1">Start Date <SortIcon field="start_date" /></span>
                                </th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none" @click="handleSort('end_date')">
                                    <span class="flex items-center gap-1">End Date <SortIcon field="end_date" /></span>
                                </th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Days</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none" @click="handleSort('total_amount')">
                                    <span class="flex items-center gap-1">Total Amount <SortIcon field="total_amount" /></span>
                                </th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Method</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th v-if="isAdmin" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Active</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="campaign in campaigns.data" :key="campaign.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <p class="font-medium text-gray-900">{{ campaign.name }}</p>
                                    <p v-if="campaign.description" class="text-xs text-gray-400 truncate max-w-[180px]">{{ campaign.description }}</p>
                                </td>
                                <td v-if="isAdmin" class="px-4 py-3 text-sm text-gray-700">{{ campaign.user?.name }}</td>
                                <td class="px-4 py-3 text-sm text-gray-700">{{ campaign.business?.name }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(campaign.start_date) }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(campaign.end_date) }}</td>
                                <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ campaign.total_days }} days</td>
                                <td class="px-4 py-3 text-sm font-medium text-gray-900">${{ parseFloat(campaign.total_amount).toFixed(2) }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600 capitalize">{{ formatPaymentMethod(campaign.payment_method) }}</td>
                                <td class="px-4 py-3">
                                    <span class="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                                        :class="{
                                            'bg-amber-50 text-amber-700': campaign.status === 'pending',
                                            'bg-green-50 text-green-700': campaign.status === 'active',
                                            'bg-blue-50 text-blue-700': campaign.status === 'completed',
                                            'bg-red-50 text-red-700': campaign.status === 'cancelled',
                                        }">
                                        {{ campaign.status }}
                                    </span>
                                </td>
                                <td v-if="isAdmin" class="px-4 py-3">
                                    <button @click="toggleStatus(campaign)"
                                        class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                        :class="campaign.is_active ? 'bg-primary' : 'bg-gray-200'">
                                        <span class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                                            :class="campaign.is_active ? 'translate-x-4' : 'translate-x-1'" />
                                    </button>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <Link :href="route('campaigns.analytics', campaign.id)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Preview">
                                            <Eye :size="15" />
                                        </Link>
                                        <Link :href="route('campaigns.analytics', campaign.id)" class="p-1.5 rounded-lg hover:bg-green-50 text-green-500 transition-colors" title="Analytics">
                                            <BarChart3 :size="15" />
                                        </Link>
                                        <button v-if="isAdmin" @click="openEdit(campaign)" class="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors" title="Edit">
                                            <Pencil :size="15" />
                                        </button>
                                        <button v-if="isAdmin || campaign.status === 'pending'" @click="handleDelete(campaign)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!campaigns.data?.length">
                                <td :colspan="isAdmin ? 11 : 9" class="px-4 py-12 text-center text-sm text-gray-400">No campaigns found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="campaigns.links" :from="campaigns.from ?? 0" :to="campaigns.to ?? 0" :total="campaigns.total ?? 0" />
            </div>
        </div>

        <!-- Create/Edit Modal (Admin) -->
        <Modal :show="showModal" max-width="lg" :closeable="true" @close="closeModal">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">{{ editing ? 'Edit Campaign' : 'Create Campaign' }}</h3>
                <form @submit.prevent="submitForm" class="space-y-4">
                    <div>
                        <InputLabel value="Campaign Name" required />
                        <TextInput v-model="form.name" type="text" class="mt-1.5" placeholder="Enter campaign name" />
                        <InputError :message="form.errors.name" />
                    </div>
                    <div>
                        <InputLabel value="Description" />
                        <textarea v-model="form.description" rows="3" placeholder="Enter campaign description"
                            class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" />
                        <InputError :message="form.errors.description" />
                    </div>
                    <div v-if="isAdmin">
                        <InputLabel value="Company User" required />
                        <select v-model="form.user_id" @change="onUserChange" class="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="">Select Company User</option>
                            <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
                        </select>
                        <InputError :message="form.errors.user_id" />
                    </div>
                    <div>
                        <InputLabel value="Business" required />
                        <select v-model="form.business_id" class="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="">Select business</option>
                            <option v-for="b in filteredBusinesses" :key="b.id" :value="b.id">{{ b.name }}</option>
                        </select>
                        <InputError :message="form.errors.business_id" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Start Date" required />
                            <TextInput v-model="form.start_date" type="date" class="mt-1.5" />
                            <InputError :message="form.errors.start_date" />
                        </div>
                        <div>
                            <InputLabel value="End Date" required />
                            <TextInput v-model="form.end_date" type="date" class="mt-1.5" />
                            <InputError :message="form.errors.end_date" />
                        </div>
                    </div>

                    <!-- Cost Preview -->
                    <div v-if="form.start_date && form.end_date && calculatedDays > 0" class="bg-gray-50 rounded-xl p-4 text-sm space-y-1.5">
                        <div class="flex justify-between text-gray-600">
                            <span>Total Days</span>
                            <span class="font-medium text-gray-900">{{ calculatedDays }} days</span>
                        </div>
                        <div class="flex justify-between text-gray-600">
                            <span>Price per Day</span>
                            <span class="font-medium text-gray-900">${{ pricePerDay.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-1.5 mt-1.5">
                            <span>Total Amount</span>
                            <span>${{ totalAmount.toFixed(2) }}</span>
                        </div>
                    </div>

                    <div v-if="isAdmin">
                        <InputLabel value="Status" />
                        <select v-model="form.status" class="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div v-if="isAdmin" class="flex items-center gap-3">
                        <button type="button" @click="form.is_active = !form.is_active"
                            class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                            :class="form.is_active ? 'bg-primary' : 'bg-gray-200'">
                            <span class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                                :class="form.is_active ? 'translate-x-4' : 'translate-x-1'" />
                        </button>
                        <span class="text-sm text-gray-700">Active</span>
                    </div>
                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="form.processing">
                            <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin" />
                            {{ editing ? 'Update' : 'Save' }}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>

        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Campaign</h3>
                <p class="text-sm text-gray-600 mb-6">Delete <strong>{{ selectedCampaign?.name }}</strong>?</p>
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button @click="confirmDelete" :disabled="deleteForm.processing" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Delete</button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import { Plus, Search, Filter, BarChart3, Pencil, Trash2, Loader2, Eye, ChevronUp, ChevronDown } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

interface Campaign {
    id: number; name: string; description?: string; status: string; is_active: boolean;
    start_date: string; end_date: string; total_days: number; total_amount: string;
    payment_method: string; user_id?: number;
    user?: { name: string }; business?: { name: string };
}

interface PricingTier { min_days: number; max_days: number; per_day_price: number; }

const props = defineProps<{
    campaigns: { data: Campaign[]; links: any[]; from?: number; to?: number; total?: number };
    isAdmin?: boolean;
    users?: { id: number; name: string }[];
    businesses?: { id: number; name: string; created_by?: number }[];
    filters?: { search?: string; status?: string; user_id?: string; business_id?: string; start_date?: string; end_date?: string; sort_field?: string; sort_direction?: string; per_page?: string };
    campaignSettings?: { pricing_tiers?: PricingTier[] };
}>();

// Filter state
const searchTerm = ref(props.filters?.search ?? '');
const statusFilter = ref(props.filters?.status ?? '');
const userFilter = ref(props.filters?.user_id ?? '');
const businessFilter = ref(props.filters?.business_id ?? '');
const startDateFilter = ref(props.filters?.start_date ?? '');
const endDateFilter = ref(props.filters?.end_date ?? '');
const perPage = ref(props.filters?.per_page ?? '10');
const showFilters = ref(false);
const sortField = ref(props.filters?.sort_field ?? 'created_at');
const sortDirection = ref(props.filters?.sort_direction ?? 'desc');

// Modal state
const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref<Campaign | null>(null);
const selectedCampaign = ref<Campaign | null>(null);
const selectedUserId = ref('');

const form = useForm({
    name: '', description: '', user_id: '', business_id: '',
    start_date: '', end_date: '', status: 'pending', is_active: true,
});
const deleteForm = useForm({});

// Computed
const activeFilterCount = computed(() =>
    [userFilter.value, businessFilter.value, statusFilter.value, startDateFilter.value, endDateFilter.value]
        .filter(Boolean).length
);

const filteredBusinesses = computed(() => {
    if (!props.isAdmin || !selectedUserId.value) return props.businesses ?? [];
    return (props.businesses ?? []).filter(b => b.created_by?.toString() === selectedUserId.value.toString());
});

const calculatedDays = computed(() => {
    if (!form.start_date || !form.end_date) return 0;
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    if (end <= start) return 0;
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
});

const pricePerDay = computed(() => {
    const tiers = props.campaignSettings?.pricing_tiers ?? [];
    if (!tiers.length) return 10;
    const days = calculatedDays.value;
    for (const tier of tiers) {
        if (days >= tier.min_days && days <= tier.max_days) return parseFloat(String(tier.per_day_price));
    }
    return parseFloat(String(tiers[tiers.length - 1]?.per_day_price ?? 10));
});

const totalAmount = computed(() => calculatedDays.value * pricePerDay.value);

// Methods
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-CA') : '—';
const formatPaymentMethod = (m: string) => {
    const map: Record<string, string> = { stripe: 'Credit Card', paypal: 'PayPal', bank: 'Bank Transfer', manual: 'Manual' };
    return map[m] ?? m?.replace('_', ' ') ?? '—';
};

const buildParams = () => {
    const p: Record<string, any> = { page: 1, per_page: perPage.value };
    if (searchTerm.value) p.search = searchTerm.value;
    if (userFilter.value) p.user_id = userFilter.value;
    if (businessFilter.value) p.business_id = businessFilter.value;
    if (statusFilter.value) p.status = statusFilter.value;
    if (startDateFilter.value) p.start_date = startDateFilter.value;
    if (endDateFilter.value) p.end_date = endDateFilter.value;
    if (sortField.value) { p.sort_field = sortField.value; p.sort_direction = sortDirection.value; }
    return p;
};

const applyFilters = () => router.get(route('campaigns.index'), buildParams(), { preserveState: true, preserveScroll: true });

const resetFilters = () => {
    searchTerm.value = ''; statusFilter.value = ''; userFilter.value = '';
    businessFilter.value = ''; startDateFilter.value = ''; endDateFilter.value = '';
    showFilters.value = false;
    router.get(route('campaigns.index'), { page: 1, per_page: perPage.value }, { preserveState: true });
};

const handleSort = (field: string) => {
    if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortField.value = field;
        sortDirection.value = 'asc';
    }
    applyFilters();
};

const onUserChange = () => {
    selectedUserId.value = form.user_id;
    form.business_id = '';
};

const openCreate = () => {
    editing.value = null;
    selectedUserId.value = '';
    form.reset();
    form.status = 'pending';
    form.is_active = true;
    showModal.value = true;
};

const openEdit = (c: Campaign) => {
    editing.value = c;
    selectedUserId.value = c.user_id?.toString() ?? '';
    form.name = c.name;
    form.description = c.description ?? '';
    form.user_id = c.user_id?.toString() ?? '';
    form.business_id = String((c as any).business_id ?? '');
    form.start_date = c.start_date?.split('T')[0] ?? '';
    form.end_date = c.end_date?.split('T')[0] ?? '';
    form.status = c.status;
    form.is_active = c.is_active;
    showModal.value = true;
};

const closeModal = () => { showModal.value = false; form.reset(); editing.value = null; selectedUserId.value = ''; };

const submitForm = () => {
    if (editing.value) {
        form.put(route('campaigns.update', editing.value.id), { onSuccess: closeModal });
    } else {
        form.post(route('campaigns.store'), { onSuccess: closeModal });
    }
};

const toggleStatus = (c: Campaign) => router.put(route('campaigns.toggle-status', c.id), {});
const handleDelete = (c: Campaign) => { selectedCampaign.value = c; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedCampaign.value) return;
    deleteForm.delete(route('campaigns.destroy', selectedCampaign.value.id), {
        onSuccess: () => { showDeleteModal.value = false; },
    });
};

const SortIcon = (props: { field: string }) => {
    if (sortField.value !== props.field) return null;
    return h(sortDirection.value === 'asc' ? ChevronUp : ChevronDown, { size: 12, class: 'inline text-primary' });
};
</script>
