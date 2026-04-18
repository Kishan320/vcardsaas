<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <Head :title="page?.meta_title || page?.title || 'Page'" />
        <meta v-if="page?.meta_description" name="description" :content="page.meta_description" />

        <!-- Header -->
        <header class="bg-white border-b shadow-sm sticky top-0 z-10">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <a :href="route('directory.index')" class="flex items-center gap-2 font-bold text-lg text-gray-900 hover:opacity-80">
                    {{ settings?.config_sections?.company?.name || settings?.title || 'Business Directory' }}
                </a>
                <nav class="flex items-center gap-4 text-sm">
                    <a :href="route('directory.index')" class="text-gray-600 hover:text-gray-900 transition-colors">Directory</a>
                    <a
                        v-for="p in customPages" :key="p.id"
                        :href="route('directory.custom-page.show', p.slug)"
                        class="transition-colors"
                        :class="p.slug === page?.slug ? 'text-primary font-semibold' : 'text-gray-600 hover:text-gray-900'"
                    >
                        {{ p.title }}
                    </a>
                </nav>
            </div>
        </header>

        <!-- Content -->
        <main class="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
            <!-- Breadcrumb -->
            <nav class="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <a :href="route('directory.index')" class="hover:text-gray-900 transition-colors">Home</a>
                <span>/</span>
                <span class="text-gray-900 font-medium">{{ page?.title }}</span>
            </nav>

            <article class="bg-white rounded-2xl shadow-sm border p-8 lg:p-12">
                <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">{{ page?.title }}</h1>
                <div class="prose prose-gray max-w-none" v-html="page?.content" />
            </article>
        </main>

        <!-- Footer -->
        <footer class="bg-gray-900 text-gray-400 mt-auto">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                <span>© {{ new Date().getFullYear() }} {{ settings?.config_sections?.company?.name || settings?.title || 'Business Directory' }}. All rights reserved.</span>
                <div class="flex gap-4">
                    <a :href="route('directory.index')" class="hover:text-white transition-colors">Directory</a>
                    <a v-for="p in customPages" :key="p.id" :href="route('directory.custom-page.show', p.slug)" class="hover:text-white transition-colors">{{ p.title }}</a>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3';

defineProps<{
    page?: any;
    customPages?: any[];
    settings?: any;
}>();
</script>
