<template>
  <nav :class="`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
            <CreditCard :size="18" class="text-white" />
          </div>
          <span :class="`font-bold text-xl tracking-tight ${scrolled ? 'text-gray-900' : 'text-white'}`">
            {{ settings?.titleText || 'vCard SaaS' }}
          </span>
        </div>

        <div class="hidden md:flex items-center gap-6">
          <a v-for="item in navLinks" :key="item.id" :href="item.href"
            :class="`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-primary-600' : 'text-white/80 hover:text-white'}`">
            {{ item.label }}
          </a>
        </div>

        <div class="hidden md:flex items-center gap-3">
          <Link :href="route('login')" :class="`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-primary-600' : 'text-white/80 hover:text-white'}`">
            Sign In
          </Link>
          <Link :href="route('register')" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all duration-150 active:scale-95">
            Get Started Free
          </Link>
        </div>

        <button @click="mobileOpen = !mobileOpen"
          :class="`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`">
          <X v-if="mobileOpen" :size="20" />
          <Menu v-else :size="20" />
        </button>
      </div>
    </div>

    <div v-if="mobileOpen" class="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
      <div class="px-4 py-3 space-y-1">
        <a v-for="item in navLinks" :key="`m-${item.id}`" :href="item.href"
          class="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          @click="mobileOpen = false">
          {{ item.label }}
        </a>
        <div class="pt-2 border-t border-gray-100 flex flex-col gap-2">
          <Link :href="route('login')" class="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-center">Sign In</Link>
          <Link :href="route('register')" class="px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg text-center transition-colors hover:bg-primary-700">Get Started Free</Link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Link } from '@inertiajs/vue3';
import { Menu, X, CreditCard } from 'lucide-vue-next';

defineProps<{ settings?: any }>();

const scrolled = ref(false);
const mobileOpen = ref(false);

const navLinks = [
  { id: 'nav-features', label: 'Features', href: '#features' },
  { id: 'nav-templates', label: 'Templates', href: '#templates' },
  { id: 'nav-plans', label: 'Pricing', href: '#plans' },
  { id: 'nav-contact', label: 'Contact', href: '#contact' },
];

const handleScroll = () => { scrolled.value = window.scrollY > 20; };
onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>
