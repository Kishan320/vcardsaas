<template>
    <AppLayout>
        <Head title="VCard Contacts" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex items-center gap-3">
                <Link :href="route('vcard-builder.index')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft :size="18" class="text-gray-500" />
                </Link>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Contacts</h1>
                    <p class="text-sm text-gray-500 mt-0.5">{{ business?.name }}</p>
                </div>
            </div>

            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="contact in contacts.data" :key="contact.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">
                                            {{ contact.name.charAt(0) }}
                                        </div>
                                        <div>
                                            <p class="font-medium text-gray-900">{{ contact.name }}</p>
                                            <p class="text-xs text-gray-500">{{ contact.email }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ contact.phone ?? '—' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{{ contact.message ?? '—' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(contact.created_at) }}</td>
                            </tr>
                            <tr v-if="!contacts.data?.length">
                                <td colspan="4" class="px-4 py-12 text-center text-sm text-gray-400">No contacts yet</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="contacts.links" :from="contacts.from ?? 0" :to="contacts.to ?? 0" :total="contacts.total ?? 0" />
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

const props = defineProps<{
    business?: any;
    contacts: { data: any[]; links: any[]; from?: number; to?: number; total?: number };
}>();

const formatDate = (d: string) => new Date(d).toLocaleDateString();
</script>
