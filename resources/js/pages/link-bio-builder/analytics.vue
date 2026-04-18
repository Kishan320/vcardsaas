<template>
    <PageTemplate
        :title="`${bioLink?.name} - Analytics`"
        :url="route('link-bio-builder.analytics', bioLink?.id)"
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
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            <p class="text-sm font-medium text-muted-foreground">Link Type</p>
                            <h3 class="mt-2 text-lg font-bold">
                                <span class="px-2.5 py-0.5 rounded-full border text-xs font-semibold capitalize">{{ bioLink?.link_type }}</span>
                            </h3>
                        </div>
                        <div class="rounded-full bg-green-100 p-3"><Globe class="h-5 w-5 text-green-600" /></div>
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

                <div v-if="activeTab === 'traffic'" class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold">Daily Page Views</h3>
                        <p class="text-xs text-muted-foreground">Page views over the selected time period</p>
                    </div>
                    <div class="p-6 pt-2 h-[300px]">
                        <Line :data="trafficChartData" :options="chartOptions" />
                    </div>
                </div>

                <div v-if="activeTab === 'devices'" class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold">Device Types</h3>
                        <p class="text-xs text-muted-foreground">Breakdown of visitors by device type</p>
                    </div>
                    <div class="p-6 pt-2 h-[300px]">
                        <Pie :data="deviceChartData" :options="pieOptions" />
                    </div>
                </div>

                <div v-if="activeTab === 'platforms'" class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold">Operating Systems</h3>
                        <p class="text-xs text-muted-foreground">Breakdown of visitors by operating system</p>
                    </div>
                    <div class="p-6 pt-2 h-[300px]">
                        <Pie :data="platformChartData" :options="pieOptions" />
                    </div>
                </div>

                <div v-if="activeTab === 'browsers'" class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold">Web Browsers</h3>
                        <p class="text-xs text-muted-foreground">Breakdown of visitors by web browser</p>
                    </div>
                    <div class="p-6 pt-2 h-[300px]">
                        <Bar :data="browserChartData" :options="barOptions" />
                    </div>
                </div>

                <div v-if="activeTab === 'referrers'" class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold">Top Referrers</h3>
                        <p class="text-xs text-muted-foreground">Sources of traffic to your bio link</p>
                    </div>
                    <div class="p-6 pt-2 h-[300px]">
                        <Bar :data="referrerChartData" :options="barOptions" />
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
import { ArrowLeft, Eye, Users, Globe } from 'lucide-vue-next';
import PageTemplate from '@/components/page-template.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, ArcElement);

const props = defineProps<{
    bioLink?: any;
    analytics: any;
    filters?: { start_date?: string; end_date?: string };
}>();

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
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
];

const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Bio Link Builder', href: route('link-bio-builder.index') },
    { title: props.bioLink?.name ?? 'Bio Link', href: route('link-bio-builder.edit', props.bioLink?.id) },
    { title: 'Analytics' },
];

const pageActions = [
    { label: 'Back to Bio Links', icon: ArrowLeft, variant: 'outline' as const, onClick: () => router.get(route('link-bio-builder.index')) },
];

function applyDateRange() {
    if (!startDate.value || !endDate.value) return;
    isLoading.value = true;
    router.get(route('link-bio-builder.analytics', props.bioLink?.id), {
        start_date: startDate.value, end_date: endDate.value,
    }, { preserveState: true, onFinish: () => (isLoading.value = false) });
}

function formatDate(d: string) {
    const dt = new Date(d);
    return `${dt.getMonth() + 1}/${dt.getDate()}`;
}

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true } } };
const pieOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const } } };
const barOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true } } };

const trafficChartData = computed(() => ({
    labels: (props.analytics?.dailyPageViews ?? []).map((d: any) => formatDate(d.date)),
    datasets: [{ label: 'Page Views', data: (props.analytics?.dailyPageViews ?? []).map((d: any) => d.views), borderColor: '#8884d8', backgroundColor: 'rgba(136,132,216,0.2)', tension: 0.4 }],
}));

const deviceChartData = computed(() => {
    const items = props.analytics?.devices?.length ? props.analytics.devices : [{ device_type: 'No Data', count: 1 }];
    return { labels: items.map((d: any) => d.device_type || 'Unknown'), datasets: [{ data: items.map((d: any) => d.count), backgroundColor: COLORS }] };
});

const platformChartData = computed(() => {
    const items = props.analytics?.platforms?.length ? props.analytics.platforms : [{ platform_name: 'No Data', count: 1 }];
    return { labels: items.map((d: any) => d.platform_name || 'Unknown'), datasets: [{ data: items.map((d: any) => d.count), backgroundColor: COLORS }] };
});

const browserChartData = computed(() => {
    const items = props.analytics?.browsers?.length ? props.analytics.browsers : [{ browser_name: 'No Data', count: 1 }];
    return { labels: items.map((d: any) => d.browser_name || 'Unknown'), datasets: [{ label: 'Visits', data: items.map((d: any) => d.count), backgroundColor: COLORS }] };
});

const referrerChartData = computed(() => {
    const items = props.analytics?.referrers?.length ? props.analytics.referrers : [{ referrer: 'No Data', count: 1 }];
    return { labels: items.map((d: any) => d.referrer || 'Direct'), datasets: [{ label: 'Visits', data: items.map((d: any) => d.count), backgroundColor: COLORS }] };
});
</script>
