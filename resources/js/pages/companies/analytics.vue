<template>
    <PageTemplate title="Analytics & Insights" url="/analytics" :breadcrumbs="breadcrumbs">
        <div class="space-y-6">
            <!-- Controls -->
            <div class="flex justify-between items-center">
                <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {{ analytics.visitor.realtime.currentVisitors }} Online Now
                </span>
                <select v-model="timeRange" class="border rounded-md px-3 py-1.5 text-sm w-32">
                    <option value="1d">Today</option>
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="90d">90 Days</option>
                </select>
            </div>

            <!-- Overview Cards -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Total Visitors</p>
                            <h3 class="mt-2 text-2xl font-bold">{{ analytics.visitor.overview.totalVisitors.toLocaleString() }}</h3>
                        </div>
                        <Users class="h-6 w-6 text-blue-600" />
                    </div>
                </div>
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Today</p>
                            <h3 class="mt-2 text-2xl font-bold">{{ analytics.visitor.overview.todayVisitors.toLocaleString() }}</h3>
                        </div>
                        <Calendar class="h-6 w-6 text-green-600" />
                    </div>
                </div>
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Page Views</p>
                            <h3 class="mt-2 text-2xl font-bold">{{ analytics.visitor.overview.totalPageViews.toLocaleString() }}</h3>
                        </div>
                        <Eye class="h-6 w-6 text-purple-600" />
                    </div>
                </div>
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Avg. Session</p>
                            <h3 class="mt-2 text-2xl font-bold">{{ formatDuration(analytics.visitor.overview.avgSessionDuration) }}</h3>
                        </div>
                        <Clock class="h-6 w-6 text-orange-600" />
                    </div>
                </div>
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                            <h3 class="mt-2 text-2xl font-bold">{{ analytics.visitor.overview.bounceRate }}%</h3>
                        </div>
                        <TrendingUp class="h-6 w-6 text-red-600" />
                    </div>
                </div>
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Contacts</p>
                            <h3 class="mt-2 text-2xl font-bold">{{ analytics.business.totalContacts }}</h3>
                        </div>
                        <MessageSquare class="h-6 w-6 text-indigo-600" />
                    </div>
                </div>
            </div>

            <!-- Main Charts -->
            <div class="grid gap-6 lg:grid-cols-2">
                <div class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold flex items-center gap-2"><TrendingUp class="h-4 w-4" /> Visitor Trends</h3>
                    </div>
                    <div class="p-6 pt-2 h-[300px]">
                        <Line :data="trendChartData" :options="chartOptions" />
                    </div>
                </div>

                <div class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-sm font-semibold flex items-center gap-2"><Globe class="h-4 w-4" /> Geographic Distribution</h3>
                    </div>
                    <div class="p-6 pt-2 h-[300px]">
                        <div v-if="!geoData.length" class="flex items-center justify-center h-full text-muted-foreground text-sm">
                            No geographic data available
                        </div>
                        <Pie v-else :data="geoChartData" :options="pieOptions" />
                    </div>
                </div>
            </div>

            <!-- Device & Browser -->
            <div class="grid gap-6 lg:grid-cols-2">
                <div class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2"><h3 class="text-sm font-semibold flex items-center gap-2"><Smartphone class="h-4 w-4" /> Device Types</h3></div>
                    <div class="p-6 pt-2">
                        <div v-if="!devicesData.length" class="flex items-center justify-center h-[150px] text-muted-foreground text-sm">No device data available</div>
                        <div v-else class="space-y-3">
                            <div v-for="(device, i) in devicesData" :key="i" class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: COLORS[i % COLORS.length] }" />
                                    <span class="text-sm font-medium">{{ device.device }}</span>
                                </div>
                                <div class="text-right">
                                    <span class="text-sm font-bold">{{ device.visitors.toLocaleString() }}</span>
                                    <span class="text-xs text-muted-foreground ml-2">({{ device.percentage }}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2"><h3 class="text-sm font-semibold flex items-center gap-2"><Monitor class="h-4 w-4" /> Browsers</h3></div>
                    <div class="p-6 pt-2">
                        <div v-if="!browsersData.length" class="flex items-center justify-center h-[150px] text-muted-foreground text-sm">No browser data available</div>
                        <div v-else class="space-y-3">
                            <div v-for="(browser, i) in browsersData" :key="i" class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: COLORS[i % COLORS.length] }" />
                                    <span class="text-sm font-medium">{{ browser.browser }}</span>
                                </div>
                                <div class="text-right">
                                    <span class="text-sm font-bold">{{ browser.visitors.toLocaleString() }}</span>
                                    <span class="text-xs text-muted-foreground ml-2">({{ browser.percentage }}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Traffic Sources & Popular Pages -->
            <div class="grid gap-6 lg:grid-cols-2">
                <div class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2"><h3 class="text-sm font-semibold flex items-center gap-2"><Globe class="h-4 w-4" /> Traffic Sources</h3></div>
                    <div class="p-6 pt-2">
                        <div v-if="!referrersData.length" class="flex items-center justify-center h-[150px] text-muted-foreground text-sm">No referrer data available</div>
                        <div v-else class="space-y-3">
                            <div v-for="(ref, i) in referrersData" :key="i" class="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                                <span class="text-sm font-medium">{{ ref.source }}</span>
                                <div class="text-right">
                                    <span class="text-sm font-bold">{{ ref.visitors.toLocaleString() }}</span>
                                    <span class="text-xs text-muted-foreground ml-2">({{ ref.percentage }}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2"><h3 class="text-sm font-semibold flex items-center gap-2"><Eye class="h-4 w-4" /> Popular Pages</h3></div>
                    <div class="p-6 pt-2">
                        <div v-if="!popularPagesData.length" class="flex items-center justify-center h-[150px] text-muted-foreground text-sm">No page view data available</div>
                        <div v-else class="space-y-3">
                            <div v-for="(page, i) in popularPagesData" :key="i" class="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium truncate">{{ page.title || page.url }}</p>
                                    <p class="text-xs text-muted-foreground truncate">{{ page.url }}</p>
                                </div>
                                <span class="text-sm font-bold ml-2">{{ page.views.toLocaleString() }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Real-time Activity -->
            <div class="rounded-xl border bg-card shadow-sm">
                <div class="p-6 pb-2">
                    <h3 class="text-sm font-semibold flex items-center gap-2">
                        <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse" /> Real-time Activity
                    </h3>
                </div>
                <div class="p-6 pt-2">
                    <div class="grid gap-4 md:grid-cols-2">
                        <div>
                            <h4 class="text-sm font-semibold mb-3">Currently Online: {{ analytics.visitor.realtime.currentVisitors }}</h4>
                            <div class="space-y-2">
                                <div v-for="(page, i) in analytics.visitor.realtime.activePages" :key="i"
                                    class="flex justify-between items-center p-2 bg-green-50 rounded">
                                    <span class="text-xs truncate">{{ page.url }}</span>
                                    <span class="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-semibold ml-2">{{ page.visitors }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div class="p-4 border rounded-lg">
                                <h4 class="text-sm font-semibold">Conversion Rate</h4>
                                <p class="text-2xl font-bold text-green-600">{{ analytics.business.conversionRate }}%</p>
                                <p class="text-xs text-muted-foreground">Visitors to contacts</p>
                            </div>
                            <div class="p-4 border rounded-lg">
                                <h4 class="text-sm font-semibold">Total Appointments</h4>
                                <p class="text-2xl font-bold text-blue-600">{{ analytics.business.totalAppointments }}</p>
                                <p class="text-xs text-muted-foreground">Scheduled this period</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PageTemplate>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Line, Pie } from 'vue-chartjs';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend, Filler, ArcElement,
} from 'chart.js';
import { Users, Eye, Calendar, Clock, TrendingUp, MessageSquare, Globe, Smartphone, Monitor } from 'lucide-vue-next';
import PageTemplate from '@/components/page-template.vue';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement);

const props = defineProps<{ analytics: any }>();

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const timeRange = ref('7d');
const geoData = ref<any[]>([]);
const devicesData = ref<any[]>([]);
const browsersData = ref<any[]>([]);
const referrersData = ref<any[]>([]);
const popularPagesData = ref<any[]>([]);

const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Visitor Analytics' },
];

