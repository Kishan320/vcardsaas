<template>
  <section id="features" class="py-20 bg-white">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <div class="flex items-center justify-center gap-2 mb-2">
          <Zap :size="16" class="text-amber-500" />
          <span class="text-sm font-semibold text-amber-600 uppercase tracking-wider">Everything You Need</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Powerful Features for Professionals</h2>
        <p class="text-gray-500 mt-3 max-w-xl mx-auto">Everything you need to create, share, and manage your digital presence — all in one platform.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="feature in features" :key="feature.id"
          class="bg-white rounded-3xl p-7 border border-gray-100 shadow-card card-hover group">
          <div :class="`w-12 h-12 rounded-2xl ${feature.bg} ${feature.iconColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`">
            <component :is="feature.icon" :size="24" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Zap, CreditCard, Globe, Smartphone, BarChart3, Shield, Palette, Link2, QrCode } from 'lucide-vue-next';

const features = [
  { id: 'feat-builder', icon: CreditCard, title: 'Drag & Drop vCard Builder', description: 'Build stunning digital business cards with our intuitive editor. Choose from 34+ professional templates and customize every detail.', bg: 'bg-primary-50', iconColor: 'text-primary-600' },
  { id: 'feat-domain', icon: Globe, title: 'Custom Domain & Subdomain', description: 'Share your vCard on your own domain or a branded subdomain. Make your digital card truly yours with a professional URL.', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { id: 'feat-pwa', icon: Smartphone, title: 'PWA & Mobile Optimized', description: 'Your vCard works as a Progressive Web App. Visitors can add it to their home screen for instant access — no app store needed.', bg: 'bg-green-50', iconColor: 'text-green-600' },
  { id: 'feat-analytics', icon: BarChart3, title: 'Real-Time Analytics', description: 'Track views, clicks, and engagement on your vCard. Understand your audience with detailed visitor insights and heatmaps.', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
  { id: 'feat-security', icon: Shield, title: 'Password Protection', description: 'Keep your vCard private with optional password protection. Share securely with only the people you choose.', bg: 'bg-red-50', iconColor: 'text-red-600' },
  { id: 'feat-themes', icon: Palette, title: '34+ Premium Templates', description: 'Choose from a growing library of professionally designed templates across every industry — from tech to hospitality.', bg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { id: 'feat-biolink', icon: Link2, title: 'Bio Link Pages', description: 'Create a beautiful bio link page to consolidate all your social profiles, websites, and content in one shareable link.', bg: 'bg-teal-50', iconColor: 'text-teal-600' },
  { id: 'feat-qr', icon: QrCode, title: 'QR Code Generation', description: 'Every vCard comes with a unique QR code. Print it on business cards, banners, or email signatures for instant sharing.', bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { id: 'feat-ai', icon: Zap, title: 'AI-Powered Content', description: 'Let our AI assistant help you write compelling bios, taglines, and descriptions that make your vCard stand out.', bg: 'bg-orange-50', iconColor: 'text-orange-600' },
];
</script>
