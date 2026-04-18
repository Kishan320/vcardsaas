<template>
    <AppLayout>
        <Head title="Referred Users" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex items-center gap-3">
                <Link :href="route('referral.index')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft :size="18" class="text-gray-500" />
                </Link>
                <h1 class="text-2xl font-bold text-gray-900">Referred Users</h1>
            </div>
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Referred By</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Commission</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="ref in referredUsers?.data ?? []" :key="ref.id" class="hover:bg-gray-50">
                                <td class="px-4 py-3 font-medium text-gray-900">{{ ref.referred?.name }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ ref.referrer?.name }}</td>
                                <td class="px-4 py-3 text-sm font-medium text-gray-900">${{ ref.commission_amount }}</td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ new Date(ref.created_at).toLocaleDateString() }}</td>
                            </tr>
                            <tr v-if="!referredUsers?.data?.length">
                                <td colspan="4" class="px-4 py-12 text-center text-sm text-gray-400">No referred users yet</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
defineProps<{ referredUsers?: any }>();
</script>
