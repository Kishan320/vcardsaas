<template>
    <AppLayout>
        <Head title="Settings" />
        <FlashMessage />

        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
                <p class="text-sm text-gray-500 mt-0.5">Configure your application settings</p>
            </div>

            <div class="flex flex-col lg:flex-row gap-6">
                <!-- Sidebar tabs -->
                <div class="lg:w-56 flex-shrink-0">
                    <nav class="bg-white border border-gray-100 rounded-2xl shadow-card p-2 space-y-0.5">
                        <button
                            v-for="tab in tabs"
                            :key="tab.id"
                            @click="activeTab = tab.id"
                            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                            :class="activeTab === tab.id
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
                        >
                            <component :is="tab.icon" :size="16" :class="activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'" />
                            {{ tab.label }}
                        </button>
                    </nav>
                </div>

                <!-- Content -->
                <div class="flex-1">
                    <!-- Profile Settings -->
                    <div v-if="activeTab === 'profile'" class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-5">Profile Settings</h2>
                        <Form @submit="submitProfile" class="space-y-4" v-slot="{ errors }">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Full Name" required />
                                    <Field name="name" :rules="nameSchema" v-model="profileForm.name">
                                        <TextInput v-model="profileForm.name" type="text" :has-error="!!(errors.name || profileForm.errors.name)" class="mt-1.5" />
                                    </Field>
                                    <ErrorMessage name="name" class="mt-1 text-sm text-red-600" />
                                    <InputError :message="profileForm.errors.name" />
                                </div>
                                <div>
                                    <InputLabel value="Email" required />
                                    <Field name="email" :rules="emailSchema" v-model="profileForm.email">
                                        <TextInput v-model="profileForm.email" type="email" :has-error="!!(errors.email || profileForm.errors.email)" class="mt-1.5" />
                                    </Field>
                                    <ErrorMessage name="email" class="mt-1 text-sm text-red-600" />
                                    <InputError :message="profileForm.errors.email" />
                                </div>
                            </div>
                            <div class="flex justify-end pt-2">
                                <PrimaryButton :disabled="profileForm.processing">
                                    <Loader2 v-if="profileForm.processing" :size="14" class="mr-1 animate-spin" />
                                    Save Changes
                                </PrimaryButton>
                            </div>
                        </Form>
                    </div>

                    <!-- Password Settings -->
                    <div v-if="activeTab === 'password'" class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-5">Change Password</h2>
                        <Form @submit="submitPassword" class="space-y-4" v-slot="{ errors }">
                            <div>
                                <InputLabel value="Current Password" required />
                                <Field name="current_password" :rules="requiredSchema" v-model="passwordForm.current_password">
                                    <TextInput v-model="passwordForm.current_password" type="password" :has-error="!!(errors.current_password || passwordForm.errors.current_password)" class="mt-1.5" placeholder="••••••••" />
                                </Field>
                                <ErrorMessage name="current_password" class="mt-1 text-sm text-red-600" />
                                <InputError :message="passwordForm.errors.current_password" />
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="New Password" required />
                                    <Field name="password" :rules="passwordSchema" v-model="passwordForm.password">
                                        <TextInput v-model="passwordForm.password" type="password" :has-error="!!(errors.password || passwordForm.errors.password)" class="mt-1.5" placeholder="••••••••" />
                                    </Field>
                                    <ErrorMessage name="password" class="mt-1 text-sm text-red-600" />
                                    <InputError :message="passwordForm.errors.password" />
                                </div>
                                <div>
                                    <InputLabel value="Confirm New Password" required />
                                    <Field name="password_confirmation" :rules="confirmPasswordSchema" v-model="passwordForm.password_confirmation">
                                        <TextInput v-model="passwordForm.password_confirmation" type="password" :has-error="!!(errors.password_confirmation || passwordForm.errors.password_confirmation)" class="mt-1.5" placeholder="••••••••" />
                                    </Field>
                                    <ErrorMessage name="password_confirmation" class="mt-1 text-sm text-red-600" />
                                    <InputError :message="passwordForm.errors.password_confirmation" />
                                </div>
                            </div>
                            <div class="flex justify-end pt-2">
                                <PrimaryButton :disabled="passwordForm.processing">
                                    <Loader2 v-if="passwordForm.processing" :size="14" class="mr-1 animate-spin" />
                                    Update Password
                                </PrimaryButton>
                            </div>
                        </Form>
                    </div>

                    <!-- System Settings (Super Admin) -->
                    <div v-if="activeTab === 'system'" class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-5">System Settings</h2>
                        <Form @submit="submitSystem" class="space-y-4">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="App Name" />
                                    <TextInput v-model="systemForm.app_name" type="text" class="mt-1.5" placeholder="VCard SaaS" />
                                </div>
                                <div>
                                    <InputLabel value="App URL" />
                                    <TextInput v-model="systemForm.app_url" type="url" class="mt-1.5" placeholder="https://example.com" />
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <input type="checkbox" v-model="systemForm.registration_enabled" id="reg" class="rounded border-gray-300 text-primary-600" />
                                <label for="reg" class="text-sm text-gray-700">Allow new user registrations</label>
                            </div>
                            <div class="flex justify-end pt-2">
                                <PrimaryButton :disabled="systemForm.processing">
                                    <Loader2 v-if="systemForm.processing" :size="14" class="mr-1 animate-spin" />
                                    Save Settings
                                </PrimaryButton>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { User, Lock, Settings, Globe, Mail, CreditCard, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';
import type { PageProps } from '@/types';

const props = defineProps<{
    settings?: Record<string, string>;
    mustVerifyEmail?: boolean;
    status?: string;
}>();

const page = usePage<PageProps>();
const user = computed(() => page.props.auth?.user);
const isSuperAdmin = computed(() => user.value?.is_super_admin ?? false);

const activeTab = ref('profile');

const tabs = computed(() => [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    ...(isSuperAdmin.value ? [
        { id: 'system', label: 'System', icon: Settings },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        { id: 'seo', label: 'SEO', icon: Globe },
    ] : []),
]);

const profileForm = useForm({
    name: user.value?.name ?? '',
    email: user.value?.email ?? '',
});

const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const systemForm = useForm({
    app_name: props.settings?.app_name ?? '',
    app_url: props.settings?.app_url ?? '',
    registration_enabled: props.settings?.registration_enabled === '1',
    processing: false,
});

const nameSchema = yup.string().required('Name is required').min(2, 'At least 2 characters');
const emailSchema = yup.string().required('Email is required').email('Enter a valid email');
const requiredSchema = yup.string().required('This field is required');
const passwordSchema = yup.string().required('Password is required').min(8, 'At least 8 characters');
const confirmPasswordSchema = yup.string().required('Please confirm your password').test('match', 'Passwords do not match', (v) => v === passwordForm.password);

const submitProfile = () => profileForm.patch(route('profile.update'));
const submitPassword = () => passwordForm.put(route('password.update'), { onSuccess: () => passwordForm.reset() });
const submitSystem = () => systemForm.post(route('settings.system.update'));
</script>
