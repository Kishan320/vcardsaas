<template>
    <AppLayout>
        <Head title="Referral" />
        <FlashMessage />

        <div class="space-y-7">
            <section>
                <h1 class="text-2xl font-bold text-gray-900">Referral Program</h1>
            </section>

            <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <div v-for="card in dashboardCards" :key="card.label" class="rounded-lg border bg-white p-5 shadow-card" :class="card.border">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-sm font-semibold" :class="card.text">{{ card.label }}</p>
                            <p class="mt-3 text-3xl font-bold" :class="card.valueColor">{{ card.value }}</p>
                            <p class="mt-1 text-sm text-gray-500">{{ card.caption }}</p>
                        </div>
                        <div class="flex h-12 w-12 items-center justify-center rounded-full" :class="card.iconBg">
                            <component :is="card.icon" :size="22" :class="card.text" />
                        </div>
                    </div>
                </div>
            </section>

            <section class="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div class="rounded-lg border border-gray-200 bg-white shadow-card">
                    <div class="flex items-center gap-4 border-b border-gray-100 p-5">
                        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                            <Award :size="22" />
                        </div>
                        <div>
                            <h2 class="text-lg font-bold text-gray-900">Top Referring Companies</h2>
                            <p class="text-sm text-gray-500">Companies with most referrals</p>
                        </div>
                    </div>

                    <div class="divide-y divide-gray-50 p-5">
                        <div v-for="(company, index) in topCompaniesList" :key="company.id" class="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                                {{ index + 1 }}
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-base font-bold text-gray-900">{{ company.name }}</p>
                                <p class="truncate text-sm text-gray-500">{{ company.email }}</p>
                            </div>
                            <div class="text-right">
                                <div class="flex items-center justify-end gap-1 text-sm font-bold text-gray-900">
                                    <Users :size="15" />
                                    {{ numberValue(company.referral_count) }}
                                </div>
                                <p class="text-sm font-semibold text-emerald-600">{{ money(company.total_earned) }}</p>
                            </div>
                        </div>
                        <div v-if="!topCompaniesList.length" class="py-10 text-center text-sm text-gray-400">
                            No referring companies yet
                        </div>
                    </div>
                </div>

                <div class="rounded-lg border border-gray-200 bg-white shadow-card">
                    <div class="flex items-center gap-4 border-b border-gray-100 p-5">
                        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100 text-rose-500">
                            <TrendingUp :size="22" />
                        </div>
                        <div>
                            <h2 class="text-lg font-bold text-gray-900">Monthly Performance</h2>
                            <p class="text-sm text-gray-500">This year statistics</p>
                        </div>
                    </div>

                    <div class="space-y-4 p-5">
                        <div class="rounded-lg border border-amber-200 bg-amber-50/50 p-5">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="text-base font-bold text-amber-700">Referral Signups</p>
                                    <p class="mt-3 text-3xl font-bold text-orange-600">{{ totalMonthlyReferrals }}</p>
                                    <p class="mt-2 flex items-center gap-1 text-sm font-semibold text-orange-500">
                                        <CalendarDays :size="15" />
                                        Total this year
                                    </p>
                                </div>
                                <Users :size="18" class="text-orange-500" />
                            </div>
                        </div>

                        <div class="rounded-lg border border-violet-200 bg-violet-50/60 p-5">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="text-base font-bold text-violet-700">Payouts Processed</p>
                                    <p class="mt-3 text-3xl font-bold text-violet-700">{{ money(totalMonthlyPayouts) }}</p>
                                    <p class="mt-2 flex items-center gap-1 text-sm font-semibold text-violet-500">
                                        <CalendarDays :size="15" />
                                        Total this year
                                    </p>
                                </div>
                                <DollarSign :size="18" class="text-violet-600" />
                            </div>
                        </div>

                        <div v-if="!isSuperAdmin && referralLink" class="rounded-lg border border-emerald-200 bg-emerald-50/60 p-5">
                            <p class="text-base font-bold text-emerald-700">Your Referral Link</p>
                            <div class="mt-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2">
                                <code class="min-w-0 flex-1 truncate text-sm text-gray-600">{{ referralLink }}</code>
                                <button type="button" @click="copyLink" class="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50">
                                    <Copy :size="16" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 class="mb-5 text-2xl font-bold text-gray-900">Referred Users</h2>

                <div class="mb-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div v-for="card in referredCards" :key="card.label" class="rounded-lg border border-gray-200 bg-white p-6 shadow-card">
                        <div class="flex items-center justify-between gap-4">
                            <div>
                                <p class="text-base font-semibold text-gray-500">{{ card.label }}</p>
                                <p class="mt-3 text-3xl font-bold text-gray-900">{{ card.value }}</p>
                            </div>
                            <div class="flex h-12 w-12 items-center justify-center rounded-full" :class="card.iconBg">
                                <component :is="card.icon" :size="21" :class="card.iconColor" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-card">
                    <h3 class="mb-5 text-lg font-bold text-gray-900">Referred Users List</h3>
                    <div class="space-y-4">
                        <div v-for="user in referredUsersList" :key="user.id" class="rounded-lg border border-gray-200 p-5">
                            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div class="flex min-w-0 gap-4">
                                    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-lg font-bold text-emerald-500">
                                        {{ initials(user.name) }}
                                    </div>
                                    <div class="min-w-0">
                                        <p class="truncate text-base font-bold text-gray-900">{{ user.name }}</p>
                                        <p class="truncate text-sm text-gray-500">{{ user.email }}</p>
                                        <p class="mt-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <CalendarDays :size="14" />
                                            Registered {{ formatDate(user.created_at) }}
                                        </p>
                                    </div>
                                </div>

                                <div class="text-left sm:text-right">
                                    <span class="inline-flex rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                                        {{ planName(user) }}
                                    </span>
                                    <p class="mt-2 text-sm text-gray-500">{{ planPrice(user) }}/month</p>
                                    <p v-if="commissionAmount(user) > 0" class="mt-1 text-sm font-bold text-emerald-600">
                                        +{{ money(commissionAmount(user)) }}
                                    </p>
                                </div>
                            </div>

                            <div v-if="commissionAmount(user) > 0" class="mt-4 border-t border-gray-100 pt-4">
                                <div class="flex items-center justify-between gap-4">
                                    <div>
                                        <p class="font-bold text-gray-900">Commission History</p>
                                        <p class="text-sm text-gray-500">{{ commissionPercentage(user) }}% commission</p>
                                    </div>
                                    <p class="font-bold text-emerald-600">+{{ money(commissionAmount(user)) }}</p>
                                </div>
                            </div>
                        </div>

                        <div v-if="!referredUsersList.length" class="rounded-lg border border-dashed border-gray-200 py-12 text-center text-sm text-gray-400">
                            No referred users yet
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Payout Requests</h2>
                    <button v-if="!isSuperAdmin" @click="showPayoutModal = true" class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                        <Plus :size="16" /> Request Payout
                    </button>
                </div>

                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-card">
                    <h3 class="mb-5 text-lg font-bold text-gray-900">All Payout Requests</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="bg-gray-50 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    <th class="px-4 py-4">#</th>
                                    <th class="px-4 py-4">Company</th>
                                    <th class="px-4 py-4">Amount</th>
                                    <th class="px-4 py-4">Status</th>
                                    <th class="px-4 py-4">Date</th>
                                    <th v-if="isSuperAdmin" class="px-4 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="(payout, index) in payoutRows" :key="payout.id" class="hover:bg-gray-50">
                                    <td class="px-4 py-4 font-semibold text-gray-700">{{ (payoutRequests?.from ?? 1) + index }}</td>
                                    <td class="px-4 py-4">
                                        <p class="font-bold text-gray-900">{{ payout.company?.name ?? 'Company' }}</p>
                                        <p class="text-xs text-gray-500">{{ payout.company?.email ?? 'company@example.com' }}</p>
                                    </td>
                                    <td class="px-4 py-4 font-semibold text-gray-700">{{ money(payout.amount) }}</td>
                                    <td class="px-4 py-4">
                                        <span class="rounded-full px-3 py-1 text-xs font-semibold capitalize" :class="statusClass(payout.status)">
                                            {{ payout.status }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-4 font-medium text-gray-600">{{ formatDate(payout.created_at) }}</td>
                                    <td v-if="isSuperAdmin" class="px-4 py-4">
                                        <div class="flex items-center justify-end gap-3">
                                            <button v-if="payout.status === 'pending'" @click="approvePayout(payout)" class="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50">
                                                <Check :size="16" />
                                            </button>
                                            <button v-if="payout.status === 'pending'" @click="rejectPayout(payout)" class="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
                                                <X :size="16" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="!payoutRows.length">
                                    <td :colspan="isSuperAdmin ? 6 : 5" class="px-4 py-12 text-center text-sm text-gray-400">No payout requests</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Pagination v-if="payoutRequests?.links?.length" :links="payoutRequests.links" :from="payoutRequests.from ?? 0" :to="payoutRequests.to ?? 0" :total="payoutRequests.total ?? 0" />
                </div>
            </section>

            <section v-if="isSuperAdmin">
                <h2 class="mb-5 text-2xl font-bold text-gray-900">Settings</h2>
                <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-card">
                    <h3 class="mb-5 text-lg font-bold text-gray-900">Referral Program Settings</h3>
                    <form @submit.prevent="saveSettings" class="space-y-5">
                        <label class="inline-flex items-center gap-3">
                            <input type="checkbox" v-model="settingsForm.is_enabled" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                            <span class="text-sm font-semibold text-gray-800">Enable Referral Program</span>
                        </label>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <InputLabel value="Commission Percentage (%)" />
                                <TextInput v-model="settingsForm.commission_percentage" type="number" step="0.01" class="mt-2" />
                                <InputError :message="settingsForm.errors.commission_percentage" />
                            </div>
                            <div>
                                <InputLabel value="Minimum Threshold Amount $" />
                                <TextInput v-model="settingsForm.threshold_amount" type="number" step="0.01" class="mt-2" />
                                <InputError :message="settingsForm.errors.threshold_amount" />
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Referral Guidelines" />
                            <textarea v-model="settingsForm.guidelines" rows="6" class="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200" />
                            <InputError :message="settingsForm.errors.guidelines" />
                        </div>

                        <div class="flex justify-end">
                            <PrimaryButton :disabled="settingsForm.processing">
                                <span class="inline-flex items-center gap-2">
                                    <Loader2 v-if="settingsForm.processing" :size="16" class="animate-spin" />
                                    {{ settingsForm.processing ? 'Saving...' : 'Save Settings' }}
                                </span>
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </section>
        </div>

        <Modal :show="showPayoutModal" max-width="sm" :closeable="true" @close="showPayoutModal = false">
            <div class="p-6">
                <h3 class="mb-5 text-lg font-bold text-gray-900">Request Payout</h3>
                <form @submit.prevent="submitPayout" class="space-y-4">
                    <div>
                        <InputLabel value="Amount ($)" required />
                        <TextInput v-model="payoutForm.amount" type="number" step="0.01" class="mt-2" placeholder="50.00" />
                        <InputError :message="payoutForm.errors.amount" />
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" @click="showPayoutModal = false" class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="payoutForm.processing">Submit Request</PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import {
    Award,
    CalendarDays,
    Check,
    Clock3,
    Copy,
    DollarSign,
    Loader2,
    Plus,
    Target,
    TrendingUp,
    Users,
    X,
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';
import Pagination from '@/components/ui/Pagination.vue';
import { usePermissions } from '@/composables/usePermissions';

interface Company {
    id: number;
    name: string;
    email: string;
    referral_count?: number | string;
    total_earned?: number | string | null;
}

interface ReferralRecord {
    amount?: number | string;
    commission_percentage?: number | string;
}

interface ReferredUser {
    id: number;
    name: string;
    email: string;
    created_at: string;
    plan?: { name?: string; price?: number | string; monthly_price?: number | string } | null;
    referrals?: ReferralRecord[];
}

interface PayoutRequest {
    id: number;
    amount: number | string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    company?: { name: string; email: string } | null;
}

interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    from?: number;
    to?: number;
    total?: number;
}

