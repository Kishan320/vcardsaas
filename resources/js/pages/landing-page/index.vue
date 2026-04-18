<template>
  <div class="min-h-screen bg-white">
    <Head :title="settings?.titleText || 'vCard SaaS'" />
    <LandingNav :settings="settings" />
    <HeroSection />
    <FeaturesSection />
    <TemplatesSection />
    <HowItWorks />
    <PlansSection :plans="plans" />
    <TestimonialsSection />
    <CtaBanner />
    <ContactSection :settings="settings" />
    <LandingFooter :settings="settings" />
  </div>
</template>

<script setup lang="ts">
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

defineProps<{
  plans?: any[];
  settings?: any;
  customPages?: any[];
  activeCampaigns?: any[];
}>();
</script>
