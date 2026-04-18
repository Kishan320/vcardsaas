<template>
    <AppLayout>
        <Head title="Plan Requests" />
        <FlashMessage />

        <div class="space-y-6">
            <!-- Header -->
            <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ isSuperAdmin ? 'Plan Requests' : 'My Plan Requests' }}</h1>
                <p class="text-sm text-gray-500 mt-0.5">Manage plan upgrade requests from users</p>
            </div>

            <!-- Search & Filters -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4 space-y-3">
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="relative flex-1">
                        <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="searchTerm" type="text" placeholder="Search plan requests…"
                            class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
                            @keyup.enter="applyFilters" />
                    </div>
                    <button @click="applyFilters"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all">
                        <Search :size="14" /> Search
                    </button>
                    <button @click="showFilters = !showFilters"
                        class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all relative">
                        <Filter :size="14" /> Filters
                        <span v-if="activeFilterCount > 0"
                            class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                            {{ activeFilterCount }}
                        </span>
                    </button>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <span>Per Page:</span>
                        <select v-model="perPage" @change="applyFilters"
                            class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>

                <!-- Expanded filters -->
                <div v-if="showFilters" class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                    <div>
                        <label class="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                        <select v-model="statusFilter" @change="applyFilters"
                            class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button @click="resetFilters" class="text-sm text-red-500 hover:text-red-700 font-medium">
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th v-if="isSuperAdmin" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th v-if="isSuperAdmin" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan Name</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested At</th>
                                <th v-if="isSuperAdmin" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved/Rejected By</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="req in planRequests.data" :key="req.id" class="hover:bg-gray-50 transition-colors">
                                <td v-if="isSuperAdmin" class="px-4 py-3">
                                    <p class="font-medium text-gray-900">{{ req.user?.name }}</p>
                                </td>
                                <td v-if="isSuperAdmin" class="px-4 py-3 text-sm text-gray-500">
                                    {{ req.user?.email ?? '—' }}
                                </td>
                                <td class="px-4 py-3">
                                    <span class="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                                        {{ req.plan?.name ?? '—' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                                        :class="{
                                            'bg-amber-50 text-amber-700': req.status === 'pending',
                                            'bg-green-50 text-green-700': req.status === 'approved',
                                            'bg-red-50 text-red-700': req.status === 'rejected',
                                        }">
                                        {{ req.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(req.created_at) }}</td>
                                <td v-if="isSuperAdmin" class="px-4 py-3 text-sm text-gray-500">
                                    <span v-if="req.status === 'approved' && req.approver">
                                        <span class="text-xs text-green-600 font-medium">✓ {{ req.approver.name }}</span>
                                        <span class="block text-xs text-gray-400">{{ formatDate(req.approved_at) }}</span>
                                    </span>
                                    <span v-else-if="req.status === 'rejected' && req.rejector">
                                        <span class="text-xs text-red-600 font-medium">✗ {{ req.rejector.name }}</span>
                                        <span class="block text-xs text-gray-400">{{ formatDate(req.rejected_at) }}</span>
                                    </span>
                                    <span v-else class="text-gray-300">—</span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <!-- Admin: approve/reject pending -->
                                        <template v-if="isSuperAdmin && req.status === 'pending'">
                                            <button @click="approve(req)"
                                                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                                                title="Approve">
                                                <Check :size="13" /> Approve
                                            </button>
                                            <button @click="reject(req)"
                                                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                                                title="Reject">
                                                <X :size="13" /> Reject
                                            </button>
                                        </template>
                                        <!-- Admin: always can delete -->
                                        <button v-if="isSuperAdmin" @click="handleDelete(req)"
                                            class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                        <!-- Company user: can only delete their own pending -->
                                        <button v-if="!isSuperAdmin && req.status === 'pending'" @click="handleDelete(req)"
                                            class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!planRequests.data?.length">
                                <td :colspan="isSuperAdmin ? 7 : 4" class="px-4 py-12 text-center text-sm text-gray-400">
                                    No plan requests found
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination
                    :links="planRequests.links"
                    :from="planRequests.from ?? 0"
                    :to="planRequests.to ?? 0"
                    :total="planRequests.total ?? 0" />
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Request</h3>
                <p class="text-sm text-gray-600 mb-6">
                    Delete plan request for <strong>{{ selectedReq?.plan?.name }}</strong>
                    <span v-if="selectedReq?.user?.name"> by <strong>{{ selectedReq.user.name }}</strong></span>?
                </p>
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                    <button @click="confirmDelete" :disabled="deleteForm.processing"
                        class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import { Search, Filter, Check, X, Trash2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';

interface PlanRequest {
    id: number;
    status: string;
    message?: string;
    created_at: string;
    approved_at?: string;
    rejected_at?: string;
    user?: { name: string; email?: string };
    plan?: { name: string };
    approver?: { name: string };
    rejector?: { name: string };
}

const props = defineProps<{
    planRequests: { data: PlanRequest[]; links: any[]; from?: number; to?: number; total?: number };
    isSuperAdmin?: boolean;
    filters?: { search?: string; status?: string; per_page?: string };
}>();

const searchTerm  = ref(props.filters?.search ?? '');
const statusFilter = ref(props.filters?.status ?? '');
const perPage     = ref(props.filters?.per_page ?? '10');
const showFilters = ref(false);
const showDeleteModal = ref(false);
const selectedReq = ref<PlanRequest | null>(null);
const deleteForm  = useForm({});

const activeFilterCount = computed(() => [statusFilter.value].filter(Boolean).length);

const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString() : '—';

const buildParams = () => {
    const p: Record<string, any> = { page: 1, per_page: perPage.value };
    if (searchTerm.value)  p.search = searchTerm.value;
    if (statusFilter.value) p.status = statusFilter.value;
    return p;
};

const applyFilters = () =>
    router.get(route('plan-requests.index'), buildParams(), { preserveState: true, preserveScroll: true });

const resetFilters = () => {
    searchTerm.value = '';
    statusFilter.value = '';
    showFilters.value = false;
    router.get(route('plan-requests.index'), { page: 1, per_page: perPage.value }, { preserveState: true });
};

const approve = (r: PlanRequest) => router.post(route('plan-requests.approve', r.id), {});
const reject  = (r: PlanRequest) => router.post(route('plan-requests.reject', r.id), {});

const handleDelete = (r: PlanRequest) => { selectedReq.value = r; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedReq.value) return;
    deleteForm.delete(route('plan-requests.destroy', selectedReq.value.id), {
        onSuccess: () => { showDeleteModal.value = false; },
    });
};
</script>
