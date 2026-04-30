<template>
  <AppLayout>
    <Head title="Settings" />
    <FlashMessage />
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ t('Settings') }}</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ t('Manage your application settings') }}</p>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <div class="md:w-64 flex-shrink-0">
          <div class="sticky top-20">
            <ScrollArea class="h-[calc(100vh-5rem)]">
              <div class="space-y-1 pr-4">
                <Button
                  v-for="item in sidebarNavItems"
                  :key="item.href"
                  variant="ghost"
                  class="w-full justify-start"
                  :class="{ 'bg-muted font-medium': activeSection === item.href.replace('#', '') }"
                  @click="handleNavClick(item.href)"
                >
                  <component :is="item.icon" class="h-4 w-4 mr-2" />
                  {{ item.title }}
                </Button>
              </div>
            </ScrollArea>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <!-- System Settings Section -->
          <section id="system-settings" ref="systemSettingsRef" class="mb-8">
            <SystemSettings
              :settings="systemSettings"
              :timezones="timezones"
              :dateFormats="dateFormats"
              :timeFormats="timeFormats"
            />
          </section>

          <!-- Brand Settings Section -->
          <section id="brand-settings" ref="brandSettingsRef" class="mb-8">
            <BrandSettings />
          </section>

          <!-- Currency Settings Section -->
          <section id="currency-settings" ref="currencySettingsRef" class="mb-8">
            <CurrencySettings />
          </section>

          <!-- Email Settings Section -->
          <section id="email-settings" ref="emailSettingsRef" class="mb-8">
            <EmailSettings />
          </section>

          <!-- Payment Settings Section -->
          <section id="payment-settings" ref="paymentSettingsRef" class="mb-8">
            <PaymentSettings :settings="paymentSettings" />
          </section>

          <!-- Storage Settings Section -->
          <section id="storage-settings" ref="storageSettingsRef" class="mb-8">
            <StorageSettings :settings="systemSettings" />
          </section>

          <!-- ReCaptcha Settings Section -->
          <section id="recaptcha-settings" ref="recaptchaSettingsRef" class="mb-8">
            <RecaptchaSettings :settings="systemSettings" />
          </section>

          <!-- Chat GPT Settings Section -->
          <section id="chatgpt-settings" ref="chatgptSettingsRef" class="mb-8">
            <ChatGptSettings :settings="systemSettings" />
          </section>

          <!-- Cookie Settings Section -->
          <section id="cookie-settings" ref="cookieSettingsRef" class="mb-8">
            <CookieSettings :settings="systemSettings" />
          </section>

          <!-- SEO Settings Section -->
          <section id="seo-settings" ref="seoSettingsRef" class="mb-8">
            <SeoSettings :settings="systemSettings" />
          </section>

          <!-- Cache Settings Section -->
          <section id="cache-settings" ref="cacheSettingsRef" class="mb-8">
            <CacheSettings :cache-size="cacheSize" />
          </section>

          <!-- Google Calendar Settings Section -->
          <section id="google-calendar-settings" ref="googleCalendarSettingsRef" class="mb-8">
            <GoogleCalendarSettings :settings="systemSettings" />
          </section>

          <!-- Google Wallet Settings Section -->
          <section id="google-wallet-settings" ref="googleWalletSettingsRef" class="mb-8">
            <GoogleWalletSettings :settings="systemSettings" />
          </section>

          <!-- Webhook Settings Section -->
          <section id="webhook-settings" ref="webhookSettingsRef" class="mb-8">
            <WebhookSettings :webhooks="webhooks" />
          </section>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import {
  Settings as SettingsIcon,
  Building,
  DollarSign,
  Users,
  RefreshCw,
  Palette,
  BookOpen,
  Award,
  FileText,
  Mail,
  Bell,
  Link2,
  CreditCard,
  Calendar,
  HardDrive,
  Shield,
  Bot,
  Cookie,
  Search,
  Webhook,
  Wallet
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import SystemSettings from './components/SystemSettings.vue';
import BrandSettings from './components/BrandSettings.vue';
import CurrencySettings from './components/CurrencySettings.vue';
import EmailSettings from './components/EmailSettings.vue';
import PaymentSettings from './components/PaymentSettings.vue';
import StorageSettings from './components/StorageSettings.vue';
import RecaptchaSettings from './components/RecaptchaSettings.vue';
import ChatGptSettings from './components/ChatGptSettings.vue';
import CookieSettings from './components/CookieSettings.vue';
import SeoSettings from './components/SeoSettings.vue';
import CacheSettings from './components/CacheSettings.vue';
import GoogleCalendarSettings from './components/GoogleCalendarSettings.vue';
import GoogleWalletSettings from './components/GoogleWalletSettings.vue';
import WebhookSettings from './components/WebhookSettings.vue';

const { t } = useI18n();
const page = usePage();
const { systemSettings = {}, cacheSize = '0.00', timezones = {}, dateFormats = {}, timeFormats = {}, paymentSettings = {}, webhooks = [], auth = {} } = page.props as any;

const activeSection = ref('system-settings');
const isManualNavigation = ref(false);

// Refs for each section
const systemSettingsRef = ref<HTMLElement | null>(null);
const brandSettingsRef = ref<HTMLElement | null>(null);
const currencySettingsRef = ref<HTMLElement | null>(null);
const emailSettingsRef = ref<HTMLElement | null>(null);
const paymentSettingsRef = ref<HTMLElement | null>(null);
const storageSettingsRef = ref<HTMLElement | null>(null);
const recaptchaSettingsRef = ref<HTMLElement | null>(null);
const chatgptSettingsRef = ref<HTMLElement | null>(null);
const cookieSettingsRef = ref<HTMLElement | null>(null);
const seoSettingsRef = ref<HTMLElement | null>(null);
const cacheSettingsRef = ref<HTMLElement | null>(null);
const webhookSettingsRef = ref<HTMLElement | null>(null);
const googleCalendarSettingsRef = ref<HTMLElement | null>(null);
const googleWalletSettingsRef = ref<HTMLElement | null>(null);

// Define all possible sidebar navigation items
const allSidebarNavItems = [
  {
    title: t('System Settings'),
    href: '#system-settings',
    icon: SettingsIcon,
    permission: 'manage-system-settings'
  },
  {
    title: t('Brand Settings'),
    href: '#brand-settings',
    icon: Palette,
    permission: 'manage-brand-settings'
  },
  {
    title: t('Currency Settings'),
    href: '#currency-settings',
    icon: DollarSign,
    permission: 'manage-currency-settings'
  },
  {
    title: t('Email Settings'),
    href: '#email-settings',
    icon: Mail,
    permission: 'manage-email-settings'
  },
  {
    title: t('Payment Settings'),
    href: '#payment-settings',
    icon: CreditCard,
    permission: 'manage-payment-settings'
  },
  {
    title: t('Storage Settings'),
    href: '#storage-settings',
    icon: HardDrive,
    permission: 'manage-storage-settings'
  },
  {
    title: t('ReCaptcha Settings'),
    href: '#recaptcha-settings',
    icon: Shield,
    permission: 'manage-recaptcha-settings'
  },
  {
    title: t('Chat GPT Settings'),
    href: '#chatgpt-settings',
    icon: Bot,
    permission: 'manage-chatgpt-settings'
  },
  {
    title: t('Cookie Settings'),
    href: '#cookie-settings',
    icon: Cookie,
    permission: 'manage-cookie-settings'
  },
  {
    title: t('SEO Settings'),
    href: '#seo-settings',
    icon: Search,
    permission: 'manage-seo-settings'
  },
  {
    title: t('Cache Settings'),
    href: '#cache-settings',
    icon: HardDrive,
    permission: 'manage-cache-settings'
  },
  {
    title: t('Google Calendar Settings'),
    href: '#google-calendar-settings',
    icon: Calendar,
    permission: 'settings'
  },
  {
    title: t('Google Wallet Settings'),
    href: '#google-wallet-settings',
    icon: Wallet,
    permission: 'settings'
  },
  {
    title: t('Webhook Settings'),
    href: '#webhook-settings',
    icon: Webhook,
    permission: 'manage-webhook-settings'
  }
];

// Filter sidebar items based on user permissions
const sidebarNavItems = allSidebarNavItems.filter(item => {
  // If no permission is required or user has the permission
  if (!item.permission || (auth.permissions && auth.permissions.includes(item.permission))) {
    return true;
  }
  // For company users, only show specific settings
  if (auth.user && auth.user.type === 'company') {
    return ['manage-system-settings', 'manage-email-settings', 'manage-brand-settings', 'manage-webhook-settings', 'settings'].includes(item.permission);
  }
  return false;
});

// Smart scroll functionality
const handleScroll = () => {
  const scrollPosition = window.scrollY + 100;

  // Get all section elements that are currently rendered
  const sections = [
    { id: 'system-settings', ref: systemSettingsRef },
    { id: 'brand-settings', ref: brandSettingsRef },
    { id: 'currency-settings', ref: currencySettingsRef },
    { id: 'email-settings', ref: emailSettingsRef },
    { id: 'payment-settings', ref: paymentSettingsRef },
    { id: 'storage-settings', ref: storageSettingsRef },
    { id: 'recaptcha-settings', ref: recaptchaSettingsRef },
    { id: 'chatgpt-settings', ref: chatgptSettingsRef },
    { id: 'cookie-settings', ref: cookieSettingsRef },
    { id: 'seo-settings', ref: seoSettingsRef },
    { id: 'cache-settings', ref: cacheSettingsRef },
    { id: 'google-calendar-settings', ref: googleCalendarSettingsRef },
    { id: 'google-wallet-settings', ref: googleWalletSettingsRef },
    { id: 'webhook-settings', ref: webhookSettingsRef }
  ].filter(section => section.ref.value);

  // Find the active section
  let activeId = sections[0]?.id || 'system-settings';

  for (const section of sections) {
    const element = section.ref.value;
    if (element) {
      const rect = element.getBoundingClientRect();
      const elementTop = window.scrollY + rect.top;

      if (scrollPosition >= elementTop) {
        activeId = section.id;
      }
    }
  }

  // Only update if not manually navigating
  if (!isManualNavigation.value) {
    activeSection.value = activeId;
  }
};

// Handle navigation click
const handleNavClick = (href: string) => {
  const id = href.replace('#', '');
  isManualNavigation.value = true;
  activeSection.value = id;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  setTimeout(() => {
    isManualNavigation.value = false;
  }, 150);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);

  // Initial check
  handleScroll();

  // Check for hash in URL
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    setTimeout(() => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        activeSection.value = hash;
      }
    }, 100);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
