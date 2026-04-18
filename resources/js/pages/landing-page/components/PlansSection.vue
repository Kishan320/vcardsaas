<template>
  <section id="plans" class="py-20 bg-gray-50">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span class="text-sm font-semibold text-primary-600 uppercase tracking-wider">Pricing</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Simple, Transparent Pricing</h2>
        <p class="text-gray-500 mt-3 max-w-xl mx-auto">Start free, upgrade when you're ready. No hidden fees, no surprises.</p>

        <div class="inline-flex items-center bg-gray-100 rounded-xl p-1 mt-6">
          <button @click="billing = 'monthly'"
            :class="`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${billing === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`">
            Monthly
          </button>
          <button @click="billing = 'yearly'"
            :class="`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${billing === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`">
            Yearly
            <span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Save 20%</span>
          </button>
        </div>
      </div>

      <div v-if="plans && plans.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div v-for="plan in plans" :key="plan.id"
          :class="`relative bg-white rounded-3xl p-8 border transition-all duration-200 card-hover ${plan.is_popular ? 'border-primary-300 shadow-card-hover ring-2 ring-primary-200' : 'border-gray-100 shadow-card'}`">
          <div v-if="plan.is_popular" class="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span class="bg-primary-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5">
              <Star :size="11" class="fill-white" /> Most Popular
            </span>
          </div>

          <div class="mb-6">
            <h3 class="text-xl font-bold text-gray-900 mb-1">{{ plan.name }}</h3>
            <p class="text-gray-500 text-sm">{{ plan.description || 'Perfect for growing professionals' }}</p>
          </div>

          <div class="mb-6">
            <div v-if="Number(billing === 'yearly' ? plan.yearly_price : plan.price) === 0" class="flex items-end gap-1">
              <span class="text-4xl font-extrabold text-gray-900">Free</span>
            </div>
            <div v-else class="flex items-end gap-1">
              <span class="text-4xl font-extrabold text-gray-900">${{ billing === 'yearly' ? plan.yearly_price : plan.price }}</span>
              <span class="text-gray-400 text-sm mb-1.5">/ {{ billing === 'yearly' ? 'year' : 'month' }}</span>
            </div>
          </div>

          <ul class="space-y-3 mb-8">
            <li v-for="(feature, i) in plan.features" :key="`${plan.id}-f-${i}`" class="flex items-start gap-2.5 text-sm text-gray-600">
              <CheckCircle2 :size="16" class="text-green-500 flex-shrink-0 mt-0.5" />
              {{ feature }}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-gray-600">
              <CheckCircle2 :size="16" class="text-green-500 flex-shrink-0 mt-0.5" />
              {{ plan.stats?.businesses }} vCard{{ plan.stats?.businesses !== 1 ? 's' : '' }}
            </li>
            <li v-if="plan.stats?.bio_links" class="flex items-start gap-2.5 text-sm text-gray-600">
              <CheckCircle2 :size="16" class="text-green-500 flex-shrink-0 mt-0.5" />
              {{ plan.stats.bio_links }} Bio Link{{ plan.stats.bio_links !== 1 ? 's' : '' }}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-gray-600">
              <CheckCircle2 :size="16" class="text-green-500 flex-shrink-0 mt-0.5" />
              {{ plan.stats?.storage }} Storage
            </li>
          </ul>

          <Link :href="route('register', { plan_id: plan.id })"
            :class="`block w-full py-3 rounded-xl text-sm font-bold text-center transition-all duration-150 active:scale-95 ${plan.is_popular ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md' : 'bg-primary-50 hover:bg-primary-600 text-primary-700 hover:text-white'}`">
            {{ Number(billing === 'yearly' ? plan.yearly_price : plan.price) === 0 ? 'Get Started Free' : 'Start Now' }}
          </Link>
        </div>
      </div>

      <!-- Fallback if no plans -->
      <div v-else class="text-center py-12 text-gray-400">
        <p class="text-sm">Pricing plans coming soon.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import { CheckCircle2, Star } from 'lucide-vue-next';

defineProps<{ plans?: any[] }>();

const billing = ref<'monthly' | 'yearly'>('monthly');
</script>
