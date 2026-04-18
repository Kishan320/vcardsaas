<template>
    <AppLayout>
        <Head title="Plan Orders" />
        <FlashMessage />

        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ isSuperAdmin ? 'Plan Orders' : 'My Plan Orders' }}</h1>
                <p class="text-sm text-gray-500 mt-0.5">Manage subscription payment orders</p>
            </div>

            <!-- Search & Filters -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4 space-y-3">
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                        <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="searchTerm" type="text" placeholder="Search orders…"
                            class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                            @keyup.enter="applyFilters" />
                    </div>
                    <button @click="applyFilters" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90">
                        <Search :size="14" /> Search
                    </button>
                    <button @click="showFilters = !showFilters" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 relative">
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
                <div v-if="showFilters" class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                    <div>
                        <label class="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                        <select v-model="statusFilter" @change="applyFilters" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500 mb-1 block">Payment Method</label>
                        <select v-model="paymentFilter" @change="applyFilters" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="">All Methods</option>
                            <option value="stripe">Stripe</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="manually">Manual</option>
                        </select>
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
                                <th v-if="isSuperAdmin" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Billing</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="order in planOrders.data" :key="order.id" class="hover:bg-gray-50 transition-colors">
                                <td v-if="isSuperAdmin" class="px-4 py-3 font-medium text-gray-900">{{ order.user?.name }}</td>
                                <td class="px-4 py-3">
                                    <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{{ order.plan?.name }}</span>
                                </td>
                                <td class="px-4 py-3 font-semibold text-gray-900">${{ parseFloat(String(order.final_price ?? order.price ?? 0)).toFixed(2) }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600 capitalize">{{ order.payment_method }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600 capitalize">{{ order.billing_cycle ?? '—' }}</td>
                                <td class="px-4 py-3">
                                    <span class="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                                        :class="{
                                            'bg-amber-50 text-amber-700': order.status === 'pending',
                                            'bg-green-50 text-green-700': order.status === 'approved',
                                            'bg-red-50 text-red-700': order.status === 'rejected',
                                        }">
                                        {{ order.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(order.created_at) }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button v-if="order.status === 'pending'" @click="approve(order)" class="p-1.5 rounded-lg hover:bg-green-50 text-green-500 transition-colors" title="Approve">
                                            <CheckCircle :size="15" />
                                        </button>
                                        <button v-if="order.status === 'pending'" @click="reject(order)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Reject">
                                            <XCircle :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!planOrders.data?.length">
                                <td :colspan="isSuperAdmin ? 8 : 7" class="px-4 py-12 text-center text-sm text-gray-400">No plan orders found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="planOrders.links" :from="planOrders.from ?? 0" :to="planOrders.to ?? 0" :total="planOrders.total ?? 0" />
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import { Search, Filter, CheckCircle, XCircle } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Pagination from '@/components/ui/Pagination.vue';

interface PlanOrder { id: number; status: string; price?: string; final_price?: string; payment_method: string; billing_cycle?: string; created_at: string; user?: { name: string }; plan?: { name: string } }

const props = defineProps<{
    planOrders: { data: PlanOrder[]; links: any[]; from?: number; to?: number; total?: number };
    isSuperAdmin?: boolean;
    filters?: { search?: string; status?: string; payment_method?: string; per_page?: string };
}>();

const searchTerm = ref(props.filters?.search ?? '');
const statusFilter = ref(props.filters?.status ?? '');
const paymentFilter = ref(props.filters?.payment_method ?? '');
const perPage = ref(props.filters?.per_page ?? '10');
const showFilters = ref(false);

const activeFilterCount = computed(() => [statusFilter.value, paymentFilter.value].filter(Boolean).length);
const formatDate = (d: string) => new Date(d).toLocaleDateString();

const buildParams = () => {
    const p: Record<string, any> = { page: 1, per_page: perPage.value };
    if (searchTerm.value) p.search = searchTerm.value;
    if (statusFilter.value) p.status = statusFilter.value;
    if (paymentFilter.value) p.payment_method = paymentFilter.value;
    return p;
};

const applyFilters = () => router.get(route('plan-orders.index'), buildParams(), { preserveState: true, preserveScroll: true });
const resetFilters = () => { searchTerm.value = ''; statusFilter.value = ''; paymentFilter.value = ''; showFilters.value = false; router.get(route('plan-orders.index'), { page: 1, per_page: perPage.value }, { preserveState: true }); };

const approve = (o: PlanOrder) => router.post(route('plan-orders.approve', o.id), {});
const reject = (o: PlanOrder) => router.post(route('plan-orders.reject', o.id), {});
</script>
