<template>
    <AppLayout>
        <Head title="Landing Page Contacts" />
        <FlashMessage />
        <div class="space-y-6">
            <h1 class="text-2xl font-bold text-gray-900">Landing Page Contacts</h1>
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="contact in contacts?.data ?? []" :key="contact.id" class="hover:bg-gray-50">
                                <td class="px-4 py-3 font-medium text-gray-900">{{ contact.name }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ contact.email }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{{ contact.message }}</td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ new Date(contact.created_at).toLocaleDateString() }}</td>
                            </tr>
                            <tr v-if="!contacts?.data?.length">
                                <td colspan="4" class="px-4 py-12 text-center text-sm text-gray-400">No contacts found</td>
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
defineProps<{ contacts?: any }>();
</script>
