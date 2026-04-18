<template>
    <div class="min-h-screen flex justify-center">
        <Head>
            <title>{{ pageTitle }}</title>
            <meta name="description" :content="metaDescription" />
            <meta v-if="metaKeywords" name="keywords" :content="metaKeywords" />
            <meta property="og:title" :content="pageTitle" />
            <meta property="og:description" :content="metaDescription" />
            <meta v-if="ogImage" property="og:image" :content="ogImage" />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" :content="pageTitle" />
            <meta name="twitter:description" :content="metaDescription" />
            <meta v-if="ogImage" name="twitter:image" :content="ogImage" />
        </Head>

        <div v-if="bioLink" class="w-full max-w-md min-h-screen bg-white">
            <!-- Profile Header -->
            <div class="relative p-8 text-center" :style="headerStyle">
                <div v-if="profileImage" class="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white/40 shadow-lg">
                    <img :src="profileImage" :alt="bioLink.name" class="w-full h-full object-cover" />
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
                    class="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-medium text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
                    :style="linkStyle"
                >
                    {{ link.title }}
                </a>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 class="text-xl font-semibold mb-2">Bio Link Not Found</h1>
            <p class="text-gray-500">The requested bio link could not be found.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { Head } from '@inertiajs/vue3';

const props = defineProps<{ bioLink?: any }>();

const config = computed(() => props.bioLink?.config ?? {});
const pageTitle = computed(() => config.value?.seo?.title || props.bioLink?.name || 'Bio Link');
const metaDescription = computed(() => config.value?.seo?.description || `Bio Link for ${props.bioLink?.name || 'User'}`);
const metaKeywords = computed(() => config.value?.seo?.keywords || '');
const ogImage = computed(() => config.value?.seo?.og_image || '');

const profileImage = computed(() => config.value?.header?.profile_image || '');
const headerName = computed(() => config.value?.header?.name || props.bioLink?.name || '');
const tagline = computed(() => config.value?.header?.tagline || '');
const links = computed(() => config.value?.links ?? []);

const initials = computed(() => {
    const name = headerName.value;
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
});

const bgColor = computed(() => config.value?.background?.color || '#ffffff');
const buttonColor = computed(() => config.value?.buttonColor || '#000000');
const buttonTextColor = computed(() => config.value?.buttonTextColor || '#ffffff');

const headerStyle = computed(() => ({
    background: config.value?.background?.gradient || `linear-gradient(135deg, ${buttonColor.value}, ${buttonColor.value}cc)`,
}));

const linkStyle = computed(() => ({
    backgroundColor: buttonColor.value,
    color: buttonTextColor.value,
}));

onMounted(() => {
    const analytics = config.value?.analytics;
    if (!analytics) return;

    if (analytics.google_analytics) {
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${analytics.google_analytics}`;
        document.head.appendChild(s);
        const c = document.createElement('script');
        c.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${analytics.google_analytics}');`;
        document.head.appendChild(c);
    }
});
</script>
