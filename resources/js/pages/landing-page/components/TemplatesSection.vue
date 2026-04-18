<template>
  <section id="templates" class="py-20 bg-gray-50">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span class="text-sm font-semibold text-primary-600 uppercase tracking-wider">Browse by Industry</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Templates for Every Professional</h2>
        <p class="text-gray-500 mt-3 max-w-xl mx-auto">34+ beautifully designed templates across every industry. Pick one and make it yours in minutes.</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <a v-for="cat in categories" :key="cat.id" :href="route('register')"
          :class="`${cat.bg} rounded-2xl p-4 text-center hover:shadow-md transition-all duration-200 card-hover group cursor-pointer`">
          <div :class="`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 bg-white shadow-sm ${cat.iconColor} group-hover:scale-110 transition-transform duration-200`">
            <component :is="cat.icon" :size="24" />
          </div>
          <p class="text-sm font-semibold text-gray-900 mb-1">{{ cat.label }}</p>
          <p class="text-xs text-gray-500">{{ cat.count }} templates</p>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Stethoscope, Code2, Briefcase, Camera, Utensils, Dumbbell, Music2, Home, Palette, GraduationCap, ShoppingBag, Building2 } from 'lucide-vue-next';

const categories = [
  { id: 'cat-doctor', label: 'Healthcare', icon: Stethoscope, count: 4, bg: 'bg-red-50', iconColor: 'text-red-600' },
  { id: 'cat-tech', label: 'Technology', icon: Code2, count: 5, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { id: 'cat-business', label: 'Business', icon: Briefcase, count: 6, bg: 'bg-green-50', iconColor: 'text-green-600' },
  { id: 'cat-photo', label: 'Photography', icon: Camera, count: 3, bg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { id: 'cat-food', label: 'Food & Cafe', icon: Utensils, count: 3, bg: 'bg-amber-50', iconColor: 'text-amber-600' },
  { id: 'cat-fitness', label: 'Fitness', icon: Dumbbell, count: 3, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
  { id: 'cat-music', label: 'Music & Arts', icon: Music2, count: 2, bg: 'bg-pink-50', iconColor: 'text-pink-600' },
  { id: 'cat-realestate', label: 'Real Estate', icon: Home, count: 2, bg: 'bg-teal-50', iconColor: 'text-teal-600' },
  { id: 'cat-design', label: 'Design', icon: Palette, count: 2, bg: 'bg-violet-50', iconColor: 'text-violet-600' },
  { id: 'cat-education', label: 'Education', icon: GraduationCap, count: 2, bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { id: 'cat-retail', label: 'Retail', icon: ShoppingBag, count: 1, bg: 'bg-lime-50', iconColor: 'text-lime-700' },
  { id: 'cat-corporate', label: 'Corporate', icon: Building2, count: 1, bg: 'bg-slate-50', iconColor: 'text-slate-600' },
];
</script>