function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    return `${m}m ${seconds % 60}s`;
}

const chartData = computed(() => {
    const trends = props.analytics.visitor.trends;
    if (timeRange.value === '30d') return trends.weekly;
    if (timeRange.value === '90d') return trends.monthly;
    return trends.daily;
});

const trendChartData = computed(() => ({
    labels: chartData.value.map((d: any) => d.date ?? d.week ?? d.month),
    datasets: [
        { label: 'Visitors', data: chartData.value.map((d: any) => d.visitors), borderColor: '#2563eb', backgroundColor: 'rgba(59,130,246,0.3)', fill: true, tension: 0.4 },
        { label: 'Page Views', data: chartData.value.map((d: any) => d.pageViews), borderColor: '#16a34a', backgroundColor: 'rgba(34,197,94,0.2)', fill: true, tension: 0.4 },
    ],
}));

const geoChartData = computed(() => ({
    labels: geoData.value.slice(0, 5).map((d: any) => d.country),
    datasets: [{ data: geoData.value.slice(0, 5).map((d: any) => d.visitors), backgroundColor: COLORS }],
}));

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true } } };
const pieOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const } } };

async function loadSection(section: string) {
    try {
        const res = await axios.get(route('analytics'), { params: { section, range: timeRange.value }, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
        const data = res.data?.data ?? [];
        if (section === 'geographic') geoData.value = data;
        else if (section === 'devices') devicesData.value = data;
        else if (section === 'browsers') browsersData.value = data;
        else if (section === 'referrers') referrersData.value = data;
        else if (section === 'popularPages') popularPagesData.value = data;
    } catch {}
}

async function loadAll() {
    for (const s of ['geographic', 'devices', 'browsers', 'referrers', 'popularPages']) {
        await loadSection(s);
    }
}

let realtimeInterval: ReturnType<typeof setInterval>;
onMounted(() => {
    loadAll();
    realtimeInterval = setInterval(async () => {
        try {
            const res = await axios.get(route('analytics.realtime'));
            if (res.data?.analytics?.visitor?.realtime) {
                props.analytics.visitor.realtime = res.data.analytics.visitor.realtime;
            }
        } catch {}
    }, 60000);
});
onUnmounted(() => clearInterval(realtimeInterval));
</script>
