<template>
    <AppLayout>
        <Head title="Profile" />
        <FlashMessage />
        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p class="text-sm text-gray-500 mt-0.5">Manage your account information</p>
            </div>

            <div class="max-w-2xl space-y-6">
                <!-- Profile Info -->
                <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                    <h3 class="font-semibold text-gray-900 mb-5">Profile Information</h3>
                    <Form @submit="submitProfile" class="space-y-4" v-slot="{ errors }">
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
                        <div v-if="mustVerifyEmail && !user?.email_verified_at" class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                            Your email is unverified.
                            <Link :href="route('verification.send')" method="post" as="button" class="underline font-medium ml-1">Resend verification</Link>
                        </div>
                        <div class="flex justify-end">
                            <PrimaryButton :disabled="profileForm.processing">
                                <Loader2 v-if="profileForm.processing" :size="14" class="mr-1 animate-spin" />
                                Save Profile
                            </PrimaryButton>
                        </div>
                    </Form>
                </div>

                <!-- Change Password -->
                <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                    <h3 class="font-semibold text-gray-900 mb-5">Change Password</h3>
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
                                <InputLabel value="Confirm Password" required />
                                <Field name="password_confirmation" :rules="confirmSchema" v-model="passwordForm.password_confirmation">
                                    <TextInput v-model="passwordForm.password_confirmation" type="password" :has-error="!!(errors.password_confirmation || passwordForm.errors.password_confirmation)" class="mt-1.5" placeholder="••••••••" />
                                </Field>
                                <ErrorMessage name="password_confirmation" class="mt-1 text-sm text-red-600" />
                                <InputError :message="passwordForm.errors.password_confirmation" />
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <PrimaryButton :disabled="passwordForm.processing">
                                <Loader2 v-if="passwordForm.processing" :size="14" class="mr-1 animate-spin" />
                                Update Password
                            </PrimaryButton>
                        </div>
                    </Form>
                </div>

                <!-- Delete Account -->
                <div class="bg-white border border-red-100 rounded-2xl shadow-card p-6">
                    <h3 class="font-semibold text-red-600 mb-2">Delete Account</h3>
                    <p class="text-sm text-gray-500 mb-4">Once your account is deleted, all data will be permanently removed.</p>
                    <button @click="showDeleteModal = true" class="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>

        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Account</h3>
                <p class="text-sm text-gray-600 mb-4">Are you sure? This action cannot be undone.</p>
                <div>
                    <InputLabel value="Confirm Password" required />
                    <TextInput v-model="deleteForm.password" type="password" class="mt-1.5" placeholder="••••••••" />
                    <InputError :message="deleteForm.errors.password" />
                </div>
                <div class="flex gap-3 justify-end mt-4">
                    <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button @click="confirmDelete" :disabled="deleteForm.processing" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Delete</button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';
import type { PageProps } from '@/types';

defineProps<{ mustVerifyEmail?: boolean; status?: string }>();

const page = usePage<PageProps>();
const user = computed(() => page.props.auth?.user);
const showDeleteModal = ref(false);

const profileForm = useForm({ name: user.value?.name ?? '', email: user.value?.email ?? '' });
const passwordForm = useForm({ current_password: '', password: '', password_confirmation: '' });
const deleteForm = useForm({ password: '' });

const nameSchema = yup.string().required('Name is required').min(2);
const emailSchema = yup.string().required('Email is required').email('Invalid email');
const requiredSchema = yup.string().required('This field is required');
const passwordSchema = yup.string().required('Password is required').min(8, 'At least 8 characters');
const confirmSchema = yup.string().required('Please confirm your password').test('match', 'Passwords do not match', (v) => v === passwordForm.password);

const submitProfile = () => profileForm.patch(route('profile.update'));
const submitPassword = () => passwordForm.put(route('password.update'), { onSuccess: () => passwordForm.reset() });
const confirmDelete = () => deleteForm.delete(route('profile.destroy'), { onSuccess: () => { showDeleteModal.value = false; } });
</script>
