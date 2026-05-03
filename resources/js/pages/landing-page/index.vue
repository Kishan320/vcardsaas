<template>
  <div class="min-h-screen bg-white" :style="themeStyles">
    <Head :title="seoData.meta_title || settings?.titleText || 'vCard SaaS'">
      <meta name="description" :content="seoData.meta_description" />
      <meta name="keywords" :content="seoData.meta_keywords" />
    </Head>
    
    <!-- Render Navbar (always on top) -->
    <LandingNav :settings="settings" :theme="themeData" :customPages="customPages" />

    <!-- Dynamically Render Sections based on section_order -->
    <template v-for="key in activeSections" :key="key">
      <HeroSection v-if="key === 'hero'" :data="getSectionData('hero')" />
      <FeaturesSection v-else-if="key === 'features'" :data="getSectionData('features')" />
      <TemplatesSection v-else-if="key === 'templates'" :data="getSectionData('templates')" />
      <HowItWorks v-else-if="key === 'about'" :data="getSectionData('about')" />
      <PlansSection v-else-if="key === 'plans'" :plans="plans" :data="getSectionData('plans')" />
      <TestimonialsSection v-else-if="key === 'testimonials'" :data="getSectionData('testimonials')" />
      <CtaBanner v-else-if="key === 'newsletter'" :data="getSectionData('newsletter')" />
      <ContactSection v-else-if="key === 'contact'" :settings="settings" :data="getSectionData('contact')" />
      <!-- Add other sections as needed: screenshots, why_choose_us, team, active_campaigns, faq -->
    </template>

    <!-- Render Footer (always at bottom) -->
    <LandingFooter :settings="settings" :theme="themeData" :customPages="customPages" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { Head } from '@inertiajs/vue3';
import LandingNav from './components/LandingNav.vue';
import HeroSection from './components/HeroSection.vue';
import FeaturesSection from './components/FeaturesSection.vue';
import TemplatesSection from './components/TemplatesSection.vue';
import HowItWorks from './components/HowItWorks.vue';
import PlansSection from './components/PlansSection.vue';
import TestimonialsSection from './components/TestimonialsSection.vue';
import CtaBanner from './components/CtaBanner.vue';
import ContactSection from './components/ContactSection.vue';
import LandingFooter from './components/LandingFooter.vue';

const props = defineProps<{
  plans?: any[];
  settings?: any;
  customPages?: any[];
  activeCampaigns?: any[];
}>();

const config = computed(() => props.settings?.config_sections || {});
const themeData = computed(() => config.value.theme || {});
const seoData = computed(() => config.value.seo || {});
const customCss = computed(() => config.value.custom_css || '');

const activeSections = computed(() => {
  const order = config.value.section_order || [];
  const visibility = config.value.section_visibility || {};
  return order.filter(key => visibility[key] !== false);
});

const getSectionData = (key: string) => {
  return config.value.sections?.find((s: any) => s.key === key) || {};
};

const themeStyles = computed(() => {
  const primary = themeData.value.primary_color || '#111827';
  const secondary = themeData.value.secondary_color || '#10b981';
  const accent = themeData.value.accent_color || '#f59e0b';
  return {
    '--primary-color': primary,
    '--secondary-color': secondary,
    '--accent-color': accent,
    // Override global brand --primary so brand settings don't bleed in
    '--primary': hexToHsl(secondary),
    '--theme-color': secondary,
  };
});

function hexToHsl(hex: string): string {
  let r = parseInt(hex.substring(1, 3), 16) / 255;
  let g = parseInt(hex.substring(3, 5), 16) / 255;
  let b = parseInt(hex.substring(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Inject custom CSS into Head
const injectCustomCss = (css: string) => {
  if (!css) return;
  let styleEl = document.getElementById('custom-landing-css');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'custom-landing-css';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
};

onMounted(() => {
  injectCustomCss(customCss.value);
});

watch(customCss, (newCss) => {
  injectCustomCss(newCss);
});
</script>

<style>
:root {
  --primary-color: #111827;
  --secondary-color: #10b981;
  --accent-color: #f59e0b;
}
.text-gradient {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.bg-primary-600 {
  background-color: var(--secondary-color) !important;
}
.text-primary-600 {
  color: var(--secondary-color) !important;
}
.hover\:bg-primary-700:hover {
  background-color: var(--primary-color) !important;
}
</style>
