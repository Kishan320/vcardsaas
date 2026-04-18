<template>
    <AppLayout>
        <Head title="NFC Card Order Requests" />
        <FlashMessage />

        <div class="space-y-6">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">{{ isSuperAdmin ? 'NFC Card Order Requests' : 'My Order Requests' }}</h1>
                    <p class="text-sm text-gray-500 mt-0.5">{{ isSuperAdmin ? 'Review and manage all order requests' : 'Track your NFC card orders' }}</p>
                </div>
            </div>

            <!-- Search + Status filter -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4 flex flex-col sm:flex-row gap-3">
                <div class="relative flex-1">
                    <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="searchTerm" @keyup.enter="applyFilters" type="text" placeholder="Search requests…"
                        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
                </div>
                <select v-model="statusFilter" @change="applyFilters"
                    class="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <!-- Table -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                                <th v-if="isSuperAdmin" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Card</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Shipping Address</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="req in orderRequests?.data ?? []" :key="req.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3 text-gray-500">#{{ req.id }}</td>
                                <td v-if="isSuperAdmin" class="px-4 py-3 font-medium text-gray-900">{{ req.user?.name ?? '—' }}</td>
                                <td class="px-4 py-3 text-gray-700">{{ req.nfc_card?.name ?? '—' }}</td>
                                <td class="px-4 py-3 text-gray-700">{{ req.quantity }}</td>
                                <td class="px-4 py-3 text-gray-500 max-w-xs truncate">{{ req.shipping_address ?? '—' }}</td>
                                <td class="px-4 py-3">
                                    <span class="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                                        :class="{
                                            'bg-amber-50 text-amber-700': req.status === 'pending',
                                            'bg-green-50 text-green-700': req.status === 'approved',
                                            'bg-red-50 text-red-700': req.status === 'rejected',
                                        }">
                                        {{ req.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 font-medium text-gray-900">${{ parseFloat(req.total_price || 0).toFixed(2) }}</td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ new Date(req.created_at).toLocaleDateString() }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="openViewModal(req)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="View">
                                            <Eye :size="15" />
                                        </button>
                                        <template v-if="isSuperAdmin && req.status === 'pending'">
                                            <button @click="approve(req)" class="p-1.5 rounded-lg hover:bg-green-50 text-green-500 transition-colors" title="Approve">
                                                <CheckCircle :size="15" />
                                            </button>
                                            <button @click="reject(req)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Reject">
                                                <XCircle :size="15" />
                                            </button>
                                        </template>
                                        <button v-if="isSuperAdmin" @click="handleDelete(req)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!orderRequests?.data?.length">
                                <td :colspan="isSuperAdmin ? 9 : 8" class="px-4 py-12 text-center text-sm text-gray-400">No order requests found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="orderRequests?.links ?? []" :from="orderRequests?.from ?? 0" :to="orderRequests?.to ?? 0" :total="orderRequests?.total ?? 0" />
            </div>
        </div>

        <!-- View Order Details Modal -->
        <Modal :show="showViewModal" max-width="lg" :closeable="true" @close="showViewModal = false">
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-semibold text-gray-900">Order Request Details</h3>
                    <span class="text-xs px-2 py-1 rounded-full font-medium capitalize"
                        :class="{
                            'bg-amber-50 text-amber-700': selectedReq?.status === 'pending',
                            'bg-green-50 text-green-700': selectedReq?.status === 'approved',
                            'bg-red-50 text-red-700': selectedReq?.status === 'rejected',
                        }">
                        {{ selectedReq?.status }}
                    </span>
                </div>

                <div v-if="selectedReq" class="space-y-6">
                    <!-- User Info -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-medium text-gray-900 mb-3">User Information</h4>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-gray-500">Name:</span>
                                <p class="font-medium text-gray-900">{{ selectedReq.user?.name || 'â\u0080\u0094' }}</p>
                            </div>
                            <div>
                                <span class="text-gray-500">Order ID:</span>
                                <p class="font-medium text-gray-900">#{{ selectedReq.id }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- NFC Card Info -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-medium text-gray-900 mb-3">NFC Card Information</h4>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-gray-500">Card Name:</span>
                                <p class="font-medium text-gray-900">{{ selectedReq.nfc_card?.name || 'â\u0080\u0094' }}</p>
                            </div>
                            <div>
                                <span class="text-gray-500">Quantity:</span>
                                <p class="font-medium text-gray-900">{{ selectedReq.quantity }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Business Info -->
                    <div v-if="selectedReq.business" class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-medium text-gray-900 mb-3">Business Information</h4>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-gray-500">Business Name:</span>
                                <p class="font-medium text-gray-900">{{ selectedReq.business.name }}</p>
                            </div>
                            <div v-if="selectedReq.business.link">
                                <span class="text-gray-500">Business Link:</span>
                                <a :href="selectedReq.business.link" target="_blank" class="text-blue-600 hover:underline block truncate">{{ selectedReq.business.link }}</a>
                            </div>
                        </div>
                    </div>

                    <!-- Pricing -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-medium text-gray-900 mb-3">Pricing Details</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-500">Unit Price:</span>
                                <span class="font-medium text-gray-900">${{ parseFloat(selectedReq.original_price || 0).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500">Quantity:</span>
                                <span class="font-medium text-gray-900">× {{ selectedReq.quantity }}</span>
                            </div>
                            <div class="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2">
                                <span>Total Price:</span>
                                <span>${{ parseFloat(selectedReq.total_price || 0).toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Shipping Address -->
                    <div v-if="selectedReq.shipping_address" class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-medium text-gray-900 mb-3">Shipping Address</h4>
                        <p class="text-sm text-gray-700">{{ selectedReq.shipping_address }}</p>
                    </div>

                    <!-- Logo -->
                    <div v-if="selectedReq.logo" class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-medium text-gray-900 mb-3">Logo</h4>
                        <img :src="`/storage/${selectedReq.logo}`" alt="Logo" class="h-20 w-20 object-cover rounded-lg">
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 justify-end pt-6 border-t border-gray-200">
                    <template v-if="isSuperAdmin && selectedReq?.status === 'pending'">
                        <button @click="approve(selectedReq); showViewModal = false" class="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700">Approve</button>
                        <button @click="reject(selectedReq); showViewModal = false" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700">Reject</button>
                    </template>
                    <button @click="showViewModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Close</button>
                </div>
            </div>
        </Modal>

        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Order Request</h3>
                <p class="text-sm text-gray-600 mb-6">Delete order <strong>#{{ selectedReq?.id }}</strong>?</p>
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
import { Head, router, useForm, usePage } from '@inertiajs/vue3';
import { CheckCircle, XCircle, Trash2, Search, Eye } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import type { PageProps } from '@/types';

interface OrderRequest {
    id: number; quantity: number; status: string; shipping_address?: string; created_at: string;
    total_price?: string; original_price?: string; logo?: string; business_id?: number;
    user?: { name: string }; nfc_card?: { name: string }; business?: { name: string; link?: string };
}

const page = usePage<PageProps>();
const props = defineProps<{
    orderRequests?: { data: OrderRequest[]; links: any[]; from?: number; to?: number; total?: number };
    filters?: { search?: string; status?: string };
}>();

const isSuperAdmin = computed(() => {
    const u = page.props.auth?.user as any;
    return !!(u?.is_super_admin || u?.type === 'superadmin' || u?.type === 'super admin');
});

const searchTerm = ref(props.filters?.search ?? '');
const statusFilter = ref(props.filters?.status ?? '');
const showDeleteModal = ref(false);
const showViewModal = ref(false);
const selectedReq = ref<OrderRequest | null>(null);
const deleteForm = useForm({});

const applyFilters = () => router.get(route('nfc-cards.order-requests'), {
    search: searchTerm.value || undefined,
    status: statusFilter.value || undefined,
}, { preserveState: true });

const approve = (r: OrderRequest) => router.post(route('nfc-cards.approve-order', r.id), {});
const reject = (r: OrderRequest) => router.post(route('nfc-cards.reject-order', r.id), {});
const handleDelete = (r: OrderRequest) => { selectedReq.value = r; showDeleteModal.value = true; };
const openViewModal = (r: OrderRequest) => { selectedReq.value = r; showViewModal.value = true; };
const confirmDelete = () => {
    if (!selectedReq.value) return;
    deleteForm.delete(route('nfc-cards.order-requests.destroy', selectedReq.value.id), {
        onSuccess: () => { showDeleteModal.value = false; },
    });
};
</script>
