<template>
    <div class="flex flex-col h-full min-h-0">
        <!-- Logo -->
        <template v-if="!hideLogo">
            <div v-if="!collapsed" class="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
                <div class="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                    <CreditCard :size="16" class="text-white" />
                </div>
                <span class="font-bold text-gray-900 text-lg tracking-tight">VCard SaaS</span>
            </div>
            <div v-else class="flex items-center justify-center py-4 border-b border-gray-100">
                <div class="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                    <CreditCard :size="16" class="text-white" />
                </div>
            </div>
        </template>

        <!-- Nav -->
        <nav class="flex-1 min-h-0 overflow-y-auto scrollbar-thin py-3 px-2">
            <div v-for="group in visibleGroups" :key="group" class="mb-4">
                <p v-if="!collapsed" class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-1.5">
                    {{ group }}
                </p>
                <div v-else class="border-t border-gray-100 my-2 mx-1" />
                <template v-for="item in navItemsByGroup(group)" :key="item.id">
                    <!-- Item with children (collapsible) -->
                    <div v-if="canShow(item) && item.children">
                        <button
                            @click="toggleOpen(item.id)"
                            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 relative group"
                            :class="[
                                isGroupActive(item.children)
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                collapsed ? 'justify-center' : '',
                            ]"
                        >
                            <span
                                class="flex-shrink-0"
                                :class="isGroupActive(item.children) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'"
                            >
                                <component :is="item.icon" :size="18" />
                            </span>
                            <span v-if="!collapsed" class="flex-1 truncate text-left">{{ item.label }}</span>
                            <ChevronDown
                                v-if="!collapsed"
                                :size="14"
                                class="flex-shrink-0 transition-transform duration-200"
                                :class="openItems.has(item.id) ? 'rotate-180' : ''"
                            />
                            <!-- Tooltip when collapsed -->
                            <div
                                v-if="collapsed"
                                class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                            >
                                {{ item.label }}
                                <div class="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                            </div>
                        </button>
                        <!-- Children -->
                        <div v-if="!collapsed && openItems.has(item.id)" class="ml-4 pl-3 border-l border-gray-100 mt-0.5 mb-1 space-y-0.5">
                            <Link
                                v-for="child in item.children" :key="child.href"
                                :href="child.href"
                                :target="child.target"
                                class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                                :class="isActive(child.href) ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
                            >
                                <ExternalLink v-if="child.target === '_blank'" :size="13" class="flex-shrink-0 opacity-60" />
                                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-40 flex-shrink-0" v-else />
                                {{ child.label }}
                            </Link>
                        </div>
                    </div>
                    <!-- Regular flat item -->
                    <Link
                        v-else-if="canShow(item)"
                        :href="item.href"
                        class="flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 relative group"
                        :class="[
                            isActive(item.href)
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            collapsed ? 'justify-center' : '',
                        ]"
                    >
                        <span
                            class="flex-shrink-0"
                            :class="isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'"
                        >
                            <component :is="item.icon" :size="18" />
                        </span>
                        <span v-if="!collapsed" class="flex-1 truncate">{{ item.label }}</span>
                        <!-- Tooltip when collapsed -->
                        <div
                            v-if="collapsed"
                            class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                        >
                            {{ item.label }}
                            <div class="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                        </div>
                    </Link>
                </template>
            </div>
        </nav>

        <!-- Bottom user -->
        <div v-if="!collapsed" class="border-t border-gray-100 p-3">
            <div class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {{ initials }}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-900 truncate">{{ user?.name }}</p>
                    <p class="text-xs text-gray-400 truncate">{{ user?.email }}</p>
                </div>
                <ChevronRight :size="14" class="text-gray-400" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import {
    LayoutDashboard, CreditCard, Users, Shield, Key, BarChart3,
    Calendar, Phone, Package, DollarSign, Globe, Settings,
    FileText, Link2, Image, Megaphone, ChevronRight, ChevronDown, Layers,
    UserCheck, Wallet, Building2, BookOpen, ExternalLink,
} from 'lucide-vue-next';
import type { PageProps } from '@/types';

const props = defineProps<{
    collapsed: boolean;
    hideLogo?: boolean;
    currentPath?: string;
}>();

const page = usePage<PageProps>();
const user = computed(() => page.props.auth?.user);
const initials = computed(() => {
    const name = user.value?.name ?? '';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
});

const isSuperAdmin = computed(() =>
    !!(user.value?.is_super_admin || user.value?.type === 'superadmin' || user.value?.type === 'super admin'),
);

