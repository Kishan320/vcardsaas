<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Head title="Password Protected" />
        <div class="bg-white rounded-2xl shadow-card p-8 w-full max-w-sm text-center">
            <div class="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock :size="28" class="text-white" />
            </div>
            <h1 class="text-xl font-bold text-gray-900 mb-2">Password Protected</h1>
            <p class="text-sm text-gray-500 mb-6">This business card is password protected. Enter the password to view it.</p>

            <Form @submit="submit" class="space-y-4" v-slot="{ errors }">
                <div>
                    <Field name="password" :rules="passwordSchema" v-model="form.password">
                        <input v-model="form.password" type="password" placeholder="Enter password"
                            class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 text-center"
                            :class="{ 'border-red-500': errors.password || form.errors.password }" />
                    </Field>
                    <ErrorMessage name="password" class="mt-1 text-sm text-red-600" />
                    <p v-if="form.errors.password" class="mt-1 text-sm text-red-600">{{ form.errors.password }}</p>
                </div>
                <button type="submit" :disabled="form.processing"
                    class="w-full py-3 text-sm font-semibold text-white gradient-primary rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
                    <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin inline" />
                    View Card
                </button>
            </Form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { Lock, Loader2 } from 'lucide-vue-next';

const props = defineProps<{ slug: string; prefix?: string }>();

const form = useForm({ password: '', slug: props.slug, prefix: props.prefix ?? '' });
const passwordSchema = yup.string().required('Password is required');

const submit = () => form.post(route('public.vcard.verify-password'));
</script>
