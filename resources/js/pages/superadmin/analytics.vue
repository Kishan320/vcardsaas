<template>
    <PageTemplate title="Analytics & Insights" url="/analytics" :breadcrumbs="breadcrumbs">
        <div class="space-y-6">
            <!-- Overview Cards -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Total Companies</p>
                            <h3 class="mt-2 text-2xl font-bold">{{ analytics.overview.totalCompanies }}</h3>
                        </div>
                        <div class="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                            <Building2 class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Total NFC Card Request</p>
                            <h3 class="mt-2 text-2xl font-bold">{{ analytics.overview.totalCardRequest }}</h3>
                        </div>
                        <div class="rounded-full bg-green-100 p-3 dark:bg-green-900">
                            <Nfc class="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Total Revenue</p>
                            <h3 class="mt-2 text-2xl font-bold">{{ formatRevenue(analytics.overview.totalRevenue) }}</h3>
                        </div>
                        <div class="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                            <DollarSign class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Monthly Growth</p>
                            <h3 class="mt-2 text-2xl font-bold">+{{ analytics.overview.monthlyGrowth }}%</h3>
                        </div>
                        <div class="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
                            <TrendingUp class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts -->
            <div class="grid gap-6 lg:grid-cols-2">
                <div class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold flex items-center gap-2">
                            <BarChart3 class="h-4 w-4" /> User Growth
                        </h3>
                    </div>
                    <div class="p-6 pt-2">
                        <div class="h-[300px]">
                            <Line :data="userGrowthData" :options="areaOptions" />
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold flex items-center gap-2">
                            <DollarSign class="h-4 w-4" /> Revenue Growth
                        </h3>
                    </div>
                    <div class="p-6 pt-2">
                        <div class="h-[300px]">
                            <Line :data="revenueChartData" :options="lineOptions" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Plan Distribution -->
            <div class="rounded-xl border bg-card shadow-sm">
                <div class="p-6 pb-2">
                    <h3 class="text-sm font-semibold">Plan Distribution</h3>
                </div>
                <div class="p-6 pt-2">
                    <div class="flex flex-col lg:flex-row items-center gap-8">
                        <div class="flex-1 h-[350px]">
                            <Doughnut :data="planDistributionData" :options="pieOptions" />
                        </div>
                        <div class="flex-1 space-y-6">
                            <div
                                v-for="(plan, index) in analytics.charts.planDistribution"
                                :key="plan.name"
                                class="flex items-center justify-between p-4 rounded-lg border"
                            >
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                        :style="{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }"
                                    />
                                    <span class="text-sm font-medium">{{ plan.name }}</span>
                                </div>
                                <div
                                    class="text-2xl font-bold"
                                    :style="{ color: PIE_COLORS[index % PIE_COLORS.length] }"
                                >
                                    {{ plan.value }}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PageTemplate>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line, Doughnut } from 'vue-chartjs';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend, Filler, ArcElement,
} from 'chart.js';
import { Building2, Nfc, DollarSign, TrendingUp, BarChart3 } from 'lucide-vue-next';
import PageTemplate from '@/components/page-template.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement);

const props = defineProps<{
    analytics: {
        overview: { totalCompanies: number; totalCardRequest: number; totalRevenue: number; monthlyGrowth: number };
        charts: {
            userGrowth: { month: string; users: number }[];
            revenueChart: { month: string; revenue: number }[];
            planDistribution: { name: string; value: number }[];
        };
    };
}>();

const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'System Analytics' },
];

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

function formatRevenue(value: number) {
    return (window as any).appSettings?.formatCurrency?.(value) ?? ('$' + (value ?? 0).toFixed(2));
}

const userGrowthData = computed(() => ({
    labels: props.analytics.charts.userGrowth.map(d => d.month),
    datasets: [{
        label: 'Users',
        data: props.analytics.charts.userGrowth.map(d => d.users),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(59,130,246,0.3)',
        fill: true,
        tension: 0.4,
    }],
}));

const revenueChartData = computed(() => ({
    labels: props.analytics.charts.revenueChart.map(d => d.month),
    datasets: [{
        label: 'Revenue',
        data: props.analytics.charts.revenueChart.map(d => d.revenue),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22,163,74,0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#16a34a',
        tension: 0.4,
    }],
}));

const planDistributionData = computed(() => ({
    labels: props.analytics.charts.planDistribution.map(d => d.name),
    datasets: [{
        data: props.analytics.charts.planDistribution.map(d => d.value),
        backgroundColor: PIE_COLORS,
        borderWidth: 2,
        borderColor: '#fff',
    }],
}));

const baseOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
const areaOptions = { ...baseOptions };
const lineOptions = { ...baseOptions };
const pieOptions = { ...baseOptions, plugins: { legend: { display: true, position: 'bottom' as const } } };
</script>
