<template>
    <div class="flex flex-col h-full min-h-0">
        <!-- Logo -->
        <template v-if="!hideLogo">
            <div v-if="!collapsed" class="flex items-center gap-2.5 px-4 py-4 border-b">
                <template v-if="sidebarLogo">
                    <img :src="sidebarLogo" :alt="appTitle" class="h-8 max-w-[120px] object-contain" />
                </template>
                <template v-else>
                    <div class="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                        <CreditCard :size="16" class="text-white" />
                    </div>
                    <span class="font-bold text-gray-900 text-lg tracking-tight">{{ appTitle }}</span>
                </template>
            </div>
            <div v-else class="flex items-center justify-center py-4 border-b">
                <template v-if="sidebarLogo">
                    <img :src="sidebarLogo" :alt="appTitle" class="h-8 w-8 object-contain" />
                </template>
                <template v-else>
                    <div class="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                        <CreditCard :size="16" class="text-white" />
                    </div>
                </template>
            </div>
        </template>

        <!-- Nav -->
        <nav class="flex-1 min-h-0 overflow-y-auto scrollbar-thin py-3 px-2">
            <div v-for="group in visibleGroups" :key="group" class="mb-4">
                <p v-if="!collapsed" class="text-[10px] font-semibold uppercase tracking-widest px-3 mb-1.5" :class="groupLabelClass">
                    {{ group }}
                </p>
                <div v-else class="border-t my-2 mx-1" :class="borderColorClass" />
                <template v-for="item in navItemsByGroup(group)" :key="item.id">
                    <!-- Item with children (collapsible) -->
                    <div v-if="canShow(item) && item.children && visibleChildren(item.children).length > 0">
                        <button
                            @click="toggleOpen(item.id)"
                            @mouseenter="hoveredItem = item.id"
                            @mouseleave="hoveredItem = null"
                            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 relative group"
                            :class="[collapsed ? 'justify-center' : '']" 
                            :style="getItemStyle(item.id, isGroupActive(visibleChildren(item.children)))"
                        >
                            <span class="flex-shrink-0">
                                <component :is="item.icon" :size="18" />
                            </span>
                            <span v-if="!collapsed" class="flex-1 truncate text-start">{{ item.label }}</span>
                            <ChevronDown
                                v-if="!collapsed"
                                :size="14"
                                class="flex-shrink-0 transition-transform duration-200"
                                :class="openItems.has(item.id) ? 'rotate-180' : ''"
                            />
                            <div
                                v-if="collapsed"
                                class="absolute start-full ms-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                            >
                                {{ item.label }}
                                <div class="absolute top-1/2 -start-1 -translate-y-1/2 border-4 border-transparent border-e-gray-900" />
                            </div>
                        </button>
                        <!-- Children -->
                        <div v-if="!collapsed && openItems.has(item.id)" class="ms-4 ps-3 border-s mt-0.5 mb-1 space-y-0.5" :class="borderColorClass">
                            <Link
                                v-for="child in visibleChildren(item.children)" :key="child.href"
                                :href="child.href"
                                :target="child.target"
                                class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                                :style="getItemStyle(child.href, isActive(child.href))"
                                @mouseenter="hoveredItem = child.href"
                                @mouseleave="hoveredItem = null"
                            >
                                <ExternalLink v-if="child.target === '_blank'" :size="13" class="flex-shrink-0 opacity-60" />
                                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-40 flex-shrink-0" v-else />
                                {{ child.label }}
                            </Link>
                        </div>
                    </div>
                    <!-- Regular flat item -->
                    <Link
                        v-else-if="canShow(item) && !item.children && item.href"
                        :href="item.href"
                        class="flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 relative group"
                        :class="[collapsed ? 'justify-center' : '']"
                        :style="getItemStyle(item.href!, isActive(item.href!))"
                        @mouseenter="hoveredItem = item.href!"
                        @mouseleave="hoveredItem = null"
                    >
                        <span class="flex-shrink-0">
                            <component :is="item.icon" :size="18" />
                        </span>
                        <span v-if="!collapsed" class="flex-1 truncate">{{ item.label }}</span>
                        <div
                            v-if="collapsed"
                            class="absolute start-full ms-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                        >
                            {{ item.label }}
                            <div class="absolute top-1/2 -start-1 -translate-y-1/2 border-4 border-transparent border-e-gray-900" />
                        </div>
                    </Link>
                </template>
            </div>
        </nav>

        <!-- Bottom user -->
        <div v-if="!collapsed" class="border-t p-3" :class="userSectionClass">
            <div class="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors" :class="userHoverClass">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" :style="{ backgroundColor: primaryColor }">
                    {{ initials }}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold truncate" :class="userNameClass">{{ user?.name }}</p>
                    <p class="text-xs truncate" :class="userEmailClass">{{ user?.email }}</p>
                </div>
                <ChevronRight :size="14" :class="[chevronClass, 'rtl:rotate-180']" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import {
    LayoutDashboard, CreditCard, Users, Key, BarChart3,
    Calendar, Phone, Package, DollarSign, Globe, Settings,
    FileText, Link2, Image, Megaphone, ChevronRight, ChevronDown, Layers,
    UserCheck, Wallet, Building2, BookOpen, ExternalLink, Gift, Tag, Mail,
} from 'lucide-vue-next';
import { usePermissions } from '@/composables/usePermissions';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/composables/useAppearance';
import type { PageProps } from '@/types';

