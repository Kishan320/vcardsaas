<template>
    <AppLayout>
        <Head title="NFC Cards" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">NFC Cards</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Manage physical NFC card orders</p>
                </div>
                <button @click="openCreate" class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95">
                    <Plus :size="16" /> Order NFC Card
                </button>
            </div>

            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Card</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="card in nfcCards.data" :key="card.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                                            <Layers :size="16" class="text-primary-600" />
                                        </div>
                                        <span class="font-medium text-gray-900">{{ card.name ?? 'NFC Card #' + card.id }}</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ card.business?.name ?? '—' }}</td>
                                <td class="px-4 py-3">
                                    <span class="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                                        :class="card.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'">
                                        {{ card.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(card.created_at) }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="toggleStatus(card)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Toggle Status">
                                            <ToggleLeft v-if="card.is_active" :size="15" />
                                            <ToggleRight v-else :size="15" />
                                        </button>
                                        <button @click="openEdit(card)" class="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors" title="Edit">
                                            <Pencil :size="15" />
                                        </button>
                                        <button @click="handleDelete(card)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!nfcCards.data?.length">
                                <td colspan="5" class="px-4 py-12 text-center text-sm text-gray-400">No NFC cards found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="nfcCards.links" :from="nfcCards.from ?? 0" :to="nfcCards.to ?? 0" :total="nfcCards.total ?? 0" />
            </div>
        </div>

        <Modal :show="showModal" max-width="sm" :closeable="true" @close="closeModal">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">{{ editing ? 'Edit NFC Card' : 'Order NFC Card' }}</h3>
                <Form @submit="submitForm" class="space-y-4" v-slot="{ errors }">
                    <div>
                        <InputLabel value="Card Name" />
                        <TextInput v-model="form.name" type="text" class="mt-1.5" placeholder="My NFC Card" />
                        <InputError :message="form.errors.name" />
                    </div>
                    <div>
                        <InputLabel value="Business" />
                        <select v-model="form.business_id" class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="">Select Business</option>
                            <option v-for="b in businesses" :key="b.id" :value="b.id">{{ b.name }}</option>
                        </select>
                    </div>
                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="form.processing">
                            <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin" />
                            {{ editing ? 'Update' : 'Order' }}
                        </PrimaryButton>
                    </div>
                </Form>
            </div>
        </Modal>

        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete NFC Card</h3>
                <p class="text-sm text-gray-600 mb-6">Delete this NFC card?</p>
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
import { Form } from 'vee-validate';
import { Plus, Layers, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

interface NfcCard { id: number; name?: string; is_active: boolean; created_at: string; business?: { name: string }; business_id?: number }

const props = defineProps<{
    nfcCards: { data: NfcCard[]; links: any[]; from?: number; to?: number; total?: number };
    businesses?: { id: number; name: string }[];
}>();

const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref<NfcCard | null>(null);
const selectedCard = ref<NfcCard | null>(null);

const form = useForm({ name: '', business_id: '' });
const deleteForm = useForm({});

const formatDate = (d: string) => new Date(d).toLocaleDateString();

const openCreate = () => { editing.value = null; form.reset(); showModal.value = true; };
const openEdit = (c: NfcCard) => { editing.value = c; form.name = c.name ?? ''; form.business_id = c.business_id ? String(c.business_id) : ''; showModal.value = true; };
const closeModal = () => { showModal.value = false; form.reset(); editing.value = null; };

const submitForm = () => {
    if (editing.value) {
        form.put(route('nfc-cards.update', editing.value.id), { onSuccess: closeModal });
    } else {
        form.post(route('nfc-cards.store'), { onSuccess: closeModal });
    }
};

const toggleStatus = (c: NfcCard) => router.put(route('nfc-cards.toggle-status', c.id), {});
const handleDelete = (c: NfcCard) => { selectedCard.value = c; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedCard.value) return;
    deleteForm.delete(route('nfc-cards.destroy', selectedCard.value.id), { onSuccess: () => { showDeleteModal.value = false; } });
};
</script>
