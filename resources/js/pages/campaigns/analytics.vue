<template>
    <PageTemplate
        :title="`Campaign Analytics: ${campaign.name}`"
        :url="`/campaigns/${campaign.id}/analytics`"
        :breadcrumbs="breadcrumbs"
    >
        <div class="space-y-8">
            <!-- Campaign Header -->
            <div class="bg-white rounded-xl border border-gray-200 p-8">
                <div class="flex items-start justify-between mb-6">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ campaign.name }}</h1>
                        <p class="text-gray-600 text-lg">{{ campaign.description || 'No description provided' }}</p>
                    </div>
                    <span class="px-4 py-2 text-sm font-medium border rounded-full" :class="statusClass(campaign.status)">
                        {{ capitalize(campaign.status) }}
                    </span>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <Users class="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <p class="text-sm text-gray-600 mb-1">Company</p>
                        <p class="font-semibold text-gray-900">{{ campaign.user?.name }}</p>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <Building2 class="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <p class="text-sm text-gray-600 mb-1">Business</p>
                        <p class="font-semibold text-gray-900">{{ campaign.business?.name }}</p>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <Target class="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <p class="text-sm text-gray-600 mb-1">Category</p>
                        <p class="font-semibold text-gray-900">{{ campaign.category?.name }}</p>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <Calendar class="h-6 w-6 text-gray-600 mx-auto mb-2" />
                        <p class="text-sm text-gray-600 mb-1">Duration</p>
                        <p class="font-semibold text-gray-900">{{ campaign.total_days }} days</p>
                    </div>
                </div>
            </div>

            <!-- Key Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-sm font-medium text-gray-600">Total Revenue</p>
                        <DollarSign class="h-5 w-5 text-emerald-600" />
                    </div>
                    <div class="text-3xl font-bold text-gray-900 mb-1">{{ currencySymbol }}{{ metrics.total_revenue }}</div>
                    <p class="text-sm text-gray-600">{{ currencySymbol }}{{ Number(metrics.cost_per_day).toFixed(2) }} per day</p>
                </div>
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-sm font-medium text-gray-600">Progress</p>
                        <Activity class="h-5 w-5 text-blue-600" />
                    </div>
                    <div class="text-3xl font-bold text-gray-900 mb-3">{{ metrics.progress_percentage }}%</div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full" :style="{ width: metrics.progress_percentage + '%' }" />
                    </div>
                </div>
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-sm font-medium text-gray-600">Days Remaining</p>
                        <Clock class="h-5 w-5 text-amber-600" />
                    </div>
                    <div class="text-3xl font-bold text-gray-900 mb-1">{{ metrics.days_remaining }}</div>
                    <p class="text-sm text-gray-600">Until completion</p>
                </div>
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <div class="flex items-center justify-between mb-3">
                        <p class="text-sm font-medium text-gray-600">ROI Estimate</p>
                        <TrendingUp class="h-5 w-5 text-purple-600" />
                    </div>
                    <div class="text-3xl font-bold text-gray-900 mb-1">{{ metrics.roi_estimate.roi_percentage }}%</div>
                    <p class="text-sm text-gray-600">{{ currencySymbol }}{{ metrics.roi_estimate.estimated_return }} expected</p>
                </div>
            </div>

            <!-- Timeline -->
            <div class="rounded-xl border bg-card shadow-sm">
                <div class="p-6 pb-2">
                    <h3 class="text-lg font-semibold flex items-center gap-2"><Calendar class="h-5 w-5 text-gray-600" /> Campaign Timeline</h3>
                </div>
                <div class="p-6 pt-2 space-y-6">
                    <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div>
                            <p class="font-semibold text-blue-900">Start Date</p>
                            <p class="text-blue-700">{{ formatDate(campaign.start_date) }}</p>
                        </div>
                        <ArrowUpRight class="h-6 w-6 text-blue-600" />
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div class="bg-blue-600 h-3 rounded-full transition-all duration-500" :style="{ width: metrics.progress_percentage + '%' }" />
                    </div>
                    <div class="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div>
                            <p class="font-semibold text-emerald-900">End Date</p>
                            <p class="text-emerald-700">{{ formatDate(campaign.end_date) }}</p>
                        </div>
                        <Target class="h-6 w-6 text-emerald-600" />
                    </div>
                </div>
            </div>

            <!-- Performance -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="rounded-xl border bg-card shadow-sm p-6">
                    <h3 class="text-lg font-semibold flex items-center gap-2 mb-1"><BarChart3 class="h-5 w-5 text-gray-600" /> Category Performance</h3>
                    <p class="text-sm text-muted-foreground">Compared to other campaigns in {{ campaign.category?.name }}</p>
                </div>
                <div class="rounded-xl border bg-card shadow-sm">
                    <div class="p-6 pb-2">
                        <h3 class="text-lg font-semibold flex items-center gap-2"><Building2 class="h-5 w-5 text-gray-600" /> Business Performance</h3>
                        <p class="text-sm text-muted-foreground">Performance for {{ campaign.business?.name }}</p>
                    </div>
                    <div class="p-6 pt-2 space-y-4">
                        <div class="flex justify-between items-center py-2">
                            <span class="text-gray-600">Total Campaigns</span>
                            <span class="font-semibold">{{ businessStats?.total_campaigns || 0 }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2 bg-emerald-50 px-3 rounded">
                            <span class="text-emerald-700 font-medium">Total Revenue</span>
                            <span class="font-bold text-emerald-900">{{ currencySymbol }}{{ businessStats?.total_revenue || 0 }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                            <span class="text-gray-600">Current Campaign</span>
                            <span class="font-semibold text-blue-600">{{ currencySymbol }}{{ campaign.total_amount }}</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                            <span class="text-gray-600">Contribution</span>
                            <span class="font-semibold">{{ contribution }}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Admin Analytics -->
            <template v-if="isAdmin">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="rounded-xl border bg-card shadow-sm">
                        <div class="p-6 pb-2">
                            <h3 class="text-lg font-semibold flex items-center gap-2"><TrendingUp class="h-5 w-5 text-gray-600" /> Monthly Trends</h3>
                            <p class="text-sm text-muted-foreground">Campaign activity over the last 6 months</p>
                        </div>
                        <div class="p-6 pt-2 space-y-3">
                            <div v-for="(trend, i) in monthlyTrends" :key="i"
                                class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div>
                                    <p class="font-medium text-gray-900">{{ trend.month }}</p>
                                    <p class="text-sm text-gray-600">{{ trend.count }} campaigns</p>
                                </div>
                                <p class="font-semibold text-emerald-600">{{ currencySymbol }}{{ Number(trend.revenue ?? 0).toFixed(2) }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="rounded-xl border bg-card shadow-sm">
                        <div class="p-6 pb-2">
                            <h3 class="text-lg font-semibold flex items-center gap-2"><PieChartIcon class="h-5 w-5 text-gray-600" /> Status Distribution</h3>
                            <p class="text-sm text-muted-foreground">Campaign status breakdown</p>
                        </div>
                        <div class="p-6 pt-2 space-y-3">
                            <div v-for="(status, i) in statusDistribution" :key="i"
                                class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <span class="px-3 py-1 text-xs font-medium border rounded-full" :class="statusClass(status.status)">
                                    {{ capitalize(status.status) }}
                                </span>
                                <div class="text-right">
                                    <p class="font-semibold text-gray-900">{{ status.count }}</p>
                                    <p class="text-sm text-gray-600">campaigns</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Campaign Details -->
            <div class="rounded-xl border bg-card shadow-sm">
                <div class="p-6 pb-2"><h3 class="text-lg font-semibold">Campaign Details</h3></div>
                <div class="p-6 pt-2">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="space-y-4">
                            <div>
                                <p class="text-sm text-gray-600 mb-1">Payment Method</p>
                                <p class="font-semibold text-gray-900 capitalize">{{ campaign.payment_method?.replace('_', ' ') }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600 mb-1">Created Date</p>
                                <p class="font-semibold text-gray-900">{{ formatDate(campaign.created_at) }}</p>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <p class="text-sm text-gray-600 mb-1">Last Updated</p>
                                <p class="font-semibold text-gray-900">{{ formatDate(campaign.updated_at) }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600 mb-1">Campaign ID</p>
                                <p class="font-semibold text-gray-900">#{{ campaign.id }}</p>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <p class="text-sm text-gray-600 mb-1">Status</p>
                                <span class="px-3 py-1 text-xs font-medium border rounded-full" :class="statusClass(campaign.status)">
                                    {{ capitalize(campaign.status) }}
                                </span>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600 mb-1">Active</p>
                                <span class="px-3 py-1 text-xs font-medium border rounded-full"
                                    :class="campaign.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-700 border-gray-200'">
                                    {{ campaign.is_active ? 'Yes' : 'No' }}
                                </span>
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
import { Users, Building2, Calendar, DollarSign, Activity, Clock, TrendingUp, BarChart3, Target, ArrowUpRight, PieChart as PieChartIcon } from 'lucide-vue-next';
import PageTemplate from '@/components/page-template.vue';

const props = defineProps<{
    campaign: any;
    metrics: any;
    businessStats?: any;
    monthlyTrends?: any[];
    statusDistribution?: any[];
    isAdmin?: boolean;
}>();

const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Campaigns', href: route('campaigns.index') },
    { title: 'Analytics' },
];

const currencySymbol = computed(() => (window as any).appSettings?.currencySettings?.currencySymbol ?? '$');

const contribution = computed(() => {
    if (!props.businessStats?.total_revenue) return 0;
    return Math.round((props.campaign.total_amount / props.businessStats.total_revenue) * 100);
});

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

function statusClass(status: string) {
    const map: Record<string, string> = {
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
        active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        completed: 'bg-blue-50 text-blue-700 border-blue-200',
        cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return map[status] ?? 'bg-gray-50 text-gray-700 border-gray-200';
}
</script>
