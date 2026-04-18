<template>
    <div class="min-h-screen bg-[hsl(var(--background))]">
        <Head title="Welcome" />

        <!-- Nav -->
        <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                        <CreditCard :size="16" class="text-white" />
                    </div>
                    <span class="font-bold text-gray-900 text-lg">{{ appName }}</span>
                </div>
                <div class="flex items-center gap-3">
                    <Link v-if="canLogin" :href="route('login')" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Sign in
                    </Link>
                    <Link v-if="canRegister" :href="route('register')" class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>

        <!-- Hero -->
        <section class="pt-32 pb-20 px-4">
            <div class="max-w-4xl mx-auto text-center">
                <div class="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                    <Sparkles :size="12" /> Digital Business Cards Platform
                </div>
                <h1 class="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                    Create stunning<br />
                    <span class="text-gradient">digital business cards</span>
                </h1>
                <p class="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
                    Build, share, and track your digital vCards. Connect with customers through QR codes, NFC cards, and direct links.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link :href="route('register')" class="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-white text-base font-semibold rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-lg">
                        <Rocket :size="18" /> Start for Free
                    </Link>
                    <Link :href="route('login')" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-700 text-base font-semibold rounded-2xl hover:bg-gray-50 transition-all">
                        Sign In
                    </Link>
                </div>
            </div>
        </section>

        <!-- Features -->
        <section class="py-20 px-4 bg-white">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Everything you need</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div v-for="feature in features" :key="feature.title" class="text-center p-6">
                        <div class="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <component :is="feature.icon" :size="24" class="text-white" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
                        <p class="text-gray-500 text-sm">{{ feature.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Plans -->
        <section v-if="plans?.length" class="py-20 px-4">
            <div class="max-w-5xl mx-auto">
                <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Simple pricing</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div v-for="plan in plans" :key="plan.id"
                        class="bg-white border border-gray-100 rounded-2xl shadow-card p-6"
                        :class="{ 'ring-2 ring-primary-500': plan.is_featured }">
                        <div v-if="plan.is_featured" class="gradient-primary text-white text-xs font-semibold text-center py-1 rounded-lg mb-4">Most Popular</div>
                        <h3 class="text-xl font-bold text-gray-900">{{ plan.name }}</h3>
                        <div class="my-4">
                            <span class="text-4xl font-extrabold text-gray-900">${{ plan.price }}</span>
                            <span class="text-gray-500">/month</span>
                        </div>
                        <Link :href="route('register')" class="block w-full text-center py-3 text-sm font-semibold rounded-xl transition-all"
                            :class="plan.is_featured ? 'gradient-primary text-white hover:opacity-90' : 'border border-primary-300 text-primary-600 hover:bg-primary-50'">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="py-10 px-4 border-t border-gray-100 text-center text-sm text-gray-400">
            <p>© {{ new Date().getFullYear() }} {{ appName }}. All rights reserved.</p>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { CreditCard, Sparkles, Rocket, QrCode, BarChart3, Globe } from 'lucide-vue-next';

defineProps<{
    canLogin?: boolean;
    canRegister?: boolean;
    plans?: any[];
}>();

const page = usePage();
const appName = computed(() => (page.props as any).name ?? 'VCard SaaS');

const features = [
    { title: 'Digital Business Cards', description: 'Create beautiful, customizable digital business cards for any industry.', icon: CreditCard },
    { title: 'QR Code Sharing', description: 'Share your card instantly with QR codes, NFC, or direct links.', icon: QrCode },
    { title: 'Analytics & Insights', description: 'Track views, contacts, and appointments in real-time.', icon: BarChart3 },
    { title: 'Custom Domains', description: 'Use your own domain for a professional branded experience.', icon: Globe },
    { title: 'Link in Bio', description: 'Create a beautiful link-in-bio page for all your social links.', icon: Sparkles },
    { title: 'Multi-language', description: 'Support for multiple languages and RTL layouts.', icon: Globe },
];
</script>