interface ReferralSettings {
    is_enabled: boolean;
    commission_percentage: number | string;
    threshold_amount: number | string;
    guidelines?: string | null;
}

const props = defineProps<{
    userType?: 'superadmin' | 'company';
    settings?: ReferralSettings;
    stats?: Record<string, any>;
    payoutRequests?: Paginated<PayoutRequest>;
    referralLink?: string;
    recentReferredUsers?: ReferredUser[];
    referredUsers?: ReferredUser[];
}>();

const { isSuperAdmin } = usePermissions();
const showPayoutModal = ref(false);

const payoutRows = computed(() => props.payoutRequests?.data ?? []);
const referredUsersList = computed(() => props.referredUsers ?? props.recentReferredUsers ?? []);
const topCompaniesList = computed<Company[]>(() => props.stats?.topCompanies ?? []);

const totalMonthlyReferrals = computed(() => sumObjectValues(props.stats?.monthlyReferrals));
const totalMonthlyPayouts = computed(() => sumObjectValues(props.stats?.monthlyPayouts));
const totalReferralUsers = computed(() => numberValue(props.stats?.totalReferralUsers ?? props.stats?.referredUsersCount ?? props.stats?.totalReferrals));
const usersWithPlans = computed(() => numberValue(props.stats?.usersWithPlans ?? referredUsersList.value.filter((user) => !!user.plan).length));
const totalCommissionEarned = computed(() => props.stats?.totalCommissionEarned ?? props.stats?.totalEarned ?? 0);