const props = defineProps<{
    collapsed: boolean;
    hideLogo?: boolean;
    currentPath?: string;
    colored?: boolean;
}>();

const page = usePage<PageProps>();
const user = computed(() => page.props.auth?.user);
const initials = computed(() => {
    const name = user.value?.name ?? '';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
});

const { isSuperAdmin, hasPermission } = usePermissions();
const { logoLight, logoDark, titleText, themeColor, customColor } = useBrand();

const primaryColor = computed(() => {
    const color = themeColor.value;
    return color === 'custom' ? customColor.value : (THEME_COLORS[color as keyof typeof THEME_COLORS] || THEME_COLORS.green);
});

const activeStyle = computed(() => ({
    backgroundColor: props.colored ? 'rgba(255,255,255,0.2)' : primaryColor.value + '18',
    color: props.colored ? '#ffffff' : primaryColor.value,
}));

const hoverStyle = computed(() => ({
    backgroundColor: props.colored ? 'rgba(255,255,255,0.12)' : primaryColor.value + '12',
    color: props.colored ? '#ffffff' : primaryColor.value,
}));

const defaultTextClass = computed(() => props.colored ? 'text-white/80' : 'text-muted-foreground');
const groupLabelClass = computed(() => props.colored ? 'text-white/50' : 'text-muted-foreground');
const borderColorClass = computed(() => props.colored ? 'border-white/10' : 'border-border');
const userSectionClass = computed(() => props.colored ? 'border-white/10' : 'border-border');
const userHoverClass = computed(() => props.colored ? 'hover:bg-white/10' : 'hover:bg-muted');
const userNameClass = computed(() => props.colored ? 'text-white' : 'text-foreground');
const userEmailClass = computed(() => props.colored ? 'text-white/60' : 'text-muted-foreground');
const chevronClass = computed(() => props.colored ? 'text-white/50' : 'text-muted-foreground');

const hoveredItem = ref<string | null>(null);

function getItemStyle(key: string, isActiveItem: boolean) {
    if (isActiveItem) return activeStyle.value;
    if (hoveredItem.value === key) return hoverStyle.value;
    return props.colored ? { color: 'rgba(255,255,255,0.8)' } : {};
}

function getItemClass(isActiveItem: boolean) {
    if (isActiveItem || hoveredItem.value) return '';
    return defaultTextClass.value;
}

// Use light logo for sidebar (light mode default)
const sidebarLogo = computed(() => {
    const logo = logoLight.value || logoDark.value;
    if (!logo) return null;
    if (logo.startsWith('http')) return logo;
    return `${(window as any).appSettings?.baseUrl || ''}${logo}`;
});
const appTitle = computed(() => titleText.value || 'VCard SaaS');

interface NavChild {
    label: string;
    href: string;
    target?: string;
    permission?: string;
    superAdminOnly?: boolean;
}

interface NavItem {
    id: string;
    label: string;
    icon: unknown;
    href?: string;
    group: string;
    superAdminOnly?: boolean;
    companyOnly?: boolean;
    permission?: string;
    children?: NavChild[];
}

