<template>
    <GuestLayout>
        <Head title="Forgot Password" />

        <div class="mb-8">
            <h1 class="text-2xl font-bold text-[hsl(var(--foreground))]">Reset your password</h1>
            <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Enter your email and we'll send you a reset link.
            </p>
        </div>

        <div
            v-if="status"
            class="mb-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 border border-green-200"
        >
            <CheckCircle :size="16" class="shrink-0" />
            {{ status }}
        </div>

        <Form @submit="submit" class="space-y-5" v-slot="{ errors }">
            <div>
                <InputLabel value="Email address" required />
                <div class="relative mt-1.5">
                    <span class="absolute inset-y-0 left-3 flex items-center text-[hsl(var(--muted-foreground))]">
                        <Mail :size="16" />
                    </span>
                    <Field name="email" :rules="emailSchema" v-model="form.email">
                        <TextInput
                            v-model="form.email"
                            type="email"
                            class="!pl-9"
                            :has-error="!!(errors.email || form.errors.email)"
                            autofocus
                            autocomplete="username"
                            placeholder="you@example.com"
                        />
                    </Field>
                </div>
                <ErrorMessage name="email" class="mt-1.5 text-sm text-red-600" />
                <InputError :message="form.errors.email" />
            </div>

            <PrimaryButton class="w-full !py-3" :disabled="form.processing">
                <Loader2 v-if="form.processing" :size="16" class="mr-2 animate-spin" />
                {{ form.processing ? 'Sending…' : 'Send reset link' }}
            </PrimaryButton>
        </Form>

        <p class="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Remember your password?
            <Link :href="route('login')" class="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Sign in
            </Link>
        </p>
    </GuestLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { Mail, Loader2, CheckCircle } from 'lucide-vue-next';
import GuestLayout from '@/layouts/GuestLayout.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

defineProps<{ status?: string }>();

const form = useForm({ email: '' });
const emailSchema = yup.string().required('Email is required').email('Enter a valid email address');

const submit = () => form.post(route('password.email'));
</script>
