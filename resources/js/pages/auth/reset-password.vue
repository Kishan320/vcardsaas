<template>
    <GuestLayout>
        <Head title="Reset Password" />

        <div class="mb-8">
            <h1 class="text-2xl font-bold text-[hsl(var(--foreground))]">Set new password</h1>
            <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Choose a strong password for your account.</p>
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
                            autocomplete="username"
                            placeholder="you@example.com"
                        />
                    </Field>
                </div>
                <ErrorMessage name="email" class="mt-1.5 text-sm text-red-600" />
                <InputError :message="form.errors.email" />
            </div>

            <div>
                <InputLabel value="New password" required />
                <div class="relative mt-1.5">
                    <span class="absolute inset-y-0 left-3 flex items-center text-[hsl(var(--muted-foreground))]">
                        <Lock :size="16" />
                    </span>
                    <Field name="password" :rules="passwordSchema" v-model="form.password">
                        <TextInput
                            v-model="form.password"
                            :type="showPassword ? 'text' : 'password'"
                            class="!pl-9 !pr-10"
                            :has-error="!!(errors.password || form.errors.password)"
                            autocomplete="new-password"
                            placeholder="••••••••"
                        />
                    </Field>
                    <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                        <Eye v-if="!showPassword" :size="16" />
                        <EyeOff v-else :size="16" />
                    </button>
                </div>
                <ErrorMessage name="password" class="mt-1.5 text-sm text-red-600" />
                <InputError :message="form.errors.password" />
            </div>

            <div>
                <InputLabel value="Confirm new password" required />
                <div class="relative mt-1.5">
                    <span class="absolute inset-y-0 left-3 flex items-center text-[hsl(var(--muted-foreground))]">
                        <ShieldCheck :size="16" />
                    </span>
                    <Field name="password_confirmation" :rules="confirmSchema" v-model="form.password_confirmation">
                        <TextInput
                            v-model="form.password_confirmation"
                            :type="showConfirm ? 'text' : 'password'"
                            class="!pl-9 !pr-10"
                            :has-error="!!(errors.password_confirmation || form.errors.password_confirmation)"
                            autocomplete="new-password"
                            placeholder="••••••••"
                        />
                    </Field>
                    <button type="button" @click="showConfirm = !showConfirm" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                        <Eye v-if="!showConfirm" :size="16" />
                        <EyeOff v-else :size="16" />
                    </button>
                </div>
                <ErrorMessage name="password_confirmation" class="mt-1.5 text-sm text-red-600" />
                <InputError :message="form.errors.password_confirmation" />
            </div>

            <PrimaryButton class="w-full !py-3" :disabled="form.processing">
                <Loader2 v-if="form.processing" :size="16" class="mr-2 animate-spin" />
                {{ form.processing ? 'Resetting…' : 'Reset password' }}
            </PrimaryButton>
        </Form>
    </GuestLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Head, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-vue-next';
import GuestLayout from '@/layouts/GuestLayout.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

const props = defineProps<{ token: string; email: string }>();

const showPassword = ref(false);
const showConfirm = ref(false);

const form = useForm({
    token: props.token,
    email: props.email,
    password: '',
    password_confirmation: '',
});

const emailSchema = yup.string().required('Email is required').email('Enter a valid email address');
const passwordSchema = yup.string().required('Password is required').min(8, 'Password must be at least 8 characters');
const confirmSchema = yup.string().required('Please confirm your password').test('match', 'Passwords do not match', (v) => v === form.password);

const submit = () => form.post(route('password.store'), { onFinish: () => form.reset('password', 'password_confirmation') });
</script>
