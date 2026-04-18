<template>
    <AppLayout>
        <Head title="NFC Cards" />
        <FlashMessage />

        <div class="space-y-6">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">NFC Cards</h1>
                    <p class="text-sm text-gray-500 mt-0.5">{{ isAdmin ? 'Manage NFC card catalog' : 'Order physical NFC cards' }}</p>
                </div>
                <div class="flex items-center gap-2">
                    <!-- View toggle -->
                    <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button @click="activeView = 'grid'" class="p-2 transition-colors" :class="activeView === 'grid' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-gray-500'">
                            <LayoutGrid :size="15" />
                        </button>
                        <button @click="activeView = 'list'" class="p-2 transition-colors" :class="activeView === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-gray-500'">
                            <List :size="15" />
                        </button>
                    </div>
                    <button v-if="isAdmin" @click="openCreate" class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95">
                        <Plus :size="16" /> Create NFC Card
                    </button>
                </div>
            </div>

            <!-- Search -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4">
                <div class="relative max-w-sm">
                    <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="searchTerm" @keyup.enter="applyFilters" type="text" placeholder="Search NFC cards…"
                        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
                </div>
            </div>

            <!-- Grid View -->
            <div v-if="activeView === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div v-for="card in nfcCards.data" :key="card.id"
                    class="group bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden hover:shadow-md transition-all duration-200">
                    <div class="p-4">
                        <!-- Header -->
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="font-semibold text-gray-900 truncate">{{ card.name }}</h3>
                            <div v-if="isAdmin" class="flex items-center gap-1">
                                <button @click="toggleStatus(card)"
                                    class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                    :class="card.is_enabled ? 'bg-primary' : 'bg-gray-200'">
                                    <span class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                                        :class="card.is_enabled ? 'translate-x-4' : 'translate-x-1'" />
                                </button>
                            </div>
                        </div>

                        <!-- Admin stats -->
                        <div v-if="isAdmin" class="flex gap-3 mb-3 text-xs text-gray-500">
                            <span>Price: <strong class="text-gray-900">${{ parseFloat(card.price).toFixed(2) }}</strong></span>
                            <span>Qty: <strong class="text-gray-900">{{ card.quantity }}</strong></span>
                        </div>

                        <!-- Flip card images -->
                        <div class="relative h-40 mb-4 cursor-pointer" style="perspective: 800px" @mouseenter="flippedCards.add(card.id)" @mouseleave="flippedCards.delete(card.id)">
                            <div class="absolute inset-0 transition-transform duration-700" style="transform-style: preserve-3d"
                                :style="flippedCards.has(card.id) ? 'transform: rotateY(180deg)' : ''">
                                <!-- Front -->
                                <div class="absolute inset-0 rounded-xl overflow-hidden" style="backface-visibility: hidden">
                                    <img v-if="card.front_image" :src="getImageUrl(card.front_image)" alt="Front"
                                        class="w-full h-full object-cover"
                                        @error="(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/400x200?text=No+Image')" />
                                    <div v-else class="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col items-center justify-center">
                                        <Nfc :size="28" class="text-primary-400 mb-1" />
                                        <p class="text-xs text-primary-400">No Front Image</p>
                                    </div>
                                    <span class="absolute top-2 left-2 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Front</span>
                                </div>
                                <!-- Back -->
                                <div class="absolute inset-0 rounded-xl overflow-hidden" style="backface-visibility: hidden; transform: rotateY(180deg)">
                                    <img v-if="card.back_image" :src="getImageUrl(card.back_image)" alt="Back"
                                        class="w-full h-full object-cover"
                                        @error="(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/400x200?text=No+Image')" />
                                    <div v-else class="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center">
                                        <Nfc :size="28" class="text-gray-400 mb-1" />
                                        <p class="text-xs text-gray-400">No Back Image</p>
                                    </div>
                                    <span class="absolute top-2 left-2 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Back</span>
                                </div>
                            </div>
                        </div>
                        <p class="text-xs text-gray-400 text-center mb-3">Hover to flip</p>

                        <!-- Actions -->
                        <div v-if="isAdmin" class="flex gap-2">
                            <button @click="openEdit(card)" class="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <Pencil :size="12" /> Edit
                            </button>
                            <button @click="handleDelete(card)" class="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                <Trash2 :size="12" /> Delete
                            </button>
                        </div>
                        <div v-else class="space-y-2">
                            <div class="text-center">
                                <p class="text-lg font-bold text-primary">${{ parseFloat(card.price).toFixed(2) }}</p>
                                <p class="text-xs text-gray-400">per card</p>
                            </div>
                            <button @click="openOrderRequest(card)" class="w-full py-2 text-sm font-semibold gradient-primary text-white rounded-lg hover:opacity-90 transition-all">
                                Order Request
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="!nfcCards.data?.length" class="col-span-full bg-white border border-gray-100 rounded-2xl shadow-card p-12 text-center text-sm text-gray-400">
                    No NFC cards found
                </div>
            </div>

            <!-- List View -->
            <div v-else class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Front</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Back</th>
                                <th v-if="isAdmin" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th v-if="isAdmin" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                                <th v-if="isAdmin" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="card in nfcCards.data" :key="card.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3 font-medium text-gray-900">{{ card.name }}</td>
                                <td class="px-4 py-3">
                                    <img v-if="card.front_image" :src="getImageUrl(card.front_image)" class="h-10 w-10 object-cover rounded"
                                        @error="(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=N/A')" />
                                    <div v-else class="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">N/A</div>
                                </td>
                                <td class="px-4 py-3">
                                    <img v-if="card.back_image" :src="getImageUrl(card.back_image)" class="h-10 w-10 object-cover rounded"
                                        @error="(e) => ((e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=N/A')" />
                                    <div v-else class="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">N/A</div>
                                </td>
                                <td v-if="isAdmin" class="px-4 py-3 text-sm text-gray-600">${{ parseFloat(card.price).toFixed(2) }}</td>
                                <td v-if="isAdmin" class="px-4 py-3 text-sm text-gray-600">{{ card.quantity }}</td>
                                <td v-if="isAdmin" class="px-4 py-3">
                                    <button @click="toggleStatus(card)"
                                        class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                        :class="card.is_enabled ? 'bg-primary' : 'bg-gray-200'">
                                        <span class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                                            :class="card.is_enabled ? 'translate-x-4' : 'translate-x-1'" />
                                    </button>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <template v-if="isAdmin">
                                            <button @click="openEdit(card)" class="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"><Pencil :size="15" /></button>
                                            <button @click="handleDelete(card)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 :size="15" /></button>
                                        </template>
                                        <button v-else @click="openOrderRequest(card)" class="px-3 py-1.5 text-xs font-semibold gradient-primary text-white rounded-lg hover:opacity-90">
                                            Order Request
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!nfcCards.data?.length">
                                <td :colspan="isAdmin ? 7 : 4" class="px-4 py-12 text-center text-sm text-gray-400">No NFC cards found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="nfcCards.links" :from="nfcCards.from ?? 0" :to="nfcCards.to ?? 0" :total="nfcCards.total ?? 0" />
            </div>
        </div>

        <!-- Admin Create/Edit Modal -->
        <Modal :show="showModal" max-width="md" :closeable="true" @close="closeModal">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">{{ editing ? 'Edit NFC Card' : 'Create NFC Card' }}</h3>
                <form @submit.prevent="submitForm" class="space-y-4">
                    <div>
                        <InputLabel value="Name" required />
                        <TextInput v-model="form.name" type="text" class="mt-1.5" />
                        <InputError :message="form.errors.name" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Price" required />
                            <TextInput v-model="form.price" type="number" step="0.01" min="0" class="mt-1.5" />
                            <InputError :message="form.errors.price" />
                        </div>
                        <div>
                            <InputLabel value="Quantity" required />
                            <TextInput v-model="form.quantity" type="number" min="0" class="mt-1.5" />
                            <InputError :message="form.errors.quantity" />
                        </div>
                    </div>
                    <div>
                        <MediaPicker 
                            label="Front Image" 
                            :value="form.front_image" 
                            :onChange="(value) => form.front_image = value"
                            placeholder="Select front image..."
                            :showPreview="true"
                        />
                        <InputError :message="form.errors.front_image" />
                    </div>
                    <div>
                        <MediaPicker 
                            label="Back Image" 
                            :value="form.back_image" 
                            :onChange="(value) => form.back_image = value"
                            placeholder="Select back image..."
                            :showPreview="true"
                        />
                        <InputError :message="form.errors.back_image" />
                    </div>
                    <div class="flex items-center gap-3">
                        <button type="button" @click="form.is_enabled = !form.is_enabled"
                            class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                            :class="form.is_enabled ? 'bg-primary' : 'bg-gray-200'">
                            <span class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                                :class="form.is_enabled ? 'translate-x-4' : 'translate-x-1'" />
                        </button>
                        <span class="text-sm text-gray-700">Enable Card</span>
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

        <!-- Order Request Modal (company users) -->
        <Modal :show="showOrderModal" max-width="sm" :closeable="true" @close="showOrderModal = false">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">Order Request</h3>
                <p class="text-sm text-gray-500 mb-5">{{ selectedCard?.name }}</p>
                <form @submit.prevent="submitOrderRequest" class="space-y-4">
                    <div>
                        <InputLabel value="Quantity" required />
                        <TextInput v-model="orderForm.quantity" type="number" min="1" class="mt-1.5" />
                        <InputError :message="orderForm.errors.quantity" />
                    </div>
                    <div>
                        <InputLabel value="Shipping Address" />
                        <textarea v-model="orderForm.shipping_address" rows="3"
                            class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" />
                        <InputError :message="orderForm.errors.shipping_address" />
                    </div>
                    <div v-if="businesses?.length">
                        <InputLabel value="Business" />
                        <select v-model="orderForm.business_id" class="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
                            <option value="">Select Business</option>
                            <option v-for="b in businesses" :key="b.id" :value="b.id">{{ b.name }}</option>
                        </select>
                    </div>
                    <!-- Price summary -->
                    <div v-if="selectedCard" class="bg-gray-50 rounded-lg p-3 text-sm">
                        <div class="flex justify-between text-gray-600">
                            <span>Unit Price</span>
                            <span>${{ parseFloat(selectedCard.price).toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between text-gray-600 mt-1">
                            <span>Quantity</span>
                            <span>× {{ orderForm.quantity || 1 }}</span>
                        </div>
                        <div class="flex justify-between font-semibold text-gray-900 border-t border-gray-200 mt-2 pt-2">
                            <span>Total</span>
                            <span>${{ (parseFloat(selectedCard.price) * (Number(orderForm.quantity) || 1)).toFixed(2) }}</span>
                        </div>
                    </div>
                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="showOrderModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="orderForm.processing">
                            <Loader2 v-if="orderForm.processing" :size="14" class="mr-1 animate-spin" />
                            Submit Order
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>

        
        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete NFC Card</h3>
                <p class="text-sm text-gray-600 mb-6">Delete <strong>{{ selectedCard?.name }}</strong>?</p>
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button @click="confirmDelete" :disabled="deleteForm.processing" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Delete</button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Head, router, useForm, usePage } from '@inertiajs/vue3';
import { Plus, Search, Pencil, Trash2, Loader2, LayoutGrid, List, Nfc } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';
import MediaPicker from '@/components/MediaPicker.vue';
import type { PageProps } from '@/types';

interface NfcCard {
    id: number; name: string; price: string; quantity: number;
    front_image?: string; back_image?: string; is_enabled: boolean; created_at: string;
}

const page = usePage<PageProps>();
const props = defineProps<{
    nfcCards: { data: NfcCard[]; links: any[]; from?: number; to?: number; total?: number };
    isAdmin?: boolean;
    businesses?: { id: number; name: string }[];
    filters?: { search?: string };
}>();

const searchTerm = ref(props.filters?.search ?? '');
const activeView = ref<'grid' | 'list'>('grid');
const flippedCards = reactive(new Set<number>());

const showModal = ref(false);
const showDeleteModal = ref(false);
const showOrderModal = ref(false);
const editing = ref<NfcCard | null>(null);
const selectedCard = ref<NfcCard | null>(null);

const form = useForm({ name: '', price: '', quantity: '', front_image: '', back_image: '', is_enabled: true });
const orderForm = useForm({ nfc_card_id: '', quantity: 1, shipping_address: '', business_id: '' });
const deleteForm = useForm({});

function getImageUrl(path: string) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = (window as any).appSettings?.imageUrl || '';
    return path.startsWith('/') ? `${base}${path}` : `${base}/storage/${path}`;
}

