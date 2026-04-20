<template>
    <AppLayout>
        <Head title="Currencies" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Currencies</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Manage supported currencies</p>
                </div>
                <button @click="openCreate" class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95">
                    <Plus :size="16" /> Add Currency
                </button>
            </div>

            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Symbol</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Default</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="(currency, index) in currencies.data" :key="currency.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3 text-gray-500">{{ (currencies.from ?? 0) + index }}</td>
                                <td class="px-4 py-3 font-medium text-gray-900">{{ currency.name }}</td>
                                <td class="px-4 py-3"><code class="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{{ currency.code }}</code></td>
                                <td class="px-4 py-3 font-semibold text-gray-700">{{ currency.symbol }}</td>
                                <td class="px-4 py-3 text-gray-600">{{ currency.description }}</td>
                                <td class="px-4 py-3">
                                    <span class="text-xs px-2.5 py-0.5 rounded-full font-medium"
                                        :class="currency.is_default ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'">
                                        {{ currency.is_default ? 'Yes' : 'No' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="openEdit(currency)" class="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"><Pencil :size="15" /></button>
                                        <button @click="handleDelete(currency)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 :size="15" /></button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!currencies.data?.length">
                                <td colspan="7" class="px-4 py-12 text-center text-sm text-gray-400">No currencies found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="currencies.links" :from="currencies.from ?? 0" :to="currencies.to ?? 0" :total="currencies.total ?? 0" />
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <Modal :show="showModal" max-width="sm" :closeable="true" @close="closeModal">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">{{ editing ? 'Edit Currency' : 'Add New Currency' }}</h3>
                <form @submit.prevent="submitForm" class="space-y-4">
                    <div>
                        <InputLabel value="Currency Name" required />
                        <TextInput v-model="form.name" type="text" class="mt-1.5" placeholder="e.g. US Dollar, Euro, British Pound" />
                        <InputError :message="form.errors.name" />
                    </div>
                    <div>
                        <InputLabel value="Currency Code" required />
                        <TextInput v-model="form.code" type="text" class="mt-1.5 uppercase" placeholder="e.g. USD, EUR, GBP" />
                        <InputError :message="form.errors.code" />
                    </div>
                    <div>
                        <InputLabel value="Currency Symbol" required />
                        <TextInput v-model="form.symbol" type="text" class="mt-1.5" placeholder="e.g. $, €, £" />
                        <InputError :message="form.errors.symbol" />
                    </div>
                    <div>
                        <InputLabel value="Description" />
                        <textarea v-model="form.description" rows="3" placeholder="Optional description about the currency"
                            class="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" />
                        <InputError :message="form.errors.description" />
                    </div>
                    <div class="flex items-center gap-2">
                        <input type="checkbox" id="is_default" v-model="form.is_default" class="w-4 h-4 rounded text-primary accent-primary" />
                        <label for="is_default" class="text-sm font-medium text-gray-700">Set as Default Currency</label>
                    </div>
                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="form.processing">
                            <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin" />
                            {{ editing ? 'Update' : 'Save' }}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>

        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Currency</h3>
                <p class="text-sm text-gray-600 mb-6">Delete <strong>{{ selectedCurrency?.name }}</strong>?</p>
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
import { Head, useForm } from '@inertiajs/vue3';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

interface Currency {
    id: number; name: string; code: string; symbol: string;
    description?: string; is_default: boolean;
}

const props = defineProps<{
    currencies: { data: Currency[]; links: any[]; from?: number; to?: number; total?: number };
}>();

const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref<Currency | null>(null);
const selectedCurrency = ref<Currency | null>(null);

const form = useForm({ name: '', code: '', symbol: '', description: '', is_default: false });
const deleteForm = useForm({});

const openCreate = () => { editing.value = null; form.reset(); showModal.value = true; };
const openEdit = (c: Currency) => {
    editing.value = c;
    form.name = c.name; form.code = c.code; form.symbol = c.symbol;
    form.description = c.description ?? ''; form.is_default = c.is_default;
    showModal.value = true;
};
const closeModal = () => { showModal.value = false; form.reset(); editing.value = null; };

const submitForm = () => {
    if (editing.value) {
        form.put(route('currencies.update', editing.value.id), { onSuccess: closeModal });
    } else {
        form.post(route('currencies.store'), { onSuccess: closeModal });
    }
};

const handleDelete = (c: Currency) => { selectedCurrency.value = c; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedCurrency.value) return;
    deleteForm.delete(route('currencies.destroy', selectedCurrency.value.id), { onSuccess: () => { showDeleteModal.value = false; } });
};
</script>
