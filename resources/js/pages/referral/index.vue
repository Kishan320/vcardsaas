<template>
    <AppLayout>
        <Head title="Referral" />
        <FlashMessage />
        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Referral Program</h1>
                <p class="text-sm text-gray-500 mt-0.5">Manage referral settings and payouts</p>
            </div>

            <!-- Tabs -->
            <div class="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                    class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                    :class="activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
                    {{ tab.label }}
                </button>
            </div>

            <!-- Dashboard Tab -->
            <div v-if="activeTab === 'dashboard'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-5">
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Referrals</p>
                    <p class="text-3xl font-extrabold text-gray-900">{{ stats?.total_referrals ?? 0 }}</p>
                </div>
                <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-5">
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Earnings</p>
                    <p class="text-3xl font-extrabold text-gray-900">${{ stats?.total_earnings ?? '0.00' }}</p>
                </div>
                <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-5">
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pending Payout</p>
                    <p class="text-3xl font-extrabold text-gray-900">${{ stats?.pending_payout ?? '0.00' }}</p>
                </div>

                <div class="md:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-card p-5">
                    <h3 class="font-semibold text-gray-900 mb-3">Your Referral Link</h3>
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <code class="flex-1 text-sm text-gray-700 truncate">{{ referralLink }}</code>
                        <button @click="copyLink" class="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                            <Copy :size="14" class="text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Payout Requests Tab -->
            <div v-if="activeTab === 'payouts'" class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">Payout Requests</h3>
                    <button @click="showPayoutModal = true" class="inline-flex items-center gap-2 px-3 py-1.5 gradient-primary text-white text-xs font-semibold rounded-lg hover:opacity-90">
                        <Plus :size="14" /> Request Payout
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th v-if="isSuperAdmin" class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="payout in payoutRequests" :key="payout.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3 font-semibold text-gray-900">${{ payout.amount }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600 capitalize">{{ payout.payment_method }}</td>
                                <td class="px-4 py-3">
                                    <span class="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                                        :class="{
                                            'bg-amber-50 text-amber-700': payout.status === 'pending',
                                            'bg-green-50 text-green-700': payout.status === 'approved',
                                            'bg-red-50 text-red-700': payout.status === 'rejected',
                                        }">
                                        {{ payout.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(payout.created_at) }}</td>
                                <td v-if="isSuperAdmin" class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button v-if="payout.status === 'pending'" @click="approvePayout(payout)" class="p-1.5 rounded-lg hover:bg-green-50 text-green-500 transition-colors">
                                            <CheckCircle :size="15" />
                                        </button>
                                        <button v-if="payout.status === 'pending'" @click="rejectPayout(payout)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                                            <XCircle :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!payoutRequests?.length">
                                <td :colspan="isSuperAdmin ? 5 : 4" class="px-4 py-12 text-center text-sm text-gray-400">No payout requests</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Settings Tab (Super Admin) -->
            <div v-if="activeTab === 'settings' && isSuperAdmin" class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                <h3 class="font-semibold text-gray-900 mb-5">Referral Settings</h3>
                <form @submit.prevent="saveSettings" class="space-y-4">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" v-model="settingsForm.is_enabled" id="ref_enabled" class="rounded border-gray-300 text-primary-600" />
                        <label for="ref_enabled" class="text-sm text-gray-700">Enable Referral Program</label>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Commission Rate (%)" />
                            <TextInput v-model="settingsForm.commission_rate" type="number" class="mt-1.5" placeholder="10" />
                        </div>
                        <div>
                            <InputLabel value="Minimum Payout ($)" />
                            <TextInput v-model="settingsForm.min_payout" type="number" class="mt-1.5" placeholder="50" />
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <PrimaryButton :disabled="settingsForm.processing">Save Settings</PrimaryButton>
                    </div>
                </form>
            </div>
        </div>

        <!-- Payout Request Modal -->
        <Modal :show="showPayoutModal" max-width="sm" :closeable="true" @close="showPayoutModal = false">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">Request Payout</h3>
                <form @submit.prevent="submitPayout" class="space-y-4">
                    <div>
                        <InputLabel value="Amount ($)" required />
                        <TextInput v-model="payoutForm.amount" type="number" class="mt-1.5" placeholder="50.00" />
                        <InputError :message="payoutForm.errors.amount" />
                    </div>
                    <div>
                        <InputLabel value="Payment Method" required />
                        <select v-model="payoutForm.payment_method" class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="bank">Bank Transfer</option>
                            <option value="paypal">PayPal</option>
                        </select>
                    </div>
                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="showPayoutModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="payoutForm.processing">Submit Request</PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, router, useForm, usePage } from '@inertiajs/vue3';
import { Plus, Copy, CheckCircle, XCircle } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';
import { usePermissions } from '@/composables/usePermissions';

interface PayoutRequest { id: number; amount: string; payment_method: string; status: string; created_at: string }

const props = defineProps<{
    stats?: { total_referrals: number; total_earnings: string; pending_payout: string };
    payoutRequests?: PayoutRequest[];
    referralSettings?: { is_enabled: boolean; commission_rate: number; min_payout: number };
    referralCode?: string;
}>();

const { isSuperAdmin } = usePermissions();
const page = usePage();
const activeTab = ref('dashboard');
const showPayoutModal = ref(false);

const tabs = computed(() => [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'payouts', label: 'Payout Requests' },
    ...(isSuperAdmin.value ? [{ id: 'settings', label: 'Settings' }] : []),
]);

const referralLink = computed(() => `${window.location.origin}?ref=${props.referralCode ?? ''}`);

const payoutForm = useForm({ amount: '', payment_method: 'bank' });
const settingsForm = useForm({
    is_enabled: props.referralSettings?.is_enabled ?? false,
    commission_rate: String(props.referralSettings?.commission_rate ?? 10),
    min_payout: String(props.referralSettings?.min_payout ?? 50),
});

const formatDate = (d: string) => new Date(d).toLocaleDateString();

const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink.value).catch(() => {});
};

const submitPayout = () => {
    payoutForm.post(route('referral.payout-request.create'), { onSuccess: () => { showPayoutModal.value = false; } });
};

const approvePayout = (p: PayoutRequest) => router.post(route('referral.payout-request.approve', p.id), {});
const rejectPayout = (p: PayoutRequest) => router.post(route('referral.payout-request.reject', p.id), {});
const saveSettings = () => settingsForm.post(route('referral.settings.update'));
</script>