const dashboardCards = computed(() => [
    {
        label: 'Total Referral Users',
        value: totalReferralUsers.value,
        caption: 'Registered users',
        icon: Users,
        border: 'border-blue-200 bg-blue-50/40',
        iconBg: 'bg-blue-100',
        text: 'text-blue-600',
        valueColor: 'text-blue-600',
    },
    {
        label: 'Pending Payouts',
        value: numberValue(props.stats?.pendingPayouts ?? props.stats?.totalPayoutRequests ?? 0),
        caption: isSuperAdmin.value ? 'Awaiting approval' : 'Payout requests',
        icon: Clock3,
        border: 'border-amber-200 bg-amber-50/50',
        iconBg: 'bg-amber-100',
        text: 'text-orange-600',
        valueColor: 'text-orange-600',
    },
    {
        label: 'Total Commission',
        value: money(props.stats?.totalCommissionPaid ?? props.stats?.availableBalance ?? 0),
        caption: isSuperAdmin.value ? 'Total payouts' : 'Available balance',
        icon: DollarSign,
        border: 'border-emerald-200 bg-emerald-50/40',
        iconBg: 'bg-emerald-100',
        text: 'text-emerald-600',
        valueColor: 'text-emerald-700',
    },
    {
        label: 'Active Companies',
        value: isSuperAdmin.value ? topCompaniesList.value.filter((company) => numberValue(company.referral_count) > 0).length : totalReferralUsers.value,
        caption: isSuperAdmin.value ? 'Referring companies' : 'Active referrals',
        icon: TrendingUp,
        border: 'border-violet-200 bg-violet-50/50',
        iconBg: 'bg-violet-100',
        text: 'text-violet-600',
        valueColor: 'text-violet-600',
    },
]);

