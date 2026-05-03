<template>
    <div class="flex h-screen bg-gray-50 overflow-hidden">
        <!-- Mobile overlay -->
        <div
            v-if="mobileSidebarOpen"
            class="fixed inset-0 bg-black/40 z-40 lg:hidden"
            @click="mobileSidebarOpen = false"
        />

        <!-- Desktop sidebar -->
        <aside
            class="hidden lg:flex flex-col border-r sidebar-transition flex-shrink-0 h-screen bg-card"
            :class="sidebarCollapsed ? 'w-16' : 'w-60'"
        >
            <AppSidebar :collapsed="sidebarCollapsed" :current-path="currentPath" />
        </aside>

        <!-- Mobile sidebar -->
        <aside
            class="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col lg:hidden transform transition-transform duration-300 ease-in-out"
            :class="mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
        >
            <div class="flex items-center justify-between p-4 border-b">
                <div class="flex items-center gap-2">
                    <template v-if="sidebarLogo">
                        <img :src="sidebarLogo" :alt="appTitle" class="h-8 max-w-[120px] object-contain" />
                    </template>
                    <template v-else>
                        <div class="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                            <CreditCard :size="16" class="text-white" />
                        </div>
                        <span class="font-bold text-gray-900 text-lg">{{ appTitle }}</span>
                    </template>
                </div>
                <button @click="mobileSidebarOpen = false" class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <X :size="18" class="text-gray-500" />
                </button>
            </div>
            <AppSidebar :collapsed="false" hide-logo :current-path="currentPath" />
        </aside>

        <!-- Main content -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <AppTopbar
                :sidebar-collapsed="sidebarCollapsed"
                @menu-click="mobileSidebarOpen = true"
                @collapse-toggle="sidebarCollapsed = !sidebarCollapsed"
            />
            <main class="flex-1 overflow-y-auto scrollbar-thin bg-background">
                <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
                    <slot />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { X, CreditCard } from 'lucide-vue-next';
import AppSidebar from '@/components/AppSidebar.vue';
import AppTopbar from '@/components/AppTopbar.vue';
import { useBrand } from '@/contexts/BrandContext';
import { useFavicon } from '@/composables/useFavicon';
import { useBrandTheme } from '@/composables/useBrandTheme';

const page = usePage();
const currentPath = computed(() => new URL(window.location.href).pathname);

const sidebarCollapsed = ref(false);
const mobileSidebarOpen = ref(false);

const { logoLight, logoDark, titleText } = useBrand();

const sidebarLogo = computed(() => {
    const logo = logoLight.value || logoDark.value;
    if (!logo) return null;
    if (logo.startsWith('http')) return logo;
    return `${(window as any).appSettings?.baseUrl || ''}${logo}`;
});
const appTitle = computed(() => titleText.value || 'VCard SaaS');

// Apply favicon and brand theme globally
useFavicon();
useBrandTheme();
</script>
