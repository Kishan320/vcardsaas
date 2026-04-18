<template>
    <AppLayout>
        <Head title="Newsletter Subscriber" />
        <FlashMessage />
        <div class="space-y-6">
            <h1 class="text-2xl font-bold text-gray-900">Subscriber Detail</h1>
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 max-w-md">
                <p class="text-sm text-gray-500">Email</p>
                <p class="font-medium text-gray-900">{{ newsletter?.email }}</p>
            </div>
        </div>
    </AppLayout>
</template>
<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
defineProps<{ newsletter?: any }>();
</script>
