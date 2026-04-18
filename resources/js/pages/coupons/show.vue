<template>
    <AppLayout>
        <Head :title="`Coupon - ${coupon.name}`" />
        <FlashMessage />

        <div class="space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <Link :href="route('coupons.index')" class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <ArrowLeft :size="14" /> Back to Coupons
                    </Link>
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">{{ coupon.name }}</h1>
                        <p class="text-sm text-gray-500">Coupon Details &amp; Usage History</p>
                    </div>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="coupon.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ coupon.status ? 'Active' : 'Inactive' }}
                </span>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-5">
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Discount Value</p>
                    <p class="text-2xl font-extrabold text-gray-900 mt-1">{{ formatDiscount(coupon.type, coupon.discount_amount) }}</p>
                </div>
                <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-5">
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Times Used</p>
                    <p class="text-2xl font-extrabold text-gray-900 mt-1">
                        {{ coupon.used_count }}<span v-if="coupon.use_limit_per_coupon" class="text-base font-normal text-gray-400"> / {{ coupon.use_limit_per_coupon }}</span>
                    </p>
                </div>
                <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-5">
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">User Limit</p>
                    <p class="text-2xl font-extrabold text-gray-900 mt-1">{{ coupon.use_limit_per_user ?? 'Unlimited' }}</p>
                </div>
                <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-5">
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expires</p>
                    <p class="text-2xl font-extrabold text-gray-900 mt-1">{{ coupon.expiry_date ? formatDate(coupon.expiry_date) : 'Never' }}</p>
                </div>
            </div>

            <!-- Coupon Info -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Coupon Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <p class="text-sm font-medium text-gray-500">Coupon Code</p>
                            <code class="text-lg font-mono bg-gray-100 px-3 py-1.5 rounded block mt-1">{{ coupon.code }}</code>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-500">Type</p>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1"
                                :class="coupon.type === 'percentage' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
                                {{ coupon.type === 'percentage' ? 'Percentage' : 'Flat Amount' }}
                            </span>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-500">Created By</p>
                            <p class="text-sm text-gray-900 mt-1">{{ coupon.creator?.name }} ({{ coupon.creator?.email }})</p>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div v-if="coupon.minimum_spend">
                            <p class="text-sm font-medium text-gray-500">Minimum Spend</p>
                            <p class="text-sm text-gray-900 mt-1">{{ formatCurrency(coupon.minimum_spend) }}</p>
                        </div>
                        <div v-if="coupon.maximum_spend">
                            <p class="text-sm font-medium text-gray-500">Maximum Spend</p>
                            <p class="text-sm text-gray-900 mt-1">{{ formatCurrency(coupon.maximum_spend) }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-500">Created At</p>
                            <p class="text-sm text-gray-900 mt-1">{{ formatDate(coupon.created_at) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Usage History -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="p-5 border-b border-gray-100">
                    <h2 class="text-lg font-semibold text-gray-900">Usage History</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Discount</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Used At</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="item in usageHistory.data" :key="item.id" class="hover:bg-gray-50">
                                <td class="px-4 py-3">{{ item.user_name }}</td>
                                <td class="px-4 py-3 text-gray-500">{{ item.user_email }}</td>
                                <td class="px-4 py-3 font-mono text-xs">{{ item.order_id }}</td>
                                <td class="px-4 py-3">{{ formatCurrency(item.amount) }}</td>
                                <td class="px-4 py-3 text-green-600">{{ formatCurrency(item.discount_amount) }}</td>
                                <td class="px-4 py-3 text-gray-500">{{ formatDate(item.used_at) }}</td>
                            </tr>
                            <tr v-if="!usageHistory.data?.length">
                                <td colspan="6" class="px-4 py-12 text-center text-sm text-gray-400">No usage history found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination v-if="usageHistory.last_page > 1"
                    :links="usageHistory.links"
                    :from="usageHistory.from ?? 0"
                    :to="usageHistory.to ?? 0"
                    :total="usageHistory.total ?? 0"
                />
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Pagination from '@/components/ui/Pagination.vue';

interface CouponData {
    id: number; name: string; code: string; type: string;
    discount_amount: number; minimum_spend?: number; maximum_spend?: number;
    use_limit_per_coupon?: number; use_limit_per_user?: number;
    used_count: number; expiry_date?: string; status: boolean;
    created_at: string; creator: { name: string; email: string };
}

const props = defineProps<{
    coupon: CouponData;
    usage_history: { data: any[]; links: any[]; from?: number; to?: number; total?: number; last_page: number };
}>();

const formatDate = (d: string) =>
    (window as any).appSettings?.formatDateTime?.(d, false) ?? new Date(d).toLocaleDateString();

const formatCurrency = (amount: number) =>
    (window as any).appSettings?.formatCurrency?.(amount) ?? `$${Number(amount).toFixed(2)}`;

const formatDiscount = (type: string, amount: number) =>
    type === 'percentage' ? `${amount}%` : formatCurrency(amount);

const usageHistory = props.usage_history;
</script>
