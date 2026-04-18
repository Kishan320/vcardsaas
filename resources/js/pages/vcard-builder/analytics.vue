<template>
    <PageTemplate
        :title="`${business?.name} - Analytics`"
        :url="route('vcard-builder.analytics', business?.slug)"
        :actions="pageActions"
        :breadcrumbs="breadcrumbs"
    >
        <div class="space-y-6">
            <!-- Date Range -->
            <div class="rounded-xl border bg-card shadow-sm">
                <div class="p-6 pb-2"><h3 class="text-sm font-semibold">Date Range</h3></div>
                <div class="p-6 pt-2">
                    <div class="flex flex-col sm:flex-row gap-4 items-end">
                        <div class="space-y-1">
                            <label class="text-sm font-medium">Start Date</label>
                            <input type="date" v-model="startDate" class="block border rounded-md px-3 py-1.5 text-sm" />
                        </div>
                        <div class="space-y-1">
                            <label class="text-sm font-medium">End Date</label>
                            <input type="date" v-model="endDate" class="block border rounded-md px-3 py-1.5 text-sm" />
                        </div>
                        <button
                            @click="applyDateRange"
                            :disabled="isLoading"
                            class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50"
                        >
                            {{ isLoading ? 'Loading...' : 'Apply' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Key Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Page Views</p>
                            <h3 class="mt-2 text-2xl font-bold">{{ analytics.pageViews }}</h3>
                        </div>
                        <div class="rounded-full bg-blue-100 p-3"><Eye class="h-5 w-5 text-blue-600" /></div>
                    </div>
                </div>
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                            <h3 class="mt-2 text-2xl font-bold">{{ analytics.uniqueVisitors }}</h3>
                        </div>
                        <div class="rounded-full bg-purple-100 p-3"><Users class="h-5 w-5 text-purple-600" /></div>
                    </div>
                </div>
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Contact Submissions</p>
                            <h3 class="mt-2 text-2xl font-bold">{{ analytics.contactSubmissions }}</h3>
                        </div>
                        <div class="rounded-full bg-green-100 p-3"><MessageSquare class="h-5 w-5 text-green-600" /></div>
                    </div>
                </div>
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Total Appointments</p>
                            <h3 class="mt-2 text-2xl font-bold">{{ analytics.appointments?.total || 0 }}</h3>
                        </div>
                        <div class="rounded-full bg-amber-100 p-3"><Calendar class="h-5 w-5 text-amber-600" /></div>
                    </div>
                </div>
            </div>

            <!-- Appointment Status Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <p class="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                        <CheckCircle class="h-4 w-4 text-green-500" /> Completed
                    </p>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xl font-bold text-green-600">{{ analytics.appointments?.completed || 0 }}</span>
                        <span class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">
                            {{ apptPct('completed') }}%
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" :style="{ width: apptPct('completed') + '%' }" />
                    </div>
                </div>
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <p class="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                        <AlertCircle class="h-4 w-4 text-amber-500" /> Pending
                    </p>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xl font-bold text-amber-600">{{ analytics.appointments?.pending || 0 }}</span>
                        <span class="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            {{ apptPct('pending') }}%
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-amber-500 h-2 rounded-full" :style="{ width: apptPct('pending') + '%' }" />
                    </div>
                </div>
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <p class="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                        <XCircle class="h-4 w-4 text-red-500" /> Cancelled
                    </p>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xl font-bold text-red-600">{{ analytics.appointments?.cancelled || 0 }}</span>
                        <span class="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                            {{ apptPct('cancelled') }}%
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-red-500 h-2 rounded-full" :style="{ width: apptPct('cancelled') + '%' }" />
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div>
                <div class="flex gap-1 mb-4 overflow-x-auto border-b">
                    <button
                        v-for="tab in tabs" :key="tab.key"
                        @click="activeTab = tab.key"
                        class="px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
                        :class="activeTab === tab.key ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'"
                    >{{ tab.label }}</button>
                </div>

                <!-- Traffic -->
                <div v-if="activeTab === 'traffic'" class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold">Daily Page Views</h3>
                        <p class="text-xs text-muted-foreground">Page views over the selected time period</p>
                    </div>
                    <div class="p-6 pt-2 h-[300px]">
                        <Line :data="trafficChartData" :options="chartOptions" />
                    </div>
                </div>

                <!-- Devices -->
                <div v-if="activeTab === 'devices'" class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold">Device Types</h3>
                        <p class="text-xs text-muted-foreground">Breakdown of visitors by device type</p>
                    </div>
                    <div class="p-6 pt-2 h-[300px]">
                        <Pie :data="deviceChartData" :options="pieChartOptions" />
                    </div>
                </div>

                <!-- Platforms -->
                <div v-if="activeTab === 'platforms'" class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold">Operating Systems</h3>
                        <p class="text-xs text-muted-foreground">Breakdown of visitors by operating system</p>
                    </div>
                    <div class="p-6 pt-2 h-[300px]">
                        <Pie :data="platformChartData" :options="pieChartOptions" />
                    </div>
                </div>

                <!-- Browsers -->
                <div v-if="activeTab === 'browsers'" class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold">Web Browsers</h3>
                        <p class="text-xs text-muted-foreground">Breakdown of visitors by web browser</p>
                    </div>
                    <div class="p-6 pt-2 h-[300px]">
                        <Bar :data="browserChartData" :options="barChartOptions" />
                    </div>
                </div>

                <!-- Referrers -->
                <div v-if="activeTab === 'referrers'" class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold">Top Referrers</h3>
                        <p class="text-xs text-muted-foreground">Sources of traffic to your business card</p>
                    </div>
                    <div class="p-6 pt-2 h-[300px]">
                        <Bar :data="referrerChartData" :options="barChartOptions" />
                    </div>
                </div>

                <!-- Appointments -->
                <div v-if="activeTab === 'appointments'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="rounded-xl border bg-card shadow-sm">
                        <div class="p-6 pb-2">
                            <h3 class="text-sm font-semibold">Appointment Status Distribution</h3>
                            <p class="text-xs text-muted-foreground">Breakdown of appointments by status</p>
                        </div>
                        <div class="p-6 pt-2 h-[300px]">
                            <Pie :data="apptStatusChartData" :options="pieChartOptions" />
                        </div>
                    </div>
                    <div class="rounded-xl border bg-card shadow-sm">
                        <div class="p-6 pb-2">
                            <h3 class="text-sm font-semibold">Daily Appointments</h3>
                            <p class="text-xs text-muted-foreground">Number of appointments per day</p>
                        </div>
                        <div class="p-6 pt-2 h-[300px]">
                            <Line :data="dailyApptChartData" :options="chartOptions" />
                        </div>
                    </div>
                    <div class="rounded-xl border bg-card shadow-sm lg:col-span-2">
                        <div class="p-6 pb-2">
                            <h3 class="text-sm font-semibold">Popular Appointment Times</h3>
                            <p class="text-xs text-muted-foreground">Most frequently booked time slots</p>
                        </div>
                        <div class="p-6 pt-2 h-[300px]">
                            <Bar :data="popularTimesChartData" :options="barChartOptions" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PageTemplate>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import { Line, Bar, Pie } from 'vue-chartjs';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, Filler, ArcElement,
} from 'chart.js';
import { ArrowLeft, Eye, Users, MessageSquare, Calendar, CheckCircle, AlertCircle, XCircle } from 'lucide-vue-next';
import PageTemplate from '@/components/page-template.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, ArcElement);

const props = defineProps<{
    business?: any;
    analytics: any;
    filters?: { start_date?: string; end_date?: string };
}>();

const COLORS = ['#3b82f6', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const STATUS_COLORS: Record<string, string> = { completed: '#10b981', pending: '#f59e0b', cancelled: '#ef4444' };

const activeTab = ref('traffic');
const isLoading = ref(false);
const startDate = ref(props.filters?.start_date ?? props.analytics?.startDate ?? '');
const endDate = ref(props.filters?.end_date ?? props.analytics?.endDate ?? '');

const tabs = [
    { key: 'traffic', label: 'Traffic' },
    { key: 'devices', label: 'Devices' },
    { key: 'platforms', label: 'Platforms' },
    { key: 'browsers', label: 'Browsers' },
    { key: 'referrers', label: 'Referrers' },
    { key: 'appointments', label: 'Appointments' },
];

const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'vCard Builder', href: route('vcard-builder.index') },
    { title: props.business?.name ?? 'Business', href: route('vcard-builder.edit', props.business?.id) },
    { title: 'Analytics' },
];

