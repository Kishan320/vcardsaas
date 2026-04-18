<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <a href="#" class="flex items-center">
          <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">{{ layout.header.config.logo }}</span>
        </a>
        <div class="flex items-center lg:order-2">
          <Button class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
            {{ layout.header.config.buttonText }}
          </Button>
        </div>
        <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
          <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li v-for="(item, index) in layout.header.config.menuItems" :key="index">
              <a href="#" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">{{ item }}</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-white dark:bg-gray-900">
      <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div class="mr-auto place-self-center lg:col-span-7">
          <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            {{ layout.hero.config.title }}
          </h1>
          <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            {{ layout.hero.config.description }}
          </p>
          <div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
              {{ layout.hero.config.primaryButton }}
            </Button>
            <Button variant="outline" class="text-gray-900 bg-transparent border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-transparent dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
              {{ layout.hero.config.secondaryButton }}
            </Button>
          </div>
        </div>
        <div class="lg:mt-0 lg:col-span-5 lg:flex">
          <img :src="layout.hero.config.image" alt="hero image" class="w-full" />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="max-w-screen-xl px-4 py-8 mx-auto lg:py-16">
        <div class="text-center mb-8">
          <h2 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {{ layout.features.config.title }}
          </h2>
          <p class="mb-8 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            {{ layout.features.config.description }}
          </p>
        </div>
        <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          <div v-for="(feature, index) in layout.features.config.items" :key="index" class="flex flex-col items-center text-center">
            <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
              <component :is="getIcon(feature.icon)" class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" />
            </div>
            <h3 class="mb-2 text-xl font-bold dark:text-white">{{ feature.title }}</h3>
            <p class="text-gray-500 dark:text-gray-400">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="bg-white dark:bg-gray-900">
      <div class="max-w-screen-xl px-4 py-8 mx-auto lg:py-16">
        <div class="text-center mb-8">
          <h2 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {{ layout.pricing.config.title }}
          </h2>
          <p class="mb-8 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            {{ layout.pricing.config.description }}
          </p>
        </div>
        <div class="space-y-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          <div v-for="(plan, index) in layout.pricing.config.plans" :key="index" class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 dark:bg-gray-800 dark:text-white">
            <h3 class="mb-4 text-2xl font-semibold">{{ plan.name }}</h3>
            <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">{{ plan.description }}</p>
            <div class="my-8">
              <span class="mr-2 text-5xl font-extrabold">{{ plan.price }}</span>
              <span class="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <ul role="list" class="mb-8 space-y-4 text-left">
              <li v-for="(feature, featureIndex) in plan.features" :key="featureIndex" class="flex items-center">
                <component :is="plan.featured ? 'CheckIcon' : 'MinusIcon'" class="w-5 h-5 text-green-500 mr-2" />
                <span>{{ feature }}</span>
              </li>
            </ul>
            <Button class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900">
              {{ plan.buttonText }}
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <footer class="bg-gray-800 text-white">
      <div class="max-w-screen-xl px-4 py-8 mx-auto lg:py-16">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <h3 class="mb-4 text-lg font-bold">{{ layout.footer.config.company }}</h3>
            <p class="text-gray-400">{{ layout.footer.config.description }}</p>
          </div>
          <div>
            <h3 class="mb-4 text-lg font-bold">Quick Links</h3>
            <ul class="space-y-2">
              <li v-for="(link, index) in layout.footer.config.links" :key="index">
                <a :href="link.url" class="text-gray-400 hover:text-white">{{ link.text }}</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="mb-4 text-lg font-bold">Contact</h3>
            <p class="text-gray-400">{{ layout.footer.config.email }}</p>
            <p class="text-gray-400">{{ layout.footer.config.phone }}</p>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>{{ layout.footer.config.copyright }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Layout, Grid3X3, MousePointer, Star, Zap, Shield, Navigation, 
  Users, Briefcase, MessageSquare, Mail, Image, Play, DollarSign, Minus, Check
} from 'lucide-vue-next';
import vCardLayout from '@/data/vcard-landing-layout.json';

const layout = ref(vCardLayout);

const iconMap: { [key: string]: any } = {
  Layout, Grid3X3, MousePointer, Star, Zap, Shield, Navigation, 
  Users, Briefcase, MessageSquare, Mail, Image, Play, DollarSign, Minus, Check
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Layout;
};
</script>

<style scoped>
.vcard-demo {
  /* Component styles are handled by Tailwind classes */
}
</style>
