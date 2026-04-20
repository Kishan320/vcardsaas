<template>
  <section id="features" class="py-20 bg-white">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <div v-if="data?.announcement_text || data?.badge" class="flex items-center justify-center gap-2 mb-2">
          <Zap :size="16" class="text-amber-500" />
          <span class="text-sm font-semibold text-amber-600 uppercase tracking-wider">{{ data.announcement_text || data.badge || 'Everything You Need' }}</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">{{ data?.title || 'Powerful Features for Professionals' }}</h2>
        <p class="text-gray-500 mt-3 max-w-xl mx-auto">{{ data?.subtitle || data?.description || 'Everything you need to create, share, and manage your digital presence — all in one platform.' }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(feature, idx) in displayFeatures" :key="idx"
          class="bg-white rounded-3xl p-7 border border-gray-100 shadow-card card-hover group">
          <div :class="`w-12 h-12 rounded-2xl ${feature.bg || 'bg-primary-50'} ${feature.iconColor || 'text-primary-600'} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`" :style="feature.bg ? {} : { backgroundColor: 'rgba(var(--secondary-color-rgb), 0.1)', color: 'var(--secondary-color)' }">
            <component :is="getIcon(feature.icon)" :size="24" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ feature.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  Zap, CreditCard, Globe, Smartphone, BarChart3, Shield, Palette, Link2, QrCode,
  Layout, Users, MessageSquare, Megaphone, HelpCircle, Mail, Phone, Info, Star,
  Search, Code, Monitor
} from 'lucide-vue-next';

const props = defineProps<{
  data?: any;
}>();

const icons: Record<string, any> = {
  Zap, CreditCard, Globe, Smartphone, BarChart3, Shield, Palette, Link2, QrCode,
  Layout, Users, MessageSquare, Megaphone, HelpCircle, Mail, Phone, Info, Star,
  Search, Code, Monitor
};

const getIcon = (name: string) => {
  if (!name) return Zap;
  // If name is already a component
  if (typeof name !== 'string') return name;
  return icons[name] || icons[name.charAt(0).toUpperCase() + name.slice(1)] || Zap;
};

const displayFeatures = computed(() => {
  if (props.data?.features_list && props.data.features_list.length > 0) {
    return props.data.features_list;
  }
  return [
    { title: 'Drag & Drop vCard Builder', description: 'Build stunning digital business cards with our intuitive editor.', icon: 'CreditCard', bg: 'bg-primary-50', iconColor: 'text-primary-600' },
    { title: 'Custom Domain & Subdomain', description: 'Share your vCard on your own domain or a branded subdomain.', icon: 'Globe', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { title: 'PWA & Mobile Optimized', description: 'Your vCard works as a Progressive Web App.', icon: 'Smartphone', bg: 'bg-green-50', iconColor: 'text-green-600' },
    { title: 'Real-Time Analytics', description: 'Track views, clicks, and engagement on your vCard.', icon: 'BarChart3', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { title: 'Password Protection', description: 'Keep your vCard private with optional password protection.', icon: 'Shield', bg: 'bg-red-50', iconColor: 'text-red-600' },
    { title: '34+ Premium Templates', description: 'Choose from a growing library of professionally designed templates.', icon: 'Palette', bg: 'bg-purple-50', iconColor: 'text-purple-600' },
  ];
});
</script>
