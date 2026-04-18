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

            <div class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-gray-50">
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uses</th>
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
                                    {{ coupon.discount_type === 'percentage' ? coupon.discount + '%' : '$' + coupon.discount }}
                                </td>
                                <td class="px-4 py-3">
                                    <span class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">{{ coupon.discount_type }}</span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600">{{ coupon.used_count ?? 0 }} / {{ coupon.max_uses ?? '∞' }}</td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ coupon.expires_at ? formatDate(coupon.expires_at) : '—' }}</td>
                                <td class="px-4 py-3">
                                    <span class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                                        :class="coupon.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                                        {{ coupon.is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-1">
                                        <button @click="toggleStatus(coupon)" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Toggle Status">
                                            <ToggleLeft v-if="coupon.is_active" :size="15" />
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
                                <td colspan="7" class="px-4 py-12 text-center text-sm text-gray-400">No coupons found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Pagination :links="coupons.links" :from="coupons.from ?? 0" :to="coupons.to ?? 0" :total="coupons.total ?? 0" />
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <Modal :show="showModal" max-width="md" :closeable="true" @close="closeModal">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-5">{{ editing ? 'Edit Coupon' : 'Create Coupon' }}</h3>
                <Form @submit="submitForm" class="space-y-4" v-slot="{ errors }">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Coupon Code" required />
                            <Field name="code" :rules="codeSchema" v-model="form.code">
                                <TextInput v-model="form.code" type="text" :has-error="!!(errors.code || form.errors.code)" class="mt-1.5 uppercase" placeholder="SAVE20" />
                            </Field>
                            <ErrorMessage name="code" class="mt-1 text-sm text-red-600" />
                            <InputError :message="form.errors.code" />
                        </div>
                        <div>
                            <InputLabel value="Discount Type" required />
                            <select v-model="form.discount_type" class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200">
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel value="Discount Value" required />
                            <Field name="discount" :rules="discountSchema" v-model="form.discount">
                                <TextInput v-model="form.discount" type="number" :has-error="!!(errors.discount || form.errors.discount)" class="mt-1.5" placeholder="20" />
                            </Field>
                            <ErrorMessage name="discount" class="mt-1 text-sm text-red-600" />
                            <InputError :message="form.errors.discount" />
                        </div>
                        <div>
                            <InputLabel value="Max Uses" />
                            <TextInput v-model="form.max_uses" type="number" class="mt-1.5" placeholder="Unlimited" />
                        </div>
                        <div>
                            <InputLabel value="Expires At" />
                            <TextInput v-model="form.expires_at" type="date" class="mt-1.5" />
                        </div>
                        <div class="flex items-center gap-3 mt-6">
                            <input type="checkbox" v-model="form.is_active" id="is_active" class="rounded border-gray-300 text-primary-600" />
                            <label for="is_active" class="text-sm text-gray-700">Active</label>
                        </div>
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
import { ref } from 'vue';
import { Head, router, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

interface Coupon { id: number; code: string; discount: number; discount_type: string; max_uses?: number; used_count?: number; expires_at?: string; is_active: boolean }

const props = defineProps<{
    coupons: { data: Coupon[]; links: any[]; from?: number; to?: number; total?: number };
}>();

const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref<Coupon | null>(null);
const selectedCoupon = ref<Coupon | null>(null);

const form = useForm({ code: '', discount: '', discount_type: 'percentage', max_uses: '', expires_at: '', is_active: true });
const deleteForm = useForm({});

const codeSchema = yup.string().required('Code is required').min(3);
const discountSchema = yup.number().required('Discount is required').min(0).max(100);

const formatDate = (d: string) => new Date(d).toLocaleDateString();

const openCreate = () => { editing.value = null; form.reset(); form.discount_type = 'percentage'; form.is_active = true; showModal.value = true; };
const openEdit = (c: Coupon) => {
    editing.value = c;
    form.code = c.code;
    form.discount = String(c.discount);
    form.discount_type = c.discount_type;
    form.max_uses = c.max_uses ? String(c.max_uses) : '';
    form.expires_at = c.expires_at ? c.expires_at.split('T')[0] : '';
    form.is_active = c.is_active;
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