const navItems: NavItem[] = [
    // Superadmin items (image exact match)
    { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard, href: '/dashboard', group: 'Main' },
    { id: 'analytics',  label: 'Analytics',  icon: BarChart3, href: '/analytics', group: 'Main' },
    { id: 'addons',     label: 'Addons',     icon: Package,  href: '/addons', group: 'Main', superAdminOnly: true },
    {
        id: 'business-directory', label: 'Business Directory', icon: BookOpen, group: 'Main',
        superAdminOnly: true,
        children: [
            { label: 'View Directory',     href: '/directory',              target: '_blank' },
            { label: 'Directory Settings', href: '/directory/settings' },
            { label: 'Custom Pages',       href: '/directory/custom-pages' },
        ],
    },
    { id: 'companies',     label: 'Companies',     icon: Building2, href: '/companies',     group: 'Main', superAdminOnly: true },
    { id: 'media-library', label: 'Media Library', icon: Image,     href: '/media-library', group: 'Main', permission: 'manage-media' },
    {
        id: 'nfc-cards', label: 'NFC Cards', icon: Layers, group: 'Main',
        children: [
            { label: 'NFC Cards',      href: '/nfc-cards',         permission: 'manage-nfc-cards' },
            { label: 'Order Requests', href: '/nfc-cards-request', permission: 'manage-nfc-cards' },
        ],
    },
    {
        id: 'campaigns', label: 'Campaigns', icon: Megaphone, group: 'Main',
        children: [
            { label: 'Campaigns', href: '/campaigns',          permission: 'manage-campaigns' },
            { label: 'Settings',  href: '/campaigns/settings', superAdminOnly: true },
        ],
    },
    {
        id: 'plans', label: 'Plans', icon: Package, group: 'Main',
        children: [
            { label: 'Plans',         href: '/plans',         permission: 'manage-plans' },
            { label: 'Plan Requests', href: '/plan-requests', permission: 'manage-plan-requests' },
            { label: 'Plan Orders',   href: '/plan-orders',   permission: 'manage-plan-orders' },
            { label: 'Coupons',       href: '/coupons',       superAdminOnly: true },
        ],
    },
    { id: 'domain-requests', label: 'Domain Requests',  icon: Globe,     href: '/domain-requests',       group: 'Main', superAdminOnly: true },
    { id: 'currencies',      label: 'Currencies',        icon: DollarSign, href: '/currencies',            group: 'Main', superAdminOnly: true },
    { id: 'referral',        label: 'Referral Program',  icon: Gift,      href: '/referral',              group: 'Main', permission: 'manage-referral' },
    {
        id: 'landing-page', label: 'Landing Page', icon: Globe, group: 'Main',
        superAdminOnly: true,
        children: [
            { label: 'Landing Page',     href: '/landing-page' },
            { label: 'Custom Pages',     href: '/landing-page/custom-pages' },
            { label: 'Contact Queries', href: '/landing-page/contacts' },
            { label: 'Newsletter',      href: '/landing-page/newsletters' },
        ],
    },
    { id: 'broadcast-emails', label: 'Broadcast Emails', icon: Mail,     href: '/campaigns',          group: 'Main', superAdminOnly: true },
    { id: 'email-templates',  label: 'Email Templates',  icon: FileText, href: '/email-templates',    group: 'Main', superAdminOnly: true },
    { id: 'settings',         label: 'Settings',         icon: Settings, href: '/settings',           group: 'Main', permission: 'manage-settings' },

    // Company-only items
    { id: 'vcard-builder', label: 'vCard Builder', icon: CreditCard, href: '/vcard-builder',    group: 'Cards', companyOnly: true, permission: 'manage-businesses' },
    { id: 'link-bio',      label: 'Bio Link',      icon: Link2,      href: '/link-bio-builder', group: 'Cards', companyOnly: true, permission: 'manage-bio-link-builder' },
    { id: 'contacts',      label: 'Contacts',      icon: Phone,      href: '/contacts',         group: 'CRM',   companyOnly: true, permission: 'manage-contacts' },
    { id: 'appointments',  label: 'Appointments',  icon: Calendar,   href: '/appointments',     group: 'CRM',   companyOnly: true, permission: 'manage-appointments' },
    { id: 'calendar',      label: 'Calendar',      icon: Calendar,   href: '/calendar',         group: 'CRM',   companyOnly: true, permission: 'manage-calendar' },
    { id: 'google-wallet', label: 'Google Wallet', icon: Wallet,     href: '/google-wallet',    group: 'Tools', companyOnly: true, permission: 'manage-google-wallet' },
    {
        id: 'staff', label: 'Staff', icon: Users, group: 'Admin', companyOnly: true,
        children: [
            { label: 'Users', href: '/users', permission: 'manage-users' },
            { label: 'Roles', href: '/roles', permission: 'manage-roles' },
        ],
    },
];

const allGroups = ['Main', 'Cards', 'CRM', 'Tools', 'Admin'];

// Check if a nav item should be visible
const canShow = (item: NavItem): boolean => {
    if (item.superAdminOnly && !isSuperAdmin.value) return false;
    if (item.companyOnly && isSuperAdmin.value) return false;
    if (item.permission && !hasPermission(item.permission)) return false;
    return true;
};

// Filter children based on permissions
const visibleChildren = (children: NavChild[]): NavChild[] => {
    return children.filter(child => {
        if (child.superAdminOnly && !isSuperAdmin.value) return false;
        if (!child.permission) return true;
        return hasPermission(child.permission);
    });
};

const visibleGroups = computed(() =>
    allGroups.filter((g) =>
        navItems.some((i) => {
            if (i.group !== g) return false;
            if (!canShow(i)) return false;
            // For items with children, check if at least one child is visible
            if (i.children) return visibleChildren(i.children).length > 0;
            return true;
        })
    )
);

const navItemsByGroup = (group: string) => navItems.filter((i) => i.group === group);

const isActive = (href: string) =>
    props.currentPath === href ||
    (props.currentPath != null && href !== '/' && props.currentPath.startsWith(href));

const isGroupActive = (children: NavChild[]) =>
    children.some((c) => isActive(c.href));

const openItems = ref<Set<string>>(new Set(
    navItems
        .filter((i) => i.children && i.children.some((c) => isActive(c.href)))
        .map((i) => i.id)
));

function toggleOpen(id: string) {
    if (openItems.value.has(id)) {
        openItems.value.delete(id);
    } else {
        openItems.value.add(id);
    }
}
</script>
