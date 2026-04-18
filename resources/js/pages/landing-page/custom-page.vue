<template>
    <div class="min-h-screen bg-gray-50">
        <Head :title="page?.title ?? 'Page'" />
        <div class="max-w-4xl mx-auto px-4 py-12">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ page?.title }}</h1>
            <div class="prose max-w-none" v-html="page?.content" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
defineProps<{ page?: any }>();
</script>
