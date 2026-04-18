<template>
    <AppLayout>
        <Head title="Plans" />
        <FlashMessage />

        <div class="space-y-8">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-gray-900 mb-1">
                        {{ isAdmin ? 'Subscription Plans' : 'Choose Your Plan' }}
                    </h1>
                    <p class="text-gray-500 max-w-2xl text-sm">
                        {{ isAdmin ? 'Create and manage subscription plans to offer different service tiers.' : 'Select the perfect plan for your business needs.' }}
                    </p>
                </div>
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <!-- Billing cycle toggle -->
                    <div class="flex items-center bg-gray-100 rounded-xl p-1">
                        <button @click="setBillingCycle('monthly')"
                            class="px-4 py-1.5 text-sm font-medium rounded-lg transition-all"
                            :class="billingCycle === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'">
                            Monthly
                        </button>
                        <button @click="setBillingCycle('yearly')"
                            class="px-4 py-1.5 text-sm font-medium rounded-lg transition-all"
                            :class="billingCycle === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'">
                            Yearly
                        </button>
                    </div>
                    <Link v-if="isAdmin" :href="route('plans.create')"
                        class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95">
                        <Plus :size="16" /> Add Plan
                    </Link>
                </div>
            </div>

            <!-- Plans Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="plan in localPlans" :key="plan.id"
                    class="group relative flex flex-col"
                    :class="plan.recommended ? 'z-10 scale-[1.02]' : ''">

                    <!-- Card background -->
                    <div class="absolute inset-0 rounded-2xl border shadow-lg transition-all duration-300 group-hover:shadow-xl overflow-hidden"
                        :class="plan.recommended ? 'bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30' : 'bg-gradient-to-br from-gray-100/80 via-gray-50/50 to-transparent border-gray-200/80'">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16 opacity-70" />
                        <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full -ml-12 -mb-12 opacity-50" />
                    </div>

                    <!-- Recommended badge -->
                    <div v-if="plan.recommended" class="absolute -top-4 left-0 right-0 flex justify-center z-20">
                        <div class="gradient-primary text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-semibold">
                            <Sparkles :size="13" /> Recommended
                        </div>
                    </div>

                    <!-- Admin status badges -->
                    <div v-if="isAdmin" class="absolute top-4 right-4 z-10 flex gap-1.5">
                        <span v-if="plan.is_default" class="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">Default</span>
                        <span class="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                            :class="plan.status ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">
                            <span class="w-1.5 h-1.5 rounded-full" :class="plan.status ? 'bg-emerald-500' : 'bg-red-500'" />
                            {{ plan.status ? 'Active' : 'Inactive' }}
                        </span>
                    </div>

                    <!-- Current plan badge (company) -->
                    <div v-if="!isAdmin && plan.is_current" class="absolute top-4 right-4 z-10">
                        <span class="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary flex items-center gap-1">
                            <Crown :size="11" /> Current
                        </span>
                    </div>

                    <!-- Content -->
                    <div class="relative z-10 flex flex-col h-full p-6 pt-8">
                        <!-- Plan header -->
                        <div class="mb-5">
                            <h3 class="text-2xl font-bold mb-1" :class="plan.recommended ? 'text-primary' : 'text-gray-900'">{{ plan.name }}</h3>
                            <div class="flex items-baseline gap-1 mb-2">
                                <span class="text-3xl font-extrabold" :class="plan.recommended ? 'text-primary' : 'text-gray-900'">
                                    ${{ parseFloat(String(plan.price)).toFixed(2) }}
                                </span>
                                <span class="text-gray-400 text-sm">/{{ plan.duration?.toLowerCase() ?? 'month' }}</span>
                            </div>
                            <p class="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-2">{{ plan.description }}</p>
                            <div v-if="plan.trial_days > 0" class="flex items-center gap-1 text-sm text-primary">
                                <Sparkles :size="13" /> {{ plan.trial_days }} days free trial
                            </div>
                        </div>

                        <!-- Divider -->
                        <div class="relative flex items-center my-3">
                            <div class="flex-grow border-t border-gray-200" />
                            <div class="mx-3 bg-primary/10 text-primary p-1.5 rounded-full">
                                <CheckCircle2 :size="14" />
                            </div>
                            <div class="flex-grow border-t border-gray-200" />
                        </div>

                        <!-- Features -->
                        <div class="mb-5 flex-1">
                            <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Features</h4>
                            <ul class="space-y-2">
                                <li v-for="feature in planFeatures" :key="feature.key" class="flex items-center gap-2.5">
                                    <div class="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                                        :class="isFeatureIncluded(plan, feature.key) ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'">
                                        <CheckCircle2 v-if="isFeatureIncluded(plan, feature.key)" :size="12" />
                                        <X v-else :size="12" />
                                    </div>
                                    <span class="text-sm" :class="isFeatureIncluded(plan, feature.key) ? 'font-medium text-gray-800' : 'text-gray-400'">
                                        {{ feature.key === 'Template Sections' ? getTemplateSectionsText(plan) : feature.label }}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <!-- Usage Limits -->
                        <div class="mb-5">
                            <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Usage Limits</h4>
                            <div class="grid grid-cols-2 gap-2">
                                <div v-for="stat in statItems" :key="stat.key"
                                    class="relative overflow-hidden bg-white rounded-xl border border-gray-200 p-2.5 group-hover:border-primary/20 transition-colors">
                                    <div class="absolute inset-0 opacity-60 rounded-xl" :class="stat.bg" />
                                    <div class="relative flex items-center gap-1.5 mb-0.5">
                                        <div class="p-1 rounded-full" :class="stat.iconBg">
                                            <component :is="stat.icon" :size="13" :class="stat.iconColor" />
                                        </div>
                                        <span class="text-base font-bold" :class="stat.textColor">{{ plan.stats?.[stat.key] ?? '—' }}</span>
                                    </div>
                                    <div class="relative text-xs font-medium uppercase tracking-wide" :class="stat.labelColor">{{ stat.label }}</div>
                                </div>
                            </div>
                            <!-- Addons -->
                            <div v-if="plan.stats?.addons > 0 && plan.stats?.addon_names?.length" class="mt-2 bg-white rounded-xl border border-gray-200 p-2.5">
                                <div class="flex items-center gap-1.5 mb-1.5">
                                    <div class="p-1 rounded-full bg-gray-100"><Box :size="13" class="text-gray-600" /></div>
                                    <span class="text-xs font-semibold text-gray-700">Included Addons ({{ plan.stats.addons }})</span>
                                </div>
                                <div class="flex flex-wrap gap-1">
                                    <span v-for="name in plan.stats.addon_names" :key="name"
                                        class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">{{ name }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="mt-auto pt-4 border-t border-gray-200">
                            <!-- Admin actions -->
                            <div v-if="isAdmin" class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <button @click="togglePlanStatus(plan)"
                                        class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                        :class="plan.status ? 'bg-primary' : 'bg-gray-200'">
                                        <span class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                                            :class="plan.status ? 'translate-x-4' : 'translate-x-1'" />
                                    </button>
                                    <span class="text-xs text-gray-500">{{ plan.status ? 'Active' : 'Inactive' }}</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <Link :href="route('plans.edit', plan.id)"
                                        class="p-2 rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray-500">
                                        <Pencil :size="14" />
                                    </Link>
                                    <button v-if="!plan.is_default" @click="handleDelete(plan)"
                                        class="p-2 rounded-lg border border-gray-200 hover:border-red-400 hover:text-red-600 transition-colors text-gray-500">
                                        <Trash2 :size="14" />
                                    </button>
                                </div>
                            </div>

                            <!-- Company actions -->
                            <div v-else class="space-y-2">
                                <button v-if="plan.is_current" disabled
                                    class="w-full py-2.5 text-sm font-semibold rounded-xl bg-green-100 text-green-800 border border-green-200 flex items-center justify-center gap-2">
                                    <Crown :size="14" /> Current Plan
                                </button>
                                <template v-else>
                                    <button v-if="plan.is_trial_available && !userTrialUsed" @click="startTrial(plan.id)"
                                        class="w-full py-2.5 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                        <Zap :size="14" /> Start {{ plan.trial_days }} Day Trial
                                    </button>
                                    <button v-if="plan.has_pending_request" @click="cancelRequest(plan.request_id)"
                                        class="w-full py-2.5 text-sm font-semibold rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                                        <X :size="14" /> Cancel Request
                                    </button>
                                    <button v-else-if="!plan.is_trial_available || userTrialUsed" @click="requestPlan(plan.id)"
                                        class="w-full py-2.5 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                        <Clock :size="14" /> Request Plan
                                    </button>
                                    <button @click="subscribePlan(plan.id)"
                                        class="w-full py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                        :class="plan.recommended ? 'gradient-primary text-white hover:opacity-90' : 'border border-primary/30 text-primary hover:bg-primary/5'">
                                        Subscribe Now
                                    </button>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="!localPlans.length" class="col-span-full bg-white border border-gray-100 rounded-2xl shadow-card p-16 text-center">
                    <Package :size="48" class="text-gray-200 mx-auto mb-4" />
                    <p class="text-gray-400">No plans available yet.</p>
                </div>
            </div>
        </div>

        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Plan</h3>
                <p class="text-sm text-gray-600 mb-6">Delete <strong>{{ selectedPlan?.name }}</strong>?</p>
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button @click="confirmDelete" :disabled="deleteForm.processing" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Delete</button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';
import { Head, Link, router, useForm, usePage } from '@inertiajs/vue3';
import { Plus, Pencil, Trash2, CheckCircle2, X, Sparkles, Crown, Zap, Clock, Package, Globe, FileText, Bot, HardDrive, Store, Users, Box } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';

