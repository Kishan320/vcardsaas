<template>
    <AppLayout>
        <Head title="Contact Detail" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex items-center gap-3">
                <Link :href="route('landing-page.contacts.index')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft :size="18" class="text-gray-500" />
                </Link>
                <h1 class="text-2xl font-bold text-gray-900">Contact Detail</h1>
            </div>
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 max-w-2xl space-y-4">
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div><p class="text-gray-500">Name</p><p class="font-medium text-gray-900">{{ contact?.name }}</p></div>
                    <div><p class="text-gray-500">Email</p><p class="font-medium text-gray-900">{{ contact?.email }}</p></div>
                    <div class="col-span-2"><p class="text-gray-500">Message</p><p class="font-medium text-gray-900">{{ contact?.message }}</p></div>
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
defineProps<{ contact?: any }>();
</script>
