<template>
    <AppLayout>
        <Head title="Domain Requests" />
        <FlashMessage />
        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Domain Requests</h1>
                <p class="text-sm text-gray-500 mt-0.5">Manage custom domain requests from companies</p>
            </div>

            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Domain</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="req in domainRequests.data" :key="req.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <code class="text-sm font-mono text-gray-800">{{ req.domain }}</code>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ req.user?.name }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ req.business?.name }}</td>
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
                            <tr v-if="!domainRequests.data?.length">
                                <td colspan="6" class="px-4 py-12 text-center text-sm text-gray-400">No domain requests found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="domainRequests.links" :from="domainRequests.from ?? 0" :to="domainRequests.to ?? 0" :total="domainRequests.total ?? 0" />
            </div>
        </div>

        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Request</h3>
                <p class="text-sm text-gray-600 mb-6">Delete domain request for <strong>{{ selectedReq?.domain }}</strong>?</p>
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

interface DomainRequest { id: number; domain: string; status: string; created_at: string; user?: { name: string }; business?: { name: string } }

const props = defineProps<{
    domainRequests: { data: DomainRequest[]; links: any[]; from?: number; to?: number; total?: number };
}>();

const showDeleteModal = ref(false);
const selectedReq = ref<DomainRequest | null>(null);
const deleteForm = useForm({});

const formatDate = (d: string) => new Date(d).toLocaleDateString();
const approve = (r: DomainRequest) => router.post(route('domain-requests.approve', r.id), {});
const reject = (r: DomainRequest) => router.post(route('domain-requests.reject', r.id), {});
const handleDelete = (r: DomainRequest) => { selectedReq.value = r; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedReq.value) return;
    deleteForm.delete(route('domain-requests.destroy', selectedReq.value.id), { onSuccess: () => { showDeleteModal.value = false; } });
};
</script>
