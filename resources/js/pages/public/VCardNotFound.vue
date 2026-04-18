<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Head title="Not Found" />
        <div class="text-center">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard :size="40" class="text-gray-300" />
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-3">Card Not Found</h1>
            <p class="text-gray-500 mb-8 max-w-sm mx-auto">The business card you're looking for doesn't exist or has been removed.</p>
            <a href="/" class="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all">
                <Home :size="16" /> Go Home
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { CreditCard, Home } from 'lucide-vue-next';
</script>
