<template>
    <GuestLayout>
        <Head title="Register" />

        <div class="mb-8">
            <h1 class="text-2xl font-bold text-[hsl(var(--foreground))]">Create your account</h1>
            <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Start creating digital business cards in minutes</p>
        </div>

        <Form @submit="submit" class="space-y-5" v-slot="{ errors }">
            <!-- Name -->
            <div>
                <InputLabel value="Full name" required />
                <div class="relative mt-1.5">
                    <span class="absolute inset-y-0 left-3 flex items-center text-[hsl(var(--muted-foreground))]">
                        <User :size="16" />
                    </span>
                    <Field name="name" :rules="nameSchema" v-model="form.name">
                        <TextInput
                            v-model="form.name"
                            type="text"
                            class="!pl-9"
                            :has-error="!!(errors.name || form.errors.name)"
                            autofocus
                            autocomplete="name"
                            placeholder="John Doe"
                        />
                    </Field>
                </div>
                <ErrorMessage name="name" class="mt-1.5 text-sm text-red-600" />
                <InputError :message="form.errors.name" />
            </div>

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
                            autocomplete="email"
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
                            autocomplete="new-password"
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

            <!-- Confirm Password -->
            <div>
                <InputLabel value="Confirm password" required />
                <div class="relative mt-1.5">
                    <span class="absolute inset-y-0 left-3 flex items-center text-[hsl(var(--muted-foreground))]">
                        <Lock :size="16" />
                    </span>
                    <Field name="password_confirmation" :rules="passwordConfirmationSchema" v-model="form.password_confirmation">
                        <TextInput
                            v-model="form.password_confirmation"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            class="!pl-9 !pr-10"
                            :has-error="!!(errors.password_confirmation || form.errors.password_confirmation)"
                            autocomplete="new-password"
                            placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                        />
                    </Field>
                    <button
                        type="button"
                        @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <Eye v-if="!showConfirmPassword" :size="16" />
                        <EyeOff v-else :size="16" />
                    </button>
                </div>
                <ErrorMessage name="password_confirmation" class="mt-1.5 text-sm text-red-600" />
                <InputError :message="form.errors.password_confirmation" />
            </div>

            <!-- Terms -->
            <div class="flex items-center gap-2">
                <Checkbox v-model:checked="form.terms" />
                <label class="text-sm text-[hsl(var(--muted-foreground))]">
                    I agree to the 
                    <a href="#" class="text-primary-600 hover:text-primary-700">Terms of Service</a>
                    and 
                    <a href="#" class="text-primary-600 hover:text-primary-700">Privacy Policy</a>
                </label>
            </div>

            <PrimaryButton class="w-full !py-3" :disabled="form.processing">
                <Loader2 v-if="form.processing" :size="16" class="mr-2 animate-spin" />
                {{ form.processing ? 'Creating account&#8230;' : 'Create account' }}
            </PrimaryButton>
        </Form>

        <p class="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Already have an account?
            <Link :href="route('login')" class="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Sign in
            </Link>
        </p>
    </GuestLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-vue-next';
import GuestLayout from '@/layouts/GuestLayout.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';
import Checkbox from '@/components/ui/Checkbox.vue';

interface RegisterProps {
    referralCode?: string;
    planId?: string;
}

const props = defineProps<RegisterProps>();

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
    plan_id: props.planId,
    referral_code: props.referralCode,
});

const nameSchema = yup.string().required('Name is required').min(2, 'Name must be at least 2 characters');
const emailSchema = yup.string().required('Email is required').email('Enter a valid email address');
const passwordSchema = yup.string().required('Password is required').min(8, 'Password must be at least 8 characters');
const passwordConfirmationSchema = yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match');

const submit = () => {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};
</script>
