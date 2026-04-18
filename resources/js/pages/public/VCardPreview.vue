<template>
    <div class="min-h-screen flex justify-center bg-gray-50">
        <Head title="VCard Preview" />

        <div v-if="loading" class="flex flex-col items-center justify-center min-h-screen">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
            <p class="text-gray-500 text-sm">Loading preview...</p>
        </div>

        <div v-else-if="!previewData" class="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 class="text-xl font-semibold mb-2">No preview data found</h1>
            <p class="text-gray-500">Please go back and try again.</p>
        </div>

        <div v-else class="w-full max-w-sm min-h-screen">
            <!-- Hero -->
            <div class="relative px-6 pt-12 pb-8 text-center text-white"
                :style="{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }">
                <div v-if="profileImage" class="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white/30 shadow-lg">
                    <img :src="profileImage" :alt="previewData.name" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-24 h-24 rounded-full mx-auto mb-4 bg-white/20 flex items-center justify-center text-3xl font-bold">
                    {{ initials }}
                </div>
                <h1 class="text-2xl font-bold">{{ previewData.name }}</h1>
                <p v-if="tagline" class="text-white/80 text-sm mt-1">{{ tagline }}</p>
            </div>

            <!-- Contact Actions -->
            <div class="px-4 -mt-4 mb-4">
                <div class="bg-white rounded-2xl shadow p-4 flex gap-3 justify-center">
                    <a v-if="phone" :href="`tel:${phone}`" class="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl hover:bg-gray-50">
                        <Phone :size="20" class="text-purple-600" />
                        <span class="text-xs text-gray-600">Call</span>
                    </a>
                    <a v-if="email" :href="`mailto:${email}`" class="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl hover:bg-gray-50">
                        <Mail :size="20" class="text-purple-600" />
                        <span class="text-xs text-gray-600">Email</span>
                    </a>
                    <a v-if="website" :href="website" target="_blank" class="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl hover:bg-gray-50">
                        <Globe :size="20" class="text-purple-600" />
                        <span class="text-xs text-gray-600">Website</span>
                    </a>
                </div>
            </div>

            <!-- About -->
            <div v-if="about" class="px-4 mb-4">
                <div class="bg-white rounded-2xl shadow p-5">
                    <h2 class="font-semibold text-gray-900 mb-2">About</h2>
                    <p class="text-sm text-gray-600 leading-relaxed">{{ about }}</p>
                </div>
            </div>

            <div class="px-4 pb-8 text-center">
                <p class="text-xs text-gray-400">Preview Mode</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Head } from '@inertiajs/vue3';
import { Phone, Mail, Globe } from 'lucide-vue-next';

const loading = ref(true);
const previewData = ref<any>(null);

onMounted(() => {
    const data = localStorage.getItem('vcard_preview_data');
    if (data) {
        try { previewData.value = JSON.parse(data); } catch {}
    }
    loading.value = false;
});

const sections = computed(() => previewData.value?.config_sections ?? {});
const primaryColor = computed(() => sections.value?.colors?.primary ?? '#7C3AED');
const secondaryColor = computed(() => sections.value?.colors?.secondary ?? '#9F67FF');
const profileImage = computed(() => sections.value?.profile?.image ?? sections.value?.hero?.image ?? '');
const tagline = computed(() => sections.value?.profile?.tagline ?? sections.value?.hero?.tagline ?? '');
const about = computed(() => sections.value?.about?.description ?? sections.value?.profile?.bio ?? '');
const phone = computed(() => sections.value?.contact?.phone ?? sections.value?.profile?.phone ?? '');
const email = computed(() => sections.value?.contact?.email ?? sections.value?.profile?.email ?? '');
const website = computed(() => sections.value?.contact?.website ?? sections.value?.profile?.website ?? '');

const initials = computed(() => {
    const name = previewData.value?.name ?? '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
});
</script>
