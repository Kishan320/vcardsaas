<template>
    <div class="flex min-h-screen">
        <!-- Left branding panel -->
        <div class="hidden lg:flex lg:w-1/2 gradient-hero flex-col items-center justify-center p-12 relative overflow-hidden">
            <div class="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-primary-700/30 blur-3xl" />
            <div class="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-primary-500/20 blur-3xl" />

            <Link href="/" class="relative z-10 flex flex-col items-center gap-4">
                <div class="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <CreditCard class="w-9 h-9 text-white" />
                </div>
                <span class="text-2xl font-bold text-white tracking-tight">VCard SaaS</span>
            </Link>

            <div class="relative z-10 mt-16 text-center">
                <h2 class="text-3xl font-bold text-white leading-snug">Create stunning<br />digital business cards</h2>
                <p class="mt-4 text-primary-200 text-sm leading-relaxed max-w-xs">
                    Build, share, and track your digital vCards — all in one beautiful platform.
                </p>
            </div>

            <div class="relative z-10 mt-10 flex flex-col gap-3 w-full max-w-xs">
                <div
                    v-for="item in features"
                    :key="item"
                    class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3"
                >
                    <div class="w-2 h-2 rounded-full bg-primary-400 shrink-0" />
                    <span class="text-sm text-white/90">{{ item }}</span>
                </div>
            </div>
        </div>

        <!-- Right form panel -->
        <div class="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-[hsl(var(--background))]">
            <Link href="/" class="lg:hidden flex items-center gap-2 mb-8">
                <div class="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
                    <CreditCard class="w-5 h-5 text-white" />
                </div>
                <span class="text-lg font-bold text-[hsl(var(--foreground))]">VCard SaaS</span>
            </Link>

            <div class="w-full max-w-md animate-slide-up">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { CreditCard } from 'lucide-vue-next';

const features = ['Digital Business Cards', 'QR Code Sharing', 'Analytics & Insights'];
</script>
