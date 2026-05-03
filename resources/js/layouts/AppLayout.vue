<template>
    <div class="flex h-screen overflow-hidden bg-background">
        <!-- Mobile overlay -->
        <div
            v-if="mobileSidebarOpen"
            class="fixed inset-0 bg-black/40 z-40 lg:hidden"
            @click="mobileSidebarOpen = false"
        />

        <!-- Desktop sidebar -->
        <aside
            class="hidden lg:flex flex-col flex-shrink-0 h-screen sidebar-transition z-30"
            :class="[desktopSidebarClass, { 'colored-sidebar': isColoredSidebar }]"
            :style="sidebarInlineStyle"
        >
            <AppSidebar :collapsed="isMinimal" :current-path="currentPath" :colored="isColoredSidebar" />
        </aside>

        <!-- Mobile sidebar -->
        <aside
            class="fixed inset-y-0 left-0 z-50 w-64 flex flex-col lg:hidden transform transition-transform duration-300 ease-in-out border-r"
            :class="[mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full', mobileSidebarBgClass, { 'colored-sidebar': isColoredSidebar }]"
            :style="sidebarInlineStyle"
        >
            <div class="flex items-center justify-between p-4 border-b border-white/10">
                <div class="flex items-center gap-2">
                    <template v-if="sidebarLogo">
                        <img :src="sidebarLogo" :alt="appTitle" class="h-8 max-w-[120px] object-contain" />
                    </template>
                    <template v-else>
                        <div class="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                            <CreditCard :size="16" class="text-white" />
                        </div>
                        <span class="font-bold text-lg" :class="isColoredSidebar ? 'text-white' : 'text-foreground'">{{ appTitle }}</span>
                    </template>
                </div>
                <button @click="mobileSidebarOpen = false" class="p-1.5 rounded-lg transition-colors" :class="isColoredSidebar ? 'hover:bg-white/10 text-white' : 'hover:bg-muted text-muted-foreground'">
                    <X :size="18" />
                </button>
            </div>
            <AppSidebar :collapsed="false" hide-logo :current-path="currentPath" :colored="isColoredSidebar" />
        </aside>

        <!-- Main content -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <AppTopbar
                :sidebar-collapsed="isMinimal"
                @menu-click="mobileSidebarOpen = true"
                @collapse-toggle="toggleCollapse"
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
import { THEME_COLORS } from '@/composables/useAppearance';

const page = usePage();
const currentPath = computed(() => new URL(window.location.href).pathname);

const sidebarCollapsed = ref(false);
const mobileSidebarOpen = ref(false);

const { logoLight, logoDark, titleText, sidebarVariant, sidebarStyle, themeColor, customColor } = useBrand();

const primaryColor = computed(() => {
    const color = themeColor.value;
    return color === 'custom' ? customColor.value : (THEME_COLORS[color as keyof typeof THEME_COLORS] || THEME_COLORS.green);
});

// Variant helpers
const isMinimal = computed(() => sidebarVariant.value === 'minimal' || sidebarCollapsed.value);
const isFloating = computed(() => sidebarVariant.value === 'floating');
const isColoredSidebar = computed(() => sidebarStyle.value === 'colored' || sidebarStyle.value === 'gradient');

function toggleCollapse() {
    if (sidebarVariant.value === 'minimal') return; // minimal is always icon-only
    sidebarCollapsed.value = !sidebarCollapsed.value;
}

// Desktop sidebar classes based on variant
const desktopSidebarClass = computed(() => {
    const variant = sidebarVariant.value;
    const style = sidebarStyle.value;
    const baseBg = style === 'plain' ? 'bg-card' : '';

    if (variant === 'floating') {
        // Floating: detached from edge with margin, rounded corners, shadow
        return [
            isMinimal.value ? 'w-16' : 'w-60',
            'm-3 rounded-xl shadow-lg border',
            baseBg,
            isColoredSidebar.value ? 'text-white border-transparent' : 'border',
        ];
    }

    if (variant === 'minimal') {
        // Minimal: always icon-only, no border
        return ['w-16', baseBg, 'border-r'];
    }

    // Inset (default): normal full-height sidebar with border
    return [
        isMinimal.value ? 'w-16' : 'w-60',
        'border-r',
        baseBg,
    ];
});

const mobileSidebarBgClass = computed(() => {
    return sidebarStyle.value === 'plain' ? 'bg-card' : '';
});

// Sidebar inline style for colored/gradient
const sidebarInlineStyle = computed(() => {
    const style = sidebarStyle.value;
    if (style === 'colored') {
        return { backgroundColor: primaryColor.value };
    }
    if (style === 'gradient') {
        return {
            background: `linear-gradient(180deg, ${primaryColor.value} 0%, ${primaryColor.value}99 100%)`
        };
    }
    return {};
});

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
