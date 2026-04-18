<template>
    <AppLayout>
        <Head title="Edit Plan" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex items-center gap-3">
                <Link :href="route('plans.index')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft :size="18" class="text-gray-500" />
                </Link>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Edit Plan</h1>
                    <p class="text-sm text-gray-500 mt-0.5">{{ plan?.name }}</p>
                </div>
            </div>

            <div class="max-w-2xl">
                <Form @submit="submit" class="space-y-4" v-slot="{ errors }">
                    <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Plan Name" required />
                                <Field name="name" :rules="nameSchema" v-model="form.name">
                                    <TextInput v-model="form.name" type="text" :has-error="!!(errors.name || form.errors.name)" class="mt-1.5" />
                                </Field>
                                <ErrorMessage name="name" class="mt-1 text-sm text-red-600" />
                                <InputError :message="form.errors.name" />
                            </div>
                            <div>
                                <InputLabel value="Price ($)" required />
                                <Field name="price" :rules="priceSchema" v-model="form.price">
                                    <TextInput v-model="form.price" type="number" step="0.01" :has-error="!!(errors.price || form.errors.price)" class="mt-1.5" />
                                </Field>
                                <ErrorMessage name="price" class="mt-1 text-sm text-red-600" />
                                <InputError :message="form.errors.price" />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Description" />
                            <textarea v-model="form.description" rows="3"
                                class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" />
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Max Businesses" required />
                                <TextInput v-model="form.business" type="number" class="mt-1.5" />
                                <InputError :message="form.errors.business" />
                            </div>
                            <div>
                                <InputLabel value="Storage (GB)" />
                                <TextInput v-model="form.storage_limit" type="number" class="mt-1.5" />
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="flex items-center gap-3">
                                <input type="checkbox" v-model="form.is_plan_enable" id="enabled" class="rounded border-gray-300 text-primary-600" />
                                <label for="enabled" class="text-sm text-gray-700">Active</label>
                            </div>
                            <div class="flex items-center gap-3">
                                <input type="checkbox" v-model="form.is_featured" id="featured" class="rounded border-gray-300 text-primary-600" />
                                <label for="featured" class="text-sm text-gray-700">Featured</label>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 justify-end">
                        <Link :href="route('plans.index')" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</Link>
                        <PrimaryButton :disabled="form.processing">
                            <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin" />
                            Save Changes
                        </PrimaryButton>
                    </div>
                </Form>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { ArrowLeft, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

const props = defineProps<{ plan: any }>();

const form = useForm({
    name: props.plan?.name ?? '',
    price: String(props.plan?.price ?? ''),
    description: props.plan?.description ?? '',
    business: String(props.plan?.business ?? 5),
    storage_limit: String(props.plan?.storage_limit ?? 5),
    is_plan_enable: props.plan?.is_plan_enable ?? true,
    is_featured: props.plan?.is_featured ?? false,
});

const nameSchema = yup.string().required('Plan name is required').min(2);
const priceSchema = yup.number().required('Price is required').min(0);

const submit = () => form.put(route('plans.update', props.plan.id));
</script>
