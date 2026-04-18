<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Head title="Business Directory" />

        <!-- Hero Section -->
        <div
            class="relative overflow-hidden"
            :style="heroStyle"
        >
            <!-- Background pattern -->
            <div class="absolute inset-0 opacity-10">
                <svg class="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="bizPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                            <rect x="20" y="25" width="40" height="25" rx="3" fill="currentColor" opacity="0.3"/>
                            <rect x="22" y="27" width="12" height="2" fill="currentColor" opacity="0.5"/>
                            <rect x="22" y="30" width="20" height="1" fill="currentColor" opacity="0.4"/>
                            <circle cx="10" cy="15" r="2" fill="currentColor" opacity="0.4"/>
                            <circle cx="70" cy="65" r="2" fill="currentColor" opacity="0.4"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#bizPattern)" class="text-white"/>
                </svg>
            </div>

            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div class="text-center mb-12">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex-1"></div>
                        <div class="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                            {{ directorySettings?.config_sections?.hero?.trust_badge || 'Trusted by 10,000+ Businesses' }}
                        </div>
                        <div v-if="auth?.user?.type === 'superadmin'" class="flex-1 flex justify-end">
                            <Link
                                :href="route('directory.settings')"
                                class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium hover:bg-white/20 transition-colors"
                            >
                                <Settings :size="16" /> Settings
                            </Link>
                        </div>
                    </div>

                    <h1 class="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                        {{ heroTitle }}
                    </h1>

                    <p class="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
                        {{ directorySettings?.config_sections?.hero?.subtitle || 'Connect with professionals, explore services, and grow your network in our comprehensive business directory' }}
                    </p>

                    <div class="flex flex-wrap justify-center gap-4 text-white/80 text-sm">
                        <div v-for="(feature, i) in heroFeatures" :key="i" class="flex items-center">
                            <svg class="w-5 h-5 mr-2" :fill="primaryColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                            {{ feature.text }}
                        </div>
                    </div>
                </div>

                <!-- Search -->
                <div class="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 lg:p-8 border border-white/20">
                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
                        <div class="lg:col-span-2 relative">
                            <Search :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                v-model="searchTerm"
                                type="text"
                                placeholder="Search businesses, services, or locations..."
                                class="w-full pl-12 pr-4 h-12 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                                @keyup.enter="handleSearch"
                            />
                        </div>

                        <select
                            v-model="selectedCategory"
                            class="h-12 border border-gray-300 rounded-xl px-4 text-sm focus:outline-none focus:ring-2"
                        >
                            <option value="all">All Business Types</option>
                            <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                        </select>

                        <div class="flex gap-3">
                            <button
                                @click="handleSearch"
                                :disabled="isLoading"
                                class="flex-1 h-12 text-base font-semibold text-white rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                                :style="{ backgroundColor: primaryColor }"
                            >
                                <Loader2 v-if="isLoading" :size="18" class="animate-spin" />
                                <Search v-else :size="18" />
                                {{ isLoading ? 'Searching...' : 'Search' }}
                            </button>
                            <button
                                v-if="searchTerm || selectedCategory !== 'all'"
                                @click="resetSearch"
                                class="h-12 px-6 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Categories Slider -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="flex items-center justify-between mb-8">
                <div class="text-center flex-1">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ directorySettings?.title || 'Browse by Business Type' }}</h2>
                    <p class="text-gray-600">{{ directorySettings?.description || 'Explore businesses across different industries' }}</p>
                </div>
                <Link
                    v-if="auth?.user?.type === 'superadmin'"
                    :href="route('directory.settings')"
                    class="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                    :style="{ backgroundColor: primaryColor }"
                >
                    <Settings :size="16" /> Settings
                </Link>
            </div>

            <div class="relative">
                <button
                    @click="sliderIndex = Math.max(0, sliderIndex - 4)"
                    :disabled="sliderIndex === 0"
                    class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 disabled:opacity-40"
                >
                    <ChevronLeft :size="20" />
                </button>

                <div class="overflow-hidden mx-12">
                    <div
                        class="flex gap-4 transition-transform duration-300"
                        :style="{ transform: `translateX(-${sliderIndex * 180}px)` }"
                    >
                        <div
                            v-for="cat in categories"
                            :key="cat.value"
                            class="flex-shrink-0 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-primary"
                            @click="selectCategory(cat.value)"
                        >
                            <div class="p-6 text-center min-w-[160px]">
                                <div class="text-4xl mb-3">🏢</div>
                                <h3 class="font-semibold text-gray-900 mb-1 text-sm">{{ cat.label }}</h3>
                                <p class="text-xs text-gray-500">{{ cat.count || 0 }} businesses</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    @click="sliderIndex = Math.min(categories.length - 4, sliderIndex + 4)"
                    :disabled="sliderIndex >= categories.length - 4"
                    class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 disabled:opacity-40"
                >
                    <ChevronRight :size="20" />
                </button>
            </div>
        </div>

        <!-- Business Listings -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">
                        {{ businesses?.data?.length ? 'Featured Businesses' : 'No Results Found' }}
                    </h2>
                    <p class="text-gray-600">
                        <template v-if="businesses?.data?.length">
                            Showing {{ businesses?.meta?.from || 1 }} to {{ businesses?.meta?.to || businesses?.data?.length }} of {{ businesses?.meta?.total || businesses?.data?.length }} businesses
                        </template>
                        <template v-else>
                            Try adjusting your search criteria or browse all categories
                        </template>
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                <div
                    v-for="business in businessesWithContact"
                    :key="business.id"
                    class="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg bg-white overflow-hidden rounded-xl"
                >
                    <!-- Featured ribbon -->
                    <div v-if="business.is_featured" class="relative">
                        <div class="absolute -top-2 -right-2 w-16 h-16 z-10">
                            <div class="absolute transform rotate-45 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold py-1 right-[-35px] top-[32px] w-[170px] text-center shadow-lg">
                                Featured
                            </div>
                        </div>
                    </div>

                    <div class="p-6 pb-4">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h3 class="font-bold text-xl text-gray-900 mb-1 group-hover:text-primary transition-colors">
                                    {{ business.name }}
                                </h3>
                                <div class="flex items-center gap-2 mb-2">
                                    <span v-if="business.is_verified" class="text-xs bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded-full">
                                        ✓ Verified
                                    </span>
                                    <span class="text-sm text-gray-600 capitalize font-medium px-2 py-1 bg-gray-100 rounded-full">
                                        {{ business.business_type?.replace('-', ' ') }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div v-if="business.rating > 0" class="flex items-center gap-2 mb-3">
                            <div class="flex items-center">
                                <Star v-for="i in 5" :key="i" :size="16"
                                    :class="i <= Math.floor(business.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'" />
                            </div>
                            <span class="text-sm font-semibold text-gray-900">{{ business.rating }}</span>
                            <span class="text-xs text-gray-500">({{ business.rating_count }} reviews)</span>
                        </div>

                        <p v-if="business.directory_description" class="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                            {{ business.directory_description }}
                        </p>
                    </div>

                    <div class="px-6 pb-6 pt-0">
                        <div class="space-y-3 mb-6">
                            <div v-if="business.contactInfo.phone" class="flex items-center gap-3 text-sm text-gray-700">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-blue-50">
                                    <Phone :size="14" class="text-blue-600" />
                                </div>
                                <span class="font-medium">{{ business.contactInfo.phone }}</span>
                            </div>
                            <div v-if="business.contactInfo.email" class="flex items-center gap-3 text-sm text-gray-700">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-green-50">
                                    <Mail :size="14" class="text-green-600" />
                                </div>
                                <span class="font-medium truncate">{{ business.contactInfo.email }}</span>
                            </div>
                            <div v-if="business.contactInfo.address" class="flex items-center gap-3 text-sm text-gray-700">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-orange-50">
                                    <MapPin :size="14" class="text-orange-600" />
                                </div>
                                <span class="font-medium line-clamp-2">{{ business.contactInfo.address }}</span>
                            </div>
                        </div>

                        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div class="flex items-center gap-2 text-xs text-gray-500">
                                <Eye :size="14" />
                                <span class="font-medium">{{ business.view_count?.toLocaleString() }} views</span>
                            </div>
                            <div class="flex gap-2">
                                <a
                                    :href="getBusinessUrl(business)"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Globe :size="14" /> View Card
                                </a>
                                <Link
                                    :href="route('directory.show', { business: business.id })"
                                    class="inline-flex items-center px-3 py-1.5 text-sm text-white rounded-lg hover:opacity-90 transition-all"
                                    :style="{ backgroundColor: primaryColor }"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="businesses?.links?.length > 3" class="flex justify-center items-center mt-12 gap-2">
                <template v-for="(link, i) in businesses.links" :key="i">
                    <button
                        v-if="link.label.includes('Previous') || link.label.includes('laquo')"
                        :disabled="!link.url"
                        @click="link.url && router.visit(link.url)"
                        class="px-3 py-2 h-10 border border-gray-300 rounded-lg text-sm hover:border-gray-400 disabled:opacity-50 flex items-center gap-1"
                    >
                        <ChevronLeft :size="16" /> Previous
                    </button>
                    <button
                        v-else-if="link.label.includes('Next') || link.label.includes('raquo')"
                        :disabled="!link.url"
                        @click="link.url && router.visit(link.url)"
                        class="px-3 py-2 h-10 border border-gray-300 rounded-lg text-sm hover:border-gray-400 disabled:opacity-50 flex items-center gap-1"
                    >
                        Next <ChevronRight :size="16" />
                    </button>
                    <button
                        v-else-if="link.label.match(/^\d+$/)"
                        :disabled="!link.url"
                        @click="link.url && router.visit(link.url)"
                        class="w-10 h-10 rounded-lg text-sm border transition-all"
                        :class="link.active ? 'text-white border-0 shadow-md' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'"
                        :style="link.active ? { backgroundColor: primaryColor } : {}"
                    >
                        {{ link.label }}
                    </button>
                    <span v-else-if="link.label === '...'" class="px-2 text-gray-400 text-sm">•••</span>
                </template>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-900 text-gray-400 mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
                    <div class="col-span-2">
                        <p class="text-sm leading-relaxed mb-4 max-w-xs">
                            {{ directorySettings?.config_sections?.footer?.description || '' }}
                        </p>
                        <div class="flex gap-2 flex-wrap">
                            <a
                                v-for="s in footerSocials" :key="s.name"
                                :href="s.href"
                                class="w-9 h-9 rounded-lg bg-gray-800 hover:opacity-80 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs font-bold"
                            >
                                {{ s.name.charAt(0) }}
                            </a>
                        </div>
                    </div>
                    <div v-for="cat in footerLinkCategories" :key="cat.title">
                        <h4 class="text-white font-semibold text-sm mb-4">{{ cat.title }}</h4>
                        <ul class="space-y-2">
                            <li v-for="link in cat.links" :key="link.label">
                                <a :href="link.href" class="text-sm hover:text-white transition-colors">{{ link.label }}</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span>© {{ new Date().getFullYear() }} {{ directorySettings?.config_sections?.company?.name || directorySettings?.title || 'Business Directory' }}. All rights reserved.</span>
                    <div class="flex gap-4">
                        <a :href="route('directory.index')" class="hover:text-white transition-colors">Home</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { Search, Star, Eye, Phone, Mail, Globe, MapPin, Loader2, ChevronLeft, ChevronRight, Settings } from 'lucide-vue-next';

const props = defineProps<{
    businesses: any;
    categories: Array<{ value: string; label: string; count?: number }>;
    filters: { search?: string; category?: string };
    settings: any;
    directoryCustomPages?: any[];
    directorySettings?: any;
}>();

const page = usePage<any>();
const auth = computed(() => page.props.auth);

const searchTerm = ref(props.filters?.search || '');
const selectedCategory = ref(props.filters?.category || 'all');
const isLoading = ref(false);
const sliderIndex = ref(0);

const primaryColor = computed(() =>
    props.directorySettings?.config_sections?.theme?.primary_color ||
    props.settings?.config_sections?.theme?.primary_color ||
    '#7C3AED'
);

const heroStyle = computed(() => {
    const cfg = props.directorySettings?.config_sections;
    if (cfg?.use_background_image && cfg?.background_image) {
        const imgUrl = (window as any).appSettings?.imageUrl + cfg.background_image;
        return { background: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    const p = primaryColor.value;
    const s = cfg?.theme?.secondary_color || '#3b82f6';
    const a = cfg?.theme?.accent_color || '#8b5cf6';
    return { background: `linear-gradient(135deg, ${p} 0%, ${s} 50%, ${a} 100%)` };
});

const heroTitle = computed(() => {
    return props.directorySettings?.config_sections?.hero?.main_title || 'Discover Amazing Businesses';
});

const heroFeatures = computed(() =>
    props.directorySettings?.config_sections?.hero?.features || [
        { icon: 'verified', text: 'Verified Businesses' },
        { icon: 'location', text: 'Local & Global' },
        { icon: 'contact', text: 'Instant Contact' },
    ]
);

const businessesWithContact = computed(() =>
    (props.businesses?.data || []).map((b: any) => {
        const contact = b.config_sections?.contact || {};
        return {
            ...b,
            contactInfo: {
                phone: contact.phone,
                email: contact.email,
                website: contact.website,
                address: contact.address || contact.clinic_address,
            },
        };
    })
);

function getBusinessUrl(business: any) {
    if (business.url_prefix && business.url_prefix !== 'v') {
        return route('public.vcard.show', { prefix: business.url_prefix, slug: business.slug });
    }
    return route('public.vcard.show.direct', { slug: business.slug });
}

function handleSearch() {
    isLoading.value = true;
    router.get(route('directory.index'), {
        search: searchTerm.value || undefined,
        category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined,
    }, { onFinish: () => (isLoading.value = false) });
}

function resetSearch() {
    searchTerm.value = '';
    selectedCategory.value = 'all';
    isLoading.value = true;
    router.get(route('directory.index'), {}, { onFinish: () => (isLoading.value = false) });
}

const footerSocials = computed(() =>
    props.directorySettings?.config_sections?.footer?.social_links || []
);

const footerLinkCategories = computed(() =>
    props.directorySettings?.config_sections?.footer?.footer_links || []
);

function selectCategory(value: string) {
    selectedCategory.value = value;
    handleSearch();
}
</script>