interface PlanStats { businesses: any; users: any; storage: any; templates: any; bio_links?: any; bio_links_templates?: any; addons?: number; addon_names?: string[] }
interface Plan {
    id: number; name: string; price: string | number; duration: string; description: string;
    trial_days: number; features: string[] | Record<string, any>; stats: PlanStats;
    status: boolean; recommended?: boolean; is_default?: boolean; is_current?: boolean;
    is_trial_available?: boolean; has_pending_request?: boolean; request_id?: number;
}

const props = defineProps<{
    plans: Plan[];
    monthlyPlans?: Plan[];
    yearlyPlans?: Plan[];
    billingCycle?: 'monthly' | 'yearly';
    isAdmin?: boolean;
    currentPlan?: any;
    userTrialUsed?: boolean;
}>();

const page = usePage();
const billingCycle = ref<'monthly' | 'yearly'>(props.billingCycle ?? 'monthly');
const loadingCycle = ref(false);

// Local reactive plans — switches instantly from pre-loaded props
const localPlans = ref<Plan[]>(
    (billingCycle.value === 'yearly' ? props.yearlyPlans : props.monthlyPlans) ?? props.plans.map(p => ({ ...p }))
);

// Keep in sync if Inertia updates props (e.g. after toggle)
watch(() => props.plans, (incoming) => {
    localPlans.value = incoming.map(p => ({ ...p }));
}, { deep: true });
const showDeleteModal = ref(false);
const selectedPlan = ref<Plan | null>(null);
const deleteForm = useForm({});

