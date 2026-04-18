<template>
    <AppLayout>
        <Head title="Create Bio Link" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex items-center gap-3">
                <Link :href="route('link-bio-builder.index')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft :size="18" class="text-gray-500" />
                </Link>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Create Bio Link</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Build your link-in-bio page</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-4">
                    <Form @submit="submit" class="space-y-4" v-slot="{ errors }">
                        <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                            <h3 class="font-semibold text-gray-900 mb-4">Profile</h3>
                            <div class="space-y-4">
                                <div>
                                    <InputLabel value="Title / Name" required />
                                    <Field name="title" :rules="titleSchema" v-model="form.title">
                                        <TextInput v-model="form.title" type="text" :has-error="!!(errors.title || form.errors.title)" class="mt-1.5" placeholder="Jane Smith" />
                                    </Field>
                                    <ErrorMessage name="title" class="mt-1 text-sm text-red-600" />
                                    <InputError :message="form.errors.title" />
                                </div>
                                <div>
                                    <InputLabel value="Username" required />
                                    <Field name="username" :rules="usernameSchema" v-model="form.username">
                                        <TextInput v-model="form.username" type="text" :has-error="!!(errors.username || form.errors.username)" class="mt-1.5" placeholder="janesmith" />
                                    </Field>
                                    <ErrorMessage name="username" class="mt-1 text-sm text-red-600" />
                                    <InputError :message="form.errors.username" />
                                </div>
                                <div>
                                    <InputLabel value="Bio" />
                                    <textarea v-model="form.bio" rows="3"
                                        class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
                                        placeholder="Tell people about yourself..." />
                                </div>
                            </div>
                        </div>

                        <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                            <h3 class="font-semibold text-gray-900 mb-4">Social Links</h3>
                            <div class="space-y-3">
                                <div v-for="platform in socialPlatforms" :key="platform.key" class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: platform.color + '20' }">
                                        <component :is="platform.icon" :size="16" :style="{ color: platform.color }" />
                                    </div>
                                    <TextInput v-model="form.social_links[platform.key]" type="url" class="flex-1" :placeholder="platform.placeholder" />
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-3 justify-end">
                            <Link :href="route('link-bio-builder.index')" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</Link>
                            <PrimaryButton :disabled="form.processing">
                                <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin" />
                                Create Bio Link
                            </PrimaryButton>
                        </div>
                    </Form>
                </div>

                <!-- Preview -->
                <div class="lg:col-span-1">
                    <div class="sticky top-6 bg-white border border-gray-100 rounded-2xl shadow-card p-4">
                        <h3 class="font-semibold text-gray-900 mb-3 text-sm">Preview</h3>
                        <div class="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 p-4 text-center">
                            <div class="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                                {{ form.title.charAt(0) || '?' }}
                            </div>
                            <h4 class="font-bold text-gray-900">{{ form.title || 'Your Name' }}</h4>
                            <p class="text-xs text-gray-500 mt-1">@{{ form.username || 'username' }}</p>
                            <p v-if="form.bio" class="text-xs text-gray-600 mt-2">{{ form.bio }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { ArrowLeft, Loader2, Twitter, Instagram, Facebook, Linkedin, Youtube, Globe } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

const form = useForm({
    title: '',
    username: '',
    bio: '',
    theme: 'minimal',
    social_links: { twitter: '', instagram: '', facebook: '', linkedin: '', youtube: '', website: '' } as Record<string, string>,
});

const titleSchema = yup.string().required('Title is required').min(2);
const usernameSchema = yup.string().required('Username is required').min(2).matches(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, underscores and hyphens');

const socialPlatforms = [
    { key: 'twitter', icon: Twitter, color: '#1DA1F2', placeholder: 'https://twitter.com/username' },
    { key: 'instagram', icon: Instagram, color: '#E1306C', placeholder: 'https://instagram.com/username' },
    { key: 'facebook', icon: Facebook, color: '#1877F2', placeholder: 'https://facebook.com/username' },
    { key: 'linkedin', icon: Linkedin, color: '#0A66C2', placeholder: 'https://linkedin.com/in/username' },
    { key: 'youtube', icon: Youtube, color: '#FF0000', placeholder: 'https://youtube.com/@channel' },
    { key: 'website', icon: Globe, color: '#7C3AED', placeholder: 'https://yourwebsite.com' },
];

const submit = () => form.post(route('link-bio-builder.store'));
</script>