interface NavChild {
    label: string;
    href: string;
    target?: string;
}

interface NavItem {
    id: string;
    label: string;
    icon: unknown;
    href?: string;
    group: string;
    superAdminOnly?: boolean;
    permission?: string;
    children?: NavChild[];
}

const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', group: 'Overview' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics', group: 'Overview' },
    {
        id: 'business-directory',
        label: 'Business Directory',
        icon: BookOpen,
        group: 'Overview',
        superAdminOnly: true,
        children: [
            { label: 'View Directory', href: '/directory', target: '_blank' },
            { label: 'Directory Settings', href: '/directory/settings' },
            { label: 'Custom Pages', href: '/directory/custom-pages' },
        ],
    },
    { id: 'vcard-builder', label: 'VCard Builder', icon: CreditCard, href: '/vcard-builder', group: 'Cards' },
    { id: 'link-bio', label: 'Link in Bio', icon: Link2, href: '/link-bio-builder', group: 'Cards' },
    {
        id: 'nfc-cards',
        label: 'NFC Cards',
        icon: Layers,
        group: 'Cards',
        children: [
            { label: 'NFC Cards', href: '/nfc-cards' },
            { label: 'Order Requests', href: '/nfc-cards-request' },
        ],
    },
    { id: 'contacts', label: 'Contacts', icon: Phone, href: '/contacts', group: 'CRM' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, href: '/appointments', group: 'CRM' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/calendar', group: 'CRM' },
    {
        id: 'campaigns',
        label: 'Campaigns',
        icon: Megaphone,
        group: 'Marketing',
        children: [
            { label: 'All Campaigns', href: '/campaigns' },
            { label: 'Settings', href: '/campaigns/settings' },
        ],
    },
    {
        id: 'plans',
        label: 'Plans',
        icon: Package,
        group: 'Billing',
        children: [
            { label: 'Plans', href: '/plans' },
            { label: 'Plan Requests', href: '/plan-requests' },
            { label: 'Plan Orders', href: '/plan-orders' },
            { label: 'Coupons', href: '/coupons' },
        ],
    },
    { id: 'currencies', label: 'Currencies', icon: DollarSign, href: '/currencies', group: 'Billing' },
    { id: 'users', label: 'Users', icon: Users, href: '/users', group: 'Admin', superAdminOnly: true },
    { id: 'companies', label: 'Companies', icon: Building2, href: '/companies', group: 'Admin', superAdminOnly: true },
    { id: 'roles', label: 'Roles', icon: UserCheck, href: '/roles', group: 'Admin', superAdminOnly: true },
    { id: 'permissions', label: 'Permissions', icon: Key, href: '/permissions', group: 'Admin', superAdminOnly: true },
    { id: 'domain-requests', label: 'Domain Requests', icon: Globe, href: '/domain-requests', group: 'Admin', superAdminOnly: true },
    { id: 'referral', label: 'Referral', icon: Wallet, href: '/referral', group: 'Admin', superAdminOnly: true },
    { id: 'addons', label: 'Addons', icon: Package, href: '/addons', group: 'Admin', superAdminOnly: true },
    { id: 'email-templates', label: 'Email Templates', icon: FileText, href: '/email-templates', group: 'Admin', superAdminOnly: true },
    { id: 'media-library', label: 'Media Library', icon: Image, href: '/media-library', group: 'Tools' },
    { id: 'google-wallet', label: 'Google Wallet', icon: Wallet, href: '/google-wallet', group: 'Tools' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings', group: 'System' },
    { id: 'landing-page', label: 'Landing Page', icon: Globe, href: '/landing-page/settings', group: 'System', superAdminOnly: true },
];

const allGroups = ['Overview', 'Cards', 'CRM', 'Marketing', 'Billing', 'Admin', 'Tools', 'System'];

const canShow = (item: NavItem) => {
    if (item.superAdminOnly && !isSuperAdmin.value) return false;
    return true;
};

const visibleGroups = computed(() =>
    allGroups.filter((g) => navItems.some((i) => i.group === g && canShow(i))),
);

const navItemsByGroup = (group: string) => navItems.filter((i) => i.group === group);

const isActive = (href: string) =>
    props.currentPath === href ||
    (props.currentPath != null && href !== '/' && props.currentPath.startsWith(href));

const isGroupActive = (children: NavChild[]) =>
    children.some((c) => isActive(c.href));

// Auto-open groups that have an active child
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
