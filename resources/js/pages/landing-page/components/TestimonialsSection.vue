<template>
  <section class="py-20 bg-white">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span class="text-sm font-semibold text-primary-600 uppercase tracking-wider">Testimonials</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Loved by Professionals Worldwide</h2>
        <p class="text-gray-500 mt-3">Join 18,500+ professionals who use vCard SaaS to grow their network</p>
      </div>

      <div class="max-w-4xl mx-auto mb-8">
        <div class="bg-gradient-to-br from-primary-50 to-violet-50 rounded-3xl p-8 lg:p-12 relative border border-primary-100">
          <Quote :size="48" class="text-primary-200 absolute top-8 right-8" />
          <div class="flex items-start gap-6">
            <div class="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-md bg-primary-100 flex items-center justify-center">
              <span class="text-2xl font-extrabold text-primary-600">{{ testimonials[current].name.charAt(0) }}</span>
            </div>
            <div>
              <div class="flex gap-0.5 mb-1">
                <Star v-for="i in 5" :key="`star-${i}`" :size="16"
                  :class="i <= testimonials[current].rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'" />
              </div>
              <p class="font-bold text-gray-900">{{ testimonials[current].name }}</p>
              <p class="text-sm text-gray-500">{{ testimonials[current].role }}</p>
            </div>
          </div>
          <blockquote class="text-gray-700 text-lg leading-relaxed mt-6 mb-6">
            "{{ testimonials[current].review }}"
          </blockquote>
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex items-center gap-2 bg-white/70 rounded-xl px-4 py-2.5 border border-white">
              <div class="w-2 h-2 rounded-full bg-primary-500" />
              <span class="text-sm text-gray-600 font-medium">{{ testimonials[current].stat1 }}</span>
            </div>
            <div class="flex items-center gap-2 bg-white/70 rounded-xl px-4 py-2.5 border border-white">
              <div class="w-2 h-2 rounded-full bg-green-500" />
              <span class="text-sm text-gray-600 font-medium">{{ testimonials[current].stat2 }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
        <div class="flex items-center gap-3">
          <button @click="prev" class="p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-all active:scale-95">
            <ChevronLeft :size="18" class="text-gray-600" />
          </button>
          <div class="flex gap-2">
            <button v-for="(_, i) in testimonials" :key="`dot-${i}`" @click="current = i"
              :class="`rounded-full transition-all duration-200 ${i === current ? 'w-6 h-2.5 bg-primary-500' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'}`" />
          </div>
          <button @click="next" class="p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-all active:scale-95">
            <ChevronRight :size="18" class="text-gray-600" />
          </button>
        </div>
        <div class="flex gap-3">
          <button v-for="(t, i) in testimonials" :key="t.id" @click="current = i"
            :class="`relative w-10 h-10 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center transition-all duration-200 ${i === current ? 'ring-2 ring-primary-500 ring-offset-2' : 'opacity-50 hover:opacity-100'}`">
            <span class="text-sm font-extrabold text-primary-600">{{ t.name.charAt(0) }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-vue-next';

const current = ref(0);
const prev = () => { current.value = (current.value - 1 + testimonials.length) % testimonials.length; };
const next = () => { current.value = (current.value + 1) % testimonials.length; };

const testimonials = [
  { id: 'test-001', name: 'Priya Nambiar', role: 'UX Designer, TechWave Inc.', rating: 5, review: 'vCard SaaS completely transformed how I share my portfolio. I went from handing out paper cards to sharing a stunning digital card that gets 300+ views a month. The analytics are incredible.', stat1: '340 card views / month', stat2: '12 new client inquiries' },
  { id: 'test-002', name: 'Marcus Williams', role: 'Freelance Developer', rating: 5, review: "The custom domain feature is a game-changer. My vCard lives at my own domain and looks completely professional. Clients are always impressed before we even speak.", stat1: 'Custom domain setup in 5 min', stat2: '28% more client conversions' },
  { id: 'test-003', name: 'Camille Fontaine', role: 'Marketing Director, Meridian Co.', rating: 5, review: 'We rolled out vCard SaaS for our entire 40-person sales team. The team management features and analytics dashboard make it easy to track engagement across the whole company.', stat1: '40 team vCards managed', stat2: '1,400+ monthly card views' },
  { id: 'test-004', name: 'Daisuke Yamamoto', role: 'Founder, Esports Arena Tokyo', rating: 4, review: 'The bio link feature alone is worth it. I replaced 5 different tools with one vCard SaaS account. My audience can find everything — social links, booking page, portfolio — in one place.', stat1: 'Replaced 5 separate tools', stat2: '3,600 bio link visits / month' },
];
</script>
