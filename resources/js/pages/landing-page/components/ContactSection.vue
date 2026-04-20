<template>
  <section id="contact" class="py-20 bg-gray-50">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <span class="text-sm font-semibold text-primary-600 uppercase tracking-wider">{{ data?.badge || 'Get in Touch' }}</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">{{ data?.title || "We'd Love to Hear From You" }}</h2>
          <p class="text-gray-500 leading-relaxed mb-8">{{ data?.subtitle || data?.description || 'Have a question about our plans, need help getting started, or want to discuss enterprise options? Our team is here to help.' }}</p>

          <div class="space-y-4">
            <div v-for="item in displayContactInfo" :key="item.id" class="flex items-center gap-4">
              <div :class="`w-10 h-10 rounded-xl ${item.bg || 'bg-primary-50'} ${item.iconColor || 'text-primary-600'} flex items-center justify-center flex-shrink-0`" :style="item.bg ? {} : { backgroundColor: 'var(--secondary-color)', color: 'white' }">
                <component :is="item.icon" :size="18" />
              </div>
              <div>
                <p class="text-xs text-gray-400 font-medium">{{ item.label }}</p>
                <p class="text-sm font-semibold text-gray-900">{{ item.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-8 shadow-card border border-gray-100">
          <form @submit.prevent="submit">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input v-model="form.name" type="text" placeholder="John Doe" required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input v-model="form.email" type="email" placeholder="you@example.com" required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <input v-model="form.subject" type="text" placeholder="How can we help?" required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea v-model="form.message" rows="4" placeholder="Tell us more..." required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all resize-none" />
              </div>
              <div v-if="success" class="flex items-center gap-2 text-green-600 text-sm bg-green-50 rounded-xl px-4 py-3">
                <CheckCircle2 :size="16" /> Message sent! We'll get back to you soon.
              </div>
              <button type="submit" :disabled="loading"
                class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm transition-all duration-150 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                <Loader2 v-if="loading" :size="16" class="animate-spin" />
                {{ loading ? 'Sending…' : 'Send Message' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import { Mail, Phone, MapPin, CheckCircle2, Loader2 } from 'lucide-vue-next';

const props = defineProps<{ 
  settings?: any;
  data?: any;
}>();

const form = ref({ name: '', email: '', subject: '', message: '' });
const loading = ref(false);
const success = ref(false);

const displayContactInfo = computed(() => [
  { id: 'ci-email', icon: Mail, label: 'Email Us', value: props.data?.email || props.settings?.contact_email || 'hello@vcardsaas.com', bg: 'bg-primary-50', iconColor: 'text-primary-600' },
  { id: 'ci-phone', icon: Phone, label: 'Call Us', value: props.data?.phone || props.settings?.contact_phone || '+1 (888) 000-0000', bg: 'bg-green-50', iconColor: 'text-green-600' },
  { id: 'ci-address', icon: MapPin, label: 'Address', value: props.data?.address || props.settings?.contact_address || 'San Francisco, CA', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
]);

const submit = () => {
  loading.value = true;
  router.post(route('landing-page.contact'), form.value, {
    preserveScroll: true,
    onSuccess: () => { success.value = true; form.value = { name: '', email: '', subject: '', message: '' }; },
    onFinish: () => { loading.value = false; },
  });
};
</script>
