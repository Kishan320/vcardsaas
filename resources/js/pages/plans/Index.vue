<template>
    <AppLayout>
        <Head title="Plans" />
        <FlashMessage />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Plans</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Manage subscription plans</p>
                </div>
                <Link
                    v-if="canManage"
                    :href="route('plans.create')"
                    class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95"
                >
                    <Plus :size="16" /> Create Plan
                </Link>
            </div>

            <!-- Plans Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    v-for="plan in plans"
                    :key="plan.id"
                    class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden"
                    :class="{ 'ring-2 ring-primary-500': plan.is_featured }"
                >
                    <div v-if="plan.is_featured" class="gradient-primary text-white text-xs font-semibold text-center py-1.5">
                        Most Popular
                    </div>
                    <div class="p-6">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h3 class="text-lg font-bold text-gray-900">{{ plan.name }}</h3>
                                <p class="text-sm text-gray-500 mt-0.5">{{ plan.description }}</p>
                            </div>
                            <span
                                class="text-xs px-2 py-0.5 rounded-full font-medium"
                                :class="plan.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'"
                            >
                                {{ plan.is_active ? 'Active' : 'Inactive' }}
                            </span>
                        </div>

                        <div class="mb-6">
                            <span class="text-3xl font-extrabold text-gray-900">${{ plan.price }}</span>
                            <span class="text-sm text-gray-500">/{{ plan.billing_cycle ?? 'month' }}</span>
                        </div>

                        <ul class="space-y-2 mb-6">
                            <li
                                v-for="(value, key) in plan.features"
                                :key="key"
                                class="flex items-center gap-2 text-sm text-gray-600"
                            >
                                <CheckCircle :size="14" class="text-green-500 flex-shrink-0" />
                                <span class="capitalize">{{ formatFeatureKey(String(key)) }}: {{ value }}</span>
                            </li>
                        </ul>

                        <div v-if="canManage" class="flex gap-2">
                            <Link
                                :href="route('plans.edit', plan.id)"
                                class="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Pencil :size="12" /> Edit
                            </Link>
                            <button
                                @click="togglePlanStatus(plan)"
                                class="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <ToggleLeft v-if="plan.is_active" :size="12" /> 
                                <ToggleRight v-else :size="12" />
                                {{ plan.is_active ? 'Deactivate' : 'Activate' }}
                            </button>
                            <button
                                @click="handleDeleteClick(plan)"
                                class="p-2 text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 :size="14" />
                            </button>
                        </div>

                        <!-- Subscribe button for non-admin -->
                        <div v-else>
                            <button
                                @click="subscribeToPlan(plan)"
                                class="w-full py-2.5 text-sm font-semibold rounded-xl transition-all"
                                :class="plan.is_featured
                                    ? 'gradient-primary text-white hover:opacity-90'
                                    : 'border border-primary-300 text-primary-600 hover:bg-primary-50'"
                            >
                                {{ currentPlanId === plan.id ? 'Current Plan' : 'Subscribe' }}
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="!plans.length" class="col-span-full bg-white border border-gray-100 rounded-2xl shadow-card p-12 text-center">
                    <Package :size="40" class="text-gray-300 mx-auto mb-4" />
                    <p class="text-gray-500">No plans available yet.</p>
                </div>
            </div>
        </div>

        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Plan</h3>
                <p class="text-sm text-gray-600 mb-6">Are you sure you want to delete <strong>{{ selectedPlan?.name }}</strong>?</p>
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
import { Head, Link, router, useForm, usePage } from '@inertiajs/vue3';
import { Plus, Pencil, Trash2, CheckCircle, ToggleLeft, ToggleRight, Package } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import type { PageProps, Plan } from '@/types';

const props = defineProps<{
    plans: Plan[];
    canManage?: boolean;
}>();

const page = usePage<PageProps>();
const currentPlanId = computed(() => (page.props.auth?.user as any)?.plan?.id);

const showDeleteModal = ref(false);
const selectedPlan = ref<Plan | null>(null);
const deleteForm = useForm({});

const formatFeatureKey = (key: string) => key.replace(/_/g, ' ');

const togglePlanStatus = (plan: Plan) => {
    router.post(route('plans.toggle-status', plan.id), {});
};

const subscribeToPlan = (plan: Plan) => {
    router.post(route('plans.subscribe'), { plan_id: plan.id });
};

const handleDeleteClick = (plan: Plan) => {
    selectedPlan.value = plan;
    showDeleteModal.value = true;
};

const confirmDelete = () => {
    if (!selectedPlan.value) return;
    deleteForm.delete(route('plans.destroy', selectedPlan.value.id), {
        onSuccess: () => { showDeleteModal.value = false; },
    });
};
</script>
