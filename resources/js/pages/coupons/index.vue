<template>
    <AppLayout>
        <Head title="Coupons" />
        <FlashMessage />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Coupons</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Manage discount coupons</p>
                </div>
                <button @click="openCreate" class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95">
                    <Plus :size="16" /> Add Coupon
                </button>
            </div>

            <!-- Search & Filters -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4 space-y-3">
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                        <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="searchTerm" type="text" placeholder="Search coupons…"
                            class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                            @keyup.enter="applyFilters" />
                    </div>
                    <button @click="applyFilters" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90">
                        <Search :size="14" /> Search
                    </button>
                    <button @click="showFilters = !showFilters" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 relative">
                        <Filter :size="14" /> Filters
                        <span v-if="activeFilterCount > 0" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">{{ activeFilterCount }}</span>
                    </button>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <span>Per Page:</span>
                        <select v-model="perPage" @change="applyFilters" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
                <div v-if="showFilters" class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                    <div>
                        <label class="text-xs font-medium text-gray-500 mb-1 block">Type</label>
                        <select v-model="typeFilter" @change="applyFilters" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="">All Types</option>
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                        <select v-model="statusFilter" @change="applyFilters" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="">All Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button @click="resetFilters" class="text-sm text-red-500 hover:text-red-700 font-medium">Reset Filters</button>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uses</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Min Spend</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expires</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="coupon in coupons.data" :key="coupon.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <code class="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded font-semibold text-gray-800">{{ coupon.code }}</code>
                                </td>
                                <td class="px-4 py-3 font-semibold text-gray-900">
                                    {{ coupon.discount_type === 'percentage' ? coupon.discount_amount + '%' : '$' + parseFloat(String(coupon.discount_amount)).toFixed(2) }}
                                </td>
                                <td class="px-4 py-3">
                                    <span class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">{{ coupon.discount_type }}</span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ coupon.used_count ?? 0 }} / {{ coupon.use_limit_per_coupon ?? '∞' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ coupon.minimum_spend ? '$' + parseFloat(String(coupon.minimum_spend)).toFixed(2) : '—' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ coupon.expires_at ? formatDate(coupon.expires_at) : '—' }}</td>
                                <td class="px-4 py-3">
                                    <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                                        :class="coupon.status ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                                        {{ coupon.status ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="toggleStatus(coupon)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Toggle Status">
                                            <ToggleLeft v-if="coupon.status" :size="15" />
                                            <ToggleRight v-else :size="15" />
                                        </button>
                                        <button @click="openEdit(coupon)" class="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors" title="Edit">
                                            <Pencil :size="15" />
                                        </button>
                                        <button @click="handleDelete(coupon)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!coupons.data?.length">
                                <td colspan="8" class="px-4 py-12 text-center text-sm text-gray-400">No coupons found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="coupons.links" :from="coupons.from ?? 0" :to="coupons.to ?? 0" :total="coupons.total ?? 0" />
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <Modal :show="showModal" max-width="lg" :closeable="true" @close="closeModal">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">{{ editing ? 'Edit Coupon' : 'Create Coupon' }}</h3>
                <form @submit.prevent="submitForm" class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Coupon Code" required />
                            <TextInput v-model="form.code" type="text" class="mt-1.5 uppercase" placeholder="SAVE20" />
                            <InputError :message="form.errors.code" />
                        </div>
                        <div>
                            <InputLabel value="Discount Type" required />
                            <select v-model="form.discount_type" class="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                            <InputError :message="form.errors.discount_type" />
                        </div>
                        <div>
                            <InputLabel value="Discount Value" required />
                            <TextInput v-model="form.discount_amount" type="number" step="0.01" min="0" class="mt-1.5" placeholder="20" />
                            <InputError :message="form.errors.discount_amount" />
                        </div>
                        <div>
                            <InputLabel value="Use Limit (per coupon)" />
                            <TextInput v-model="form.use_limit_per_coupon" type="number" min="0" class="mt-1.5" placeholder="Unlimited" />
                            <InputError :message="form.errors.use_limit_per_coupon" />
                        </div>
                        <div>
                            <InputLabel value="Use Limit (per user)" />
                            <TextInput v-model="form.use_limit_per_user" type="number" min="0" class="mt-1.5" placeholder="Unlimited" />
                            <InputError :message="form.errors.use_limit_per_user" />
                        </div>
                        <div>
                            <InputLabel value="Minimum Spend ($)" />
                            <TextInput v-model="form.minimum_spend" type="number" step="0.01" min="0" class="mt-1.5" placeholder="0.00" />
                            <InputError :message="form.errors.minimum_spend" />
                        </div>
                        <div>
                            <InputLabel value="Maximum Spend ($)" />
                            <TextInput v-model="form.maximum_spend" type="number" step="0.01" min="0" class="mt-1.5" placeholder="No limit" />
                            <InputError :message="form.errors.maximum_spend" />
                        </div>
                        <div>
                            <InputLabel value="Expires At" />
                            <TextInput v-model="form.expires_at" type="date" class="mt-1.5" />
                            <InputError :message="form.errors.expires_at" />
                        </div>
                        <div class="flex items-center gap-3 mt-5">
                            <button type="button" @click="form.status = !form.status"
                                class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                :class="form.status ? 'bg-primary' : 'bg-gray-200'">
                                <span class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                                    :class="form.status ? 'translate-x-4' : 'translate-x-1'" />
                            </button>
                            <span class="text-sm text-gray-700">Active</span>
                        </div>
                    </div>
                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="form.processing">
                            <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin" />
                            {{ editing ? 'Update' : 'Create' }}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>

        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Coupon</h3>
                <p class="text-sm text-gray-600 mb-6">Delete coupon <strong>{{ selectedCoupon?.code }}</strong>?</p>
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button @click="confirmDelete" :disabled="deleteForm.processing" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Delete</button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import { Plus, Search, Filter, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

interface Coupon {
    id: number; code: string; discount_amount: number; discount_type: string;
    use_limit_per_coupon?: number; use_limit_per_user?: number; used_count?: number;
    minimum_spend?: number; maximum_spend?: number; expires_at?: string; status: boolean;
}

const props = defineProps<{
    coupons: { data: Coupon[]; links: any[]; from?: number; to?: number; total?: number };
    filters?: { search?: string; discount_type?: string; status?: string; per_page?: string };
}>();

const searchTerm = ref(props.filters?.search ?? '');
const typeFilter = ref(props.filters?.discount_type ?? '');
const statusFilter = ref(props.filters?.status ?? '');
const perPage = ref(props.filters?.per_page ?? '10');
const showFilters = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref<Coupon | null>(null);
const selectedCoupon = ref<Coupon | null>(null);

const form = useForm({
    code: '', discount_type: 'percentage', discount_amount: '',
    use_limit_per_coupon: '', use_limit_per_user: '',
    minimum_spend: '', maximum_spend: '', expires_at: '', status: true,
});
const deleteForm = useForm({});

const activeFilterCount = computed(() => [typeFilter.value, statusFilter.value].filter(Boolean).length);
const formatDate = (d: string) => new Date(d).toLocaleDateString();

const buildParams = () => {
    const p: Record<string, any> = { page: 1, per_page: perPage.value };
    if (searchTerm.value) p.search = searchTerm.value;
    if (typeFilter.value) p.discount_type = typeFilter.value;
    if (statusFilter.value !== '') p.status = statusFilter.value;
    return p;
};

const applyFilters = () => router.get(route('coupons.index'), buildParams(), { preserveState: true, preserveScroll: true });
const resetFilters = () => { searchTerm.value = ''; typeFilter.value = ''; statusFilter.value = ''; showFilters.value = false; router.get(route('coupons.index'), { page: 1, per_page: perPage.value }, { preserveState: true }); };

const openCreate = () => { editing.value = null; form.reset(); form.discount_type = 'percentage'; form.status = true; showModal.value = true; };
const openEdit = (c: Coupon) => {
    editing.value = c;
    form.code = c.code;
    form.discount_type = c.discount_type;
    form.discount_amount = String(c.discount_amount);
    form.use_limit_per_coupon = c.use_limit_per_coupon ? String(c.use_limit_per_coupon) : '';
    form.use_limit_per_user = c.use_limit_per_user ? String(c.use_limit_per_user) : '';
    form.minimum_spend = c.minimum_spend ? String(c.minimum_spend) : '';
    form.maximum_spend = c.maximum_spend ? String(c.maximum_spend) : '';
    form.expires_at = c.expires_at ? c.expires_at.split('T')[0] : '';
    form.status = c.status;
    showModal.value = true;
};
const closeModal = () => { showModal.value = false; form.reset(); editing.value = null; };

const submitForm = () => {
    if (editing.value) {
        form.put(route('coupons.update', editing.value.id), { onSuccess: closeModal });
    } else {
        form.post(route('coupons.store'), { onSuccess: closeModal });
    }
};

const toggleStatus = (c: Coupon) => router.put(route('coupons.toggle-status', c.id), {});
const handleDelete = (c: Coupon) => { selectedCoupon.value = c; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedCoupon.value) return;
    deleteForm.delete(route('coupons.destroy', selectedCoupon.value.id), { onSuccess: () => { showDeleteModal.value = false; } });
};
</script>
