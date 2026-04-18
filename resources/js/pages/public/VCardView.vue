<template>
    <div class="min-h-screen" :style="{ backgroundColor: bgColor }">
        <Head :title="business?.name ?? 'VCard'" />

        <div v-if="business" class="max-w-sm mx-auto min-h-screen">
            <!-- Hero / Profile Section -->
            <div class="relative" :style="{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }">
                <div class="px-6 pt-12 pb-8 text-center text-white">
                    <div v-if="profileImage" class="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white/30 shadow-lg">
                        <img :src="profileImage" :alt="business.name" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-24 h-24 rounded-full mx-auto mb-4 bg-white/20 flex items-center justify-center text-3xl font-bold">
                        {{ initials }}
                    </div>
                    <h1 class="text-2xl font-bold">{{ business.name }}</h1>
                    <p v-if="tagline" class="text-white/80 text-sm mt-1">{{ tagline }}</p>
                    <p v-if="location" class="text-white/70 text-xs mt-1 flex items-center justify-center gap-1">
                        <MapPin :size="12" /> {{ location }}
                    </p>
                </div>
            </div>

            <!-- Contact Actions -->
            <div class="px-4 -mt-4 mb-4">
                <div class="bg-white rounded-2xl shadow-card p-4 flex gap-3 justify-center">
                    <a v-if="phone" :href="`tel:${phone}`" class="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                        <Phone :size="20" class="text-primary-600" />
                        <span class="text-xs text-gray-600">Call</span>
                    </a>
                    <a v-if="email" :href="`mailto:${email}`" class="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                        <Mail :size="20" class="text-primary-600" />
                        <span class="text-xs text-gray-600">Email</span>
                    </a>
                    <a v-if="website" :href="website" target="_blank" class="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                        <Globe :size="20" class="text-primary-600" />
                        <span class="text-xs text-gray-600">Website</span>
                    </a>
                    <button @click="saveContact" class="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                        <UserPlus :size="20" class="text-primary-600" />
                        <span class="text-xs text-gray-600">Save</span>
                    </button>
                </div>
            </div>

            <!-- About Section -->
            <div v-if="about" class="px-4 mb-4">
                <div class="bg-white rounded-2xl shadow-card p-5">
                    <h2 class="font-semibold text-gray-900 mb-2">About</h2>
                    <p class="text-sm text-gray-600 leading-relaxed">{{ about }}</p>
                </div>
            </div>

            <!-- Social Links -->
            <div v-if="socialLinks.length" class="px-4 mb-4">
                <div class="bg-white rounded-2xl shadow-card p-5">
                    <h2 class="font-semibold text-gray-900 mb-3">Connect</h2>
                    <div class="flex flex-wrap gap-2">
                        <a v-for="social in socialLinks" :key="social.platform" :href="social.url" target="_blank"
                            class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                            <component :is="getSocialIcon(social.platform)" :size="16" class="text-primary-600" />
                            {{ social.platform }}
                        </a>
                    </div>
                </div>
            </div>

            <!-- Contact Form -->
            <div class="px-4 mb-8">
                <div class="bg-white rounded-2xl shadow-card p-5">
                    <h2 class="font-semibold text-gray-900 mb-4">Get in Touch</h2>
                    <Form @submit="submitContact" class="space-y-3" v-slot="{ errors }">
                        <div>
                            <Field name="name" :rules="nameSchema" v-model="contactForm.name">
                                <input v-model="contactForm.name" type="text" placeholder="Your name"
                                    class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200"
                                    :class="{ 'border-red-500': errors.name }" />
                            </Field>
                            <ErrorMessage name="name" class="mt-1 text-xs text-red-600" />
                        </div>
                        <div>
                            <Field name="email" :rules="emailSchema" v-model="contactForm.email">
                                <input v-model="contactForm.email" type="email" placeholder="Your email"
                                    class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200"
                                    :class="{ 'border-red-500': errors.email }" />
                            </Field>
                            <ErrorMessage name="email" class="mt-1 text-xs text-red-600" />
                        </div>
                        <textarea v-model="contactForm.message" placeholder="Your message" rows="3"
                            class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" />
                        <button type="submit" :disabled="contactForm.processing"
                            class="w-full py-3 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                            :style="{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }">
                            <Loader2 v-if="contactForm.processing" :size="14" class="mr-1 animate-spin inline" />
                            Send Message
                        </button>
                    </Form>
                </div>
            </div>
        </div>

        <!-- Not Found -->
        <div v-else class="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard :size="32" class="text-gray-400" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Card Not Found</h1>
            <p class="text-gray-500">This business card doesn't exist or has been removed.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Head, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { Phone, Mail, Globe, UserPlus, MapPin, CreditCard, Loader2, Twitter, Instagram, Facebook, Linkedin, Youtube } from 'lucide-vue-next';
import { generateVCF } from '@/utils/vcfGenerator';

const props = defineProps<{ business?: any }>();

const sections = computed(() => props.business?.config_sections ?? {});
const primaryColor = computed(() => sections.value?.colors?.primary ?? '#7C3AED');
const secondaryColor = computed(() => sections.value?.colors?.secondary ?? '#9F67FF');
const bgColor = computed(() => sections.value?.colors?.background ?? '#f9fafb');
const profileImage = computed(() => sections.value?.profile?.image ?? sections.value?.hero?.image);
const tagline = computed(() => sections.value?.profile?.tagline ?? sections.value?.hero?.tagline);
const location = computed(() => sections.value?.profile?.location ?? sections.value?.contact?.address);
const about = computed(() => sections.value?.about?.description ?? sections.value?.profile?.bio);
const phone = computed(() => sections.value?.contact?.phone ?? sections.value?.profile?.phone);
const email = computed(() => sections.value?.contact?.email ?? sections.value?.profile?.email);
const website = computed(() => sections.value?.contact?.website ?? sections.value?.profile?.website);
const socialLinks = computed(() => {
    const s = sections.value?.social ?? {};
    return Object.entries(s).filter(([, v]) => v).map(([k, v]) => ({ platform: k, url: v as string }));
});
const initials = computed(() => {
    const name = props.business?.name ?? '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
});

const getSocialIcon = (platform: string) => {
    const map: Record<string, any> = { twitter: Twitter, instagram: Instagram, facebook: Facebook, linkedin: Linkedin, youtube: Youtube };
    return map[platform.toLowerCase()] ?? Globe;
};

const contactForm = useForm({ name: '', email: '', phone: '', message: '' });
const nameSchema = yup.string().required('Name is required');
const emailSchema = yup.string().required('Email is required').email('Invalid email');

const submitContact = () => {
    contactForm.post(route('public.contact.store'), { onSuccess: () => contactForm.reset() });
};

const saveContact = () => {
    if (!props.business) return;
    const vcf = generateVCF(props.business);
    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${props.business.name}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
};
</script>
