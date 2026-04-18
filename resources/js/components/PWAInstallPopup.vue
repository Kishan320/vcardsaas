<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-end sm:items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full max-w-sm mx-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 pb-4">
        <div class="flex items-center gap-3">
          <img v-if="appIcon" :src="appIcon" :alt="appName" class="w-12 h-12 rounded-2xl" />
          <div v-else class="w-12 h-12 rounded-2xl flex items-center justify-center" :style="{ backgroundColor: themeColors?.primary || '#3B82F6' }">
            <Smartphone class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white text-lg">
              Install PWA APP {{ appName }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Add to home screen
            </p>
          </div>
        </div>
        <button
          @click="onClose"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 pb-6">
        <div class="space-y-4">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">Why install?</h4>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Faster access from home screen
              </li>
              <li class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Works offline
              </li>
              <li class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                Native app experience
              </li>
            </ul>
          </div>

          <div class="flex gap-3">
            <button
              @click="onClose"
              class="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Not now
            </button>
            <button
              @click="onInstall"
              class="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Download class="w-4 h-4" />
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, Download, Smartphone } from 'lucide-vue-next';

interface PWAInstallPopupProps {
  isVisible: boolean;
  onInstall: () => void;
  onClose: () => void;
  appName: string;
  appIcon?: string;
  themeColors?: any;
}

defineProps<PWAInstallPopupProps>();
</script>

<style scoped>
.pwa-install-popup {
  /* Component styles are handled by Tailwind classes */
}
</style>
