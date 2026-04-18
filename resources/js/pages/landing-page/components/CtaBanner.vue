<template>
  <section class="py-20 bg-white">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="gradient-primary rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden">
        <div class="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div class="relative">
          <span class="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
            Start for free — no credit card required
          </span>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Ready to Create Your<br />Digital Business Card?
          </h2>
          <p class="text-white/75 text-lg max-w-xl mx-auto mb-8">
            Join 18,500+ professionals who use vCard SaaS to make lasting first impressions and grow their network.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link :href="route('register')" class="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-bold rounded-xl text-base hover:bg-gray-50 transition-all duration-150 active:scale-95 shadow-lg justify-center">
              Create Your Free vCard <ArrowRight :size="18" />
            </Link>
            <Link :href="route('login')" class="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-base transition-all duration-150 active:scale-95 border border-white/30 justify-center">
              Sign In
            </Link>
          </div>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <div v-for="f in features" :key="f.id" class="flex items-center gap-2 text-white/80 text-sm">
              <component :is="f.icon" :size="16" class="text-white/60" />
              {{ f.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ArrowRight, Zap, Shield, BarChart3 } from 'lucide-vue-next';

const features = [
  { id: 'feat-launch', icon: Zap, text: 'Launch your vCard in under 10 minutes' },
  { id: 'feat-secure', icon: Shield, text: 'Secure, reliable, and always online' },
  { id: 'feat-analytics', icon: BarChart3, text: 'Real-time analytics included' },
];
</script>
