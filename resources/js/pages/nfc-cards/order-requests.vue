<template>
    <AppLayout>
        <Head title="NFC Card Order Requests" />
        <FlashMessage />
        <div class="space-y-6">
            <h1 class="text-2xl font-bold text-gray-900">NFC Card Order Requests</h1>
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="req in orderRequests?.data ?? []" :key="req.id" class="hover:bg-gray-50">
                                <td class="px-4 py-3 font-medium text-gray-900">{{ req.user?.name }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ req.quantity }}</td>
                                <td class="px-4 py-3">
                                    <span class="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                                        :class="{
                                            'bg-amber-50 text-amber-700': req.status === 'pending',
                                            'bg-green-50 text-green-700': req.status === 'approved',
                                            'bg-red-50 text-red-700': req.status === 'rejected',
                                        }">
                                        {{ req.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ new Date(req.created_at).toLocaleDateString() }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button v-if="req.status === 'pending'" @click="approve(req)" class="p-1.5 rounded-lg hover:bg-green-50 text-green-500 transition-colors">
                                            <CheckCircle :size="15" />
                                        </button>
                                        <button v-if="req.status === 'pending'" @click="reject(req)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                                            <XCircle :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!orderRequests?.data?.length">
                                <td colspan="5" class="px-4 py-12 text-center text-sm text-gray-400">No order requests</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { CheckCircle, XCircle } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';

defineProps<{ orderRequests?: any }>();
const approve = (r: any) => router.post(route('nfc-cards.approve-order', r.id), {});
const reject = (r: any) => router.post(route('nfc-cards.reject-order', r.id), {});
</script>
