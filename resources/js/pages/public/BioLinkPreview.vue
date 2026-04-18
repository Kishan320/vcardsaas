<template>
    <div class="min-h-screen flex justify-center">
        <Head title="Bio Link Preview" />

        <div v-if="loading" class="flex flex-col items-center justify-center min-h-screen">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
            <p class="text-gray-500 text-sm">Loading preview...</p>
        </div>

        <div v-else-if="!previewData" class="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 class="text-xl font-semibold mb-2">No preview data found</h1>
            <p class="text-gray-500">Please go back and try again.</p>
        </div>

        <div v-else class="w-full max-w-md min-h-screen bg-white">
            <!-- Profile Header -->
            <div class="relative p-8 text-center" :style="headerStyle">
                <div v-if="profileImage" class="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white/40 shadow-lg">
                    <img :src="profileImage" :alt="headerName" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-24 h-24 rounded-full mx-auto mb-4 bg-white/20 flex items-center justify-center text-3xl font-bold text-white">
                    {{ initials }}
                </div>
                <h1 class="text-2xl font-bold text-white">{{ headerName }}</h1>
                <p v-if="tagline" class="text-white/80 text-sm mt-1">{{ tagline }}</p>
            </div>

            <!-- Links -->
            <div class="p-4 space-y-3">
                <a
                    v-for="link in links"
                    :key="link.id ?? link.title"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-medium text-sm transition-all hover:opacity-90"
                    :style="linkStyle"
                >
                    {{ link.title }}
                </a>
                <div v-if="!links.length" class="text-center text-gray-400 py-8 text-sm">
                    No links added yet
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Head } from '@inertiajs/vue3';

const loading = ref(true);
const previewData = ref<any>(null);

onMounted(() => {
    const data = localStorage.getItem('biolink_preview_data');
    if (data) {
        try { previewData.value = JSON.parse(data); } catch {}
    }
    loading.value = false;
});

const config = computed(() => previewData.value?.config ?? {});
const profileImage = computed(() => config.value?.header?.profile_image || '');
const headerName = computed(() => config.value?.header?.name || previewData.value?.name || 'Bio Link');
const tagline = computed(() => config.value?.header?.tagline || '');
const links = computed(() => config.value?.links ?? []);
const buttonColor = computed(() => config.value?.buttonColor || '#000000');
const buttonTextColor = computed(() => config.value?.buttonTextColor || '#ffffff');

const initials = computed(() =>
    headerName.value.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
);

const headerStyle = computed(() => ({
    background: config.value?.background?.gradient || `linear-gradient(135deg, ${buttonColor.value}, ${buttonColor.value}cc)`,
}));

const linkStyle = computed(() => ({
    backgroundColor: buttonColor.value,
    color: buttonTextColor.value,
}));
</script>
