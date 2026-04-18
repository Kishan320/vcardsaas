<template>
    <PageTemplate title="Dashboard" url="/dashboard" :actions="pageActions" :noPadding="true">
        <div class="space-y-6">
            <!-- Key Metrics -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">Active Plans</p>
                                <h3 class="mt-2 text-2xl font-bold">{{ stats.activePlans.toLocaleString() }}</h3>
                            </div>
                            <div class="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                                <CreditCard class="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">Pending Requests</p>
                                <h3 class="mt-2 text-2xl font-bold">{{ stats.pendingRequests.toLocaleString() }}</h3>
                            </div>
                            <div class="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                                <AlertCircle class="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">Monthly Growth</p>
                                <h3 class="mt-2 text-2xl font-bold">+{{ stats.monthlyGrowth }}%</h3>
                            </div>
                            <div class="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
                                <TrendingUp class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">Total Companies</p>
                                <h3 class="mt-2 text-2xl font-bold">{{ stats.totalCompanies.toLocaleString() }}</h3>
                            </div>
                            <div class="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                                <Building2 class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">NFC Cards</p>
                                <h3 class="mt-2 text-2xl font-bold">{{ (stats.totalNfcCards ?? 0).toLocaleString() }}</h3>
                            </div>
                            <div class="rounded-full bg-green-100 p-3 dark:bg-green-900">
                                <Nfc class="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                <h3 class="mt-2 text-2xl font-bold">{{ formatRevenue(stats.totalRevenue) }}</h3>
                            </div>
                            <div class="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                                <DollarSign class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity + Top Plans -->
            <div class="grid gap-6 lg:grid-cols-2">
                <!-- Recent Activity -->
                <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div class="flex flex-col space-y-1.5 p-6">
                        <h3 class="text-lg font-semibold flex items-center gap-2">
                            <Activity class="h-5 w-5" />
                            Recent Activity
                        </h3>
                    </div>
                    <div class="p-6 pt-0">
                        <div class="space-y-4">
                            <div
                                v-for="activity in recentActivity"
                                :key="activity.id"
                                class="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                            >
                                <div
                                    class="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                                    :class="{
                                        'bg-green-500': activity.status === 'success',
                                        'bg-yellow-500': activity.status === 'warning',
                                        'bg-red-500': activity.status === 'error',
                                    }"
                                />
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium">{{ activity.message }}</p>
                                    <p class="text-xs text-muted-foreground">{{ activity.time }}</p>
                                </div>
                                <span
                                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                    :class="activity.status === 'success' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'"
                                >
                                    {{ activity.type }}
                                </span>
                            </div>
                            <div v-if="!recentActivity.length" class="text-sm text-muted-foreground text-center py-4">
                                No recent activity
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Performing Plans -->
                <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div class="flex flex-col space-y-1.5 p-6">
                        <h3 class="text-lg font-semibold flex items-center gap-2">
                            <Ticket class="h-5 w-5" />
                            Top Performing Plans
                        </h3>
                    </div>
                    <div class="p-6 pt-0">
                        <div class="space-y-4">
                            <div
                                v-for="(plan, index) in topPlans"
                                :key="plan.name"
                                class="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                            >
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span class="text-sm font-bold text-primary">#{{ index + 1 }}</span>
                                    </div>
                                    <div>
                                        <p class="font-medium">{{ plan.name }}</p>
                                        <p class="text-sm text-muted-foreground">{{ plan.subscribers }} subscribers</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-semibold">{{ formatRevenue(plan.revenue) }}</p>
                                    <p class="text-xs text-muted-foreground">revenue</p>
                                </div>
                            </div>
                            <div v-if="!topPlans.length" class="text-sm text-muted-foreground text-center py-4">
                                No plan data
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Features Overview -->
            <div class="rounded-xl border-2 border-dashed border-primary/20 bg-card text-card-foreground shadow-sm">
                <div class="p-6 text-center">
                    <div class="flex items-center justify-center gap-2 mb-2">
                        <Sparkles class="h-6 w-6 text-primary" />
                        <h2 class="text-2xl font-semibold">Features</h2>
                    </div>
                    <p class="text-muted-foreground">Comprehensive system management and oversight tools</p>
                </div>
                <div class="p-6 pt-0">
                    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div v-for="feature in features" :key="feature.title" class="group relative">
                            <div class="rounded-xl border bg-card h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                                <div class="p-6">
                                    <div class="flex items-start justify-between mb-4">
                                        <div class="rounded-full p-3" :class="feature.iconClass">
                                            <component :is="feature.icon" class="h-6 w-6" />
                                        </div>
                                        <span class="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold">
                                            {{ feature.count }}
                                        </span>
                                    </div>
                                    <h3 class="font-semibold mb-2 group-hover:text-primary transition-colors">{{ feature.title }}</h3>
                                    <p class="text-sm text-muted-foreground mb-4">{{ feature.description }}</p>
                                    <Link
                                        :href="feature.href"
                                        class="inline-flex items-center justify-between w-full px-3 py-1.5 text-sm rounded-md hover:bg-primary/10 transition-colors group-hover:bg-primary/10"
                                    >
                                        Explore
                                        <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom growth badge -->
                    <div class="mt-8 text-center">
                        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                            <TrendingUp class="h-4 w-4" />
                            <span class="text-sm font-medium">System growing at {{ stats.monthlyGrowth }}% monthly</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PageTemplate>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import { Link, router } from '@inertiajs/vue3';
