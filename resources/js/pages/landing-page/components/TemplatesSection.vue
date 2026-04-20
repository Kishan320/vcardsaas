<template>
  <section id="templates" class="py-20 bg-gray-50">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span v-if="data?.badge || data?.announcement_text" class="text-sm font-semibold text-primary-600 uppercase tracking-wider">{{ data.badge || data.announcement_text || 'Browse by Industry' }}</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">{{ data?.title || 'Templates for Every Professional' }}</h2>
        <p class="text-gray-500 mt-3 max-w-xl mx-auto">{{ data?.subtitle || data?.description || '34+ beautifully designed templates across every industry. Pick one and make it yours in minutes.' }}</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <a v-for="(cat, idx) in displayCategories" :key="idx" :href="route('register')"
          :class="`${cat.bg || 'bg-gray-100'} rounded-2xl p-4 text-center hover:shadow-md transition-all duration-200 card-hover group cursor-pointer`"
          :style="cat.bg ? {} : { backgroundColor: 'rgba(var(--primary-color-rgb), 0.05)' }">
          <div :class="`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 bg-white shadow-sm ${cat.iconColor || 'text-primary-600'} group-hover:scale-110 transition-transform duration-200`" :style="cat.iconColor ? {} : { color: 'var(--primary-color)' }">
            <component :is="getIcon(cat.icon)" :size="24" />
          </div>
          <p class="text-sm font-semibold text-gray-900 mb-1">{{ cat.label || cat.name || cat.title }}</p>
          <p class="text-xs text-gray-500">{{ cat.count || 0 }} templates</p>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  Stethoscope, Code2, Briefcase, Camera, Utensils, Dumbbell, Music2, Home, Palette, GraduationCap, ShoppingBag, Building2,
  Zap, CreditCard, Globe, Smartphone, BarChart3, Shield, Link2, QrCode, Layout, Users, MessageSquare, Megaphone, HelpCircle, Mail, Phone, Info, Star, Search, Code, Monitor
} from 'lucide-vue-next';

const props = defineProps<{
  data?: any;
}>();

const icons: Record<string, any> = {
  Stethoscope, Code2, Briefcase, Camera, Utensils, Dumbbell, Music2, Home, Palette, GraduationCap, ShoppingBag, Building2,
  Zap, CreditCard, Globe, Smartphone, BarChart3, Shield, Link2, QrCode, Layout, Users, MessageSquare, Megaphone, HelpCircle, Mail, Phone, Info, Star, Search, Code, Monitor
};

const getIcon = (name: string) => {
  if (!name) return Layout;
  if (typeof name !== 'string') return name;
  return icons[name] || icons[name.charAt(0).toUpperCase() + name.slice(1)] || Layout;
};

const displayCategories = computed(() => {
  if (props.data?.templates_list && props.data.templates_list.length > 0) {
    return props.data.templates_list;
  }
  return [
    { id: 'cat-doctor', label: 'Healthcare', icon: 'Stethoscope', count: 4, bg: 'bg-red-50', iconColor: 'text-red-600' },
    { id: 'cat-tech', label: 'Technology', icon: 'Code2', count: 5, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { id: 'cat-business', label: 'Business', icon: 'Briefcase', count: 6, bg: 'bg-green-50', iconColor: 'text-green-600' },
    { id: 'cat-photo', label: 'Photography', icon: 'Camera', count: 3, bg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { id: 'cat-food', label: 'Food & Cafe', icon: 'Utensils', count: 3, bg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { id: 'cat-fitness', label: 'Fitness', icon: 'Dumbbell', count: 3, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
  ];
});
</script>
