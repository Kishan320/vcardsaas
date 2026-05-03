<template>
  <div class="min-h-screen bg-white" :style="themeStyles">
    <Head>
      <title>{{ page.meta_title || page.title }}</title>
      <meta v-if="page.meta_description" name="description" :content="page.meta_description" />
      <style v-html="customCSS" />
    </Head>
    
    <LandingNav :settings="settings" :theme="themeData" />
    
    <main class="pt-16">
      <div class="custom-page-content" v-html="page.content" />
    </main>
    
    <LandingFooter :settings="settings" :theme="themeData" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import LandingNav from './components/LandingNav.vue';
import LandingFooter from './components/LandingFooter.vue';

interface CustomPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
}

interface CustomPageData {
  id: number;
  title: string;
  slug: string;
}

interface PageProps {
  page: CustomPage;
  customPages: CustomPageData[];
  settings: {
    company_name: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    config_sections?: {
      sections?: Array<{
        key: string;
        [key: string]: any;
      }>;
      theme?: {
        primary_color?: string;
        secondary_color?: string;
        accent_color?: string;
      };
    };
    [key: string]: any;
  };
}

const props = defineProps<PageProps>();

const themeData = computed(() => props.settings?.config_sections?.theme || {});

const primaryColor = computed(() => themeData.value.primary_color || '#3b82f6');
const secondaryColor = computed(() => themeData.value.secondary_color || '#8b5cf6');
const accentColor = computed(() => themeData.value.accent_color || '#10b981');

const themeStyles = computed(() => ({
  '--primary-color': primaryColor.value,
  '--secondary-color': secondaryColor.value,
  '--accent-color': accentColor.value,
  '--primary-color-rgb': hexToRgb(primaryColor.value),
  '--secondary-color-rgb': hexToRgb(secondaryColor.value),
  '--accent-color-rgb': hexToRgb(accentColor.value)
}));

const customCSS = computed(() => `
  /* Fix form inputs */
  .custom-page-content input:focus, 
  .custom-page-content textarea:focus {
    --tw-ring-color: var(--primary-color) !important;
    border-color: var(--primary-color) !important;
  }
  
  /* Fix color issues */
  .custom-page-content .bg-blue-50 { background-color: rgba(var(--primary-color-rgb), 0.1) !important; }
  .custom-page-content .bg-purple-50 { background-color: rgba(var(--secondary-color-rgb), 0.1) !important; }
  .custom-page-content .bg-green-50 { background-color: rgba(var(--accent-color-rgb), 0.1) !important; }
  .custom-page-content .bg-red-50 { background-color: rgba(var(--accent-color-rgb), 0.1) !important; }
  
  .custom-page-content .text-blue-600 { color: var(--primary-color) !important; }
  .custom-page-content .text-purple-600 { color: var(--secondary-color) !important; }
  .custom-page-content .text-green-600 { color: var(--accent-color) !important; }
  .custom-page-content .text-red-600 { color: var(--accent-color) !important; }
  
  .custom-page-content .border-blue-500 { border-color: var(--primary-color) !important; }
  .custom-page-content .border-purple-500 { border-color: var(--secondary-color) !important; }
  .custom-page-content .border-green-500 { border-color: var(--accent-color) !important; }
  .custom-page-content .border-red-500 { border-color: var(--accent-color) !important; }
  
  .custom-page-content .bg-blue-600 { background-color: var(--primary-color) !important; }
  .custom-page-content .bg-purple-600 { background-color: var(--secondary-color) !important; }
  .custom-page-content .bg-green-600 { background-color: var(--accent-color) !important; }
  .custom-page-content .bg-red-500 { background-color: var(--accent-color) !important; }
  
  /* Fix border colors */
  .custom-page-content .border-blue-200 { border-color: rgba(var(--primary-color-rgb), 0.2) !important; }
  .custom-page-content .border-green-200 { border-color: rgba(var(--accent-color-rgb), 0.2) !important; }
  
  /* Fix hover states */
  .custom-page-content .hover\\:bg-blue-700:hover { background-color: var(--primary-color) !important; opacity: 0.9; }
  
  /* Fix form button */
  .custom-page-content .bg-blue-600 { background-color: var(--primary-color) !important; }
  
  /* Custom page content styling */
  .custom-page-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .custom-page-content h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }
  
  .custom-page-content h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    margin-top: 2rem;
    color: #374151;
  }
  
  .custom-page-content h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    margin-top: 1.5rem;
    color: #4b5563;
  }
  
  .custom-page-content p {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #6b7280;
  }
  
  .custom-page-content ul, .custom-page-content ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  .custom-page-content li {
    margin-bottom: 0.5rem;
    color: #6b7280;
  }
  
  .custom-page-content a {
    color: var(--primary-color);
    text-decoration: underline;
  }
  
  .custom-page-content a:hover {
    opacity: 0.8;
  }
  
  .custom-page-content img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1rem 0;
  }
  
  .custom-page-content blockquote {
    border-left: 4px solid var(--primary-color);
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: #6b7280;
  }
  
  .custom-page-content code {
    background-color: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
  }
  
  .custom-page-content pre {
    background-color: #1f2937;
    color: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
  }
  
  .custom-page-content pre code {
    background-color: transparent;
    padding: 0;
    color: inherit;
  }
`);

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '59, 130, 246';
}
</script>