import {
    RefreshCw, BarChart3, Download, Nfc, Building2, CreditCard,
    Ticket, DollarSign, TrendingUp, Activity, AlertCircle, Sparkles, ArrowRight,
} from 'lucide-vue-next';
import PageTemplate from '@/components/page-template.vue';

const props = defineProps<{
    dashboardData: {
        stats: {
            totalCompanies: number;
            totalNfcCards: number;
            totalRevenue: number;
            activePlans: number;
            pendingRequests: number;
            monthlyGrowth: number;
        };
        recentActivity: { id: string; type: string; message: string; time: string; status: string }[];
        topPlans: { name: string; subscribers: number; revenue: number }[];
    };
}>();

const isRefreshing = ref(false);
const isExporting = ref(false);

const stats = computed(() => props.dashboardData?.stats ?? {
    totalCompanies: 0, totalNfcCards: 0, totalRevenue: 0,
    activePlans: 0, pendingRequests: 0, monthlyGrowth: 0,
});

const recentActivity = computed(() => props.dashboardData?.recentActivity ?? []);
const topPlans = computed(() => props.dashboardData?.topPlans ?? []);

function formatRevenue(value: number) {
    return (window as any).appSettings?.formatCurrency?.(value) ?? ('$' + (value ?? 0).toFixed(2));
}

const features = computed(() => [
    {
        title: 'Company Management',
        description: 'Manage all registered companies and their subscriptions',
        icon: Building2,
        iconClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
        href: route('companies.index'),
        count: stats.value.totalCompanies,
    },
    {
        title: 'Plan Management',
        description: 'Create and manage subscription plans',
        icon: CreditCard,
        iconClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
        href: route('plans.index'),
        count: stats.value.activePlans,
    },
    {
        title: 'NFC Cards',
        description: 'Manage NFC cards and order requests',
        icon: Nfc,
        iconClass: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
        href: route('nfc-cards.index'),
        count: stats.value.totalNfcCards,
    },
    {
        title: 'System Analytics',
        description: 'Monitor system performance and growth',
        icon: BarChart3,
        iconClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400',
        href: route('analytics'),
        count: `+${stats.value.monthlyGrowth}%`,
    },
]);

const pageActions = computed(() => [
    {
        label: 'Refresh',
        icon: RefreshCw,
        variant: 'outline' as const,
        onClick: () => {
            isRefreshing.value = true;
            router.reload({ only: ['dashboardData'] });
            setTimeout(() => (isRefreshing.value = false), 1000);
        },
    },
    {
        label: 'Analytics',
        icon: BarChart3,
        variant: 'outline' as const,
        onClick: () => router.visit(route('analytics')),
    },
    {
        label: isExporting.value ? 'Exporting...' : 'Export Report',
        icon: Download,
        variant: 'default' as const,
        onClick: async () => {
            isExporting.value = true;
            try {
                const response = await axios.get(route('dashboard.export-report'), {
                    headers: { Accept: 'application/pdf' },
                    responseType: 'blob',
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } finally {
                isExporting.value = false;
            }
        },
    },
]);
</script>
