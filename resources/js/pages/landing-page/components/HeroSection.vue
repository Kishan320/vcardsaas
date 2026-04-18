<template>
  <section class="relative gradient-hero min-h-screen flex items-center overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-20 left-20 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600 rounded-full blur-3xl" />
    </div>
    <div class="absolute inset-0" style="background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 40px 40px;" />

    <div v-for="card in floatingCards" :key="card.id" :class="`absolute ${card.x} ${card.y} hidden xl:block animate-fade-in`">
      <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 w-48 shadow-lg">
        <div class="flex items-center gap-2 mb-2">
          <div :class="`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center flex-shrink-0`">
            <component :is="card.icon" :size="16" :class="card.iconColor" />
          </div>
          <div>
            <p class="text-white text-xs font-semibold truncate">{{ card.title }}</p>
            <p class="text-white/60 text-[10px]">{{ card.sub }}</p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <Eye :size="10" class="text-white/60" />
          <span class="text-white/60 text-[10px]">{{ card.views.toLocaleString() }} views</span>
        </div>
      </div>
    </div>

    <div class="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
      <div class="max-w-3xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
          <TrendingUp :size="14" class="text-amber-400" />
          <span class="text-white/90 text-sm font-medium">Trusted by 18,500+ professionals worldwide</span>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-6">
          Create Stunning<br />
          <span class="text-gradient">Digital Business</span><br />
          Cards in Minutes
        </h1>

        <p class="text-white/70 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Build beautiful, interactive vCards that make lasting impressions. Share your contact, portfolio, and brand — all from one powerful link.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link :href="route('register')" class="flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-bold rounded-xl text-base hover:bg-gray-50 transition-all duration-150 active:scale-95 shadow-lg justify-center">
            Start for Free <ChevronRight :size="18" />
          </Link>
          <a href="#features" class="flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-base transition-all duration-150 active:scale-95 border border-white/30 justify-center">
            See How It Works
          </a>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div v-for="stat in stats" :key="stat.id" class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
            <p class="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">{{ stat.value }}</p>
            <p class="text-white/60 text-xs sm:text-sm mt-1">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
        <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ChevronRight, TrendingUp, Eye, CreditCard, Globe, Smartphone } from 'lucide-vue-next';

const stats = [
  { id: 'stat-cards', value: '2.4M+', label: 'vCards Created' },
  { id: 'stat-views', value: '18M+', label: 'Card Views' },
  { id: 'stat-users', value: '18,500', label: 'Professionals' },
  { id: 'stat-countries', value: '120+', label: 'Countries' },
];

const floatingCards = [
  { id: 'float-1', icon: CreditCard, title: 'Alex Johnson', sub: 'Product Designer', views: 2400, bg: 'bg-blue-500/30', iconColor: 'text-blue-300', x: 'left-4 lg:left-8', y: 'top-32' },
  { id: 'float-2', icon: Globe, title: 'Sarah Chen', sub: 'Marketing Lead', views: 1800, bg: 'bg-amber-500/30', iconColor: 'text-amber-300', x: 'right-4 lg:right-8', y: 'top-24' },
  { id: 'float-3', icon: Smartphone, title: 'Marco Rossi', sub: 'Freelance Dev', views: 950, bg: 'bg-green-500/30', iconColor: 'text-green-300', x: 'right-4 lg:right-16', y: 'bottom-32' },
];
</script>
