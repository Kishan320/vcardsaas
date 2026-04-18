<template>
    <AppLayout>
        <Head title="Plan Requests" />
        <FlashMessage />
        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Plan Requests</h1>
                <p class="text-sm text-gray-500 mt-0.5">Manage plan upgrade requests</p>
            </div>

            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested Plan</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="req in planRequests.data" :key="req.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3 font-medium text-gray-900">{{ req.user?.name }}</td>
                                <td class="px-4 py-3">
                                    <span class="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">{{ req.plan?.name }}</span>
                                </td>
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
                                <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(req.created_at) }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button v-if="req.status === 'pending'" @click="approve(req)" class="p-1.5 rounded-lg hover:bg-green-50 text-green-500 transition-colors" title="Approve">
                                            <CheckCircle :size="15" />
                                        </button>
                                        <button v-if="req.status === 'pending'" @click="reject(req)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Reject">
                                            <XCircle :size="15" />
                                        </button>
                                        <button @click="handleDelete(req)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!planRequests.data?.length">
                                <td colspan="5" class="px-4 py-12 text-center text-sm text-gray-400">No plan requests found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="planRequests.links" :from="planRequests.from ?? 0" :to="planRequests.to ?? 0" :total="planRequests.total ?? 0" />
            </div>
        </div>

        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Request</h3>
                <p class="text-sm text-gray-600 mb-6">Delete this plan request?</p>
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button @click="confirmDelete" :disabled="deleteForm.processing" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Delete</button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import { CheckCircle, XCircle, Trash2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';

interface PlanRequest { id: number; status: string; created_at: string; user?: { name: string }; plan?: { name: string } }

const props = defineProps<{
    planRequests: { data: PlanRequest[]; links: any[]; from?: number; to?: number; total?: number };
}>();

const showDeleteModal = ref(false);
const selectedReq = ref<PlanRequest | null>(null);
const deleteForm = useForm({});

const formatDate = (d: string) => new Date(d).toLocaleDateString();
const approve = (r: PlanRequest) => router.post(route('plan-requests.approve', r.id), {});
const reject = (r: PlanRequest) => router.post(route('plan-requests.reject', r.id), {});
const handleDelete = (r: PlanRequest) => { selectedReq.value = r; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedReq.value) return;
    deleteForm.delete(route('plan-requests.destroy', selectedReq.value.id), { onSuccess: () => { showDeleteModal.value = false; } });
};
</script>
