<template>
    <GuestLayout>
        <Head title="Log in" />

        <div class="mb-8">
            <h1 class="text-2xl font-bold text-[hsl(var(--foreground))]">Welcome back</h1>
            <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Sign in to your VCard SaaS account</p>
        </div>

        <div
            v-if="status"
            class="mb-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 border border-green-200"
        >
            <CheckCircle :size="16" class="shrink-0" />
            {{ status }}
        </div>

        <Form @submit="submit" class="space-y-5" v-slot="{ errors }">
            <!-- Email -->
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

            <!-- Password -->
            <div>
                <InputLabel value="Password" required />
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
                            autocomplete="current-password"
                            placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                        />
                    </Field>
                    <button
                        type="button"
                        @click="showPassword = !showPassword"
                        class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <Eye v-if="!showPassword" :size="16" />
                        <EyeOff v-else :size="16" />
                    </button>
                </div>
                <ErrorMessage name="password" class="mt-1.5 text-sm text-red-600" />
                <InputError :message="form.errors.password" />
            </div>

            <!-- Remember + Forgot -->
            <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer">
                    <Checkbox v-model:checked="form.remember" />
                    <span class="text-sm text-[hsl(var(--muted-foreground))]">Remember me</span>
                </label>
                <Link
                    v-if="canResetPassword"
                    :href="route('password.request')"
                    class="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                    Forgot password?
                </Link>
            </div>

            <PrimaryButton class="w-full !py-3" :disabled="form.processing">
                <Loader2 v-if="form.processing" :size="16" class="mr-2 animate-spin" />
                {{ form.processing ? 'Signing in&#8230;' : 'Sign in' }}
            </PrimaryButton>
        </Form>

        <p class="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Don't have an account?
            <Link :href="route('register')" class="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Create one
            </Link>
        </p>
    </GuestLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-vue-next';
import GuestLayout from '@/layouts/GuestLayout.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';
import Checkbox from '@/components/ui/Checkbox.vue';

defineProps<{ canResetPassword?: boolean; status?: string }>();

const showPassword = ref(false);

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const emailSchema = yup.string().required('Email is required').email('Enter a valid email address');
const passwordSchema = yup.string().required('Password is required').min(8, 'Password must be at least 8 characters');

const submit = () => {
    form.post(route('login'), { onFinish: () => form.reset('password') });
};
</script>
