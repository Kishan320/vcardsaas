<template>
  <section class="py-20 bg-white">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span class="text-sm font-semibold text-primary-600 uppercase tracking-wider">{{ data?.badge || 'Testimonials' }}</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">{{ data?.title || 'Loved by Professionals Worldwide' }}</h2>
        <p class="text-gray-500 mt-3">{{ data?.subtitle || 'Join 18,500+ professionals who use vCard SaaS to grow their network' }}</p>
      </div>

      <div v-if="displayTestimonials && displayTestimonials.length" class="max-w-4xl mx-auto mb-8">
        <div class="bg-gradient-to-br from-primary-50 to-violet-50 rounded-3xl p-8 lg:p-12 relative border border-primary-100 min-h-[300px]">
          <Quote :size="48" class="text-primary-200 absolute top-8 right-8" />
          <div class="flex items-start gap-6">
            <div class="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-md bg-primary-100 flex items-center justify-center">
              <img v-if="displayTestimonials[current].image" :src="displayTestimonials[current].image" class="w-full h-full object-cover" />
              <span v-else class="text-2xl font-extrabold text-primary-600">{{ displayTestimonials[current].name.charAt(0) }}</span>
            </div>
            <div>
              <div class="flex gap-0.5 mb-1">
                <Star v-for="i in 5" :key="`star-${i}`" :size="16"
                  :class="i <= (displayTestimonials[current].rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'" />
              </div>
              <p class="font-bold text-gray-900">{{ displayTestimonials[current].name }}</p>
              <p class="text-sm text-gray-500">{{ displayTestimonials[current].role }} <template v-if="displayTestimonials[current].company">, {{ displayTestimonials[current].company }}</template></p>
            </div>
          </div>
          <blockquote class="text-gray-700 text-lg leading-relaxed mt-6 mb-6 italic">
            "{{ displayTestimonials[current].content || displayTestimonials[current].review }}"
          </blockquote>
          
          <div v-if="displayTestimonials[current].stat1 || displayTestimonials[current].stat2" class="flex flex-col sm:flex-row gap-4">
            <div v-if="displayTestimonials[current].stat1" class="flex items-center gap-2 bg-white/70 rounded-xl px-4 py-2.5 border border-white shadow-sm">
              <div class="w-2 h-2 rounded-full bg-primary-500" />
              <span class="text-sm text-gray-600 font-medium">{{ displayTestimonials[current].stat1 }}</span>
            </div>
            <div v-if="displayTestimonials[current].stat2" class="flex items-center gap-2 bg-white/70 rounded-xl px-4 py-2.5 border border-white shadow-sm">
              <div class="w-2 h-2 rounded-full bg-green-500" />
              <span class="text-sm text-gray-600 font-medium">{{ displayTestimonials[current].stat2 }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="displayTestimonials && displayTestimonials.length > 1" class="flex flex-col sm:flex-row items-center justify-center gap-6">
        <div class="flex items-center gap-3">
          <button @click="prev" class="p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-all active:scale-95">
            <ChevronLeft :size="18" class="text-gray-600" />
          </button>
          <div class="flex gap-2">
            <button v-for="(_, i) in displayTestimonials" :key="`dot-${i}`" @click="current = i"
              :class="`rounded-full transition-all duration-200 ${i === current ? 'w-6 h-2.5 bg-primary-500' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'}`" />
          </div>
          <button @click="next" class="p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-all active:scale-95">
            <ChevronRight :size="18" class="text-gray-600" />
          </button>
        </div>
        <div class="flex gap-3">
          <button v-for="(t, i) in displayTestimonials" :key="i" @click="current = i"
            :class="`relative w-10 h-10 rounded-full overflow-hidden bg-primary-100 border-2 flex items-center justify-center transition-all duration-200 ${i === current ? 'border-primary-500 shadow-md scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`">
            <img v-if="t.image" :src="t.image" class="w-full h-full object-cover" />
            <span v-else class="text-sm font-extrabold text-primary-600">{{ t.name.charAt(0) }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-vue-next';

const props = defineProps<{
  data?: any;
}>();

const current = ref(0);

const displayTestimonials = computed(() => {
  if (props.data?.testimonials && props.data.testimonials.length > 0) {
    return props.data.testimonials;
  }
  return [
    { name: 'Priya Nambiar', role: 'UX Designer', company: 'TechWave Inc.', rating: 5, content: 'vCard SaaS completely transformed how I share my portfolio.', stat1: '340 card views / month', stat2: '12 new client inquiries' },
    { name: 'Marcus Williams', role: 'Freelance Developer', company: '', rating: 5, content: "The custom domain feature is a game-changer.", stat1: 'Custom domain setup in 5 min', stat2: '28% more client conversions' },
    { name: 'Camille Fontaine', role: 'Marketing Director', company: 'Meridian Co.', rating: 5, content: 'We rolled out vCard SaaS for our entire 40-person sales team.', stat1: '40 team vCards managed' },
  ];
});

const prev = () => { 
  current.value = (current.value - 1 + displayTestimonials.value.length) % displayTestimonials.value.length; 
};
const next = () => { 
  current.value = (current.value + 1) % displayTestimonials.value.length; 
};
</script>