const pageActions = [
    {
        label: 'Back to Businesses',
        icon: ArrowLeft,
        variant: 'outline' as const,
        onClick: () => router.get(route('vcard-builder.index')),
    },
];

function applyDateRange() {
    if (!startDate.value || !endDate.value) return;
    isLoading.value = true;
    router.get(route('vcard-builder.analytics', props.business?.slug), {
        start_date: startDate.value,
        end_date: endDate.value,
    }, { preserveState: true, onFinish: () => (isLoading.value = false) });
}

function apptPct(key: 'completed' | 'pending' | 'cancelled') {
    const total = props.analytics?.appointments?.total || 0;
    if (!total) return 0;
    return Math.round(((props.analytics?.appointments?.[key] || 0) / total) * 100);
}

function formatDate(d: string) {
    const dt = new Date(d);
    return `${dt.getMonth() + 1}/${dt.getDate()}`;
}

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true } } };
const pieChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const } } };
const barChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true } } };

const trafficChartData = computed(() => ({
    labels: (props.analytics?.dailyPageViews ?? []).map((d: any) => formatDate(d.date)),
    datasets: [{ label: 'Page Views', data: (props.analytics?.dailyPageViews ?? []).map((d: any) => d.views), borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.2)', tension: 0.4 }],
}));

const deviceChartData = computed(() => {
    const items = props.analytics?.devices?.length ? props.analytics.devices : [{ device_type: 'No Data', count: 1 }];
    return {
        labels: items.map((d: any) => d.device_type || 'Unknown'),
        datasets: [{ data: items.map((d: any) => d.count), backgroundColor: COLORS }],
    };
});

const platformChartData = computed(() => {
    const items = props.analytics?.platforms?.length ? props.analytics.platforms : [{ platform_name: 'No Data', count: 1 }];
    return {
        labels: items.map((d: any) => d.platform_name || 'Unknown'),
        datasets: [{ data: items.map((d: any) => d.count), backgroundColor: COLORS }],
    };
});

const browserChartData = computed(() => {
    const items = props.analytics?.browsers?.length ? props.analytics.browsers : [{ browser_name: 'No Data', count: 1 }];
    return {
        labels: items.map((d: any) => d.browser_name || 'Unknown'),
        datasets: [{ label: 'Visits', data: items.map((d: any) => d.count), backgroundColor: COLORS }],
    };
});

const referrerChartData = computed(() => {
    const items = props.analytics?.referrers?.length ? props.analytics.referrers : [{ referrer: 'No Data', count: 1 }];
    return {
        labels: items.map((d: any) => d.referrer || 'Direct'),
        datasets: [{ label: 'Visits', data: items.map((d: any) => d.count), backgroundColor: COLORS }],
    };
});

const apptStatusChartData = computed(() => {
    const items = props.analytics?.appointments?.statuses?.length
        ? props.analytics.appointments.statuses
        : [{ status: 'No Data', count: 1 }];
    return {
        labels: items.map((d: any) => d.status),
        datasets: [{ data: items.map((d: any) => d.count), backgroundColor: items.map((d: any) => STATUS_COLORS[d.status?.toLowerCase()] ?? COLORS[0]) }],
    };
});

const dailyApptChartData = computed(() => ({
    labels: (props.analytics?.appointments?.daily ?? []).map((d: any) => formatDate(d.date)),
    datasets: [{ label: 'Appointments', data: (props.analytics?.appointments?.daily ?? []).map((d: any) => d.appointments), borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.2)', tension: 0.4 }],
}));

const popularTimesChartData = computed(() => ({
    labels: (props.analytics?.appointments?.popularTimes ?? []).map((d: any) => d.time),
    datasets: [{ label: 'Bookings', data: (props.analytics?.appointments?.popularTimes ?? []).map((d: any) => d.count), backgroundColor: COLORS }],
}));
</script>
