<template>
    <div v-if="links.length > 3" class="flex items-center justify-between mt-6">
        <p class="text-sm text-gray-500">
            Showing {{ from }} to {{ to }} of {{ total }} results
        </p>
        <div class="flex items-center gap-1">
            <template v-for="link in links" :key="link.label">
                <Link
                    v-if="link.url"
                    :href="link.url"
                    class="px-3 py-1.5 text-sm rounded-lg transition-colors"
                    :class="link.active
                        ? 'bg-primary-600 text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'"
                    v-html="link.label"
                />
                <span
                    v-else
                    class="px-3 py-1.5 text-sm text-gray-300 cursor-not-allowed"
                    v-html="link.label"
                />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

defineProps<{
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}>();
</script>
