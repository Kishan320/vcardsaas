<template>
  <footer class="bg-gray-900 text-gray-400">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
        <div class="col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <CreditCard :size="18" class="text-white" />
            </div>
            <span class="font-bold text-xl text-white">{{ settings?.titleText || 'vCard SaaS' }}</span>
          </div>
          <p class="text-sm leading-relaxed mb-6 max-w-xs">
            {{ settings?.footerText || 'The all-in-one digital business card platform for professionals who want to make lasting impressions.' }}
          </p>
          <div class="flex gap-2">
            <a v-for="s in socials" :key="s.id" :href="s.href" :aria-label="s.label"
              class="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-150">
              <component :is="s.icon" :size="18" />
            </a>
          </div>
        </div>

        <div v-for="[section, links] in Object.entries(footerLinks)" :key="`footer-${section}`">
          <h4 class="text-white font-semibold text-sm mb-4">{{ section }}</h4>
          <ul class="space-y-2.5">
            <li v-for="link in links" :key="link.id">
              <a :href="link.href" class="text-sm hover:text-white transition-colors">{{ link.label }}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-8 mb-8">
        <div class="flex flex-wrap gap-6 text-sm">
          <div class="flex items-center gap-2"><Mail :size="14" class="text-primary-400" /><span>{{ settings?.contact_email || 'hello@vcardsaas.com' }}</span></div>
          <div v-if="settings?.contact_phone" class="flex items-center gap-2"><Phone :size="14" class="text-primary-400" /><span>{{ settings.contact_phone }}</span></div>
          <div v-if="settings?.contact_address" class="flex items-center gap-2"><MapPin :size="14" class="text-primary-400" /><span>{{ settings.contact_address }}</span></div>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span>© {{ new Date().getFullYear() }} {{ settings?.titleText || 'vCard SaaS' }}. All rights reserved.</span>
        <div class="flex gap-4">
          <a v-for="item in legalLinks" :key="item.id" href="#" class="hover:text-white transition-colors">{{ item.label }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Mail, Phone, MapPin, Twitter, Linkedin, Instagram, Youtube, Facebook, CreditCard } from 'lucide-vue-next';

defineProps<{ settings?: any }>();

const socials = [
  { id: 'soc-twitter', icon: Twitter, href: '#', label: 'Twitter' },
  { id: 'soc-linkedin', icon: Linkedin, href: '#', label: 'LinkedIn' },
  { id: 'soc-instagram', icon: Instagram, href: '#', label: 'Instagram' },
  { id: 'soc-youtube', icon: Youtube, href: '#', label: 'YouTube' },
  { id: 'soc-facebook', icon: Facebook, href: '#', label: 'Facebook' },
];

const footerLinks = {
  Product: [
    { id: 'fl-features', label: 'Features', href: '#features' },
    { id: 'fl-templates', label: 'Templates', href: '#templates' },
    { id: 'fl-pricing', label: 'Pricing', href: '#plans' },
    { id: 'fl-biolinks', label: 'Bio Links', href: '#' },
    { id: 'fl-nfc', label: 'NFC Cards', href: '#' },
  ],
  Platform: [
    { id: 'fl-dashboard', label: 'Dashboard', href: '/dashboard' },
    { id: 'fl-analytics', label: 'Analytics', href: '#' },
    { id: 'fl-domain', label: 'Custom Domain', href: '#' },
    { id: 'fl-api', label: 'API Access', href: '#' },
    { id: 'fl-integrations', label: 'Integrations', href: '#' },
  ],
  Resources: [
    { id: 'fl-docs', label: 'Documentation', href: '#' },
    { id: 'fl-blog', label: 'Blog', href: '#' },
    { id: 'fl-support', label: 'Support Center', href: '#' },
    { id: 'fl-status', label: 'System Status', href: '#' },
    { id: 'fl-changelog', label: 'Changelog', href: '#' },
  ],
  Company: [
    { id: 'fl-about', label: 'About Us', href: '#' },
    { id: 'fl-careers', label: 'Careers', href: '#' },
    { id: 'fl-partners', label: 'Partners', href: '#' },
    { id: 'fl-contact', label: 'Contact', href: '#contact' },
    { id: 'fl-press', label: 'Press Kit', href: '#' },
  ],
};

const legalLinks = [
  { id: 'legal-privacy', label: 'Privacy Policy' },
  { id: 'legal-terms', label: 'Terms of Service' },
  { id: 'legal-cookies', label: 'Cookie Policy' },
];
</script>