const applyFilters = () => router.get(route('nfc-cards.index'), { search: searchTerm.value || undefined }, { preserveState: true });

const openCreate = () => { editing.value = null; form.reset(); form.is_enabled = true; showModal.value = true; };
const openEdit = (c: NfcCard) => {
    editing.value = c;
    form.name = c.name; form.price = String(c.price); form.quantity = String(c.quantity);
    form.front_image = c.front_image ?? ''; form.back_image = c.back_image ?? '';
    form.is_enabled = c.is_enabled;
    showModal.value = true;
};
const closeModal = () => { showModal.value = false; form.reset(); editing.value = null; };

const submitForm = () => {
    if (editing.value) {
        form.put(route('nfc-cards.update', editing.value.id), { onSuccess: closeModal });
    } else {
        form.post(route('nfc-cards.store'), { onSuccess: closeModal });
    }
};

const openOrderRequest = (c: NfcCard) => {
    selectedCard.value = c;
    orderForm.reset();
    orderForm.nfc_card_id = String(c.id);
    orderForm.quantity = 1;
    showOrderModal.value = true;
};

const submitOrderRequest = () => {
    orderForm.post(route('nfc-cards.order-request'), {
        onSuccess: () => { showOrderModal.value = false; orderForm.reset(); },
    });
};

const toggleStatus = (c: NfcCard) => router.put(route('nfc-cards.toggle-status', c.id), {});
const handleDelete = (c: NfcCard) => { selectedCard.value = c; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedCard.value) return;
    deleteForm.delete(route('nfc-cards.destroy', selectedCard.value.id), { onSuccess: () => { showDeleteModal.value = false; } });
};

</script>
