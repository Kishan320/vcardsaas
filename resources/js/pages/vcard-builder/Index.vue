<template>
    <AppLayout>
        <Head title="VCard Builder" />
        <FlashMessage />

        <div class="space-y-6">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">VCard Builder</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Manage your digital business cards</p>
                </div>
                <Link
                    v-if="canCreate"
                    :href="route('vcard-builder.create')"
                    class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90 active:scale-95"
                >
                    <Plus :size="16" /> Create New VCard
                </Link>
                <div v-else class="text-sm text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                    Limit reached ({{ planLimits?.current_businesses }}/{{ planLimits?.max_businesses }})
                </div>
            </div>

            <!-- Search & Filters -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4">
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                        <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            v-model="searchTerm"
                            type="text"
                            placeholder="Search VCards…"
                            class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                            @keyup.enter="applyFilters"
                        />
                    </div>
                    <select
                        v-model="selectedType"
                        class="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
                        @change="applyFilters"
                    >
                        <option value="">All Types</option>
                        <option v-for="type in businessTypes" :key="type.value" :value="type.value">
                            {{ type.label }}
                        </option>
                    </select>
                    <div class="flex items-center gap-2">
                        <button
                            @click="activeView = 'grid'"
                            class="p-2 rounded-lg transition-colors"
                            :class="activeView === 'grid' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100 text-gray-500'"
                        >
                            <LayoutGrid :size="16" />
                        </button>
                        <button
                            @click="activeView = 'list'"
                            class="p-2 rounded-lg transition-colors"
                            :class="activeView === 'list' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100 text-gray-500'"
                        >
                            <List :size="16" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="!businesses.data.length" class="bg-white border border-gray-100 rounded-2xl shadow-card p-12 text-center">
                <div class="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard :size="28" class="text-white" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No VCards yet</h3>
                <p class="text-sm text-gray-500 mb-6">Create your first digital business card to get started.</p>
                <Link
                    :href="route('vcard-builder.create')"
                    class="inline-flex items-center gap-2 px-5 py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                    <Plus :size="16" /> Create VCard
                </Link>
            </div>

            <!-- Grid View -->
            <div v-else-if="activeView === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div
                    v-for="business in businesses.data"
                    :key="business.id"
                    class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300"
                >
                    <!-- Card Header -->
                    <div class="h-28 relative overflow-hidden gradient-primary">
                        <div class="absolute inset-0 opacity-20">
                            <div class="absolute top-2 left-4 w-12 h-12 rounded-full bg-white/30" />
                            <div class="absolute bottom-2 right-4 w-8 h-8 rounded-full bg-white/20" />
                        </div>
                        <!-- New badge -->
                        <span
                            v-if="isNew(business.created_at)"
                            class="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold py-0.5 px-2 rounded-full z-10"
                        >
                            New
                        </span>
                        <!-- Actions dropdown -->
                        <div class="absolute top-2 right-2 z-10">
                            <div class="relative" :ref="(el) => setDropdownRef(el, business.id)">
                                <button
                                    @click.stop="toggleDropdown(business.id)"
                                    class="w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors"
                                >
                                    <MoreVertical :size="14" class="text-white" />
                                </button>
                                <div
                                    v-if="openDropdown === business.id"
                                    class="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-modal border border-gray-100 z-50 animate-fade-in overflow-hidden"
                                >
                                    <button @click="handleDuplicate(business)" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <Copy :size="14" class="text-purple-500" /> Duplicate
                                    </button>
                                    <button @click="handleCopyLink(business)" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <Link2 :size="14" class="text-blue-500" /> Copy Link
                                    </button>
                                    <button @click="handleShare(business)" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <Share2 :size="14" class="text-blue-500" /> Share
                                    </button>
                                    <Link :href="route('vcard-builder.analytics', business.slug)" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <BarChart3 :size="14" class="text-orange-500" /> Analytics
                                    </Link>
                                    <Link :href="route('vcard-builder.contacts', business.slug)" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <Users :size="14" class="text-blue-500" /> Contacts
                                    </Link>
                                    <div class="border-t border-gray-100">
                                        <button @click="handleDeleteClick(business)" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                                            <Trash2 :size="14" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Business name -->
                        <div class="absolute bottom-3 left-4 right-4 z-10">
                            <h3 class="text-base font-bold text-white truncate drop-shadow">{{ business.name }}</h3>
                            <p class="text-xs text-white/80 capitalize">{{ business.business_type }}</p>
                        </div>
                    </div>

                    <!-- Card Body -->
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium capitalize">
                                {{ business.business_type }}
                            </span>
                            <span class="text-xs text-gray-400">{{ formatDate(business.created_at) }}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <Link
                                :href="route('vcard-builder.edit', business.id)"
                                class="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold gradient-primary text-white rounded-lg hover:opacity-90 transition-all"
                            >
                                <Pencil :size="12" /> Edit
                            </Link>
                            <a
                                :href="getPublicUrl(business)"
                                target="_blank"
                                class="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50 transition-all"
                            >
                                <Eye :size="12" /> Preview
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- List View -->
            <div v-else class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="business in businesses.data" :key="business.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                            {{ business.name.charAt(0) }}
                                        </div>
                                        <div>
                                            <Link :href="route('vcard-builder.edit', business.id)" class="font-medium text-gray-900 hover:text-primary-600 transition-colors">
                                                {{ business.name }}
                                            </Link>
                                            <p v-if="business.expertise" class="text-xs text-gray-500">{{ business.expertise }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium capitalize">
                                        {{ business.business_type }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(business.created_at) }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <a :href="getPublicUrl(business)" target="_blank" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Preview">
                                            <Eye :size="15" />
                                        </a>
                                        <button @click="handleShare(business)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Share">
                                            <Share2 :size="15" />
                                        </button>
                                        <button @click="handleCopyLink(business)" class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Copy Link">
                                            <Link2 :size="15" />
                                        </button>
                                        <Link :href="route('vcard-builder.analytics', business.slug)" class="p-1.5 rounded-lg hover:bg-orange-50 text-orange-500 transition-colors" title="Analytics">
                                            <BarChart3 :size="15" />
                                        </Link>
                                        <Link :href="route('vcard-builder.edit', business.id)" class="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors" title="Edit">
                                            <Pencil :size="15" />
                                        </Link>
                                        <button @click="handleDuplicate(business)" class="p-1.5 rounded-lg hover:bg-purple-50 text-purple-500 transition-colors" title="Duplicate">
                                            <Copy :size="15" />
                                        </button>
                                        <button @click="handleDeleteClick(business)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination
                    v-if="businesses.links"
                    :links="businesses.links"
                    :from="businesses.from ?? 0"
                    :to="businesses.to ?? 0"
                    :total="businesses.total ?? 0"
                />
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Trash2 :size="18" class="text-red-600" />
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Delete VCard</h3>
                        <p class="text-sm text-gray-500">This action cannot be undone.</p>
                    </div>
                </div>
                <p class="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete <strong>{{ selectedBusiness?.name }}</strong>?
                </p>
                <div class="flex gap-3 justify-end">
                    <button
                        @click="showDeleteModal = false"
                        class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        @click="confirmDelete"
                        :disabled="deleteForm.processing"
                        class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        <Loader2 v-if="deleteForm.processing" :size="14" class="mr-1 animate-spin inline" />
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import {
    Plus, Search, LayoutGrid, List, CreditCard, Eye, Share2,
    Link2, BarChart3, Users, Pencil, Copy, Trash2, MoreVertical, Loader2,
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import type { PaginatedData } from '@/types';

interface Business {
    id: number;
    slug: string;
    name: string;
    business_type: string;
    created_at: string;
    expertise?: string;
    theme?: string;
    url_prefix?: string;
    custom_domain?: string;
}

const props = defineProps<{
    businesses: PaginatedData<Business>;
    planLimits?: { current_businesses: number; max_businesses: number; can_create: boolean };
    filters?: { search?: string; type?: string };
}>();

const canCreate = computed(() => !props.planLimits || props.planLimits.can_create);

const searchTerm = ref(props.filters?.search ?? '');
const selectedType = ref(props.filters?.type ?? '');
const activeView = ref(localStorage.getItem('vcard-view') ?? 'grid');
const openDropdown = ref<number | null>(null);
const showDeleteModal = ref(false);
const selectedBusiness = ref<Business | null>(null);
const deleteForm = useForm({});

const businessTypes = [
    { value: 'freelancer', label: 'Freelancer' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'salon', label: 'Salon' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'realestate', label: 'Real Estate' },
    { value: 'photography', label: 'Photography' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'ecommerce', label: 'E-Commerce' },
    { value: 'tech-startup', label: 'Tech Startup' },
];

const dropdownRefs = new Map<number, HTMLElement>();
const setDropdownRef = (el: unknown, id: number) => {
    if (el) dropdownRefs.set(id, el as HTMLElement);
};

const toggleDropdown = (id: number) => {
    openDropdown.value = openDropdown.value === id ? null : id;
};

const applyFilters = () => {
    router.get(route('vcard-builder.index'), {
        search: searchTerm.value || undefined,
        type: selectedType.value || undefined,
    }, { preserveState: true, preserveScroll: true });
};

const getPublicUrl = (business: Business) => {
    if (business.custom_domain) return `https://${business.custom_domain}`;
    if (business.url_prefix) return `/${business.url_prefix}/${business.slug}`;
    return `/${business.slug}`;
};

const isNew = (date: string) => new Date(date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

const formatDate = (date: string) => new Date(date).toLocaleDateString();

const handleCopyLink = async (business: Business) => {
    const url = `${window.location.origin}${getPublicUrl(business)}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    openDropdown.value = null;
};

const handleShare = (business: Business) => {
    const url = `${window.location.origin}${getPublicUrl(business)}`;
    if (navigator.share) {
        navigator.share({ title: business.name, url });
    } else {
        handleCopyLink(business);
    }
    openDropdown.value = null;
};

const handleDuplicate = (business: Business) => {
    router.post(route('vcard-builder.duplicate', business.id), {});
    openDropdown.value = null;
};

const handleDeleteClick = (business: Business) => {
    selectedBusiness.value = business;
    showDeleteModal.value = true;
    openDropdown.value = null;
};

const confirmDelete = () => {
    if (!selectedBusiness.value) return;
    deleteForm.delete(route('vcard-builder.destroy', selectedBusiness.value.id), {
        onSuccess: () => { showDeleteModal.value = false; },
    });
};
</script>
