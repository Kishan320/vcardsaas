<template>
    <AppLayout>
        <Head title="Dashboard" />
        <FlashMessage />

        <div class="space-y-6">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p class="text-sm text-gray-500 mt-0.5">{{ greeting }}, {{ user?.name }} — here's your overview.</p>
                </div>
                <div class="flex items-center gap-2">
                    <Link
                        :href="route('vcard-builder.create')"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all active:scale-95"
                    >
                        <Plus :size="16" />
                        Create VCard
                    </Link>
                </div>
            </div>

            <!-- KPI Cards -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div
                    v-for="kpi in kpis"
                    :key="kpi.label"
                    class="bg-white border border-gray-100 rounded-2xl p-5 shadow-card"
                >
                    <div class="flex items-start justify-between mb-3">
                        <div class="w-9 h-9 rounded-xl flex items-center justify-center" :class="kpi.iconBg">
                            <component :is="kpi.icon" :size="18" :class="kpi.iconColor" />
                        </div>
                        <span class="flex items-center gap-0.5 text-green-600 text-xs font-semibold">
                            <TrendingUp :size="10" /> +{{ kpi.growth }}%
                        </span>
                    </div>
                    <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{{ kpi.label }}</p>
                    <p class="text-2xl font-extrabold text-gray-900 tabular-nums mt-1">{{ kpi.value.toLocaleString() }}</p>
                </div>
            </div>

            <!-- Main Grid -->
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <!-- Current Business Card -->
                <div class="xl:col-span-1">
                    <div v-if="currentBusiness" class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                        <div class="p-5 border-b border-gray-100">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {{ currentBusiness.name.charAt(0) }}
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">{{ currentBusiness.name }}</h4>
                                        <p class="text-xs text-gray-500">{{ currentBusiness.slug }}</p>
                                    </div>
                                </div>
                                <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    Live
                                </span>
                            </div>
                        </div>
                        <div class="p-5 space-y-3">
                            <div class="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                                <span class="text-sm text-gray-600">URL</span>
                                <div class="flex items-center gap-2">
                                    <code class="text-xs font-mono text-gray-700">/{{ currentBusiness.slug }}</code>
                                    <button @click="copyLink" class="p-1 hover:bg-gray-200 rounded transition-colors">
                                        <Copy :size="12" class="text-gray-500" />
                                    </button>
                                </div>
                            </div>
                            <div class="grid grid-cols-3 gap-2">
                                <Link
                                    :href="route('vcard-builder.edit', currentBusiness.id)"
                                    class="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Pencil :size="12" /> Edit
                                </Link>
                                <a
                                    :href="`/${currentBusiness.slug}`"
                                    target="_blank"
                                    class="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <ExternalLink :size="12" /> View
                                </a>
                                <Link
                                    :href="route('vcard-builder.index')"
                                    class="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Layers :size="12" /> All
                                </Link>
                            </div>
                        </div>
                    </div>

                    <!-- No business state -->
                    <div v-else class="bg-white border border-gray-100 rounded-2xl shadow-card p-8 text-center">
                        <div class="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CreditCard :size="28" class="text-white" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">No VCard Yet</h3>
                        <p class="text-sm text-gray-500 mb-6">Create your first digital business card to get started.</p>
                        <Link
                            :href="route('vcard-builder.create')"
                            class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90"
                        >
                            <Plus :size="16" /> Create VCard
                        </Link>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="xl:col-span-2">
                    <div class="bg-white border border-gray-100 rounded-2xl shadow-card">
                        <div class="flex items-center justify-between p-5 border-b border-gray-100">
                            <h3 class="font-semibold text-gray-900 flex items-center gap-2">
                                <Clock :size="16" class="text-gray-400" />
                                Recent Activity
                            </h3>
                            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                                {{ recentActivity.length }}
                            </span>
                        </div>
                        <div class="divide-y divide-gray-50">
                            <div
                                v-for="item in recentActivity"
                                :key="item.id"
                                class="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div
                                    class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                    :class="item.type === 'contact' ? 'bg-green-100' : 'bg-purple-100'"
                                >
                                    <MessageSquare v-if="item.type === 'contact'" :size="14" class="text-green-600" />
                                    <CalendarDays v-else :size="14" class="text-purple-600" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-semibold text-gray-900 truncate">{{ item.name }}</p>
                                    <p class="text-xs text-gray-500 truncate">{{ item.subtitle }}</p>
                                </div>
                                <span
                                    v-if="item.status"
                                    class="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                                    :class="{
                                        'bg-green-100 text-green-700': item.status === 'confirmed',
                                        'bg-amber-100 text-amber-700': item.status === 'pending',
                                        'bg-red-100 text-red-700': item.status === 'cancelled',
                                    }"
                                >
                                    {{ item.status }}
                                </span>
                            </div>
                            <div v-if="!recentActivity.length" class="p-8 text-center text-sm text-gray-400">
                                No recent activity
                            </div>
                        </div>
                        <div class="p-4 border-t border-gray-100 grid grid-cols-2 gap-2">
                            <Link
                                :href="route('contacts.index')"
                                class="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <MessageSquare :size="12" /> Contacts
                            </Link>
                            <Link
                                :href="route('appointments.index')"
                                class="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <CalendarDays :size="12" /> Appointments
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import {
    Plus, TrendingUp, CreditCard, MessageSquare, CalendarDays,
    Eye, Layers, Clock, Copy, Pencil, ExternalLink,
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import type { PageProps, Business } from '@/types';

interface DashboardStats {
    totalBusinesses: number;
    totalContacts: number;
    totalAppointments: number;
    totalViews: number;
    monthlyGrowth: number;
}

interface RecentContact {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface RecentAppointment {
    id: number;
    name: string;
    title?: string;
    date: string;
    status: 'confirmed' | 'pending' | 'cancelled';
}

const props = defineProps<{
    dashboardData: {
        stats: DashboardStats;
        recentContacts: RecentContact[];
        recentAppointments: RecentAppointment[];
        topBusinesses: Business[];
    };
}>();

const page = usePage<PageProps>();
const user = computed(() => page.props.auth?.user);

const greeting = computed(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
});

const currentBusiness = computed(() =>
    (user.value as any)?.businesses?.find((b: Business) => b.id === (user.value as any)?.current_business) ??
    (user.value as any)?.businesses?.[0] ?? null,
);

const stats = computed(() => ({
    totalBusinesses: props.dashboardData?.stats?.totalBusinesses ?? 0,
    totalContacts: props.dashboardData?.stats?.totalContacts ?? 0,
    totalAppointments: props.dashboardData?.stats?.totalAppointments ?? 0,
    totalViews: props.dashboardData?.stats?.totalViews ?? 0,
    monthlyGrowth: props.dashboardData?.stats?.monthlyGrowth ?? 0,
}));

const kpis = computed(() => [
    { label: 'Total VCards', value: stats.value.totalBusinesses, icon: CreditCard, iconBg: 'bg-primary-100', iconColor: 'text-primary-600', growth: 12 },
    { label: 'Contacts', value: stats.value.totalContacts, icon: MessageSquare, iconBg: 'bg-green-100', iconColor: 'text-green-600', growth: 8 },
    { label: 'Appointments', value: stats.value.totalAppointments, icon: CalendarDays, iconBg: 'bg-purple-100', iconColor: 'text-purple-600', growth: 5 },
    { label: 'Total Views', value: stats.value.totalViews, icon: Eye, iconBg: 'bg-orange-100', iconColor: 'text-orange-600', growth: 15 },
    { label: 'Monthly Growth', value: stats.value.monthlyGrowth, icon: TrendingUp, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', growth: stats.value.monthlyGrowth },
]);

const recentActivity = computed(() => {
    const contacts = (props.dashboardData?.recentContacts ?? []).map((c) => ({
        id: `c-${c.id}`,
        type: 'contact' as const,
        name: c.name,
        subtitle: c.email,
        status: null,
        date: c.created_at,
    }));
    const appointments = (props.dashboardData?.recentAppointments ?? []).map((a) => ({
        id: `a-${a.id}`,
        type: 'appointment' as const,
        name: a.title ?? a.name,
        subtitle: a.date,
        status: a.status,
        date: a.date,
    }));
    return [...contacts, ...appointments]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);
});

const copyLink = async () => {
    if (!currentBusiness.value) return;
    const url = `${window.location.origin}/${currentBusiness.value.slug}`;
    await navigator.clipboard.writeText(url).catch(() => {});
};
</script>
