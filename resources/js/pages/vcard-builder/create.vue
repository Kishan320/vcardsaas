<template>
    <AppLayout>
        <Head title="Create VCard" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex items-center gap-3">
                <Link :href="route('vcard-builder.index')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft :size="18" class="text-gray-500" />
                </Link>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Create VCard</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Build your digital business card</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Form -->
                <div class="lg:col-span-2 space-y-4">
                    <Form @submit="submit" class="space-y-4" v-slot="{ errors }">
                        <!-- Basic Info -->
                        <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                            <h3 class="font-semibold text-gray-900 mb-4">Basic Information</h3>
                            <div class="space-y-4">
                                <div>
                                    <InputLabel value="Business Name" required />
                                    <Field name="name" :rules="nameSchema" v-model="form.name">
                                        <TextInput v-model="form.name" type="text" :has-error="!!(errors.name || form.errors.name)" class="mt-1.5" placeholder="My Business" />
                                    </Field>
                                    <ErrorMessage name="name" class="mt-1 text-sm text-red-600" />
                                    <InputError :message="form.errors.name" />
                                </div>
                                <div>
                                    <InputLabel value="URL Slug" required />
                                    <div class="flex items-center gap-2 mt-1.5">
                                        <span class="text-sm text-gray-500 bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-l-xl border-r-0">{{ baseUrl }}/</span>
                                        <Field name="slug" :rules="slugSchema" v-model="form.slug">
                                            <TextInput v-model="form.slug" type="text" :has-error="!!(errors.slug || form.errors.slug)" class="rounded-l-none flex-1" placeholder="my-business" />
                                        </Field>
                                    </div>
                                    <ErrorMessage name="slug" class="mt-1 text-sm text-red-600" />
                                    <InputError :message="form.errors.slug" />
                                </div>
                                <div>
                                    <InputLabel value="Business Type" required />
                                    <select v-model="form.business_type" class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200">
                                        <option value="">Select type</option>
                                        <option v-for="type in businessTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
                                    </select>
                                    <InputError :message="form.errors.business_type" />
                                </div>
                            </div>
                        </div>

                        <!-- Profile Section -->
                        <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                            <h3 class="font-semibold text-gray-900 mb-4">Profile</h3>
                            <div class="space-y-4">
                                <div>
                                    <InputLabel value="Tagline" />
                                    <TextInput v-model="form.config_sections.profile.tagline" type="text" class="mt-1.5" placeholder="Your professional tagline" />
                                </div>
                                <div>
                                    <InputLabel value="Bio / About" />
                                    <textarea v-model="form.config_sections.profile.bio" rows="3"
                                        class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
                                        placeholder="Tell people about yourself..." />
                                </div>
                            </div>
                        </div>

                        <!-- Contact Section -->
                        <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                            <h3 class="font-semibold text-gray-900 mb-4">Contact Information</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Phone" />
                                    <TextInput v-model="form.config_sections.contact.phone" type="tel" class="mt-1.5" placeholder="+1 234 567 8900" />
                                </div>
                                <div>
                                    <InputLabel value="Email" />
                                    <TextInput v-model="form.config_sections.contact.email" type="email" class="mt-1.5" placeholder="you@example.com" />
                                </div>
                                <div>
                                    <InputLabel value="Website" />
                                    <TextInput v-model="form.config_sections.contact.website" type="url" class="mt-1.5" placeholder="https://example.com" />
                                </div>
                                <div>
                                    <InputLabel value="Address" />
                                    <TextInput v-model="form.config_sections.contact.address" type="text" class="mt-1.5" placeholder="City, Country" />
                                </div>
                            </div>
                        </div>

                        <!-- Colors -->
                        <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                            <h3 class="font-semibold text-gray-900 mb-4">Brand Colors</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Primary Color" />
                                    <div class="flex items-center gap-2 mt-1.5">
                                        <input type="color" v-model="form.config_sections.colors.primary" class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                                        <TextInput v-model="form.config_sections.colors.primary" type="text" class="flex-1" />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel value="Secondary Color" />
                                    <div class="flex items-center gap-2 mt-1.5">
                                        <input type="color" v-model="form.config_sections.colors.secondary" class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                                        <TextInput v-model="form.config_sections.colors.secondary" type="text" class="flex-1" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-3 justify-end">
                            <Link :href="route('vcard-builder.index')" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</Link>
                            <PrimaryButton :disabled="form.processing">
                                <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin" />
                                Create VCard
                            </PrimaryButton>
                        </div>
                    </Form>
                </div>

                <!-- Preview -->
                <div class="lg:col-span-1">
                    <div class="sticky top-6">
                        <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-4">
                            <h3 class="font-semibold text-gray-900 mb-3 text-sm">Live Preview</h3>
                            <div class="rounded-xl overflow-hidden border border-gray-100" style="max-height: 500px; overflow-y: auto;">
                                <div class="p-4 text-center text-white" :style="{ background: `linear-gradient(135deg, ${form.config_sections.colors.primary}, ${form.config_sections.colors.secondary})` }">
                                    <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold mx-auto mb-2">
                                        {{ previewInitials }}
                                    </div>
                                    <h4 class="font-bold">{{ form.name || 'Business Name' }}</h4>
                                    <p class="text-white/80 text-xs mt-1">{{ form.config_sections.profile.tagline || 'Your tagline' }}</p>
                                </div>
                                <div class="p-4 space-y-2 bg-gray-50">
                                    <div v-if="form.config_sections.contact.phone" class="flex items-center gap-2 text-xs text-gray-600">
                                        <Phone :size="12" /> {{ form.config_sections.contact.phone }}
                                    </div>
                                    <div v-if="form.config_sections.contact.email" class="flex items-center gap-2 text-xs text-gray-600">
                                        <Mail :size="12" /> {{ form.config_sections.contact.email }}
                                    </div>
                                    <div v-if="form.config_sections.contact.website" class="flex items-center gap-2 text-xs text-gray-600">
                                        <Globe :size="12" /> {{ form.config_sections.contact.website }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { ArrowLeft, Phone, Mail, Globe, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

const baseUrl = window.location.origin;

const form = useForm({
    name: '',
    slug: '',
    business_type: '',
    domain_type: 'slug',
    url_prefix: 'v',
    password_enabled: false,
    password: '',
    config_sections: {
        profile: { tagline: '', bio: '' },
        contact: { phone: '', email: '', website: '', address: '' },
        colors: { primary: '#7C3AED', secondary: '#9F67FF', background: '#f9fafb' },
        social: {},
    },
});

const businessTypes = [
    { value: 'freelancer', label: 'Freelancer' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'salon', label: 'Salon' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'realestate', label: 'Real Estate' },
    { value: 'photography', label: 'Photography' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'ecommerce', label: 'E-Commerce' },
    { value: 'tech-startup', label: 'Tech Startup' },
    { value: 'cafe', label: 'Cafe' },
    { value: 'gym', label: 'Gym' },
    { value: 'lawyer', label: 'Law Firm' },
    { value: 'music-artist', label: 'Music Artist' },
];

const nameSchema = yup.string().required('Business name is required').min(2);
const slugSchema = yup.string().required('Slug is required').min(2).matches(/^[a-zA-Z0-9-_]+$/, 'Only letters, numbers, hyphens and underscores');

const previewInitials = computed(() => {
    const name = form.name;
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'VC';
});

const submit = () => form.post(route('vcard-builder.store'));
</script>