const referredCards = computed(() => [
    {
        label: 'Total Referred Users',
        value: totalReferralUsers.value,
        icon: Users,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-500',
    },
    {
        label: 'Users with Plans',
        value: usersWithPlans.value,
        icon: Target,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
    },
    {
        label: 'Total Commission Earned',
        value: money(totalCommissionEarned.value),
        icon: DollarSign,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
    },
]);

const payoutForm = useForm({ amount: '' });
const settingsForm = useForm({
    is_enabled: props.settings?.is_enabled ?? false,
    commission_percentage: String(props.settings?.commission_percentage ?? 10),
    threshold_amount: String(props.settings?.threshold_amount ?? 50),
    guidelines: props.settings?.guidelines ?? '',
});

function numberValue(value: unknown): number {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
}

function sumObjectValues(value: Record<string, number | string> | undefined): number {
    return Object.values(value ?? {}).reduce((total, item) => total + numberValue(item), 0);
}

function money(value: unknown): string {
    return `$${numberValue(value).toFixed(2)}`;
}

function formatDate(value: string): string {
    if (!value) return '-';
    return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function initials(name: string): string {
    return (name || '?').trim().slice(0, 1).toUpperCase();
}

function planName(user: ReferredUser): string {
    return user.plan?.name ?? 'Free';
}

function planPrice(user: ReferredUser): string {
    const price = user.plan?.monthly_price ?? user.plan?.price ?? 0;
    return money(price);
}

function commissionAmount(user: ReferredUser): number {
    return numberValue(user.referrals?.[0]?.amount);
}

function commissionPercentage(user: ReferredUser): string {
    return numberValue(user.referrals?.[0]?.commission_percentage).toFixed(2);
}

function statusClass(status: string): string {
    if (status === 'approved') return 'bg-emerald-50 text-emerald-700';
    if (status === 'rejected') return 'bg-red-50 text-red-700';
    return 'bg-amber-50 text-amber-700';
}

async function copyLink() {
    if (!props.referralLink) return;
    await navigator.clipboard.writeText(props.referralLink).catch(() => {});
}

function submitPayout() {
    payoutForm.post(route('referral.payout-request.create'), {
        onSuccess: () => {
            showPayoutModal.value = false;
            payoutForm.reset();
        },
    });
}

function approvePayout(payout: PayoutRequest) {
    router.post(route('referral.payout-request.approve', payout.id), {});
}

function rejectPayout(payout: PayoutRequest) {
    router.post(route('referral.payout-request.reject', payout.id), {});
}

function saveSettings() {
    settingsForm.post(route('referral.settings.update'));
}
</script>
