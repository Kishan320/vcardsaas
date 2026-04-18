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
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Currency</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Symbol</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Exchange Rate</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="currency in currencies.data" :key="currency.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3 font-medium text-gray-900">{{ currency.name }}</td>
                                <td class="px-4 py-3"><code class="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{{ currency.code }}</code></td>
                                <td class="px-4 py-3 text-lg font-semibold text-gray-700">{{ currency.symbol }}</td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ currency.exchange_rate }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="openEdit(currency)" class="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors"><Pencil :size="15" /></button>
                                        <button @click="handleDelete(currency)" class="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 :size="15" /></button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!currencies.data?.length">
                                <td colspan="5" class="px-4 py-12 text-center text-sm text-gray-400">No currencies found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="currencies.links" :from="currencies.from ?? 0" :to="currencies.to ?? 0" :total="currencies.total ?? 0" />
            </div>
        </div>

        <Modal :show="showModal" max-width="sm" :closeable="true" @close="closeModal">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">{{ editing ? 'Edit Currency' : 'Add Currency' }}</h3>
                <Form @submit="submitForm" class="space-y-4" v-slot="{ errors }">
                    <div>
                        <InputLabel value="Currency Name" required />
                        <Field name="name" :rules="nameSchema" v-model="form.name">
                            <TextInput v-model="form.name" type="text" :has-error="!!(errors.name || form.errors.name)" class="mt-1.5" placeholder="US Dollar" />
                        </Field>
                        <ErrorMessage name="name" class="mt-1 text-sm text-red-600" />
                        <InputError :message="form.errors.name" />
                    </div>
                    <div>
                        <InputLabel value="Code" required />
                        <Field name="code" :rules="codeSchema" v-model="form.code">
                            <TextInput v-model="form.code" type="text" :has-error="!!(errors.code || form.errors.code)" class="mt-1.5 uppercase" placeholder="USD" />
                        </Field>
                        <ErrorMessage name="code" class="mt-1 text-sm text-red-600" />
                        <InputError :message="form.errors.code" />
                    </div>
                    <div>
                        <InputLabel value="Symbol" required />
                        <Field name="symbol" :rules="symbolSchema" v-model="form.symbol">
                            <TextInput v-model="form.symbol" type="text" :has-error="!!(errors.symbol || form.errors.symbol)" class="mt-1.5" placeholder="$" />
                        </Field>
                        <ErrorMessage name="symbol" class="mt-1 text-sm text-red-600" />
                        <InputError :message="form.errors.symbol" />
                    </div>
                    <div>
                        <InputLabel value="Exchange Rate" required />
                        <Field name="exchange_rate" :rules="rateSchema" v-model="form.exchange_rate">
                            <TextInput v-model="form.exchange_rate" type="number" step="0.0001" :has-error="!!(errors.exchange_rate || form.errors.exchange_rate)" class="mt-1.5" placeholder="1.0000" />
                        </Field>
                        <ErrorMessage name="exchange_rate" class="mt-1 text-sm text-red-600" />
                        <InputError :message="form.errors.exchange_rate" />
                    </div>
                    <div class="flex gap-3 justify-end pt-2">
                        <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                        <PrimaryButton :disabled="form.processing">
                            <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin" />
                            {{ editing ? 'Update' : 'Create' }}
                        </PrimaryButton>
                    </div>
                </Form>
            </div>
        </Modal>

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
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

interface Currency { id: number; name: string; code: string; symbol: string; exchange_rate: number }

const props = defineProps<{
    currencies: { data: Currency[]; links: any[]; from?: number; to?: number; total?: number };
}>();

const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref<Currency | null>(null);
const selectedCurrency = ref<Currency | null>(null);

const form = useForm({ name: '', code: '', symbol: '', exchange_rate: '' });
const deleteForm = useForm({});

const nameSchema = yup.string().required('Name is required');
const codeSchema = yup.string().required('Code is required').length(3, 'Must be 3 characters');
const symbolSchema = yup.string().required('Symbol is required');
const rateSchema = yup.number().required('Rate is required').min(0);

const openCreate = () => { editing.value = null; form.reset(); showModal.value = true; };
const openEdit = (c: Currency) => { editing.value = c; form.name = c.name; form.code = c.code; form.symbol = c.symbol; form.exchange_rate = String(c.exchange_rate); showModal.value = true; };
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