const planFeatures = [
    { key: 'Custom Domain', label: 'Custom Domain' },
    { key: 'Subdomain', label: 'Custom Subdomain' },
    { key: 'PWA', label: 'PWA Support' },
    { key: 'AI Integration', label: 'AI Integration' },
    { key: 'Password Protection', label: 'Password Protection' },
    { key: 'Template Sections', label: 'Template Sections' },
];

const statItems = [
    { key: 'businesses', label: 'Businesses', icon: Store, bg: 'bg-gradient-to-br from-blue-50 to-transparent', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', textColor: 'text-blue-700', labelColor: 'text-blue-600' },
    { key: 'users', label: 'Users', icon: Users, bg: 'bg-gradient-to-br from-emerald-50 to-transparent', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', textColor: 'text-emerald-700', labelColor: 'text-emerald-600' },
    { key: 'storage', label: 'Storage', icon: HardDrive, bg: 'bg-gradient-to-br from-amber-50 to-transparent', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', textColor: 'text-amber-700', labelColor: 'text-amber-600' },
    { key: 'templates', label: 'Templates', icon: FileText, bg: 'bg-gradient-to-br from-purple-50 to-transparent', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', textColor: 'text-purple-700', labelColor: 'text-purple-600' },
    { key: 'bio_links', label: 'Bio Links', icon: Globe, bg: 'bg-gradient-to-br from-teal-50 to-transparent', iconBg: 'bg-teal-100', iconColor: 'text-teal-600', textColor: 'text-teal-700', labelColor: 'text-teal-600' },
    { key: 'bio_links_templates', label: 'Bio Templates', icon: FileText, bg: 'bg-gradient-to-br from-rose-50 to-transparent', iconBg: 'bg-rose-100', iconColor: 'text-rose-600', textColor: 'text-rose-700', labelColor: 'text-rose-600' },
];

const isFeatureIncluded = (plan: Plan, key: string) => {
    if (Array.isArray(plan.features)) return plan.features.includes(key);
    if (typeof plan.features === 'object' && plan.features !== null) return (plan.features as any)[key] === true;
    return false;
};

const getTemplateSectionsText = (plan: Plan) => {
    if (Array.isArray(plan.features)) {
        return plan.features.find(f => f.startsWith('Template Sections')) ?? 'Template Sections';
    }
    return 'Template Sections';
};

// Billing cycle: switch instantly using pre-loaded props — zero network request
const setBillingCycle = (cycle: 'monthly' | 'yearly') => {
    if (billingCycle.value === cycle) return;
    billingCycle.value = cycle;
    const source = cycle === 'yearly' ? props.yearlyPlans : props.monthlyPlans;
    if (source?.length) {
        localPlans.value = source.map(p => ({ ...p }));
    }
};

// Toggle plan status: optimistic update locally, then sync via axios — no page reload
const togglePlanStatus = async (plan: Plan) => {
    // Optimistic update
    const target = localPlans.value.find(p => p.id === plan.id);
    if (target) target.status = !target.status;
    try {
        await axios.post(route('plans.toggle-status', plan.id));
    } catch {
        // Revert on failure
        if (target) target.status = !target.status;
    }
};
const requestPlan = (id: number) => router.post(route('plans.request'), { plan_id: id, billing_cycle: billingCycle.value });
const cancelRequest = (id?: number) => { if (id) router.post(route('plans.cancel-request'), { request_id: id }); };
const startTrial = (id: number) => router.post(route('plans.trial'), { plan_id: id });
const subscribePlan = (id: number) => router.post(route('plans.subscribe'), { plan_id: id, billing_cycle: billingCycle.value });

const handleDelete = (plan: Plan) => { selectedPlan.value = plan; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedPlan.value) return;
    deleteForm.delete(route('plans.destroy', selectedPlan.value.id), { onSuccess: () => { showDeleteModal.value = false; } });
};
</script>
