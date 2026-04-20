<template>
  <section id="how-it-works" class="py-20 bg-white">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <span v-if="data?.badge || data?.announcement_text" class="text-sm font-semibold text-primary-600 uppercase tracking-wider">{{ data.badge || data.announcement_text || 'Simple Process' }}</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">{{ data?.title || 'Create Your vCard in 3 Steps' }}</h2>
        <p class="text-gray-500 mt-3 max-w-lg mx-auto">{{ data?.subtitle || data?.description || 'From sign-up to sharing your digital card — it takes less than 10 minutes.' }}</p>
      </div>

      <!-- Feature Grid Style (if data from settings is used) -->
      <div v-if="data?.reasons" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(reason, idx) in data.reasons" :key="idx" class="relative bg-white rounded-3xl p-8 shadow-card border border-gray-100 card-hover">
            <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <component :is="getIcon(reason.icon)" :size="28" />
            </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">{{ reason.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ reason.description }}</p>
        </div>
      </div>

      <!-- Default Steps Style -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <div class="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-200 to-primary-200" style="z-index: 0;" />
        <div v-for="(step, idx) in steps" :key="step.id" class="relative bg-white rounded-3xl p-8 shadow-card border border-gray-100 card-hover">
          <div class="flex items-center justify-between mb-6">
            <div :class="`w-14 h-14 rounded-2xl ${step.bg} ${step.iconColor} flex items-center justify-center`">
              <component :is="step.icon" :size="28" />
            </div>
            <span class="text-5xl font-extrabold text-gray-100 tabular-nums">{{ step.number }}</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">{{ step.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed mb-5">{{ step.description }}</p>
          <ul class="space-y-2">
            <li v-for="(h, i) in step.highlights" :key="`${step.id}-h-${i}`" class="flex items-center gap-2 text-sm text-gray-600">
              <div :class="`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.color}`" />
              {{ h }}
            </li>
          </ul>
          <div v-if="idx < steps.length - 1" class="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full shadow-sm z-10">
            <ArrowRight :size="14" class="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { 
  UserPlus, Palette, Share2, ArrowRight, Zap, CreditCard, Globe, Smartphone, 
  BarChart3, Shield, Link2, QrCode, Layout, Users, MessageSquare, Megaphone, 
  HelpCircle, Mail, Phone, Info, Star, Search, Code, Monitor, CheckCircle2 
} from 'lucide-vue-next';

const props = defineProps<{
  data?: any;
}>();

const icons: Record<string, any> = {
  UserPlus, Palette, Share2, ArrowRight, Zap, CreditCard, Globe, Smartphone, 
  BarChart3, Shield, Link2, QrCode, Layout, Users, MessageSquare, Megaphone, 
  HelpCircle, Mail, Phone, Info, Star, Search, Code, Monitor, CheckCircle2
};

const getIcon = (name: string) => {
  if (!name) return Info;
  if (typeof name !== 'string') return name;
  return icons[name] || icons[name.charAt(0).toUpperCase() + name.slice(1)] || Info;
};

const steps = [
  { id: 'step-1', number: '01', icon: UserPlus, title: 'Sign Up & Choose a Template', description: 'Create your free account in seconds. Browse our library of 34+ professional templates and pick the one that fits your brand.', color: 'from-blue-500 to-primary-600', bg: 'bg-blue-50', iconColor: 'text-blue-600', highlights: ['No credit card required', '34+ industry templates', 'Instant account setup'] },
  { id: 'step-2', number: '02', icon: Palette, title: 'Customize Your vCard', description: 'Add your photo, contact details, social links, portfolio, and more. Our drag-and-drop editor makes it effortless to build a stunning card.', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', iconColor: 'text-amber-600', highlights: ['Drag & drop editor', 'Custom colors & fonts', 'Add videos & galleries'] },
  { id: 'step-3', number: '03', icon: Share2, title: 'Share & Track Engagement', description: 'Share your vCard via link, QR code, or NFC. Watch real-time analytics to see who viewed your card and what they clicked.', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', iconColor: 'text-green-600', highlights: ['Unique QR code', 'Real-time analytics', 'NFC card support'] },
];
</script>
