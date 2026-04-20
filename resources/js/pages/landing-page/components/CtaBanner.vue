<template>
  <section id="cta-banner" class="py-20 bg-white">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="gradient-primary rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden" :style="{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)' }">
        <div class="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div class="relative">
          <span v-if="data?.announcement_text" class="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
            {{ data.announcement_text }}
          </span>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            <template v-if="data?.title">
              {{ data.title }}
            </template>
            <template v-else>
              Ready to Create Your<br />Digital Business Card?
            </template>
          </h2>
          <p class="text-white/75 text-lg max-w-xl mx-auto mb-8">
            {{ data?.subtitle || data?.description || 'Join 18,500+ professionals who use vCard SaaS to make lasting first impressions and grow their network.' }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link :href="route('register')" class="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-bold rounded-xl text-base hover:bg-gray-50 transition-all duration-150 active:scale-95 shadow-lg justify-center">
              {{ data?.cta_text || 'Create Your Free vCard' }} <ArrowRight :size="18" />
            </Link>
            <Link :href="route('login')" class="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-base transition-all duration-150 active:scale-95 border border-white/30 justify-center">
              Sign In
            </Link>
          </div>
          <div v-if="displayBenefits && displayBenefits.length" class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <div v-for="(f, idx) in displayBenefits" :key="idx" class="flex items-center gap-2 text-white/80 text-sm">
              <component :is="getIcon(f.icon)" :size="16" class="text-white/60" />
              {{ f.text || f.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { 
  ArrowRight, Zap, Shield, BarChart3, Star, CheckCircle2, Globe, Smartphone, 
  Palette, Link2, QrCode, Layout, Users, MessageSquare, Megaphone, HelpCircle, 
  Mail, Phone, Info, Search, Code, Monitor 
} from 'lucide-vue-next';

const props = defineProps<{
  data?: any;
}>();

const icons: Record<string, any> = {
  Zap, Shield, BarChart3, Star, CheckCircle2, Globe, Smartphone, Palette, Link2, 
  QrCode, Layout, Users, MessageSquare, Megaphone, HelpCircle, Mail, Phone, Info, 
  Search, Code, Monitor, ArrowRight
};

const getIcon = (name: string) => {
  if (!name) return CheckCircle2;
  if (typeof name !== 'string') return name;
  return icons[name] || icons[name.charAt(0).toUpperCase() + name.slice(1)] || CheckCircle2;
};

const displayBenefits = computed(() => {
  if (props.data?.benefits && props.data.benefits.length > 0) {
    return props.data.benefits;
  }
  return [
    { text: 'Launch your vCard in under 10 minutes', icon: 'Zap' },
    { text: 'Secure, reliable, and always online', icon: 'Shield' },
    { text: 'Real-time analytics included', icon: 'BarChart3' },
  ];
});
</script>
