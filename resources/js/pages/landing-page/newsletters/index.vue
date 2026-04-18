<template>
    <AppLayout>
        <Head title="Newsletters" />
        <FlashMessage />
        <div class="space-y-6">
            <h1 class="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscribed</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="sub in newsletters?.data ?? []" :key="sub.id" class="hover:bg-gray-50">
                                <td class="px-4 py-3 font-medium text-gray-900">{{ sub.email }}</td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ new Date(sub.created_at).toLocaleDateString() }}</td>
                            </tr>
                            <tr v-if="!newsletters?.data?.length">
                                <td colspan="2" class="px-4 py-12 text-center text-sm text-gray-400">No subscribers yet</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
defineProps<{ newsletters?: any }>();
</script>
