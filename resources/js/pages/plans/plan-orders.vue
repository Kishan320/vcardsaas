<template>
    <AppLayout>
        <Head title="Plan Orders" />
        <FlashMessage />
        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Plan Orders</h1>
                <p class="text-sm text-gray-500 mt-0.5">Manage subscription payment orders</p>
            </div>

            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="order in planOrders.data" :key="order.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3 font-medium text-gray-900">{{ order.user?.name }}</td>
                                <td class="px-4 py-3">
                                    <span class="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">{{ order.plan?.name }}</span>
                                </td>
                                <td class="px-4 py-3 font-semibold text-gray-900">${{ parseFloat(order.final_price ?? order.price ?? 0).toFixed(2) }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600 capitalize">{{ order.payment_method }}</td>
                                <td class="px-4 py-3">
                                    <span class="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
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
                                <td colspan="7" class="px-4 py-12 text-center text-sm text-gray-400">No plan orders found</td>
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
import { Head, router } from '@inertiajs/vue3';
import { CheckCircle, XCircle } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Pagination from '@/components/ui/Pagination.vue';

interface PlanOrder { id: number; status: string; price?: string; final_price?: string; payment_method: string; created_at: string; user?: { name: string }; plan?: { name: string } }

const props = defineProps<{
    planOrders: { data: PlanOrder[]; links: any[]; from?: number; to?: number; total?: number };
}>();

const formatDate = (d: string) => new Date(d).toLocaleDateString();
const approve = (o: PlanOrder) => router.post(route('plan-orders.approve', o.id), {});
const reject = (o: PlanOrder) => router.post(route('plan-orders.reject', o.id), {});
</script>
